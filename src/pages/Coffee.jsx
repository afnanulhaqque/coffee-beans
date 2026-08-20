import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles, Coffee as CoffeeIcon, X } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { label: 'All', slug: 'all' },
  { label: 'Light & Distinctive', slug: 'light-distinctive' },
  { label: 'Rich & Smooth', slug: 'rich-smooth' },
  { label: 'Reserved', slug: 'reserved' },
  { label: 'Light & Subtle', slug: 'light-subtle' },
  { label: 'Decaffeinated', slug: 'decaffeinated' },
  { label: 'Flavoured Coffee', slug: 'flavoured-coffee' },
  { label: 'Dark & Distinctive', slug: 'dark-distinctive' },
  { label: 'Medium & Smooth', slug: 'medium-smooth' },
];

export default function Coffee() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products?limit=100');
        // Filter products that belong to Coffee category or subcategories
        const list = (res.data.products || []).filter((p) => {
          const cat = (p.category_name || p.category || '').toLowerCase();
          const catSlug = (p.category_slug || '').toLowerCase();
          const isCoffeeCat = [
            'coffee',
            'light & distinctive',
            'rich & smooth',
            'reserved',
            'light & subtle',
            'decaffeinated',
            'flavoured coffee',
            'dark & distinctive',
            'medium & smooth',
          ].some((c) => cat.includes(c) || catSlug.includes(c.replace(/ & /g, '-').replace(/ /g, '-')));
          return isCoffeeCat;
        });
        setProducts(list);
      } catch (err) {
        console.error('Failed to load official coffee catalog', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  // Update query params when state changes
  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sortVal) => {
    setSortBy(sortVal);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sortVal);
    setSearchParams(newParams);
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => {
        const catSlug = (p.category_slug || '').toLowerCase();
        const catName = (p.category_name || p.category || '').toLowerCase();
        const targetSlug = selectedCategory.toLowerCase();
        const targetName = (CATEGORIES.find((c) => c.slug === selectedCategory)?.label || '').toLowerCase();

        return catSlug === targetSlug || catName === targetName;
      });
    }

    // 2. Search filter (Product name, Category, Origin, Flavor profile)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const cat = (p.category_name || p.category || '').toLowerCase();
        const origin = (p.origin || '').toLowerCase();
        const flavor = (p.flavor_profile || p.short_description || p.description || '').toLowerCase();
        const pack = (p.pack_size || '').toLowerCase();
        const roast = (p.roast_level || '').toLowerCase();

        return (
          name.includes(q) ||
          cat.includes(q) ||
          origin.includes(q) ||
          flavor.includes(q) ||
          pack.includes(q) ||
          roast.includes(q)
        );
      });
    }

    // 3. Sorting (Featured, Name A-Z, Name Z-A, Price Low-High, Price High-Low)
    if (sortBy === 'featured') {
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0) || b.id - a.id);
    } else if (sortBy === 'name_a_z') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'name_z_a') {
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sortBy === 'price_low_to_high') {
      result.sort((a, b) => {
        const priceA = a.price !== null && a.price !== undefined ? a.price : Infinity;
        const priceB = b.price !== null && b.price !== undefined ? b.price : Infinity;
        return priceA - priceB;
      });
    } else if (sortBy === 'price_high_to_low') {
      result.sort((a, b) => {
        const priceA = a.price !== null && a.price !== undefined ? a.price : -Infinity;
        const priceB = b.price !== null && b.price !== undefined ? b.price : -Infinity;
        return priceB - priceA;
      });
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2A1B17] font-body pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8DED2] text-[#4B274F] rounded-full text-[10px] font-bold tracking-[0.25em] uppercase">
          <CoffeeIcon className="w-3.5 h-3.5" /> Official Coffee Collection
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#351B38] tracking-tight">
          Single Origin &amp; Master Roasted Blends
        </h1>
        <p className="text-xs sm:text-sm text-[#6B4A3A] font-normal leading-relaxed">
          From high-altitude micro-lots in Antioquia to shade-grown estates in Toraja. Each whole bean roast is handcrafted in small batches to honor its terroir and aroma.
        </p>
      </div>

      {/* Category Filter Pills (Preserving official categories) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start lg:justify-center">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-md shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4B274F] text-white shadow-xs'
                    : 'bg-white border border-[#E8DED2] text-[#2A1B17] hover:bg-[#E8DED2]/50 hover:text-[#4B274F]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="bg-white border border-[#E8DED2] rounded-md p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#6B4A3A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search coffee name, origin, or notes (e.g. Kenya, 8oz)..."
            className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md pl-10 pr-10 py-2.5 text-xs text-[#2A1B17] placeholder:text-[#6B4A3A]/70 focus:outline-none focus:border-[#4B274F]"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B4A3A] hover:text-[#2A1B17]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Counter & Sorting Selector */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <span className="text-xs font-semibold text-[#6B4A3A]">
            Showing <strong className="text-[#351B38]">{filteredProducts.length}</strong> coffees
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6B4A3A] hidden sm:block" />
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3 py-2 text-xs font-semibold text-[#2A1B17] focus:outline-none focus:border-[#4B274F] cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="name_a_z">Sort: Name (A to Z)</option>
              <option value="name_z_a">Sort: Name (Z to A)</option>
              <option value="price_low_to_high">Sort: Price (Low to High)</option>
              <option value="price_high_to_low">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Product Catalog Grid (1-2 mobile, 2-3 tablet, 3-4 desktop) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white border border-[#E8DED2] h-88 animate-pulse rounded-md" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white border border-[#E8DED2] rounded-md max-w-lg mx-auto p-8 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#F5F0E8] text-[#4B274F] flex items-center justify-center mx-auto">
            <CoffeeIcon className="w-6 h-6" />
          </div>
          <h3 className="font-display text-2xl font-bold text-[#351B38]">No coffees found</h3>
          <p className="text-xs text-[#6B4A3A]">
            No coffees match your current search or category filter. Try clearing filters to view our full collection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSearchParams({});
            }}
            className="px-5 py-2.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-widest rounded-md transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

    </div>
  );
}
