import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Truck, RefreshCw, ShieldCheck, Mail, Phone } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="bg-[#351B38] text-[#F5F0E8] border-t-2 border-[#4B274F] pt-16 sm:pt-20 pb-12 font-body">
      {/* Brand Pillars / Value Proposition Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16 border-b border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-[#4B274F]/80 border border-white/15 flex items-center justify-center shrink-0 text-[#F5F0E8]">
              <Award className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-white">Top 1% Arabica</h4>
              <p className="text-xs text-[#E8DED2]/80 leading-relaxed font-normal">
                Directly sourced high-altitude crops from premier family estates.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-[#4B274F]/80 border border-white/15 flex items-center justify-center shrink-0 text-[#F5F0E8]">
              <Truck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-white">Nationwide Express</h4>
              <p className="text-xs text-[#E8DED2]/80 leading-relaxed font-normal">
                Freshly roasted batches delivered fast to your doorstep across Pakistan.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-[#4B274F]/80 border border-white/15 flex items-center justify-center shrink-0 text-[#F5F0E8]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-white">Freshness Sealed</h4>
              <p className="text-xs text-[#E8DED2]/80 leading-relaxed font-normal">
                Nitrogen flushed one-way degas valves preserve true origin notes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-[#4B274F]/80 border border-white/15 flex items-center justify-center shrink-0 text-[#F5F0E8]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-white">100% Authentic</h4>
              <p className="text-xs text-[#E8DED2]/80 leading-relaxed font-normal">
                Verified genuine origins with secure Cash on Delivery tracking.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Editorial Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Info (Span 4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <img
                src={logoImg}
                alt="The Coffee Bean & Tea Leaf"
                className="w-12 h-12 object-contain bg-white rounded-full p-0.5 shadow-md"
              />
              <div className="flex flex-col">
                <span className="font-display text-lg text-white tracking-tight">
                  THE COFFEE BEAN
                </span>
                <span className="text-[9px] tracking-[0.28em] uppercase text-[#E8DED2] font-semibold">
                  &amp; Tea Leaf • Est. 1963
                </span>
              </div>
            </div>

            <p className="text-xs text-[#F5F0E8]/90 leading-relaxed font-semibold">
              The Coffee Bean &amp; Tea Leaf – Pakistan Owned and Operated by Ab Brands Pvt Ltd
            </p>

            <p className="text-xs text-[#E8DED2]/80 leading-relaxed font-normal">
              Born &amp; brewed in Southern California since 1963. Sourcing only the top 1% of Arabica beans and whole leaf teas for coffee lovers across Pakistan.
            </p>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3 text-xs text-[#F5F0E8]">
              <a
                href="https://www.instagram.com/coffeebeanpakistan/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white/10 hover:bg-[#4B274F] hover:text-white transition-colors flex items-center justify-center"
                title="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/CoffeeBeanPakistan/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-white/10 hover:bg-[#4B274F] hover:text-white transition-colors flex items-center justify-center"
                title="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 1: Shop & Catalog (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-semibold text-xs tracking-wider uppercase text-[#E8DED2]">
              Catalog &amp; Menu
            </h3>
            <ul className="space-y-2.5 text-xs text-[#F5F0E8]/80 font-normal">
              <li><Link to="/coffee" className="hover:text-white transition-colors">Coffee</Link></li>
              <li><Link to="/tea" className="hover:text-white transition-colors">Tea</Link></li>
              <li><Link to="/cake-to-go" className="hover:text-white transition-colors">Cakes To Go</Link></li>
              <li><Link to="/cafe-menu" className="hover:text-white transition-colors">Cafe Menu</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All Products</Link></li>
            </ul>
          </div>

          {/* Col 2: Brand & Heritage (Span 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-semibold text-xs tracking-wider uppercase text-[#E8DED2]">
              Brand &amp; Heritage
            </h3>
            <ul className="space-y-2.5 text-xs text-[#F5F0E8]/80 font-normal">
              <li><Link to="/our-coffee" className="hover:text-white transition-colors">Our Coffee</Link></li>
              <li><Link to="/tea-sourcing" className="hover:text-white transition-colors">Our Tea</Link></li>
              <li><Link to="/our-heritage" className="hover:text-white transition-colors">Our Heritage</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/store-locator" className="hover:text-white transition-colors">Our Stores</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact Details (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold text-xs tracking-wider uppercase text-[#E8DED2]">
              Contact Us
            </h3>
            <ul className="space-y-3 text-xs text-[#F5F0E8]/80 font-normal">
              <li>
                <a href="mailto:info@coffeebean.pk" className="hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#E8DED2] shrink-0" />
                  <span>info@coffeebean.pk</span>
                </a>
              </li>
              <li>
                <a href="tel:03025455448" className="hover:text-white transition-colors flex items-center gap-2 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#E8DED2] shrink-0" />
                  <span>0302 5455448</span>
                </a>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors block pt-1">
                  Write to Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition-colors block">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8DED2]/60 font-normal">
        <p>© {new Date().getFullYear()} The Coffee Bean &amp; Tea Leaf – Pakistan Owned and Operated by Ab Brands Pvt Ltd. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>•</span>
          <Link to="/store-locator" className="hover:text-white transition-colors">Our Stores</Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
