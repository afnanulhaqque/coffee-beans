import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    short_description: '',
    description: '',
    category_id: '',
    sku: '',
    price: '',
    sale_price: '',
    stock_quantity: 50,
    roast_level: 'Medium',
    origin: '',
    tags: '',
    image: '',
    additional_images: [],
    is_active: true,
    is_featured: false,
    is_best_seller: false,
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
        if (res.data.categories?.length > 0) {
          setForm((f) => ({ ...f, category_id: res.data.categories[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setForm((f) => ({
        ...f,
        additional_images: [...f.additional_images, newGalleryUrl.trim()],
      }));
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (idx) => {
    setForm((f) => ({
      ...f,
      additional_images: f.additional_images.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.price) {
      setError('Product Name and Price are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        stock_quantity: parseInt(form.stock_quantity, 10) || 0,
        category_id: parseInt(form.category_id, 10) || null,
      };

      await api.post('/products', payload);
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[#1C1714]">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 border border-[#E5E5E0] bg-white rounded-sm text-[#24150F] hover:bg-[#F7F7F5]"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#24150F]">
              Add New Product
            </h1>
            <p className="text-xs text-[#756A62]">Create a new catalog item with images and roast metadata.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
          {error}
        </div>
      )}

      {/* 2-Column Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: General & Pricing (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* GENERAL INFORMATION */}
          <div className="bg-white border border-[#E5E5E0] rounded-sm p-6 space-y-4 shadow-xs">
            <h3 className="font-serif-luxury font-bold text-base text-[#24150F] border-b border-[#E5E5E0] pb-3">
              General Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#24150F] mb-1">Product Title *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="e.g. Costa Rica La Minita Whole Bean (8oz)"
                className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2.5 text-xs text-[#24150F] focus:outline-none focus:border-[#24150F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">Category *</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3 py-2 text-xs font-bold text-[#24150F] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">SKU Reference</label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g. CB-CR-001"
                  className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs text-[#24150F] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">Roast Profile</label>
                <select
                  name="roast_level"
                  value={form.roast_level}
                  onChange={handleChange}
                  className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3 py-2 text-xs font-bold text-[#24150F] focus:outline-none"
                >
                  <option value="Light">Light Roast</option>
                  <option value="Medium">Medium Roast</option>
                  <option value="Dark">Dark Roast</option>
                  <option value="Decaf">Decaffeinated</option>
                  <option value="Flavoured">Flavoured Coffee</option>
                  <option value="Tea">Whole Leaf Tea</option>
                  <option value="Gear">Brewing Gear / Merchandise</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">Origin / Terroir</label>
                <input
                  type="text"
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  placeholder="e.g. Tarrazu, Costa Rica"
                  className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs text-[#24150F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24150F] mb-1">Short Character Note</label>
              <input
                type="text"
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                placeholder="e.g. Sweet citrus aroma, crisp body, and notes of milk chocolate."
                className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs text-[#24150F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24150F] mb-1">Full Description &amp; Tasting Profile</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Detailed roastery profile, terroir, altitude, processing method..."
                className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2.5 text-xs text-[#24150F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24150F] mb-1">Search Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="Costa Rica, Light Roast, Single Origin"
                className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs text-[#24150F] focus:outline-none"
              />
            </div>
          </div>

          {/* PRICING & INVENTORY */}
          <div className="bg-white border border-[#E5E5E0] rounded-sm p-6 space-y-4 shadow-xs">
            <h3 className="font-serif-luxury font-bold text-base text-[#24150F] border-b border-[#E5E5E0] pb-3">
              Pricing &amp; Stock Control
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">Regular Price (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="3450"
                  className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs font-bold text-[#24150F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">Sale Price (Rs.)</label>
                <input
                  type="number"
                  step="0.01"
                  name="sale_price"
                  value={form.sale_price}
                  onChange={handleChange}
                  placeholder="Optional"
                  className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs font-bold text-[#24150F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">Initial Stock Units</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={form.stock_quantity}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs font-bold text-[#24150F] focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Media & Visibility (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* MEDIA & IMAGERY */}
          <div className="bg-white border border-[#E5E5E0] rounded-sm p-6 space-y-4 shadow-xs">
            <h3 className="font-serif-luxury font-bold text-base text-[#24150F] border-b border-[#E5E5E0] pb-3">
              Product Imagery
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#24150F] mb-1">Primary Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://... or /uploads/products/..."
                className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs text-[#24150F] focus:outline-none"
              />
            </div>

            {form.image && (
              <div className="aspect-square bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm overflow-hidden">
                <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            {/* Additional Gallery */}
            <div className="pt-2 border-t border-[#E5E5E0] space-y-2">
              <label className="block text-xs font-bold text-[#24150F]">Additional Gallery Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGalleryUrl}
                  onChange={(e) => setNewGalleryUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3 py-1.5 text-xs text-[#24150F] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddGalleryImage}
                  className="px-3 py-1.5 bg-[#24150F] text-white text-xs font-bold rounded-sm"
                >
                  Add
                </button>
              </div>

              {form.additional_images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {form.additional_images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square border border-[#E5E5E0] rounded-sm overflow-hidden group">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* VISIBILITY & BADGES */}
          <div className="bg-white border border-[#E5E5E0] rounded-sm p-6 space-y-3 shadow-xs">
            <h3 className="font-serif-luxury font-bold text-base text-[#24150F] border-b border-[#E5E5E0] pb-3">
              Visibility &amp; Badges
            </h3>

            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="w-4 h-4 accent-[#24150F]"
              />
              <span className="text-xs font-bold text-[#24150F]">Active on Storefront</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                className="w-4 h-4 accent-[#24150F]"
              />
              <span className="text-xs font-bold text-[#24150F]">Featured on Homepage</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer py-1">
              <input
                type="checkbox"
                name="is_best_seller"
                checked={form.is_best_seller}
                onChange={handleChange}
                className="w-4 h-4 accent-[#24150F]"
              />
              <span className="text-xs font-bold text-[#24150F]">Best Seller Badge</span>
            </label>
          </div>

          {/* Save Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#24150F] hover:bg-[#5A3825] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#B8895B]" /> {loading ? 'Saving Product...' : 'Publish Product'}
          </button>

        </div>

      </form>

    </div>
  );
}
