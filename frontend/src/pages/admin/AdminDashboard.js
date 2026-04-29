import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, MessageSquare, TrendingUp, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BACKEND = process.env.REACT_APP_BACKEND_URL;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await axios.get(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setStats(res.data);
    } catch (e) {
      if (e.response?.status === 401) { localStorage.removeItem('admin_token'); window.location.href = '/admin/login'; }
    } finally { setLoading(false); }
  };

  const fmtDate = (iso) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
      <div style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#1d9e75', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: '#64748b' }}>Genel bakış – {new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      <div data-testid="admin-kpi-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[{
          label: 'Toplam Ürün', val: stats?.product_count ?? 0, icon: Package, color: '#1d9e75', bg: '#e8f7f2', tid: 'admin-kpi-products'
        },{
          label: 'Toplam Mesaj', val: stats?.message_count ?? 0, icon: MessageSquare, color: '#0369a1', bg: '#f0f9ff', tid: ''
        },{
          label: 'Okunmamış Mesaj', val: stats?.unread_count ?? 0, icon: TrendingUp, color: '#d97706', bg: '#fef3c7', tid: 'admin-kpi-unread-messages'
        }].map(({ label, val, icon: Icon, color, bg, tid }) => (
          <div key={label} data-testid={tid || undefined} style={{
            background: '#fff', borderRadius: 16, padding: '20px 22px', border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 16
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 28, fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>{val}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{label}</div>
            </div>
          </div>
        ))}
        <button onClick={() => navigate('/admin/products')} style={{
          background: '#1d9e75', borderRadius: 16, padding: '20px 22px', border: 'none',
          boxShadow: '0 4px 16px rgba(29,158,117,0.25)', display: 'flex', alignItems: 'center', gap: 16,
          cursor: 'pointer', transition: 'background 0.2s, transform 0.2s', color: '#fff'
        }}
          onMouseEnter={e => { e.currentTarget.style.background='#16825f'; e.currentTarget.style.transform='translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='#1d9e75'; e.currentTarget.style.transform='none'; }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={22} color="#fff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700 }}>Ürün Ekle</div>
            <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>Yeni ürün ekle</div>
          </div>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="dash-grid">
        {/* Recent Products */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700 }}>Son Ürünler</h3>
            <button onClick={() => navigate('/admin/products')} style={{ fontSize: 12, color: '#1d9e75', fontWeight: 600 }}>Tümünü Gör →</button>
          </div>
          {(stats?.recent_products?.length ?? 0) === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Henüz ürün eklenmemiş.</div>
          ) : (
            <div>
              {stats.recent_products.map(p => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                    {p.image_url ? <img src={`${BACKEND}${p.image_url}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} /> : <Package size={18} color="#94a3b8" style={{ margin: '11px auto', display: 'block' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{p.category}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1d9e75', whiteSpace: 'nowrap' }}>{p.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 15, fontWeight: 700 }}>Son Mesajlar</h3>
            <button onClick={() => navigate('/admin/messages')} style={{ fontSize: 12, color: '#1d9e75', fontWeight: 600 }}>Tümünü Gör →</button>
          </div>
          {(stats?.recent_messages?.length ?? 0) === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Henüz mesaj yok.</div>
          ) : (
            <div>
              {stats.recent_messages.map(m => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #f8fafc' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.read ? '#e2e8f0' : '#1d9e75', flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: m.read ? 500 : 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.subject || m.message?.slice(0,40)}</div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap' }}>{fmtDate(m.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:768px){.dash-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
