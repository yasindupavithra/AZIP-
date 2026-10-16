'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Package,
  ShieldCheck,
  Truck,
  ArrowRight,
  Heart,
  Star,
  ShoppingCart,
  Check,
  Headphones,
  GraduationCap,
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  Upload,
  Sparkles,
  Percent,
  BookOpen,
  PenTool,
  Calculator,
  Palette,
  Backpack,
  Briefcase,
  Gift,
  Cpu,
  Smile,
  FolderArchive,
  FlaskConical,
  Book,
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import { useCartStore } from '@/store/cart';
import { STORE_CATEGORIES } from '@/lib/catalog';
import BooklistUploadModal from '@/components/BooklistUploadModal';

/* ─── Icon map for sidebar categories ────────────────────────────── */
const CAT_ICONS: Record<string, React.ElementType> = {
  Book,
  GraduationCap,
  BookOpen,
  PenTool,
  Calculator,
  Palette,
  Briefcase,
  Backpack,
  FolderArchive,
  Sparkles,
  Smile,
  FlaskConical,
  Gift,
  Cpu,
};

/* ─── Hero carousel slides ───────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 1,
    eyebrow: 'Back to School · Limited Offer',
    title: 'Up to 25% Off',
    subtitle: 'School essentials, notebooks & stationery — shop the season deals.',
    cta: 'Shop Now',
    href: '/offers',
    image: '/images/hd/banners/term-desk-photo.jpg',
    badge1: 'Free Delivery',
    badge2: '100% Genuine',
  },
  {
    id: 2,
    eyebrow: 'AZIP Mall Exclusive',
    title: 'Student Kit Bundles',
    subtitle: 'Complete packs for Grade 1 to A/L — curated by teachers & parents.',
    cta: 'Browse Kits',
    href: '/products',
    image: '/images/hd/hero/hero-kit.jpg',
    badge1: 'Islandwide',
    badge2: 'COD Available',
  },
  {
    id: 3,
    eyebrow: 'Calculators & Geometry',
    title: 'Casio FX-991CW',
    subtitle: 'Official scientific calculators & geometry sets for every exam.',
    cta: 'View Calculators',
    href: '/products?category=mathematical-instruments',
    image: '/images/hd/products/casio-fx991cw.jpg',
    badge1: 'Best Seller',
    badge2: 'Warranty',
  },
];

/* ─── Shop by Category grid ──────────────────────────────────────── */
const SHOP_CATEGORIES = [
  {
    title: 'School Books',
    slug: 'school-books',
    count: '120+',
    image: '/images/hd/categories/school-books.jpg',
  },
  {
    title: 'CR & Exercise Notebooks',
    slug: 'exercise-books',
    count: '85+',
    image: '/images/hd/categories/exercise-books.jpg',
  },
  {
    title: 'Pens & Writing',
    slug: 'writing-instruments',
    count: '200+',
    image: '/images/hd/categories/pens-writing.jpg',
  },
  {
    title: 'Calculators & Geometry',
    slug: 'mathematical-instruments',
    count: '45+',
    image: '/images/hd/categories/calculators-geometry.jpg',
  },
  {
    title: 'Art Supplies',
    slug: 'art-craft',
    count: '90+',
    image: '/images/hd/categories/art-supplies.jpg',
  },
  {
    title: 'Backpacks & Bags',
    slug: 'school-accessories',
    count: '60+',
    image: '/images/hd/categories/backpacks.jpg',
  },
];

