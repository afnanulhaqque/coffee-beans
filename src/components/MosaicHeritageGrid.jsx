import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import cake1Img from '../assets/cake-1.png';
import cafeShopBanner8 from '../assets/cafe_shop_banner_8.jpg';
import cafeShopBanner1 from '../assets/cafe_shop_banner_1.jpg';
import cafeShopBanner2 from '../assets/cafe_shop_banner_2.jpg';

export default function MosaicHeritageGrid() {
  return (
    <section className="py-16 sm:py-24 bg-[#F5F0E8] px-4 sm:px-6 lg:px-8 border-y border-[#E8DED2] font-body">
      <div className="max-w-6xl mx-auto space-y-4">
        
        {/* Main 3-Column Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* ================= TOP SECTION ================= */}
          
          {/* Top-Left: Storefront Photo (Span 7, Row 1) */}
          <div className="md:col-span-7 aspect-16/10 md:aspect-auto md:h-full bg-[#2A1B17] rounded-md overflow-hidden relative group">
            <img
              src={cafeShopBanner1}
              alt="The Coffee Bean Storefront"
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* Top-Right Stack: Cakes & Tea Tins (Span 5, Row 1) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            
            {/* Top Cake Photo */}
            <Link
              to="/cafe-menu"
              className="aspect-16/8.5 bg-[#2A1B17] rounded-md overflow-hidden relative group block"
            >
              <img
                src={cake1Img}
                alt="Cakes to go"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#351B38]/90 text-white text-[11px] uppercase tracking-wider font-semibold group-hover:bg-[#4B274F] transition-colors rounded-md shadow-md flex items-center gap-1.5">
                <span>Cakes to go</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E8DED2] group-hover:text-white" />
              </div>
            </Link>

            {/* Tea Tins */}
            <Link
              to="/tea-sourcing"
              className="aspect-16/8.5 bg-[#2A1B17] rounded-md overflow-hidden relative group block"
            >
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80"
                alt="Artisan Whole Leaf Tea"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#351B38]/90 text-white text-[11px] uppercase tracking-wider font-semibold group-hover:bg-[#4B274F] transition-colors rounded-md shadow-md flex items-center gap-1.5">
                <span>Tea Sourcing &amp; Gardens</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E8DED2] group-hover:text-white" />
              </div>
            </Link>

          </div>

          {/* ================= MIDDLE SECTION ================= */}

          {/* Middle Left: OUR HERITAGE Card (Span 5) */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="bg-white p-7 sm:p-8 rounded-md border border-[#E8DED2] flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <h3 className="font-display text-xl sm:text-2xl tracking-wide text-[#351B38] uppercase">
                  OUR HERITAGE
                </h3>
                <p className="text-xs text-[#6B4A3A] leading-relaxed font-normal">
                  Herbert B. Hyman started The Coffee Bean &amp; Tea Leaf in 1963, with the commitment to serve the perfect cup. Over 50 years later, that passion endures in every handcrafted beverage.
                </p>
              </div>

              <Link
                to="/our-heritage"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4B274F] hover:text-[#351B38] transition-colors pt-2 self-start"
              >
                READ MORE <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Coffee Roasting Tile */}
            <Link
              to="/our-coffee"
              className="aspect-16/8.5 bg-[#2A1B17] rounded-md overflow-hidden relative group block"
            >
              <img
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80"
                alt="Roasted Whole Coffee Beans"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-[#351B38]/90 text-white text-[11px] uppercase tracking-wider font-semibold group-hover:bg-[#4B274F] transition-colors rounded-md shadow-md flex items-center gap-1.5">
                <span>Coffee Sourcing &amp; Origins</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E8DED2] group-hover:text-white" />
              </div>
            </Link>
          </div>

          {/* Middle Center: Tall ABOUT US Card (Span 4) */}
          <div className="md:col-span-4 bg-white p-7 sm:p-8 rounded-md border border-[#E8DED2] flex flex-col justify-between space-y-6 shadow-xs">
            <div className="space-y-4 my-auto">
              <h3 className="font-display text-xl sm:text-2xl tracking-wide text-[#351B38] uppercase">
                ABOUT US
              </h3>
              <p className="text-xs text-[#6B4A3A] leading-relaxed font-normal">
                Born and brewed in Southern California, we take pride in the experience we provide our customers with our freshest and richest blends of handcrafted tea and coffee.
              </p>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4B274F] hover:text-[#351B38] transition-colors pt-4 self-start"
            >
              READ MORE <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Middle Right: 2 Lifestyle Photos (Span 3) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            
            {/* Top Lifestyle */}
            <a
              href="https://facebook.com/CoffeeBeanPakistan"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-4/3 bg-[#2A1B17] rounded-md overflow-hidden relative group block"
            >
              <img
                src={cafeShopBanner2}
                alt="Join us on Facebook"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
              
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#351B38]/90 hover:bg-[#4B274F] text-white text-[10px] font-semibold uppercase tracking-wider rounded-md shadow-md flex items-center gap-1.5 transition-colors">
                <span>Social Community</span>
              </div>
            </a>

            {/* Bottom Lifestyle */}
            <Link
              to="/stores"
              className="aspect-4/3 bg-[#2A1B17] rounded-md overflow-hidden relative group block"
            >
              <img
                src={cafeShopBanner8}
                alt="Coffee Bean Cafe Shop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors" />
              <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 bg-[#351B38]/90 text-white text-[10px] uppercase tracking-wider font-semibold group-hover:bg-[#4B274F] transition-colors rounded-md shadow-md flex items-center gap-1">
                <span>Coffee Lounges</span>
                <ArrowRight className="w-3 h-3 text-[#E8DED2] group-hover:text-white" />
              </div>
            </Link>

          </div>

          {/* ================= BOTTOM ROW: 4 MODULAR TILES ================= */}
          
          {/* Bottom Tile 1: Coffee Cherries (Span 3) */}
          <Link
            to="/our-coffee"
            className="md:col-span-3 aspect-square bg-[#2A1B17] rounded-md overflow-hidden relative group block"
          >
            <img
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=80"
              alt="Harvested Coffee Cherries"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-white/95 text-[#2A1B17] text-[9px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-md shadow-xs">
              Estate Sourcing
            </div>
          </Link>

          {/* Bottom Tile 2: Tea Leaves (Span 3) */}
          <Link
            to="/tea-sourcing"
            className="md:col-span-3 aspect-square bg-[#2A1B17] rounded-md overflow-hidden relative group block"
          >
            <img
              src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80"
              alt="Artisan Tea Cupping"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 bg-white/95 text-[#2A1B17] text-[9px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-md shadow-xs">
              Whole Leaf Tea
            </div>
          </Link>

          {/* Bottom Tile 3: Bossanova Purple "Query? WRITE TO US" (Span 3) */}
          <Link
            to="/contact"
            className="md:col-span-3 aspect-square bg-[#4B274F] hover:bg-[#351B38] text-white p-6 sm:p-7 rounded-md flex flex-col justify-center transition-colors shadow-xs group"
          >
            <span className="text-xs uppercase tracking-widest text-[#E8DED2] block mb-1">
              Have a Query?
            </span>
            <h4 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-white leading-tight group-hover:translate-x-0.5 transition-transform">
              WRITE TO US
            </h4>
            <div className="pt-3 flex items-center gap-1.5 text-xs text-[#E8DED2] uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Send Message</span> <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Bottom Tile 4: Deep Purple / Coffee Brown "Where to go? LOCATION" (Span 3) */}
          <Link
            to="/stores"
            className="md:col-span-3 aspect-square bg-[#351B38] hover:bg-[#4B274F] text-white p-6 sm:p-7 rounded-md flex flex-col justify-center transition-colors shadow-xs group"
          >
            <span className="text-xs uppercase tracking-widest text-[#E8DED2] block mb-1">
              Where to find us?
            </span>
            <h4 className="font-display text-xl sm:text-2xl tracking-wide uppercase text-white leading-tight group-hover:translate-x-0.5 transition-transform">
              OUR STORES
            </h4>
            <div className="pt-3 flex items-center gap-1.5 text-xs text-[#E8DED2] uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Find Nearest Cafe</span> <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

        </div>

      </div>
    </section>
  );
}
