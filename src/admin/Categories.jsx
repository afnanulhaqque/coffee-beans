import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Layers, Upload, Save, AlertCircle, X } from 'lucide-react';
import api from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parent_id: '',
    sort_order: 0,
    is_active: true,
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const [treeRes, flatRes] = await Promise.all([
        api.get('/categories?all=true'),
        api.get('/categories?flat=true&all=true'),
      ]);
      setCategories(treeRes.data.categories || []);
      setFlatCategories(flatRes.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCat(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      parent_id: '',
      sort_order: 0,
      is_active: true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
      image: cat.image || '',
      parent_id: cat.parent_id || '',
      sort_order: cat.sort_order ?? 0,
      is_active: cat.is_active ?? true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, name, slug: autoSlug }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/categories/upload-image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload category image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Category Name is required.');
      return;
    }

    try {
      if (editingCat) {
        await api.put(`/categories/${editingCat.id}`, formData);
      } else {
        await api.post('/categories', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
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
            Category Hierarchy Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize main coffee/tea departments and roast subcategories
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#3E2723] hover:bg-[#6F4E37] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Categories Tree Grid */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-gray-500">
            Loading category hierarchy...
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#EADBC8] text-center text-xs text-gray-500">
            No categories defined.
          </div>
        ) : (
          categories.map((parent) => (
            <div
              key={parent.id}
              className="bg-white rounded-3xl border border-[#EADBC8] p-6 shadow-xs space-y-4"
            >
              {/* Parent Category Header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  {parent.image && (
                    <img
                      src={parent.image}
                      alt={parent.name}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                    />
                  )}
                  <div>
                    <h3 className="font-serif-luxury font-bold text-lg text-[#3E2723]">
                      {parent.name}
                    </h3>
                    <span className="text-[10px] text-gray-400 font-mono">
                      /{parent.slug} • Order: {parent.sort_order}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      parent.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {parent.is_active ? 'Active' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => openEditModal(parent)}
                    className="p-1.5 rounded-lg text-[#6F4E37] hover:bg-[#FAF6F0]"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {parent.is_active && (
                    <button
                      onClick={() => handleDelete(parent.id, parent.name)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Subcategories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pl-4 border-l-2 border-[#EADBC8]">
                {parent.children?.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3 bg-[#FAF6F0] rounded-2xl border border-[#EADBC8] flex items-center justify-between gap-2"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-[#3E2723]">{sub.name}</h4>
                      <span className="text-[10px] text-gray-400 font-mono">/{sub.slug}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(sub)}
                        className="p-1 text-[#6F4E37] hover:bg-white rounded"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {sub.is_active && (
                        <button
                          onClick={() => handleDelete(sub.id, sub.name)}
                          className="p-1 text-red-500 hover:bg-white rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EADBC8] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-serif-luxury text-xl font-bold text-[#3E2723]">
                {editingCat ? 'Edit Category' : 'Create Category'}
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  placeholder="e.g. Medium & Smooth"
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#6F4E37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">URL Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                  placeholder="medium-smooth"
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#6F4E37] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Parent Category</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value }))}
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                >
                  <option value="">None (Top-Level Category)</option>
                  {flatCategories
                    .filter((c) => !editingCat || c.id !== editingCat.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows="2"
                  placeholder="Category aroma and roast characteristics..."
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Category Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL or upload"
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
                    value={formData.sort_order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 accent-[#6F4E37]"
                    />
                    <span>Active Status</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 border border-[#EADBC8] text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3E2723] hover:bg-[#6F4E37] text-white text-xs font-bold rounded-xl"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
