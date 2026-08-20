import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    button_text: 'Shop Now',
    button_url: '/shop',
    badge_text: '',
    banner_type: 'hero',
    sort_order: 0,
    is_active: true,
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners?all=true');
      setBanners(res.data.banners || []);
    } catch (err) {
      console.error('Failed to load banners', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      button_text: 'Shop Now',
      button_url: '/shop',
      badge_text: '',
      banner_type: 'hero',
      sort_order: 0,
      is_active: true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (b) => {
    setEditingBanner(b);
    setFormData({
      title: b.title || '',
      subtitle: b.subtitle || '',
      description: b.description || '',
      image: b.image || '',
      button_text: b.button_text || 'Shop Now',
      button_url: b.button_url || '/shop',
      badge_text: b.badge_text || '',
      banner_type: b.banner_type || 'hero',
      sort_order: b.sort_order ?? 0,
      is_active: b.is_active ?? true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/banners/upload-image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.image.trim()) {
      setError('Banner Title and Image are required.');
      return;
    }

    try {
      const payload = {
        ...formData,
        sort_order: parseInt(formData.sort_order, 10) || 0,
      };

      if (editingBanner) {
        await api.put(`/banners/${editingBanner.id}`, payload);
      } else {
        await api.post('/banners', payload);
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save banner.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove banner "${title}"?`)) return;
    try {
      await api.delete(`/banners/${id}`);
      fetchBanners();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete banner.');
    }
  };

  return (
    <div className="space-y-6 text-[#2A1B17] font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DED2] pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
            Storefront Banners &amp; Campaigns
          </h1>
          <p className="text-xs text-[#6B4A3A]">
            Manage hero visual carousel slides and promotional campaign banners
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-12 bg-white rounded-md border border-[#E8DED2] text-center text-xs font-bold text-[#6B4A3A]">
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-md border border-[#E8DED2] text-center text-xs text-[#6B4A3A]">
            No promotional banners active.
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-md border border-[#E8DED2] p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="aspect-16/9 bg-[#F5F0E8] rounded-md overflow-hidden border border-[#E8DED2] relative">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                  {b.badge_text && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#4B274F] text-white text-[10px] font-bold uppercase tracking-widest rounded-xs">
                      {b.badge_text}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#4B274F]">
                      {b.banner_type} • Order: {b.sort_order}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        b.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {b.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#351B38]">{b.title}</h3>
                  {b.subtitle && <p className="text-xs text-[#6B4A3A] font-semibold">{b.subtitle}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8DED2] flex items-center justify-between">
                <span className="text-[11px] text-[#6B4A3A]">{b.button_text} &rarr; {b.button_url}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-1.5 rounded-md text-[#4B274F] hover:bg-[#F5F0E8] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.title)}
                    className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-md border border-[#E8DED2] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED2]">
              <h2 className="font-display text-xl font-bold text-[#351B38]">
                {editingBanner ? 'Edit Banner' : 'Create Banner'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#6B4A3A] hover:text-[#2A1B17]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Banner Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Master Roasted Single Origin"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g. Costa Rica High-Grown Arabica"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2A1B17]">Banner Image *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    placeholder="Image URL or upload"
                    className="flex-1 bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold rounded-md cursor-pointer transition-colors">
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A1B17] mb-1">Button Text</label>
                  <input
                    type="text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleChange}
                    placeholder="Shop Now"
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A1B17] mb-1">Button Link</label>
                  <input
                    type="text"
                    name="button_url"
                    value={formData.button_url}
                    onChange={handleChange}
                    placeholder="/shop or /coffee"
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A1B17] mb-1">Badge Text (Optional)</label>
                  <input
                    type="text"
                    name="badge_text"
                    value={formData.badge_text}
                    onChange={handleChange}
                    placeholder="NEW SEASON"
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A1B17] mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#2A1B17] cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#4B274F]"
                  />
                  <span>Active &amp; Visible on Homepage</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DED2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E8DED2] text-xs font-bold text-[#2A1B17] rounded-md hover:bg-[#F5F0E8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold rounded-md transition-colors"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
