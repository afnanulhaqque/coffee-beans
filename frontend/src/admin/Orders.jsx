import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  ArrowUpDown,
  Filter,
  Truck,
  Store as StoreIcon
} from 'lucide-react';
import api from '../services/api';
import Pagination from '../components/Pagination';

export default function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [orderType, setOrderType] = useState(searchParams.get('order_type') || 'all');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        search: search.trim(),
        status: status === 'all' ? '' : status,
        order_type: orderType === 'all' ? '' : orderType,
        page,
        limit: 15,
      };
      const res = await api.get('/orders', { params });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error('Failed to load admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status, orderType, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleStatusFilter = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
    const next = new URLSearchParams(searchParams);
    if (newStatus === 'all') next.delete('status');
    else next.set('status', newStatus);
    next.set('page', '1');
    setSearchParams(next);
  };

  const statuses = [
    'all',
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Completed',
    'Cancelled',
  ];

  return (
    <div className="space-y-6 text-[#1C1714]">
      {/* Header */}
      <div className="border-b border-[#E5E5E0] pb-6">
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#24150F]">
          Customer Orders Management
        </h1>
        <p className="text-xs text-[#756A62] mt-1">
          Review, fulfill, and track guest coffee orders across Pakistan ({totalCount} total)
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-[#E5E5E0] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, customer name, phone, city, store..."
              className="w-full pl-9 pr-4 py-2 bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm text-xs text-[#24150F] focus:outline-hidden focus:border-[#24150F]"
            />
            <Search className="w-4 h-4 text-[#756A62] absolute left-3 top-2.5" />
          </form>

          <div className="flex items-center gap-3">
            {/* Order Type Toggle */}
            <div className="flex rounded-sm border border-[#E5E5E0] p-0.5 bg-[#F7F7F5] text-xs">
              {['all', 'delivery', 'pickup'].map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setOrderType(t);
                    setPage(1);
                  }}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-xs transition-colors ${
                    orderType === t ? 'bg-[#24150F] text-white' : 'text-[#5A3825] hover:text-[#24150F]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-[#756A62] font-medium">
              Showing {orders.length} of {totalCount} records
            </span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusFilter(s)}
              className={`px-3 py-1.5 rounded-sm font-bold uppercase tracking-wider text-[10px] whitespace-nowrap transition-colors ${
                status === s
                  ? 'bg-[#24150F] text-[#F6F1E9]'
                  : 'bg-[#F7F7F5] text-[#5A3825] hover:bg-[#EDE4D8]'
              }`}
            >
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm border border-[#E5E5E0] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-[#756A62]">Loading customer orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#756A62]">No orders found for this status.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F7F5] border-b border-[#E5E5E0] text-[10px] uppercase font-bold text-[#756A62] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Fulfillment Info</th>
                  <th className="py-3.5 px-4">Total</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E0]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#F7F7F5]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#24150F]">
                      <Link to={`/admin/orders/${o.id}`} className="hover:text-[#B8895B]">
                        {o.order_number}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-[#756A62] whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#24150F] block">{o.customer_name}</span>
                      <span className="text-[10px] text-[#756A62]">{o.customer_phone}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs inline-flex items-center gap-1 ${
                        o.order_type === 'pickup' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {o.order_type === 'pickup' ? <StoreIcon className="w-2.5 h-2.5" /> : <Truck className="w-2.5 h-2.5" />}
                        {o.order_type || 'delivery'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#5A3825] max-w-[200px] truncate">
                      {o.order_type === 'pickup' ? o.store_name || 'Store Pickup' : `${o.city || ''} ${o.delivery_address || ''}`}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#24150F] whitespace-nowrap">
                      Rs. {o.total?.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold text-[#5A3825] block">{o.payment_method}</span>
                      <span className="text-[9px] text-[#756A62]">{o.payment_status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#EDE4D8] text-[#5A3825] text-[10px] font-bold uppercase rounded-sm whitespace-nowrap">
                        {o.order_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/admin/orders/${o.id}`}
                        className="px-3 py-1 bg-[#F7F7F5] hover:bg-[#24150F] hover:text-[#F6F1E9] text-[#24150F] border border-[#E5E5E0] text-[11px] font-bold rounded-sm transition-colors inline-block"
                      >
                        Manage
                      </Link>
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
