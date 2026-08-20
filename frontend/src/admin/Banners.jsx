import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Image as ImageIcon, Upload, Save, X, AlertCircle } from 'lucide-react';
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
      setError('Title and Image URL are required.');
      return;
    }

    try {
      if (editingBanner) {
        await api.put(`/banners/${editingBanner.id}`, formData);
      } else {
        await api.post('/banners', formData);
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed.');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Deactivate banner "${title}"?`)) return;
    try {
      await api.delete(`/banners/${id}`);
      fetchBanners();
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3E2723]">
            Homepage &amp; Promotional Banners
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Control the hero carousel and seasonal marketing promotion cards
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#3E2723] hover:bg-[#6F4E37] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Banner
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-xs font-bold text-gray-500">
            Loading banners...
          </div>
        ) : banners.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-[#EADBC8] text-center text-xs text-gray-500">
            No banners created yet.
          </div>
        ) : (
          banners.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-3xl border border-[#EADBC8] overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="relative h-48 bg-[#FAF6F0]">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-0.5 bg-[#3E2723] text-white text-[10px] font-extrabold uppercase rounded-full">
                    {b.banner_type}
                  </span>
                  {b.badge_text && (
                    <span className="px-2.5 py-0.5 bg-[#C59B27] text-white text-[10px] font-bold rounded-full">
                      {b.badge_text}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg text-[#3E2723] leading-snug">
                    {b.title}
                  </h3>
                  {b.subtitle && <p className="text-xs text-gray-600 font-semibold">{b.subtitle}</p>}
                  {b.description && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{b.description}</p>}
                  <div className="pt-2 text-xs text-gray-400">
                    Button: <strong className="text-gray-700">"{b.button_text}"</strong> &rarr; {b.button_url}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {b.is_active ? 'Active' : 'Disabled'} • Sort: {b.sort_order}
                  </span>

                  <div className="space-x-2">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 text-[#6F4E37] hover:bg-[#FAF6F0] rounded-lg"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {b.is_active && (
                      <button
                        onClick={() => handleDelete(b.id, b.title)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EADBC8] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-serif-luxury text-xl font-bold text-[#3E2723]">
                {editingBanner ? 'Edit Banner' : 'Create Banner'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Heading Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Masterfully Roasted Coffee Beans"
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#6F4E37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g. The Top 1% of Arabica Crops"
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Supporting text for hero slide..."
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Banner Type</label>
                  <select
                    name="banner_type"
                    value={formData.banner_type}
                    onChange={handleChange}
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  >
                    <option value="hero">Hero Main Slider</option>
                    <option value="promotional">Promotional Card</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Badge Text</label>
                  <input
                    type="text"
                    name="badge_text"
                    value={formData.badge_text}
                    onChange={handleChange}
                    placeholder="e.g. Limited Edition"
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleChange}
                    placeholder="Shop Now"
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Button Link URL</label>
                  <input
                    type="text"
                    name="button_url"
                    value={formData.button_url}
                    onChange={handleChange}
                    placeholder="/shop/coffee"
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Image URL / Upload *</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    placeholder="Image URL or upload file"
                    className="flex-1 bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-[#6F4E37] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#3E2723]">
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="w-4 h-4 accent-[#6F4E37]"
                    />
                    <span>Active on Homepage</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#EADBC8] text-xs font-bold text-gray-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3E2723] hover:bg-[#6F4E37] text-white text-xs font-bold rounded-xl"
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
