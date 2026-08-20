import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit3, Trash2, X, AlertCircle } from 'lucide-react';
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
    city: 'Islamabad',
    phone: '',
    email: '',
    opening_hours: '8:00 AM - 1:00 AM',
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
      city: 'Islamabad',
      phone: '',
      email: '',
      opening_hours: '8:00 AM - 1:00 AM',
      latitude: '33.7294',
      longitude: '73.0931',
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
      city: store.city || 'Islamabad',
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
      setError(err.response?.data?.error || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.address.trim() || !formData.city.trim()) {
      setError('Store Name, Address, and City are required.');
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
      setError(err.response?.data?.error || 'Failed to save store.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to deactivate store "${name}"?`)) return;
    try {
      await api.delete(`/stores/${id}`);
      fetchStores();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to deactivate store.');
    }
  };

  return (
    <div className="space-y-6 text-[#2A1B17] font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DED2] pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
            Nationwide Store Locations
          </h1>
          <p className="text-xs text-[#6B4A3A]">
            Manage Coffee Bean cafe branches, opening hours, contact numbers, and pickup locations
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Store Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-12 bg-white rounded-md border border-[#E8DED2] text-center text-xs font-bold text-[#6B4A3A]">
            Loading store locations...
          </div>
        ) : stores.length === 0 ? (
          <div className="col-span-full p-12 bg-white rounded-md border border-[#E8DED2] text-center text-xs text-[#6B4A3A]">
            No store branches listed yet.
          </div>
        ) : (
          stores.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-md border border-[#E8DED2] p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="aspect-16/9 bg-[#F5F0E8] rounded-md overflow-hidden border border-[#E8DED2]">
                  <img
                    src={s.image || 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80'}
                    alt={s.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#4B274F]">{s.city}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        s.is_active ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {s.is_active ? 'Open' : 'Temporarily Closed'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#351B38]">{s.name}</h3>
                  <p className="text-xs text-[#6B4A3A] flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#4B274F] shrink-0 mt-0.5" />
                    <span>{s.address}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8DED2] flex items-center justify-between">
                <span className="text-[11px] text-[#6B4A3A]">{s.phone || '0302 5455448'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 rounded-md text-[#4B274F] hover:bg-[#F5F0E8] transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  {s.is_active && (
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
                      className="p-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
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
          <div className="bg-white rounded-md border border-[#E8DED2] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DED2]">
              <h2 className="font-display text-xl font-bold text-[#351B38]">
                {editingStore ? 'Edit Store Location' : 'Add Store Location'}
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
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Store Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Beverly Centre Flagship"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Street Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="2"
                  placeholder="Shop #, Ground Floor, Beverly Centre, Blue Area, F-6"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A1B17] mb-1">City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] font-semibold focus:outline-none"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A1B17] mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0302 5455448"
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Operating Hours</label>
                <input
                  type="text"
                  name="opening_hours"
                  value={formData.opening_hours}
                  onChange={handleChange}
                  placeholder="8:00 AM - 1:00 AM (Mon - Sun)"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2A1B17]">Store Photo</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Image URL or upload"
                    className="flex-1 bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2 text-xs text-[#2A1B17] focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold rounded-md cursor-pointer transition-colors">
                    {uploading ? '...' : 'Upload'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
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
                  <span>Active &amp; Open for Orders/Pickups</span>
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
