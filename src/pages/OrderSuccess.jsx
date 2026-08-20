import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Package, 
  MapPin, 
  Truck, 
  Store as StoreIcon, 
  Phone, 
  Mail, 
  ArrowRight, 
  Calendar,
  CreditCard,
  FileText
} from 'lucide-react';
import api from '../services/api';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Failed to load order receipt', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-40 pb-24 text-center text-xs font-semibold text-[#756A62] font-body">
        Loading your order confirmation...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-40 pb-24 text-center space-y-4 max-w-md mx-auto px-4 font-body">
        <h2 className="font-display text-3xl text-[#24150F]">Order Not Found</h2>
        <p className="text-xs text-[#756A62] font-normal">We could not locate this order reference.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-[#24150F] text-white text-xs font-semibold uppercase tracking-widest rounded-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isPickup = order.order_type === 'pickup';

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 font-body text-[#1C1714]">
      
      {/* Confirmation Banner */}
      <div className="text-center space-y-3 bg-white border border-[#EDE4D8] rounded-sm p-8 sm:p-12 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-[#B8895B] block">
          THANK YOU FOR YOUR ORDER
        </span>

        <h1 className="font-display text-3xl sm:text-4xl text-[#24150F]">
          Order Confirmed!
        </h1>

        <p className="text-xs sm:text-sm text-[#756A62] font-normal max-w-md mx-auto leading-relaxed">
          Your order has been received. Our barista and culinary team is preparing your selection.
        </p>

        {/* Highlighted Order Number */}
        <div className="pt-3 inline-block px-5 py-3 bg-[#F6F1E9] border border-[#EDE4D8] rounded-sm">
          <span className="text-[10px] uppercase font-medium text-[#756A62] block">Your Order Number</span>
          <span className="font-mono font-bold text-base sm:text-lg text-[#24150F] tracking-wide">{order.order_number}</span>
        </div>
      </div>

      {/* Order Info Details Grid */}
      <div className="bg-white border border-[#EDE4D8] rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#EDE4D8] pb-4">
          <h3 className="font-display text-xl text-[#24150F]">
            Order Information
          </h3>
          <span className="px-3 py-1 bg-[#F6F1E9] border border-[#EDE4D8] text-[11px] font-semibold uppercase tracking-wider text-[#24150F] rounded-xs">
            {order.order_status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#5A3825]">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#756A62] block">Customer Name</span>
            <p className="font-bold text-sm text-[#24150F]">{order.customer_name}</p>
            <p className="font-normal text-[#756A62]">Phone: {order.customer_phone}</p>
            {order.customer_email && !order.customer_email.includes('@guest.') && (
              <p className="font-normal text-[#756A62]">Email: {order.customer_email}</p>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#756A62] block">
              {isPickup ? 'Pickup Location' : 'Delivery Destination'}
            </span>
            <p className="font-bold text-sm text-[#24150F] flex items-center gap-1.5">
              {isPickup ? <StoreIcon className="w-4 h-4 text-[#B8895B]" /> : <Truck className="w-4 h-4 text-[#B8895B]" />}
              {isPickup ? 'Store Pickup' : 'Doorstep Delivery'}
            </p>
            {isPickup ? (
              <p className="font-normal text-[#24150F]">{order.store_name || 'Selected Coffee Bean Lounge'}</p>
            ) : (
              <>
                <p className="font-normal text-[#24150F]">{order.delivery_address}</p>
                <p className="font-normal text-[#756A62]">{order.city}, Pakistan</p>
              </>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#756A62] block">Payment Method</span>
            <p className="font-bold text-sm text-[#24150F]">{order.payment_method}</p>
            <p className="font-normal text-[#756A62]">Payment Status: <strong className="text-amber-700 font-semibold">{order.payment_status}</strong></p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-semibold text-[#756A62] block">Order Date &amp; Time</span>
            <p className="font-bold text-sm text-[#24150F]">
              {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Today'}
            </p>
            {order.notes && (
              <p className="font-normal text-[#756A62]">Notes: {order.notes}</p>
            )}
          </div>
        </div>

        {/* Ordered Selections List */}
        <div className="pt-4 border-t border-[#EDE4D8] space-y-3">
          <span className="text-[10px] uppercase font-semibold text-[#B8895B] block tracking-wider">
            Ordered Items ({order.items?.length || 0})
          </span>

          <div className="divide-y divide-[#EDE4D8]">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product_image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=100&q=80'}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded-xs border border-[#EDE4D8]"
                  />
                  <div>
                    <span className="font-semibold text-[#24150F] block">{item.product_name}</span>
                    <span className="text-[11px] text-[#756A62] font-normal">{item.quantity} × Rs. {item.price?.toLocaleString()}</span>
                  </div>
                </div>
                <span className="font-semibold text-[#24150F]">
                  Rs. {item.subtotal?.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="pt-4 border-t border-[#EDE4D8] space-y-2 text-xs text-[#5A3825] max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="font-normal">Items Subtotal:</span>
              <span className="font-semibold text-[#24150F]">Rs. {order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-normal">{isPickup ? 'Pickup Fee:' : 'Delivery Fee:'}</span>
              <span className="font-semibold text-[#24150F]">
                {order.delivery_fee === 0 ? <span className="text-emerald-700 font-semibold">FREE</span> : `Rs. ${order.delivery_fee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#EDE4D8] flex justify-between font-bold text-base text-[#24150F]">
              <span>Total:</span>
              <span>Rs. {order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping Action */}
      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-md"
        >
          Continue Shopping <ArrowRight className="w-4 h-4 text-[#B8895B]" />
        </Link>
      </div>

    </div>
  );
}
