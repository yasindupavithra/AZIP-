'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  Truck,
  ShieldCheck,
  ArrowRight,
  Upload,
  HelpCircle,
  MapPin,
  UserPlus,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import {
  STORE_CATEGORIES,
  INITIAL_CATALOG_PRODUCTS,
  CatalogProduct,
} from '@/lib/catalog';
import BooklistUploadModal from '@/components/BooklistUploadModal';

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveProducts, setLiveProducts] = useState<CatalogProduct[]>(INITIAL_CATALOG_PRODUCTS);
  const [searchResults, setSearchResults] = useState<CatalogProduct[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBooklistModalOpen, setIsBooklistModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const searchRef = useRef<HTMLFormElement>(null);
  const { toggleCart, getItemCount } = useCartStore();

  useEffect(() => {
    setMounted(true);

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=50');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setLiveProducts(data.products);
          }
        }
      } catch {
        // keep fallback catalog
      }
    }
    fetchProducts();

    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const filtered = liveProducts
      .filter((p) => {
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand?.toLowerCase().includes(q);
        const matchCategory = p.category.toLowerCase().includes(q);
        const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        return matchName || matchBrand || matchCategory || matchTags;
      })
      .slice(0, 6);

    setSearchResults(filtered);
  }, [searchQuery, liveProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartCount = mounted ? getItemCount() : 0;

  return (
    <>
      <header className="w-full sticky top-0 z-50 font-sans bg-white">
        {/* Top utility bar */}
        <div className="bg-[#0C3E7C] text-white text-[11px] py-[7px] hidden sm:block">
          <div className="container mx-auto px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-medium text-white/95">
              <span className="flex items-center gap-1.5">
                <Truck size={13} strokeWidth={2} /> Free Delivery Islandwide
              </span>
              <span className="text-white/40 font-light">|</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} strokeWidth={2} /> Trusted by 10,000+ Parents
              </span>
            </div>
            <div className="flex items-center gap-4 lg:gap-6 font-medium text-white/95">
              <Link href="/faq" className="hover:text-sky-200 transition-colors flex items-center gap-1">
                <HelpCircle size={12} strokeWidth={2} /> Help &amp; Support
              </Link>
              <Link href="/checkout" className="hover:text-sky-200 transition-colors flex items-center gap-1">
                <MapPin size={12} strokeWidth={2} /> Track Order
              </Link>
              <Link href="/admin/login" className="hover:text-sky-200 transition-colors flex items-center gap-1">
                <User size={12} strokeWidth={2} /> Login
              </Link>
              <Link href="/admin/login" className="hover:text-sky-200 transition-colors flex items-center gap-1">
                <UserPlus size={12} strokeWidth={2} /> Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* White main header */}
        <div className="bg-white border-b border-slate-100 shadow-[0_3px_14px_rgba(15,23,42,0.04)]">
          <div className="container mx-auto px-3.5 sm:px-4 py-3 sm:py-6 lg:py-7">
            <div className="flex items-center justify-between gap-3 sm:gap-4 md:gap-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer border-none bg-transparent"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <Link href="/" className="shrink-0 group">
                  <img
                    src="/azip-logo.png"
                    alt="AZIP Store"
                    className="h-9 sm:h-[54px] lg:h-[64px] w-auto object-contain group-hover:scale-[1.02] transition-transform"
                  />
                </Link>
              </div>

              <form
                ref={searchRef}
                onSubmit={handleSearchSubmit}
                className="relative flex-1 max-w-2xl hidden md:flex items-center"
              >
                <div className="flex w-full items-center rounded-full bg-white border border-slate-200 shadow-[inset_0_1px_3px_rgba(15,23,42,0.04)] focus-within:border-[#0066FF] focus-within:ring-4 focus-within:ring-[#0066FF]/10 transition-all">
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for books, stationery, school bags, and more..."
                    className="flex-1 h-12 sm:h-14 pl-6 sm:pl-7 pr-3 text-[14px] sm:text-[15px] text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent font-normal"
                  />
                  <button
                    type="submit"
                    className="h-10 w-10 sm:h-11 sm:w-11 mr-1.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer border-none shadow-sm"
                    title="Search"
                  >
                    <Search size={18} strokeWidth={2.4} />
                  </button>
                </div>

                {isSearchFocused && searchQuery.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                    {searchResults.length > 0 ? (
                      <div className="p-2 space-y-0.5">
                        {searchResults.map((product) => (
                          <Link
                            key={product._id}
                            href={`/products/${product.slug}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <img
                              src={product.images[0]?.url || '/placeholder.png'}
                              alt={product.name}
                              className="w-10 h-10 object-contain p-1 rounded-lg bg-slate-50 border border-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                {product.brand || 'AZIP'}
                              </div>
                            </div>
                            <div className="text-sm font-bold text-[#2B6BFF] shrink-0">
                              Rs {product.price.toLocaleString()}
                            </div>
                          </Link>
                        ))}
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#2B6BFF] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border-none mt-1 cursor-pointer"
                        >
                          View All Results
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    ) : (
                      <div className="p-5 text-center text-sm text-slate-500">
                        No results for &ldquo;
                        <span className="font-bold text-slate-800">{searchQuery}</span>&rdquo;
                      </div>
                    )}
                  </div>
                )}
              </form>

              <button
                type="button"
                onClick={toggleCart}
                className="flex items-center gap-2 sm:gap-3 text-slate-800 hover:bg-slate-50 rounded-full px-2.5 sm:px-4 py-2 cursor-pointer border-none bg-transparent transition-colors"
                title="Cart"
              >
                <div className="relative">
                  <ShoppingCart size={24} className="text-[#0066FF]" strokeWidth={2} />
                  <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#0066FF] text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                </div>
                <span className="hidden sm:inline text-[15px] font-bold text-[#0F172A]">Cart</span>
              </button>
            </div>

            {/* Mobile instant search pill */}
            <div className="mt-2.5 md:hidden">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex w-full items-center rounded-full bg-slate-50 border border-slate-200/90 shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] focus-within:bg-white focus-within:border-[#0066FF] focus-within:ring-2 focus-within:ring-[#0066FF]/15 transition-all"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search books, stationery, bags..."
                  className="flex-1 h-10 pl-4 pr-2 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="h-8 w-8 mr-1 bg-[#0066FF] text-white rounded-full flex items-center justify-center shrink-0 border-none cursor-pointer shadow-sm"
                  title="Search"
                >
                  <Search size={15} strokeWidth={2.4} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center rounded-full border border-slate-200 overflow-hidden">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, stationery..."
                className="flex-1 h-10 pl-4 pr-2 text-sm focus:outline-none bg-slate-50"
              />
              <button
                type="submit"
                className="w-10 h-10 bg-[#2B6BFF] text-white flex items-center justify-center border-none cursor-pointer"
              >
                <Search size={16} />
              </button>
            </form>

            <div className="space-y-0.5 text-sm font-semibold text-slate-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-lg hover:bg-blue-50 text-[#2B6BFF]">
                Home
              </Link>
              <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-lg hover:bg-slate-50">
                Shop
              </Link>
              <Link href="/offers" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-lg hover:bg-slate-50">
                Offers
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-lg hover:bg-slate-50">
                About Us
              </Link>
              <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-lg hover:bg-slate-50">
                Contact
              </Link>
            </div>

            <div className="border-t border-slate-100 pt-3 max-h-48 overflow-y-auto space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1">
                Categories
              </p>
              {STORE_CATEGORIES.slice(0, 10).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-2.5 py-2 text-sm text-slate-700 hover:text-[#2B6BFF] hover:bg-blue-50 rounded-lg"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBooklistModalOpen(true);
              }}
              className="w-full py-2.5 bg-[#2B6BFF] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              <Upload size={14} /> Upload School Booklist
            </button>
          </div>
        )}
      </header>

      <BooklistUploadModal
        isOpen={isBooklistModalOpen}
        onClose={() => setIsBooklistModalOpen(false)}
      />
    </>
  );
}
