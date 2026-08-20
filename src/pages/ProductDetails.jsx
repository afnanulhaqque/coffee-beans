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
  Coffee, 
  ChevronRight,
  Flame,
  Globe,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        const p = res.data.product;
        setProduct(p);
        setSelectedImage(p.image);
        setQuantity(1);
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
      <div className="pt-36 pb-24 max-w-7xl mx-auto px-6 sm:px-8 font-body">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-[#EDE4D8]/60 aspect-square rounded-sm" />
          <div className="space-y-6 pt-4">
            <div className="h-4 bg-[#EDE4D8] w-24 rounded" />
            <div className="h-10 bg-[#EDE4D8] w-3/4 rounded" />
            <div className="h-6 bg-[#EDE4D8] w-1/4 rounded" />
            <div className="h-24 bg-[#EDE4D8] w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-40 pb-24 text-center space-y-4 max-w-md mx-auto px-4 font-body">
        <h2 className="font-display text-3xl text-[#24150F]">Product Not Found</h2>
        <p className="text-xs text-[#756A62] font-normal">The coffee or tea blend you requested could not be located.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-[#24150F] text-white text-xs font-semibold uppercase tracking-widest rounded-sm">
          Return to Shop
        </Link>
      </div>
    );
  }

  const galleryImages = [
    product.image,
    ...(product.additional_images || []),
  ].filter(Boolean);

  const isOutOfStock = !product.is_in_stock || product.stock_quantity <= 0;
  const displayPrice = product.sale_price && product.sale_price > 0 ? product.sale_price : product.price;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="pt-28 sm:pt-36 pb-24 px-6 sm:px-8 max-w-7xl mx-auto space-y-16 text-[#1C1714] font-body">
      
      {/* Breadcrumb Trail */}
      <nav className="flex items-center gap-2 text-xs text-[#756A62] font-medium">
        <Link to="/" className="hover:text-[#24150F]">Home</Link>
        <ChevronRight className="w-3 h-3 text-[#B8895B]" />
        <Link to="/shop" className="hover:text-[#24150F]">Shop</Link>
        <ChevronRight className="w-3 h-3 text-[#B8895B]" />
        {product.category_name && (
          <>
            <Link to={`/shop?category=${encodeURIComponent(product.category_slug || '')}`} className="hover:text-[#24150F]">
              {product.category_name}
            </Link>
            <ChevronRight className="w-3 h-3 text-[#B8895B]" />
          </>
        )}
        <span className="text-[#24150F] font-semibold line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Stage: 2-Column Luxury Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Image Gallery (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Large Main Feature Image */}
          <div className="aspect-square bg-white border border-[#EDE4D8] rounded-sm overflow-hidden shadow-xs relative">
            <img
              src={selectedImage || product.image || '/placeholder-coffee.jpg'}
              alt={product.name}
              className="w-full h-full object-cover product-image-zoom"
            />
            {product.is_best_seller && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-[#B8895B] text-white text-[10px] uppercase tracking-widest font-semibold">
                Signature Favorite
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 bg-white border rounded-sm overflow-hidden shrink-0 transition-all ${
                    selectedImage === img
                      ? 'border-[#24150F] ring-1 ring-[#24150F]'
                      : 'border-[#EDE4D8] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} gallery ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Narrative & Purchasing (Span 5) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          
          <div className="space-y-2 pb-4 border-b border-[#EDE4D8]">
            <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#B8895B] block">
              {product.origin || product.category_name || 'Specialty Single Origin'}
            </span>
            {/* Title in DM Serif Display */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#24150F] leading-tight">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="text-xs sm:text-sm text-[#756A62] leading-relaxed font-normal pt-1">
                {product.short_description}
              </p>
            )}
          </div>

          {/* Price & SKU */}
          <div className="flex items-baseline justify-between">
            <div className="space-x-3">
              <span className="font-bold text-2xl sm:text-3xl text-[#24150F]">
                Rs. {displayPrice?.toLocaleString()}
              </span>
              {product.sale_price && product.sale_price > 0 && (
                <span className="text-sm text-[#756A62] line-through font-normal">
                  Rs. {product.price?.toLocaleString()}
                </span>
              )}
            </div>
            {product.sku && (
              <span className="text-[11px] font-mono text-[#756A62]">
                SKU: {product.sku}
              </span>
            )}
          </div>

          {/* Quick Roast & Origin Metadata Bar */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-white border border-[#EDE4D8] rounded-sm text-xs">
            <div>
              <span className="text-[10px] uppercase font-medium text-[#756A62] block">Roast Level</span>
              <span className="font-semibold text-[#24150F]">{product.roast_level || 'Medium Roast'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-medium text-[#756A62] block">Availability</span>
              <span className={`font-semibold ${product.is_in_stock ? 'text-emerald-700' : 'text-red-700'}`}>
                {product.is_in_stock ? `In Stock (${product.stock_quantity} available)` : 'Sold Out'}
              </span>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#24150F]">Quantity</span>
              
              <div className="inline-flex items-center border border-[#24150F] bg-white rounded-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-[#24150F] hover:bg-[#F6F1E9] transition-colors disabled:opacity-30"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-1 text-xs font-semibold text-[#24150F]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 99, q + 1))}
                  disabled={quantity >= product.stock_quantity || isOutOfStock}
                  className="px-3 py-2 text-[#24150F] hover:bg-[#F6F1E9] transition-colors disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons in Plus Jakarta Sans (Weight 600) */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury flex items-center justify-center gap-2 shadow-md ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-800 text-white'
                    : 'bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9]'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" /> Added to Bag
                  </>
                ) : isOutOfStock ? (
                  'Currently Out of Stock'
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#B8895B]" /> Add To Bag
                  </>
                )}
              </button>

              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-[#B8895B] hover:bg-[#a37549] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-xs"
                >
                  Buy It Now
                </button>
              )}
            </div>
          </div>

          {/* Delivery & Security Guarantee Box */}
          <div className="p-4 bg-[#EDE4D8]/50 border border-[#EDE4D8] rounded-sm space-y-2.5 text-xs text-[#5A3825]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#B8895B] shrink-0" />
              <span><strong>Free Delivery</strong> on orders exceeding Rs. 3,500.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#B8895B] shrink-0" />
              <span>Cash on Delivery available nationwide with door tracking.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#B8895B] shrink-0" />
              <span>Roasted in micro-batches with one-way freshness degas seal.</span>
            </div>
          </div>

        </div>

      </div>

      {/* Accordion / Tabbed Details: Description, Brewing Guide, Tasting Notes */}
      <div className="pt-12 border-t border-[#EDE4D8] space-y-8">
        
        <div className="flex items-center gap-6 border-b border-[#EDE4D8] pb-3 text-xs uppercase tracking-widest font-semibold">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'description'
                ? 'text-[#24150F] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B8895B]'
                : 'text-[#756A62] hover:text-[#24150F]'
            }`}
          >
            Roastery Profile &amp; Description
          </button>
          <button
            onClick={() => setActiveTab('brewing')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'brewing'
                ? 'text-[#24150F] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B8895B]'
                : 'text-[#756A62] hover:text-[#24150F]'
            }`}
          >
            Recommended Brewing Guide
          </button>
        </div>

        {activeTab === 'description' ? (
          <div className="max-w-3xl space-y-4 text-sm text-[#5A3825] leading-relaxed font-normal">
            <p className="whitespace-pre-line">{product.description}</p>
            {product.tags && (
              <div className="pt-4 flex flex-wrap gap-2">
                {(Array.isArray(product.tags) ? product.tags : product.tags.split(',')).map((t, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-[#EDE4D8] text-[11px] font-medium text-[#5A3825] rounded-sm">
                    #{t.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl">
            <div className="p-5 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
              <span className="font-semibold text-base text-[#24150F] block">French Press</span>
              <p className="text-xs text-[#756A62] leading-relaxed font-normal">
                Coarse grind. 1:15 coffee to water ratio. Steep for 4 minutes with 93°C water, then gently press for rich body.
              </p>
            </div>
            <div className="p-5 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
              <span className="font-semibold text-base text-[#24150F] block">Pour Over (V60)</span>
              <p className="text-xs text-[#756A62] leading-relaxed font-normal">
                Medium-fine grind. Bloom for 45 seconds with 50ml water. Continuous slow pour to highlight floral origin aromatics.
              </p>
            </div>
            <div className="p-5 bg-white border border-[#EDE4D8] rounded-sm space-y-2">
              <span className="font-semibold text-base text-[#24150F] block">Espresso Extraction</span>
              <p className="text-xs text-[#756A62] leading-relaxed font-normal">
                Fine grind. 18g dose extracting 36g espresso in 27-30 seconds at 9 bars of pressure for heavy crema.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Related Products Carousel / Grid */}
      {product.related_products && product.related_products.length > 0 && (
        <div className="pt-16 border-t border-[#EDE4D8] space-y-8">
          <div className="space-y-1">
            <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#B8895B] block">
              MORE LIKE THIS
            </span>
            <h3 className="font-display text-2xl sm:text-3xl text-[#24150F]">
              You May Also Enjoy
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {product.related_products.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
