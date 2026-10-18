'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
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
  Package,
  Award,
  BookOpen,
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import { useCartStore } from '@/store/cart';

const HERO_SLIDES = [
  {
    id: 1,
    eyebrow: 'AZIP MALL EXCLUSIVE',
    titleBefore: 'Student Kit',
    titleAccent: 'Bundles',
    subtitle: 'Complete packs for Grade 1 to A/L — curated by teachers & parents.',
    cta: 'Browse Kits',
    href: '/products',
    image: '/images/hd/hero/hero-student-kit-banner.jpg',
  },
  {
    id: 2,
    eyebrow: 'BACK TO SCHOOL · LIMITED OFFER',
    titleBefore: 'Up to',
    titleAccent: '25% Off',
    subtitle: 'School essentials, notebooks and stationery — shop the season deals.',
    cta: 'Shop Offers',
    href: '/offers',
    image: '/images/hd/banners/term-desk-photo.jpg',
  },
  {
    id: 3,
    eyebrow: 'CALCULATORS & GEOMETRY',
    titleBefore: 'Casio ClassWiz',
    titleAccent: 'FX-991CW',
    subtitle: 'Official scientific calculators and geometry sets for every exam.',
    cta: 'View Calculators',
    href: '/products?category=mathematical-instruments',
    image: '/images/hd/hero/hero-kit.jpg',
  },
];

const HERO_TRUST = [
  { icon: BookOpen, label: 'Quality Products' },
  { icon: ShieldCheck, label: 'Trusted Brands' },
  { icon: Truck, label: 'Islandwide Delivery' },
];

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

const BEST_SELLING_PRODUCTS = [
  {
    id: 'mockup-p1',
    name: 'Atlas Exercise Book (80gsm)',
    slug: 'atlas-premium-a4-hardcover-cr-notebook',
    price: 95,
    rating: 4.8,
    reviewsCount: 124,
    badge: 'SALE',
    badgeColor: '#EF4444',
    image: '/images/hd/categories/school-books.jpg',
  },
  {
    id: 'mockup-p2',
    name: 'Pilot G2 Gel Pens (0.7mm)',
    slug: 'pilot-g2-retractable-gel-pen',
    price: 450,
    rating: 4.9,
    reviewsCount: 98,
    badge: 'POPULAR',
    badgeColor: '#22C55E',
    image: '/images/hd/products/pilot-g2-pens.jpg',
  },
  {
    id: 'mockup-p3',
    name: 'Casio FX-991CW Scientific Calculator',
    slug: 'casio-fx-991cw-classwiz-scientific-calculator',
    price: 4990,
    rating: 4.8,
    reviewsCount: 210,
    badge: 'BESTSELLER',
    badgeColor: '#F59E0B',
    image: '/images/hd/products/casio-fx991cw.jpg',
  },
  {
    id: 'mockup-p4',
    name: 'Faber-Castell Water Color Set (12 Shades)',
    slug: 'faber-castell-studio-watercolour-pack',
    price: 690,
    rating: 4.7,
    reviewsCount: 86,
    badge: 'NEW',
    badgeColor: '#8B5CF6',
    image: '/images/hd/products/faber-castell-water-color.jpg',
  },
  {
    id: 'mockup-p5',
    name: 'School Backpack (Blue)',
    slug: 'ergonomic-school-backpack',
    price: 2125,
    compareAtPrice: 2900,
    rating: 4.6,
    reviewsCount: 72,
    badge: 'SALE',
    badgeColor: '#EF4444',
    image: '/images/hd/products/school-backpack-blue.jpg',
  },
];

const TRUST_ITEMS = [
  { icon: GraduationCap, title: 'School & College', subtitle: 'From Grade 1 to A/L' },
  { icon: Users, title: 'Trusted by Parents', subtitle: 'Quality you can count on' },
  { icon: Truck, title: 'Fast Delivery', subtitle: 'Islandwide coverage' },
  { icon: Headphones, title: 'Need Help?', subtitle: 'Our support team is here' },
];

