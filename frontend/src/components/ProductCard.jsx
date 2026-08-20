import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_in_stock) return;

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = !product.is_in_stock || product.stock_quantity <= 0;
  const displayPrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;

  return (
    <div className="group relative flex flex-col bg-white border border-[#EDE4D8] hover:border-[#B8895B]/60 transition-all duration-300 rounded-sm overflow-hidden font-body">
      
      {/* Product Image Container with Subtle Hover Zoom */}
      <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-[#F6F1E9] block">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover product-image-zoom"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_featured && (
            <span className="px-2.5 py-0.5 bg-[#24150F] text-[#F6F1E9] text-[9px] uppercase tracking-widest font-semibold">
              Featured
            </span>
          )}
          {product.is_best_seller && (
            <span className="px-2.5 py-0.5 bg-[#B8895B] text-white text-[9px] uppercase tracking-widest font-semibold">
              Best Seller
            </span>
          )}
          {product.sale_price && product.sale_price > 0 && (
            <span className="px-2.5 py-0.5 bg-red-800 text-white text-[9px] uppercase tracking-widest font-semibold">
              Sale
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#24150F]/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-3.5 py-1 bg-white text-[#24150F] text-[10px] font-semibold uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View Hover overlay button on desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-[#24150F]/80 via-[#24150F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#F6F1E9] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3 bg-white">
        
        <div className="space-y-1.5">
          {/* Category / Origin Tag in Plus Jakarta Sans (Weight 500) */}
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium text-[#B8895B] block">
            {product.origin || product.category_name || 'Specialty Coffee'}
          </span>

          {/* Product Name in Plus Jakarta Sans (Weight 600) */}
          <Link
            to={`/product/${product.slug}`}
            className="font-semibold text-base sm:text-[17px] text-[#24150F] hover:text-[#B8895B] transition-colors line-clamp-1 block leading-snug"
          >
            {product.name}
          </Link>

          {/* Short Description in Plus Jakarta Sans (Weight 400) */}
          {product.short_description && (
            <p className="text-xs text-[#756A62] line-clamp-2 leading-relaxed font-normal">
              {product.short_description}
            </p>
          )}
        </div>

        {/* Price & Add to Cart Action in Plus Jakarta Sans (Weight 600) */}
        <div className="pt-3 border-t border-[#EDE4D8]/70 flex items-center justify-between">
          <div>
            <span className="font-semibold text-sm sm:text-base text-[#24150F]">
              Rs. {displayPrice?.toLocaleString()}
            </span>
            {product.sale_price && product.sale_price > 0 && (
              <span className="text-xs text-[#756A62] line-through ml-2 font-normal">
                Rs. {product.price?.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 rounded-sm ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : added
                ? 'bg-emerald-800 text-white'
                : 'bg-[#F6F1E9] hover:bg-[#24150F] text-[#24150F] hover:text-[#F6F1E9] border border-[#EDE4D8]'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3 h-3 text-emerald-300" /> Added
              </>
            ) : isOutOfStock ? (
              'Unavailable'
            ) : (
              <>
                <Plus className="w-3 h-3 text-[#B8895B]" /> Add
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
