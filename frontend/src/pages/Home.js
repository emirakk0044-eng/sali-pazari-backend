import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  MapPin, Clock, Menu, X, Phone, MessageCircle,
  Star, Package, Wrench, Home as HomeIcon, BookOpen, Gift,
  TrendingUp, ShoppingBag, ExternalLink, Send, ChevronDown,
  Mail, AlertCircle, CheckCircle
} from 'lucide-react';

const InstagramIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const REVIEWS = [
  {
    id: 1, name: 'Serra', initials: 'S', rating: 1,
    text: '"İade sürecinde ciddi sıkıntılar yaşadım. Ürünü geri götürdüğümde mağaza yönetimi hiç ilgilenmedi. Bu konuda kesinlikle memnun kalmadım."',
    bg: 'linear-gradient(135deg, #e91e8c 0%, #c0392b 100%)'
  },
  {
    id: 2, name: 'Erkan Gündüz', initials: 'EG', rating: 5,
    text: '"Fiyatlar son derece uygun ve personel oldukça bilgili. Her sorunuma anında çözüm buldular. Kesinlikle tavsiye ederim!"',
    bg: 'linear-gradient(135deg, #1d9e75 0%, #0f5f45 100%)'
  },
  {
    id: 3, name: 'Serdar Alijanov', initials: 'SA', rating: 5,
    text: '"Mükemmel hizmet! Ürün çeşitliliği harika, fiyatlar piyasanın çok altında. Her zaman buradan alışveriş yapıyorum."',
    bg: 'linear-gradient(135deg, #4a6fa5 0%, #1a2a5e 100%)'
  },
];

const ICON_MAP = { Package, Wrench, Home: HomeIcon, BookOpen, Gift, TrendingUp };

const CATEGORY_COLORS = [
  { bg: '#e8f7f2', color: '#1d9e75', border: '#a7e9cf' },
  { bg: '#fef3c7', color: '#d97706', border: '#fde68a' },
  { bg: '#ede9fe', color: '#7c3aed', border: '#c4b5fd' },
  { bg: '#fff1f2', color: '#e11d48', border: '#fecdd3' },
  { bg: '#ecfdf5', color: '#059669', border: '#6ee7b7' },
  { bg: '#f0f9ff', color: '#0369a1', border: '#bae6fd' },
];

function StarRow({ rating, size = 14 }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={size} fill={i <= rating ? '#f59e0b' : 'none'}
          stroke={i <= rating ? '#f59e0b' : '#d1d5db'} strokeWidth={1.5} />
      ))}
    </div>
  );
}

