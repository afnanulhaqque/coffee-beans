import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Truck, 
  Store as StoreIcon, 
  Lock, 
  AlertCircle, 
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export default function Checkout() {
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'pickup'
  const [stores, setStores] = useState([]);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    city: 'Islamabad',
    area: '',
    postal_code: '',
    store_id: '',
    store_name: '',
    notes: '',
    payment_method: 'Cash on Delivery (COD)',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch stores for pickup dropdown
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await api.get('/stores');
        const list = res.data.stores || [];
        setStores(list);
        if (list.length > 0) {
          setFormData((prev) => ({
            ...prev,
            store_id: prev.store_id || list[0].id,
            store_name: prev.store_name || list[0].name,
          }));
        }
      } catch (err) {
        console.error('Failed to load stores for pickup', err);
      }
    };
    fetchStores();
  }, []);

  // Update payment method when order type switches
  useEffect(() => {
    if (orderType === 'pickup') {
      setFormData((prev) => ({
        ...prev,
        payment_method: 'Cash on Pickup',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        payment_method: 'Cash on Delivery (COD)',
      }));
    }
  }, [orderType]);

  if (cart.length === 0) {
    return (
      <div className="pt-36 pb-24 max-w-md mx-auto px-6 text-center space-y-4 font-body">
        <h2 className="font-display text-3xl text-[#351B38]">No Items to Checkout</h2>
        <p className="text-xs text-[#6B4A3A] font-normal">Your shopping bag is empty.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-widest rounded-md transition-colors">
          Return to Shop
        </Link>
      </div>
    );
  }

  const FREE_SHIPPING_THRESHOLD = 3500;
  const deliveryFee = orderType === 'pickup' ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const grandTotal = subtotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'store_id') {
      const selected = stores.find((s) => String(s.id) === String(value));
      setFormData((prev) => ({
        ...prev,
        store_id: value,
        store_name: selected ? selected.name : '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.customer_phone.trim()) {
      setError('Please provide your valid phone number.');
      return;
    }
    if (orderType === 'delivery' && !formData.delivery_address.trim()) {
      setError('Please provide your complete delivery street address.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer_name: formData.customer_name.trim(),
        customer_email: formData.customer_email.trim() || undefined,
        customer_phone: formData.customer_phone.trim(),
        order_type: orderType,
        delivery_address: orderType === 'delivery' ? formData.delivery_address.trim() : undefined,
        city: orderType === 'delivery' ? formData.city : undefined,
        area: orderType === 'delivery' ? formData.area.trim() : undefined,
        postal_code: orderType === 'delivery' ? formData.postal_code.trim() : undefined,
        store_id: orderType === 'pickup' ? parseInt(formData.store_id, 10) : undefined,
        store_name: orderType === 'pickup' ? formData.store_name : undefined,
        notes: formData.notes.trim() || undefined,
        payment_method: formData.payment_method,
        items: cart.map((item) => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total: grandTotal,
      };

      const res = await api.post('/orders', payload);
      const orderId = res.data.order?.id || res.data.id;
      
      clearCart();
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.error || 'Failed to place order. Please check details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-10 font-body text-[#2A1B17]">
      
      {/* Header */}
      <div className="border-b border-[#E8DED2] pb-6 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
            GUEST CHECKOUT
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#351B38]">
            Order Checkout
          </h1>
        </div>
        <Link to="/cart" className="text-xs uppercase tracking-wider font-semibold text-[#4B274F] hover:underline flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md flex items-center gap-2 font-normal">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Checkout Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Order Type, Customer Details & Fulfillment Info (Span 7) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* STEP 1: Select Delivery vs Pickup */}
          <div className="bg-white border border-[#E8DED2] rounded-md p-6 sm:p-8 space-y-5 shadow-xs">
            <h2 className="font-display text-xl text-[#351B38] pb-3 border-b border-[#E8DED2]">
              1. Order Type
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Delivery Option */}
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-5 rounded-md border-2 text-left flex items-start gap-4 transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'border-[#4B274F] bg-[#F5F0E8]'
                    : 'border-[#E8DED2] bg-white hover:border-[#4B274F]/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                  orderType === 'delivery' ? 'bg-[#4B274F] text-white' : 'bg-[#E8DED2] text-[#6B4A3A]'
                }`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-sm text-[#2A1B17] block">Doorstep Delivery</span>
                  <p className="text-xs text-[#6B4A3A] font-normal leading-relaxed">
                    Nationwide express courier dispatch to your home or office.
                  </p>
                </div>
              </button>

              {/* Pickup Option */}
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-5 rounded-md border-2 text-left flex items-start gap-4 transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'border-[#4B274F] bg-[#F5F0E8]'
                    : 'border-[#E8DED2] bg-white hover:border-[#4B274F]/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-md flex items-center justify-center shrink-0 ${
                  orderType === 'pickup' ? 'bg-[#4B274F] text-white' : 'bg-[#E8DED2] text-[#6B4A3A]'
                }`}>
                  <StoreIcon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-sm text-[#2A1B17] block">Store Pickup (Free)</span>
                  <p className="text-xs text-[#6B4A3A] font-normal leading-relaxed">
                    Collect fresh and fast from your preferred Coffee Bean branch.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 2: Customer Contact Information */}
          <div className="bg-white border border-[#E8DED2] rounded-md p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="font-display text-xl text-[#351B38] pb-3 border-b border-[#E8DED2]">
              2. Customer Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#2A1B17] mb-1">Full Name *</label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Afnan Ul Haq"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A1B17] mb-1">Phone Number *</label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleChange}
                  required
                  placeholder="0300 1234567"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2A1B17] mb-1">Email Address (Optional)</label>
              <input
                type="email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleChange}
                placeholder="afnan@example.com"
                className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
              />
              <span className="text-[10px] text-[#6B4A3A] mt-1 block font-normal">Order confirmation and dispatch status will be sent here.</span>
            </div>
          </div>

          {/* STEP 3: Delivery Address OR Pickup Store */}
          {orderType === 'delivery' ? (
            <div className="bg-white border border-[#E8DED2] rounded-md p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="font-display text-xl text-[#351B38] pb-3 border-b border-[#E8DED2]">
                3. Delivery Address
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#2A1B17] mb-1">Complete Delivery Address *</label>
                <textarea
                  name="delivery_address"
                  value={formData.delivery_address}
                  onChange={handleChange}
                  required
                  rows="2"
                  placeholder="House / Apartment #, Street #, Sector / Block, Phase"
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2A1B17] mb-1">City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs text-[#2A1B17] font-semibold focus:outline-none focus:border-[#4B274F]"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Gujranwala">Gujranwala</option>
                    <option value="Sialkot">Sialkot</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1B17] mb-1">Area / Sector *</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    placeholder="e.g. F-6, DHA Phase 5, Gulberg III"
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1B17] mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="e.g. 44000"
                    className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A1B17] mb-1">Order Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Special instructions for rider, door code, or landmark..."
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E8DED2] rounded-md p-6 sm:p-8 space-y-4 shadow-xs">
              <h2 className="font-display text-xl text-[#351B38] pb-3 border-b border-[#E8DED2]">
                3. Pickup Store Location
              </h2>

              <div>
                <label className="block text-xs font-semibold text-[#2A1B17] mb-1">Select Coffee Bean Store *</label>
                <select
                  name="store_id"
                  value={formData.store_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-3 text-xs text-[#2A1B17] font-semibold focus:outline-none focus:border-[#4B274F]"
                >
                  {stores.length > 0 ? (
                    stores.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} — {s.address}, {s.city} ({s.opening_hours})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="1">Beverly Centre, Blue Area, F-6 Islamabad</option>
                      <option value="2">Elysium Mall, Sector F-11 Islamabad</option>
                      <option value="3">Bahria Town Civic Centre, Rawalpindi</option>
                      <option value="4">Zamzama Flagship Store, DHA Phase 5 Karachi</option>
                      <option value="5">Gulberg III Artisan Lounge, Lahore</option>
                      <option value="6">Packages Mall Cafe, Lahore</option>
                    </>
                  )}
                </select>
                <span className="text-[10px] text-[#6B4A3A] mt-1.5 block font-normal">
                  Your order will be freshly prepared and held ready for collection under your name and phone number.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2A1B17] mb-1">Pickup Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Estimated arrival time or special packaging instructions..."
                  className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3.5 py-2.5 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Payment Method */}
          <div className="bg-white border border-[#E8DED2] rounded-md p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="font-display text-xl text-[#351B38] pb-3 border-b border-[#E8DED2]">
              4. Payment Method
            </h2>

            <div className="space-y-3">
              {orderType === 'delivery' ? (
                <>
                  <label className="p-4 border-2 border-[#4B274F] bg-[#F5F0E8] rounded-md flex items-start gap-3 cursor-pointer block">
                    <input
                      type="radio"
                      name="payment_method"
                      value="Cash on Delivery (COD)"
                      checked={formData.payment_method === 'Cash on Delivery (COD)'}
                      onChange={handleChange}
                      className="mt-1 accent-[#4B274F]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#351B38] block">Cash on Delivery (COD)</span>
                      <p className="text-[11px] text-[#6B4A3A] font-normal leading-relaxed mt-0.5">
                        Pay with cash upon parcel receipt anywhere in Pakistan.
                      </p>
                    </div>
                  </label>

                  <label className="p-4 border border-[#E8DED2] bg-white rounded-md flex items-start gap-3 cursor-pointer block hover:border-[#4B274F]/50">
                    <input
                      type="radio"
                      name="payment_method"
                      value="Online Payment / Direct Bank Transfer"
                      checked={formData.payment_method === 'Online Payment / Direct Bank Transfer'}
                      onChange={handleChange}
                      className="mt-1 accent-[#4B274F]"
                    />
                    <div>
                      <span className="font-semibold text-xs text-[#2A1B17] block">Online Payment / Bank Transfer</span>
                      <p className="text-[11px] text-[#6B4A3A] font-normal leading-relaxed mt-0.5">
                        Digital account details provided upon confirmation.
                      </p>
                    </div>
                  </label>
                </>
              ) : (
                <>
                  <label className="p-4 border-2 border-[#4B274F] bg-[#F5F0E8] rounded-md flex items-start gap-3 cursor-pointer block">
                    <input
                      type="radio"
                      name="payment_method"
                      value="Cash on Pickup"
                      checked={formData.payment_method === 'Cash on Pickup'}
                      onChange={handleChange}
                      className="mt-1 accent-[#4B274F]"
                    />
                    <div>
                      <span className="font-bold text-xs text-[#351B38] block">Cash on Pickup</span>
                      <p className="text-[11px] text-[#6B4A3A] font-normal leading-relaxed mt-0.5">
                        Pay cash directly at the barista counter upon pickup.
                      </p>
                    </div>
                  </label>

                  <label className="p-4 border border-[#E8DED2] bg-white rounded-md flex items-start gap-3 cursor-pointer block hover:border-[#4B274F]/50">
                    <input
                      type="radio"
                      name="payment_method"
                      value="Card on Pickup"
                      checked={formData.payment_method === 'Card on Pickup'}
                      onChange={handleChange}
                      className="mt-1 accent-[#4B274F]"
                    />
                    <div>
                      <span className="font-semibold text-xs text-[#2A1B17] block">Credit / Debit Card on Pickup</span>
                      <p className="text-[11px] text-[#6B4A3A] font-normal leading-relaxed mt-0.5">
                        Swipe your card at the in-store POS terminal upon collection.
                      </p>
                    </div>
                  </label>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: ORDER REVIEW & CONFIRMATION (Span 5) */}
        <div className="lg:col-span-5 bg-white border border-[#E8DED2] rounded-md p-6 sm:p-8 space-y-6 shadow-xs sticky top-28">
          <div className="border-b border-[#E8DED2] pb-4">
            <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#4B274F] block">
              FINAL REVIEW
            </span>
            <h2 className="font-display text-2xl text-[#351B38]">
              Order Summary
            </h2>
          </div>

          {/* Ordered Products Review */}
          <div className="divide-y divide-[#E8DED2] max-h-56 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=100&q=80'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-xs border border-[#E8DED2]"
                  />
                  <div>
                    <span className="font-semibold text-[#2A1B17] block">{item.name}</span>
                    <span className="text-[#6B4A3A] font-normal">{item.quantity} × Rs. {item.price.toLocaleString()}</span>
                  </div>
                </div>
                <span className="font-bold text-[#4B274F]">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Price Calculations */}
          <div className="space-y-2 pt-3 border-t border-[#E8DED2] text-xs">
            <div className="flex justify-between text-[#6B4A3A]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#2A1B17]">Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-[#6B4A3A]">
              <span>{orderType === 'pickup' ? 'Pickup Fee' : 'Delivery Fee'}</span>
              {deliveryFee === 0 ? (
                <span className="font-semibold text-emerald-700">FREE</span>
              ) : (
                <span className="font-semibold text-[#2A1B17]">Rs. {deliveryFee.toLocaleString()}</span>
              )}
            </div>

            <div className="flex justify-between text-base font-bold text-[#351B38] pt-2 border-t border-[#E8DED2]">
              <span>Total</span>
              <span className="text-[#351B38]">Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Live Order Review Card */}
          <div className="p-4 bg-[#F5F0E8] border border-[#E8DED2] rounded-md space-y-2.5 text-[11px] text-[#6B4A3A]">
            <span className="font-bold text-[#351B38] uppercase tracking-wider block text-[10px]">
              Customer &amp; Fulfillment Summary:
            </span>
            
            <div className="space-y-1">
              <p><strong>Name:</strong> {formData.customer_name || '—'}</p>
              <p><strong>Phone:</strong> {formData.customer_phone || '—'}</p>
              {formData.customer_email && <p><strong>Email:</strong> {formData.customer_email}</p>}
              <p><strong>Type:</strong> <span className="uppercase font-bold text-[#4B274F]">{orderType}</span></p>
              {orderType === 'delivery' ? (
                <p><strong>Destination:</strong> {formData.delivery_address ? `${formData.delivery_address}, ${formData.city}` : '—'}</p>
              ) : (
                <p><strong>Pickup Branch:</strong> {formData.store_name || '—'}</p>
              )}
              <p><strong>Payment:</strong> {formData.payment_method}</p>
            </div>
          </div>

          {/* Submit Place Order Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              'Placing Guest Order...'
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-white" /> Place Order (Rs. {grandTotal.toLocaleString()})
              </>
            )}
          </button>

          <div className="text-[10.5px] text-[#6B4A3A] text-center space-y-0.5 font-normal">
            <p>Direct guest checkout • No password required</p>
            <p>Your unique order tracking number will be generated immediately.</p>
          </div>
        </div>

      </form>

    </div>
  );
}
