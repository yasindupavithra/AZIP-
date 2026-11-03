'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Ticket,
  ShieldCheck,
  Flame,
  Star,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

export interface BannerSlide {
  _id: string;
  title: string;
  subtitle: string;
  badge: string;
  discountText?: string;
  ctaText?: string;
  bgTheme?: string;
  displayMode?: 'daraz-stage' | 'full-image';
  image: string;
  secondaryImages?: string[];
  linkUrl: string;
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
}

const DEFAULT_SLIDES: BannerSlide[] = [
  {
    _id: 'banner-1',
    title: 'HOT DEALS',
    subtitle: 'Too Hot to Last. Best Prices on School Kits.',
    badge: '11.11 SHOPPING FEST',
    discountText: '65%',
    ctaText: 'Add to Cart',
    bgTheme: 'orange',
    displayMode: 'daraz-stage',
    image: '/images/hd/products/school-backpack-blue.jpg',
    secondaryImages: [
      '/images/hd/products/atlas-exercise-book.jpg',
      '/images/hd/products/water-bottle.jpg',
    ],
    linkUrl: '/offers',
    isActive: true,
    order: 1,
  },
  {
    _id: 'banner-2',
    title: '11.11 TECH ZONE',
    subtitle: 'Real Deals on Casio Calculators & Study Gear',
    badge: '11.11 SHOPPING FEST',
    discountText: '50%',
    ctaText: 'Add to Cart',
    bgTheme: 'blue',
    displayMode: 'daraz-stage',
    image: '/images/hd/products/casio-fx991cw.jpg',
    secondaryImages: [
      '/images/hd/products/geometry-set.jpg',
      '/images/hd/products/pilot-g2-pens.jpg',
    ],
    linkUrl: '/products?category=mathematical-instruments',
    isActive: true,
    order: 2,
  },
  {
    _id: 'banner-3',
    title: 'STATIONERY FIESTA',
    subtitle: 'Write More. Spend Less on Genuine Brands.',
    badge: '11.11 SHOPPING FEST',
    discountText: '65%',
    ctaText: 'Add to Cart',
    bgTheme: 'red',
    displayMode: 'daraz-stage',
    image: '/images/hd/products/faber-castell-water-color.jpg',
    secondaryImages: [
      '/images/hd/products/highlighters-set.jpg',
      '/images/hd/products/drawing-kit.jpg',
    ],
    linkUrl: '/products?category=art-craft',
    isActive: true,
    order: 3,
  },
  {
    _id: 'banner-4',
    title: 'BOOKS & LIFESTYLE',
    subtitle: 'Student Saver Deals on CR Books & Lunch Boxes',
    badge: '11.11 SHOPPING FEST',
    discountText: '45%',
    ctaText: 'Shop Now',
    bgTheme: 'teal',
    displayMode: 'daraz-stage',
    image: '/images/hd/products/atlas-exercise-book.jpg',
    secondaryImages: [
      '/images/hd/products/lunch-box.jpg',
      '/images/hd/products/sticky-notes.jpg',
    ],
    linkUrl: '/products?category=exercise-books',
    isActive: true,
    order: 4,
  },
];

interface StageThemeConfig {
  bgGradient: string;
  raysColor: string;
  floorGradient: string;
  ribbonText: string;
  sphereGradient: string;
  sphereText: string;
  ctaGradient: string;
  ctaText: string;
  tagAccent: string;
}

