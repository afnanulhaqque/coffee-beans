import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Package, 
  CheckCircle2, 
  Save, 
  AlertCircle,
  Truck,
  Store as StoreIcon,
  Calendar,
  CreditCard,
  FileText
} from 'lucide-react';
import api from '../services/api';

export default function AdminOrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

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
      <div className="max-w-4xl mx-auto py-20 text-center text-xs font-bold text-[#756A62]">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="font-display text-xl font-bold text-[#24150F]">Order Not Found</h2>
        <Link to="/admin/orders" className="inline-block px-6 py-2.5 bg-[#24150F] text-white text-xs font-bold rounded-sm uppercase tracking-wider">
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
    <div className="max-w-4xl mx-auto space-y-6 text-[#1C1714] font-body">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E5E0] pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="p-2 rounded-sm bg-white border border-[#E5E5E0] text-[#24150F] hover:bg-[#F7F7F5]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-mono text-2xl font-bold text-[#24150F]">{order.order_number}</h1>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                isPickup ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
              }`}>
                {order.order_type || 'delivery'}
              </span>
            </div>
            <p className="text-xs text-[#756A62]">
              Placed on {new Date(order.created_at).toLocaleString()} (Guest Order)
            </p>
          </div>
        </div>
      </div>

      {feedbackMsg.text && (
        <div
          className={`p-4 rounded-sm text-xs font-semibold flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Status Workflow Action Box */}
      <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E5E5E0] shadow-xs space-y-4">
        <h2 className="font-display text-base font-bold text-[#24150F] pb-2 border-b border-[#E5E5E0] flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#B8895B]" /> Manage Fulfillment &amp; Payment Status
        </h2>

        <form onSubmit={handleStatusUpdate} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-[#24150F] mb-1">Order Status</label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2.5 text-xs font-bold text-[#24150F] focus:outline-hidden"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#24150F] mb-1">Payment Status</label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full bg-[#F7F7F5] border border-[#E5E5E0] rounded-sm px-3.5 py-2.5 text-xs font-bold text-[#24150F] focus:outline-hidden"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="py-2.5 px-6 bg-[#24150F] hover:bg-[#5A3825] text-white text-xs font-bold rounded-sm shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 h-10.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {updating ? 'Saving...' : 'Update Status'}
          </button>
        </form>
      </div>

      {/* Grid: Customer Details & Fulfillment Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Customer Information */}
        <div className="bg-white p-6 rounded-sm border border-[#E5E5E0] shadow-xs space-y-3">
          <h3 className="font-display text-base font-bold text-[#24150F] flex items-center gap-2 border-b border-[#E5E5E0] pb-2">
            <User className="w-4 h-4 text-[#B8895B]" /> Customer Information
          </h3>
          <div className="space-y-1.5 text-xs text-[#5A3825]">
            <p><strong>Name:</strong> {order.customer_name}</p>
            <p><strong>Phone:</strong> {order.customer_phone}</p>
            <p><strong>Email:</strong> {order.customer_email || 'Not Provided'}</p>
            <p><strong>Checkout Type:</strong> Guest Checkout (No Account)</p>
          </div>
        </div>

        {/* Fulfillment / Delivery Location */}
        <div className="bg-white p-6 rounded-sm border border-[#E5E5E0] shadow-xs space-y-3">
          <h3 className="font-display text-base font-bold text-[#24150F] flex items-center gap-2 border-b border-[#E5E5E0] pb-2">
            {isPickup ? <StoreIcon className="w-4 h-4 text-[#B8895B]" /> : <MapPin className="w-4 h-4 text-[#B8895B]" />}
            {isPickup ? 'Store Pickup Details' : 'Delivery Destination Details'}
          </h3>
          <div className="space-y-1.5 text-xs text-[#5A3825]">
            <p><strong>Order Type:</strong> <span className="uppercase font-bold">{order.order_type}</span></p>
            {isPickup ? (
              <p><strong>Selected Store:</strong> {order.store_name || 'Selected Coffee Bean Store'}</p>
            ) : (
              <>
                <p><strong>Address:</strong> {order.delivery_address}</p>
                <p><strong>City / Sector:</strong> {order.city} {order.area ? `(${order.area})` : ''}</p>
                {order.postal_code && <p><strong>Postal Code:</strong> {order.postal_code}</p>}
              </>
            )}
            {order.notes && (
              <p className="pt-1 text-[#756A62]"><strong>Customer Notes:</strong> {order.notes}</p>
            )}
          </div>
        </div>

      </div>

      {/* Ordered Items Table */}
      <div className="bg-white rounded-sm border border-[#E5E5E0] shadow-xs p-6 space-y-4">
        <h3 className="font-display text-base font-bold text-[#24150F] flex items-center gap-2 border-b border-[#E5E5E0] pb-2">
          <Package className="w-4 h-4 text-[#B8895B]" /> Ordered Items ({order.items?.length || 0})
        </h3>

        <div className="divide-y divide-[#E5E5E0]">
          {order.items?.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={item.product_image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=100&q=80'}
                  alt={item.product_name}
                  className="w-12 h-12 object-cover rounded-xs border border-[#E5E5E0]"
                />
                <div>
                  <span className="font-bold text-[#24150F] block">{item.product_name}</span>
                  <span className="text-[11px] text-[#756A62]">
                    Unit Price: Rs. {item.price?.toLocaleString()} × Qty: {item.quantity}
                  </span>
                </div>
              </div>
              <span className="font-bold text-[#24150F]">
                Rs. {item.subtotal?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="border-t border-[#E5E5E0] pt-4 space-y-2 text-xs text-[#5A3825] max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold text-[#24150F]">Rs. {order.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>{isPickup ? 'Pickup Fee:' : 'Delivery Fee:'}</span>
            <span className="font-semibold text-[#24150F]">
              {order.delivery_fee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `Rs. ${order.delivery_fee}`}
            </span>
          </div>
          <div className="border-t border-[#E5E5E0] pt-2 flex justify-between font-bold text-base text-[#24150F]">
            <span>Total:</span>
            <span>Rs. {order.total?.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