export default function HomePage() {
  const [slide, setSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((s) => s.addItem);

  const nextSlide = useCallback(() => {
    setSlide((s) => (s + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(nextSlide, 8000);
    return () => clearInterval(t);
  }, [nextSlide, isPaused]);

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
      <div className="bg-[#F4F7FC] font-sans">

        {/* FULL-WIDTH HERO */}
        <section className="container mx-auto px-4 pt-4 sm:pt-5">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative rounded-[22px] overflow-hidden min-h-[300px] sm:min-h-[360px] lg:min-h-[400px] shadow-[0_12px_36px_rgba(11,87,208,0.16)] group"
          >
            {HERO_SLIDES.map((s, i) => (
              <div
                key={s.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                  i === slide ? 'opacity-100 z-10 visible' : 'opacity-0 z-0 invisible pointer-events-none'
                }`}
              >
                <img
                  src={s.image}
                  alt={s.titleAccent}
                  className="absolute inset-0 w-full h-full object-cover object-[75%_center]"
                />
                {/* Smooth dark blue gradient overlay to ensure crystal clear readability on left */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#062E69] via-[#094186]/92 via-45% to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#062554]/40 via-transparent to-transparent" />

                <div className="relative z-10 h-full flex items-center">
                  <div style={{ paddingLeft: '84px' }} className="pr-6 py-10 max-w-xl">
                    <p className="text-[11px] sm:text-xs font-black tracking-[0.2em] uppercase text-[#38BDF8] mb-2">
                      {s.eyebrow}
                    </p>
                    <h1 className="text-[2.2rem] sm:text-4xl lg:text-[3.25rem] font-black text-white tracking-tight leading-[1.06] mb-3">
                      {s.titleBefore}{' '}
                      <span className="text-[#38BDF8]">{s.titleAccent}</span>
                    </h1>
                    <p className="text-sm sm:text-[15px] text-white/90 font-medium leading-relaxed mb-6 max-w-md">
                      {s.subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-6">
                      {HERO_TRUST.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div key={item.label} className="flex items-center gap-2.5 text-white">
                            <div className="w-8 h-8 rounded-lg bg-white/12 border border-white/20 flex items-center justify-center shrink-0 shadow-sm">
                              <Icon size={16} className="text-white" />
                            </div>
                            <span className="text-[12px] font-semibold leading-tight">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    <Link
                      href={s.href}
                      className="inline-flex items-center gap-2 px-7 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-sm rounded-full shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5"
                    >
                      {s.cta}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>

                {/* Better Learning Brighter Future Cursive Script in Top-Right */}
                <div
                  className="hidden lg:block absolute top-8 right-12 z-20 text-right pointer-events-none select-none"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  <p className="text-white text-[2rem] font-bold leading-[1.05] drop-shadow-md">
                    Better
                  </p>
                  <p className="text-white text-[2rem] font-bold leading-[1.05] drop-shadow-md">
                    Learning
                  </p>
                  <p className="text-[#38BDF8] text-[2rem] font-bold leading-[1.05] drop-shadow-md">
                    Brighter
                  </p>
                  <p className="text-[#38BDF8] text-[2rem] font-bold leading-[1.05] drop-shadow-md">
                    Future
                  </p>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm cursor-pointer transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/35 hover:bg-black/55 text-white flex items-center justify-center border border-white/20 backdrop-blur-sm cursor-pointer transition-all"
              aria-label="Next slide"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlide(i)}
                  className={`h-1.5 rounded-full transition-all border-none cursor-pointer ${
                    i === slide ? 'w-6 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SEASONAL FEST BANNER */}
        <section className="container mx-auto px-4 mt-3.5">
          <Link
            href="/offers"
            className="relative block rounded-[20px] overflow-hidden min-h-[90px] sm:min-h-[100px] group shadow-[0_8px_24px_rgba(255,138,0,0.22)]"
          >
            {/* Rich warm orange-gold gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFB800] via-[#FF8A00] to-[#E65100]" />

            {/* Faint line doodles in background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
              {/* Airplane */}
              <svg
                className="absolute right-52 top-3 text-white/30 w-12 h-12 -rotate-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
              {/* Star Badge */}
              <svg
                className="absolute right-36 top-5 text-white/25 w-9 h-9"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {/* Ticket Voucher */}
              <svg
                className="absolute right-20 bottom-3 text-white/25 w-11 h-9 rotate-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
              </svg>
            </div>

            <div className="relative z-10 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 h-full">
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div className="hidden sm:flex items-center -space-x-2.5 shrink-0">
                  {[
                    '/images/hd/categories/school-books.jpg',
                    '/images/hd/products/pilot-g2-pens.jpg',
                    '/images/hd/products/school-backpack-blue.jpg',
                  ].map((src, idx) => (
                    <div
                      key={idx}
                      className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-[3px] border-white bg-white shadow-md overflow-hidden flex items-center justify-center p-1"
                    >
                      <img src={src} alt="" className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white/95 mb-0.5">
                    Live Now · Seasonal Sale
                  </p>
                  <h2 className="text-base sm:text-2xl lg:text-[1.65rem] font-black text-white tracking-tight leading-tight">
                    Back to School Fest — Up to 25% Off
                  </h2>
                  <p className="text-xs sm:text-[13px] text-white/90 font-semibold tracking-wide mt-0.5 hidden sm:block">
                    Books · Stationery · Bags · Calculators
                  </p>
                </div>
              </div>

              {/* Crimson Circular SHOP NOW button with shopping cart icon */}
              <div className="shrink-0 flex items-center">
                <div className="w-[68px] h-[68px] sm:w-[76px] sm:h-[76px] rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/25 transition-transform group-hover:scale-105 cursor-pointer">
                  <ShoppingCart size={17} className="text-white shrink-0 -ml-0.5" strokeWidth={2.2} />
                  <span className="font-black text-[10.5px] sm:text-[11px] leading-tight uppercase tracking-tight text-left">
                    SHOP<br />NOW
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* BEST SELLING */}
        <section className="container mx-auto px-4 mt-8 sm:mt-10 pb-2">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] text-[#0066FF] uppercase mb-1">
                Top Picks
              </p>
              <h2 className="text-[1.5rem] sm:text-[1.75rem] font-black text-[#0F172A] tracking-tight">
                Best Selling Items
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#0066FF] hover:text-[#0052CC]"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {BEST_SELLING_PRODUCTS.map((prod) => {
              const isWished = wishlist[prod.id];
              const isAdded = addedItems[prod.id];

              return (
                <div
                  key={prod.id}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_14px_32px_rgba(15,23,42,0.09)] hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative bg-white pt-3 px-3 pb-1">
                    <span
                      style={{ backgroundColor: prod.badgeColor }}
                      className="absolute top-2.5 left-2.5 z-10 px-2 py-[2px] rounded-full text-[9px] font-black uppercase tracking-wider text-white shadow-sm"
                    >
                      {prod.badge}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(prod.id)}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 hover:text-red-500 cursor-pointer transition-colors"
                      aria-label="Wishlist"
                    >
                      <Heart size={14} className={isWished ? 'fill-red-500 text-red-500' : ''} />
                    </button>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="block h-[132px] w-full flex items-center justify-center"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>

                  <div className="p-3.5 pt-2 flex flex-col flex-1">
                    <Link
                      href={`/products/${prod.slug}`}
                      className="text-[13px] font-bold text-slate-800 hover:text-[#0066FF] line-clamp-1 leading-snug"
                    >
                      {prod.name}
                    </Link>

                    <div className="flex items-center gap-1 mt-1.5 text-[11px] text-slate-500">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={
                              s <= Math.round(prod.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-200 text-slate-200'
                            }
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-slate-600">
                        {prod.rating} ({prod.reviewsCount})
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-[17px] font-black text-[#0066FF]">
                        Rs. {prod.price.toLocaleString()}
                      </span>
                      {'compareAtPrice' in prod &&
                        prod.compareAtPrice &&
                        prod.compareAtPrice > prod.price && (
                          <span className="text-[11px] text-slate-400 line-through font-medium">
                            Rs. {prod.compareAtPrice.toLocaleString()}
                          </span>
                        )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod)}
                      className={`w-full mt-3 py-2.5 px-3 rounded-full text-[12px] font-bold flex items-center justify-center gap-2 border-none cursor-pointer transition-all shadow-sm ${
                        isAdded
                          ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                          : 'bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-blue-500/20 active:scale-[0.98]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} strokeWidth={2.5} /> Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} strokeWidth={2.2} /> Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CATEGORIES */}
        <section id="categories" className="container mx-auto px-4 mt-10 sm:mt-12 scroll-mt-24">
          <div className="flex items-end justify-between gap-4 mb-5">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-[#2B6BFF] uppercase mb-1">
                Shop by Category
              </p>
              <h2 className="text-[1.45rem] sm:text-[1.7rem] font-black text-[#0F172A] tracking-tight">
                Find What You Need
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#2B6BFF] hover:text-[#1B4FBF]"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SHOP_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group bg-white rounded-2xl border border-slate-100 shadow-[0_4px_16px_rgba(15,23,42,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all p-3.5 flex flex-col"
              >
                <div className="aspect-square rounded-xl bg-[#F4F7FB] flex items-center justify-center mb-3 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="max-h-[80%] max-w-[80%] object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-[12px] font-bold text-slate-800 group-hover:text-[#2B6BFF] leading-snug min-h-[32px]">
                  {cat.title}
                </h3>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">{cat.count} Products</span>
                  <span className="w-6 h-6 rounded-full bg-[#2B6BFF] text-white flex items-center justify-center">
                    <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="mt-10 sm:mt-12 bg-white border-y border-slate-100">
          <div className="container mx-auto px-4 py-7 sm:py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {TRUST_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#E8F0FF] text-[#2B6BFF] flex items-center justify-center shrink-0">
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

        {/* NEW TERM BANNER */}
        <section className="container mx-auto px-4 py-8 sm:py-10">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#1B4FBF] to-[#2B6BFF] min-h-[180px] flex items-center shadow-lg shadow-blue-500/15">
            <div className="relative z-10 p-6 sm:p-9 max-w-md space-y-2">
              <p className="text-[11px] font-extrabold tracking-[0.16em] text-blue-100 uppercase">
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
                className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-white text-[#2B6BFF] font-bold text-sm rounded-full hover:bg-blue-50 transition-colors"
              >
                Explore Offers <ArrowRight size={14} />
              </Link>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden md:block">
              <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#1B4FBF] to-transparent z-10" />
              <img
                src="/images/hd/banners/term-desk-photo.jpg"
                alt="New term desk"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
      </div>
    </StoreShell>
  );
}
