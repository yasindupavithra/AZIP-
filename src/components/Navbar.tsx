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
        // keep fallback
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
      <header className="w-full sticky top-0 z-50 font-sans">
        {/* Top utility strip — marketplace style */}
        <div className="bg-[#004A99] text-white/90 text-[11px] py-1.5 hidden sm:block">
          <div className="container mx-auto px-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-5 font-semibold">
              <span className="flex items-center gap-1.5">
                <Truck size={12} /> Free Delivery Islandwide
              </span>
              <span className="hidden lg:flex items-center gap-1.5">
                <ShieldCheck size={12} /> Trusted by 10,000+ Parents
              </span>
            </div>
            <div className="flex items-center gap-5 font-semibold">
              <Link href="/faq" className="hover:text-white transition-colors flex items-center gap-1">
                <HelpCircle size={12} /> Help &amp; Support
              </Link>
              <Link href="/checkout" className="hover:text-white transition-colors">
                Track Order
              </Link>
              <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1">
                <User size={12} /> Login
              </Link>
              <Link href="/admin/login" className="hover:text-white transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Main brand header — solid blue like marketplace */}
        <div className="bg-[#007AFF] shadow-md shadow-blue-600/20">
          <div className="container mx-auto px-4 py-3.5 flex items-center gap-4 md:gap-6">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:bg-white/15 rounded-lg cursor-pointer border-none bg-transparent"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link
              href="/"
              className="shrink-0 group bg-white rounded-lg px-2.5 py-1.5 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="/azip-logo.png"
                alt="AZIP Store"
                className="h-8 sm:h-9 w-auto object-contain group-hover:scale-[1.02] transition-transform"
              />
            </Link>

            {/* Wide search — marketplace signature */}
            <form
              ref={searchRef}
              onSubmit={handleSearchSubmit}
              className="relative flex-1 max-w-3xl hidden md:flex items-stretch rounded-md overflow-hidden shadow-lg shadow-black/10"
            >
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in AZIP Store"
                className="flex-1 h-11 px-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-white font-medium"
              />
              <button
                type="submit"
                className="h-11 w-12 bg-[#0056B3] hover:bg-[#004494] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer border-none"
                title="Search"
              >
                <Search size={18} />
              </button>

              {isSearchFocused && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  {searchResults.length > 0 ? (
                    <div className="p-2 space-y-0.5">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={() => setIsSearchFocused(false)}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <img
                            src={product.images[0]?.url || '/placeholder.png'}
                            alt={product.name}
                            className="w-10 h-10 object-contain p-1 rounded-md bg-slate-50 border border-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-900 truncate">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium">
                              {product.brand || 'AZIP'}
                            </div>
                          </div>
                          <div className="text-sm font-bold text-[#007AFF] shrink-0">
                            Rs {product.price.toLocaleString()}
                          </div>
                        </Link>
                      ))}
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#007AFF] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 border-none mt-1 cursor-pointer"
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
              className="ml-auto flex items-center gap-2 text-white hover:bg-white/15 rounded-lg px-3 py-2 cursor-pointer border-none bg-transparent transition-colors"
              title="Cart"
            >
              <div className="relative">
                <ShoppingCart size={24} strokeWidth={1.75} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-white text-[#007AFF] text-[10px] font-black flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-bold">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-4 shadow-xl">
            <form onSubmit={handleSearchSubmit} className="relative flex items-stretch rounded-lg overflow-hidden border border-slate-200">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in AZIP Store"
                className="flex-1 h-10 pl-3 pr-2 text-sm focus:outline-none bg-slate-50"
              />
              <button
                type="submit"
                className="w-10 bg-[#007AFF] text-white flex items-center justify-center border-none cursor-pointer"
              >
                <Search size={16} />
              </button>
            </form>

            <div className="space-y-0.5 text-sm font-semibold text-slate-800">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 rounded-lg hover:bg-blue-50 text-[#007AFF]">
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
                  className="block px-2.5 py-2 text-sm text-slate-700 hover:text-[#007AFF] hover:bg-blue-50 rounded-lg"
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
              className="w-full py-2.5 bg-[#007AFF] text-white text-sm font-bold rounded-lg flex items-center justify-center gap-2 border-none cursor-pointer"
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
