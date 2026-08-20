import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit3, Trash2, Upload, X, Save, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: 'Karachi',
    phone: '',
    email: '',
    opening_hours: '8:00 AM - 11:00 PM',
    latitude: '',
    longitude: '',
    image: '',
    features: 'WiFi, Specialty Coffee Bar',
    is_active: true,
  });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await api.get('/stores?all=true');
      setStores(res.data.stores || []);
    } catch (err) {
      console.error('Failed to load stores', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const openAddModal = () => {
    setEditingStore(null);
    setFormData({
      name: '',
      address: '',
      city: 'Karachi',
      phone: '',
      email: '',
      opening_hours: '8:00 AM - 11:00 PM',
      latitude: '24.8214',
      longitude: '67.0322',
      image: '',
      features: 'WiFi, Specialty Coffee Bar',
      is_active: true,
    });
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name || '',
      address: store.address || '',
      city: store.city || 'Karachi',
      phone: store.phone || '',
      email: store.email || '',
      opening_hours: store.opening_hours || '',
      latitude: store.latitude || '',
      longitude: store.longitude || '',
      image: store.image || '',
      features: Array.isArray(store.features) ? store.features.join(', ') : store.features || '',
      is_active: store.is_active ?? true,
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
      const res = await api.post('/stores/upload-image', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.error || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.address.trim()) {
      setError('Store Name and Address are required.');
      return;
    }

    try {
      if (editingStore) {
        await api.put(`/stores/${editingStore.id}`, formData);
      } else {
        await api.post('/stores', formData);
      }
      setIsModalOpen(false);
      fetchStores();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate store "${name}"?`)) return;
    try {
      await api.delete(`/stores/${id}`);
      fetchStores();
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
            Store Locations Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Add and manage neighborhood cafes, hours, maps, and amenities
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-5 py-2.5 bg-[#3E2723] hover:bg-[#6F4E37] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Store Location
        </button>
      </div>

      {/* Stores List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 text-center text-xs font-bold text-gray-500">
            Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-[#EADBC8] text-center text-xs text-gray-500">
            No stores configured yet.
          </div>
        ) : (
          stores.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-3xl border border-[#EADBC8] p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                {s.image && (
                  <div className="h-40 rounded-2xl overflow-hidden bg-gray-100 mb-3">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-serif-luxury font-bold text-base text-[#3E2723]">{s.name}</h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#FAF6F0] text-[#6F4E37] rounded-md shrink-0">
                    {s.city}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{s.address}</p>
                <div className="space-y-1 text-[11px] text-gray-500">
                  <p><strong>Phone:</strong> {s.phone || '—'}</p>
                  <p><strong>Hours:</strong> {s.opening_hours || '—'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    s.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {s.is_active ? 'Active' : 'Disabled'}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 text-[#6F4E37] hover:bg-[#FAF6F0] rounded-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {s.is_active && (
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
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
                {editingStore ? 'Edit Store' : 'Add Store Location'}
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
                <label className="block text-xs font-bold text-gray-700 mb-1">Store Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Zamzama Flagship Store"
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#6F4E37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="Plot 4-C, 10th Commercial Lane, Zamzama"
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 21 35870091"
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Opening Hours</label>
                <input
                  type="text"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleChange}
                  placeholder="08:00 AM - Midnight (Daily)"
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Latitude</label>
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="24.8214"
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Longitude</label>
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="67.0322"
                    className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Features / Amenities (Comma Separated)</label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="WiFi, Outdoor Patio, Roastery Bar"
                  className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700">Store Photo</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Image URL or upload"
                    className="flex-1 bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-[#6F4E37] text-white text-xs font-bold rounded-xl cursor-pointer hover:bg-[#3E2723]">
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 accent-[#6F4E37]"
                  />
                  <span>Active &amp; Visible in Store Locator</span>
                </label>
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
                  Save Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