/* ─── Best sellers ───────────────────────────────────────────────── */
const BEST_SELLING_PRODUCTS = [
  {
    id: 'mockup-p1',
    name: 'Atlas Exercise Book (80gsm)',
    slug: 'atlas-premium-a4-hardcover-cr-notebook',
    price: 95,
    rating: 4.8,
    reviewsCount: 124,
    badge: 'Sale',
    badgeColor: 'bg-[#EF4444]',
    image: '/images/hd/products/atlas-exercise-book.jpg',
  },
  {
    id: 'mockup-p2',
    name: 'Pilot G2 Gel Pens (0.7mm)',
    slug: 'pilot-g2-retractable-gel-pen',
    price: 450,
    rating: 4.9,
    reviewsCount: 98,
    badge: 'Popular',
    badgeColor: 'bg-[#10B981]',
    image: '/images/hd/products/pilot-g2-pens.jpg',
  },
  {
    id: 'mockup-p3',
    name: 'Casio FX-991CW Scientific Calculator',
    slug: 'casio-fx-991cw-classwiz-scientific-calculator',
    price: 4990,
    rating: 4.8,
    reviewsCount: 210,
    badge: 'Bestseller',
    badgeColor: 'bg-[#F59E0B]',
    image: '/images/hd/products/casio-fx991cw.jpg',
  },
  {
    id: 'mockup-p4',
    name: 'Faber-Castell Water Color Set (12 Shades)',
    slug: 'faber-castell-studio-watercolour-pack',
    price: 690,
    rating: 4.7,
    reviewsCount: 86,
    badge: 'New',
    badgeColor: 'bg-[#8B5CF6]',
    image: '/images/hd/products/faber-castell-water-color.jpg',
  },
  {
    id: 'mockup-p5',
    name: 'School Backpack (Blue)',
    slug: 'ergonomic-school-backpack',
    price: 2125,
    compareAtPrice: 2500,
    rating: 4.6,
    reviewsCount: 72,
    badge: 'Sale',
    badgeColor: 'bg-[#EF4444]',
    image: '/images/hd/products/school-backpack-blue.jpg',
  },
];

const TRUST_ITEMS = [
  { icon: GraduationCap, title: 'School & College', subtitle: 'From Grade 1 to A/L' },
  { icon: Users, title: 'Trusted by Parents', subtitle: 'Quality you can count on' },
  { icon: Truck, title: 'Fast Delivery', subtitle: 'Islandwide coverage' },
  { icon: Headphones, title: 'Need Help?', subtitle: 'Our support team is here' },
];

