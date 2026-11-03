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
  Headphones,
  MapPin,
  Heart,
  Package,
  ChevronDown,
  LayoutGrid,
  BookOpen,
  PenLine,
  Backpack,
  Palette,
  Calculator,
  Notebook,
  GraduationCap,
  Ruler,
  Grid2x2,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import {
  STORE_CATEGORIES,
  INITIAL_CATALOG_PRODUCTS,
  CatalogProduct,
} from '@/lib/catalog';
import BooklistUploadModal from '@/components/BooklistUploadModal';
import AzipLogo from '@/components/brand/AzipLogo';
import { useLanguage } from '@/lib/languageContext';

const NAV_LINKS = [
  { key: 'nav.books', label: 'School Books', href: '/products?category=school-books', icon: BookOpen },
  { key: 'nav.stationery', label: 'Stationery', href: '/products?category=writing-instruments', icon: PenLine },
  { key: 'nav.backpacks', label: 'Backpacks & Bags', href: '/products?category=school-accessories', icon: Backpack },
  { key: 'nav.art', label: 'Art Supplies', href: '/products?category=art-craft', icon: Palette },
  { key: 'nav.calculators', label: 'Calculators', href: '/products?category=mathematical-instruments', icon: Calculator },
  { key: 'nav.notebooks', label: 'Notice Books', href: '/products?category=exercise-books', icon: Notebook },
  { key: 'nav.essentials', label: 'School Essentials', href: '/products?category=school-accessories', icon: Ruler },
];