const DAY_NAMES = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export default function Home() {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [productsLoading, setProductsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchCategories();
    fetchProducts('all');
    const onScroll = () => setHeaderScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { fetchProducts(activeCategory); }, [activeCategory]);

  const fetchSettings = async () => {
    try { const r = await axios.get(`${API}/settings`); setSettings(r.data); }
    catch (e) { console.error('Settings error:', e); }
  };
  const fetchCategories = async () => {
    try { const r = await axios.get(`${API}/categories`); setCategories(r.data); }
    catch (e) { console.error('Categories error:', e); }
  };
  const fetchProducts = async (cat) => {
    setProductsLoading(true);
    try {
      const params = cat && cat !== 'all' ? { category: cat } : {};
      const r = await axios.get(`${API}/products`, { params });
      setProducts(r.data);
    } catch (e) { console.error('Products error:', e); }
    finally { setProductsLoading(false); }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error('Ad ve mesaj alanları zorunludur.');
      return;
    }
    setFormLoading(true);
    try {
      await axios.post(`${API}/messages`, formData);
      setFormSubmitted(true);
      if (settings?.whatsapp_number) {
        const msg = `Merhaba! Salı Pazarı AVM web sitesinden mesaj gönderiyorum.\nAd: ${formData.name}\nKonu: ${formData.subject || 'Genel'}\nMesaj: ${formData.message}`;
        window.open(`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(msg)}`, '_blank');
      }
      toast.success('Mesajınız iletildi!');
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
      setTimeout(() => setFormSubmitted(false), 6000);
    } catch (e) { toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.'); }
    finally { setFormLoading(false); }
  };

  const waHref = settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number}` : '#';
  const today = DAY_NAMES[new Date().getDay()];
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const open = mins >= 9 * 60 && mins < 20 * 60 + 30;
  const imgUrl = (url) => url ? `${BACKEND}${url}` : 'https://images.pexels.com/photos/1084101/pexels-photo-1084101.jpeg?auto=compress&cs=tinysrgb&w=400';

  const s = settings;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#fff', color: '#0f172a', minHeight: '100vh' }}>

      {/* ======= HEADER ======= */}
      <header data-testid="public-header" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: headerScrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: headerScrolled ? '1px solid #e2e8f0' : '1px solid transparent',
        transition: 'border-color 0.3s, background 0.3s',
        boxShadow: headerScrolled ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <a href="#anasayfa" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15, color: '#0f172a', lineHeight: 1.1 }}>Salı Pazarı</div>
              <div style={{ fontSize: 10, color: 'var(--brand)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AVM</div>
            </div>
          </a>
          <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }} className="desktop-nav">
            {[['#kategoriler','Kategoriler','public-nav-categories-link'],['#urunler','Ürünler','public-nav-products-link'],['#harita','Konum','public-nav-map-link'],['#yorumlar','Yorumlar','public-nav-reviews-link'],['#iletisim','İletişim','public-nav-contact-link']].map(([href,label,tid]) => (
              <a key={href} href={href} data-testid={tid} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13.5, fontWeight: 500, color: '#475569', transition: 'color 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.target.style.color='var(--brand)'; e.target.style.background='var(--brand-light)'; }}
                onMouseLeave={e => { e.target.style.color='#475569'; e.target.style.background='transparent'; }}>{label}</a>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href={waHref} target="_blank" rel="noopener noreferrer" data-testid="public-header-whatsapp-button" style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10,
              background: 'var(--brand)', color: '#fff', fontWeight: 600, fontSize: 13,
              transition: 'background 0.2s, transform 0.2s', boxShadow: '0 2px 8px rgba(29,158,117,0.3)'
            }}
              onMouseEnter={e => { e.currentTarget.style.background='var(--brand-dark)'; e.currentTarget.style.transform='translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--brand)'; e.currentTarget.style.transform='none'; }}>
              <MessageCircle size={14} />
              <span className="wa-text">WhatsApp</span>
            </a>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn" style={{ display: 'none', padding: 8, borderRadius: 8, color: '#475569' }}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '12px 20px 16px' }}>
            {[['#kategoriler','Kategoriler'],['#urunler','Ürünler'],['#harita','Konum'],['#yorumlar','Yorumlar'],['#iletisim','İletişim']].map(([href,label]) => (
              <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'block', padding: '10px 0', color: '#334155', fontWeight: 500, fontSize: 15, borderBottom: '1px solid #f1f5f9' }}>{label}</a>
            ))}
          </div>
        )}
      </header>

      {/* ======= HERO ======= */}
      <section id="anasayfa" data-testid="hero-section" style={{ paddingTop: 64, minHeight: '92vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #f0fdf8 0%, #ffffff 50%, #f0f9ff 100%)' }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,158,117,0.10) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '2%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, rgba(255,255,255,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }} className="hero-grid">
          <div style={{ animation: 'fadeInUp 0.6s ease' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--brand-light)', color: 'var(--brand)', padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 20, border: '1px solid var(--brand-soft)' }}>
              <MapPin size={12} />
              Karabaş, İzmit / Kocaeli
            </div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: 16, color: '#0f172a' }}>
              {s?.store_name?.split(' ').slice(0, 2).join(' ')}<br />
              <span style={{ color: 'var(--brand)' }}>{s?.store_name?.split(' ').slice(2).join(' ') || 'AVM'}</span>
            </h1>
            <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              {s?.slogan || 'Züccaciye, Hırdavat, Ev Gereçleri, Kırtasiye, Hediyelik, Trend Ürünler Ve Daha Fazlası'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <a href="#urunler" data-testid="hero-primary-cta-button" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 12,
                background: 'var(--brand)', color: '#fff', fontWeight: 600, fontSize: 15,
                boxShadow: '0 4px 16px rgba(29,158,117,0.35)', transition: 'background 0.2s, transform 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background='var(--brand-dark)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='var(--brand)'; e.currentTarget.style.transform='none'; }}>
                <ShoppingBag size={16} /> Ürünleri Gör
              </a>
              <a href={waHref} target="_blank" rel="noopener noreferrer" data-testid="hero-secondary-cta-button" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '13px 24px', borderRadius: 12,
                border: '1.5px solid #e2e8f0', color: '#334155', fontWeight: 600, fontSize: 15,
                background: '#fff', transition: 'border-color 0.2s, transform 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--brand)'; e.currentTarget.style.color='var(--brand)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.color='#334155'; e.currentTarget.style.transform='none'; }}>
                <MessageCircle size={16} /> WhatsApp'tan Yaz
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="hero-stats">
              {[{
                val: `${s?.google_rating || 3.9} ★`, lbl: 'Google Puanı', tid: 'hero-stat-google-rating', color: '#f59e0b'
              },{
                val: s?.review_count || 26, lbl: 'Yorum', tid: 'hero-stat-review-count', color: 'var(--brand)'
              },{
                val: categories.length > 0 ? `${categories.length}+` : '6+', lbl: 'Kategori', tid: 'hero-stat-category-count', color: '#7c3aed'
              },{
                val: open ? 'Açık' : 'Kapalı', lbl: '09 – 20:30', tid: 'hero-stat-open-hours', color: open ? 'var(--brand)' : '#ef4444'
              }].map(({ val, lbl, tid, color }) => (
                <div key={tid} data-testid={tid} style={{
                  background: '#fff', borderRadius: 12, padding: '14px 10px', textAlign: 'center',
                  border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'Space Grotesk, sans-serif' }}>{val}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, fontWeight: 500 }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }} className="hero-image-wrap">
            <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.14)', aspectRatio: '4/3', position: 'relative' }}>
              <img src="https://images.pexels.com/photos/7314570/pexels-photo-7314570.jpeg?auto=compress&cs=tinysrgb&w=800" alt="AVM" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.20) 0%, transparent 50%)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -16, left: -16, background: '#fff', borderRadius: 16, padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} color="var(--brand)" />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Bugün</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>09:00 – 20:30</div>
              </div>
              <div style={{ background: open ? '#d1fae5' : '#fee2e2', color: open ? '#065f46' : '#991b1b', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
                {open ? 'Açık' : 'Kapalı'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= INFO BAR ======= */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px 20px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
          {[[
            <MapPin size={14} />, s?.address || 'Karabaş, İstiklal Cd. No:164, 41040 İzmit/Kocaeli', null
          ],[
            <Clock size={14} />, 'Her gün 09:00 – 20:30', null
          ],[
            <InstagramIcon size={14} />, s?.instagram_handle || '@salipazarizmit', s?.instagram_url || 'https://www.instagram.com/salipazarizmit'
          ]].map(([icon, text, link], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' }}>
              <span style={{ color: 'var(--brand)' }}>{icon}</span>
              {link ? <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: '#475569', fontWeight: 500 }}>{text}</a> : <span>{text}</span>}
              {i < 2 && <span style={{ color: '#e2e8f0', margin: '0 8px' }}>|</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ======= CATEGORIES ======= */}
      <section id="kategoriler" style={{ padding: '72px 20px 48px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: 10 }}>Kategoriler</h2>
            <p style={{ color: '#64748b', fontSize: 15 }}>İhtiyacınız olan her şeyi bir arada bulun</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }} className="categories-grid">
            {categories.map((cat, i) => {
              const IconComp = ICON_MAP[cat.icon] || Package;
              const colors = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
              const isActive = activeCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.id); document.getElementById('urunler')?.scrollIntoView({ behavior: 'smooth' }); }}
                  data-testid="category-tab-item"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    padding: '20px 16px', borderRadius: 16, border: isActive ? `2px solid ${colors.color}` : '1.5px solid #e2e8f0',
                    background: isActive ? colors.bg : '#fff', cursor: 'pointer', width: '100%',
                    boxShadow: isActive ? `0 4px 16px ${colors.color}22` : '0 1px 4px rgba(0,0,0,0.04)',
                    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s, transform 0.2s'
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 20px ${colors.color}18`; e.currentTarget.style.borderColor=colors.color; }}}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor='#e2e8f0'; }}}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: isActive ? colors.color : colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                    <IconComp size={22} color={isActive ? '#fff' : colors.color} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isActive ? colors.color : '#334155', textAlign: 'center' }}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======= PRODUCTS ======= */}
      <section id="urunler" style={{ padding: '48px 20px 72px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: 4 }}>Ürünlerimiz</h2>
              <p style={{ color: '#64748b', fontSize: 14 }}>Kategorilerimizden en beğenilen ürünleri keşfedin</p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', overflowX: 'auto' }} data-testid="category-tabs" className="scrollbar-hide">
              <button onClick={() => setActiveCategory('all')} data-testid="category-tab-all" style={{
                padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, border: '1.5px solid', whiteSpace: 'nowrap',
                background: activeCategory === 'all' ? 'var(--brand)' : '#fff',
                color: activeCategory === 'all' ? '#fff' : '#64748b',
                borderColor: activeCategory === 'all' ? 'var(--brand)' : '#e2e8f0',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>Tümü</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                  padding: '7px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, border: '1.5px solid', whiteSpace: 'nowrap',
                  background: activeCategory === cat.id ? 'var(--brand)' : '#fff',
                  color: activeCategory === cat.id ? '#fff' : '#64748b',
                  borderColor: activeCategory === cat.id ? 'var(--brand)' : '#e2e8f0',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>{cat.name}</button>
              ))}
            </div>
          </div>
          {productsLoading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--brand)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: '#94a3b8', fontSize: 14 }}>Ürünler yükleniyor...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#94a3b8' }}>
              <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>Bu kategoride ürün bulunamadı.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }} className="products-grid">
              {products.map(product => (
                <div key={product.id} data-testid="product-card" style={{
                  background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.10)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; }}>
                  <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: '#f8fafc', position: 'relative' }}>
                    <img data-testid="product-card-image" src={imgUrl(product.image_url)} alt={product.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => e.target.style.transform='scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform=''}
                      onError={e => { e.target.src='https://images.pexels.com/photos/1084101/pexels-photo-1084101.jpeg?auto=compress&cs=tinysrgb&w=400'; }} />
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.95)', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600, color: 'var(--brand)', border: '1px solid var(--brand-soft)' }}>{product.category}</div>
                  </div>
                  <div style={{ padding: '14px 14px 12px' }}>
                    <p data-testid="product-card-title" style={{ fontWeight: 600, fontSize: 14, color: '#1e293b', marginBottom: 6, lineHeight: 1.3 }}>{product.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span data-testid="product-card-price" style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand)', fontFamily: 'Space Grotesk, sans-serif' }}>{product.price}</span>
                      <a data-testid="product-card-whatsapp-button" href={`https://wa.me/${s?.whatsapp_number || '905362834481'}?text=${encodeURIComponent(`Merhaba! "${product.name}" ürünü hakkında bilgi almak istiyorum.`)}`}
                        target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                        style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 10px', borderRadius: 8, background: 'var(--brand-light)', color: 'var(--brand)', fontSize: 12, fontWeight: 600, transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--brand-soft)'}
                        onMouseLeave={e => e.currentTarget.style.background='var(--brand-light)'}>
                        <MessageCircle size={12} /> Sor
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ======= MAP & HOURS ======= */}
      <section id="harita" style={{ padding: '72px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: 10 }}>Bizi Ziyaret Edin</h2>
            <p style={{ color: '#64748b', fontSize: 15 }}>Mağazamızı haritada görün, kolayca ulaşın</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }} className="map-grid">
            <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.10)', border: '1px solid #e2e8f0' }}>
              <iframe
                src={s?.google_maps_embed_url || 'https://maps.google.com/maps?q=Karabaş+İstiklal+Caddesi+No:164+İzmit+Kocaeli+Turkey&output=embed&hl=tr&z=16'}
                width="100%" height="400" style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="Mağaza Konumu" />
            </div>
            <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '24px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <Clock size={16} color="var(--brand)" />
                <span style={{ fontWeight: 700, fontSize: 15 }}>Çalışma Saatleri</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {s?.hours && Object.entries(s.hours).map(([day, hrs]) => {
                  const isToday = day === today;
                  return (
                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9', background: isToday ? 'transparent' : 'transparent' }}>
                      <span style={{ fontSize: 13, fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--brand)' : '#475569' }}>
                        {isToday ? `${day} (Bugün)` : day}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--brand)' : '#64748b', background: isToday ? 'var(--brand-light)' : 'transparent', padding: isToday ? '2px 8px' : '0', borderRadius: 6 }}>{hrs}</span>
                    </div>
                  );
                })}
              </div>
              <a href={s?.google_maps_url || '#'} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, padding: '12px', borderRadius: 12, background: 'var(--brand)', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='var(--brand-dark)'}
                onMouseLeave={e => e.currentTarget.style.background='var(--brand)'}>
                <MapPin size={14} /> Google Maps'te Gör
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ======= REVIEWS ======= */}
      <section id="yorumlar" data-testid="reviews-section" style={{ padding: '72px 20px', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: 10 }}>Müşteri Yorumları</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, padding: '8px 18px', marginTop: 4 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{s?.google_rating || 3.9}</span>
              <StarRow rating={Math.round(s?.google_rating || 3.9)} size={13} />
              <span style={{ fontSize: 13, color: '#64748b' }}>{s?.review_count || 26} yorum</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {REVIEWS.map(r => (
              <div key={r.id} data-testid="review-card" style={{ background: '#fff', borderRadius: 16, padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 10px 28px rgba(0,0,0,0.09)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.05)'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{r.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{r.source}</div>
                  </div>
                </div>
                <StarRow rating={r.rating} />
                <p style={{ marginTop: 12, fontSize: 13.5, color: '#475569', lineHeight: 1.65 }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= CONTACT ======= */}
      <section id="iletisim" style={{ padding: '72px 20px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, marginBottom: 10 }}>Bize Ulaşın</h2>
            <p style={{ color: '#64748b', fontSize: 15 }}>Sorularınız ya da önerileriniz için aşağıdaki formu kullanabilirsiniz</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }} className="contact-grid">
            <div style={{ background: '#fff', borderRadius: 20, padding: '32px', border: '1.5px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Mesaj Gönder</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Form gönderildikten sonra ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
              {formSubmitted && (
                <div data-testid="contact-form-success-message" style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
                  <CheckCircle size={16} color="#059669" />
                  <span style={{ fontSize: 13, color: '#065f46', fontWeight: 500 }}>Mesajınız iletildi. En kısa sürede dönüş yapacağız!</span>
                </div>
              )}
              <form data-testid="contact-form" onSubmit={handleForm}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="form-row">
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ad Soyad *</label>
                    <input data-testid="contact-form-name-input" type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Adınız" required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor='var(--brand)'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Telefon</label>
                    <input data-testid="contact-form-phone-input" type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+90 5xx ..."
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor='var(--brand)'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>E-posta</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ornek@mail.com"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor='var(--brand)'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Konu</label>
                  <input type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="Soru, ürün talebi..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor='var(--brand)'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Mesaj *</label>
                  <textarea data-testid="contact-form-message-textarea" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} placeholder="Mesajınız..." required rows={4}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none', resize: 'vertical', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor='var(--brand)'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                </div>
                <button data-testid="contact-form-submit-button" type="submit" disabled={formLoading}
                  style={{ width: '100%', padding: '13px', borderRadius: 12, background: formLoading ? '#94a3b8' : 'var(--brand)', color: '#fff', fontWeight: 600, fontSize: 15, cursor: formLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.2s' }}
                  onMouseEnter={e => { if (!formLoading) e.currentTarget.style.background='var(--brand-dark)'; }}
                  onMouseLeave={e => { if (!formLoading) e.currentTarget.style.background='var(--brand)'; }}>
                  {formLoading ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : <Send size={16} />}
                  {formLoading ? 'Gönderiliyor...' : 'Gönder'}
                </button>
              </form>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[{
                icon: <MapPin size={18} />, title: 'Adres', val: s?.address || 'Karabaş, İstiklal Cd. No:164, 41040 İzmit/Kocaeli', link: null, bg: '#e8f7f2', color: 'var(--brand)'
              },{
                icon: <Clock size={18} />, title: 'Çalışma Saatleri', val: 'Her gün 09:00 – 20:30', link: null, bg: '#fef3c7', color: '#d97706'
              },{
                icon: <MessageCircle size={18} />, title: 'WhatsApp', val: s?.whatsapp_number ? `+${s.whatsapp_number}` : '+90 536 283 44 81', link: waHref, bg: '#d1fae5', color: '#059669'
              },{
                icon: <InstagramIcon size={18} />, title: 'Instagram', val: s?.instagram_handle || '@salipazarizmit', link: s?.instagram_url, bg: '#fce7f3', color: '#db2777'
              }].map(({ icon, title, val, link, bg, color }, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-start', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{title}</div>
                    {link ? <a href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{val}</a> : <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{val}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer style={{ background: '#0f172a', color: '#e2e8f0', padding: '48px 20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={18} color="#fff" /></div>
                <div>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: 15 }}>Salı Pazarı AVM</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>İstanbul</div>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, marginBottom: 16 }}>{s?.slogan?.split(',').slice(0,3).join(', ')}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href={s?.instagram_url || '#'} target="_blank" rel="noopener noreferrer" style={{ width: 34, height: 34, borderRadius: 8, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#db2777'; e.currentTarget.style.color='#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='#1e293b'; e.currentTarget.style.color='#94a3b8'; }}><InstagramIcon size={15} /></a>
                <a href={waHref} target="_blank" rel="noopener noreferrer" style={{ width: 34, height: 34, borderRadius: 8, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', transition: 'background 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='var(--brand)'; e.currentTarget.style.color='#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='#1e293b'; e.currentTarget.style.color='#94a3b8'; }}><MessageCircle size={15} /></a>
              </div>
            </div>
            <div>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#fff' }}>Hızlı Bağlantılar</h4>
              {[['#anasayfa','Ana Sayfa'],['#kategoriler','Kategoriler'],['#urunler','Ürünler'],['#harita','Konum & Saatler'],['#yorumlar','Yorumlar'],['#iletisim','İletişim']].map(([href,label]) => (
                <a key={href} href={href} style={{ display: 'block', fontSize: 13, color: '#94a3b8', marginBottom: 8, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color='var(--brand)'} onMouseLeave={e => e.target.style.color='#94a3b8'}>{label}</a>
              ))}
            </div>
            <div>
              <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#fff' }}>İletişim</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}><MapPin size={14} color="var(--brand)" style={{ flexShrink: 0, marginTop: 2 }} /><span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{s?.address}</span></div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Clock size={14} color="var(--brand)" /><span style={{ fontSize: 13, color: '#94a3b8' }}>Her gün 09:00 – 20:30</span></div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <p style={{ fontSize: 12, color: '#475569' }}>© 2024 {s?.store_name || 'İstanbul Salı Pazarı AVM'}. Tüm hakları saklıdır.</p>
            <a href="/admin/login" style={{ fontSize: 11, color: '#334155', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color='var(--brand)'} onMouseLeave={e => e.target.style.color='#334155'}>Yönetim Paneli</a>
          </div>
        </div>
      </footer>

      {/* ======= WHATSAPP FAB ======= */}
      <a href={waHref} target="_blank" rel="noopener noreferrer" data-testid="whatsapp-fab"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100, width: 56, height: 56, borderRadius: '50%', background: '#25d366', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)', transition: 'transform 0.2s, box-shadow 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform='scale(1.1)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(37,211,102,0.55)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(37,211,102,0.4)'; }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.1-.2.2-.3.3-.5.1-.2.1-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.3z"/><path d="M20.5 3.5C18.2 1.2 15.2 0 12 0 5.5 0 .2 5.3.2 11.8c0 2.1.6 4.1 1.6 5.9L0 24l6.4-1.7c1.7.9 3.6 1.4 5.6 1.4 6.5 0 11.8-5.3 11.8-11.8 0-3.2-1.2-6.2-3.3-8.4zM12 21.7c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4c-1-1.6-1.5-3.4-1.5-5.3 0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.9-9.8 9.9z"/></svg>
      </a>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .wa-text { display: none; }
          .mobile-menu-btn { display: flex !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-image-wrap { display: none !important; }
          .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .map-grid { grid-template-columns: 1fr !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
          .categories-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .categories-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .products-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
