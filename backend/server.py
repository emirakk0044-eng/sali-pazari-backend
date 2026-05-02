from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone, timedelta
from pathlib import Path
from dotenv import load_dotenv
import os
import uuid
import logging
from jose import jwt, JWTError
from passlib.context import CryptContext
import aiofiles

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# ── MongoDB ──────────────────────────────────────────────────────────────────
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# ── Config ───────────────────────────────────────────────────────────────────
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

JWT_SECRET = os.environ.get('JWT_SECRET', 'salipazari_jwt_secret')
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 24 * 7
ADMIN_PASSWORD_DEFAULT = os.environ.get('ADMIN_PASSWORD', 'SaliPazari2024!')
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Salı Pazarı AVM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# ── Auth ─────────────────────────────────────────────────────────────────────
def create_jwt(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Yetkisiz erişim")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Geçersiz veya süresi dolmuş token")

# ── Default Data ─────────────────────────────────────────────────────────────
DEFAULT_CATEGORIES = [
    {"id": "zuccaciye", "name": "Züccaciye", "icon": "Package"},
    {"id": "hirdavat", "name": "Hırdavat", "icon": "Wrench"},
    {"id": "ev-gerecleri", "name": "Ev Gereçleri", "icon": "Home"},
    {"id": "kirtasiye", "name": "Kırtasiye", "icon": "BookOpen"},
    {"id": "hediyelik", "name": "Hediyelik", "icon": "Gift"},
    {"id": "trend-urunler", "name": "Trend Ürünler", "icon": "TrendingUp"},
]

DEFAULT_SETTINGS = {
    "store_name": "İstanbul Salı Pazarı AVM",
    "slogan": "Züccaciye, Hırdavat, Ev Gereçleri, Kırtasiye, Hediyelik, Trend Ürünler Ve Daha Fazlası",
    "whatsapp_number": "905362834481",
    "instagram_handle": "@salipazarizmit",
    "instagram_url": "https://www.instagram.com/salipazarizmit",
    "address": "Karabaş, İstiklal Cd. No:164, 41040 İzmit/Kocaeli",
    "google_maps_url": "https://maps.google.com/?q=Karabaş+İstiklal+Cd.+No:164+41040+İzmit+Kocaeli+Turkey",
    "google_maps_embed_url": "https://maps.google.com/maps?q=Karabaş+İstiklal+Caddesi+No:164+41040+İzmit+Kocaeli+Turkey&output=embed&hl=tr&z=16",
    "hours": {
        "Pazartesi": "09:00 – 20:30",
        "Salı": "09:00 – 20:30",
        "Çarşamba": "09:00 – 20:30",
        "Perşembe": "09:00 – 20:30",
        "Cuma": "09:00 – 20:30",
        "Cumartesi": "09:00 – 20:30",
        "Pazar": "09:00 – 20:30",
    },
    "google_rating": 3.9,
    "review_count": 26,
}

# ── Helpers ───────────────────────────────────────────────────────────────────
def serialize(doc: dict) -> dict:
    doc.pop("_id", None)
    for k, v in list(doc.items()):
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
async def startup():
    settings = await db.settings.find_one({})
    if not settings:
        init = DEFAULT_SETTINGS.copy()
        # Truncate password to 72 bytes for bcrypt
        pwd_truncated = ADMIN_PASSWORD_DEFAULT[:72]
        init["admin_password_hash"] = pwd_context.hash(pwd_truncated)
        await db.settings.insert_one(init)
        logger.info("Settings initialized")
    else:
        if not settings.get("admin_password_hash"):
            pwd_truncated = ADMIN_PASSWORD_DEFAULT[:72]
            await db.settings.update_one(
                {}, {"$set": {"admin_password_hash": pwd_context.hash(pwd_truncated)}}
            )
    if await db.categories.count_documents({}) == 0:
        await db.categories.insert_many(DEFAULT_CATEGORIES)
        logger.info("Categories initialized")

# ── Routes ────────────────────────────────────────────────────────────────────
@api_router.get("/")
async def root():
    return {"message": "Salı Pazarı AVM API v1"}

# -- Admin Auth
@api_router.post("/admin/login")
async def admin_login(data: dict):
    password = data.get("password", "")
    settings = await db.settings.find_one({})
    if not settings or not pwd_context.verify(password, settings.get("admin_password_hash", "")):
        raise HTTPException(status_code=401, detail="Geçersiz şifre")
    token = create_jwt({"role": "admin", "sub": "admin"})
    return {"access_token": token, "token_type": "bearer"}

# -- Settings (public)
@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({}, {"_id": 0, "admin_password_hash": 0})
    return settings or {k: v for k, v in DEFAULT_SETTINGS.items()}

# -- Settings (admin)
@api_router.put("/settings")
async def update_settings(data: dict, admin=Depends(get_admin)):
    allowed = [
        "store_name", "slogan", "whatsapp_number", "instagram_handle",
        "instagram_url", "address", "google_maps_url", "google_maps_embed_url",
        "hours", "google_rating", "review_count"
    ]
    update = {k: data[k] for k in allowed if k in data}
    if "admin_password" in data and data["admin_password"]:
        update["admin_password_hash"] = pwd_context.hash(data["admin_password"])
    if update:
        await db.settings.update_one({}, {"$set": update}, upsert=True)
    settings = await db.settings.find_one({}, {"_id": 0, "admin_password_hash": 0})
    return settings

# -- Categories
@api_router.get("/categories")
async def get_categories():
    return await db.categories.find({}, {"_id": 0}).to_list(100)