const STAGE_THEMES: Record<string, StageThemeConfig> = {
  orange: {
    bgGradient: 'linear-gradient(135deg, #FF5100 0%, #FF8800 48%, #FFA800 100%)',
    raysColor: 'rgba(255, 230, 0, 0.22)',
    floorGradient: 'linear-gradient(180deg, rgba(217, 70, 0, 0) 0%, rgba(180, 45, 0, 0.85) 100%)',
    ribbonText: 'text-[#E64800]',
    sphereGradient: 'radial-gradient(circle at 32% 28%, #FFF580 0%, #FFD000 45%, #F59E0B 85%, #D97706 100%)',
    sphereText: 'text-[#B91C1C]',
    ctaGradient: 'linear-gradient(180deg, #FFF066 0%, #FFD000 55%, #F59E0B 100%)',
    ctaText: 'text-[#991B1B]',
    tagAccent: 'text-[#D9460F]',
  },
  blue: {
    bgGradient: 'linear-gradient(135deg, #001B87 0%, #0047FF 52%, #00A8FF 100%)',
    raysColor: 'rgba(0, 225, 255, 0.22)',
    floorGradient: 'linear-gradient(180deg, rgba(0, 24, 110, 0) 0%, rgba(0, 18, 85, 0.9) 100%)',
    ribbonText: 'text-[#FF5500]',
    sphereGradient: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #C7F9FF 48%, #67E8F9 85%, #06B6D4 100%)',
    sphereText: 'text-[#002888]',
    ctaGradient: 'linear-gradient(180deg, #D9FBFF 0%, #7CEEFF 55%, #22D3EE 100%)',
    ctaText: 'text-[#002888]',
    tagAccent: 'text-[#FF5500]',
  },
  red: {
    bgGradient: 'linear-gradient(135deg, #5C0004 0%, #B8000A 50%, #EF1120 100%)',
    raysColor: 'rgba(255, 120, 120, 0.2)',
    floorGradient: 'linear-gradient(180deg, rgba(70, 0, 4, 0) 0%, rgba(45, 0, 2, 0.92) 100%)',
    ribbonText: 'text-[#D93800]',
    sphereGradient: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #F1F5F9 55%, #CBD5E1 90%, #94A3B8 100%)',
    sphereText: 'text-[#6B0509]',
    ctaGradient: 'linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 65%, #CBD5E1 100%)',
    ctaText: 'text-[#6B0509]',
    tagAccent: 'text-[#EA580C]',
  },
  teal: {
    bgGradient: 'linear-gradient(135deg, #006D68 0%, #00A896 52%, #15E6CD 100%)',
    raysColor: 'rgba(180, 255, 245, 0.22)',
    floorGradient: 'linear-gradient(180deg, rgba(0, 80, 75, 0) 0%, rgba(0, 58, 54, 0.9) 100%)',
    ribbonText: 'text-[#E64800]',
    sphereGradient: 'radial-gradient(circle at 32% 28%, #FFB07B 0%, #FF6B00 50%, #D94600 90%, #9A3412 100%)',
    sphereText: 'text-white',
    ctaGradient: 'linear-gradient(180deg, #FF944D 0%, #FF6600 60%, #DC4D00 100%)',
    ctaText: 'text-white',
    tagAccent: 'text-[#EA580C]',
  },
  emerald: {
    bgGradient: 'linear-gradient(135deg, #0F291E 0%, #165B36 52%, #229954 100%)',
    raysColor: 'rgba(134, 239, 172, 0.18)',
    floorGradient: 'linear-gradient(180deg, rgba(15, 41, 30, 0) 0%, rgba(10, 28, 20, 0.92) 100%)',
    ribbonText: 'text-[#E64800]',
    sphereGradient: 'radial-gradient(circle at 32% 28%, #FFF799 0%, #FACC15 50%, #CA8A04 95%)',
    sphereText: 'text-[#14532D]',
    ctaGradient: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 65%, #E2E8F0 100%)',
    ctaText: 'text-[#0F291E]',
    tagAccent: 'text-[#15803D]',
  },
};

