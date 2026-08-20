import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  const FREE_SHIPPING_THRESHOLD = 3500;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (cart.length === 0) {
    return (
      <div className="pt-36 pb-28 max-w-xl mx-auto px-6 text-center space-y-6 font-body">
        <div className="w-20 h-20 bg-[#E8DED2] rounded-full flex items-center justify-center mx-auto text-[#4B274F]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl text-[#351B38]">Your Cart is Empty</h1>
          <p className="text-xs sm:text-sm text-[#6B4A3A] font-normal">
            Discover our freshly roasted single-origin coffees and whole leaf teas.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-block px-8 py-4 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury shadow-md"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-10 font-body text-[#2A1B17]">
      
      {/* Header */}
      <div className="border-b border-[#E8DED2] pb-6 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
            REVIEW SELECTIONS
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#351B38]">
            Your Shopping Bag
          </h1>
        </div>
        <span className="text-xs font-medium text-[#6B4A3A]">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-4 bg-[#E8DED2]/40 border border-[#E8DED2] rounded-md space-y-2">
        {remaining > 0 ? (
          <p className="text-xs text-[#6B4A3A] font-normal">
            Add <strong className="font-semibold text-[#351B38]">Rs. {remaining.toLocaleString()}</strong> more to unlock <strong className="font-semibold text-[#4B274F]">Free Nationwide Express Delivery</strong>
          </p>
        ) : (
          <p className="text-xs text-[#351B38] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> You have unlocked FREE Express Delivery!
          </p>
        )}
        <div className="w-full h-1.5 bg-[#E8DED2] rounded-full overflow-hidden">
          <div className="h-full bg-[#4B274F] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Product List (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-[#E8DED2] border border-[#E8DED2] bg-white rounded-md">
            {cart.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                
                <div className="flex gap-4 items-center">
                  <img
                    src={item.image || '/placeholder-coffee.jpg'}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border border-[#E8DED2] shrink-0"
                  />
                  <div className="space-y-1">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-semibold text-base text-[#2A1B17] hover:text-[#4B274F] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <span className="text-xs text-[#6B4A3A] block font-normal">{item.category_name || 'Coffee'}</span>
                    <span className="font-bold text-xs text-[#4B274F] block">
                      Rs. {item.price?.toLocaleString()} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#E8DED2]">
                  {/* Quantity Modifier */}
                  <div className="inline-flex items-center border border-[#E8DED2] bg-white rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 text-[#6B4A3A] hover:text-[#4B274F] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-[#2A1B17]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 text-[#6B4A3A] hover:text-[#4B274F] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-bold text-sm text-[#4B274F] w-24 text-right">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-[#6B4A3A] hover:text-red-700 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs">
            <Link to="/shop" className="text-[#4B274F] hover:underline font-semibold flex items-center gap-1">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Card (Span 4) */}
        <div className="lg:col-span-4 bg-white border border-[#E8DED2] rounded-md p-6 sm:p-8 space-y-6 shadow-xs sticky top-32">
          <h2 className="font-display text-2xl text-[#351B38] pb-4 border-b border-[#E8DED2]">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#6B4A3A]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#2A1B17]">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[#6B4A3A]">
              <span>Estimated Shipping</span>
              <span className="font-medium text-[#2A1B17]">
                {subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : 'Calculated at checkout'}
              </span>
            </div>
            <div className="pt-3 border-t border-[#E8DED2] flex justify-between text-base font-bold text-[#351B38]">
              <span>Estimated Total</span>
              <span className="text-[#351B38]">Rs. {subtotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury shadow-md flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4 text-white" />
          </button>

          <div className="pt-2 border-t border-[#E8DED2] space-y-2 text-[11px] text-[#6B4A3A]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4B274F]" />
              <span>100% Secure Checkout Guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#4B274F]" />
              <span>Cash on Delivery across Pakistan</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
