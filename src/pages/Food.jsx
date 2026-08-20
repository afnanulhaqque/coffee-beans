import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  UtensilsCrossed, 
  ShoppingBag, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

export default function Food() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [addedItemIds, setAddedItemIds] = useState({});

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/food-categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to load food categories', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchFood = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== 'all') {
          params.category = activeCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (sortBy !== 'default') {
          params.sort = sortBy;
        }

        const res = await api.get('/food', { params });
        setFoodItems(res.data.products || []);
      } catch (err) {
        console.error('Failed to load food items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [activeCategory, searchQuery, sortBy]);

  const handleCategoryChange = (slug) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleQuickAdd = (item) => {
    addToCart(item, 1);
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1200);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-[#2A1B17] font-body">
      
      {/* Hero Heading */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#4B274F] block">
          ARTISAN CAFE KITCHEN
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#351B38]">
          Gourmet Food &amp; Bakery
        </h1>
        <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed">
          Freshly prepared all-day breakfasts, toasted gourmet sandwiches, flame-grilled chicken steaks, and oven-baked stone pizzas.
        </p>
      </div>

      {/* Dynamic Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2.5 rounded-md text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
            activeCategory === 'all'
              ? 'bg-[#4B274F] text-white shadow-xs'
              : 'bg-white border border-[#E8DED2] text-[#2A1B17] hover:bg-[#F5F0E8]'
          }`}
        >
          All Food
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.slug)}
            className={`px-4 py-2.5 rounded-md text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
              activeCategory === cat.slug
                ? 'bg-[#4B274F] text-white shadow-xs'
                : 'bg-white border border-[#E8DED2] text-[#2A1B17] hover:bg-[#F5F0E8]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search & Sort Toolbar */}
      <div className="bg-white border border-[#E8DED2] p-4 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food by name, ingredients, or type..."
            className="w-full bg-[#F5F0E8] border border-[#E8DED2] rounded-md pl-9 pr-4 py-2 text-xs text-[#2A1B17] focus:outline-none focus:border-[#4B274F]"
          />
          <Search className="w-4 h-4 text-[#6B4A3A] absolute left-3 top-2.5" />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <span className="text-xs text-[#6B4A3A] font-bold">Sort By:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#F5F0E8] border border-[#E8DED2] rounded-md px-3 py-2 pr-8 text-xs font-semibold text-[#2A1B17] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="default">Featured</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#4B274F] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-[#E8DED2] rounded-md p-4 space-y-3 h-80">
              <div className="bg-[#F5F0E8] aspect-square rounded-md" />
              <div className="h-4 bg-[#F5F0E8] w-3/4 rounded" />
              <div className="h-3 bg-[#F5F0E8] w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : foodItems.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white border border-[#E8DED2] rounded-md p-8">
          <UtensilsCrossed className="w-10 h-10 text-[#6B4A3A] mx-auto opacity-50" />
          <h3 className="font-display text-xl font-bold text-[#351B38]">No Food Items Found</h3>
          <p className="text-xs text-[#6B4A3A]">Try adjusting your search criteria or selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {foodItems.map((item) => {
            const isAdded = addedItemIds[item.id];

            return (
              <div
                key={item.id}
                className="bg-white border border-[#E8DED2] rounded-md overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Stage */}
                <Link
                  to={`/food/${item.slug}`}
                  className="aspect-square bg-[#F5F0E8]/40 p-6 flex items-center justify-center overflow-hidden relative block"
                >
                  <img
                    src={item.image || '/placeholder-coffee.jpg'}
                    alt={item.name}
                    className="w-full h-full object-contain product-image-zoom transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {item.portion && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-[#F5F0E8] border border-[#E8DED2] text-[#4B274F] text-[9px] uppercase tracking-wider font-bold rounded-xs">
                      {item.portion}
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#4B274F] block">
                      {item.category || item.category_name || 'Cafe Kitchen'}
                    </span>
                    <Link
                      to={`/food/${item.slug}`}
                      className="font-display text-lg font-bold text-[#351B38] hover:text-[#4B274F] transition-colors line-clamp-1 block"
                      title={item.name}
                    >
                      {item.name}
                    </Link>
                    {item.short_description && (
                      <p className="text-xs text-[#6B4A3A] line-clamp-2 leading-relaxed">
                        {item.short_description}
                      </p>
                    )}
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-[#E8DED2] flex items-center justify-between">
                    <div>
                      {item.price ? (
                        <span className="text-sm font-bold text-[#4B274F] block">
                          Rs. {Number(item.price).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B4A3A] italic">Price at counter</span>
                      )}
                    </div>

                    <button
                      onClick={() => handleQuickAdd(item)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isAdded
                          ? 'bg-[#351B38] text-white'
                          : 'bg-[#4B274F] hover:bg-[#351B38] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Added
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Order
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
