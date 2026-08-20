import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function CafeMenu() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [itemForm, setItemForm] = useState({
    name: '',
    category_id: '',
    description: '',
    price: '',
    image: '',
    calories: '',
    is_popular: false,
    is_active: true,
  });

  const [catName, setCatName] = useState('');

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cafe-menu?all=true');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to load cafe menu', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddItemModal = (catId = '') => {
    setEditingItem(null);
    setItemForm({
      name: '',
      category_id: catId || (categories[0]?.id || ''),
      description: '',
      price: '',
      image: '',
      calories: '',
      is_popular: false,
      is_active: true,
    });
    setError('');
    setIsItemModalOpen(true);
  };

  const openEditItemModal = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name || '',
      category_id: item.category_id || '',
      description: item.description || '',
      price: item.price || '',
      image: item.image || '',
      calories: item.calories || '',
      is_popular: item.is_popular ?? false,
      is_active: item.is_active ?? true,
    });
    setError('');
    setIsItemModalOpen(true);
  };

  const handleItemSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!itemForm.name.trim() || !itemForm.price || !itemForm.category_id) {
      setError('Item Name, Price, and Category are required.');
      return;
    }

    try {
      if (editingItem) {
        await api.put(`/cafe-menu/items/${editingItem.id}`, itemForm);
      } else {
        await api.post('/cafe-menu/items', itemForm);
      }
      setIsItemModalOpen(false);
      fetchMenu();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save menu item.');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      await api.post('/cafe-menu/categories', { name: catName.trim() });
      setCatName('');
      setIsCatModalOpen(false);
      fetchMenu();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create menu category.');
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the cafe menu?`)) return;
    try {
      await api.delete(`/cafe-menu/items/${id}`);
      fetchMenu();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete menu item.');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await api.post('/cafe-menu/upload-image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setItemForm((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload item image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 text-[#2A1B17] font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DED2] pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
            In-Store Cafe Menu &amp; Bakery
          </h1>
          <p className="text-xs text-[#6B4A3A]">
            Manage barista beverages, Ice Blended® specialties, fresh bakery pastries, and food
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCatModalOpen(true)}
            className="px-3.5 py-2 bg-white border border-[#E8DED2] text-xs font-bold text-[#2A1B17] hover:bg-[#F5F0E8] rounded-md transition-colors cursor-pointer"
          >
            + Menu Category
          </button>
          <button
            onClick={() => openAddItemModal()}
            className="px-4 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {loading ? (
          <div className="p-12 bg-white rounded-md border border-[#E8DED2] text-center text-xs font-bold text-[#6B4A3A]">
            Loading cafe menu items...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-12 bg-white rounded-md border border-[#E8DED2] text-center text-xs text-[#6B4A3A]">
            No cafe menu categories created yet.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E8DED2] pb-2">
                <h2 className="font-display text-xl text-[#351B38]">
                  {cat.name} ({cat.items?.length || 0})
                </h2>
                <button
                  onClick={() => openAddItemModal(cat.id)}
                  className="text-xs font-bold text-[#4B274F] hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add to {cat.name}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(cat.items || []).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-md border border-[#E8DED2] p-4 shadow-xs flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="aspect-square bg-[#F5F0E8] rounded-md overflow-hidden border border-[#E8DED2]">
                        <img
                          src={item.image || '/placeholder-coffee.jpg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-[#2A1B17] line-clamp-1">{item.name}</h4>
                          {item.is_popular && (
                            <span className="px-1.5 py-0.5 bg-[#4B274F] text-white text-[9px] font-bold rounded-xs shrink-0 uppercase">
                              Fav
                            </span>
                          )}
                        </div>
                        <span className="font-bold text-xs text-[#4B274F] block">Rs. {item.price}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8DED2] flex items-center justify-between">
                      <span className="text-[10px] text-[#6B4A3A]">{item.calories || 'Beverage'}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditItemModal(item)}
                          className="p-1 text-[#4B274F] hover:bg-[#F5F0E8] rounded-md transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id, item.name)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-md border border-[#E8DED2] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED2]">
              <h2 className="font-display text-xl font-bold text-[#351B38]">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button onClick={() => setIsItemModalOpen(false)} className="text-[#6B4A3A] hover:text-[#2A1B17]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Item Title *</label>
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g. The Original Mocha Ice Blended®"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A1B17] mb-1">Menu Category *</label>
                  <select
                    value={itemForm.category_id}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, category_id: e.target.value }))}
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] font-semibold focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A1B17] mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    value={itemForm.price}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, price: e.target.value }))}
                    required
                    placeholder="e.g. 1150"
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Short Description</label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows="2"
                  placeholder="Special Dutch chocolate powder with fresh espresso and ice..."
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2A1B17]">Item Photo</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={itemForm.image}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="Image URL or upload"
                    className="flex-1 bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold rounded-md cursor-pointer transition-colors">
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-2 flex gap-4">
                <label className="flex items-center gap-2 text-xs font-bold text-[#2A1B17] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={itemForm.is_popular}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, is_popular: e.target.checked }))}
                    className="w-4 h-4 accent-[#4B274F]"
                  />
                  <span>Popular Signature Highlight</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DED2]">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-5 py-2.5 border border-[#E8DED2] text-xs font-bold text-[#2A1B17] rounded-md hover:bg-[#F5F0E8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold rounded-md transition-colors"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-md border border-[#E8DED2] max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-display text-lg font-bold text-[#351B38]">Add Menu Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
                placeholder="e.g. Ice Blended® Drinks"
                className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 border border-[#E8DED2] text-xs rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold rounded-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
