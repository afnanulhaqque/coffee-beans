import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  DownloadCloud, 
  ChevronDown,
  Coffee,
  Leaf,
  Cake,
  UtensilsCrossed,
  GlassWater
} from 'lucide-react';
import api from '../services/api';
import Pagination from '../components/Pagination';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 25,
        search: search.trim(),
        all: true,
      };
      if (typeFilter !== 'all') {
        params.type = typeFilter;
      }
      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      const res = await api.get('/products', { params });
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const params = typeFilter !== 'all' ? { type: typeFilter } : {};
      const res = await api.get('/categories', { params });
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [typeFilter]);

  useEffect(() => {
    fetchProducts();
  }, [page, typeFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      setFeedback({ type: 'success', text: `Product "${productName}" removed.` });
      fetchProducts();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to delete product.' });
    }
  };

  return (
    <div className="space-y-6 text-[#2A1B17] font-body">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DED2] pb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
            Product Catalog
          </h1>
          <p className="text-xs text-[#6B4A3A]">
            Total {totalCount} items registered across Coffee, Tea, Cakes, Beverages, and Food.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/import"
            className="px-3.5 py-2 bg-white border border-[#E8DED2] hover:bg-[#F5F0E8] text-xs font-bold text-[#2A1B17] rounded-md flex items-center gap-2 transition-colors"
          >
            <DownloadCloud className="w-4 h-4 text-[#4B274F]" /> Sync Catalog
          </Link>
          <Link
            to="/admin/products/add"
            className="px-4 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {feedback.text && (
        <div className={`p-3 text-xs rounded-md ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {feedback.text}
        </div>
      )}

      {/* Catalog Segment Tabs: All / Coffee / Tea / Cakes / Beverages / Food */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { label: 'All Catalog', value: 'all', icon: null },
          { label: 'Coffee Beans', value: 'coffee', icon: Coffee },
          { label: 'Artisan Teas', value: 'tea', icon: Leaf },
          { label: 'Cake To Go', value: 'cake', icon: Cake },
          { label: 'Beverages', value: 'beverage', icon: GlassWater },
          { label: 'Food Menu', value: 'food', icon: UtensilsCrossed },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.value}
              onClick={() => {
                setTypeFilter(tab.value);
                setCategoryFilter('all');
                setPage(1);
              }}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-md flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                typeFilter === tab.value
                  ? 'bg-[#4B274F] text-white shadow-xs'
                  : 'bg-white border border-[#E8DED2] text-[#2A1B17] hover:bg-[#F5F0E8]'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E8DED2] rounded-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalog by title, SKU, flavor, origin..."
            className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md pl-9 pr-4 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
          />
          <Search className="w-3.5 h-3.5 text-[#6B4A3A] absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3 py-2 pr-8 text-xs font-semibold text-[#2A1B17] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#4B274F] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E8DED2] rounded-md shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-bold text-[#6B4A3A]">Loading product catalog...</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <p className="text-xs text-[#6B4A3A]">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E8] border-b border-[#E8DED2] text-[10px] uppercase tracking-wider text-[#351B38] font-bold">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Pack / Portion</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED2]">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                    
                    {/* Product Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image || prod.image_url || '/placeholder-coffee.jpg'}
                          alt={prod.name}
                          className="w-12 h-12 object-contain rounded-md border border-[#E8DED2] bg-[#F5F0E8] shrink-0 p-1"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link
                            to={`/admin/products/edit/${prod.id}`}
                            className="font-bold text-xs text-[#2A1B17] hover:text-[#4B274F] block truncate"
                          >
                            {prod.name}
                          </Link>
                          <span className="text-[10px] font-mono text-[#6B4A3A]">
                            SKU: {prod.sku || 'N/A'} {prod.tea_type ? `• ${prod.tea_type}` : prod.beverage_type ? `• ${prod.beverage_type}` : prod.roast_level ? `• ${prod.roast_level}` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Product Type */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-xs uppercase tracking-wider ${
                        prod.product_type === 'tea'
                          ? 'bg-emerald-50 text-emerald-800'
                          : prod.product_type === 'cake'
                          ? 'bg-amber-50 text-amber-800'
                          : prod.product_type === 'beverage'
                          ? 'bg-sky-50 text-sky-800'
                          : prod.product_type === 'food'
                          ? 'bg-orange-50 text-orange-800'
                          : 'bg-purple-50 text-purple-800'
                      }`}>
                        {prod.product_type || 'coffee'}
                      </span>
                    </td>

                    {/* Pack / Portion */}
                    <td className="py-3 px-4 font-bold text-[#4B274F]">
                      {prod.pack_size || prod.serving_size || prod.portion || '—'}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-[#6B4A3A]">
                      {prod.category_name || 'Uncategorized'}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-[#4B274F]">
                      {prod.price !== null && prod.price !== undefined ? (
                        `Rs. ${Number(prod.price).toLocaleString()}`
                      ) : (
                        <span className="text-[11px] font-normal italic text-[#6B4A3A]">Unavailable</span>
                      )}
                    </td>

                    {/* Inventory */}
                    <td className="py-3 px-4">
                      <span className={`font-semibold ${prod.stock_quantity <= 5 ? 'text-amber-700' : 'text-[#2A1B17]'}`}>
                        {prod.stock_quantity} units
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                        prod.is_in_stock ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {prod.is_in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/admin/products/edit/${prod.id}`}
                        className="p-1.5 text-[#6B4A3A] hover:text-[#4B274F] inline-block transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 text-[#6B4A3A] hover:text-red-700 inline-block transition-colors cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

    </div>
  );
}
