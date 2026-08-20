import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isOutOfStock = !product.is_in_stock || product.stock_quantity <= 0 || product.availability === 'Out of Stock';
  const hasPrice = product.price !== null && product.price !== undefined && product.price !== '';
  const displayPrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const productUrl = `/coffee/${product.slug}`;

  return (
    <div className="group relative flex flex-col bg-white border border-[#E8DED2] hover:border-[#4B274F]/50 transition-all duration-300 rounded-md overflow-hidden font-body shadow-xs hover:shadow-md">
      
      {/* Product Image Container with Object Contain */}
      <Link to={productUrl} className="relative aspect-square overflow-hidden bg-[#F5F0E8] flex items-center justify-center p-4 block">
        <img
          src={product.image || '/placeholder-coffee.jpg'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain product-image-zoom transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.category_name && (
            <span className="px-2.5 py-0.5 bg-[#4B274F] text-white text-[9px] uppercase tracking-widest font-semibold rounded-xs">
              {product.category_name}
            </span>
          )}
          {product.is_featured && (
            <span className="px-2 py-0.5 bg-[#351B38] text-white text-[9px] uppercase tracking-widest font-semibold rounded-xs">
              Featured
            </span>
          )}
          {product.sale_price && product.sale_price > 0 && (
            <span className="px-2 py-0.5 bg-[#6B4A3A] text-white text-[9px] uppercase tracking-widest font-semibold rounded-xs">
              Sale
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#2A1B17]/70 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3.5 py-1 bg-white text-[#2A1B17] text-[10px] font-semibold uppercase tracking-widest rounded-xs">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View Hover overlay button on desktop */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-[#351B38]/80 via-[#351B38]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-white flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </div>
      </Link>

      {/* Product Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3 bg-white">
        
        <div className="space-y-1.5">
          {/* Category & Pack Size */}
          <div className="flex items-center justify-between text-[11px] text-[#6B4A3A] font-semibold">
            <span className="uppercase tracking-wider">
              {product.category || product.category_name || 'Coffee'}
            </span>
            {product.pack_size && (
              <span className="px-2 py-0.5 bg-[#F5F0E8] border border-[#E8DED2] text-[#4B274F] rounded-xs font-bold text-[10px]">
                {product.pack_size}
              </span>
            )}
          </div>

          {/* Product Name */}
          <Link
            to={productUrl}
            className="font-bold text-base sm:text-[17px] text-[#2A1B17] hover:text-[#4B274F] transition-colors line-clamp-1 block leading-snug"
          >
            {product.name}
          </Link>

          {/* Short Tasting Profile */}
          {(product.flavor_profile || product.short_description) && (
            <p className="text-xs text-[#6B4A3A]/90 line-clamp-2 leading-relaxed font-normal">
              {product.flavor_profile || product.short_description}
            </p>
          )}
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-[#E8DED2] flex items-center justify-between">
          <div>
            {hasPrice ? (
              <>
                <span className="font-bold text-base sm:text-[17px] text-[#4B274F]">
                  Rs. {Number(displayPrice).toLocaleString()}
                </span>
                {product.sale_price && product.sale_price > 0 && (
                  <span className="text-xs text-[#6B4A3A] line-through ml-2 font-normal">
                    Rs. {Number(product.price).toLocaleString()}
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs font-semibold text-[#6B4A3A] italic">
                Price unavailable
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 rounded-md cursor-pointer ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : added
                ? 'bg-[#351B38] text-white'
                : 'bg-[#4B274F] hover:bg-[#351B38] text-white shadow-xs'
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" /> Added
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-white" /> Add
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
