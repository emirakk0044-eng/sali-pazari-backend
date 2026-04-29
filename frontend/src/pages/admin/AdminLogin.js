import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShoppingBag, Lock, Eye, EyeOff } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) { setError('Lütfen şifrenizi girin.'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, { password });
      localStorage.setItem('admin_token', res.data.access_token);
      toast.success('Giriş başarılı!');
      navigate('/admin/dashboard');
    } catch (e) {
      const msg = e.response?.data?.detail || 'Giriş başarısız. Şifreyi kontrol edin.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login-page" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fdf8 0%, #f8fafc 50%, #f0f9ff 100%)',
      fontFamily: "'Inter', sans-serif", padding: '20px'
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--brand,#1d9e75)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <ShoppingBag size={26} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Yönetim Girişi</h1>
          <p style={{ fontSize: 14, color: '#64748b' }}>Ürünleri ve mesajları yönetmek için giriş yapın</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', boxShadow: '0 8px 40px rgba(0,0,0,0.10)', border: '1px solid #e2e8f0' }}>
          {error && (
            <div data-testid="admin-login-error-message" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 20 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span style={{ fontSize: 13, color: '#dc2626' }}>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Şifre</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><Lock size={16} color="#94a3b8" /></div>
                <input
                  data-testid="admin-login-password-input"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Şifrenizi girin"
                  style={{ width: '100%', padding: '12px 44px', borderRadius: 12, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', transition: 'border-color 0.2s', background: '#f8fafc' }}
                  onFocus={e => e.target.style.borderColor='#1d9e75'}
                  onBlur={e => e.target.style.borderColor='#e2e8f0'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', padding: 4 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              data-testid="admin-login-submit-button"
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '13px', borderRadius: 12, background: loading ? '#94a3b8' : '#1d9e75', color: '#fff', fontWeight: 600, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background='#16825f'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background='#1d9e75'; }}
            >
              {loading ? (
                <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : <Lock size={15} />}
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#94a3b8' }}>
          <a href="/" style={{ color: '#64748b', textDecoration: 'none' }}>← Siteye Dön</a>
        </p>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
