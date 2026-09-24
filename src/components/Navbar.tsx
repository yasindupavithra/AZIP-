'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  User, 
  ChevronDown, 
  MessageCircle, 
  Flame, 
  Menu, 
  X,
  Phone,
  MapPin
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { STORE_CATEGORIES } from '@/lib/catalog';

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const catDropdownRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);

  const { items, toggleCart } = useCartStore();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleClickOutside = (event: MouseEvent) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
        setIsCatDropdownOpen(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false);
      }
      if (brandsRef.current && !brandsRef.current.contains(event.target as Node)) {
        setIsBrandsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const itemCount = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCat !== 'All Categories') {
      const match = STORE_CATEGORIES.find(c => c.label.toLowerCase() === selectedCat.toLowerCase());
      if (match) params.set('category', match.slug);
    }
    router.push(`/products?${params.toString()}`);
  };

  const topBrands = ['Atlas', 'Casio', 'Pilot', 'Faber-Castell', 'Oxford', 'Mont Marte', 'Stabilo', 'SanDisk', 'Nataraj', 'Kangaro'];

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-500 ease-out font-sans ${
      isScrolled 
        ? 'shadow-lg bg-white/98 backdrop-blur-xl' 
        : 'shadow-none bg-white'
    }`}>
      
      {/* ── Top Utility Bar ────────────────────────────────── */}
      <div 
        className={`bg-gray-900 text-white/90 transition-all duration-500 ease-out overflow-hidden ${
          isScrolled 
            ? 'max-h-0 opacity-0 py-0 pointer-events-none' 
            : 'max-h-14 opacity-100 py-2.5'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center text-[11.5px]">
          <div className="flex items-center gap-5 font-medium">
            <span className="flex items-center gap-1.5">
              <Phone size={12} className="text-gray-400" />
              <a href="tel:+94812222222" className="hover:text-white transition-colors">+94 81 222 2222</a>
              <span className="text-gray-600">/</span>
              <a href="tel:+94770000000" className="hover:text-white transition-colors">+94 77 000 0000</a>
            </span>
            <span className="hidden sm:inline text-gray-600">|</span>
            <Link href="/about" className="hidden sm:inline hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hidden sm:inline hover:text-white transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <span className="hidden md:flex items-center gap-1.5 text-emerald-400">
              <MapPin size={12} />
              Kandy, Sri Lanka
            </span>
            <span className="text-gray-600 hidden md:inline">|</span>
            <span className="text-gray-400">LKR (Rs.)</span>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar ───────────────────────────── */}
      <div className={`container mx-auto px-4 flex items-center justify-between gap-6 transition-all duration-500 ease-out ${
        isScrolled ? 'py-2' : 'py-5'
      }`}>
        
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0 group">
          <img
            src="/azip-logo.png"
            alt="AZIP .store"
            className={`w-auto object-contain transition-all duration-500 ease-out drop-shadow-xs group-hover:scale-[1.03] ${
              isScrolled ? 'h-8' : 'h-14'
            }`}
          />
        </Link>

        {/* Search Bar */}
        <form 
          onSubmit={handleSearch} 
          className={`flex-1 max-w-xl hidden md:flex items-center rounded-xl overflow-hidden transition-all duration-500 border ${
            isScrolled 
              ? 'h-9 border-gray-200 bg-gray-50' 
              : 'h-12 border-gray-200 bg-white shadow-sm'
          } focus-within:border-[#DC2626] focus-within:shadow-md focus-within:shadow-red-500/5`}
        >
          {/* Category Dropdown */}
          <div ref={catDropdownRef} className="relative h-full">
            <button
              type="button"
              onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
              className="h-full px-4 bg-transparent hover:bg-gray-50 text-gray-600 text-xs font-semibold flex items-center gap-2 border-r border-gray-200 cursor-pointer whitespace-nowrap min-w-[130px] justify-between transition-colors"
            >
              <span className="truncate max-w-[100px]">{selectedCat}</span>
              <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${isCatDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCatDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 animate-fade-in max-h-80 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => { setSelectedCat('All Categories'); setIsCatDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-red-50 hover:text-[#DC2626] transition-colors ${selectedCat === 'All Categories' ? 'text-[#DC2626] bg-red-50' : 'text-gray-700'}`}
                >
                  All Categories
                </button>
                {STORE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => { setSelectedCat(cat.label); setIsCatDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-red-50 hover:text-[#DC2626] transition-colors ${selectedCat === cat.label ? 'text-[#DC2626] bg-red-50' : 'text-gray-600'}`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for books, pens, calculators..."
            className="flex-1 h-full px-4 text-[13px] text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="h-full px-5 bg-[#DC2626] hover:bg-[#B91C1C] text-white flex items-center justify-center transition-colors cursor-pointer border-none"
            title="Search"
          >
            <Search size={16} className="stroke-[2.5]" />
          </button>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* WhatsApp - prominent CTA */}
          <a
            href="https://wa.me/94770000000"
            target="_blank"
            rel="noreferrer"
            className={`hidden lg:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full transition-all duration-200 hover:shadow-md ${
              isScrolled ? 'px-3 py-1.5 text-[11px]' : 'px-4 py-2 text-xs'
            }`}
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>

          <div className="w-px h-5 bg-gray-200 mx-1 hidden lg:block" />

          <Link href="/admin/login" className="flex items-center gap-1.5 hover:text-[#DC2626] transition-colors text-[13px] font-medium text-gray-600 px-2 py-1.5 rounded-lg hover:bg-red-50/50" title="Log in">
            <User size={19} />
            <span className="hidden xl:inline">Account</span>
          </Link>

          <Link href="/products" className="flex items-center gap-1.5 hover:text-[#DC2626] transition-colors text-[13px] font-medium text-gray-600 px-2 py-1.5 rounded-lg hover:bg-red-50/50" title="Wishlist">
            <Heart size={19} />
          </Link>

          <button
            onClick={toggleCart}
            className="relative flex items-center gap-2 hover:text-[#DC2626] transition-colors text-[13px] font-semibold bg-transparent border-none cursor-pointer px-2 py-1.5 rounded-lg hover:bg-red-50/50 text-gray-700"
            title="My Cart"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2.5 bg-[#DC2626] text-white text-[9px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden xl:inline">Cart</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#DC2626] border-none bg-transparent cursor-pointer rounded-lg hover:bg-gray-50"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 h-10 px-4 text-xs text-gray-800 focus:outline-none bg-transparent"
          />
          <button type="submit" className="h-10 px-4 bg-[#DC2626] text-white flex items-center justify-center border-none">
            <Search size={15} />
          </button>
        </form>
      </div>

      {/* ── Sub-Navigation Bar ────────────────────────────── */}
      <div className="border-t border-gray-100 bg-white shadow-xs">
        <div className={`container mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar transition-all duration-300 ${
          isScrolled ? 'py-1' : 'py-2'
        }`}>
          
          {/* Left Nav Links */}
          <nav className="flex items-center gap-2 shrink-0 text-xs font-semibold text-gray-700">
            {/* Products Dropdown */}
            <div ref={productsRef} className="relative">
              <button
                onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#DC2626] font-bold border border-red-100 transition-all cursor-pointer text-xs"
              >
                <LayoutGrid size={14} className="text-[#DC2626]" />
                <span>All Products</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProductsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-fade-in divide-y divide-gray-100">
                  <Link
                    href="/products"
                    onClick={() => setIsProductsDropdownOpen(false)}
                    className="block px-4 py-2.5 text-xs font-bold text-[#DC2626] hover:bg-red-50 transition-colors flex items-center justify-between"
                  >
                    <span>View All Products</span>
                    <span>→</span>
                  </Link>
                  <div className="py-1">
                    {STORE_CATEGORIES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/products?category=${c.slug}`}
                        onClick={() => setIsProductsDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-red-50 hover:text-[#DC2626] transition-colors"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Brands Dropdown */}
            <div ref={brandsRef} className="relative">
              <button
                onClick={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-700 font-semibold transition-all cursor-pointer border border-transparent text-xs"
              >
                <Tag size={13} className="text-gray-400" />
                <span>Top Brands</span>
                <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${isBrandsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isBrandsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-fade-in">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Popular Brands</div>
                  {topBrands.map((b) => (
                    <Link
                      key={b}
                      href={`/products?search=${encodeURIComponent(b)}`}
                      onClick={() => setIsBrandsDropdownOpen(false)}
                      className="block px-4 py-2 text-xs text-gray-600 hover:bg-red-50 hover:text-[#DC2626] font-medium transition-colors"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-gray-200 mx-1 hidden sm:block" />

            {/* Direct Category Shortcuts */}
            <Link href="/products?category=books" className="px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#DC2626] transition-all whitespace-nowrap font-medium hidden lg:block">
              School Books
            </Link>
            <Link href="/products?category=writing-instruments" className="px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#DC2626] transition-all whitespace-nowrap font-medium hidden lg:block">
              Stationery
            </Link>
            <Link href="/products?category=art-craft" className="px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#DC2626] transition-all whitespace-nowrap font-medium hidden xl:block">
              Art &amp; Craft
            </Link>
            <Link href="/products?category=electronics" className="px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#DC2626] transition-all whitespace-nowrap font-medium hidden xl:block">
              Calculators
            </Link>
          </nav>

          {/* Right: Offers Pill */}
          <div className="flex items-center gap-2 shrink-0 pl-4">
            <Link
              href="/offers"
              className={`inline-flex items-center gap-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-full shadow-xs transition-all duration-200 hover:shadow-md ${
                isScrolled ? 'px-3 py-1 text-[11px]' : 'px-4 py-1.5 text-xs'
              }`}
            >
              <Flame size={13} className="fill-amber-300 text-amber-300" />
              Hot Offers
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer Menu ────────────────────────────── */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="p-5 space-y-1">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-bold text-gray-900 rounded-lg hover:bg-gray-50">Home</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-bold text-[#DC2626] rounded-lg hover:bg-red-50">All Products</Link>
            <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)} className="block py-2.5 px-3 text-sm font-bold text-gray-900 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Flame size={14} className="text-[#DC2626]" /> Special Offers
            </Link>

            <div className="pt-3 pb-1.5 px-3 text-[10px] font-bold uppercase text-gray-400 tracking-wider">Categories</div>
            {STORE_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 px-3 text-xs text-gray-600 rounded-lg hover:bg-gray-50 hover:text-[#DC2626]"
              >
                {c.label}
              </Link>
            ))}

            <div className="pt-4 mt-2 border-t border-gray-100">
              <a
                href="https://wa.me/94770000000"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                <MessageCircle size={16} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
