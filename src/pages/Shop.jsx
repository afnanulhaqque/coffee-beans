import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, X } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter States
  const categoryParam = searchParams.get('category') || 'all';
  const roastParam = searchParams.get('roast') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const searchParam = searchParams.get('search') || '';
  const inStockParam = searchParams.get('in_stock') === 'true';

  const [searchInput, setSearchInput] = useState(searchParam);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: categoryParam === 'all' ? '' : categoryParam,
        roast: roastParam === 'all' ? '' : roastParam,
        sort: sortParam,
        page: pageParam,
        limit: 12,
        search: searchParam,
        in_stock: inStockParam ? 'true' : '',
      };

      const res = await api.get('/products', { params });
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryParam, roastParam, sortParam, pageParam, searchParam, inStockParam]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === false) {
      next.delete(key);
    } else {
      next.set(key, value.toString());
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-12 font-body text-[#2A1B17]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          ESTATE RESERVE &amp; SIGNATURE BLENDS
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#351B38] tracking-tight">
          Shop Coffee &amp; Tea
        </h1>
        <p className="text-xs sm:text-sm text-[#6B4A3A] font-normal leading-relaxed">
          From single-origin high-grown beans to hand-plucked whole leaf teas and brewing essentials. Roasted fresh and delivered directly to you.
        </p>
      </div>

      {/* Main Department Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 border-b border-[#E8DED2]">
        {[
          { label: 'All Catalog', value: 'all' },
          { label: 'Coffee', value: 'coffee' },
          { label: 'Artisan Tea', value: 'tea' },
          { label: 'Merchandise & Gear', value: 'merchandise' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => updateParam('category', tab.value)}
            className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all rounded-md shrink-0 ${
              categoryParam === tab.value
                ? 'bg-[#4B274F] text-white shadow-xs'
                : 'bg-white border border-[#E8DED2] text-[#2A1B17] hover:bg-[#F5F0E8] hover:text-[#4B274F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Horizontal Filter & Controls Bar */}
      <div className="bg-white border border-[#E8DED2] rounded-md p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        
        {/* Left Filter Selectors */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          
          {/* Roast Profile Selector */}
          <div className="relative">
            <select
              value={roastParam}
              onChange={(e) => updateParam('roast', e.target.value)}
              className="bg-[#F5F0E8] border border-[#E8DED2] text-[#2A1B17] font-semibold text-xs uppercase tracking-wider px-3.5 py-2 pr-8 rounded-md appearance-none focus:outline-none focus:border-[#4B274F] cursor-pointer"
            >
              <option value="all">All Roast Profiles</option>
              <option value="Light">Light Roast</option>
              <option value="Medium">Medium Roast</option>
              <option value="Dark">Dark Roast</option>
              <option value="Decaf">Decaffeinated</option>
              <option value="Flavoured">Flavoured Coffee</option>
              <option value="Tea">Tea Varieties</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#4B274F] absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* In-Stock Toggle */}
          <label className="flex items-center gap-2 px-3 py-2 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs font-semibold text-[#2A1B17] cursor-pointer hover:bg-[#E8DED2] transition-colors">
            <input
              type="checkbox"
              checked={inStockParam}
              onChange={(e) => updateParam('in_stock', e.target.checked)}
              className="w-3.5 h-3.5 accent-[#4B274F]"
            />
            <span>In Stock Only</span>
          </label>

          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:w-60">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search product..."
              className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md pl-8 pr-3 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
            />
            <Search className="w-3.5 h-3.5 text-[#6B4A3A] absolute left-2.5 top-2.5" />
          </form>

          {/* Active Filter Clear Button */}
          {(categoryParam !== 'all' || roastParam !== 'all' || searchParam || inStockParam) && (
            <button
              onClick={clearFilters}
              className="text-xs text-red-700 hover:underline flex items-center gap-1 font-semibold ml-auto sm:ml-0"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}

        </div>

        {/* Right Sort Selector & Result Count */}
        <div className="flex items-center justify-between sm:justify-end gap-4 text-xs pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8DED2]">
          <span className="text-[#6B4A3A] text-[11px] font-normal">
            Showing <strong className="font-semibold text-[#2A1B17]">{products.length}</strong> of {totalCount} items
          </span>

          <div className="relative">
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-[#F5F0E8] border border-[#E8DED2] text-[#2A1B17] font-semibold text-xs uppercase tracking-wider px-3.5 py-2 pr-8 rounded-md appearance-none focus:outline-none focus:border-[#4B274F] cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="best_selling">Sort: Best Selling</option>
              <option value="featured">Sort: Featured</option>
              <option value="price_low">Sort: Price Low to High</option>
              <option value="price_high">Sort: Price High to Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#4B274F] absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-[#E8DED2] h-96 animate-pulse rounded-md" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-24 bg-white border border-[#E8DED2] rounded-md text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <h3 className="font-display text-2xl text-[#351B38]">No products found</h3>
          <p className="text-xs text-[#6B4A3A] font-normal">Try adjusting your filter preferences or search term.</p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-widest rounded-md transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {products.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Numbered Pagination */}
      <Pagination
        currentPage={pageParam}
        totalPages={totalPages}
        onPageChange={(p) => updateParam('page', p)}
      />

    </div>
  );
}
