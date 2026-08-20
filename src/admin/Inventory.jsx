import React, { useState, useEffect } from 'react';
import { Boxes, Search, Plus, Minus, Check, AlertTriangle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const params = {
        search: search.trim(),
        status: statusFilter === 'all' ? '' : statusFilter,
      };
      const res = await api.get('/admin/inventory', { params });
      setProducts(res.data.inventory || []);
    } catch (err) {
      console.error('Failed to load inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleStockAdjust = async (productId, delta) => {
    setUpdatingId(productId);
    try {
      const res = await api.put(`/admin/inventory/${productId}`, { adjustment: delta });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? res.data.product : p))
      );
    } catch (err) {
      alert('Failed to update stock: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDirectSet = async (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty < 0) return;

    setUpdatingId(productId);
    try {
      const res = await api.put(`/admin/inventory/${productId}`, { stock_quantity: qty });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? res.data.product : p))
      );
    } catch (err) {
      alert('Failed to set stock: ' + (err.response?.data?.error || err.message));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#3E2723]">
          Inventory &amp; Stock Management
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Monitor product availability and perform rapid stock count adjustments
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-[#EADBC8] shadow-xs flex flex-col md:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full bg-[#FAF6F0] border border-[#EADBC8] rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#6F4E37]"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 bg-[#FAF6F0] border border-[#EADBC8] rounded-xl px-3 py-2 text-xs font-bold text-[#3E2723] focus:outline-none"
        >
          <option value="all">All Inventory</option>
          <option value="in_stock">In Stock (&gt; 5)</option>
          <option value="low_stock">Low Stock (1 - 5)</option>
          <option value="out_of_stock">Out of Stock (0)</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-[#EADBC8] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-gray-500">
            Loading inventory items...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No products found matching the criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF6F0] text-[#3E2723] font-bold uppercase text-[10px] border-b border-[#EADBC8]">
                <tr>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4 text-right">Quick Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => {
                  const isZero = p.stock_quantity === 0;
                  const isLow = p.stock_quantity > 0 && p.stock_quantity <= 5;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF6F0]/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=150&q=80'}
                            alt={p.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                          />
                          <div>
                            <span className="font-bold text-[#3E2723] text-sm block">{p.name}</span>
                            <span className="text-[10px] text-gray-400">{p.origin || 'Single Origin'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-gray-600">{p.sku || '—'}</td>
                      <td className="p-4 font-semibold text-gray-700">{p.category_name || '—'}</td>
                      <td className="p-4">
                        {isZero ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                            Out of Stock
                          </span>
                        ) : isLow ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            Low Stock Alert
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Available
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          defaultValue={p.stock_quantity}
                          key={p.stock_quantity}
                          onBlur={(e) => handleDirectSet(p.id, e.target.value)}
                          className="w-20 bg-[#FAF6F0] border border-[#EADBC8] rounded-lg px-2.5 py-1 text-xs font-extrabold text-[#3E2723] text-center focus:outline-none"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleStockAdjust(p.id, -5)}
                            disabled={p.stock_quantity < 5 || updatingId === p.id}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[#3E2723] text-[11px] font-bold rounded-md disabled:opacity-30"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, -1)}
                            disabled={p.stock_quantity <= 0 || updatingId === p.id}
                            className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-[#3E2723] text-[11px] font-bold rounded-md disabled:opacity-30"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, 1)}
                            disabled={updatingId === p.id}
                            className="px-2 py-1 bg-[#FAF6F0] hover:bg-[#6F4E37] hover:text-white text-[#3E2723] text-[11px] font-bold rounded-md border border-[#EADBC8]"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, 10)}
                            disabled={updatingId === p.id}
                            className="px-2 py-1 bg-[#3E2723] hover:bg-[#6F4E37] text-white text-[11px] font-bold rounded-md"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
