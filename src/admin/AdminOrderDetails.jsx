import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Save, 
  Store as StoreIcon,
  CreditCard
} from 'lucide-react';
import api from '../services/api';

export default function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState({ type: '', text: '' });

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/${id}`);
      const o = res.data.order;
      setOrder(o);
      setOrderStatus(o.order_status);
      setPaymentStatus(o.payment_status);
    } catch (err) {
      console.error('Failed to load order', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setFeedbackMsg({ type: '', text: '' });
    setUpdating(true);

    try {
      const res = await api.put(`/orders/${id}/status`, {
        order_status: orderStatus,
        payment_status: paymentStatus,
      });
      setOrder(res.data.order);
      setFeedbackMsg({ type: 'success', text: `Order status updated to "${orderStatus}" successfully.` });
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update order status.' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-xs font-bold text-[#6B4A3A]">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4 font-body">
        <h2 className="font-display text-xl font-bold text-[#351B38]">Order Not Found</h2>
        <Link to="/admin/orders" className="inline-block px-6 py-2.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold rounded-md uppercase tracking-wider">
          Back to Orders
        </Link>
      </div>
    );
  }

  const statuses = [
    'Pending',
    'Confirmed',
    'Preparing',
    'Ready',
    'Out for Delivery',
    'Completed',
    'Cancelled',
  ];

  const isPickup = order.order_type === 'pickup';

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-[#2A1B17] font-body pb-12">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between border-b border-[#E8DED2] pb-4">
        <Link
          to="/admin/orders"
          className="text-xs font-bold text-[#4B274F] hover:underline flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <span className="text-xs font-mono font-bold text-[#351B38]">Order Reference: #{order.id}</span>
      </div>

      {feedbackMsg.text && (
        <div className={`p-4 rounded-md text-xs font-semibold ${
          feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {feedbackMsg.text}
        </div>
      )}

      {/* Main Order Header Card */}
      <div className="bg-white rounded-md border border-[#E8DED2] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#4B274F] block">
            {isPickup ? 'Store Pickup Order' : 'Nationwide Doorstep Delivery'}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl text-[#351B38]">
            Order {order.order_number}
          </h1>
          <span className="text-xs text-[#6B4A3A] block mt-1">
            Placed on {new Date(order.created_at).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-[#E8DED2] text-[#4B274F] text-xs font-bold uppercase rounded-md">
            {order.order_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Items & Fulfillment */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Order Items Table */}
          <div className="bg-white rounded-md border border-[#E8DED2] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#E8DED2] bg-[#F5F0E8] font-bold text-xs uppercase text-[#351B38]">
              Ordered Items ({order.items?.length || 0})
            </div>
            <div className="divide-y divide-[#E8DED2]">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || '/placeholder-coffee.jpg'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md border border-[#E8DED2] bg-[#F5F0E8]"
                    />
                    <div>
                      <span className="font-bold text-[#2A1B17] block">{item.name}</span>
                      <span className="text-[11px] text-[#6B4A3A]">Rs. {item.price?.toLocaleString()} × {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-[#4B274F]">
                    Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 bg-[#F5F0E8] border-t border-[#E8DED2] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B4A3A]">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#2A1B17]">Rs. {order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6B4A3A]">
                <span>Delivery Fee:</span>
                <span className="font-semibold text-[#2A1B17]">Rs. {order.delivery_fee?.toLocaleString() || '0'}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#351B38] pt-2 border-t border-[#E8DED2]">
                <span>Total Amount:</span>
                <span>Rs. {order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Customer & Fulfillment Info */}
          <div className="bg-white rounded-md border border-[#E8DED2] p-6 shadow-xs space-y-4">
            <h3 className="font-display text-lg text-[#351B38] border-b border-[#E8DED2] pb-2">
              Customer &amp; Fulfillment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#2A1B17]">
                  <User className="w-4 h-4 text-[#4B274F]" />
                  <span className="font-bold">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-2 text-[#2A1B17]">
                  <Phone className="w-4 h-4 text-[#4B274F]" />
                  <span className="font-mono">{order.customer_phone}</span>
                </div>
                {order.customer_email && (
                  <div className="flex items-center gap-2 text-[#2A1B17]">
                    <Mail className="w-4 h-4 text-[#4B274F]" />
                    <span>{order.customer_email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-[#2A1B17]">
                  {isPickup ? <StoreIcon className="w-4 h-4 text-[#4B274F] shrink-0 mt-0.5" /> : <MapPin className="w-4 h-4 text-[#4B274F] shrink-0 mt-0.5" />}
                  <div>
                    <span className="font-bold block">{isPickup ? 'Pickup Store:' : 'Delivery Address:'}</span>
                    <p className="text-[#6B4A3A] leading-relaxed">
                      {isPickup ? (order.store_name || 'Selected Store') : `${order.delivery_address || ''}, ${order.city || ''}`}
                    </p>
                  </div>
                </div>
                {order.notes && (
                  <div className="p-3 bg-[#F5F0E8] rounded-md border border-[#E8DED2] text-[11px] text-[#6B4A3A]">
                    <strong>Notes:</strong> {order.notes}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: Admin Action Controls */}
        <div className="space-y-6">
          <form onSubmit={handleStatusUpdate} className="bg-white rounded-md border border-[#E8DED2] p-6 shadow-xs space-y-4">
            <h3 className="font-display text-lg text-[#351B38] border-b border-[#E8DED2] pb-2">
              Update Order Status
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2A1B17]">Fulfillment Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md p-2.5 text-xs text-[#2A1B17] font-semibold focus:outline-none focus:border-[#4B274F]"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#2A1B17]">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md p-2.5 text-xs text-[#2A1B17] font-semibold focus:outline-none focus:border-[#4B274F]"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Pending Verification">Pending Verification</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-3 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-wider rounded-md transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {updating ? 'Saving...' : 'Save Order Changes'}
            </button>
          </form>

          {/* Payment Method Overview */}
          <div className="bg-white rounded-md border border-[#E8DED2] p-6 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#351B38] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#4B274F]" /> Payment Information
            </h4>
            <div className="space-y-1 text-[#6B4A3A]">
              <p><strong>Method:</strong> {order.payment_method}</p>
              <p><strong>Current Status:</strong> <span className="font-bold text-[#2A1B17]">{order.payment_status}</span></p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
