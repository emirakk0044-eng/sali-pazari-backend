import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MessageSquare, Eye, Trash2, Check, Phone, Mail, Clock, User } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const token = () => localStorage.getItem('admin_token');
  const authHeader = () => ({ Authorization: `Bearer ${token()}` });

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/messages`, { headers: authHeader() });
      setMessages(res.data);
    } catch (e) {
      if (e.response?.status === 401) { localStorage.removeItem('admin_token'); window.location.href = '/admin/login'; }
    } finally { setLoading(false); }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`${API}/admin/messages/${id}/read`, {}, { headers: authHeader() });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
      if (selected?.id === id) setSelected({ ...selected, read: true });
    } catch (e) { toast.error('Hata oluştu.'); }
  };

  const deleteMsg = async (id) => {
    try {
      await axios.delete(`${API}/admin/messages/${id}`, { headers: authHeader() });
      toast.success('Mesaj silindi.');
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (e) { toast.error('Hata oluştu.'); }
  };

  const fmtDate = (iso) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const unread = messages.filter(m => !m.read).length;

  return (
    <div data-testid="admin-messages-page">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Mesajlar</h1>
          {unread > 0 && (
            <span style={{ background: '#1d9e75', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>{unread} yeni</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{messages.length} toplam mesaj</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 400px' : '1fr', gap: 20 }} className="msg-grid">
        {/* Message List */}
        <div data-testid="admin-messages-list" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
              <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#1d9e75', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : messages.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              <MessageSquare size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>Henüz mesaj yok.</p>
            </div>
          ) : (
            <div>
              {messages.map(m => (
                <div key={m.id} data-testid="admin-message-row"
                  onClick={() => { setSelected(m); if (!m.read) markRead(m.id); }}
                  style={{
                    padding: '14px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                    background: selected?.id === m.id ? '#f0fdf8' : (m.read ? '#fff' : '#f8fafc'),
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => { if (selected?.id !== m.id) e.currentTarget.style.background='#f8fafc'; }}
                  onMouseLeave={e => { if (selected?.id !== m.id) e.currentTarget.style.background=m.read?'#fff':'#f8fafc'; }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.read ? '#e2e8f0' : '#1d9e75', flexShrink: 0, marginTop: 5 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: m.read ? 500 : 700, color: '#1e293b' }}>{m.name}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: 8 }}>{fmtDate(m.created_at)}</span>
                      </div>
                      {m.subject && <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginTop: 1 }}>{m.subject}</div>}
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div data-testid="admin-message-detail" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 16, fontWeight: 700 }}>Mesaj Detayı</h3>
              <button onClick={() => setSelected(null)} style={{ color: '#94a3b8', padding: 4, borderRadius: 6 }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {[[
                <User size={14} />, 'Gönderen', selected.name
              ], selected.phone ? [
                <Phone size={14} />, 'Telefon', selected.phone
              ] : null, selected.email ? [
                <Mail size={14} />, 'E-posta', selected.email
              ] : null, [
                <Clock size={14} />, 'Tarih', fmtDate(selected.created_at)
              ]].filter(Boolean).map(([icon, label, val], i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#94a3b8', marginTop: 1, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                    <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 500 }}>{val}</div>
                  </div>
                </div>
              ))}
            </div>
            {selected.subject && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>Konu</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{selected.subject}</div>
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8 }}>Mesaj</div>
              <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.65, background: '#f8fafc', borderRadius: 10, padding: '12px 14px', border: '1px solid #e2e8f0' }}>{selected.message}</div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {!selected.read && (
                <button data-testid="admin-message-mark-read-button" onClick={() => markRead(selected.id)} style={{ flex: 1, padding: '9px', borderRadius: 10, background: '#e8f7f2', color: '#1d9e75', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Check size={13} /> Okundu
                </button>
              )}
              <button onClick={() => deleteMsg(selected.id)} style={{ flex: 1, padding: '9px', borderRadius: 10, background: '#fff1f2', color: '#e11d48', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, border: '1px solid #fecdd3' }}>
                <Trash2 size={13} /> Sil
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}} @media(max-width:900px){.msg-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}
