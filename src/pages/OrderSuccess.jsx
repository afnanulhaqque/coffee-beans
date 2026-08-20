import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  MapPin, 
  Truck, 
  Store as StoreIcon, 
  Phone, 
  Mail, 
  ArrowRight, 
  Calendar,
  CreditCard
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
      <div className="pt-40 pb-24 text-center text-xs font-semibold text-[#6B4A3A] font-body">
        Loading your order confirmation...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-40 pb-24 text-center space-y-4 max-w-md mx-auto px-4 font-body">
        <h2 className="font-display text-3xl text-[#351B38]">Order Not Found</h2>
        <p className="text-xs text-[#6B4A3A] font-normal">We could not locate this order reference.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-widest rounded-md">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isPickup = order.order_type === 'pickup';

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 font-body text-[#2A1B17]">
      
      {/* Confirmation Banner */}
      <div className="text-center space-y-3 bg-white border border-[#E8DED2] rounded-md p-8 sm:p-12 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-[#F5F0E8] text-[#4B274F] flex items-center justify-center mx-auto border border-[#E8DED2] shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          THANK YOU FOR YOUR ORDER
        </span>

        <h1 className="font-display text-3xl sm:text-4xl text-[#351B38]">
          Order Confirmed!
        </h1>

        <p className="text-xs sm:text-sm text-[#6B4A3A] font-normal max-w-md mx-auto leading-relaxed">
          Your order has been received. Our barista and culinary team is preparing your selection.
        </p>

        {/* Highlighted Order Number */}
        <div className="pt-3 inline-block px-5 py-3 bg-[#F5F0E8] border border-[#E8DED2] rounded-md">
          <span className="text-[10px] uppercase font-medium text-[#6B4A3A] block">Your Order Number</span>
          <span className="font-mono font-bold text-base sm:text-lg text-[#4B274F] tracking-wide">{order.order_number}</span>
        </div>
      </div>

      {/* Order Info Details Grid */}
      <div className="bg-white border border-[#E8DED2] rounded-md p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E8DED2] pb-4">
          <h3 className="font-display text-xl text-[#351B38]">
            Order Information
          </h3>
          <span className="px-3 py-1 bg-[#F5F0E8] border border-[#E8DED2] text-[11px] font-semibold uppercase tracking-wider text-[#4B274F] rounded-md">
            {order.order_status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#2A1B17]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#4B274F]" />
              <div>
                <span className="text-[#6B4A3A] block text-[11px]">Placed On</span>
                <span className="font-semibold">{new Date(order.created_at || Date.now()).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#4B274F]" />
              <div>
                <span className="text-[#6B4A3A] block text-[11px]">Payment Method</span>
                <span className="font-semibold">{order.payment_method}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              {isPickup ? <StoreIcon className="w-4 h-4 text-[#4B274F] shrink-0 mt-0.5" /> : <Truck className="w-4 h-4 text-[#4B274F] shrink-0 mt-0.5" />}
              <div>
                <span className="text-[#6B4A3A] block text-[11px]">{isPickup ? 'Store Pickup At' : 'Delivery Address'}</span>
                <span className="font-semibold leading-relaxed">
                  {isPickup ? (order.store_name || 'Selected Store') : `${order.delivery_address || ''}, ${order.city || ''}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#4B274F]" />
              <div>
                <span className="text-[#6B4A3A] block text-[11px]">Contact Phone</span>
                <span className="font-semibold font-mono">{order.customer_phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div className="border-t border-[#E8DED2] pt-4 space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[#351B38] block">
            Items Ordered ({order.items?.length || 0})
          </span>

          <div className="divide-y divide-[#E8DED2]">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#F5F0E8] rounded-md overflow-hidden shrink-0 border border-[#E8DED2]">
                    <img src={item.image || '/placeholder-coffee.jpg'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#2A1B17] block">{item.name}</span>
                    <span className="text-[#6B4A3A] font-normal">{item.quantity} × Rs. {item.price?.toLocaleString()}</span>
                  </div>
                </div>
                <span className="font-bold text-[#4B274F]">
                  Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="border-t border-[#E8DED2] pt-3 flex items-center justify-between font-bold text-sm sm:text-base text-[#351B38]">
            <span>Order Total</span>
            <span className="text-[#351B38]">Rs. {order.total?.toLocaleString()}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8DED2] flex flex-col sm:flex-row gap-3">
          <Link
            to="/shop"
            className="flex-1 py-3.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-widest text-center rounded-md transition-colors shadow-xs"
          >
            Continue Shopping
          </Link>
          <Link
            to="/"
            className="flex-1 py-3.5 bg-transparent border border-[#E8DED2] hover:bg-[#F5F0E8] text-[#2A1B17] text-xs font-semibold uppercase tracking-widest text-center rounded-md transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>

    </div>
  );
}