# -- Products (public)
@api_router.get("/products")
async def get_products(category: Optional[str] = None):
    q = {}
    if category and category != "all":
        q["category"] = category
    products = await db.products.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [serialize(p) for p in products]

# -- File serving
@api_router.get("/uploads/{filename}")
async def serve_upload(filename: str):
    filepath = UPLOAD_DIR / filename
    if not filepath.exists() or not filepath.is_file():
        raise HTTPException(status_code=404, detail="Dosya bulunamadı")
    return FileResponse(str(filepath))

# -- Products CRUD (admin)
@api_router.post("/products")
async def create_product(
    name: str = Form(...),
    price: str = Form(...),
    category: str = Form(...),
    image: Optional[UploadFile] = File(None),
    admin=Depends(get_admin),
):
    image_url = None
    if image and image.filename:
        ext = Path(image.filename).suffix.lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
            raise HTTPException(400, "Geçersiz dosya türü. JPG, PNG, WEBP veya GIF yükleyin.")
        content = await image.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(400, "Dosya çok büyük (maks 10MB)")
        filename = f"{uuid.uuid4()}{ext}"
        async with aiofiles.open(UPLOAD_DIR / filename, 'wb') as f:
            await f.write(content)
        image_url = f"/api/uploads/{filename}"
    doc = {
        "id": str(uuid.uuid4()),
        "name": name,
        "price": price,
        "category": category,
        "image_url": image_url,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.products.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.put("/products/{pid}")
async def update_product(
    pid: str,
    name: str = Form(...),
    price: str = Form(...),
    category: str = Form(...),
    image: Optional[UploadFile] = File(None),
    admin=Depends(get_admin),
):
    existing = await db.products.find_one({"id": pid})
    if not existing:
        raise HTTPException(404, "Ürün bulunamadı")
    image_url = existing.get("image_url")
    if image and image.filename:
        ext = Path(image.filename).suffix.lower()
        if ext not in [".jpg", ".jpeg", ".png", ".webp", ".gif"]:
            raise HTTPException(400, "Geçersiz dosya türü")
        content = await image.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(400, "Dosya çok büyük (maks 10MB)")
        filename = f"{uuid.uuid4()}{ext}"
        async with aiofiles.open(UPLOAD_DIR / filename, 'wb') as f:
            await f.write(content)
        if existing.get("image_url"):
            old_file = UPLOAD_DIR / existing["image_url"].split("/")[-1]
            if old_file.exists():
                old_file.unlink()
        image_url = f"/api/uploads/{filename}"
    update = {
        "name": name, "price": price, "category": category,
        "image_url": image_url, "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.products.update_one({"id": pid}, {"$set": update})
    doc = await db.products.find_one({"id": pid}, {"_id": 0})
    return serialize(doc)

@api_router.delete("/products/{pid}")
async def delete_product(pid: str, admin=Depends(get_admin)):
    existing = await db.products.find_one({"id": pid})
    if not existing:
        raise HTTPException(404, "Ürün bulunamadı")
    if existing.get("image_url"):
        filepath = UPLOAD_DIR / existing["image_url"].split("/")[-1]
        if filepath.exists():
            filepath.unlink()
    await db.products.delete_one({"id": pid})
    return {"message": "Ürün silindi"}

# -- Messages
@api_router.post("/messages")
async def create_message(data: dict):
    doc = {
        "id": str(uuid.uuid4()),
        "name": data.get("name", ""),
        "phone": data.get("phone", ""),
        "email": data.get("email", ""),
        "subject": data.get("subject", ""),
        "message": data.get("message", ""),
        "read": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.messages.insert_one(doc)
    return {"id": doc["id"], "message": "Mesajınız alındı"}

@api_router.get("/admin/messages")
async def get_messages(admin=Depends(get_admin)):
    msgs = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [serialize(m) for m in msgs]

@api_router.put("/admin/messages/{mid}/read")
async def mark_read(mid: str, admin=Depends(get_admin)):
    result = await db.messages.update_one({"id": mid}, {"$set": {"read": True}})
    if result.matched_count == 0:
        raise HTTPException(404, "Mesaj bulunamadı")
    return {"message": "Okundu olarak işaretlendi"}

@api_router.delete("/admin/messages/{mid}")
async def delete_message(mid: str, admin=Depends(get_admin)):
    result = await db.messages.delete_one({"id": mid})
    if result.deleted_count == 0:
        raise HTTPException(404, "Mesaj bulunamadı")
    return {"message": "Mesaj silindi"}

# -- Admin Stats
@api_router.get("/admin/stats")
async def get_stats(admin=Depends(get_admin)):
    product_count = await db.products.count_documents({})
    message_count = await db.messages.count_documents({})
    unread_count = await db.messages.count_documents({"read": False})
    recent_products = await db.products.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    recent_messages = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).limit(5).to_list(5)
    return {
        "product_count": product_count,
        "message_count": message_count,
        "unread_count": unread_count,
        "recent_products": [serialize(p) for p in recent_products],
        "recent_messages": [serialize(m) for m in recent_messages],
    }

# ── Register ─────────────────────────────────────────────────────────────────
app.include_router(api_router)


@app.on_event("startup")
async def startup_db_client():
    global client
    try:
        mongo_url = os.environ.get('MONGO_URL')
        if not mongo_url:
            logger.error("MONGO_URL not found in environment variables")
            return
        client = AsyncIOMotorClient(mongo_url)
        # Test connection
        await client.admin.command('ping')
        logger.info("MongoDB connected successfully")
    except Exception as e:
        logger.error(f"MongoDB connection failed: {e}")
        client = None

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
