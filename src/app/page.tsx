'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Palette,
  PenLine,
  Backpack,
  Notebook,
  GraduationCap,
  Grid2x2,
  Truck,
  BadgeCheck,
  CreditCard,
  RotateCcw,
  MessageCircle,
  ChevronRight,
  Flame,
  Sparkles,
  Search,
  SlidersHorizontal,
  Upload,
  CheckCircle2,
  ShoppingCart,
  FolderOpen,
  FlaskConical,
  Gift,
  Cpu,
  Baby,
  Star,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import HomeProductCard, { type HomeProduct } from '@/components/home/HomeProductCard';
import HeroBannerSlider from '@/components/home/HeroBannerSlider';
import BooklistUploadModal from '@/components/BooklistUploadModal';
import {
  INITIAL_CATALOG_PRODUCTS,
  BACK_TO_SCHOOL_BUNDLES,
  type CatalogProduct,
  type SchoolBundleKit,
} from '@/lib/catalog';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/lib/languageContext';

// ─── 12 CURATED FLASH SALE DEALS (DIRECTLY LINKED TO CATALOG SLUGS) ───
const FLASH_DEAL_IDS = [
  'prod-ex-01',
  'prod-wr-04',
  'prod-mt-04',
  'prod-ac-02',
  'prod-sa-01',
  'prod-mt-01',
  'prod-wr-05',
  'prod-sb-01',
  'prod-sa-02',
  'prod-sa-03',
  'prod-of-01',
  'prod-ac-03',
];

const FLASH_DEALS: HomeProduct[] = FLASH_DEAL_IDS.map((id, idx) => {
  const found =
    INITIAL_CATALOG_PRODUCTS.find((p) => p._id === id) ||
    INITIAL_CATALOG_PRODUCTS[idx % INITIAL_CATALOG_PRODUCTS.length];
  return {
    id: found._id,
    name: found.name,
    slug: found.slug,
    price: found.price,
    compareAtPrice: found.compareAtPrice || Math.round(found.price * 1.2),
    rating: found.rating || 4.9,
    reviewsCount: found.reviewsCount || 85,
    stock: (idx % 7) + 4,
    brand: found.brand || 'Atlas',
    category: found.category,
    badge: found.badge || 'Flash Deal',
    image: found.images?.[0]?.url || '/images/hd/products/atlas-exercise-book.jpg',
  };
});

// ─── VISUAL DEPARTMENT CARDS (TOP BAR) ────────────────────────
const VISUAL_DEPARTMENTS = [
  {
    slug: 'school-books',
    title: 'School Books',
    subtitle: 'Grade 1 to A/L',
    image: '/images/hd/categories/school-books.jpg',
    accent: 'from-sky-500/10 to-blue-500/5 border-sky-200',
  },
  {
    slug: 'exercise-books',
    title: 'CR & Exercise Books',
    subtitle: 'Atlas & Oxford',
    image: '/images/hd/products/atlas-exercise-book.jpg',
    accent: 'from-amber-500/10 to-orange-500/5 border-amber-200',
  },
  {
    slug: 'writing-instruments',
    title: 'Pens & Writing',
    subtitle: 'Pilot, Stabilo, Atlas',
    image: '/images/hd/products/pilot-g2-pens.jpg',
    accent: 'from-cyan-500/10 to-teal-500/5 border-cyan-200',
  },
  {
    slug: 'mathematical-instruments',
    title: 'Calculators & Math',
    subtitle: 'Casio & Helix Sets',
    image: '/images/hd/products/casio-fx991cw.jpg',
    accent: 'from-indigo-500/10 to-blue-500/5 border-indigo-200',
  },
  {
    slug: 'art-craft',
    title: 'Art & Craft',
    subtitle: 'Faber-Castell & Paints',
    image: '/images/hd/products/faber-castell-water-color.jpg',
    accent: 'from-rose-500/10 to-pink-500/5 border-rose-200',
  },
  {
    slug: 'school-accessories',
    title: 'Backpacks & Gear',
    subtitle: 'Bags, Bottles, Lunch',
    image: '/images/hd/products/school-backpack-blue.jpg',
    accent: 'from-emerald-500/10 to-teal-500/5 border-emerald-200',
  },
  {
    slug: 'office-supplies',
    title: 'Office & Files',
    subtitle: 'A4 Paper & Binders',
    image: '/images/hd/products/sticky-notes.jpg',
    accent: 'from-violet-500/10 to-purple-500/5 border-violet-200',
  },
  {
    slug: 'science-laboratory',
    title: 'Science & Lab',
    subtitle: 'Models & Globes',
    image: '/products/globe.jpg',
    accent: 'from-teal-500/10 to-cyan-500/5 border-teal-200',
  },
];

