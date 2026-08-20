import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChevronRight, Check } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import MosaicHeritageGrid from '../components/MosaicHeritageGrid';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true);
      try {
        const [featRes, bestRes] = await Promise.all([
          api.get('/products?featured=true&limit=3'),
          api.get('/products?sort=best_selling&limit=4'),
        ]);

        setFeaturedProducts(featRes.data.products || []);
        setBestSellers(bestRes.data.products || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (subscriberEmail.trim()) {
      setEmailSubscribed(true);
      setSubscriberEmail('');
    }
  };

  const roastTiles = [
    {
      title: 'Light & Distinctive',
      descriptors: ['Bright Citrus', 'Floral Aromatics', 'Crisp Finish'],
      slug: 'light-distinctive',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Rich & Smooth',
      descriptors: ['Milk Chocolate', 'Toasted Walnut', 'Balanced Body'],
      slug: 'rich-smooth',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Dark & Distinctive',
      descriptors: ['Deep Cocoa', 'Caramelized Sugar', 'Heavy Body'],
      slug: 'dark-distinctive',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: 'Artisan Whole Leaf Tea',
      descriptors: ['Top Two Leaves', 'Single Estate', 'Delicate Nuance'],
      slug: 'tea',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-0 text-[#2A1B17] font-body bg-[#F5F0E8]">
      
      {/* 1. HERO SECTION (Warm coffee/tea photography with Bossanova accents) */}
      <section className="relative h-screen min-h-160 flex items-center justify-center bg-[#2A1B17] text-[#F5F0E8] overflow-hidden">
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=85"
            alt="Estate Coffee Background"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#2A1B17] via-[#2A1B17]/60 to-[#351B38]/80" />
        </div>

        {/* Hero Copy Stage */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8 pt-20">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#E8DED2] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#E8DED2]" />
            <span>Top 1% High-Altitude Arabica &amp; Handcrafted Teas</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-[84px] leading-[1.04] text-white tracking-tight">
            Crafted With Character. <br />
            Roasted For The Senses.
          </h1>

          <p className="text-base sm:text-lg lg:text-[19px] text-[#E8DED2] max-w-2xl mx-auto font-normal leading-relaxed">
            Born and brewed in Southern California since 1963. Sourcing only the top 1% of Arabica beans and whole leaf teas for coffee lovers across Pakistan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/coffee"
              className="w-full sm:w-auto px-9 py-4 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury shadow-lg flex items-center justify-center gap-2"
            >
              Shop Coffee Roasts <ArrowRight className="w-4 h-4 text-white" />
            </Link>
            
            <Link
              to="/tea"
              className="w-full sm:w-auto px-9 py-4 bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition-luxury flex items-center justify-center gap-2"
            >
              Artisan Whole Leaf Tea
            </Link>
          </div>

        </div>

        {/* Scroll Prompt */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll to explore</span>
          <div className="w-4 h-7 border border-white/40 rounded-full flex justify-center pt-1">
            <div className="w-1 h-1.5 bg-[#E8DED2] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8DED2] pb-6">
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
              ESTATE SELECTIONS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#351B38]">
              Discover Your Next Cup
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest font-semibold text-[#2A1B17] hover:text-[#4B274F] flex items-center gap-1.5 transition-colors"
          >
            <span>View Complete Catalog</span>
            <ChevronRight className="w-4 h-4 text-[#4B274F]" />
          </Link>
        </div>

        {/* 3 Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {loading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-[#E8DED2] h-96 animate-pulse rounded-md" />
            ))
          ) : (
            featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* 3. ROAST PROFILES CATEGORY */}
      <section className="py-20 sm:py-28 bg-white border-y border-[#E8DED2]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
              ROAST SPECTRUM
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#351B38]">
              Find Your Flavor Profile
            </h2>
            <p className="text-xs sm:text-sm text-[#6B4A3A] font-normal leading-relaxed">
              Every bean is calibrated with temperature and time to highlight origin florals, rich chocolates, or intense dark roasts.
            </p>
          </div>

          {/* 4 Tiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roastTiles.map((tile) => (
              <Link
                key={tile.slug}
                to={tile.slug === 'tea' ? '/tea' : `/shop/coffee/${tile.slug}`}
                className="group relative h-96 rounded-md overflow-hidden bg-[#2A1B17] flex flex-col justify-end p-6 border border-[#E8DED2] shadow-xs"
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#351B38] via-[#351B38]/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <h3 className="font-display text-2xl text-white group-hover:text-[#E8DED2] transition-colors">
                    {tile.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#E8DED2] tracking-wider uppercase font-medium">
                    {tile.descriptors.join(' • ')}
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-[#E8DED2] font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 4. BEST SELLERS SHOWCASE */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 pb-6 border-b border-[#E8DED2]">
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#4B274F] block">
              MOST POPULAR
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#351B38]">
              Loved By Coffee People
            </h2>
            <p className="text-xs text-[#6B4A3A] font-normal">
              The daily roasts and reserve batches chosen again and again.
            </p>
          </div>

          <Link
            to="/shop?sort=best_selling"
            className="text-xs uppercase tracking-widest font-semibold text-[#2A1B17] hover:text-[#4B274F] flex items-center gap-1.5"
          >
            <span>View Best Sellers</span>
            <ChevronRight className="w-4 h-4 text-[#4B274F]" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white border border-[#E8DED2] h-80 animate-pulse rounded-md" />
            ))
          ) : (
            bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* 5. BRAND MOSAIC & HERITAGE BENTO GRID */}
      <MosaicHeritageGrid />

      {/* 6. NEWSLETTER */}
      <section className="py-20 sm:py-28 bg-[#E8DED2]/40 text-[#2A1B17] px-6 sm:px-8 border-t border-[#E8DED2]">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#4B274F] block">
            STAY IN THE LOOP
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#351B38] leading-tight">
            Coffee stories, new arrivals, <br className="hidden sm:inline" />
            and things worth brewing.
          </h2>
          <p className="text-xs sm:text-sm text-[#6B4A3A] font-normal max-w-md mx-auto leading-relaxed">
            Subscribe to our weekly dispatch for early access to micro-lot harvests, seasonal specials, and brewing techniques.
          </p>

          {emailSubscribed ? (
            <div className="p-4 bg-white border border-[#4B274F] rounded-md text-[#4B274F] text-xs font-semibold flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Thank you for subscribing to The Coffee Bean dispatch!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                required
                placeholder="Your email address"
                className="flex-1 px-4 py-3.5 bg-white border border-[#E8DED2] rounded-md text-xs text-[#2A1B17] placeholder-[#6B4A3A] focus:outline-none focus:border-[#4B274F] focus:ring-1 focus:ring-[#4B274F] shadow-xs"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#4B274F] hover:bg-[#351B38] text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-md transition-luxury shrink-0 shadow-md"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[10px] text-[#6B4A3A] font-normal">
            We respect your inbox. Unsubscribe anytime with one click.
          </p>
        </div>
      </section>

    </div>
  );
}
