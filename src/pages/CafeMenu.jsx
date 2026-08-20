import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, UtensilsCrossed, ArrowRight, Sparkles } from 'lucide-react';

export default function CafeMenu() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-[#2A1B17] font-body">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E8DED2] rounded-full text-[#4B274F] text-[10px] uppercase tracking-widest font-bold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" /> Handcrafted &amp; Made to Order
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#351B38]">
          Cafe Menu
        </h1>
        <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed">
          Welcome to The Coffee Bean &amp; Tea Leaf Pakistan cafe experience. Discover our handcrafted specialty beverages and freshly prepared artisan food.
        </p>
      </div>

      {/* Two Large Hero Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto pt-4">
        
        {/* 1. BEVERAGE CARD */}
        <div className="bg-white border border-[#E8DED2] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
          <Link to="/beverage" className="block overflow-hidden relative aspect-4/3 bg-[#F5F0E8]/50">
            <img
              src="/Coffee-Bean-banners-website_homepage_Coffee-Shop_1.jpg"
              alt="Handcrafted Beverages"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = '/products/beverages/the-original-mocha-ice-blended-drink.jpg';
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#2A1B17]/40 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-[#4B274F] text-white text-[10px] uppercase tracking-widest font-bold rounded-xs flex items-center gap-1.5 shadow-xs">
                <Coffee className="w-3.5 h-3.5" /> 45 Signature Drinks
              </span>
            </div>
          </Link>

          <div className="p-6 sm:p-8 space-y-4 flex flex-col justify-between flex-1">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#4B274F] block">
                SPECIALTY DRINKS &amp; ESPRESSO
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38] group-hover:text-[#4B274F] transition-colors">
                Beverage
              </h2>
              <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed">
                Enjoy our world-famous Original Ice Blended® drinks, single-origin espresso pulls, whole leaf brewed teas, and creamy tea lattes crafted by master baristas.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8DED2]">
              <Link
                to="/beverage"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-[0.15em] rounded-md transition-colors shadow-xs"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. FOOD CARD */}
        <div className="bg-white border border-[#E8DED2] rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
          <Link to="/food" className="block overflow-hidden relative aspect-4/3 bg-[#F5F0E8]/50">
            <img
              src="/Coffee-Bean-banners-website_homepage_Coffee-Shop_2.jpg"
              alt="Gourmet Cafe Food"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = '/products/food/mexican-bbq-chicken-steak.png';
              }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#2A1B17]/40 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-[#4B274F] text-white text-[10px] uppercase tracking-widest font-bold rounded-xs flex items-center gap-1.5 shadow-xs">
                <UtensilsCrossed className="w-3.5 h-3.5" /> 29 Gourmet Dishes
              </span>
            </div>
          </Link>

          <div className="p-6 sm:p-8 space-y-4 flex flex-col justify-between flex-1">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#4B274F] block">
                FRESHLY PREPARED CAFE KITCHEN
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#351B38] group-hover:text-[#4B274F] transition-colors">
                Food
              </h2>
              <p className="text-xs sm:text-sm text-[#6B4A3A] leading-relaxed">
                From wholesome all-day breakfasts and toasted club sandwiches to flame-grilled chicken steaks, gourmet pastas, and stone-baked thin crust pizzas.
              </p>
            </div>

            <div className="pt-4 border-t border-[#E8DED2]">
              <Link
                to="/food"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-[#4B274F] hover:bg-[#351B38] text-white text-xs font-bold uppercase tracking-[0.15em] rounded-md transition-colors shadow-xs"
              >
                <span>Read More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
