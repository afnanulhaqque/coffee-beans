import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Mail, Coffee, Leaf, ExternalLink } from 'lucide-react';
import fbBeachImg from '../assets/facebook_beach_lifestyle.png';
import cake1Img from '../assets/cake-1.png';
import cafeShopBanner8 from '../assets/cafe_shop_banner_8.jpg';
import cafeShopBanner1 from '../assets/cafe_shop_banner_1.jpg';
import cafeShopBanner2 from '../assets/cafe_shop_banner_2.jpg';

export default function MosaicHeritageGrid() {
  return (
    <section className="py-16 sm:py-24 bg-[#EDE4D8]/60 px-4 sm:px-6 lg:px-8 border-y border-[#EDE4D8] font-body">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Main 3-Column Mosaic Grid matching brand reference */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* ================= COLUMN 1 & 2 TOP SPAN / LEFT SECTION ================= */}
          
          {/* Top-Left: Coffee-Bean-banners-website_homepage_Coffee-Shop_1 (Span 7, Row 1) - Perfect 1:2 collage height match */}
          <div className="md:col-span-7 aspect-16/10 md:aspect-auto md:h-full bg-[#24150F] rounded-xs overflow-hidden relative group">
            <img
              src={cafeShopBanner1}
              alt="Coffee-Bean-banners-website_homepage_Coffee-Shop_1"
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Top-Right Stack: Chocolate Cake & Tea Tins (Span 5, Row 1) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            
            {/* Top Cake Photo LINKED TO /cafe-menu with "Cakes to go" */}
            <Link
              to="/cafe-menu"
              className="aspect-16/8.5 bg-[#24150F] rounded-xs overflow-hidden relative group block"
            >
              <img
                src={cake1Img}
                alt="Cakes to go"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#24150F]/90 text-[#F6F1E9] text-[11px] uppercase tracking-wider font-semibold group-hover:bg-[#B8895B] transition-colors rounded-xs shadow-md flex items-center gap-1.5">
                <span>Cakes to go</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B8895B] group-hover:text-white" />
              </div>
            </Link>

            {/* Tea Tins LINKED TO /tea-sourcing */}
            <Link
              to="/tea-sourcing"
              className="aspect-16/8.5 bg-[#24150F] rounded-xs overflow-hidden relative group block"
            >
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
                alt="Artisan Whole Leaf Tea"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#24150F]/90 text-[#F6F1E9] text-[11px] uppercase tracking-wider font-semibold group-hover:bg-[#B8895B] transition-colors rounded-xs shadow-md flex items-center gap-1.5">
                <span>Tea Sourcing &amp; Gardens</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B8895B] group-hover:text-white" />
              </div>
            </Link>

          </div>

          {/* ================= MIDDLE SECTION ================= */}

          {/* Middle Left: OUR HERITAGE Card (Span 5) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-7 sm:p-8 rounded-xs border border-[#EDE4D8] flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <h3 className="font-bold text-xl sm:text-2xl tracking-wider text-[#24150F] uppercase font-sans">
                  OUR HERITAGE
                </h3>
                <p className="text-xs text-[#5A3825] leading-relaxed italic font-serif">
                  Herbert B. Hyman started The Coffee Bean &amp; Tea Leaf in 1963, with the commitment to serve the perfect cup. Now, over 50 years later, the company has fulfilled its promise by becoming one of the world's largest privately-owned coffee and tea companies.
                </p>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#B8895B] hover:text-[#24150F] transition-colors pt-2 self-start"
              >
                READ MORE <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Coffee Roasting / Whole Beans Tile LINKED TO /sourcing */}
            <Link
              to="/sourcing"
              className="aspect-16/8.5 bg-[#24150F] rounded-xs overflow-hidden relative group block"
            >
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80"
                alt="Roasted Whole Coffee Beans"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#24150F]/90 text-[#F6F1E9] text-[11px] uppercase tracking-wider font-semibold group-hover:bg-[#B8895B] transition-colors rounded-xs shadow-md flex items-center gap-1.5">
                <span>Coffee Sourcing &amp; Origins</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B8895B] group-hover:text-white" />
              </div>
            </Link>
          </div>

          {/* Middle Center: Tall ABOUT US Card (Span 4) */}
          <div className="md:col-span-4 bg-white p-7 sm:p-8 rounded-xs border border-[#EDE4D8] flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-4 my-auto">
              <h3 className="font-bold text-xl sm:text-2xl tracking-wider text-[#24150F] uppercase font-sans">
                ABOUT US
              </h3>
              <p className="text-xs text-[#5A3825] leading-relaxed italic font-serif">
                Born and brewed in Southern California, we take pride in the experience we provide our customers with our freshest and richest blends of tea and coffee.
              </p>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#B8895B] hover:text-[#24150F] transition-colors pt-4 self-start"
            >
              READ MORE <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Middle Right: 2 Lifestyle Photos (Span 3) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            
            {/* Top Lifestyle: Coffee-Bean-banners-website_homepage_Coffee-Shop_2 LINKED TO FACEBOOK with "Join us on Facebook" */}
            <a
              href="https://facebook.com/coffeebean"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-4/3 bg-[#24150F] rounded-xs overflow-hidden relative group block"
            >
              <img
                src={cafeShopBanner2}
                alt="Join us on Facebook"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
              
              {/* Visible Interactive Facebook Badge */}
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#1877F2] hover:bg-[#166fe5] text-white text-[10px] font-semibold uppercase tracking-wider rounded-xs shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Join us on Facebook</span>
              </div>
            </a>

            {/* Bottom Lifestyle: Coffee-Bean-banners-website_homepage_Coffee-Shop_8 */}
            <Link
              to="/stores"
              className="aspect-4/3 bg-[#24150F] rounded-xs overflow-hidden relative group block"
            >
              <img
                src={cafeShopBanner8}
                alt="Coffee Bean Cafe Shop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#24150F]/90 text-[#F6F1E9] text-[10px] uppercase tracking-wider font-semibold group-hover:bg-[#B8895B] transition-colors rounded-xs shadow-md flex items-center gap-1">
                <span>Coffee Lounges</span>
                <ArrowRight className="w-3 h-3 text-[#B8895B] group-hover:text-white" />
              </div>
            </Link>

          </div>

          {/* ================= BOTTOM ROW: 4 MODULAR TILES ================= */}
          
          {/* Bottom Tile 1: Fresh Green & Red Coffee Cherries LINKED TO /sourcing (Span 3) */}
          <Link
            to="/sourcing"
            className="md:col-span-3 aspect-square bg-[#24150F] rounded-xs overflow-hidden relative group block"
          >
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80"
              alt="Harvested Coffee Cherries"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-2.5 left-2.5 px-2 py-1 bg-white/90 text-[#24150F] text-[9px] uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-xs shadow-xs">
              Estate Sourcing
            </div>
          </Link>

          {/* Bottom Tile 2: Tea Leaves Cupping Bowls LINKED TO /tea-sourcing (Span 3) */}
          <Link
            to="/tea-sourcing"
            className="md:col-span-3 aspect-square bg-[#24150F] rounded-xs overflow-hidden relative group block"
          >
            <img
              src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80"
              alt="Artisan Tea Cupping"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-2.5 left-2.5 px-2 py-1 bg-white/90 text-[#24150F] text-[9px] uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity rounded-xs shadow-xs">
              Whole Leaf Tea Sourcing
            </div>
          </Link>

          {/* Bottom Tile 3: Caramel "Query? WRITE TO US" (Span 3) */}
          <Link
            to="/contact"
            className="md:col-span-3 aspect-square bg-[#C49A6C] hover:bg-[#b88c5d] text-white p-6 sm:p-7 rounded-xs flex flex-col justify-center transition-colors shadow-xs group"
          >
            <span className="font-serif italic text-sm text-white/90 block mb-1">
              Query?
            </span>
            <h4 className="font-bold text-xl sm:text-2xl tracking-wider uppercase font-sans text-white leading-tight group-hover:translate-x-0.5 transition-transform">
              WRITE TO US
            </h4>
            <div className="pt-3 flex items-center gap-1.5 text-xs text-white/80 uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Write To Us</span> <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Bottom Tile 4: Caramel "Where to go? LOCATION" (Span 3) */}
          <Link
            to="/stores"
            className="md:col-span-3 aspect-square bg-[#C49A6C] hover:bg-[#b88c5d] text-white p-6 sm:p-7 rounded-xs flex flex-col justify-center transition-colors shadow-xs group"
          >
            <span className="font-serif italic text-sm text-white/90 block mb-1">
              Where to go?
            </span>
            <h4 className="font-bold text-xl sm:text-2xl tracking-wider uppercase font-sans text-white leading-tight group-hover:translate-x-0.5 transition-transform">
              LOCATION
            </h4>
            <div className="pt-3 flex items-center gap-1.5 text-xs text-white/80 uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Find Nearest Cafe</span> <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>

      </div>
    </section>
  );
}
