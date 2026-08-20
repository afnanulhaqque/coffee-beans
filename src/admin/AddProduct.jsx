import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Upload, X } from 'lucide-react';
import api from '../services/api';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    product_type: 'coffee', // 'coffee', 'tea', 'cake'
    pack_size: '8oz',
    short_description: '',
    description: '',
    flavor_profile: '',
    category_id: '',
    subcategory_id: '',
    sku: '',
    price: '',
    sale_price: '',
    stock_quantity: 50,
    availability: 'In Stock',
    roast_level: 'Medium Roast',
    origin: '',
    tags: '',
    image: '',
    additional_images: [],
    is_active: true,
    is_featured: false,
    is_best_seller: false,
    // Tea specific
    tea_type: '',
    caffeine: '',
    ingredients: '',
    brewing_instructions: '',
    // Cake specific
    cake_type: '',
    flavor: '',
    size: '',
    weight: '',
    serving_size: 'Whole Cake / 8-10 Slices',
    allergen_information: '',
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/categories?type=${form.product_type}`);
        const cats = res.data.categories || [];
        setCategories(cats);
        if (cats.length > 0) {
          setForm((f) => ({ ...f, category_id: cats[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [form.product_type]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/products/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, image: res.data.url }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Product Name is required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: form.price !== '' && form.price !== null ? parseFloat(form.price) : null,
        sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
        stock_quantity: parseInt(form.stock_quantity, 10) || 0,
        category_id: parseInt(form.category_id, 10) || null,
        subcategory_id: parseInt(form.subcategory_id, 10) || null,
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
    <div className="max-w-4xl mx-auto space-y-8 font-body text-[#2A1B17] pb-16">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E8DED2] pb-4">
        <Link
          to="/admin/products"
          className="text-xs font-bold text-[#4B274F] hover:underline flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
        <span className="text-xs text-[#6B4A3A]">Add New Catalog Item</span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: General Info */}
        <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-4">
          <h2 className="font-display text-xl font-bold text-[#351B38] border-b border-[#E8DED2] pb-3">
            1. Product Classification &amp; Title
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Product Type *</label>
                <select
                  name="product_type"
                  value={form.product_type}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs font-bold text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                >
                  <option value="coffee">Coffee</option>
                  <option value="tea">Tea</option>
                  <option value="cake">Cake To Go</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Product Title *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Lotus Cheesecake or Sencha Green"
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Category</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] font-semibold focus:outline-none focus:border-[#4B274F]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Pack / Serving Size</label>
                <input
                  type="text"
                  name="pack_size"
                  value={form.pack_size}
                  onChange={handleChange}
                  placeholder="e.g. 8oz, 12oz, or Whole Cake"
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">SKU / Item Code</label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g. CBTL-CAKE-01"
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Short Description (Sub-headline)</label>
              <input
                type="text"
                name="short_description"
                value={form.short_description}
                onChange={handleChange}
                placeholder="Brief aromatic overview or flavor summary"
                className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Full Detailed Narrative</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Detailed craft notes, heritage, and background..."
                className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Type Specific Attributes */}
        {form.product_type === 'tea' && (
          <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-4">
            <h2 className="font-display text-xl font-bold text-[#351B38] border-b border-[#E8DED2] pb-3">
              2. Tea Attributes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Tea Type</label>
                <input
                  type="text"
                  name="tea_type"
                  value={form.tea_type}
                  onChange={handleChange}
                  placeholder="e.g. Green Tea, Oolong, Black Tea"
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Caffeine Level</label>
                <input
                  type="text"
                  name="caffeine"
                  value={form.caffeine}
                  onChange={handleChange}
                  placeholder="e.g. High, Medium, Caffeine-Free"
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Origin</label>
                <input
                  type="text"
                  name="origin"
                  value={form.origin}
                  onChange={handleChange}
                  placeholder="e.g. Shizuoka, Japan"
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Flavor Profile</label>
              <input
                type="text"
                name="flavor_profile"
                value={form.flavor_profile}
                onChange={handleChange}
                placeholder="e.g. Delicate vegetal aroma with sweet grassy freshness"
                className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
              />
            </div>
          </div>
        )}

        {form.product_type === 'cake' && (
          <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-4">
            <h2 className="font-display text-xl font-bold text-[#351B38] border-b border-[#E8DED2] pb-3">
              2. Cake Attributes &amp; Serving
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Cake Type</label>
                <input
                  type="text"
                  name="cake_type"
                  value={form.cake_type}
                  onChange={handleChange}
                  placeholder="e.g. Cheesecake, Layered Cake"
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Flavor Notes</label>
                <input
                  type="text"
                  name="flavor"
                  value={form.flavor}
                  onChange={handleChange}
                  placeholder="e.g. Biscoff Lotus, Belgian Chocolate"
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A1B17] mb-1">Serving Size</label>
                <input
                  type="text"
                  name="serving_size"
                  value={form.serving_size}
                  onChange={handleChange}
                  placeholder="e.g. Whole Cake / 8-10 Slices"
                  className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Allergen Notice</label>
              <input
                type="text"
                name="allergen_information"
                value={form.allergen_information}
                onChange={handleChange}
                placeholder="e.g. Contains Dairy, Eggs, Gluten, Nuts"
                className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
              />
            </div>
          </div>
        )}

        {/* Section 3: Pricing & Inventory */}
        <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-4">
          <h2 className="font-display text-xl font-bold text-[#351B38] border-b border-[#E8DED2] pb-3">
            3. Pricing &amp; Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Price (PKR) (Optional)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Leave blank if unavailable"
                className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] font-semibold focus:outline-none focus:border-[#4B274F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Sale Price (PKR)</label>
              <input
                type="number"
                name="sale_price"
                value={form.sale_price}
                onChange={handleChange}
                placeholder="e.g. 3850"
                className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] font-semibold focus:outline-none focus:border-[#4B274F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock_quantity"
                value={form.stock_quantity}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] font-semibold focus:outline-none focus:border-[#4B274F]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Imagery */}
        <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-4">
          <h2 className="font-display text-xl font-bold text-[#351B38] border-b border-[#E8DED2] pb-3">
            4. Product Imagery
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#2A1B17] mb-1">Primary Product Image</label>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/products/tea/sencha-green.jpg or URL"
                  className="flex-1 px-3.5 py-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
                <label className="px-4 py-2.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold rounded-md cursor-pointer transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>

            {form.image && (
              <div className="w-32 h-32 bg-[#F5F0E8] border border-[#E8DED2] rounded-md overflow-hidden p-2 flex items-center justify-center relative">
                <img src={form.image} alt="Preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                  className="absolute top-1 right-1 p-1 bg-white/80 rounded-full text-red-600 hover:bg-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Visibility & Flags */}
        <div className="bg-white p-6 sm:p-8 rounded-md border border-[#E8DED2] shadow-xs space-y-4">
          <h2 className="font-display text-xl font-bold text-[#351B38] border-b border-[#E8DED2] pb-3">
            5. Storefront Visibility Flags
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[#2A1B17] cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="w-4 h-4 accent-[#4B274F]"
              />
              <span>Active on Storefront</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-[#2A1B17] cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={form.is_featured}
                onChange={handleChange}
                className="w-4 h-4 accent-[#4B274F]"
              />
              <span>Featured Highlight</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-[#2A1B17] cursor-pointer">
              <input
                type="checkbox"
                name="is_best_seller"
                checked={form.is_best_seller}
                onChange={handleChange}
                className="w-4 h-4 accent-[#4B274F]"
              />
              <span>Best Seller Badge</span>
            </label>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#E8DED2]">
          <Link
            to="/admin/products"
            className="px-6 py-3 border border-[#E8DED2] text-xs font-bold text-[#2A1B17] rounded-md hover:bg-[#F5F0E8] transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Publish Product'}
          </button>
        </div>

      </form>
    </div>
  );
}
