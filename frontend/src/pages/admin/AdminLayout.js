import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, MessageSquare, Settings, LogOut, ShoppingBag, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', tid: 'admin-nav-dashboard' },
  { to: '/admin/products', icon: Package, label: 'Ürünler', tid: 'admin-nav-products' },
  { to: '/admin/messages', icon: MessageSquare, label: 'Mesajlar', tid: 'admin-nav-messages' },
  { to: '/admin/settings', icon: Settings, label: 'Ayarlar', tid: 'admin-nav-settings' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <>
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#1d9e75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={18} color="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>Salı Pazarı</div>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 500 }}>Yönetim Paneli</div>
          </div>
        </div>
      </div>
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {NAV_ITEMS.map(({ to, icon: Icon, label, tid }) => (
          <NavLink key={to} to={to} data-testid={tid}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
              marginBottom: 2, fontSize: 14, fontWeight: 500, textDecoration: 'none',
              background: isActive ? '#1e293b' : 'transparent',
              color: isActive ? '#fff' : '#94a3b8',
              transition: 'background 0.2s, color 0.2s'
            })}
            onMouseEnter={e => { const el = e.currentTarget; if (!el.dataset.active) { el.style.background='#1e293b'; el.style.color='#cbd5e1'; }}}
            onMouseLeave={e => { const el = e.currentTarget; if (!el.dataset.active) { el.style.background='transparent'; el.style.color='#94a3b8'; }}}
          >
            {({ isActive }) => (
              <>
                <Icon size={17} color={isActive ? '#1d9e75' : 'inherit'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '12px', borderTop: '1px solid #1e293b' }}>
        <button data-testid="admin-logout-button" onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 10, color: '#94a3b8', fontSize: 14, fontWeight: 500, transition: 'background 0.2s, color 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.background='#1e293b'; e.currentTarget.style.color='#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#94a3b8'; }}>
          <LogOut size={17} /> Çıkış Yap
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif", background: '#f8fafc' }}>
      {/* Desktop Sidebar */}
      <aside data-testid="admin-sidebar" style={{
        width: 220, background: '#0f172a', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 40,
        boxShadow: '2px 0 12px rgba(0,0,0,0.15)'
      }} className="admin-sidebar">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ width: 220, background: '#0f172a', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 51 }}>
            <div style={{ padding: '16px 16px 0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSidebarOpen(false)} style={{ color: '#94a3b8', padding: 4 }}><X size={20} /></button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div style={{ marginLeft: 220, flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="admin-main">
        {/* Top bar */}
        <div style={{ height: 56, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 12, position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)} className="sidebar-toggle" style={{ display: 'none', color: '#64748b', padding: 4 }}><Menu size={20} /></button>
          <div style={{ flex: 1 }} />
          <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='#1d9e75'} onMouseLeave={e => e.currentTarget.style.borderColor='#e2e8f0'}>
            <ShoppingBag size={13} /> Siteyi Gör
          </a>
          <button onClick={logout} style={{ fontSize: 13, color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0', transition: 'border-color 0.2s, color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#ef4444'; e.currentTarget.style.color='#ef4444'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#64748b'; }}>
            <LogOut size={13} /> Çıkış
          </button>
        </div>
        <main style={{ flex: 1, padding: '28px 28px' }}>
          <Outlet />
        </main>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-main { margin-left: 0 !important; }
          .sidebar-toggle { display: flex !important; }
        }
        @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
