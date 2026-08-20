import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp, 
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse font-body">
        <div className="h-12 bg-white rounded-md w-1/3 border border-[#E8DED2]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-white border border-[#E8DED2] rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const recentOrders = stats?.recent_orders || [];
  const topProducts = stats?.top_products || [];
  const salesByDay = stats?.sales_by_day || [];
  const lowStock = stats?.low_stock_items || [];

  return (
    <div className="space-y-8 text-[#2A1B17] font-body">
      
      {/* Top Greeting & Sync Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DED2] pb-6">
        <div className="space-y-1">
          <h1 className="font-display text-2xl sm:text-3xl text-[#351B38]">
            Good morning, Admin
          </h1>
          <p className="text-xs text-[#6B4A3A] font-normal">
            Here's what's happening with your store today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardStats}
            className="px-3.5 py-2 bg-white border border-[#E8DED2] text-xs font-semibold text-[#2A1B17] hover:bg-[#F5F0E8] rounded-md flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#4B274F]" /> Refresh Data
          </button>
          <Link
            to="/admin/products/add"
            className="px-4 py-2 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-xs"
          >
            + Add Product
          </Link>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="p-6 bg-white border border-[#E8DED2] rounded-md space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B4A3A]">
            <span className="text-[11px] uppercase font-bold tracking-wider">Total Sales</span>
            <DollarSign className="w-4 h-4 text-[#4B274F]" />
          </div>
          <div className="font-bold text-2xl text-[#351B38]">
            Rs. {overview.total_sales?.toLocaleString() || '0'}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live revenue collected
          </span>
        </div>

        <div className="p-6 bg-white border border-[#E8DED2] rounded-md space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B4A3A]">
            <span className="text-[11px] uppercase font-bold tracking-wider">Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#4B274F]" />
          </div>
          <div className="font-bold text-2xl text-[#351B38]">
            {overview.total_orders || 0}
          </div>
          <span className="text-[10px] text-[#6B4A3A] font-normal">
            Across all fulfillment stages
          </span>
        </div>

        <div className="p-6 bg-white border border-[#E8DED2] rounded-md space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B4A3A]">
            <span className="text-[11px] uppercase font-bold tracking-wider">Active Products</span>
            <Package className="w-4 h-4 text-[#4B274F]" />
          </div>
          <div className="font-bold text-2xl text-[#351B38]">
            {overview.total_products || 0}
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">
            Catalog fully indexed
          </span>
        </div>

        <div className="p-6 bg-white border border-[#E8DED2] rounded-md space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[#6B4A3A]">
            <span className="text-[11px] uppercase font-bold tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-[#4B274F]" />
          </div>
          <div className="font-bold text-2xl text-[#351B38]">
            {overview.total_customers || 0}
          </div>
          <span className="text-[10px] text-[#6B4A3A] font-normal">
            Registered store accounts
          </span>
        </div>

      </div>

      {/* 7-Day Revenue Trend Chart & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Revenue Trend (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-[#E8DED2] rounded-md p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8DED2] pb-3">
            <div>
              <h3 className="font-semibold text-base text-[#351B38]">
                Revenue Trends (Last 7 Days)
              </h3>
              <span className="text-[11px] text-[#6B4A3A] font-normal">Daily total gross volume</span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {salesByDay.map((day, idx) => {
              const maxVal = Math.max(...salesByDay.map((d) => d.total || 0), 1000);
              const heightPct = Math.max(8, (day.total / maxVal) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[9px] font-semibold text-[#6B4A3A] opacity-0 group-hover:opacity-100 transition-opacity">
                    Rs. {day.total?.toLocaleString()}
                  </span>
                  <div
                    className="w-full bg-[#E8DED2] group-hover:bg-[#4B274F] rounded-md transition-all duration-300 relative"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-semibold text-[#2A1B17]">
                    {day.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alerts (Span 4) */}
        <div className="lg:col-span-4 bg-white border border-[#E8DED2] rounded-md p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8DED2] pb-3">
            <h3 className="font-semibold text-base text-[#351B38] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Stock Warnings
            </h3>
            <Link to="/admin/inventory" className="text-[11px] text-[#4B274F] font-bold hover:underline">
              Manage
            </Link>
          </div>

          {lowStock.length === 0 ? (
            <div className="py-8 text-center text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> All product inventory levels healthy
            </div>
          ) : (
            <div className="divide-y divide-[#E8DED2] space-y-2">
              {lowStock.slice(0, 5).map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <span className="font-semibold text-[#2A1B17] block truncate">{item.name}</span>
                    <span className="text-[10px] text-[#6B4A3A] font-normal">SKU: {item.sku || 'N/A'}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold rounded-md shrink-0">
                    {item.stock_quantity} left
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Recent Orders Table & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Orders (Span 8) */}
        <div className="lg:col-span-8 bg-white border border-[#E8DED2] rounded-md p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E8DED2] pb-3">
            <h3 className="font-semibold text-base text-[#351B38]">
              Recent Customer Orders
            </h3>
            <Link to="/admin/orders" className="text-xs text-[#4B274F] font-bold hover:underline flex items-center gap-1">
              View All Orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6B4A3A] font-normal">No recent orders.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E8DED2] bg-[#F5F0E8] text-[10px] uppercase tracking-wider text-[#351B38] font-bold">
                    <th className="p-2.5 rounded-l-md">Order #</th>
                    <th className="p-2.5">Customer</th>
                    <th className="p-2.5">Total</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5 text-right rounded-r-md">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DED2]">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#F5F0E8]/50 transition-colors">
                      <td className="p-2.5 font-mono font-semibold text-[#4B274F]">{o.order_number}</td>
                      <td className="p-2.5 font-medium text-[#2A1B17]">{o.customer_name}</td>
                      <td className="p-2.5 font-bold text-[#351B38]">Rs. {o.total?.toLocaleString()}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 bg-[#E8DED2] text-[#4B274F] text-[10px] font-bold rounded-md uppercase">
                          {o.order_status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <Link
                          to={`/admin/orders/${o.id}`}
                          className="text-[#4B274F] hover:underline font-bold"
                        >
                          Details &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Products (Span 4) */}
        <div className="lg:col-span-4 bg-white border border-[#E8DED2] rounded-md p-6 space-y-4 shadow-xs">
          <div className="border-b border-[#E8DED2] pb-3">
            <h3 className="font-semibold text-base text-[#351B38]">
              Top Sellers
            </h3>
            <span className="text-[11px] text-[#6B4A3A] font-normal">Highest units ordered</span>
          </div>

          <div className="divide-y divide-[#E8DED2] space-y-3">
            {topProducts.slice(0, 5).map((p) => (
              <div key={p.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image || '/placeholder-coffee.jpg'}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-md border border-[#E8DED2]"
                  />
                  <div>
                    <span className="font-semibold text-[#2A1B17] block truncate max-w-36">{p.name}</span>
                    <span className="text-[10px] text-[#6B4A3A] font-normal">Rs. {p.price?.toLocaleString()}</span>
                  </div>
                </div>
                <span className="font-bold text-xs text-[#4B274F]">{p.units_sold || 0} sold</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