// ─── INTERACTIVE CATEGORY FILTER BAR TABS ─────────────────────
const CATEGORY_BAR_TABS = [
  { slug: 'all', label: 'All Products', icon: Grid2x2 },
  { slug: 'books', label: 'General Books', icon: BookOpen },
  { slug: 'school-books', label: 'School Books', icon: GraduationCap },
  { slug: 'exercise-books', label: 'Exercise Books', icon: Notebook },
  { slug: 'writing-instruments', label: 'Writing Instruments', icon: PenLine },
  { slug: 'mathematical-instruments', label: 'Mathematical Instruments', icon: Calculator },
  { slug: 'art-craft', label: 'Art & Craft', icon: Palette },
  { slug: 'office-supplies', label: 'Office Supplies', icon: FolderOpen },
  { slug: 'school-accessories', label: 'School Accessories', icon: Backpack },
  { slug: 'files-organization', label: 'Files & Organization', icon: FolderOpen },
  { slug: 'educational-materials', label: 'Educational Materials', icon: Sparkles },
  { slug: 'preschool-kids', label: 'Preschool & Kids', icon: Baby },
  { slug: 'science-laboratory', label: 'Science & Laboratory', icon: FlaskConical },
  { slug: 'gifts-accessories', label: 'Gifts & Accessories', icon: Gift },
  { slug: 'electronics', label: 'Electronics', icon: Cpu },
];

// Guaranteed local HD image enhancement for categories so every card looks studio-grade
const LOCAL_CATEGORY_HD_POOL: Record<string, string[]> = {
  books: [
    '/images/hd/products/sl-dictionary-novels.jpg',
    '/images/cat_books_4k.jpg',
  ],
  'school-books': [
    '/images/hd/products/sl-textbooks-stack.jpg',
    '/images/hd/products/sl-scholarship-workbooks.jpg',
  ],
  'exercise-books': [
    '/images/hd/products/atlas-exercise-book.jpg',
    '/images/v2/cr-notebooks.jpg',
    '/images/v2/exercise-books-stack.jpg',
  ],
  'writing-instruments': [
    '/images/hd/products/sl-writing-pens-pencils.jpg',
    '/images/hd/products/pilot-g2-pens.jpg',
    '/images/hd/products/highlighters-set.jpg',
  ],
  'mathematical-instruments': [
    '/images/hd/products/geometry-set.jpg',
    '/images/hd/products/casio-fx991cw.jpg',
  ],
  'art-craft': [
    '/images/hd/products/sl-art-pencils-paints.jpg',
    '/images/hd/products/faber-castell-water-color.jpg',
    '/images/hd/products/drawing-kit.jpg',
  ],
  'office-supplies': [
    '/images/hd/products/sl-office-paper-stapler.jpg',
    '/images/hd/products/sticky-notes.jpg',
    '/images/hd/products/sl-button-folders-organizer.jpg',
  ],
  'school-accessories': [
    '/images/hd/products/school-backpack-blue.jpg',
    '/images/hd/products/water-bottle.jpg',
    '/images/hd/products/lunch-box.jpg',
    '/images/hd/products/school-shoes.jpg',
  ],
  'files-organization': [
    '/images/hd/products/sl-files-binders.jpg',
    '/images/hd/products/sl-button-folders-organizer.jpg',
  ],
  'educational-materials': [
    '/products/globe.jpg',
    '/images/hd/products/sl-scholarship-workbooks.jpg',
  ],
  'preschool-kids': [
    '/images/hd/products/sl-preschool-crayons-clay.jpg',
    '/images/hd/products/sl-scholarship-workbooks.jpg',
  ],
  'science-laboratory': ['/products/microscope.jpg', '/products/globe.jpg'],
  'gifts-accessories': [
    '/images/hd/products/sl-executive-gift-pen.jpg',
    '/images/cat_gifts_4k.jpg',
  ],
  electronics: [
    '/images/hd/products/sl-electronics-study.jpg',
    '/images/hd/products/casio-fx991cw.jpg',
  ],
};

