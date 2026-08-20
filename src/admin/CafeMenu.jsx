import React, { useState, useEffect } from 'react';
import { Utensils, Plus, Edit3, Trash2, Upload, Save, X, AlertCircle, Star } from 'lucide-react';
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
      alert('Failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteItem = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}" from cafe menu?`)) return;
    try {
      await api.delete(`/cafe-menu/items/${id}`);
      fetchMenu();
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
            Cafe Beverage &amp; Food Menu
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage in-store espresso, Ice Blended® creations, whole leaf tea lattes &amp; food
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCatModalOpen(true)}
            className="px-4 py-2.5 bg-white border border-[#EADBC8] text-[#3E2723] text-xs font-bold rounded-xl hover:bg-[#FAF6F0]"
          >
            + New Menu Section
          </button>
          <button
            onClick={() => openAddItemModal()}
            className="px-5 py-2.5 bg-[#3E2723] hover:bg-[#6F4E37] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Menu Item
          </button>
        </div>
      </div>

      {/* Menu Categories List */}
      <div className="space-y-8">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-gray-500">
            Loading menu categories...
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-[#EADBC8] p-6 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-serif-luxury font-bold text-lg text-[#3E2723]">
                    {cat.name}
                  </h3>
                  {cat.description && <p className="text-xs text-gray-500">{cat.description}</p>}
                </div>
                <button
                  onClick={() => openAddItemModal(cat.id)}
                  className="px-3 py-1.5 bg-[#FAF6F0] hover:bg-[#6F4E37] text-[#3E2723] hover:text-white text-xs font-bold rounded-xl border border-[#EADBC8] transition-colors"
                >
                  + Add to Section
                </button>
              </div>

              {/* Items in Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.items?.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#EADBC8] flex items-center justify-between gap-3"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#3E2723]">{item.name}</span>
                        {item.is_popular && (
                          <span className="px-1.5 py-0.2 bg-[#C59B27] text-white text-[9px] font-bold rounded">
                            HOT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-extrabold text-[#6F4E37]">
                        Rs. {item.price?.toLocaleString()}
                        {item.calories && <span className="text-gray-400 font-normal ml-2">({item.calories})</span>}
                      </div>
                    </div>

                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0" />
                    )}

                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => openEditItemModal(item)}
                        className="p-1 text-[#6F4E37] hover:bg-white rounded"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        className="p-1 text-red-500 hover:bg-white rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Item Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EADBC8] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="font-serif-luxury text-xl font-bold text-[#3E2723]">
                {editingItem ? 'Edit Menu Item' : 'Add Cafe Item'}
              </h2>
              <button onClick={() => setIsItemModalOpen(false)} className="text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleItemSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="e.g. Spanish Latte"
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={itemForm.category_id}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, category_id: e.target.value }))}
                    required
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  >
                    <option value="">Select Section...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemForm.price}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, price: e.target.value }))}
                    required
                    placeholder="950"
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows="2"
                  placeholder="Ingredients and serving details..."
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Calories / Info</label>
                  <input
                    type="text"
                    value={itemForm.calories}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, calories: e.target.value }))}
                    placeholder="280 kcal"
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={itemForm.is_popular}
                      onChange={(e) => setItemForm((prev) => ({ ...prev, is_popular: e.target.checked }))}
                      className="w-4 h-4 accent-[#6F4E37]"
                    />
                    <span>Mark as Popular</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={itemForm.image}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-5 py-2.5 border border-[#EADBC8] text-xs font-bold text-gray-600 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3E2723] hover:bg-[#6F4E37] text-white text-xs font-bold rounded-xl"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Section Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-[#EADBC8] max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h2 className="font-serif-luxury text-lg font-bold text-[#3E2723]">New Menu Section</h2>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                required
                placeholder="e.g. Seasonal Holiday Specials"
                className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 border border-[#EADBC8] text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3E2723] text-white text-xs font-bold rounded-xl"
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
