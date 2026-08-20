import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ChevronRight,
  Package,
  Cake as CakeIcon,
  Coffee,
  Flame,
  Droplets,
  AlertCircle,
  UtensilsCrossed
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Customization options for Beverages
  const [selectedTemp, setSelectedTemp] = useState('hot');
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedMilk, setSelectedMilk] = useState('Whole Milk');
  const [addExtraShot, setAddExtraShot] = useState(false);
  const [addWhippedCream, setAddWhippedCream] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        const p = res.data.product;
        setProduct(p);
        setSelectedImage(p.image || p.image_url || '');
        setQuantity(1);

        // Set defaults for beverage customizations
        if (p.product_type === 'beverage') {
          setSelectedTemp(p.hot_available ? 'hot' : 'iced');
          if (p.size_options && typeof p.size_options === 'object') {
            const keys = Object.keys(p.size_options);
            setSelectedSize(keys.includes('Regular') ? 'Regular' : keys[0] || 'Regular');
          } else {
            setSelectedSize('Regular');
          }
          if (Array.isArray(p.milk_options) && p.milk_options.length > 0) {
            setSelectedMilk(p.milk_options[0]);
          } else {
            setSelectedMilk('Whole Milk');
          }
          setAddExtraShot(false);
          setAddWhippedCream(false);
        }

        // Fetch related products
        if (p.category_id || p.category_slug || p.product_type) {
          const typeParam = p.product_type ? `&type=${p.product_type}` : '';
          const catParam = p.category_slug ? `category=${p.category_slug}` : '';
          const relRes = await api.get(`/products?${catParam}${typeParam}&limit=4`);
          const filtered = (relRes.data.products || []).filter(item => item.id !== p.id);
          setRelatedProducts(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-body">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-white border border-[#E8DED2] aspect-square rounded-md" />
          <div className="space-y-6 pt-4">
            <div className="h-4 bg-[#E8DED2] w-24 rounded" />
            <div className="h-10 bg-[#E8DED2] w-3/4 rounded" />
            <div className="h-6 bg-[#E8DED2] w-1/4 rounded" />
            <div className="h-24 bg-[#E8DED2] w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-24 text-center space-y-4 max-w-md mx-auto px-4 font-body">
        <h2 className="font-display text-3xl font-bold text-[#351B38]">Product Not Found</h2>
        <p className="text-xs text-[#6B4A3A]">The item you requested could not be located in our catalog.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-widest rounded-md">
          Explore Catalog
        </Link>
      </div>
    );
  }

  const isBeverage = product.product_type === 'beverage';
  const isFood = product.product_type === 'food';
  const isOutOfStock = !product.is_in_stock || product.stock_quantity <= 0 || product.availability === 'Out of Stock';

  // Compute live price with beverage modifiers
  const calculateLivePrice = () => {
    if (isBeverage) {
      let base = 0;
      if (product.size_options && typeof product.size_options === 'object') {
        base = product.size_options[selectedSize] || product.price || 750;
      } else {
        base = product.price || 750;
      }
      if (addExtraShot) base += 180;
      if (addWhippedCream) base += 120;
      if (selectedMilk && selectedMilk !== 'Whole Milk' && selectedMilk !== 'Skim Milk') {
        base += 200;
      }
      return base;
    }

    if (product.sale_price && product.sale_price > 0) return product.sale_price;
    return product.price;
  };

  const currentUnitPrice = calculateLivePrice();

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    if (isBeverage) {
      const configuredItem = {
        ...product,
        price: currentUnitPrice,
        effective_price: currentUnitPrice,
        selected_size: selectedSize,
        selected_temperature: selectedTemp,
        selected_options: {
          size: selectedSize,
          temperature: selectedTemp,
          milk: product.milk_options ? selectedMilk : null,
          extra_shot: addExtraShot,
          whipped_cream: addWhippedCream,
        },
        cart_item_key: `${product.id}-${selectedSize}-${selectedTemp}-${selectedMilk}-${addExtraShot}-${addWhippedCream}`
      };
      addToCart(configuredItem, quantity);
    } else {
      addToCart(product, quantity);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  // Determine section paths for breadcrumbs
  const sectionTitle = product.product_type === 'tea' 
    ? 'Tea' 
    : product.product_type === 'cake' 
    ? 'Cake To Go' 
    : product.product_type === 'beverage'
    ? 'Beverages'
    : product.product_type === 'food'
    ? 'Food & Kitchen'
    : 'Coffee';

  const sectionUrl = product.product_type === 'tea' 
    ? '/tea' 
    : product.product_type === 'cake' 
    ? '/cake-to-go' 
    : product.product_type === 'beverage'
    ? '/beverage'
    : product.product_type === 'food'
    ? '/food'
    : '/coffee';

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 text-[#2A1B17] font-body">
      
      {/* Breadcrumb Trail */}
      <nav className="flex items-center gap-2 text-xs text-[#6B4A3A] font-medium flex-wrap">
        <Link to="/" className="hover:text-[#4B274F]">Home</Link>
        <ChevronRight className="w-3 h-3 text-[#4B274F]" />
        <Link to={sectionUrl} className="hover:text-[#4B274F]">{sectionTitle}</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3 h-3 text-[#4B274F]" />
            <Link to={`${sectionUrl}?category=${encodeURIComponent(product.category_slug || '')}`} className="hover:text-[#4B274F]">
              {product.category}
            </Link>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-[#4B274F]" />
        <span className="text-[#351B38] font-bold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Stage: 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Left Column: Image Gallery (Span 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-white border border-[#E8DED2] rounded-md overflow-hidden shadow-xs relative flex items-center justify-center p-6 sm:p-10">
            <img
              src={selectedImage || product.image || product.image_url || '/placeholder-coffee.jpg'}
              alt={product.name}
              className="w-full h-full object-contain product-image-zoom"
            />
            {product.pack_size && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-[#F5F0E8] border border-[#E8DED2] text-[#4B274F] text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1">
                <Package className="w-3.5 h-3.5" /> {product.pack_size}
              </span>
            )}
            {product.serving_size && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-[#F5F0E8] border border-[#E8DED2] text-[#4B274F] text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1">
                <CakeIcon className="w-3.5 h-3.5" /> {product.serving_size}
              </span>
            )}
            {product.portion && (
              <span className="absolute top-4 right-4 px-3 py-1 bg-[#F5F0E8] border border-[#E8DED2] text-[#4B274F] text-xs font-bold uppercase tracking-wider rounded-xs flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5" /> {product.portion}
              </span>
            )}
            {product.is_best_seller && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#4B274F] text-white text-[10px] uppercase tracking-widest font-semibold rounded-xs">
                Signature Favorite
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Product Narrative & Customization (Span 6) */}
        <div className="lg:col-span-6 space-y-6 lg:sticky lg:top-32">
          
          <div className="space-y-2 pb-4 border-b border-[#E8DED2]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#4B274F] block">
                {product.category || product.category_name || 'Signature Selection'}
              </span>
              {product.tea_type && (
                <span className="text-xs font-bold text-[#6B4A3A]">
                  Type: {product.tea_type}
                </span>
              )}
              {product.cake_type && (
                <span className="text-xs font-bold text-[#6B4A3A]">
                  {product.cake_type}
                </span>
              )}
              {product.beverage_type && (
                <span className="text-xs font-bold text-[#6B4A3A]">
                  {product.beverage_type}
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl text-[#351B38] font-bold leading-tight">
              {product.name}
            </h1>

            {product.flavor_profile && (
              <p className="text-xs sm:text-sm text-[#4B274F] font-semibold italic pt-1">
                "{product.flavor_profile}"
              </p>
            )}

            {product.short_description && product.short_description !== product.flavor_profile && (
              <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed pt-1">
                {product.short_description}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div>
              {currentUnitPrice ? (
                <div className="space-x-3">
                  <span className="font-bold text-2xl sm:text-3xl text-[#4B274F]">
                    Rs. {Number(currentUnitPrice).toLocaleString()}
                  </span>
                  {product.sale_price && product.sale_price > 0 && !isBeverage && (
                    <span className="text-sm text-[#6B4A3A] line-through font-normal">
                      Rs. {Number(product.price).toLocaleString()}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-sm font-semibold text-[#6B4A3A] italic">
                  Price at counter
                </span>
              )}
            </div>
            {product.sku && (
              <span className="text-[11px] font-mono text-[#6B4A3A]">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Beverage Customization Options */}
          {isBeverage && (
            <div className="space-y-4 p-4 bg-white border border-[#E8DED2] rounded-md text-xs">
              
              {/* Temperature Selector */}
              {product.hot_available && product.iced_available && (
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
                          : 'bg-[#F5F0E8] border-[#E8DED2] text-[#2A1B17]'
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
                          : 'bg-[#F5F0E8] border-[#E8DED2] text-[#2A1B17]'
                      }`}
                    >
                      Iced
                    </button>
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.size_options && typeof product.size_options === 'object' && (
                <div>
                  <label className="font-bold text-[#351B38] block mb-1.5 uppercase tracking-wider text-[10px]">
                    Choose Size
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(product.size_options).map(([sKey, sPrice]) => (
                      <button
                        key={sKey}
                        type="button"
                        onClick={() => setSelectedSize(sKey)}
                        className={`py-2 px-2 rounded-md font-bold text-center border cursor-pointer transition-colors text-xs ${
                          selectedSize === sKey
                            ? 'bg-[#4B274F] text-white border-[#4B274F]'
                            : 'bg-[#F5F0E8] border-[#E8DED2] text-[#2A1B17]'
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
              {Array.isArray(product.milk_options) && product.milk_options.length > 0 && (
                <div>
                  <label className="font-bold text-[#351B38] block mb-1.5 uppercase tracking-wider text-[10px]">
                    Milk Selection
                  </label>
                  <select
                    value={selectedMilk}
                    onChange={(e) => setSelectedMilk(e.target.value)}
                    className="w-full p-2.5 bg-[#F5F0E8] border border-[#E8DED2] rounded-md text-xs font-semibold focus:outline-none focus:border-[#4B274F]"
                  >
                    {product.milk_options.map((m) => (
                      <option key={m} value={m}>
                        {m} {m !== 'Whole Milk' && m !== 'Skim Milk' ? '(+Rs. 200)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Add-ons */}
              {(product.extra_shot_available || product.whipped_cream_available) && (
                <div className="space-y-2 pt-2 border-t border-[#E8DED2]">
                  <span className="font-bold text-[#351B38] block uppercase tracking-wider text-[10px]">
                    Custom Add-ons
                  </span>

                  {product.extra_shot_available && (
                    <label className="flex items-center justify-between p-2 bg-[#F5F0E8] border border-[#E8DED2] rounded-md cursor-pointer">
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

                  {product.whipped_cream_available && (
                    <label className="flex items-center justify-between p-2 bg-[#F5F0E8] border border-[#E8DED2] rounded-md cursor-pointer">
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
              )}

            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A1B17]">Quantity</span>
              
              <div className="inline-flex items-center border border-[#E8DED2] bg-white rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-[#2A1B17] hover:bg-[#F5F0E8] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1 text-xs font-bold text-[#2A1B17]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 99, q + 1))}
                  disabled={quantity >= (product.stock_quantity || 99) || isOutOfStock}
                  className="px-3 py-2 text-[#2A1B17] hover:bg-[#F5F0E8] transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 text-xs font-bold uppercase tracking-[0.15em] rounded-md transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-[#351B38] text-white'
                    : 'bg-[#4B274F] hover:bg-[#351B38] text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" /> Added to Order
                  </>
                ) : isOutOfStock ? (
                  'Currently Unavailable'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-white" /> Add to Order
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 bg-white border-2 border-[#4B274F] hover:bg-[#4B274F] text-[#4B274F] hover:text-white text-xs font-bold uppercase tracking-[0.15em] rounded-md transition-colors disabled:opacity-30 cursor-pointer"
              >
                Checkout Now
              </button>
            </div>
          </div>

          {/* Guarantees */}
          <div className="border-t border-[#E8DED2] pt-6 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="space-y-1">
              <Truck className="w-4 h-4 text-[#4B274F] mx-auto" />
              <span className="text-[10px] font-bold text-[#2A1B17] block">Cafe Express</span>
              <span className="text-[9px] text-[#6B4A3A] block">Freshly Prepared</span>
            </div>
            <div className="space-y-1">
              <RefreshCw className="w-4 h-4 text-[#4B274F] mx-auto" />
              <span className="text-[10px] font-bold text-[#2A1B17] block">Authentic Recipe</span>
              <span className="text-[9px] text-[#6B4A3A] block">Brewed to Order</span>
            </div>
            <div className="space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#4B274F] mx-auto" />
              <span className="text-[10px] font-bold text-[#2A1B17] block">CBTL Quality</span>
              <span className="text-[9px] text-[#6B4A3A] block">Finest Ingredients</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Section: Description, Preparation, Ingredients */}
      <div className="border-t border-[#E8DED2] pt-12 space-y-6">
        <div className="flex items-center gap-6 border-b border-[#E8DED2] text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 transition-colors relative cursor-pointer ${
              activeTab === 'description'
                ? 'text-[#4B274F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4B274F]'
                : 'text-[#6B4A3A] hover:text-[#4B274F]'
            }`}
          >
            Product Story &amp; Details
          </button>
          
          {(product.brewing_instructions || product.product_type === 'tea' || product.product_type === 'coffee') && (
            <button
              onClick={() => setActiveTab('brewing')}
              className={`pb-3 transition-colors relative cursor-pointer ${
                activeTab === 'brewing'
                  ? 'text-[#4B274F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4B274F]'
                  : 'text-[#6B4A3A] hover:text-[#4B274F]'
              }`}
            >
              Preparation Guide
            </button>
          )}

          {(product.ingredients || product.allergen_information || product.allergens) && (
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3 transition-colors relative cursor-pointer ${
                activeTab === 'ingredients'
                  ? 'text-[#4B274F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#4B274F]'
                  : 'text-[#6B4A3A] hover:text-[#4B274F]'
              }`}
            >
              Ingredients &amp; Allergens
            </button>
          )}
        </div>

        <div className="max-w-3xl text-xs sm:text-sm text-[#6B4A3A] leading-relaxed space-y-4">
          {activeTab === 'description' && (
            <div className="space-y-3">
              <p>{product.description || product.short_description || 'Carefully sourced and crafted to the highest quality standards.'}</p>
            </div>
          )}

          {activeTab === 'brewing' && (
            <div className="space-y-3">
              {product.brewing_instructions ? (
                <p>{product.brewing_instructions}</p>
              ) : product.product_type === 'tea' ? (
                <div>
                  <p className="font-bold text-[#2A1B17] mb-2">Artisan Tea Steeping Guide:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Water Temperature: 80°C - 85°C for Green / White teas, 95°C - 100°C for Black / Herbal.</li>
                    <li>Steep Duration: 3-4 minutes for Green, 5 minutes for Black &amp; Herbal infusions.</li>
                    <li>Portion: 1 full leaf sachet or 2.5g loose whole leaf per 8oz filtered water.</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-[#2A1B17] mb-2">Recommended Preparation:</p>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li>Pour-Over / Filter: 1:16 ratio using 92°C to 94°C water.</li>
                    <li>French Press: Coarse grind, 4 minutes immersion steep.</li>
                    <li>Espresso: Fine grind, 1:2 yield in 25–30 seconds.</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              {product.ingredients && (
                <div>
                  <span className="font-bold text-[#2A1B17] block mb-1">Ingredients:</span>
                  <p>{product.ingredients}</p>
                </div>
              )}
              {(product.allergen_information || product.allergens) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Allergen Notice:</span>
                    <p>{product.allergen_information || product.allergens}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#E8DED2] pt-16 space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#4B274F] block">
              YOU MAY ALSO ENJOY
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38]">
              Complementary {sectionTitle} Selections
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