export default function Navbar() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [liveProducts, setLiveProducts] = useState<CatalogProduct[]>(INITIAL_CATALOG_PRODUCTS);
  const [searchResults, setSearchResults] = useState<CatalogProduct[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBooklistModalOpen, setIsBooklistModalOpen] = useState(false);
  const [isCatsOpen, setIsCatsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLFormElement>(null);
  const { toggleCart, getItemCount } = useCartStore();

  useEffect(() => {
    setMounted(true);

    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?limit=200');
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
    const handleScroll = () => setScrolled(window.scrollY > 8);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
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
      <header
        className={`w-full sticky top-0 z-50 font-sans bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_6px_0px_rgba(0,196,216,0.25)]' : ''
        }`}
        style={{ borderRadius: '0 !important' }}
      >
        {/* ── Top utility bar ── */}
        <div className="relative hidden sm:block overflow-hidden bg-gradient-to-r from-[#0096C7] via-[#00C4D8] to-[#0096C7] text-white text-[12px] border-b-2 border-[#007BA8]">
          <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 flex h-9 items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-medium">
              <span className="flex items-center gap-1.5 font-semibold">
                <Truck size={14} strokeWidth={2.4} /> {t('top.free_delivery')}
              </span>
              <span className="h-3.5 w-px bg-white/35" />
              <span className="flex items-center gap-1.5 opacity-90">
                <ShieldCheck size={14} strokeWidth={2.2} /> {t('top.trusted')}
              </span>
            </div>
            <div className="flex items-center gap-4 lg:gap-6 font-medium">
              {/* Sinhala / English Language Toggle */}
              <div className="flex items-center bg-black/20 rounded-none p-0.5 border border-white/20 shadow-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-0.5 rounded-none text-[11px] font-black transition-all cursor-pointer border-none ${
                    language === 'en'
                      ? 'bg-white text-[#008D9B] shadow-xs'
                      : 'text-white/80 hover:text-white bg-transparent'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('si')}
                  className={`px-2.5 py-0.5 rounded-none text-[11px] font-black transition-all cursor-pointer border-none ${
                    language === 'si'
                      ? 'bg-white text-[#008D9B] shadow-xs'
                      : 'text-white/80 hover:text-white bg-transparent'
                  }`}
                >
                  සිංහල
                </button>
              </div>

              <Link href="/checkout" className="flex items-center gap-1.5 hover:text-sky-100 transition-colors">
                <MapPin size={13} strokeWidth={2.2} /> {t('top.track_order')}
              </Link>
              <Link href="/contact" className="flex items-center gap-1.5 hover:text-sky-100 transition-colors">
                <Headphones size={13} strokeWidth={2.2} /> {t('top.help')}
              </Link>
              <Link href="/admin/login" className="flex items-center gap-1.5 hover:text-sky-100 transition-colors">
                <User size={13} strokeWidth={2.2} /> {t('top.login')}
              </Link>
            </div>
          </div>
        </div>

        {/* ── Main header ── */}
        <div className="relative z-40 bg-white border-b border-[#00C4D8]/20">
          <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-3.5">
            <div className="flex items-center justify-between gap-3 sm:gap-6 lg:gap-10">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-none cursor-pointer border-none bg-transparent"
                  aria-label="Toggle menu"
                  id="nav-menu-toggle"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <Link href="/" className="shrink-0 group" aria-label="AZIP Store — Home" id="nav-logo">
                  <AzipLogo className="h-10 sm:h-12 lg:h-[56px] w-auto transition-transform duration-300 group-hover:scale-[1.03]" />
                </Link>
              </div>

              {/* High-Tech Search Bar with High-Priority Stacking Context */}
              <form
                ref={searchRef}
                onSubmit={handleSearchSubmit}
                className="relative z-50 flex-1 max-w-[760px] hidden md:flex items-center"
                role="search"
              >
                <div className="flex w-full items-center rounded-none bg-slate-50 border-[1.5px] border-[#00C4D8]/40 focus-within:border-[#0096C7] focus-within:bg-white focus-within:shadow-[0_0_20px_rgba(0,150,199,0.22)] transition-all overflow-hidden">
                  <Search size={18} className="ml-4 text-[#0096C7] shrink-0" />
                  <input
                    id="nav-search-input"
                    type="text"
                    value={searchQuery}
                    onFocus={() => setIsSearchFocused(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('nav.search_placeholder')}
                    className="flex-1 h-12 pl-3 pr-3 text-[14px] text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent font-medium"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                  <button
                    type="submit"
                    id="nav-search-submit"
                    className="bg-gradient-to-r from-[#0096C7] to-[#0077B6] hover:from-[#00B4D8] hover:to-[#0096C7] h-12 w-14 text-white flex items-center justify-center shrink-0 cursor-pointer border-none transition-all"
                    title="Search"
                    style={{ borderRadius: '0 !important' }}
                  >
                    <Search size={20} strokeWidth={2.5} />
                  </button>
                </div>

                {isSearchFocused && searchQuery.trim() && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1.5 bg-white shadow-[0_18px_40px_rgba(4,30,66,0.22)] border-2 border-[#0096C7] overflow-hidden z-[120]"
                    style={{ borderRadius: '0 !important' }}
                  >
                    <div className="px-3.5 py-2 bg-[#F0F9FF] border-b border-sky-200 flex items-center justify-between text-[11px] font-extrabold text-[#0077B6] uppercase tracking-wider">
                      <span>Matching Products ({searchResults.length})</span>
                      <span>Press Enter for all results</span>
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto bg-white">
                        {searchResults.map((product) => (
                          <Link
                            key={product._id}
                            href={`/products/${product.slug}`}
                            onClick={() => setIsSearchFocused(false)}
                            className="flex items-center gap-3.5 px-3.5 py-2.5 bg-white hover:bg-[#EBF8FF] transition-colors"
                          >
                            <img
                              src={product.images[0]?.url || '/images/hd/products/atlas-exercise-book.jpg'}
                              alt={product.name}
                              className="w-12 h-12 object-contain p-1 rounded-none bg-white border border-slate-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-slate-900 truncate">{product.name}</div>
                              <div className="text-[11px] text-slate-500 font-semibold">{product.brand || 'AZIP Genuine'}</div>
                            </div>
                            <div className="text-sm font-black text-[#0077B6] shrink-0">
                              Rs. {product.price.toLocaleString()}
                            </div>
                          </Link>
                        ))}
                        <div className="p-2 bg-slate-50">
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-[#0077B6] hover:bg-[#0052D4] text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border-none transition-colors"
                          >
                            View All Search Results
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-center text-sm text-slate-500 bg-white">
                        No matching products for &ldquo;
                        <span className="font-bold text-slate-800">{searchQuery}</span>&rdquo;
                      </div>
                    )}
                  </div>
                )}
              </form>

              {/* Wishlist, Orders & Clean Executive Cart Button */}
              <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4">
                {/* Mobile Language Toggle */}
                <div className="sm:hidden flex items-center bg-slate-100 rounded-none p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
                    className="px-2 py-0.5 rounded-none text-[10px] font-black bg-[#0096C7] text-white"
                  >
                    {language.toUpperCase()}
                  </button>
                </div>

                <Link
                  href="/products"
                  id="nav-wishlist"
                  className="hidden lg:flex items-center gap-2 px-2 py-1.5 text-slate-700 hover:text-[#0096C7] transition-colors"
                >
                  <Heart size={20} strokeWidth={1.9} />
                  <span className="text-[13px] font-semibold">{t('nav.wishlist')}</span>
                </Link>
                <Link
                  href="/checkout"
                  id="nav-orders"
                  className="hidden lg:flex items-center gap-2 px-2 py-1.5 text-slate-700 hover:text-[#0096C7] transition-colors"
                >
                  <Package size={20} strokeWidth={1.9} />
                  <span className="text-[13px] font-semibold">{t('nav.orders')}</span>
                </Link>
                <button
                  type="button"
                  id="nav-cart"
                  onClick={toggleCart}
                  className="group flex items-center gap-2.5 px-3.5 py-2 cursor-pointer border-2 border-[#0077B6] bg-[#041E42] hover:bg-[#0038A8] text-white transition-all shadow-[3px_3px_0px_rgba(0,150,199,0.3)]"
                  title="Open Shopping Cart"
                  style={{ borderRadius: '0 !important' }}
                >
                  <ShoppingCart size={19} className="text-[#00E5FF] shrink-0" strokeWidth={2.3} />
                  <span className="hidden sm:inline text-[13px] font-extrabold tracking-wide text-white font-['Outfit']">
                    {t('nav.cart')}
                  </span>
                  <span
                    className={`min-w-[22px] h-[22px] px-1.5 text-[11px] font-black flex items-center justify-center transition-colors ${
                      cartCount > 0
                        ? 'bg-[#00E5FF] text-[#041E42]'
                        : 'bg-white/15 text-white'
                    }`}
                    style={{ borderRadius: '0 !important' }}
                  >
                    {cartCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile search */}
            <div className="mt-2.5 md:hidden">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex w-full items-center rounded-none bg-white border-[1.5px] border-[#CFE2FF] focus-within:border-[#0A6CFF] overflow-hidden transition-all"
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
                  className="az-btn-gradient h-10 w-11 text-white flex items-center justify-center shrink-0 border-none cursor-pointer"
                  title="Search"
                >
                  <Search size={16} strokeWidth={2.4} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ── Category navigation row — Sharp Edge-to-Edge ── */}
        <nav className="relative z-20 hidden lg:block bg-[#F0FDFA] border-y-2 border-[#C7F0F5]" aria-label="Product categories">
          <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center text-[13px] font-semibold text-slate-700">
              <div
                className="relative"
                onMouseEnter={() => setIsCatsOpen(true)}
                onMouseLeave={() => setIsCatsOpen(false)}
              >
                <button
                  type="button"
                  id="nav-all-categories"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 my-2 text-[#0A1B2A] font-black bg-[#00C4D8] text-white border-2 border-[#0096C7] cursor-pointer hover:bg-[#0096C7] transition-all shadow-[3px_3px_0px_rgba(0,110,138,0.35)]"
                  style={{ borderRadius: '0 !important' }}
                >
                  <span className="flex items-center justify-center">
                    <LayoutGrid size={15} />
                  </span>
                  {t('nav.all_categories')}
                  <ChevronDown size={14} className={`transition-transform ${isCatsOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCatsOpen && (
                  <div className="absolute left-0 top-full z-50 w-[580px] bg-white shadow-[6px_6px_0px_rgba(0,196,216,0.25)] border-2 border-[#00C4D8]/50 p-3 grid grid-cols-2 gap-0.5 animate-fade-in" style={{ borderRadius: '0 !important' }}>
                    {STORE_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className="px-3 py-2.5 text-[13px] text-slate-700 hover:bg-[#E0F9FC] hover:text-[#0096C7] font-semibold transition-colors border-b border-[#E0F9FC] last:border-0"
                        style={{ borderRadius: '0 !important' }}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <span className="h-5 w-px bg-[#C7F0F5] mx-3" />
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="group relative flex items-center gap-2 px-3 xl:px-4 py-3 whitespace-nowrap hover:text-[#0096C7] font-bold text-slate-700 hover:bg-[#E0F9FC] transition-colors"
                  >
                    <Icon size={15} strokeWidth={2} className="text-[#00C4D8] group-hover:scale-110 transition-transform" />
                    {t(item.key)}
                    <span className="absolute left-0 right-0 bottom-0 h-[3px] bg-[#00C4D8] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  </Link>
                );
              })}
              <Link
                href="/products"
                className="group relative flex items-center gap-2 px-3 xl:px-4 py-3 hover:text-[#0096C7] font-bold text-slate-700 hover:bg-[#E0F9FC] transition-colors ml-auto"
              >
                <Grid2x2 size={15} strokeWidth={2} className="text-[#FBBF24]" />
                {language === 'si' ? 'තවත්' : 'All Catalog'}
              </Link>
            </div>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b-2 border-[#C7F0F5] p-4 space-y-3 shadow-[0_6px_0px_rgba(0,196,216,0.15)]">
            <div className="space-y-0.5 text-sm font-semibold text-slate-800">
              {[['/', '🏠 Home'], ['/products', '🛍️ Shop'], ['/offers', '🔥 Offers'], ['/about', 'ℹ️ About Us'], ['/contact', '📞 Contact']].map(([href, label]) => (
                <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)} className="block p-2.5 hover:bg-[#E0F9FC] hover:text-[#0096C7] border-l-4 border-transparent hover:border-[#00C4D8] transition-all" style={{ borderRadius: '0 !important' }}>
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t-2 border-[#C7F0F5] pt-3 grid grid-cols-2 gap-1.5">
              {NAV_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-slate-700 hover:text-[#0096C7] hover:bg-[#E0F9FC] border border-[#C7F0F5] hover:border-[#00C4D8] transition-all"
                    style={{ borderRadius: '0 !important' }}
                  >
                    <Icon size={15} className="text-[#00C4D8]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBooklistModalOpen(true);
              }}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 border-none cursor-pointer"
              style={{ borderRadius: '0 !important' }}
            >
              <Upload size={14} /> 📂 Upload School Booklist
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
