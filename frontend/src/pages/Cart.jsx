import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  const FREE_SHIPPING_THRESHOLD = 3500;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (cart.length === 0) {
    return (
      <div className="pt-36 pb-28 max-w-xl mx-auto px-6 text-center space-y-6 font-body">
        <div className="w-20 h-20 bg-[#EDE4D8] rounded-full flex items-center justify-center mx-auto text-[#5A3825]">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl text-[#24150F]">Your Cart is Empty</h1>
          <p className="text-xs sm:text-sm text-[#756A62] font-normal">
            Discover our freshly roasted single-origin coffees and whole leaf teas.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-block px-8 py-4 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-md"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-10 font-body text-[#1C1714]">
      
      {/* Header */}
      <div className="border-b border-[#EDE4D8] pb-6 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
            REVIEW SELECTIONS
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#24150F]">
            Your Shopping Bag
          </h1>
        </div>
        <span className="text-xs font-medium text-[#756A62]">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-4 bg-[#EDE4D8]/60 border border-[#EDE4D8] rounded-sm space-y-2">
        {remaining > 0 ? (
          <p className="text-xs text-[#5A3825] font-normal">
            Add <strong className="font-semibold text-[#24150F]">Rs. {remaining.toLocaleString()}</strong> more to unlock <strong className="font-semibold">Free Nationwide Express Delivery</strong>
          </p>
        ) : (
          <p className="text-xs text-[#24150F] font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> You have unlocked FREE Express Delivery!
          </p>
        )}
        <div className="w-full h-1.5 bg-[#D8CCC0] rounded-full overflow-hidden">
          <div className="h-full bg-[#B8895B] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Product List (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-[#EDE4D8] border border-[#EDE4D8] bg-white rounded-sm">
            {cart.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                
                <div className="flex gap-4 items-center">
                  <img
                    src={item.image || '/placeholder-coffee.jpg'}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-sm border border-[#EDE4D8] shrink-0"
                  />
                  <div className="space-y-1">
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-semibold text-base text-[#24150F] hover:text-[#B8895B] transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <span className="text-xs text-[#756A62] block font-normal">{item.category_name || 'Coffee'}</span>
                    <span className="font-semibold text-xs text-[#24150F] block">
                      Rs. {item.price?.toLocaleString()} each
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#EDE4D8]">
                  {/* Quantity Modifier */}
                  <div className="inline-flex items-center border border-[#24150F] bg-[#F6F1E9] rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-[#24150F] hover:bg-white transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 py-0.5 text-xs font-semibold text-[#24150F]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-[#24150F] hover:bg-white transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-22">
                    <span className="font-semibold text-sm text-[#24150F] block">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[#756A62] hover:text-red-700 p-1 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-widest font-semibold text-[#5A3825] hover:text-[#24150F] flex items-center gap-1.5"
            >
              &larr; Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-xs text-[#756A62] hover:text-red-700 underline font-normal"
            >
              Clear Entire Bag
            </button>
          </div>
        </div>

        {/* Right: Order Summary Box (Span 4) */}
        <div className="lg:col-span-4 bg-white border border-[#EDE4D8] rounded-sm p-6 sm:p-8 space-y-6 shadow-xs">
          <h3 className="font-display text-xl text-[#24150F] border-b border-[#EDE4D8] pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs text-[#5A3825]">
            <div className="flex items-center justify-between">
              <span className="font-normal">Items Subtotal</span>
              <span className="font-semibold text-[#24150F]">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-normal">Delivery Fee</span>
              <span className="font-medium text-[#24150F]">
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-emerald-700 font-semibold">FREE</span>
                ) : (
                  'Rs. 250'
                )}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EDE4D8] flex items-center justify-between">
            <span className="font-display text-lg text-[#24150F]">Estimated Total</span>
            <span className="font-bold text-xl text-[#24150F]">
              Rs. {(subtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250)).toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-md flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4 text-[#B8895B]" />
          </button>

          <div className="space-y-2 pt-2 text-[11px] text-[#756A62] font-normal">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#B8895B]" />
              <span>Doorstep express dispatch across Pakistan</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B8895B]" />
              <span>Cash on delivery payment with package receipt</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