const SIDEBAR_CATS = STORE_CATEGORIES.slice(0, 11);

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [isBooklistOpen, setIsBooklistOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const nextSlide = useCallback(() => {
    setSlide((s) => (s + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(nextSlide, 5200);
    return () => clearInterval(t);
  }, [nextSlide]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddToCart = (product: (typeof BEST_SELLING_PRODUCTS)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: 50,
    });
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <StoreShell>
      <div className="bg-[#F5F5F5] pb-0 font-sans">

        {/* ═══════════════════════════════════════════════════════════
            MARKETPLACE HERO — Categories | Carousel | Side Promo
            ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 pt-4 sm:pt-5">
          <div className="grid grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)_210px] gap-3 items-stretch">

            {/* LEFT — Category sidebar */}
            <aside className="hidden lg:flex flex-col bg-white rounded-xl shadow-sm border border-slate-100/80 overflow-hidden">
              <div className="px-3.5 py-3 border-b border-slate-100 bg-slate-50/80">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Categories
                </p>
              </div>
              <nav className="flex-1 py-1 overflow-y-auto max-h-[340px]">
                {SIDEBAR_CATS.map((cat) => {
                  const Icon = (cat.iconName ? CAT_ICONS[cat.iconName] : undefined) || Package;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/products?category=${cat.slug}`}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] font-medium text-slate-700 hover:text-[#007AFF] hover:bg-blue-50/70 transition-colors group"
                    >
                      <Icon size={15} className="text-slate-400 group-hover:text-[#007AFF] shrink-0" />
                      <span className="flex-1 truncate leading-tight">{cat.label}</span>
                      <ChevronRightIcon size={13} className="text-slate-300 group-hover:text-[#007AFF] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  );
                })}
              </nav>
              <Link
                href="/products"
                className="mx-3 mb-3 mt-1 py-2 text-center text-xs font-bold text-[#007AFF] hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
              >
                View All Categories
              </Link>
            </aside>

            {/* CENTER — Hero carousel */}
            <div className="relative rounded-xl overflow-hidden shadow-sm bg-slate-900 min-h-[240px] sm:min-h-[300px] lg:min-h-[360px] group">
              {/* Slides */}
              {HERO_SLIDES.map((s, i) => (
                <div
                  key={s.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-out ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                  <img
                    src={s.image}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div className="relative z-10 h-full flex flex-col justify-center p-6 sm:p-8 lg:p-10 max-w-lg">
                    <p className="text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-sky-300 mb-2">
                      {s.eyebrow}
                    </p>
                    <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-white tracking-tight leading-[1.1] mb-3">
                      {s.title}
                    </h1>
                    <p className="text-sm text-white/80 font-medium leading-relaxed mb-4 max-w-sm">
                      {s.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mb-5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-semibold text-white border border-white/20">
                        <Truck size={12} /> {s.badge1}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-sm text-[11px] font-semibold text-white border border-white/20">
                        <ShieldCheck size={12} /> {s.badge2}
                      </span>
                    </div>

                    <Link
                      href={s.href}
                      className="inline-flex items-center gap-2 w-fit px-6 py-2.5 bg-white hover:bg-blue-50 text-slate-900 font-bold text-sm rounded-full shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      {s.cta}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}

              {/* Arrows */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all border-none cursor-pointer ${i === slide ? 'w-6 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT — Side promo panel */}
            <aside className="hidden lg:flex flex-col gap-3">
              {/* Download / trust card */}
              <div className="flex-1 rounded-xl overflow-hidden bg-gradient-to-b from-[#007AFF] via-[#0066E0] to-[#004BB5] p-4 text-white shadow-sm flex flex-col">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star size={12} className="fill-amber-300 text-amber-300" />
                  <span className="text-[11px] font-bold text-amber-200">4.9 Rated</span>
                </div>
                <h3 className="text-base font-black leading-tight mb-1">
                  Shop Smarter<br />with AZIP
                </h3>
                <p className="text-[11px] text-blue-100 font-medium leading-snug mb-3">
                  Upload your booklist &amp; get everything packed in one order.
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-[11px] font-semibold">
                    <Truck size={13} className="text-sky-200" /> Free Shipping*
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold">
                    <Percent size={13} className="text-sky-200" /> Exclusive Deals
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold">
                    <ShieldCheck size={13} className="text-sky-200" /> Genuine Products
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBooklistOpen(true)}
                  className="mt-auto w-full py-2.5 bg-white text-[#007AFF] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-blue-50 transition-colors border-none cursor-pointer shadow-md"
                >
                  <Upload size={13} /> Upload Booklist
                </button>
              </div>

              {/* Mini offer card */}
              <Link
                href="/offers"
                className="rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm p-3 hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src="/images/hd/categories/exercise-books.jpg"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                      Hot Deal
                    </p>
                    <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-[#007AFF] transition-colors">
                      Up to 25% Off Notebooks
                    </p>
                  </div>
                </div>
              </Link>
            </aside>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            FEST / PROMO STRIP — Daraz-style wide banner
            ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 mt-3 sm:mt-4">
          <Link
            href="/offers"
            className="relative block rounded-xl overflow-hidden shadow-sm min-h-[100px] sm:min-h-[120px] group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFB800] via-[#FF9500] to-[#FF6B00]" />
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -left-10 top-0 w-40 h-40 rounded-full bg-white blur-2xl" />
              <div className="absolute right-1/3 bottom-0 w-32 h-32 rounded-full bg-red-500/40 blur-2xl" />
            </div>

            <div className="relative z-10 flex items-center justify-between gap-4 p-4 sm:p-5 h-full">
              <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                <div className="hidden sm:flex items-center -space-x-3 shrink-0">
                  {[
                    '/images/hd/products/atlas-exercise-book.jpg',
                    '/images/hd/products/pilot-g2-pens.jpg',
                    '/images/hd/products/school-backpack-blue.jpg',
                  ].map((src, i) => (
                    <div
                      key={i}
                      className="w-14 h-14 rounded-full border-2 border-white bg-white shadow-md overflow-hidden"
                    >
                      <img src={src} alt="" className="w-full h-full object-contain p-1" />
                    </div>
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-white/90 mb-0.5">
                    Live Now · Seasonal Sale
                  </p>
                  <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-tight truncate">
                    Back to School Fest — Up to 25% Off
                  </h2>
                  <p className="text-xs sm:text-sm text-white/85 font-medium mt-0.5 hidden sm:block">
                    Books · Stationery · Bags · Calculators
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white font-black text-[10px] sm:text-xs flex items-center justify-center text-center leading-tight shadow-lg group-hover:scale-105 transition-transform">
                SHOP<br />NOW
              </div>
            </div>
          </Link>
        </section>

        {/* Mobile category chips */}
        <section className="lg:hidden container mx-auto px-4 mt-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {SHOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="shrink-0 px-3.5 py-2 bg-white rounded-full text-xs font-bold text-slate-700 border border-slate-200 shadow-xs hover:border-[#007AFF] hover:text-[#007AFF] transition-colors"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SHOP BY CATEGORY
            ═══════════════════════════════════════════════════════════ */}
        <section id="categories" className="container mx-auto px-4 mt-8 sm:mt-10 scroll-mt-24">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#007AFF] uppercase mb-1">
                Categories
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Find What You Need
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#007AFF] hover:text-[#0056B3]"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SHOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-3.5 flex flex-col"
              >
                <div className="aspect-square rounded-lg bg-[#F4F7FB] flex items-center justify-center mb-3 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="max-h-[80%] max-w-[80%] object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-[12px] font-bold text-slate-800 group-hover:text-[#007AFF] leading-snug min-h-[32px]">
                  {cat.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">{cat.count} Products</span>
                  <span className="w-6 h-6 rounded-full bg-[#007AFF] text-white flex items-center justify-center">
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            BEST SELLING
            ═══════════════════════════════════════════════════════════ */}
        <section className="container mx-auto px-4 mt-10 sm:mt-12">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-[#007AFF] uppercase mb-1">
                Top Picks
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Best Selling Items
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#007AFF] hover:text-[#0056B3]"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {BEST_SELLING_PRODUCTS.map((prod) => {
              const isWished = wishlist[prod.id];
              const isAdded = addedItems[prod.id];

              return (
                <div
                  key={prod.id}
                  className="group bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative bg-[#F3F6FA] pt-3 px-3 pb-2">
                    <span
                      className={`absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase text-white ${prod.badgeColor}`}
                    >
                      {prod.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-red-500 border-none cursor-pointer"
                      aria-label="Wishlist"
                    >
                      <Heart size={14} className={isWished ? 'fill-red-500 text-red-500' : ''} />
                    </button>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="block h-36 w-full flex items-center justify-center"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>

                  <div className="p-3 flex flex-col flex-1 gap-1.5">
                    <Link
                      href={`/products/${prod.slug}`}
                      className="text-[12px] font-bold text-slate-800 hover:text-[#007AFF] line-clamp-2 leading-snug min-h-[32px]"
                    >
                      {prod.name}
                    </Link>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={10}
                            className={
                              s <= Math.round(prod.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200'
                            }
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-slate-700">{prod.rating}</span>
                      <span>({prod.reviewsCount})</span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mt-auto pt-1">
                      <span className="text-[15px] font-black text-[#007AFF]">
                        Rs. {prod.price.toLocaleString()}
                      </span>
                      {'compareAtPrice' in prod &&
                        prod.compareAtPrice &&
                        prod.compareAtPrice > prod.price && (
                          <span className="text-[10px] text-slate-400 line-through">
                            Rs. {prod.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      className={`w-full mt-1 py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border-none cursor-pointer transition-all ${isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#007AFF] hover:bg-[#0056B3] text-white'
                        }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={13} /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={13} /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trust bar */}
        <section className="mt-10 sm:mt-12 bg-white border-y border-slate-100">
          <div className="container mx-auto px-4 py-7 sm:py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {TRUST_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF4FF] text-[#007AFF] flex items-center justify-center shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 leading-tight">{item.title}</div>
                      <div className="text-[12px] text-slate-500 font-medium">{item.subtitle}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* New term banner */}
        <section className="container mx-auto px-4 py-8 sm:py-10">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#007AFF] to-[#0052C2] min-h-[180px] flex items-center shadow-lg shadow-blue-500/15">
            <div className="relative z-10 p-6 sm:p-9 max-w-md space-y-2">
              <p className="text-[11px] font-extrabold tracking-[0.14em] text-blue-100 uppercase">
                Special Offers
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Get Ready for the New Term!
              </h2>
              <p className="text-sm text-blue-100 font-medium">
                Shop now and save on your favourite school supplies.
              </p>
              <Link
                href="/offers"
                className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-white text-[#007AFF] font-bold text-sm rounded-lg hover:bg-blue-50 transition-colors"
              >
                Explore Offers <ArrowRight size={14} />
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden md:block">
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0066E0] to-transparent z-10" />
              <img
                src="/images/hd/banners/term-desk-photo.jpg"
                alt="New term desk"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

      </div>

      <BooklistUploadModal
        isOpen={isBooklistOpen}
        onClose={() => setIsBooklistOpen(false)}
      />
    </StoreShell>
  );
}