export default function HeroBannerSlider({ waUrl }: { waUrl: string }) {
  const [slides, setSlides] = useState<BannerSlide[]>(DEFAULT_SLIDES);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let active = true;
    async function fetchBanners() {
      try {
        const res = await fetch('/api/banners', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (active && Array.isArray(data.banners) && data.banners.length > 0) {
            setSlides(data.banners);
            setCurrent(0);
          }
        }
      } catch {
        // Keep default slides
      }
    }
    fetchBanners();
    return () => {
      active = false;
    };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (slides.length > 0 ? (prev + 1) % slides.length : 0));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (slides.length > 0 ? (prev - 1 + slides.length) % slides.length : 0));
  }, [slides.length]);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = setInterval(nextSlide, 4200);
    return () => clearInterval(timer);
  }, [paused, slides.length, nextSlide]);

  const slide = slides[current] || DEFAULT_SLIDES[0];
  const themeKey =
    slide.bgTheme === 'cyan'
      ? 'teal'
      : slide.bgTheme === 'navy'
      ? 'blue'
      : slide.bgTheme === 'amber'
      ? 'orange'
      : slide.bgTheme === 'rose'
      ? 'red'
      : slide.bgTheme || 'orange';
  const theme = STAGE_THEMES[themeKey] || STAGE_THEMES.orange;

  const extraImgs =
    slide.secondaryImages && slide.secondaryImages.length > 0
      ? slide.secondaryImages
      : [
          '/images/hd/products/pilot-g2-pens.jpg',
          '/images/hd/products/geometry-set.jpg',
        ];

  return (
    <div className="space-y-3">
      {/* ── MAIN DARAZ HERO ROW (Left Carousel + Right Express Widget) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        {/* LEFT / MAIN CAROUSEL (10 cols on xl, 9 on lg) */}
        <div
          className="lg:col-span-9 xl:col-span-10 relative overflow-hidden rounded-none shadow-md select-none min-h-[290px] sm:min-h-[345px] md:min-h-[370px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {slide.displayMode === 'full-image' ? (
            /* ── FULL UPLOADED BANNER IMAGE MODE ── */
            <Link href={slide.linkUrl || '/offers'} className="block w-full h-full min-h-[290px] sm:min-h-[370px] relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full min-h-[290px] sm:min-h-[370px] object-cover"
              />
            </Link>
          ) : (
            /* ── DARAZ STARBURST CAMPAIGN STAGE MODE ── */
            <div
              className="relative w-full h-full min-h-[290px] sm:min-h-[345px] md:min-h-[370px] flex items-center overflow-hidden transition-all duration-500"
              style={{ background: theme.bgGradient }}
            >
              {/* Starburst Radial Rays Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-80"
                style={{
                  backgroundImage: `repeating-conic-gradient(from 0deg at 55% 48%, ${theme.raysColor} 0deg 6deg, transparent 6deg 14deg)`,
                }}
              />

              {/* Bright Center Glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 62% 48%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 38%, transparent 68%)',
                }}
              />

              {/* 3D Perspective Floor Stage Reflection at Bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 pointer-events-none border-t border-white/25"
                style={{
                  background: theme.floorGradient,
                  backgroundImage: `
                    linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px),
                    linear-gradient(180deg, rgba(255,255,255,0.18) 1px, transparent 1px)
                  `,
                  backgroundSize: '48px 18px',
                }}
              />

              {/* Content Grid */}
              <div className="relative z-10 w-full grid grid-cols-1 md:grid-cols-12 items-center gap-4 px-4 sm:px-8 md:px-10 py-6">
                {/* LEFT COLUMN: Ribbon + Giant Headline + Subtitle + 2 Angled Badges + Pill CTA */}
                <div className="md:col-span-5 flex flex-col items-start z-20">
                  {/* Flush Left White Festival Ribbon */}
                  <div className="-ml-4 sm:-ml-8 md:-ml-10 mb-3 bg-white pl-4 sm:pl-8 md:pl-10 pr-5 py-1.5 rounded-none shadow-md">
                    <span
                      className={`text-sm sm:text-lg md:text-xl font-black tracking-tight uppercase ${theme.ribbonText}`}
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {slide.badge || '11.11 SHOPPING FEST'}
                    </span>
                  </div>

                  {/* Giant Bold Headline */}
                  <h2
                    className="text-3xl sm:text-5xl lg:text-[3.35rem] font-black text-white uppercase tracking-tight leading-[0.98] drop-shadow-[0_3px_10px_rgba(0,0,0,0.28)]"
                    style={{ fontFamily: 'Outfit, sans-serif' }}
                  >
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="mt-1.5 sm:mt-2 text-sm sm:text-lg md:text-[1.2rem] font-semibold text-white/95 drop-shadow-xs line-clamp-1">
                    {slide.subtitle}
                  </p>

                  {/* Two Angled Parallelogram Feature Badges (Daraz Signature) */}
                  <div className="mt-3.5 sm:mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <div
                      className="bg-white px-3 sm:px-3.5 py-1.5 shadow-md flex items-center gap-2"
                      style={{ transform: 'skewX(-12deg)' }}
                    >
                      <div className="flex items-center gap-1.5" style={{ transform: 'skewX(12deg)' }}>
                        <span className="w-6 h-6 rounded-none bg-orange-500 text-white flex items-center justify-center shrink-0">
                          <Ticket size={14} />
                        </span>
                        <div className={`text-[10px] sm:text-[11px] font-extrabold leading-tight ${theme.tagAccent}`}>
                          <div>Discount</div>
                          <div>Vouchers</div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="bg-white px-3 sm:px-3.5 py-1.5 shadow-md flex items-center gap-2"
                      style={{ transform: 'skewX(-12deg)' }}
                    >
                      <div className="flex items-center gap-1.5" style={{ transform: 'skewX(12deg)' }}>
                        <span className="w-6 h-6 rounded-none bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Truck size={14} />
                        </span>
                        <div className="text-[10px] sm:text-[11px] font-extrabold leading-tight text-emerald-700">
                          <div>Free</div>
                          <div>Delivery</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom-Left rounded-none Pill CTA Button */}
                  <Link
                    href={slide.linkUrl || '/offers'}
                    className={`mt-4 sm:mt-5 inline-flex items-center justify-center px-7 sm:px-9 py-2 sm:py-2.5 rounded-none font-extrabold text-xs sm:text-sm shadow-[0_6px_16px_rgba(0,0,0,0.28)] hover:scale-105 transition-transform ${theme.ctaText}`}
                    style={{ background: theme.ctaGradient }}
                  >
                    {slide.ctaText || 'Add to Cart'}
                  </Link>
                </div>

                {/* CENTER COLUMN: 3D Glossy Circular "UP TO 65% OFF" Sphere */}
                <div className="hidden sm:flex md:col-span-2 items-center justify-center z-20">
                  <Link
                    href={slide.linkUrl || '/offers'}
                    className={`w-28 h-28 lg:w-32 lg:h-32 rounded-none flex flex-col items-center justify-center text-center shadow-[0_12px_28px_rgba(0,0,0,0.32),inset_0_3px_8px_rgba(255,255,255,0.8)] hover:scale-105 transition-transform shrink-0 ${theme.sphereText}`}
                    style={{ background: theme.sphereGradient }}
                  >
                    <span className="text-[11px] lg:text-xs font-extrabold uppercase tracking-wider leading-none">
                      UP TO
                    </span>
                    <span
                      className="text-3xl lg:text-4xl font-black leading-none my-0.5 tracking-tight"
                      style={{ fontFamily: 'Outfit, sans-serif' }}
                    >
                      {slide.discountText || '65%'}
                    </span>
                    <span className="text-xs lg:text-sm font-extrabold uppercase leading-none">
                      OFF
                    </span>
                  </Link>
                </div>

                {/* RIGHT COLUMN: Multi-Product Stage Showcase */}
                <div className="md:col-span-5 flex items-end justify-center md:justify-end gap-2 sm:gap-3 z-20 pt-2 md:pt-0">
                  {/* Left companion product */}
                  {extraImgs[0] && (
                    <Link
                      href={slide.linkUrl || '/offers'}
                      className="hidden sm:flex w-28 h-32 lg:w-32 lg:h-36 bg-white rounded-none p-2 shadow-[0_14px_28px_rgba(0,0,0,0.35)] items-center justify-center hover:scale-105 transition-all"
                    >
                      <img
                        src={extraImgs[0]}
                        alt="Featured deal item"
                        className="max-w-full max-h-full object-contain"
                      />
                    </Link>
                  )}

                  {/* Main Hero Product Centerpiece */}
                  <Link
                    href={slide.linkUrl || '/offers'}
                    className="w-40 h-44 sm:w-44 sm:h-48 lg:w-52 lg:h-56 bg-white rounded-none p-3 shadow-[0_18px_36px_rgba(0,0,0,0.45)] flex items-center justify-center hover:scale-105 transition-transform z-10"
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  </Link>

                  {/* Right companion product */}
                  {extraImgs[1] && (
                    <Link
                      href={slide.linkUrl || '/offers'}
                      className="hidden xl:flex w-28 h-32 bg-white rounded-none p-2 shadow-[0_14px_28px_rgba(0,0,0,0.35)] items-center justify-center hover:scale-105 transition-all"
                    >
                      <img
                        src={extraImgs[1]}
                        alt="Bonus deal item"
                        className="max-w-full max-h-full object-contain"
                      />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Left / Right Circular Edge Arrows (Daraz signature) */}
          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous banner"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-none bg-black/30 hover:bg-black/55 text-white flex items-center justify-center transition-colors cursor-pointer border-none"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next banner"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-none bg-black/30 hover:bg-black/55 text-white flex items-center justify-center transition-colors cursor-pointer border-none"
              >
                <ChevronRight size={18} />
              </button>

              {/* Bottom Center Circular Pagination Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                {slides.map((s, idx) => (
                  <button
                    key={s._id || idx}
                    type="button"
                    onClick={() => setCurrent(idx)}
                    aria-label={`Slide ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-none transition-all cursor-pointer border-none ${
                      idx === current
                        ? 'bg-white scale-125 shadow-sm'
                        : 'bg-white/45 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDEBAR PROMO CARD (Daraz Screenshot #5 style, 3 cols on lg, 2 on xl) */}
        <div className="hidden lg:flex lg:col-span-3 xl:col-span-2 bg-white rounded-none border border-slate-200 p-3.5 flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-7 h-7 rounded-none bg-[#FF5500] text-white flex items-center justify-center font-black text-xs shrink-0">
                AZ
              </span>
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">
                TRY AZIP EXPRESS
              </span>
            </div>

            {/* Orange-Pink Gradient Promo Box */}
            <div
              className="rounded-none p-3 text-white shadow-inner"
              style={{
                background: 'linear-gradient(145deg, #FF6A00 0%, #FF2A6D 100%)',
              }}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-200 mb-1">
                <Star size={12} className="fill-amber-300 text-amber-300" />
                <span>4.9 Rated Store</span>
              </div>
              <p className="text-xs font-extrabold leading-snug mb-3">
                Fast Islandwide School Delivery
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-white/95 text-slate-900 rounded-none px-2.5 py-1.5 text-[11px] font-bold">
                  <span className="w-6 h-6 rounded-none bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                    <Truck size={13} />
                  </span>
                  <span>Free Shipping</span>
                </div>

                <div className="flex items-center gap-2 bg-white/95 text-slate-900 rounded-none px-2.5 py-1.5 text-[11px] font-bold">
                  <span className="w-6 h-6 rounded-none bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <Ticket size={13} />
                  </span>
                  <span>Exclusive Vouchers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Quick Actions */}
          <div className="pt-2.5 space-y-1.5">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-none bg-[#25D366] hover:bg-[#1EBE57] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <MessageCircle size={14} /> WhatsApp Order
            </a>
            <Link
              href="/offers"
              className="w-full py-1.5 px-3 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Sparkles size={12} className="text-amber-300" /> Claim Vouchers
            </Link>
          </div>
        </div>
      </div>

      {/* ── BOTTOM PILL CAMPAIGN STRIP BANNER (Daraz Screenshot #5 bottom strip) ── */}
      <Link
        href="/offers"
        className="relative overflow-hidden rounded-none px-5 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4 shadow-md hover:shadow-lg transition-shadow"
        style={{
          background: 'linear-gradient(90deg, #FF5E00 0%, #FF9900 35%, #FF5500 72%, #B91C1C 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center -space-x-2">
            <img
              src="/images/hd/products/casio-fx991cw.jpg"
              alt="Calculator"
              className="w-9 h-9 rounded-none bg-white p-1 object-contain border-2 border-amber-300 shadow-xs"
            />
            <img
              src="/images/hd/products/school-backpack-blue.jpg"
              alt="Backpack"
              className="w-9 h-9 rounded-none bg-white p-1 object-contain border-2 border-amber-300 shadow-xs"
            />
          </div>
          <div className="flex items-center gap-2">
            <Flame size={20} className="text-yellow-300 fill-yellow-300 shrink-0" />
            <span
              className="text-base sm:text-2xl font-black text-yellow-200 tracking-tight uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              11.11 Shopping Fest.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <span className="hidden md:inline-block bg-red-700 text-white text-[11px] font-black uppercase px-3 py-1 rounded-none border border-yellow-300/60 shadow-xs">
            LIVE NOW
          </span>
          <span className="bg-[#7F1D1D] hover:bg-[#991B1B] text-white text-xs sm:text-sm font-black uppercase px-4 sm:px-5 py-1.5 rounded-none border-2 border-amber-300 shadow-md">
            SHOP NOW
          </span>
        </div>
      </Link>
    </div>
  );
}
