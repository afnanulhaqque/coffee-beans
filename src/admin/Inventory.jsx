import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import api from '../services/api';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    try {
      const res = await api.put(`/admin/inventory/${productId}`, { adjustment: delta });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? res.data.product : p))
      );
    } catch (err) {
      alert('Failed to update stock: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDirectSet = async (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty < 0) return;

    try {
      const res = await api.put(`/admin/inventory/${productId}`, { stock_quantity: qty });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? res.data.product : p))
      );
    } catch (err) {
      alert('Failed to set stock: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="space-y-6 text-[#2A1B17] font-body">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
          Inventory &amp; Stock Management
        </h1>
        <p className="text-xs text-[#6B4A3A] mt-1">
          Monitor product availability and perform rapid stock count adjustments
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-md border border-[#E8DED2] shadow-xs flex flex-col md:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#6B4A3A] absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md pl-10 pr-4 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3 py-2 text-xs font-bold text-[#351B38] focus:outline-none"
        >
          <option value="all">All Inventory</option>
          <option value="in_stock">In Stock (&gt; 5)</option>
          <option value="low_stock">Low Stock (1 - 5)</option>
          <option value="out_of_stock">Out of Stock (0)</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-md border border-[#E8DED2] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-[#6B4A3A]">Loading inventory status...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6B4A3A]">No inventory items found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F0E8] text-[#351B38] font-bold uppercase text-[10px] border-b border-[#E8DED2]">
                <tr>
                  <th className="p-4">Product Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Current Stock</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Quick Stock Modifier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DED2]">
                {products.map((p) => {
                  const isLow = p.stock_quantity > 0 && p.stock_quantity <= 5;
                  const isOut = p.stock_quantity <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || '/placeholder-coffee.jpg'}
                            alt={p.name}
                            className="w-10 h-10 object-cover rounded-md border border-[#E8DED2] bg-[#F5F0E8]"
                          />
                          <div>
                            <span className="font-bold text-[#2A1B17] block">{p.name}</span>
                            <span className="text-[10px] text-[#6B4A3A] font-mono">SKU: {p.sku || 'N/A'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-[#6B4A3A] font-medium">{p.category_name || 'Coffee'}</td>

                      <td className="p-4 font-bold text-[#4B274F]">Rs. {p.price?.toLocaleString()}</td>

                      <td className="p-4">
                        <input
                          type="number"
                          defaultValue={p.stock_quantity}
                          onBlur={(e) => handleDirectSet(p.id, e.target.value)}
                          className="w-20 px-2.5 py-1 bg-[#F5F0E8] border border-[#E8DED2] rounded-md font-mono font-bold text-[#2A1B17] text-xs focus:outline-none focus:border-[#4B274F]"
                        />
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            isOut
                              ? 'bg-red-50 text-red-800'
                              : isLow
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1 border border-[#E8DED2] rounded-md bg-[#F5F0E8] p-0.5">
                          <button
                            onClick={() => handleStockAdjust(p.id, -1)}
                            className="p-1 hover:bg-white text-[#2A1B17] rounded-md transition-colors"
                            title="Minus 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, 5)}
                            className="px-2 py-0.5 text-[10px] font-bold text-[#4B274F] hover:bg-white rounded-md transition-colors"
                            title="Add 5"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, 10)}
                            className="px-2 py-0.5 text-[10px] font-bold text-[#4B274F] hover:bg-white rounded-md transition-colors"
                            title="Add 10"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleStockAdjust(p.id, 1)}
                            className="p-1 hover:bg-white text-[#2A1B17] rounded-md transition-colors"
                            title="Plus 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
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
