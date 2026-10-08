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
      <header className="w-full sticky top-0 z-50 font-sans shadow-lg bg-[#E11D48]">

        {/* ── 2. Main Navigation Bar (Clean Rose-Pink Daraz Layout) ── */}

        {/* ── 2. Main Navigation Bar (Clean Rose-Pink Daraz Layout) ── */}
        <div className={`bg-[#E11D48] shadow-md transition-all duration-300 flex items-center ${isScrolled ? 'py-2 sm:py-2.5' : 'py-3 sm:py-6 lg:py-8'
          }`}>
          <div className="container mx-auto px-4 flex items-center justify-between gap-3 md:gap-10">

            {/* Brand Logo in crisp white pill card */}
            <Link href="/" className="flex items-center shrink-0 group">
              <div className={`bg-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 group-hover:scale-[1.03] ${isScrolled ? 'px-3 py-1' : 'px-3.5 sm:px-5 py-1.5 sm:py-2.5'
                }`}>
                <img
                  src="/azip-logo.png"
                  alt="AZIP Store"
                  className={`w-auto object-contain transition-all duration-300 ${isScrolled ? 'h-7 sm:h-9' : 'h-9 sm:h-14'
                    }`}
                />
              </div>
            </Link>

            {/* Ultra-Simple Search Bar */}
            <form
              ref={searchRef}
              onSubmit={handleSearchSubmit}
              className={`relative flex-1 max-w-4xl hidden md:flex items-center rounded-lg bg-white shadow-lg overflow-hidden transition-all duration-300 ${isScrolled ? 'h-10 sm:h-11' : 'h-13 sm:h-15'
                }`}
            >
              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in AZIP Store..."
                className="flex-1 h-full px-6 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent font-semibold"
              />

              {/* Tinted Search Icon Button */}
              <button
                type="submit"
                className="h-full px-6 bg-rose-50 hover:bg-rose-100 text-[#E11D48] flex items-center justify-center transition-all duration-200 cursor-pointer border-none font-extrabold"
                title="Search Products"
              >
                <Search size={isScrolled ? 18 : 23} className="stroke-[2.8]" />
              </button>

              {/* Instant Search Autocomplete Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 p-5 animate-fade-in overflow-hidden text-gray-900">

                  {searchResults.length > 0 ? (
                    <div className="space-y-4">
                      <div className="px-2 text-xs font-extrabold uppercase tracking-wider text-gray-400 flex justify-between items-center">
                        <span>Matching Products ({searchResults.length})</span>
                        <span className="text-[#E11D48]">Live Search</span>
                      </div>

                      <div className="divide-y divide-gray-100">
                        {searchResults.map((prod) => (
                          <Link
                            key={prod._id}
                            href={`/products/${prod.slug}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-rose-50/70 transition-colors group"
                          >
                            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                              <img
                                src={prod.images?.[0]?.url || '/categories/cat_stationery.jpg'}
                                alt={prod.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-gray-800 group-hover:text-[#E11D48] truncate">
                                {prod.name}
                              </div>
                              <div className="text-xs text-gray-400 font-medium flex items-center gap-2 mt-0.5">
                                {prod.brand && <span className="font-bold text-slate-700">{prod.brand}</span>}
                                <span>Rs {prod.price.toLocaleString()}</span>
                              </div>
                            </div>

                            <ChevronRight size={16} className="text-gray-300 group-hover:text-[#E11D48] group-hover:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#E11D48] hover:bg-[#be123c] text-white text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors mt-2 border-none shadow-md"
                      >
                        <span>View All Results for "{searchQuery}"</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs sm:text-sm text-gray-500 font-medium">
                      No exact matching products found for "<span className="font-bold text-gray-800">{searchQuery}</span>". Press Enter to view full catalog.
                    </div>
                  )}

                </div>
              )}
            </form>

            {/* Right Side: Cart Icon Only */}
            <div className="flex items-center gap-4 sm:gap-5">
              <button
                type="button"
                onClick={toggleCart}
                className="relative flex items-center text-white bg-transparent border-none cursor-pointer p-1.5 hover:scale-105 transition-transform"
                title="My Cart"
              >
                <div className="relative">
                  <ShoppingCart size={isScrolled ? 28 : 36} className="text-white stroke-[2] transition-all duration-300" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-[#E11D48] text-[11px] min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center font-black shadow-md animate-scale-in">
                      {itemCount}
                    </span>
                  )}
                </div>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2.5 text-white border-none bg-transparent cursor-pointer rounded-2xl hover:bg-rose-600/50"
              >
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>

          </div>
        </div>

        {/* Professional Mobile Search Bar with Live Autocomplete */}
        <div className="md:hidden px-4 pb-3">
          <form 
            ref={searchRef}
            onSubmit={handleSearchSubmit} 
            className="relative flex items-center rounded-lg bg-white shadow-lg overflow-hidden border border-rose-100/60 h-11 transition-all"
          >
            <div className="pl-3.5 text-[#E11D48] flex items-center justify-center shrink-0">
              <Search size={17} className="stroke-[2.8]" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search school books, pens, tech..."
              className="flex-1 h-full px-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent font-semibold"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-2 text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer shrink-0"
              >
                <X size={15} />
              </button>
            )}

            <button 
              type="submit" 
              className="h-full px-4 bg-[#E11D48] active:bg-[#be123c] text-white flex items-center justify-center font-black text-xs border-none cursor-pointer tracking-wider shrink-0"
            >
              Search
            </button>

            {/* Mobile Live Autocomplete Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 p-4 animate-fade-in text-gray-900">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    <div className="px-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 flex justify-between items-center">
                      <span>Matching Products ({searchResults.length})</span>
                      <span className="text-[#E11D48]">Live Search</span>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {searchResults.map((prod) => (
                        <Link
                          key={prod._id}
                          href={`/products/${prod.slug}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50/70 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-gray-100 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={prod.images?.[0]?.url || '/categories/cat_stationery.jpg'}
                              alt={prod.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-gray-800 truncate">
                              {prod.name}
                            </div>
                            <div className="text-[11px] text-gray-400 font-semibold flex items-center gap-1.5 mt-0.5">
                              {prod.brand && <span className="text-slate-700">{prod.brand}</span>}
                              <span>Rs {prod.price.toLocaleString()}</span>
                            </div>
                          </div>

                          <ChevronRight size={14} className="text-gray-300 shrink-0" />
                        </Link>
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#E11D48] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 border-none shadow-md"
                    >
                      <span>View All Results</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-gray-500 font-medium">
                    No matching products found for "<span className="font-bold text-gray-800">{searchQuery}</span>". Press Search for full catalog.
                  </div>
                )}
              </div>
            )}
          </form>
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
