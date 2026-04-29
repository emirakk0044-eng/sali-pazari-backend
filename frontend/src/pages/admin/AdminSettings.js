import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminSettings() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [saved, setSaved] = useState(false);

  const token = () => localStorage.getItem('admin_token');
  const authHeader = () => ({ Authorization: `Bearer ${token()}` });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/settings`);
      setForm(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = { ...form };
      if (newPassword.trim()) data.admin_password = newPassword;
      await axios.put(`${API}/settings`, data, { headers: authHeader() });
      toast.success('Ayarlar kaydedildi!');
      setSaved(true);
      setNewPassword('');
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      if (e.response?.status === 401) { localStorage.removeItem('admin_token'); window.location.href = '/admin/login'; }
      toast.error('Kaydetme başarısız.');
    } finally { setSaving(false); }
  };

  const setHours = (day, val) => setForm(f => ({ ...f, hours: { ...f.hours, [day]: val } }));

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
      <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#1d9e75', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div data-testid="admin-settings-page">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Ayarlar</h1>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Mağaza bilgilerini ve güvenlik ayarlarını güncelleyin</p>
      </div>

      {saved && (
        <div data-testid="admin-settings-success-message" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: 12, padding: '12px 18px', marginBottom: 20 }}>
          <CheckCircle size={16} color="#059669" />
          <span style={{ fontSize: 13, color: '#065f46', fontWeight: 600 }}>Ayarlar başarıyla kaydedildi!</span>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="settings-grid">

          {/* Store Info */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0', gridColumn: '1 / -1' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Mağaza Bilgileri</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="inner-grid">
              <div>
                <label style={labelStyle}>Mağaza Adı</label>
                <input data-testid="admin-settings-store-name-input" type="text" value={form?.store_name || ''} onChange={e => setForm({...form, store_name: e.target.value})}
                  style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Adres</label>
                <input type="text" value={form?.address || ''} onChange={e => setForm({...form, address: e.target.value})}
                  style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Slogan</label>
                <input type="text" value={form?.slogan || ''} onChange={e => setForm({...form, slogan: e.target.value})}
                  style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 20 }}>İletişim</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>WhatsApp Numarası (905xxxxxxxxx)</label>
                <input data-testid="admin-settings-whatsapp-input" type="text" value={form?.whatsapp_number || ''} onChange={e => setForm({...form, whatsapp_number: e.target.value})}
                  placeholder="905362834481" style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Başında + olmadan, ülke kodu ile yazın. Ör: 905362834481</p>
              </div>
              <div>
                <label style={labelStyle}>Instagram Kullanıcı Adı</label>
                <input type="text" value={form?.instagram_handle || ''} onChange={e => setForm({...form, instagram_handle: e.target.value})}
                  placeholder="@salipazarizmit" style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Instagram URL</label>
                <input type="text" value={form?.instagram_url || ''} onChange={e => setForm({...form, instagram_url: e.target.value})}
                  style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
            </div>
          </div>

          {/* Map */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Google Maps</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Google Maps Linki</label>
                <input type="text" value={form?.google_maps_url || ''} onChange={e => setForm({...form, google_maps_url: e.target.value})}
                  style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
              <div>
                <label style={labelStyle}>Harita Embed URL</label>
                <input type="text" value={form?.google_maps_embed_url || ''} onChange={e => setForm({...form, google_maps_embed_url: e.target.value})}
                  placeholder="https://maps.google.com/maps?q=...&output=embed" style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Google Puanı</label>
                  <input type="number" step="0.1" min="1" max="5" value={form?.google_rating || ''} onChange={e => setForm({...form, google_rating: parseFloat(e.target.value)})}
                    style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                </div>
                <div>
                  <label style={labelStyle}>Yorum Sayısı</label>
                  <input type="number" value={form?.review_count || ''} onChange={e => setForm({...form, review_count: parseInt(e.target.value)})}
                    style={inputStyle} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                </div>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Çalışma Saatleri</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {form?.hours && Object.entries(form.hours).map(([day, hrs]) => (
                <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 90, fontSize: 13, fontWeight: 500, color: '#475569', flexShrink: 0 }}>{day}</span>
                  <input data-testid="admin-settings-hours-input" type="text" value={hrs} onChange={e => setHours(day, e.target.value)}
                    style={{ flex: 1, padding: '7px 12px', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }}
                    onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Güvenlik</h3>
            <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>Yönetim panelinizin şifresini değiştirin</p>
            <div>
              <label style={labelStyle}>Yeni Şifre</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  placeholder="Boş bırakırsanız değişmez"
                  style={{ ...inputStyle, paddingRight: 44 }} onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>En az 6 karakter olmalıdır.</p>
            </div>
          </div>

        </div>

        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          <button data-testid="admin-settings-save-button" type="submit" disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 12, background: saving ? '#94a3b8' : '#1d9e75', color: '#fff', fontWeight: 600, fontSize: 15, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 2px 10px rgba(29,158,117,0.3)', transition: 'background 0.2s' }}
            onMouseEnter={e => { if (!saving) e.currentTarget.style.background='#16825f'; }}
            onMouseLeave={e => { if (!saving) e.currentTarget.style.background='#1d9e75'; }}>
            {saving ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <Save size={15} />}
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </button>
        </div>
      </form>
      <style>{`
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
        @media(max-width:768px) { .settings-grid{grid-template-columns:1fr!important;} .inner-grid{grid-template-columns:1fr!important;} }
      `}</style>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' };
const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', background: '#fff', transition: 'border-color 0.2s' };
