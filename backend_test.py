import requests
import sys
import json
from datetime import datetime

class SaliPazariAPITester:
    def __init__(self, base_url="https://doc-preview-17.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json() if response.content else {}
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test API root endpoint"""
        success, response = self.run_test("API Root", "GET", "", 200)
        return success

    def test_admin_login(self, password="SaliPazari2024!"):
        """Test admin login and get token"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "admin/login",
            200,
            data={"password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        success, response = self.run_test(
            "Admin Login (Wrong Password)",
            "POST",
            "admin/login",
            401,
            data={"password": "wrongpassword"}
        )
        return success

    def test_get_settings(self):
        """Test getting public settings"""
        success, response = self.run_test("Get Settings", "GET", "settings", 200)
        if success:
            required_fields = ['store_name', 'whatsapp_number', 'hours']
            for field in required_fields:
                if field not in response:
                    print(f"   Warning: Missing field '{field}' in settings")
        return success

    def test_get_categories(self):
        """Test getting categories"""
        success, response = self.run_test("Get Categories", "GET", "categories", 200)
        if success:
            if len(response) >= 6:
                print(f"   Found {len(response)} categories")
                category_names = [cat.get('name', '') for cat in response]
                expected_categories = ['Züccaciye', 'Hırdavat', 'Ev Gereçleri', 'Kırtasiye', 'Hediyelik', 'Trend Ürünler']
                for expected in expected_categories:
                    if expected not in category_names:
                        print(f"   Warning: Missing expected category '{expected}'")
            else:
                print(f"   Warning: Expected at least 6 categories, found {len(response)}")
        return success

    def test_get_products(self):
        """Test getting products"""
        success, response = self.run_test("Get Products", "GET", "products", 200)
        if success:
            print(f"   Found {len(response)} products")
        return success

    def test_get_products_by_category(self):
        """Test getting products by category"""
        success, response = self.run_test("Get Products by Category", "GET", "products?category=Züccaciye", 200)
        return success

    def test_create_message(self):
        """Test creating a contact message"""
        test_message = {
            "name": "Test User",
            "phone": "+90 555 123 4567",
            "email": "test@example.com",
            "subject": "Test Message",
            "message": "This is a test message from automated testing."
        }
        success, response = self.run_test(
            "Create Message",
            "POST",
            "messages",
            200,
            data=test_message
        )
        return success

    def test_admin_stats(self):
        """Test admin stats endpoint (requires auth)"""
        if not self.token:
            print("❌ No admin token available for stats test")
            return False
        
        success, response = self.run_test("Admin Stats", "GET", "admin/stats", 200)
        if success:
            required_fields = ['product_count', 'message_count', 'unread_count']
            for field in required_fields:
                if field not in response:
                    print(f"   Warning: Missing field '{field}' in stats")
                else:
                    print(f"   {field}: {response[field]}")
        return success

    def test_admin_messages(self):
        """Test admin messages endpoint (requires auth)"""
        if not self.token:
            print("❌ No admin token available for messages test")
            return False
        
        success, response = self.run_test("Admin Messages", "GET", "admin/messages", 200)
        if success:
            print(f"   Found {len(response)} messages")
        return success

    def test_create_product(self):
        """Test creating a product (requires auth)"""
        if not self.token:
            print("❌ No admin token available for product creation test")
            return False

        # Use form data for product creation
        url = f"{self.base_url}/products"
        headers = {'Authorization': f'Bearer {self.token}'}
        
        form_data = {
            'name': 'Test Ürün',
            'price': '₺99,90',
            'category': 'Züccaciye'
        }
        
        self.tests_run += 1
        print(f"\n🔍 Testing Create Product...")
        
        try:
            response = requests.post(url, data=form_data, headers=headers, timeout=10)
            success = response.status_code == 200
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    product_data = response.json()
                    self.created_product_id = product_data.get('id')
                    print(f"   Created product ID: {self.created_product_id}")
                    return True
                except:
                    return True
            else:
                print(f"❌ Failed - Expected 200, got {response.status_code}")
                print(f"   Response: {response.text[:200]}")
                self.failed_tests.append(f"Create Product: Expected 200, got {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"Create Product: {str(e)}")
            return False

    def test_update_settings(self):
        """Test updating settings (requires auth)"""
        if not self.token:
            print("❌ No admin token available for settings update test")
            return False

        test_settings = {
            "whatsapp_number": "905362834481",
            "store_name": "İstanbul Salı Pazarı AVM Test"
        }
        success, response = self.run_test(
            "Update Settings",
            "PUT",
            "settings",
            200,
            data=test_settings
        )
        return success

def main():
    print("🚀 Starting Salı Pazarı AVM API Tests")
    print("=" * 50)
    
    tester = SaliPazariAPITester()
    
    # Test sequence
    tests = [
        ("API Root", tester.test_root_endpoint),
        ("Admin Login (Wrong Password)", tester.test_admin_login_wrong_password),
        ("Admin Login", tester.test_admin_login),
        ("Get Settings", tester.test_get_settings),
        ("Get Categories", tester.test_get_categories),
        ("Get Products", tester.test_get_products),
        ("Get Products by Category", tester.test_get_products_by_category),
        ("Create Message", tester.test_create_message),
        ("Admin Stats", tester.test_admin_stats),
        ("Admin Messages", tester.test_admin_messages),
        ("Create Product", tester.test_create_product),
        ("Update Settings", tester.test_update_settings),
    ]
    
    for test_name, test_func in tests:
        try:
            test_func()
        except Exception as e:
            print(f"❌ Test '{test_name}' crashed: {str(e)}")
            tester.failed_tests.append(f"{test_name}: Crashed - {str(e)}")
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   • {failure}")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("✅ Backend API tests mostly successful!")
        return 0
    else:
        print("❌ Backend API has significant issues!")
        return 1

if __name__ == "__main__":
    sys.exit(main())