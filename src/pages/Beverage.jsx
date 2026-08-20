import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  Coffee, 
  Flame, 
  Droplets, 
  Plus, 
  Minus, 
  Check, 
  ShoppingBag,
  SlidersHorizontal,
  X
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

export default function Beverage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  
  // Quick Customization Modal / Drawer State
  const [customizingDrink, setCustomizingDrink] = useState(null);
  const [selectedTemp, setSelectedTemp] = useState('hot');
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedMilk, setSelectedMilk] = useState('Whole Milk');
  const [selectedSyrup, setSelectedSyrup] = useState('');
  const [addExtraShot, setAddExtraShot] = useState(false);
  const [addWhippedCream, setAddWhippedCream] = useState(false);
  const [customQty, setCustomQty] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/beverage-categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to load beverage categories', err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchDrinks = async () => {
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

        const res = await api.get('/beverages', { params });
        setBeverages(res.data.products || []);
      } catch (err) {
        console.error('Failed to load beverages', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrinks();
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

  const openCustomizer = (drink) => {
    setCustomizingDrink(drink);
    setSelectedTemp(drink.hot_available ? 'hot' : 'iced');
    
    // Set default size
    if (drink.size_options && typeof drink.size_options === 'object') {
      const sizeKeys = Object.keys(drink.size_options);
      setSelectedSize(sizeKeys.includes('Regular') ? 'Regular' : sizeKeys[0] || 'Regular');
    } else {
      setSelectedSize('Regular');
    }

    if (Array.isArray(drink.milk_options) && drink.milk_options.length > 0) {
      setSelectedMilk(drink.milk_options[0]);
    } else {
      setSelectedMilk('Whole Milk');
    }

    setSelectedSyrup('');
    setAddExtraShot(false);
    setAddWhippedCream(false);
    setCustomQty(1);
  };

  const calculateCustomPrice = () => {
    if (!customizingDrink) return 0;
    let base = 0;
    if (customizingDrink.size_options && typeof customizingDrink.size_options === 'object') {
      base = customizingDrink.size_options[selectedSize] || customizingDrink.price || 750;
    } else {
      base = customizingDrink.price || 750;
    }

    if (addExtraShot) base += 180;
    if (addWhippedCream) base += 120;
    if (selectedMilk && selectedMilk !== 'Whole Milk' && selectedMilk !== 'Skim Milk') {
      base += 200; // Alternative milk surcharge
    }
    return base;
  };

  const handleAddToCartCustomized = () => {
    if (!customizingDrink) return;
    const unitPrice = calculateCustomPrice();
    
    const configuredItem = {
      ...customizingDrink,
      price: unitPrice,
      effective_price: unitPrice,
      selected_size: selectedSize,
      selected_temperature: selectedTemp,
      selected_options: {
        size: selectedSize,
        temperature: selectedTemp,
        milk: customizingDrink.milk_options ? selectedMilk : null,
        syrup: selectedSyrup || null,
        extra_shot: addExtraShot,
        whipped_cream: addWhippedCream,
      },
      cart_item_key: `${customizingDrink.id}-${selectedSize}-${selectedTemp}-${selectedMilk}-${selectedSyrup}-${addExtraShot}-${addWhippedCream}`
    };

    addToCart(configuredItem, customQty);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
      setCustomizingDrink(null);
    }, 900);
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-[#2A1B17] font-body">
      
      {/* Hero Heading */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#4B274F] block">
          THE ARTISAN CAFE MENU
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#351B38]">
          Handcrafted Beverages
        </h1>
        <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed">
          From the birthplace of the Original Ice Blended® drink to masterfully pulled espresso and single-origin whole leaf teas. Every cup is brewed to order.
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
          All Beverages
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
            placeholder="Search beverages by name, flavor, or base..."
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

      {/* Beverage Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-[#E8DED2] rounded-md p-4 space-y-3 h-80">
              <div className="bg-[#F5F0E8] aspect-square rounded-md" />
              <div className="h-4 bg-[#F5F0E8] w-3/4 rounded" />
              <div className="h-3 bg-[#F5F0E8] w-1/2 rounded" />
            </div>
          ))}
        </div>
      ) : beverages.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-white border border-[#E8DED2] rounded-md p-8">
          <Coffee className="w-10 h-10 text-[#6B4A3A] mx-auto opacity-50" />
          <h3 className="font-display text-xl font-bold text-[#351B38]">No Beverages Found</h3>
          <p className="text-xs text-[#6B4A3A]">Try adjusting your search criteria or selecting a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {beverages.map((drink) => {
            const hasSizes = drink.size_options && typeof drink.size_options === 'object';
            const sizeKeys = hasSizes ? Object.keys(drink.size_options) : [];
            const startingPrice = hasSizes 
              ? drink.size_options[sizeKeys[0]] 
              : drink.price;

            return (
              <div
                key={drink.id}
                className="bg-white border border-[#E8DED2] rounded-md overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Stage */}
                <Link
                  to={`/beverage/${drink.slug}`}
                  className="aspect-square bg-[#F5F0E8]/40 p-6 flex items-center justify-center overflow-hidden relative block"
                >
                  <img
                    src={drink.image || '/placeholder-coffee.jpg'}
                    alt={drink.name}
                    className="w-full h-full object-contain product-image-zoom transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {drink.hot_available && !drink.iced_available && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 text-[9px] uppercase tracking-wider font-bold rounded-xs flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600" /> Hot
                    </span>
                  )}
                  {!drink.hot_available && drink.iced_available && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-900 text-[9px] uppercase tracking-wider font-bold rounded-xs flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-sky-600" /> Iced
                    </span>
                  )}
                  {drink.hot_available && drink.iced_available && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-purple-50 border border-purple-200 text-[#4B274F] text-[9px] uppercase tracking-wider font-bold rounded-xs flex items-center gap-1">
                      Hot / Iced
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#4B274F] block">
                      {drink.category || drink.category_name || 'Signature Drink'}
                    </span>
                    <Link
                      to={`/beverage/${drink.slug}`}
                      className="font-display text-base font-bold text-[#351B38] hover:text-[#4B274F] transition-colors line-clamp-1 block"
                      title={drink.name}
                    >
                      {drink.name}
                    </Link>
                    {drink.short_description && (
                      <p className="text-[11px] text-[#6B4A3A] line-clamp-2 leading-relaxed">
                        {drink.short_description}
                      </p>
                    )}
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-2 border-t border-[#E8DED2] flex items-center justify-between">
                    <div>
                      {startingPrice ? (
                        <div>
                          <span className="text-xs font-bold text-[#4B274F] block">
                            Rs. {Number(startingPrice).toLocaleString()}
                          </span>
                          {hasSizes && (
                            <span className="text-[9px] text-[#6B4A3A]">
                              {sizeKeys.join(' / ')}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-[#6B4A3A] italic">Price at counter</span>
                      )}
                    </div>

                    <button
                      onClick={() => openCustomizer(drink)}
                      className="px-3 py-1.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-[11px] font-bold uppercase tracking-wider rounded-md transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <SlidersHorizontal className="w-3 h-3" /> Customize
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Quick Customization Modal / Bottom Sheet */}
      {customizingDrink && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#F5F0E8] border border-[#E8DED2] rounded-md max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-[#2A1B17]">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E8DED2] pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={customizingDrink.image || '/placeholder-coffee.jpg'}
                  alt={customizingDrink.name}
                  className="w-14 h-14 object-contain rounded-md bg-white border border-[#E8DED2] p-1"
                />
                <div>
                  <h3 className="font-display text-lg font-bold text-[#351B38]">
                    {customizingDrink.name}
                  </h3>
                  <span className="text-xs font-bold text-[#4B274F]">
                    Total: Rs. {calculateCustomPrice().toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setCustomizingDrink(null)}
                className="p-1 text-[#6B4A3A] hover:text-[#2A1B17] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customization Options */}
            <div className="space-y-4 text-xs">
              
              {/* Temperature Selector */}
              {customizingDrink.hot_available && customizingDrink.iced_available && (
                <div>
                  <label className="font-bold text-[#351B38] block mb-1.5 uppercase tracking-wider text-[10px]">
                    Serving Temperature
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedTemp('hot')}
                      className={`py-2 px-3 rounded-md font-bold text-center border cursor-pointer transition-colors ${
                        selectedTemp === 'hot'
                          ? 'bg-[#4B274F] text-white border-[#4B274F]'
                          : 'bg-white border-[#E8DED2] text-[#2A1B17]'
                      }`}
                    >
                      Hot
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedTemp('iced')}
                      className={`py-2 px-3 rounded-md font-bold text-center border cursor-pointer transition-colors ${
                        selectedTemp === 'iced'
                          ? 'bg-[#4B274F] text-white border-[#4B274F]'
                          : 'bg-white border-[#E8DED2] text-[#2A1B17]'
                      }`}
                    >
                      Iced
                    </button>
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {customizingDrink.size_options && typeof customizingDrink.size_options === 'object' && (
                <div>
                  <label className="font-bold text-[#351B38] block mb-1.5 uppercase tracking-wider text-[10px]">
                    Choose Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(customizingDrink.size_options).map(([sKey, sPrice]) => (
                      <button
                        key={sKey}
                        type="button"
                        onClick={() => setSelectedSize(sKey)}
                        className={`py-2 px-2 rounded-md font-bold text-center border cursor-pointer transition-colors text-xs ${
                          selectedSize === sKey
                            ? 'bg-[#4B274F] text-white border-[#4B274F]'
                            : 'bg-white border-[#E8DED2] text-[#2A1B17]'
                        }`}
                      >
                        <span className="block">{sKey}</span>
                        <span className="text-[10px] opacity-80 font-normal">Rs. {Number(sPrice).toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Milk Alternative Options */}
              {Array.isArray(customizingDrink.milk_options) && customizingDrink.milk_options.length > 0 && (
                <div>
                  <label className="font-bold text-[#351B38] block mb-1.5 uppercase tracking-wider text-[10px]">
                    Milk Selection
                  </label>
                  <select
                    value={selectedMilk}
                    onChange={(e) => setSelectedMilk(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E8DED2] rounded-md text-xs font-semibold focus:outline-none focus:border-[#4B274F]"
                  >
                    {customizingDrink.milk_options.map((m) => (
                      <option key={m} value={m}>
                        {m} {m !== 'Whole Milk' && m !== 'Skim Milk' ? '(+Rs. 200)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Add-ons: Extra Espresso Shot & Whipped Cream */}
              <div className="space-y-2 pt-2 border-t border-[#E8DED2]">
                <span className="font-bold text-[#351B38] block uppercase tracking-wider text-[10px]">
                  Custom Add-ons
                </span>

                {customizingDrink.extra_shot_available && (
                  <label className="flex items-center justify-between p-2.5 bg-white border border-[#E8DED2] rounded-md cursor-pointer">
                    <span className="font-semibold text-xs">Extra Espresso Shot</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#4B274F]">+Rs. 180</span>
                      <input
                        type="checkbox"
                        checked={addExtraShot}
                        onChange={(e) => setAddExtraShot(e.target.checked)}
                        className="w-4 h-4 accent-[#4B274F]"
                      />
                    </div>
                  </label>
                )}

                {customizingDrink.whipped_cream_available && (
                  <label className="flex items-center justify-between p-2.5 bg-white border border-[#E8DED2] rounded-md cursor-pointer">
                    <span className="font-semibold text-xs">Fresh Whipped Cream</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#4B274F]">+Rs. 120</span>
                      <input
                        type="checkbox"
                        checked={addWhippedCream}
                        onChange={(e) => setAddWhippedCream(e.target.checked)}
                        className="w-4 h-4 accent-[#4B274F]"
                      />
                    </div>
                  </label>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-xs">Quantity</span>
                <div className="inline-flex items-center border border-[#E8DED2] bg-white rounded-md">
                  <button
                    onClick={() => setCustomQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-[#2A1B17] hover:bg-[#F5F0E8] cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 py-1 text-xs font-bold">{customQty}</span>
                  <button
                    onClick={() => setCustomQty((q) => q + 1)}
                    className="px-3 py-1.5 text-[#2A1B17] hover:bg-[#F5F0E8] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Action */}
            <button
              onClick={handleAddToCartCustomized}
              className={`w-full py-3.5 text-xs font-bold uppercase tracking-[0.15em] rounded-md transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                addedToast ? 'bg-[#351B38] text-white' : 'bg-[#4B274F] hover:bg-[#351B38] text-white'
              }`}
            >
              {addedToast ? (
                <>
                  <Check className="w-4 h-4" /> Added to Order!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Order • Rs. {(calculateCustomPrice() * customQty).toLocaleString()}
                </>
              )}
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
