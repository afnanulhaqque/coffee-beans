import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Layers, AlertCircle, X } from 'lucide-react';
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

    if (!formData.name.trim() || !formData.slug.trim()) {
      setError('Category Name and Slug are required.');
      return;
    }

    try {
      const payload = {
        ...formData,
        parent_id: formData.parent_id ? parseInt(formData.parent_id, 10) : null,
        sort_order: parseInt(formData.sort_order, 10) || 0,
      };

      if (editingCat) {
        await api.put(`/categories/${editingCat.id}`, payload);
      } else {
        await api.post('/categories', payload);
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save category.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to disable the category "${name}"?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete category.');
    }
  };

  return (
    <div className="space-y-6 text-[#2A1B17] font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DED2] pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
            Categories &amp; Navigation Hierarchy
          </h1>
          <p className="text-xs text-[#6B4A3A]">
            Manage multi-tier categories for coffee roasts, whole leaf teas, and cafe food.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 bg-white rounded-md border border-[#E8DED2] text-center text-xs font-bold text-[#6B4A3A]">
            Loading category hierarchy...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 bg-white rounded-md border border-[#E8DED2] text-center text-xs text-[#6B4A3A]">
            No categories defined yet.
          </div>
        ) : (
          categories.map((parent) => (
            <div
              key={parent.id}
              className="bg-white rounded-md border border-[#E8DED2] p-5 shadow-xs space-y-4"
            >
              {/* Top-Level Parent */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {parent.image ? (
                    <img
                      src={parent.image}
                      alt={parent.name}
                      className="w-10 h-10 object-cover rounded-md border border-[#E8DED2]"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[#F5F0E8] rounded-md border border-[#E8DED2] flex items-center justify-center text-[#4B274F]">
                      <Layers className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-sm text-[#351B38]">
                      {parent.name}
                    </h3>
                    <span className="text-[10px] text-[#6B4A3A] font-mono">
                      /{parent.slug} • Order: {parent.sort_order}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                      parent.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {parent.is_active ? 'Active' : 'Disabled'}
                  </span>
                  <button
                    onClick={() => openEditModal(parent)}
                    className="p-1.5 rounded-md text-[#4B274F] hover:bg-[#F5F0E8] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {parent.is_active && (
                    <button
                      onClick={() => handleDelete(parent.id, parent.name)}
                      className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Subcategories */}
              {parent.children && parent.children.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pl-4 border-l-2 border-[#E8DED2]">
                  {parent.children.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3 bg-[#F5F0E8] rounded-md border border-[#E8DED2] flex items-center justify-between gap-2"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-[#2A1B17]">{sub.name}</h4>
                        <span className="text-[10px] text-[#6B4A3A] font-mono">/{sub.slug}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="p-1 text-[#4B274F] hover:bg-white rounded transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {sub.is_active && (
                          <button
                            onClick={() => handleDelete(sub.id, sub.name)}
                            className="p-1 text-red-600 hover:bg-white rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-md border border-[#E8DED2] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED2]">
              <h2 className="font-display text-xl font-bold text-[#351B38]">
                {editingCat ? 'Edit Category' : 'Create Category'}
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
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  placeholder="e.g. Medium & Smooth"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">URL Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                  placeholder="medium-smooth"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Parent Category</label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, parent_id: e.target.value }))}
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
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
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows="2"
                  placeholder="Category aroma and roast characteristics..."
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2A1B17]">Category Image</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL or upload"
                    className="flex-1 bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                  />
                  <label className="px-3 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold rounded-md cursor-pointer transition-colors">
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A1B17] mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, sort_order: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#2A1B17] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                      className="w-4 h-4 accent-[#4B274F]"
                    />
                    <span>Active Status</span>
                  </label>
                </div>
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
