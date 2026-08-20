import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Award, Sparkles, MapPin, ChevronRight, Check } from 'lucide-react';
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
    <div className="space-y-0 text-[#1C1714] font-body bg-[#F6F1E9]">
      
      {/* 1. HERO SECTION (100vh Full Screen) */}
      <section className="relative h-screen min-h-160 flex items-center justify-center bg-[#24150F] text-[#F6F1E9] overflow-hidden">
        
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=2000&q=85"
            alt="Estate Coffee Background"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#24150F] via-[#24150F]/50 to-[#24150F]/80" />
        </div>

        {/* Hero Copy Stage */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-8 pt-20">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#EDE4D8] text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#B8895B]" />
            <span>Top 1% High-Altitude Single Origin</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-[84px] leading-[1.04] text-white tracking-tight">
            Crafted With Character. <br />
            Roasted For The Senses.
          </h1>

          <p className="text-base sm:text-lg lg:text-[19px] text-[#EDE4D8] max-w-2xl mx-auto font-normal leading-relaxed">
            Since 1963, we have sourced only the rarest estate beans and artisan whole leaf teas. Micro-batch roasted to honor every origin's natural voice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop/coffee"
              className="w-full sm:w-auto px-9 py-4 bg-[#B8895B] hover:bg-[#a37549] text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury shadow-lg flex items-center justify-center gap-2"
            >
              Shop Coffee Roasts <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to="/shop/tea"
              className="w-full sm:w-auto px-9 py-4 bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white text-xs font-semibold uppercase tracking-[0.2em] rounded-sm transition-luxury flex items-center justify-center gap-2"
            >
              Artisan Whole Leaf Tea
            </Link>
          </div>

        </div>

        {/* Scroll Prompt */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
          <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Scroll to explore</span>
          <div className="w-4 h-7 border border-white/40 rounded-full flex justify-center pt-1">
            <div className="w-1 h-1.5 bg-[#B8895B] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS (3-Column Large Imagery Showcase) */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EDE4D8] pb-6">
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
              ESTATE SELECTIONS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#24150F]">
              Discover Your Next Cup
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs uppercase tracking-widest font-semibold text-[#24150F] hover:text-[#B8895B] flex items-center gap-1.5 transition-colors"
          >
            <span>View Complete Catalog</span>
            <ChevronRight className="w-4 h-4 text-[#B8895B]" />
          </Link>
        </div>

        {/* 3 Large Featured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {loading ? (
            [1, 2, 3].map((n) => (
              <div key={n} className="bg-[#EDE4D8]/50 h-96 animate-pulse rounded-sm" />
            ))
          ) : (
            featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))
          )}
        </div>
      </section>

      {/* 3. ROAST PROFILES CATEGORY (4 Large Image Tiles) */}
      <section className="py-20 sm:py-28 bg-[#EDE4D8]/50 border-y border-[#EDE4D8]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
              ROAST SPECTRUM
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#24150F]">
              Find Your Flavor Profile
            </h2>
            <p className="text-xs sm:text-sm text-[#756A62] font-normal leading-relaxed">
              Every bean is calibrated with temperature and time to highlight origin florals, rich chocolates, or intense dark roasts.
            </p>
          </div>

          {/* 4 Large Tiles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roastTiles.map((tile) => (
              <Link
                key={tile.slug}
                to={tile.slug === 'tea' ? '/shop/tea' : `/shop/coffee/${tile.slug}`}
                className="group relative h-96 rounded-sm overflow-hidden bg-[#24150F] flex flex-col justify-end p-6 border border-[#24150F]/20 shadow-xs"
              >
                <img
                  src={tile.image}
                  alt={tile.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#24150F] via-[#24150F]/40 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <h3 className="font-display text-2xl text-white group-hover:text-[#B8895B] transition-colors">
                    {tile.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#EDE4D8] tracking-wider uppercase font-medium">
                    {tile.descriptors.join(' • ')}
                  </div>
                  <div className="pt-2 flex items-center gap-1.5 text-xs text-[#B8895B] font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* 4. LOVED BY COFFEE PEOPLE (Best Sellers Showcase) */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14 pb-6 border-b border-[#EDE4D8]">
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#B8895B] block">
              MOST POPULAR
            </span>
            <h2 className="font-display text-3xl sm:text-4xl text-[#24150F]">
              Loved By Coffee People
            </h2>
            <p className="text-xs text-[#756A62] font-normal">
              The daily roasts and reserve batches chosen again and again.
            </p>
          </div>

          <Link
            to="/shop?sort=best_selling"
            className="text-xs uppercase tracking-widest font-semibold text-[#24150F] hover:text-[#B8895B] flex items-center gap-1.5"
          >
            <span>View Best Sellers</span>
            <ChevronRight className="w-4 h-4 text-[#B8895B]" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-[#EDE4D8]/50 h-80 animate-pulse rounded-sm" />
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

      {/* 6. NEWSLETTER (Warm Cream/Sand Section with Clear Separation from Footer) */}
      <section className="py-20 sm:py-28 bg-[#EDE4D8]/80 text-[#1C1714] px-6 sm:px-8 border-t border-[#EDE4D8]">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <span className="text-[10px] tracking-[0.3em] uppercase font-medium text-[#B8895B] block">
            STAY IN THE LOOP
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#24150F] leading-tight">
            Coffee stories, new arrivals, <br className="hidden sm:inline" />
            and things worth brewing.
          </h2>
          <p className="text-xs sm:text-sm text-[#5A3825] font-normal max-w-md mx-auto leading-relaxed">
            Subscribe to our weekly dispatch for early access to micro-lot harvests, seasonal specials, and brewing techniques.
          </p>

          {emailSubscribed ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
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
                className="flex-1 px-4 py-3.5 bg-white border border-[#EDE4D8] rounded-sm text-xs text-[#24150F] placeholder-[#756A62] focus:outline-none focus:border-[#24150F] shadow-xs"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#24150F] hover:bg-[#5A3825] text-[#F6F1E9] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm transition-luxury shrink-0 shadow-md"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[10px] text-[#756A62] font-normal">
            We respect your inbox. Unsubscribe anytime with one click.
          </p>
        </div>
      </section>

    </div>
  );
}
