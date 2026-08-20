import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  X, 
  ChevronDown, 
  Plus, 
  Minus,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import logoImg from '../assets/logo.png';
import api from '../services/api';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mobile accordion state
  const [mobileCafeOpen, setMobileCafeOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);

  // Desktop dropdown state
  const [desktopCafeOpen, setDesktopCafeOpen] = useState(false);
  const [desktopAboutOpen, setDesktopAboutOpen] = useState(false);

  // Global search modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const hamburgerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const searchInputRef = useRef(null);

  const { totalItems, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const pathname = location.pathname;

  // Scroll listener for smooth navbar transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock when mobile drawer or search is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isMobileMenuOpen, isSearchOpen]);

  // Route change cleanup
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setDesktopCafeOpen(false);
    setDesktopAboutOpen(false);
  }, [location.pathname, location.hash]);

  // Keyboard navigation: Escape key closes menus
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      if (isSearchOpen) {
        setIsSearchOpen(false);
      } else if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        if (hamburgerRef.current) hamburgerRef.current.focus();
      } else {
        setDesktopCafeOpen(false);
        setDesktopAboutOpen(false);
      }
    }
  }, [isMobileMenuOpen, isSearchOpen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Focus management for mobile drawer
  useEffect(() => {
    if (isMobileMenuOpen && closeBtnRef.current) {
      setTimeout(() => closeBtnRef.current?.focus(), 100);
    }
  }, [isMobileMenuOpen]);

  // Focus search input when search modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Live search handler
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        setSearchResults(res.data.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  // Active state checkers
  const isCoffeeActive = pathname === '/coffee' || pathname.startsWith('/shop/coffee');
  const isTeaActive = pathname === '/tea' || pathname.startsWith('/shop/tea');
  const isCakesActive = pathname === '/cake-to-go' || pathname === '/cakes' || pathname === '/cake-menu';
  const isCafeMenuActive = pathname.startsWith('/cafe-menu');
  const isStoresActive = pathname.startsWith('/store-locator') || pathname.startsWith('/stores');
  const isAboutActive = 
    pathname.startsWith('/about-us') || 
    pathname.startsWith('/about') || 
    pathname.startsWith('/coffee-sourcing') || 
    pathname.startsWith('/our-coffee') || 
    pathname.startsWith('/tea-sourcing') || 
    pathname.startsWith('/our-heritage') || 
    pathname.startsWith('/contact-us') || 
    pathname.startsWith('/contact');

  const isNavSolid = isScrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 font-body ${
          isNavSolid
            ? 'bg-[#F6F1E9]/95 backdrop-blur-md border-b border-[#EDE4D8] shadow-xs text-[#1C1714]'
            : 'bg-linear-to-b from-[#24150F]/85 via-[#24150F]/45 to-transparent text-white'
        }`}
      >
        {/* Centered responsive container (max-width: 1440px) */}
        <div className="w-full max-w-360 mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 h-16 sm:h-18 lg:h-20 flex items-center justify-between gap-2 lg:gap-4 xl:gap-6">
          
          {/* ================= LEFT: BRAND LOGO ================= */}
          <div className="shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 group"
              title="The Coffee Bean &amp; Tea Leaf Pakistan"
            >
              <img
                src={logoImg}
                alt="The Coffee Bean &amp; Tea Leaf"
                className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className={`font-display text-xs xs:text-sm sm:text-base lg:text-lg tracking-tight leading-none ${
                  isNavSolid ? 'text-[#24150F]' : 'text-white'
                }`}>
                  THE COFFEE BEAN
                </span>
                <span className={`text-[7px] xs:text-[8px] sm:text-[9px] tracking-[0.22em] uppercase font-semibold mt-0.5 ${
                  isNavSolid ? 'text-[#B8895B]' : 'text-[#EDE4D8]'
                }`}>
                  &amp; Tea Leaf
                </span>
              </div>
            </Link>
          </div>

          {/* ================= CENTER: DESKTOP NAVIGATION (≥ 1024px) ================= */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-4 xl:gap-6 2xl:gap-8 text-[11px] xl:text-xs uppercase tracking-wider font-semibold">
            
            {/* HOME */}
            <Link
              to="/"
              className={`py-1 relative whitespace-nowrap transition-colors ${
                isNavSolid
                  ? isHome
                    ? 'text-[#24150F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B8895B]'
                    : 'text-[#5A3825] hover:text-[#24150F]'
                  : isHome
                    ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                    : 'text-[#EDE4D8] hover:text-white'
              }`}
            >
              Home
            </Link>

            {/* COFFEE */}
            <Link
              to="/coffee"
              className={`py-1 relative whitespace-nowrap transition-colors ${
                isNavSolid
                  ? isCoffeeActive
                    ? 'text-[#24150F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B8895B]'
                    : 'text-[#5A3825] hover:text-[#24150F]'
                  : isCoffeeActive
                    ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                    : 'text-[#EDE4D8] hover:text-white'
              }`}
            >
              Coffee
            </Link>

            {/* TEA */}
            <Link
              to="/tea"
              className={`py-1 relative whitespace-nowrap transition-colors ${
                isNavSolid
                  ? isTeaActive
                    ? 'text-[#24150F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B8895B]'
                    : 'text-[#5A3825] hover:text-[#24150F]'
                  : isTeaActive
                    ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                    : 'text-[#EDE4D8] hover:text-white'
              }`}
            >
              Tea
            </Link>

            {/* CAKES TO GO */}
            <Link
              to="/cake-to-go"
              className={`py-1 relative whitespace-nowrap transition-colors ${
                isNavSolid
                  ? isCakesActive
                    ? 'text-[#24150F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B8895B]'
                    : 'text-[#5A3825] hover:text-[#24150F]'
                  : isCakesActive
                    ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                    : 'text-[#EDE4D8] hover:text-white'
              }`}
            >
              Cakes To Go
            </Link>

            {/* CAFE MENU (DROPDOWN) */}
            <div
              className="relative py-1 group"
              onMouseEnter={() => setDesktopCafeOpen(true)}
              onMouseLeave={() => setDesktopCafeOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDesktopCafeOpen(!desktopCafeOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setDesktopCafeOpen(!desktopCafeOpen);
                  }
                }}
                className={`flex items-center gap-1 whitespace-nowrap uppercase transition-colors cursor-pointer ${
                  isNavSolid
                    ? isCafeMenuActive
                      ? 'text-[#24150F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B8895B]'
                      : 'text-[#5A3825] hover:text-[#24150F]'
                    : isCafeMenuActive
                      ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                      : 'text-[#EDE4D8] hover:text-white'
                }`}
                aria-expanded={desktopCafeOpen}
                aria-haspopup="true"
              >
                <span>Cafe Menu</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${desktopCafeOpen ? 'rotate-180 text-[#B8895B]' : ''}`} />
              </button>

              {/* Desktop Dropdown Card */}
              <div
                className={`absolute top-full left-0 pt-2 w-44 transition-all duration-200 ${
                  desktopCafeOpen
                    ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                    : 'opacity-0 -translate-y-1 invisible pointer-events-none'
                }`}
              >
                <div className="bg-white border border-[#EDE4D8] rounded-sm shadow-xl py-2 text-[#1C1714]">
                  <Link
                    to="/cafe-menu/#beverages"
                    onClick={() => setDesktopCafeOpen(false)}
                    className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#24150F] hover:bg-[#F6F1E9] hover:text-[#B8895B] transition-colors"
                  >
                    Beverages
                  </Link>
                  <Link
                    to="/cafe-menu/#food"
                    onClick={() => setDesktopCafeOpen(false)}
                    className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#24150F] hover:bg-[#F6F1E9] hover:text-[#B8895B] transition-colors"
                  >
                    Food
                  </Link>
                </div>
              </div>
            </div>

            {/* OUR STORES */}
            <Link
              to="/store-locator/"
              className={`py-1 relative whitespace-nowrap transition-colors ${
                isNavSolid
                  ? isStoresActive
                    ? 'text-[#24150F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B8895B]'
                    : 'text-[#5A3825] hover:text-[#24150F]'
                  : isStoresActive
                    ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                    : 'text-[#EDE4D8] hover:text-white'
              }`}
            >
              Our Stores
            </Link>

            {/* ABOUT US (DROPDOWN) */}
            <div
              className="relative py-1 group"
              onMouseEnter={() => setDesktopAboutOpen(true)}
              onMouseLeave={() => setDesktopAboutOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDesktopAboutOpen(!desktopAboutOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setDesktopAboutOpen(!desktopAboutOpen);
                  }
                }}
                className={`flex items-center gap-1 whitespace-nowrap uppercase transition-colors cursor-pointer ${
                  isNavSolid
                    ? isAboutActive
                      ? 'text-[#24150F] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#B8895B]'
                      : 'text-[#5A3825] hover:text-[#24150F]'
                    : isAboutActive
                      ? 'text-white font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                      : 'text-[#EDE4D8] hover:text-white'
                }`}
                aria-expanded={desktopAboutOpen}
                aria-haspopup="true"
              >
                <span>About Us</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${desktopAboutOpen ? 'rotate-180 text-[#B8895B]' : ''}`} />
              </button>

              {/* Desktop Dropdown Card */}
              <div
                className={`absolute top-full left-0 pt-2 w-48 transition-all duration-200 ${
                  desktopAboutOpen
                    ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                    : 'opacity-0 -translate-y-1 invisible pointer-events-none'
                }`}
              >
                <div className="bg-white border border-[#EDE4D8] rounded-sm shadow-xl py-2 text-[#1C1714]">
                  <Link
                    to="/coffee-sourcing/"
                    onClick={() => setDesktopAboutOpen(false)}
                    className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#24150F] hover:bg-[#F6F1E9] hover:text-[#B8895B] transition-colors"
                  >
                    Our Coffee
                  </Link>
                  <Link
                    to="/tea-sourcing/"
                    onClick={() => setDesktopAboutOpen(false)}
                    className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#24150F] hover:bg-[#F6F1E9] hover:text-[#B8895B] transition-colors"
                  >
                    Our Tea
                  </Link>
                  <Link
                    to="/our-heritage/"
                    onClick={() => setDesktopAboutOpen(false)}
                    className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#24150F] hover:bg-[#F6F1E9] hover:text-[#B8895B] transition-colors"
                  >
                    Our Heritage
                  </Link>
                  <Link
                    to="/contact-us/"
                    onClick={() => setDesktopAboutOpen(false)}
                    className="block px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#24150F] hover:bg-[#F6F1E9] hover:text-[#B8895B] transition-colors"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </div>

          </nav>

          {/* ================= RIGHT: ONLY SEARCH & CART (≥ 1024px) ================= */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 shrink-0">
            
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center gap-1.5 min-h-11 min-w-11 px-2.5 py-1 text-xs uppercase tracking-wider font-semibold transition-colors ${
                isNavSolid ? 'text-[#5A3825] hover:text-[#24150F]' : 'text-[#EDE4D8] hover:text-white'
              }`}
              title="Search Catalog"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className={`flex items-center gap-2 min-h-11 px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all rounded-sm border ${
                isNavSolid
                  ? 'bg-[#24150F] text-[#F6F1E9] border-[#24150F] hover:bg-[#5A3825]'
                  : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
              }`}
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-4 h-4 text-[#B8895B]" />
              <span>Cart ({totalItems})</span>
            </button>
          </div>

          {/* ================= RIGHT: TABLET & MOBILE (< 1024px) ================= */}
          <div className="flex lg:hidden items-center space-x-1 sm:space-x-2 shrink-0">
            
            {/* Search Icon (Touch target ≥ 44px) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`min-w-11 min-h-11 flex items-center justify-center rounded-sm transition-colors ${
                isNavSolid ? 'text-[#24150F] hover:bg-[#EDE4D8]/60' : 'text-white hover:bg-white/15'
              }`}
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon (Touch target ≥ 44px) */}
            <button
              onClick={openCart}
              className={`min-w-11 min-h-11 flex items-center justify-center relative rounded-sm transition-colors ${
                isNavSolid ? 'text-[#24150F] hover:bg-[#EDE4D8]/60' : 'text-white hover:bg-white/15'
              }`}
              aria-label={`Shopping cart with ${totalItems} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#B8895B] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Animated Hamburger Menu Button (Touch target ≥ 44px) */}
            <button
              ref={hamburgerRef}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`min-w-11 min-h-11 flex items-center justify-center rounded-sm transition-colors focus:outline-hidden ${
                isNavSolid ? 'text-[#24150F] hover:bg-[#EDE4D8]/60' : 'text-white hover:bg-white/15'
              }`}
              aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between items-center">
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${
                    isMobileMenuOpen ? 'rotate-45 translate-x-0.5 -translate-y-0.5' : ''
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-opacity duration-200 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-left ${
                    isMobileMenuOpen ? '-rotate-45 translate-x-0.5 translate-y-0.5' : ''
                  }`}
                />
              </div>
            </button>

          </div>

        </div>
      </header>

      {/* ================= MOBILE DRAWER & BACKDROP (< 1024px) ================= */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end font-body">
          
          {/* Dark Translucent Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-out Mobile Navigation Drawer */}
          <div
            className="relative w-[85vw] max-w-105 h-full bg-[#F6F1E9] text-[#1C1714] shadow-2xl flex flex-col z-50 overflow-y-auto border-l border-[#EDE4D8] animate-in slide-in-from-right duration-300"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
          >
            {/* Sticky Drawer Header */}
            <div className="sticky top-0 bg-[#F6F1E9] border-b border-[#EDE4D8] p-4 sm:p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <img src={logoImg} alt="The Coffee Bean" className="w-8 h-8 object-contain" />
                <div className="flex flex-col">
                  <span className="font-display text-base text-[#24150F]">The Coffee Bean</span>
                  <span className="text-[8px] uppercase tracking-widest text-[#B8895B] font-semibold">&amp; Tea Leaf</span>
                </div>
              </div>

              {/* Close Button (Touch target ≥ 44px) */}
              <button
                ref={closeBtnRef}
                onClick={() => setIsMobileMenuOpen(false)}
                className="min-w-11 min-h-11 flex items-center justify-center rounded-sm text-[#756A62] hover:text-[#24150F] hover:bg-[#EDE4D8] transition-colors"
                aria-label="Close navigation drawer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Navigation List with Exact Customer Accordions */}
            <nav className="p-5 sm:p-6 space-y-1.5 flex-1">
              
              {/* Home */}
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center min-h-11 px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                  isHome ? 'bg-[#EDE4D8] text-[#B8895B] font-bold' : 'text-[#24150F] hover:bg-[#EDE4D8]/60'
                }`}
              >
                Home
              </Link>

              {/* Coffee */}
              <Link
                to="/coffee"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center min-h-11 px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                  isCoffeeActive ? 'bg-[#EDE4D8] text-[#B8895B] font-bold' : 'text-[#24150F] hover:bg-[#EDE4D8]/60'
                }`}
              >
                Coffee
              </Link>

              {/* Tea */}
              <Link
                to="/tea"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center min-h-11 px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                  isTeaActive ? 'bg-[#EDE4D8] text-[#B8895B] font-bold' : 'text-[#24150F] hover:bg-[#EDE4D8]/60'
                }`}
              >
                Tea
              </Link>

              {/* Cakes To Go */}
              <Link
                to="/cake-to-go"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center min-h-11 px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                  isCakesActive ? 'bg-[#EDE4D8] text-[#B8895B] font-bold' : 'text-[#24150F] hover:bg-[#EDE4D8]/60'
                }`}
              >
                Cakes To Go
              </Link>

              {/* Cafe Menu Expandable Accordion (+ / −) */}
              <div className="rounded-sm overflow-hidden border border-transparent transition-colors">
                <button
                  type="button"
                  onClick={() => setMobileCafeOpen(!mobileCafeOpen)}
                  className={`w-full flex items-center justify-between min-h-11 px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    isCafeMenuActive ? 'text-[#B8895B] font-bold' : 'text-[#24150F] hover:bg-[#EDE4D8]/60'
                  }`}
                  aria-expanded={mobileCafeOpen}
                >
                  <span>Cafe Menu</span>
                  <span className="w-8 h-8 flex items-center justify-center rounded-sm bg-[#EDE4D8]/60 text-[#5A3825]">
                    {mobileCafeOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {mobileCafeOpen && (
                  <div className="pl-6 pr-3 py-2 space-y-1 bg-white/60 border-l-2 border-[#B8895B] ml-3 mb-2 rounded-r-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <Link
                      to="/cafe-menu/#beverages"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center min-h-10 px-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#B8895B]"
                    >
                      Beverages
                    </Link>
                    <Link
                      to="/cafe-menu/#food"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center min-h-10 px-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#B8895B]"
                    >
                      Food
                    </Link>
                  </div>
                )}
              </div>

              {/* Our Stores */}
              <Link
                to="/store-locator/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center min-h-11 px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded-sm transition-colors ${
                  isStoresActive ? 'bg-[#EDE4D8] text-[#B8895B] font-bold' : 'text-[#24150F] hover:bg-[#EDE4D8]/60'
                }`}
              >
                Our Stores
              </Link>

              {/* About Us Expandable Accordion (+ / −) */}
              <div className="rounded-sm overflow-hidden border border-transparent transition-colors">
                <button
                  type="button"
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className={`w-full flex items-center justify-between min-h-11 px-3 py-2 text-sm font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                    isAboutActive ? 'text-[#B8895B] font-bold' : 'text-[#24150F] hover:bg-[#EDE4D8]/60'
                  }`}
                  aria-expanded={mobileAboutOpen}
                >
                  <span>About Us</span>
                  <span className="w-8 h-8 flex items-center justify-center rounded-sm bg-[#EDE4D8]/60 text-[#5A3825]">
                    {mobileAboutOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>

                {mobileAboutOpen && (
                  <div className="pl-6 pr-3 py-2 space-y-1 bg-white/60 border-l-2 border-[#B8895B] ml-3 mb-2 rounded-r-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <Link
                      to="/coffee-sourcing/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center min-h-10 px-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#B8895B]"
                    >
                      Our Coffee
                    </Link>
                    <Link
                      to="/tea-sourcing/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center min-h-10 px-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#B8895B]"
                    >
                      Our Tea
                    </Link>
                    <Link
                      to="/our-heritage/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center min-h-10 px-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#B8895B]"
                    >
                      Our Heritage
                    </Link>
                    <Link
                      to="/contact-us/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center min-h-10 px-2 text-xs font-semibold uppercase tracking-wider text-[#5A3825] hover:text-[#B8895B]"
                    >
                      Contact
                    </Link>
                  </div>
                )}
              </div>

              {/* Utility Section: Search & Cart Only */}
              <div className="pt-6 mt-6 border-t border-[#EDE4D8] space-y-2">
                
                {/* Search */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center gap-3 min-h-11 px-3 py-2 text-xs uppercase tracking-wider font-semibold text-[#24150F] hover:bg-[#EDE4D8]/60 rounded-sm"
                >
                  <Search className="w-4 h-4 text-[#B8895B]" />
                  <span>Search Catalog</span>
                </button>

                {/* Cart */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openCart();
                  }}
                  className="w-full flex items-center justify-between min-h-11 px-3.5 py-2.5 bg-[#24150F] text-[#F6F1E9] rounded-sm text-xs uppercase tracking-wider font-semibold shadow-xs"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#B8895B]" />
                    <span>View Cart</span>
                  </span>
                  <span className="px-2 py-0.5 bg-[#B8895B] text-white rounded-full text-[10px]">
                    {totalItems}
                  </span>
                </button>
              </div>

            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#EDE4D8] bg-[#EDE4D8]/40 text-xs text-[#756A62] space-y-1">
              <p className="font-semibold text-[#24150F]">The Coffee Bean &amp; Tea Leaf Pakistan</p>
              <p className="text-[10px]">Owned &amp; Operated by Ab Brands Pvt Ltd</p>
            </div>

          </div>
        </div>
      )}

      {/* ================= GLOBAL SEARCH MODAL OVERLAY ================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 xs:pt-20 sm:pt-28 px-3 xs:px-4 font-body">
          <div
            className="fixed inset-0 bg-[#24150F]/75 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsSearchOpen(false)}
            aria-hidden="true"
          />

          <div
            className="relative w-full max-w-2xl bg-[#F6F1E9] border border-[#EDE4D8] rounded-sm shadow-2xl p-5 sm:p-8 space-y-5 z-50 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-label="Search Products"
          >
            <div className="flex items-center justify-between border-b border-[#EDE4D8] pb-3">
              <h3 className="font-display text-xl sm:text-2xl text-[#24150F]">Search Coffee &amp; Teas</h3>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="min-w-11 min-h-11 flex items-center justify-center text-[#756A62] hover:text-[#24150F]"
                aria-label="Close search modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-5 h-5 text-[#B8895B] absolute left-4 top-3.5" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search whole bean coffee, whole leaf tea, origin..."
                className="w-full bg-white border border-[#EDE4D8] rounded-sm pl-12 pr-4 py-3 text-sm focus:outline-hidden focus:border-[#24150F] text-[#1C1714] font-normal"
              />
            </form>

            {/* Quick Live Search Results */}
            {isSearching ? (
              <div className="py-6 text-center text-xs font-medium text-[#756A62]">
                Searching catalog...
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#756A62] block">
                  Matching Products
                </span>
                <div className="divide-y divide-[#EDE4D8] border border-[#EDE4D8] bg-white rounded-sm">
                  {searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.slug}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="p-3 flex items-center justify-between hover:bg-[#F6F1E9] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=100&q=80'}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-xs border border-[#EDE4D8]"
                        />
                        <div>
                          <span className="font-semibold text-xs text-[#24150F] block">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-[#756A62] font-normal">{item.category_name}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-xs text-[#24150F]">
                        Rs. {item.price?.toLocaleString()}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="py-6 text-center text-xs text-[#756A62] font-normal">
                No products found for "{searchQuery}". Press Enter to view all search results.
              </div>
            ) : (
              <div className="text-xs text-[#756A62] space-y-2">
                <span className="text-[10px] uppercase font-semibold tracking-wider block">Popular Searches</span>
                <div className="flex flex-wrap gap-2">
                  {['Costa Rica', 'Decaf', 'Sumatra', 'English Breakfast', 'Jasmine', 'Vanilla'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-3 py-1.5 bg-white border border-[#EDE4D8] rounded-xs text-xs font-semibold text-[#5A3825] hover:bg-[#EDE4D8] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
