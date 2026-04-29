import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Upload, Package, Search } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BACKEND = process.env.REACT_APP_BACKEND_URL;

const EMPTY_FORM = { name: '', price: '', category: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef();

  useEffect(() => { fetchAll(); }, []);

  const token = () => localStorage.getItem('admin_token');
  const authHeader = () => ({ Authorization: `Bearer ${token()}` });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pr, cr] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/categories`)
      ]);
      setProducts(pr.data);
      setCategories(cr.data);
    } catch (e) {
      if (e.response?.status === 401) { localStorage.removeItem('admin_token'); window.location.href = '/admin/login'; }
    } finally { setLoading(false); }
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setImageFile(null); setImagePreview(null); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, price: p.price, category: p.category }); setImageFile(null); setImagePreview(p.image_url ? `${BACKEND}${p.image_url}` : null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setImageFile(null); setImagePreview(null); };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim() || !form.category) { toast.error('Tüm alanları doldurun.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', form.price);
      fd.append('category', form.category);
      if (imageFile) fd.append('image', imageFile);
      if (editing) {
        await axios.put(`${API}/products/${editing.id}`, fd, { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } });
        toast.success('Ürün güncellendi!');
      } else {
        await axios.post(`${API}/products`, fd, { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } });
        toast.success('Ürün eklendi!');
      }
      closeModal();
      fetchAll();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'İşlem başarısız.');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API}/products/${deleteId}`, { headers: authHeader() });
      toast.success('Ürün silindi.');
      setDeleteId(null);
      fetchAll();
    } catch (e) { toast.error('İşlem başarısız.'); }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'all' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div data-testid="admin-products-page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 24, fontWeight: 700, color: '#0f172a' }}>Ürün Yönetimi</h1>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{products.length} ürün</p>
        </div>
        <button data-testid="admin-products-add-button" onClick={openAdd} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12,
          background: '#1d9e75', color: '#fff', fontWeight: 600, fontSize: 14,
          boxShadow: '0 2px 10px rgba(29,158,117,0.3)', transition: 'background 0.2s'
        }}
          onMouseEnter={e => e.currentTarget.style.background='#16825f'}
          onMouseLeave={e => e.currentTarget.style.background='#1d9e75'}>
          <Plus size={16} /> Ürün Ekle
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input data-testid="admin-products-search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Ürün ara..."
            style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, outline: 'none' }}
            onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          style={{ padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 13, background: '#fff', outline: 'none', cursor: 'pointer' }}>
          <option value="all">Tüm Kategoriler</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e2e8f0', borderTopColor: '#1d9e75', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : (
        <div data-testid="admin-products-table" style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>Henüz ürün yok.</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Ürün', 'Kategori', 'Fiyat', 'Eklenme', 'Aksiyonlar'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} data-testid="admin-product-row" style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 8, background: '#f1f5f9', overflow: 'hidden', flexShrink: 0 }}>
                          {p.image_url ? (
                            <img src={`${BACKEND}${p.image_url}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                          ) : <Package size={18} color="#94a3b8" style={{ margin: '13px auto', display: 'block' }} />}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{p.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: '#e8f7f2', color: '#1d9e75' }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#1d9e75', fontFamily: 'Space Grotesk, sans-serif' }}>{p.price}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: '#94a3b8' }}>{new Date(p.created_at).toLocaleDateString('tr-TR')}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button data-testid="admin-product-edit-button" onClick={() => openEdit(p)} style={{ padding: '6px 12px', borderRadius: 8, background: '#f0f9ff', color: '#0369a1', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #bae6fd', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background='#e0f2fe'} onMouseLeave={e => e.currentTarget.style.background='#f0f9ff'}>
                          <Edit2 size={11} /> Düzenle
                        </button>
                        <button data-testid="admin-product-delete-button" onClick={() => setDeleteId(p.id)} style={{ padding: '6px 12px', borderRadius: 8, background: '#fff1f2', color: '#e11d48', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, border: '1px solid #fecdd3', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background='#ffe4e6'} onMouseLeave={e => e.currentTarget.style.background='#fff1f2'}>
                          <Trash2 size={11} /> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div data-testid="admin-product-editor" style={{ background: '#fff', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700 }}>{editing ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}</h2>
              <button onClick={closeModal} data-testid="admin-product-cancel-button" style={{ padding: 6, color: '#94a3b8', borderRadius: 8 }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              {/* Image Upload */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Görsel</label>
                <div onClick={() => fileRef.current.click()} style={{ width: '100%', height: 160, border: '2px dashed #e2e8f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', background: '#f8fafc', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='#1d9e75'} onMouseLeave={e => e.currentTarget.style.borderColor='#e2e8f0'}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                      <Upload size={28} style={{ margin: '0 auto 8px' }} />
                      <p style={{ fontSize: 13 }}>Görsel yüklemek için tıklayın</p>
                      <p style={{ fontSize: 11, marginTop: 4 }}>JPG, PNG, WEBP • Maks 10MB</p>
                    </div>
                  )}
                </div>
                <input data-testid="admin-product-image-input" ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ürün Adı *</label>
                <input data-testid="admin-product-name-input" type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ürün adı" required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Fiyat *</label>
                  <input data-testid="admin-product-price-input" type="text" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="₺49,90" required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, outline: 'none' }}
                    onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Kategori *</label>
                  <select data-testid="admin-product-category-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', fontSize: 14, background: '#fff', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor='#1d9e75'} onBlur={e => e.target.style.borderColor='#e2e8f0'}>
                    <option value="">Seçin...</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: 14, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#f8fafc'} onMouseLeave={e => e.currentTarget.style.background='transparent'}>Vazgeç</button>
                <button data-testid="admin-product-save-button" type="submit" disabled={saving} style={{ flex: 2, padding: '11px', borderRadius: 12, background: saving ? '#94a3b8' : '#1d9e75', color: '#fff', fontWeight: 600, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.background='#16825f'; }}
                  onMouseLeave={e => { if (!saving) e.currentTarget.style.background='#1d9e75'; }}>
                  {saving ? <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> : null}
                  {saving ? 'Kaydediliyor...' : (editing ? 'Güncelle' : 'Kaydet')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(0,0,0,0.5)' }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px', width: '100%', maxWidth: 380, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} color="#e11d48" />
            </div>
            <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Ürünü Sil</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1.5px solid #e2e8f0', color: '#64748b', fontWeight: 600, fontSize: 14 }}>Vazgeç</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#e11d48', color: '#fff', fontWeight: 600, fontSize: 14 }}>Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
