import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Package, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const OFFICIAL_TEA_CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Limited Edition Teas', value: 'limited-edition' },
  { label: "Tea Master's Collection", value: 'tea-masters-collection' },
  { label: 'Green', value: 'green' },
  { label: 'Oolong', value: 'oolong' },
  { label: 'Flavoured Tea', value: 'flavoured-tea' },
  { label: 'Herbal & Fruits', value: 'herbal-fruits' },
  { label: 'Black', value: 'black' },
];

export default function Tea() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchTeaCatalog = async () => {
      setLoading(true);
      try {
        const params = {
          type: 'tea',
          limit: 100,
        };
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (sortBy) {
          params.sort = sortBy;
        }

        const res = await api.get('/products', { params });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Failed to load tea catalog', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchTeaCatalog();
    }, 250);

    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, sortBy]);

  // Client-side instant filter fallback for responsiveness
  const displayProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.category_name && p.category_name.toLowerCase().includes(q)) ||
      (p.tea_type && p.tea_type.toLowerCase().includes(q)) ||
      (p.origin && p.origin.toLowerCase().includes(q)) ||
      (p.flavor_profile && p.flavor_profile.toLowerCase().includes(q)) ||
      (p.ingredients && p.ingredients.toLowerCase().includes(q))
    );
  });

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 font-body text-[#2A1B17]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
          HAND-PLUCKED WHOLE LEAF HARVESTS
        </span>
        <h1 className="font-display text-4xl sm:text-5xl text-[#351B38] font-bold tracking-tight">
          Artisan Tea Collection
        </h1>
        <p className="text-xs sm:text-sm text-[#6B4A3A] font-normal leading-relaxed">
          Crafted exclusively from the top two leaves and a bud. Explore single-estate black teas, delicate green teas, fragrant high-mountain oolongs, and calming caffeine-free herbal infusions.
        </p>
      </div>

      {/* Controls Bar: Category Tabs, Live Search, Sort */}
      <div className="space-y-6">
        
        {/* Horizontal Category Navigation (Responsive Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E8DED2] scrollbar-none no-scrollbar">
          {OFFICIAL_TEA_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold rounded-md shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.value
                  ? 'bg-[#4B274F] text-white shadow-xs'
                  : 'bg-white border border-[#E8DED2] text-[#2A1B17] hover:bg-[#F5F0E8] hover:text-[#4B274F]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-[#E8DED2] rounded-md shadow-xs">
          
          {/* Live Search */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tea name, category, origin, flavor..."
              className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md pl-9 pr-4 py-2 text-xs text-[#2A1B17] placeholder-[#6B4A3A]/70 focus:outline-none focus:border-[#4B274F]"
            />
            <Search className="w-4 h-4 text-[#6B4A3A] absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-xs text-[#6B4A3A] hover:text-[#4B274F] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sorting Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label className="text-xs font-bold text-[#6B4A3A] flex items-center gap-1.5 whitespace-nowrap">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#4B274F]" /> Sort:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3 py-1.5 text-xs font-bold text-[#2A1B17] focus:outline-none focus:border-[#4B274F] cursor-pointer"
            >
              <option value="featured">Featured Collection</option>
              <option value="name_a_z">Name: A to Z</option>
              <option value="name_z_a">Name: Z to A</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>

        </div>

      </div>

      {/* Catalog Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white border border-[#E8DED2] h-96 animate-pulse rounded-md p-4 space-y-4">
              <div className="bg-[#F5F0E8] aspect-square rounded-md" />
              <div className="h-4 bg-[#F5F0E8] w-3/4 rounded" />
              <div className="h-3 bg-[#F5F0E8] w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white border border-[#E8DED2] rounded-md max-w-md mx-auto shadow-xs p-8">
          <Package className="w-12 h-12 text-[#6B4A3A] mx-auto opacity-60" />
          <h3 className="font-display text-2xl font-bold text-[#351B38]">No Teas Found</h3>
          <p className="text-xs text-[#6B4A3A]">
            No tea products match "{searchQuery}" under the selected category.
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="inline-block px-5 py-2.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-widest rounded-md cursor-pointer transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}

      {/* Sourcing Promise Bar */}
      <div className="border-t border-[#E8DED2] pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs text-[#6B4A3A]">
        <div className="p-4 bg-white border border-[#E8DED2] rounded-md space-y-1">
          <span className="font-bold text-[#351B38] block text-sm">Top 2 Leaves &amp; A Bud</span>
          <p>Hand-harvested from high-altitude estates across Sri Lanka, Japan, Taiwan, and China.</p>
        </div>
        <div className="p-4 bg-white border border-[#E8DED2] rounded-md space-y-1">
          <span className="font-bold text-[#351B38] block text-sm">Whole Leaf Purity</span>
          <p>Preserves essential oils and delicate aromatics without tea dust or artificial fillers.</p>
        </div>
        <div className="p-4 bg-white border border-[#E8DED2] rounded-md space-y-1">
          <span className="font-bold text-[#351B38] block text-sm">Air-Tight Flavor Seal</span>
          <p>Packaged at peak freshness for maximum polyphenol and antioxidant potency.</p>
        </div>
      </div>

    </div>
  );
}
