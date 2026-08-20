import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  const FREE_SHIPPING_THRESHOLD = 3500;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-body">
      {/* Overlay Backdrop */}
      <div
        className="fixed inset-0 bg-[#2A1B17]/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F5F0E8] text-[#2A1B17] shadow-2xl flex flex-col justify-between border-l border-[#E8DED2] animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 border-b border-[#E8DED2] flex items-center justify-between bg-[#F5F0E8]">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-2xl text-[#351B38] tracking-tight">
                Your Bag
              </span>
              <span className="px-2.5 py-0.5 bg-[#E8DED2] text-[#4B274F] text-[11px] font-bold rounded-md">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-[#6B4A3A] hover:text-[#351B38] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3.5 bg-[#E8DED2]/50 border-b border-[#E8DED2]">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-[#6B4A3A] font-normal leading-normal mb-2">
                Add <strong className="font-semibold text-[#351B38]">Rs. {remainingForFreeShipping.toLocaleString()}</strong> more to qualify for <strong className="font-semibold text-[#4B274F]">Free Nationwide Delivery</strong>
              </p>
            ) : (
              <p className="text-xs text-[#351B38] font-semibold flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /> You have unlocked FREE Express Delivery!
              </p>
            )}
            <div className="w-full h-1.5 bg-[#E8DED2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4B274F] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#E8DED2]">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8DED2] flex items-center justify-center mx-auto text-[#4B274F]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-xl text-[#351B38]">Your bag is empty</h3>
                  <p className="text-xs text-[#6B4A3A] font-normal">Explore freshly roasted whole beans &amp; single-origin coffees.</p>
                </div>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="inline-block px-6 py-3 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-widest transition-colors rounded-md shadow-xs"
                >
                  Explore Catalog
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4 items-start">
                  <div className="w-20 h-20 bg-white border border-[#E8DED2] rounded-md overflow-hidden shrink-0">
                    <img
                      src={item.image || '/placeholder-coffee.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="font-semibold text-sm text-[#2A1B17] hover:text-[#4B274F] transition-colors block line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <span className="text-[11px] text-[#6B4A3A] block font-normal">
                      {item.category_name || 'Whole Bean Coffee'}
                    </span>
                    <div className="font-bold text-xs text-[#4B274F]">
                      Rs. {item.price?.toLocaleString()}
                    </div>

                    {/* Quantity Modifiers */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="inline-flex items-center border border-[#E8DED2] bg-white rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-[#6B4A3A] hover:text-[#4B274F] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-[#2A1B17]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-[#6B4A3A] hover:text-[#4B274F] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#6B4A3A] hover:text-red-700 text-xs flex items-center gap-1 transition-colors p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E8DED2] bg-white/70 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[#6B4A3A]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2A1B17]">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[#6B4A3A]">
                  <span>Estimated Shipping</span>
                  <span className="font-medium text-[#2A1B17]">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : 'Calculated at checkout'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8DED2] flex items-center justify-between">
                <span className="font-display text-lg text-[#351B38]">Total</span>
                <span className="font-bold text-lg text-[#351B38]">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="w-full py-3.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-widest rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4 text-white" />
                </button>

                <button
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 bg-transparent border border-[#4B274F] hover:bg-[#4B274F] text-[#4B274F] hover:text-white text-xs font-semibold uppercase tracking-widest rounded-md transition-colors"
                >
                  View Cart Page
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#6B4A3A] text-center pt-1 font-normal">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4B274F]" />
                <span>Secure Checkout • Cash on Delivery Guaranteed</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
