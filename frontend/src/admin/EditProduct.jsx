import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import api from '../services/api';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    short_description: '',
    description: '',
    category_id: '',
    sku: '',
    price: '',
    sale_price: '',
    stock_quantity: 0,
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
    const initData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${id}`),
        ]);

        setCategories(catRes.data.categories || []);
        const p = prodRes.data.product;

        setForm({
          name: p.name || '',
          short_description: p.short_description || '',
          description: p.description || '',
          category_id: p.category_id || '',
          sku: p.sku || '',
          price: p.price || '',
          sale_price: p.sale_price || '',
          stock_quantity: p.stock_quantity || 0,
          roast_level: p.roast_level || 'Medium',
          origin: p.origin || '',
          tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '',
          image: p.image || '',
          additional_images: p.additional_images || [],
          is_active: p.is_active ?? true,
          is_featured: p.is_featured ?? false,
          is_best_seller: p.is_best_seller ?? false,
        });
      } catch (err) {
        console.error('Failed to load product data', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) initData();
  }, [id]);

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
    setSuccess('');

    if (!form.name.trim() || !form.price) {
      setError('Product Name and Price are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        stock_quantity: parseInt(form.stock_quantity, 10) || 0,
        category_id: parseInt(form.category_id, 10) || null,
      };

      await api.put(`/products/${id}`, payload);
      setSuccess('Product successfully updated.');
      setTimeout(() => {
        navigate('/admin/products');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-xs font-bold text-[#756A62]">
        Loading product information...
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#1C1714]">
      
      {/* Header */}
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
              Edit Product: {form.name}
            </h1>
            <p className="text-xs text-[#756A62]">Update pricing, stock availability, origin and images.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-sm flex items-center gap-2">
          <Check className="w-4 h-4" /> {success}
        </div>
      )}

      {/* 2-Column Edit Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: General Info & Pricing (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
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
                className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2.5 text-xs text-[#24150F] focus:outline-none focus:border-[#24150F]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">Category</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
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
                  className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs text-[#24150F] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24150F] mb-1">Short Description</label>
              <input
                type="text"
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs text-[#24150F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24150F] mb-1">Full Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2.5 text-xs text-[#24150F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#24150F] mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs text-[#24150F] focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white border border-[#E5E5E0] rounded-sm p-6 space-y-4 shadow-xs">
            <h3 className="font-serif-luxury font-bold text-base text-[#24150F] border-b border-[#E5E5E0] pb-3">
              Pricing &amp; Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">Price (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
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
                  className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2 text-xs font-bold text-[#24150F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#24150F] mb-1">Stock Units</label>
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

        {/* Right: Media & Visibility (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-[#E5E5E0] rounded-sm p-6 space-y-4 shadow-xs">
            <h3 className="font-serif-luxury font-bold text-base text-[#24150F] border-b border-[#E5E5E0] pb-3">
              Media &amp; Images
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#24150F] mb-1">Main Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
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
              <label className="block text-xs font-bold text-[#24150F]">Add Gallery Image URL</label>
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

          <div className="bg-white border border-[#E5E5E0] rounded-sm p-6 space-y-3 shadow-xs">
            <h3 className="font-serif-luxury font-bold text-base text-[#24150F] border-b border-[#E5E5E0] pb-3">
              Visibility
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

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-[#24150F] hover:bg-[#5A3825] text-white text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#B8895B]" /> {saving ? 'Updating Product...' : 'Save Changes'}
          </button>

        </div>

      </form>

    </div>
  );
}
