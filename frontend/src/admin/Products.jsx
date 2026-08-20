import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Filter, 
  DownloadCloud, 
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import Pagination from '../components/Pagination';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
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
        limit: 15,
        search: search.trim(),
        category: categoryFilter === 'all' ? '' : categoryFilter,
      };
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
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, categoryFilter]);

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
    <div className="space-y-6 text-[#1C1714]">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E5E0] pb-6">
        <div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#24150F]">
            Product Catalog
          </h1>
          <p className="text-xs text-[#756A62]">
            Total {totalCount} coffees, teas, and accessories registered in database.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/import"
            className="px-3.5 py-2 bg-white border border-[#E5E5E0] hover:bg-[#F7F7F5] text-xs font-bold text-[#5A3825] rounded-sm flex items-center gap-2 transition-colors"
          >
            <DownloadCloud className="w-4 h-4 text-[#B8895B]" /> Sync coffeebean.pk
          </Link>
          <Link
            to="/admin/products/add"
            className="px-4 py-2 bg-[#24150F] hover:bg-[#5A3825] text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Product
          </Link>
        </div>
      </div>

      {feedback.text && (
        <div className={`p-3 text-xs rounded-sm ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
          {feedback.text}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-[#E5E5E0] rounded-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title, roast, SKU..."
            className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm pl-9 pr-4 py-2 text-xs text-[#24150F] focus:outline-none focus:border-[#24150F]"
          />
          <Search className="w-3.5 h-3.5 text-[#756A62] absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3 py-2 pr-8 text-xs font-semibold text-[#24150F] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#756A62] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E5E5E0] rounded-sm shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs font-bold text-[#756A62]">Loading product catalog...</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <p className="text-xs text-[#756A62]">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F5] border-b border-[#E5E5E0] text-[10px] uppercase tracking-wider text-[#756A62]">
                <tr>
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Inventory</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                    
                    {/* Product Name & Photo */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image || '/placeholder-coffee.jpg'}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-sm border border-[#E5E5E0] bg-[#F7F7F5] shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <Link
                            to={`/admin/products/edit/${prod.id}`}
                            className="font-bold text-xs text-[#24150F] hover:text-[#B8895B] block truncate"
                          >
                            {prod.name}
                          </Link>
                          <span className="text-[10px] font-mono text-[#756A62]">
                            SKU: {prod.sku || 'N/A'} {prod.roast_level ? `• ${prod.roast_level}` : ''}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 font-medium text-[#5A3825]">
                      {prod.category_name || 'Uncategorized'}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-[#24150F]">
                      Rs. {prod.price?.toLocaleString()}
                      {prod.sale_price && prod.sale_price > 0 && (
                        <span className="text-[10px] text-red-700 block">Sale: Rs. {prod.sale_price.toLocaleString()}</span>
                      )}
                    </td>

                    {/* Inventory */}
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-sm font-bold text-[10px] ${
                        prod.stock_quantity <= 5
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-[#EDE4D8] text-[#5A3825]'
                      }`}>
                        {prod.stock_quantity} units
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {prod.is_active ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 font-bold text-[11px]">
                          <X className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/admin/products/edit/${prod.id}`}
                        className="p-1.5 text-[#5A3825] hover:text-[#24150F] hover:bg-[#EDE4D8] rounded-sm inline-block transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 text-[#756A62] hover:text-red-700 hover:bg-red-50 rounded-sm inline-block transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
