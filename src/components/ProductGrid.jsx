import React from 'react';
import ProductCard from './ProductCard';
import { Coffee, SearchX } from 'lucide-react';

export default function ProductGrid({ products, loading, emptyMessage = 'No products found matching your criteria.' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EADBC8] p-4 animate-pulse space-y-4">
            <div className="aspect-square bg-gray-200 rounded-xl w-full" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-8 bg-gray-200 rounded-xl w-full mt-4" />
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-[#EADBC8] rounded-2xl p-12 text-center max-w-lg mx-auto my-8 card-shadow">
        <div className="w-16 h-16 bg-[#F5EFE6] rounded-full flex items-center justify-center mx-auto mb-4 text-[#6F4E37]">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="font-serif-luxury text-xl font-bold text-[#3E2723] mb-2">
          No Products Found
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