const WA_URL = `https://wa.me/94112345678?text=${encodeURIComponent(
  'Hello AZIP! I need help with an order.'
)}`;

const SECTION = 'w-full max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-8';

export default function HomePage() {
  const { t } = useLanguage();
  const addItem = useCartStore((s) => s.addItem);
  const catalogSectionRef = useRef<HTMLElement>(null);

  // Live catalog products fetched from /api/products (syncs with Admin Panel!)
  const [catalogProducts, setCatalogProducts] = useState<CatalogProduct[]>(
    INITIAL_CATALOG_PRODUCTS
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quickFilter, setQuickFilter] = useState<'all' | 'sale' | 'top' | 'under1000'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'discount'>(
    'popular'
  );
  const [searchInCat, setSearchInCat] = useState('');
  const [visibleCount, setVisibleCount] = useState(18);
  const [isBooklistOpen, setIsBooklistOpen] = useState(false);
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);

  // Live countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch live products from API so Admin Panel changes reflect immediately on Homepage
  useEffect(() => {
    let active = true;
    async function loadLiveCatalog() {
      try {
        const res = await fetch('/api/products?limit=200', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data.products) && data.products.length > 0) {
            setCatalogProducts(data.products);
          }
        }
      } catch {
        // Fallback to INITIAL_CATALOG_PRODUCTS
      }
    }
    loadLiveCatalog();
    return () => {
      active = false;
    };
  }, []);

  // Category counts for the Category Bar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: catalogProducts.length };
    for (const p of catalogProducts) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [catalogProducts]);

  // Convert CatalogProduct to HomeProduct with clean image resolution
  const mappedProducts: HomeProduct[] = useMemo(() => {
    return catalogProducts.map((p, idx) => {
      const rawUrl = p.images?.[0]?.url || '';
      const pool = LOCAL_CATEGORY_HD_POOL[p.category];
      // If product has a local image or custom uploaded image, keep it; otherwise assign from crisp HD pool or rawUrl
      const finalImg =
        rawUrl.startsWith('/') || rawUrl.startsWith('data:')
          ? rawUrl
          : rawUrl || (pool ? pool[idx % pool.length] : '/images/hd/products/atlas-exercise-book.jpg');

      return {
        id: p._id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        rating: p.rating || 4.8,
        reviewsCount: p.reviewsCount || 42,
        stock: p.stock,
        brand: p.brand,
        category: p.category,
        badge: p.badge,
        image: finalImg,
      };
    });
  }, [catalogProducts]);

  // Filtered & Sorted Products for the Interactive Category Bar section
  const filteredProducts = useMemo(() => {
    let list = mappedProducts;

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchInCat.trim()) {
      const q = searchInCat.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    if (quickFilter === 'sale') {
      list = list.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    } else if (quickFilter === 'top') {
      list = list.filter((p) => p.rating >= 4.9);
    } else if (quickFilter === 'under1000') {
      list = list.filter((p) => p.price <= 1000);
    }

    const sorted = [...list];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      sorted.sort((a, b) => {
        const discA =
          a.compareAtPrice && a.compareAtPrice > a.price
            ? (a.compareAtPrice - a.price) / a.compareAtPrice
            : 0;
        const discB =
          b.compareAtPrice && b.compareAtPrice > b.price
            ? (b.compareAtPrice - b.price) / b.compareAtPrice
            : 0;
        return discB - discA;
      });
    } else {
      sorted.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return sorted;
  }, [mappedProducts, selectedCategory, searchInCat, quickFilter, sortBy]);

  const handleSelectDepartment = (slug: string) => {
    setSelectedCategory(slug);
    setVisibleCount(18);
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddBundle = (bundle: SchoolBundleKit) => {
    addItem({
      id: bundle.id,
      name: bundle.name,
      price: bundle.price,
      image: bundle.image,
      stock: 25,
    });
    setAddedBundleId(bundle.id);
    setTimeout(() => setAddedBundleId(null), 1600);
  };

  const trust = [
    { icon: BadgeCheck, title: t('trust.genuine'), sub: '100% Authorized Brands' },
    { icon: Truck, title: t('trust.delivery'), sub: 'Islandwide Doorstep Delivery' },
    { icon: CreditCard, title: t('trust.secure'), sub: 'Cash on Delivery & Card' },
    { icon: RotateCcw, title: t('trust.returns'), sub: '7-Day Easy Replacement' },
  ];

  return (
    <StoreShell>
      <div className="w-full min-h-screen bg-[#F4F6F9] pb-24 md:pb-14">
        {/* ── 1. HERO CAMPAIGN BANNER SLIDER (Controlled from Admin Panel) ── */}
        <section className={`${SECTION} pt-4`}>
          <HeroBannerSlider waUrl={WA_URL} />
        </section>

        {/* ── 2. VISUAL SHOP-BY-DEPARTMENT BAR ── */}
        <section className={`${SECTION} mt-6`}>
          <div className="bg-white rounded-none border border-slate-200/90 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-6 rounded-none bg-[#0096C7]" />
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Shop by Department
                </h2>
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-400">
                  • Click any category to filter products below
                </span>
              </div>
              <Link
                href="/products"
                className="text-xs sm:text-sm font-bold text-[#0096C7] hover:text-[#00C4D8] flex items-center gap-0.5"
              >
                All 14 Categories <ChevronRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
              {VISUAL_DEPARTMENTS.map((dept) => {
                const isSelected = selectedCategory === dept.slug;
                return (
                  <button
                    key={dept.slug}
                    type="button"
                    onClick={() => handleSelectDepartment(dept.slug)}
                    className={`group text-left rounded-none p-2.5 border transition-all cursor-pointer flex flex-col items-center text-center bg-gradient-to-b ${
                      dept.accent
                    } ${
                      isSelected
                        ? 'ring-2 ring-[#0096C7] border-[#0096C7] shadow-sm scale-[1.02]'
                        : 'hover:border-[#00C4D8] hover:shadow-sm hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none bg-white p-2 shadow-xs border border-slate-100 flex items-center justify-center mb-2 overflow-hidden">
                      <img
                        src={dept.image}
                        alt={dept.title}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="text-xs font-extrabold text-slate-800 group-hover:text-[#0096C7] leading-tight line-clamp-1">
                      {dept.title}
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 mt-0.5 line-clamp-1">
                      {dept.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 3. FLASH SALE / DAILY SUPER DEALS (WITH LIVE COUNTDOWN) ── */}
        <section className={`${SECTION} mt-7`}>
          <div className="bg-white rounded-none border border-slate-200/90 overflow-hidden shadow-xs">
            {/* Blue-Cyan Flash Sale Header Bar */}
            <div
              className="px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-sky-200/70"
              style={{
                background: 'linear-gradient(90deg, #EBF5FF 0%, #E0F2FE 50%, #ECFEFF 100%)',
              }}
            >
              <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-none bg-gradient-to-br from-[#0038A8] to-[#0096C7] text-white flex items-center justify-center shadow-xs">
                    <Flame size={18} className="fill-white" />
                  </span>
                  <div>
                    <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight uppercase">
                      {t('flash.title')}
                    </h2>
                  </div>
                </div>

                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0052D4] bg-sky-100/90 border border-sky-300 px-2.5 py-1 rounded-none">
                  <Sparkles size={12} /> ON SALE NOW
                </span>

                {/* Live Countdown Clock */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                  <Clock size={14} className="text-[#0077B6]" />
                  <span className="hidden md:inline">Ending in:</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-[#041E42] text-white font-black text-xs px-2 py-1 rounded-none min-w-[28px] text-center">
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </span>
                    <span className="text-slate-900 font-black">:</span>
                    <span className="bg-[#041E42] text-white font-black text-xs px-2 py-1 rounded-none min-w-[28px] text-center">
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </span>
                    <span className="text-slate-900 font-black">:</span>
                    <span className="bg-[#0077B6] text-white font-black text-xs px-2 py-1 rounded-none min-w-[28px] text-center">
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/offers"
                className="px-4 py-1.5 rounded-none border-2 border-[#0077B6] text-[#0077B6] hover:bg-[#0077B6] hover:text-white text-xs sm:text-sm font-extrabold transition-colors flex items-center gap-1"
              >
                SHOP ALL DEALS <ChevronRight size={15} />
              </Link>
            </div>

            {/* 12 Flash Sale Products Grid */}
            <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
              {FLASH_DEALS.map((p) => (
                <HomeProductCard key={p.id} product={p} isFlashDeal />
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. MID-PAGE DUAL PROMOTIONAL CAMPAIGN BANNERS ── */}
        <section className={`${SECTION} mt-7`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Promo Banner: Back-to-School Complete Grade Packs */}
            <div
              className="relative rounded-none overflow-hidden p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-5"
              style={{
                background: 'linear-gradient(135deg, #002888 0%, #0057FF 52%, #00B4D8 100%)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage:
                    'repeating-conic-gradient(from 0deg at 75% 50%, rgba(255,255,255,0.22) 0deg 8deg, transparent 8deg 18deg)',
                }}
              />
              <div className="relative z-10 flex-1 space-y-2 text-center sm:text-left">
                <span className="inline-block bg-amber-300 text-slate-950 text-[11px] font-black uppercase px-3 py-1 rounded-none shadow-xs">
                  GRADE 1 TO A/L SYLLABUS
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-black uppercase leading-tight tracking-tight"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  BACK TO SCHOOL MASTER PACKS
                </h3>
                <p className="text-xs sm:text-sm text-sky-100 font-medium max-w-md">
                  Complete CR Book sets, Geometry boxes & Pilot pens bundled with up to 40% student discount.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSelectDepartment('exercise-books')}
                    className="px-5 py-2 rounded-none bg-white text-[#002888] font-extrabold text-xs uppercase shadow-md hover:scale-105 transition-transform cursor-pointer border-none"
                  >
                    Explore Notebooks
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBooklistOpen(true)}
                    className="px-4 py-2 rounded-none bg-amber-400 text-slate-950 font-extrabold text-xs uppercase shadow-md hover:bg-amber-300 transition-colors cursor-pointer border-none flex items-center gap-1.5"
                  >
                    <Upload size={13} /> Upload Booklist
                  </button>
                </div>
              </div>

              {/* Floating Product Duo */}
              <div className="relative z-10 flex items-center gap-2 shrink-0">
                <div className="w-24 h-28 sm:w-28 sm:h-32 bg-white rounded-none p-2 shadow-xl flex items-center justify-center">
                  <img
                    src="/images/hd/products/atlas-exercise-book.jpg"
                    alt="Atlas Exercise Book"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="w-28 h-32 sm:w-32 sm:h-36 bg-white rounded-none p-2.5 shadow-2xl flex items-center justify-center">
                  <img
                    src="/images/hd/products/school-backpack-blue.jpg"
                    alt="School Backpack"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right Promo Banner: Genuine Brand Mall Fiesta */}
            <div
              className="relative rounded-none overflow-hidden p-5 sm:p-7 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-5"
              style={{
                background: 'linear-gradient(135deg, #041E42 0%, #006699 48%, #00C4D8 100%)',
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage:
                    'repeating-conic-gradient(from 0deg at 75% 50%, rgba(165,243,252,0.28) 0deg 8deg, transparent 8deg 18deg)',
                }}
              />
              <div className="relative z-10 flex-1 space-y-2 text-center sm:text-left">
                <span className="inline-block bg-[#00E5FF] text-[#041E42] text-[11px] font-black uppercase px-3 py-1 rounded-none shadow-xs">
                  100% OFFICIAL WARRANTY
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-black uppercase leading-tight tracking-tight"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  ART & CALCULATOR BRAND MALL
                </h3>
                <p className="text-xs sm:text-sm text-cyan-100 font-medium max-w-md">
                  Original Casio ClassWiz FX-991CW, Faber-Castell Studio Art Kits & Stabilo Pastel Highlighters.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSelectDepartment('mathematical-instruments')}
                    className="px-5 py-2 rounded-none bg-white text-[#041E42] font-extrabold text-xs uppercase shadow-md hover:scale-105 transition-transform cursor-pointer border-none"
                  >
                    Shop Calculators
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDepartment('art-craft')}
                    className="px-4 py-2 rounded-none bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs uppercase border border-white/40 transition-colors cursor-pointer"
                  >
                    Art & Craft Deals
                  </button>
                </div>
              </div>

              {/* Floating Product Duo */}
              <div className="relative z-10 flex items-center gap-2 shrink-0">
                <div className="w-24 h-28 sm:w-28 sm:h-32 bg-white rounded-none p-2 shadow-xl flex items-center justify-center">
                  <img
                    src="/images/hd/products/faber-castell-water-color.jpg"
                    alt="Faber-Castell Watercolors"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="w-28 h-32 sm:w-32 sm:h-36 bg-white rounded-none p-2.5 shadow-2xl flex items-center justify-center">
                  <img
                    src="/images/hd/products/casio-fx991cw.jpg"
                    alt="Casio FX-991CW"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. DEDICATED INTERACTIVE CATEGORY SELECTION BAR & LIVE PRODUCT CATALOG ── */}
        <section ref={catalogSectionRef} className={`${SECTION} mt-8 scroll-mt-24`}>
          <div className="bg-white rounded-none border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Section Title Header */}
            <div className="px-4 sm:px-6 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded-none bg-gradient-to-b from-[#00C4D8] to-[#0096C7]" />
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                    Browse Products by Category
                  </h2>
                  <span className="bg-sky-50 text-[#0096C7] border border-sky-200 text-xs font-extrabold px-2.5 py-0.5 rounded-none">
                    {filteredProducts.length} Items
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Select any category tab below to filter books, stationery, calculators & school supplies
                </p>
              </div>

              {/* Search within Category */}
              <div className="relative w-full sm:w-72">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchInCat}
                  onChange={(e) => {
                    setSearchInCat(e.target.value);
                    setVisibleCount(18);
                  }}
                  placeholder="Quick search in catalog..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-none bg-slate-50 border border-slate-200 focus:border-[#0096C7] focus:bg-white focus:outline-none font-medium text-slate-800"
                />
              </div>
            </div>

            {/* ── DEDICATED CATEGORY SELECTION BAR (Sticky/Scrollable Pills) ── */}
            <div className="bg-slate-50/90 border-b border-slate-200 px-3 sm:px-6 py-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORY_BAR_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const count = categoryCounts[tab.slug] || 0;
                  const active = selectedCategory === tab.slug;
                  return (
                    <button
                      key={tab.slug}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(tab.slug);
                        setVisibleCount(18);
                      }}
                      className={`group flex items-center gap-2 px-3.5 py-2.5 rounded-none text-xs sm:text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                        active
                          ? 'bg-gradient-to-r from-[#0096C7] to-[#00C4D8] text-white border-[#0096C7] shadow-sm scale-[1.02]'
                          : 'bg-white text-slate-700 border-slate-200/90 hover:border-[#00C4D8] hover:text-[#0096C7]'
                      }`}
                    >
                      <Icon
                        size={15}
                        className={
                          active ? 'text-white' : 'text-[#0096C7] group-hover:scale-110 transition-transform'
                        }
                      />
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-none ${
                          active
                            ? 'bg-white/25 text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-[#0096C7]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Filter & Sort Toolbar */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
                {/* Quick Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                    <SlidersHorizontal size={12} /> Filter:
                  </span>
                  {[
                    { id: 'all', label: 'All Items' },
                    { id: 'sale', label: '🔥 Discounted Deals' },
                    { id: 'top', label: '⭐ 4.9+ Top Rated' },
                    { id: 'under1000', label: '💰 Under Rs. 1,000' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setQuickFilter(f.id as typeof quickFilter);
                        setVisibleCount(18);
                      }}
                      className={`px-3 py-1 rounded-none text-xs font-bold transition-colors cursor-pointer border ${
                        quickFilter === f.id
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-white border border-slate-200 rounded-none px-2.5 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0096C7]"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="discount">Biggest Discount %</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── LIVE PRODUCT GRID ── */}
            <div className="p-4 sm:p-6">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                    {filteredProducts.slice(0, visibleCount).map((product) => (
                      <HomeProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Load More / View All Footer */}
                  <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs sm:text-sm font-medium text-slate-500">
                      Showing{' '}
                      <span className="font-bold text-slate-900">
                        {Math.min(visibleCount, filteredProducts.length)}
                      </span>{' '}
                      of <span className="font-bold text-slate-900">{filteredProducts.length}</span>{' '}
                      products in{' '}
                      <span className="font-bold text-[#0096C7]">
                        {CATEGORY_BAR_TABS.find((c) => c.slug === selectedCategory)?.label ||
                          'All Categories'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {visibleCount < filteredProducts.length && (
                        <button
                          type="button"
                          onClick={() => setVisibleCount((prev) => prev + 18)}
                          className="px-6 py-2.5 rounded-none bg-gradient-to-r from-[#0096C7] to-[#00C4D8] hover:from-[#007EA7] hover:to-[#0096C7] text-white text-xs sm:text-sm font-extrabold shadow-sm cursor-pointer border-none transition-all"
                        >
                          Load More Products (+{Math.min(18, filteredProducts.length - visibleCount)})
                        </button>
                      )}
                      <Link
                        href={
                          selectedCategory === 'all'
                            ? '/products'
                            : `/products?category=${selectedCategory}`
                        }
                        className="px-5 py-2.5 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors"
                      >
                        Open Full Filter Page <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <p className="text-base font-bold text-slate-700">
                    No matching products found in this filter.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setQuickFilter('all');
                      setSearchInCat('');
                    }}
                    className="px-4 py-2 rounded-none bg-[#0096C7] text-white text-xs font-bold cursor-pointer border-none"
                  >
                    Reset Category Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── 6. CURATED BACK-TO-SCHOOL MASTER BUNDLES ── */}
        <section className={`${SECTION} mt-8`}>
          <div className="bg-white rounded-none border border-slate-200/90 p-4 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded-none bg-amber-500" />
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    All-in-One School Grade Bundles
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Ready-made student value packs with extra bundle savings — add the entire pack in one click
                </p>
              </div>
              <Link
                href="/offers"
                className="text-xs sm:text-sm font-bold text-[#0096C7] hover:text-[#00C4D8] flex items-center gap-0.5"
              >
                View All Bundles <ChevronRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {BACK_TO_SCHOOL_BUNDLES.map((bundle, idx) => {
                const bundleImages = [
                  '/images/hd/products/atlas-exercise-book.jpg',
                  '/images/hd/products/casio-fx991cw.jpg',
                  '/images/hd/products/faber-castell-water-color.jpg',
                ];
                const isAdded = addedBundleId === bundle.id;
                return (
                  <div
                    key={bundle.id}
                    className="rounded-none border border-slate-200 hover:border-[#00C4D8] bg-gradient-to-b from-slate-50/70 to-white p-4 sm:p-5 flex flex-col justify-between transition-all hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-none">
                          {bundle.gradeBadge}
                        </span>
                        <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-none">
                          SAVE {bundle.savingsPercentage}%
                        </span>
                      </div>

                      <div className="flex items-center gap-3.5 mb-3">
                        <div className="w-20 h-20 rounded-none bg-white border border-slate-200 p-2 shrink-0 flex items-center justify-center">
                          <img
                            src={bundleImages[idx % bundleImages.length]}
                            alt={bundle.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                            {bundle.name}
                          </h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-lg font-black text-[#E11D48]">
                              Rs. {bundle.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-400 line-through font-medium">
                              Rs. {bundle.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <ul className="space-y-1.5 border-t border-slate-100 pt-3 mb-4">
                        {bundle.itemsIncluded.slice(0, 4).map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs text-slate-600 font-medium"
                          >
                            <CheckCircle2
                              size={14}
                              className="text-emerald-600 shrink-0 mt-0.5"
                            />
                            <span className="line-clamp-1">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddBundle(bundle)}
                      className={`w-full py-2.5 rounded-none font-extrabold text-xs uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer border-none ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-900 hover:bg-[#0096C7] text-white'
                      }`}
                    >
                      <ShoppingCart size={15} />
                      {isAdded ? 'Bundle Added to Cart!' : 'Add Full Bundle to Cart'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 7. SCHOOL BOOKLIST CONCIERGE BANNER ── */}
        <section className={`${SECTION} mt-8`}>
          <div
            className="rounded-none p-5 sm:p-8 text-white shadow-md flex flex-col lg:flex-row items-center justify-between gap-6"
            style={{
              background: 'linear-gradient(120deg, #0F172A 0%, #0E7490 60%, #00B4D8 100%)',
            }}
          >
            <div className="space-y-2 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-cyan-400/20 border border-cyan-300/40 text-cyan-200 text-xs font-extrabold px-3 py-1 rounded-none">
                <ShieldCheck size={14} /> HASSLE-FREE PARENT CONCIERGE
              </div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight">
                Have a School Booklist? Send Us a Photo!
              </h2>
              <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
                Don&apos;t waste hours searching item by item. Upload a photo or PDF of your school&apos;s booklist and our team will pack every genuine book, CR notebook & stationery item and deliver straight to your home.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsBooklistOpen(true)}
                className="px-6 py-3 rounded-none bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer border-none transition-transform hover:scale-105"
              >
                <Upload size={16} /> Upload Booklist Now
              </button>
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-none bg-[#25D366] hover:bg-[#1EBE57] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <MessageCircle size={16} /> Send via WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── 8. TRUST STRIP ── */}
        <section className={`${SECTION} mt-8`}>
          <div className="bg-white rounded-none border border-slate-200 grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100 shadow-xs overflow-hidden">
            {trust.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5">
                <div className="w-10 h-10 rounded-none bg-sky-50 text-[#0096C7] flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-800">{title}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FLOATING WHATSAPP ── */}
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="fixed bottom-20 md:bottom-6 right-4 z-50 w-12 h-12 rounded-none flex items-center justify-center bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg transition-transform hover:scale-105"
        >
          <MessageCircle size={22} />
        </a>

        <BooklistUploadModal
          isOpen={isBooklistOpen}
          onClose={() => setIsBooklistOpen(false)}
        />
      </div>
    </StoreShell>
  );
}
