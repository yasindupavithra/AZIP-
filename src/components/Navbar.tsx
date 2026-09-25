'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Search, 
  User, 
  ChevronDown, 
  ChevronRight,
  MessageCircle, 
  Flame, 
  Menu, 
  X,
  Phone,
  MapPin,
  LayoutGrid,
  Tag,
  Sparkles,
  Upload,
  BookOpen,
  GraduationCap,
  PenTool,
  Palette,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { 
  STORE_CATEGORIES, 
  MEGA_MENU_TREE, 
  INITIAL_CATALOG_PRODUCTS,
  CatalogProduct,
  BRANDS_LIST
} from '@/lib/catalog';
import BooklistUploadModal from '@/components/BooklistUploadModal';

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCat, setSelectedCat] = useState('All Categories');
  
  // Navigation Dropdown States
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activePillarId, setActivePillarId] = useState(MEGA_MENU_TREE[0].id);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [isBrandsDropdownOpen, setIsBrandsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobilePillar, setExpandedMobilePillar] = useState<string | null>(MEGA_MENU_TREE[0].id);

  // Search & Autocomplete States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveProducts, setLiveProducts] = useState<CatalogProduct[]>(INITIAL_CATALOG_PRODUCTS);
  const [searchResults, setSearchResults] = useState<CatalogProduct[]>([]);

  // Booklist Upload Modal State
  const [isBooklistModalOpen, setIsBooklistModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Refs for click outside
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const catDropdownRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLFormElement>(null);

  const { items, toggleCart } = useCartStore();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Fetch dynamic products for autocomplete
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=50');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setLiveProducts(data.products);
          }
        }
      } catch (err) {
        // keep fallback
      }
    }
    fetchProducts();

    const handleClickOutside = (event: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsMegaMenuOpen(false);
      }
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
        setIsCatDropdownOpen(false);
      }
      if (brandsRef.current && !brandsRef.current.contains(event.target as Node)) {
        setIsBrandsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter products live as search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = liveProducts.filter((p) => (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      p.tags?.some((t) => t.toLowerCase().includes(q))
    )).slice(0, 5);
    setSearchResults(matches);
  }, [searchQuery, liveProducts]);

  const itemCount = mounted ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCat !== 'All Categories') {
      const match = STORE_CATEGORIES.find(c => c.label.toLowerCase() === selectedCat.toLowerCase());
      if (match) params.set('category', match.slug);
    }
    router.push(`/products?${params.toString()}`);
  };

  const activePillar = MEGA_MENU_TREE.find((p) => p.id === activePillarId) || MEGA_MENU_TREE[0];

  const getPillarIcon = (name: string) => {
    switch (name) {
      case 'GraduationCap': return <GraduationCap size={17} />;
      case 'BookOpen': return <BookOpen size={17} />;
      case 'Book': return <FileText size={17} />;
      case 'PenTool': return <PenTool size={17} />;
      case 'Palette': return <Palette size={17} />;
      default: return <LayoutGrid size={17} />;
    }
  };

  return (
    <>
      <header className={`w-full sticky top-0 z-50 transition-all duration-300 font-sans ${
        isScrolled 
          ? 'shadow-lg bg-white/98 backdrop-blur-md border-b border-gray-100' 
          : 'shadow-xs bg-white border-b border-gray-100'
      }`}>
        
        {/* ── 1. Top Utility Bar ────────────────────────────────── */}
        <div 
          className={`bg-slate-900 text-slate-300 transition-all duration-300 overflow-hidden ${
            isScrolled 
              ? 'max-h-0 opacity-0 py-0 pointer-events-none' 
              : 'max-h-12 opacity-100 py-2 border-b border-slate-800'
          }`}
        >
          <div className="container mx-auto px-4 flex justify-between items-center text-xs">
            <div className="flex items-center gap-5 font-medium">
              <span className="flex items-center gap-2">
                <Phone size={13} className="text-emerald-400" />
                <a href="tel:+9481222222" className="hover:text-white transition-colors">+94 81 222 2222</a>
                <span className="text-slate-700">/</span>
                <a href="tel:+94770000000" className="hover:text-white transition-colors">+94 77 000 0000</a>
              </span>
              <span className="hidden sm:inline text-slate-700">|</span>
              <span className="hidden md:flex items-center gap-1.5 text-emerald-400">
                <MapPin size={13} /> Kandy, Sri Lanka
              </span>
            </div>

            <div className="flex items-center gap-4 font-medium">
              {/* Pillar 4 Feature: High-conversion Booklist Direct Upload Button */}
              <button
                type="button"
                onClick={() => setIsBooklistModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-sm transition-all hover:scale-105 cursor-pointer border-none"
              >
                <Upload size={12} />
                <span>Upload School Booklist</span>
                <Sparkles size={11} className="text-amber-300 animate-pulse" />
              </button>

              <span className="text-slate-700 hidden sm:inline">|</span>
              <span className="text-slate-300 font-bold bg-slate-800 px-2.5 py-0.5 rounded text-[11px]">LKR (Rs.)</span>
            </div>
          </div>
        </div>

        {/* ── 2. Main Navigation Bar (Logo, Live Search Autocomplete, WhatsApp, Cart) ── */}
        <div className={`container mx-auto px-4 flex items-center justify-between gap-4 md:gap-8 transition-all duration-300 ${
          isScrolled ? 'py-2.5' : 'py-4 sm:py-5'
        }`}>
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center shrink-0 group">
            <img
              src="/azip-logo.png"
              alt="AZIP .store"
              className={`w-auto object-contain transition-all duration-300 drop-shadow-xs group-hover:scale-[1.02] ${
                isScrolled ? 'h-10 sm:h-11' : 'h-13 sm:h-15'
              }`}
            />
          </Link>

          {/* Search Bar with Instant Autocomplete Dropdown */}
          <form 
            ref={searchRef}
            onSubmit={handleSearchSubmit} 
            className={`relative flex-1 max-w-2xl hidden md:flex items-center rounded-full p-1.5 transition-all duration-300 border bg-gray-50/90 ${
              isScrolled 
                ? 'h-11 border-gray-200' 
                : 'h-12 sm:h-13 border-gray-200 shadow-sm'
            } focus-within:border-[#DC2626] focus-within:bg-white focus-within:ring-4 focus-within:ring-red-500/10`}
          >
            {/* Category Filter Selector Dropdown */}
            <div ref={catDropdownRef} className="relative h-full">
              <button
                type="button"
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                className="h-full px-4 text-gray-800 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-r border-gray-200 cursor-pointer whitespace-nowrap min-w-[140px] justify-between transition-colors hover:text-[#DC2626]"
              >
                <span className="truncate max-w-[105px]">{selectedCat}</span>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isCatDropdownOpen ? 'rotate-180 text-[#DC2626]' : ''}`} />
              </button>

              {isCatDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-fade-in max-h-80 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => { setSelectedCat('All Categories'); setIsCatDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-red-50 hover:text-[#DC2626] transition-colors flex items-center justify-between ${selectedCat === 'All Categories' ? 'text-[#DC2626] bg-red-50' : 'text-gray-800'}`}
                  >
                    <span>All Categories</span>
                    <Sparkles size={13} className="text-[#DC2626]" />
                  </button>
                  <div className="h-px bg-gray-100 my-1" />
                  {STORE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => { setSelectedCat(cat.label); setIsCatDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-red-50 hover:text-[#DC2626] transition-colors ${selectedCat === cat.label ? 'text-[#DC2626] bg-red-50 font-bold' : 'text-gray-600'}`}
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
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for school books, pens, calculators, art supplies..."
              className="flex-1 h-full px-4 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent font-medium"
            />

            {/* Search Button Pill */}
            <button
              type="submit"
              className="h-full px-5 bg-gradient-to-r from-[#DC2626] to-[#E11D48] hover:from-[#B91C1C] hover:to-[#C2410C] text-white rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer border-none shadow-md hover:shadow-lg hover:scale-[1.03]"
              title="Search Products"
            >
              <Search size={16} className="stroke-[2.5]" />
            </button>

            {/* Pillar 3: Instant Live Search Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 p-4 animate-fade-in overflow-hidden">
                
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex justify-between items-center">
                      <span>Matching Products ({searchResults.length})</span>
                      <span className="text-[#DC2626]">Live Search</span>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {searchResults.map((prod) => (
                        <Link
                          key={prod._id}
                          href={`/products/${prod.slug}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-red-50/60 transition-colors group"
                        >
                          {/* 1:1 Square Thumbnail */}
                          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={prod.images?.[0]?.url || '/categories/cat_stationery.jpg'}
                              alt={prod.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-gray-800 group-hover:text-[#DC2626] truncate">
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-gray-400 font-medium flex items-center gap-2 mt-0.5">
                              {prod.brand && <span className="font-bold text-slate-700">{prod.brand}</span>}
                              <span>Rs {prod.price.toLocaleString()}</span>
                            </div>
                          </div>

                          <ChevronRight size={14} className="text-gray-300 group-hover:text-[#DC2626] group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors mt-2"
                    >
                      <span>View All Results for "{searchQuery}"</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-gray-500 font-medium">
                    No exact matching products found for "<span className="font-bold text-gray-800">{searchQuery}</span>". Press Enter to view full catalog.
                  </div>
                )}

              </div>
            )}
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Prominent WhatsApp Button */}
            <a
              href="https://wa.me/94770000000?text=Hello%20AZIP%20Store%2C%20I%20have%20an%20inquiry"
              target="_blank"
              rel="noreferrer"
              className={`hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold rounded-full transition-all duration-300 shadow-md hover:shadow-lg border border-emerald-400/30 ${
                isScrolled ? 'px-3.5 py-1.5 text-xs' : 'px-4.5 py-2 text-xs'
              }`}
            >
              <div className="w-4.5 h-4.5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle size={13} className="fill-white text-emerald-600" />
              </div>
              <span>WhatsApp</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            </a>

            <div className="w-px h-6 bg-gray-200 mx-0.5 hidden lg:block" />

            {/* Account Button */}
            <Link href="/admin/login" className="flex items-center gap-1.5 hover:text-[#DC2626] transition-colors text-xs font-bold text-gray-700 px-2.5 py-2 rounded-xl hover:bg-red-50/60" title="Admin Portal">
              <User size={18} className="text-gray-700" />
              <span className="hidden xl:inline">Account</span>
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={toggleCart}
              className="relative flex items-center gap-1.5 hover:text-[#DC2626] transition-colors text-xs font-extrabold bg-transparent border-none cursor-pointer px-2.5 py-2 rounded-xl hover:bg-red-50/60 text-gray-800"
              title="My Cart"
            >
              <div className="relative">
                <ShoppingCart size={19} className="text-gray-800" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#DC2626] text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-black shadow-xs animate-scale-in">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline">Cart</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-800 hover:text-[#DC2626] border-none bg-transparent cursor-pointer rounded-xl hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50 p-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school books, pens, calculators..."
              className="flex-1 h-9 px-4 text-xs text-gray-800 focus:outline-none bg-transparent font-medium"
            />
            <button type="submit" className="h-9 w-9 bg-[#DC2626] text-white flex items-center justify-center rounded-full border-none">
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* ── 3. Pillar 1: Global Mega Menu Sub-Navigation Bar ───────────────────── */}
        <div className="border-t border-gray-200/80 bg-slate-50/90 shadow-2xs">
          <div className={`container mx-auto px-4 flex items-center justify-between overflow-x-auto no-scrollbar transition-all duration-300 ${
            isScrolled ? 'py-1.5' : 'py-2.5'
          }`}>
            
            <nav className="flex items-center gap-4 sm:gap-6 shrink-0 text-xs sm:text-sm font-bold text-gray-800">
              
              {/* =========================================================================
                  DESKTOP MEGA MENU BUTTON & DROPDOWN PANEL
                 ========================================================================= */}
              <div ref={megaMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                  onMouseEnter={() => setIsMegaMenuOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black transition-all cursor-pointer text-xs sm:text-sm shadow-sm hover:shadow-md"
                >
                  <LayoutGrid size={15} />
                  <span>All Categories</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* MEGA MENU CONTAINER */}
                {isMegaMenuOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-[850px] max-w-[92vw] bg-white border border-gray-100 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col md:flex-row animate-fade-in divide-y md:divide-y-0 md:divide-x divide-gray-100"
                    onMouseLeave={() => setIsMegaMenuOpen(false)}
                  >
                    
                    {/* Left Column: 5 Main Category Pillars */}
                    <div className="w-full md:w-64 bg-slate-50/80 p-3 space-y-1 shrink-0">
                      <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                        Category Tree
                      </div>
                      
                      {MEGA_MENU_TREE.map((pillar) => {
                        const isActive = pillar.id === activePillarId;
                        return (
                          <button
                            key={pillar.id}
                            type="button"
                            onMouseEnter={() => setActivePillarId(pillar.id)}
                            onClick={() => {
                              router.push(`/products?category=${pillar.slug}`);
                              setIsMegaMenuOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer border-none ${
                              isActive
                                ? 'bg-white text-[#DC2626] shadow-sm border border-gray-100'
                                : 'text-gray-700 hover:bg-white/60 hover:text-gray-900'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <span className={isActive ? 'text-[#DC2626]' : 'text-gray-400'}>
                                {getPillarIcon(pillar.iconName)}
                              </span>
                              <span className="truncate">{pillar.title}</span>
                            </div>
                            <ChevronRight size={14} className={isActive ? 'text-[#DC2626]' : 'text-gray-300'} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Content: Sub-Category Grid & Featured Card */}
                    <div className="flex-1 p-6 bg-white flex flex-col justify-between">
                      <div>
                        {/* Header Title for Active Pillar */}
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                          <div>
                            <h4 className="text-sm font-black text-gray-900">{activePillar.title}</h4>
                            <p className="text-[11px] text-gray-500 font-medium">{activePillar.description}</p>
                          </div>
                          <Link
                            href={`/products?category=${activePillar.slug}`}
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1 shrink-0"
                          >
                            <span>Browse All</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>

                        {/* 3 Columns Sub-Category Tree */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          {activePillar.columns.map((col, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-100">
                                {col.title}
                              </div>
                              <ul className="space-y-1.5">
                                {col.items.map((item, itemIdx) => (
                                  <li key={itemIdx}>
                                    <Link
                                      href={item.href}
                                      onClick={() => setIsMegaMenuOpen(false)}
                                      className="text-xs text-gray-600 hover:text-[#DC2626] font-medium transition-colors flex items-center justify-between group"
                                    >
                                      <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                                      {item.badge && (
                                        <span className="text-[9px] font-bold bg-red-50 text-[#DC2626] px-1.5 py-0.5 rounded-full border border-red-100">
                                          {item.badge}
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Featured Promotion Card inside Mega Menu */}
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <img
                            src={activePillar.featuredImage}
                            alt={activePillar.featuredTitle}
                            className="w-12 h-12 rounded-xl object-cover shadow-sm shrink-0"
                          />
                          <div>
                            <div className="text-xs font-black text-gray-900">{activePillar.featuredTitle}</div>
                            <div className="text-[11px] text-gray-500 font-medium">{activePillar.featuredSubtitle}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsMegaMenuOpen(false);
                            setIsBooklistModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 bg-[#DC2626] hover:bg-[#b91c1c] text-white text-[11px] font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer border-none"
                        >
                          Upload List
                        </button>
                      </div>

                    </div>

                  </div>
                )}
              </div>

              {/* Brands Quick Dropdown */}
              <div ref={brandsRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsBrandsDropdownOpen(!isBrandsDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white text-gray-800 hover:text-[#DC2626] font-bold transition-all cursor-pointer border border-transparent hover:border-gray-200 text-xs sm:text-sm"
                >
                  <Tag size={14} className="text-gray-400" />
                  <span>Top Brands</span>
                  <ChevronDown size={13} className={`text-gray-400 transition-transform duration-200 ${isBrandsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isBrandsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-fade-in">
                    <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Stationery Brands</div>
                    {BRANDS_LIST.map((b) => (
                      <Link
                        key={b}
                        href={`/products?search=${encodeURIComponent(b)}`}
                        onClick={() => setIsBrandsDropdownOpen(false)}
                        className="block px-4 py-1.5 text-xs text-gray-600 hover:bg-red-50 hover:text-[#DC2626] font-medium transition-colors"
                      >
                        {b}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-4 w-px bg-gray-300 mx-0.5 hidden sm:block" />

              {/* Category Quick Shortcuts */}
              <Link 
                href="/products?category=school-books" 
                className="px-3 py-1.5 rounded-xl text-gray-800 hover:bg-white hover:text-[#DC2626] transition-all whitespace-nowrap font-bold text-xs sm:text-sm"
              >
                School Books
              </Link>
              <Link 
                href="/products?category=exercise-books" 
                className="px-3 py-1.5 rounded-xl text-gray-800 hover:bg-white hover:text-[#DC2626] transition-all whitespace-nowrap font-bold text-xs sm:text-sm"
              >
                CR &amp; Exercise Books
              </Link>
              <Link 
                href="/products?category=writing-instruments" 
                className="px-3 py-1.5 rounded-xl text-gray-800 hover:bg-white hover:text-[#DC2626] transition-all whitespace-nowrap font-bold text-xs sm:text-sm hidden sm:block"
              >
                Pens &amp; Maths
              </Link>
              <Link 
                href="/products?category=art-craft" 
                className="px-3 py-1.5 rounded-xl text-gray-800 hover:bg-white hover:text-[#DC2626] transition-all whitespace-nowrap font-bold text-xs sm:text-sm hidden lg:block"
              >
                Art &amp; Craft
              </Link>
            </nav>

            {/* Right: Hot Offers Pill */}
            <div className="flex items-center gap-2 shrink-0 pl-4">
              <Link
                href="/offers"
                className={`inline-flex items-center gap-1.5 bg-gradient-to-r from-[#DC2626] to-[#E11D48] hover:from-[#B91C1C] hover:to-[#C2410C] text-white font-black rounded-full shadow-xs transition-all duration-200 hover:shadow-md hover:scale-[1.03] ${
                  isScrolled ? 'px-3.5 py-1.5 text-xs' : 'px-4.5 py-2 text-xs sm:text-sm'
                }`}
              >
                <Flame size={15} className="fill-amber-300 text-amber-300 animate-pulse" />
                <span>Hot Offers</span>
              </Link>
            </div>

          </div>
        </div>

        {/* ── 4. Mobile Nested Accordion Mega Menu Drawer ────────────────── */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="p-4 space-y-3">
              
              {/* Direct Upload Banner on Mobile */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsBooklistModalOpen(true);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold text-xs flex items-center justify-between shadow-md"
              >
                <span className="flex items-center gap-2">
                  <Upload size={16} /> Direct Upload School Booklist
                </span>
                <Sparkles size={14} className="text-amber-300" />
              </button>

              <div className="space-y-1">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 text-xs font-bold text-gray-900 rounded-xl hover:bg-gray-50">Home</Link>
                <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 text-xs font-bold text-[#DC2626] rounded-xl hover:bg-red-50">All Products</Link>
                <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 px-3 text-xs font-bold text-gray-900 rounded-xl hover:bg-gray-50 flex items-center gap-2">
                  <Flame size={14} className="text-[#DC2626]" /> Special Offers
                </Link>
              </div>

              <div className="pt-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 px-2">
                Categories Mega Tree
              </div>

              {/* Mobile Accordions for 5 Pillars */}
              <div className="space-y-1.5 divide-y divide-gray-100">
                {MEGA_MENU_TREE.map((pillar) => {
                  const isExpanded = expandedMobilePillar === pillar.id;
                  return (
                    <div key={pillar.id} className="pt-1.5">
                      <button
                        type="button"
                        onClick={() => setExpandedMobilePillar(isExpanded ? null : pillar.id)}
                        className="w-full text-left py-2 px-2 text-xs font-bold text-gray-800 flex items-center justify-between rounded-xl hover:bg-gray-50"
                      >
                        <span className="flex items-center gap-2">
                          {getPillarIcon(pillar.iconName)}
                          <span>{pillar.title}</span>
                        </span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-[#DC2626]' : 'text-gray-400'}`} />
                      </button>

                      {isExpanded && (
                        <div className="pl-6 pr-2 py-2 space-y-3 bg-slate-50/60 rounded-xl mt-1">
                          {pillar.columns.map((col, cIdx) => (
                            <div key={cIdx} className="space-y-1">
                              <div className="text-[10px] font-extrabold text-slate-500 uppercase">{col.title}</div>
                              {col.items.map((it, iIdx) => (
                                <Link
                                  key={iIdx}
                                  href={it.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="block py-1 text-xs text-gray-600 hover:text-[#DC2626] font-medium"
                                >
                                  {it.label}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-gray-100">
                <a
                  href="https://wa.me/94770000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  <MessageCircle size={15} /> Chat on WhatsApp
                </a>
              </div>

            </div>
          </div>
        )}
      </header>

      {/* Booklist Direct Upload Modal Component */}
      <BooklistUploadModal
        isOpen={isBooklistModalOpen}
        onClose={() => setIsBooklistModalOpen(false)}
      />
    </>
  );
}
