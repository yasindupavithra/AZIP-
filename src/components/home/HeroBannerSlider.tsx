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
    bgGradient: 'linear-gradient(135deg, #041E42 0%, #0066B2 48%, #00C4D8 100%)',
    raysColor: 'rgba(0, 229, 255, 0.22)',
    floorGradient: 'linear-gradient(180deg, rgba(4, 30, 66, 0) 0%, rgba(2, 18, 44, 0.9) 100%)',
    ribbonText: 'text-[#0077B6]',
    sphereGradient: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #E0F9FC 48%, #7CEEFF 85%, #00B4D8 100%)',
    sphereText: 'text-[#041E42]',
    ctaGradient: 'linear-gradient(180deg, #FFFFFF 0%, #E0F9FC 55%, #90E0EF 100%)',
    ctaText: 'text-[#041E42]',
    tagAccent: 'text-[#0077B6]',
  },
  blue: {
    bgGradient: 'linear-gradient(135deg, #001B87 0%, #0047FF 52%, #00A8FF 100%)',
    raysColor: 'rgba(0, 225, 255, 0.22)',
    floorGradient: 'linear-gradient(180deg, rgba(0, 24, 110, 0) 0%, rgba(0, 18, 85, 0.9) 100%)',
    ribbonText: 'text-[#0052D4]',
    sphereGradient: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #C7F9FF 48%, #67E8F9 85%, #06B6D4 100%)',
    sphereText: 'text-[#002888]',
    ctaGradient: 'linear-gradient(180deg, #D9FBFF 0%, #7CEEFF 55%, #22D3EE 100%)',
    ctaText: 'text-[#002888]',
    tagAccent: 'text-[#0052D4]',
  },
  red: {
    bgGradient: 'linear-gradient(135deg, #0A192F 0%, #0F4C81 50%, #0096C7 100%)',
    raysColor: 'rgba(125, 211, 252, 0.2)',
    floorGradient: 'linear-gradient(180deg, rgba(10, 25, 47, 0) 0%, rgba(6, 15, 30, 0.92) 100%)',
    ribbonText: 'text-[#0077B6]',
    sphereGradient: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #E0F2FE 55%, #7DD3FC 90%, #0284C7 100%)',
    sphereText: 'text-[#0A192F]',
    ctaGradient: 'linear-gradient(180deg, #FFFFFF 0%, #E0F2FE 65%, #BAE6FD 100%)',
    ctaText: 'text-[#0A192F]',
    tagAccent: 'text-[#0077B6]',
  },
  teal: {
    bgGradient: 'linear-gradient(135deg, #005F73 0%, #0096C7 52%, #00E5FF 100%)',
    raysColor: 'rgba(180, 255, 245, 0.22)',
    floorGradient: 'linear-gradient(180deg, rgba(0, 80, 95, 0) 0%, rgba(0, 48, 64, 0.9) 100%)',
    ribbonText: 'text-[#0077B6]',
    sphereGradient: 'radial-gradient(circle at 32% 28%, #FFFFFF 0%, #E0F9FC 50%, #48CAE4 90%, #0096C7 100%)',
    sphereText: 'text-[#003049]',
    ctaGradient: 'linear-gradient(180deg, #FFFFFF 0%, #E0F9FC 60%, #90E0EF 100%)',
    ctaText: 'text-[#003049]',
    tagAccent: 'text-[#0077B6]',
  },
  emerald: {
    bgGradient: 'linear-gradient(135deg, #0F291E 0%, #165B36 52%, #229954 100%)',
    raysColor: 'rgba(134, 239, 172, 0.18)',
    floorGradient: 'linear-gradient(180deg, rgba(15, 41, 30, 0) 0%, rgba(10, 28, 20, 0.92) 100%)',
    ribbonText: 'text-[#0077B6]',
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
              style={{ backgroundImage: theme.bgGradient }}
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
                  backgroundImage:
                    'radial-gradient(circle at 62% 48%, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.08) 38%, transparent 68%)',
                }}
              />

              {/* 3D Perspective Floor Stage Reflection at Bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-16 sm:h-20 pointer-events-none border-t border-white/25"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.18) 1px, transparent 1px), ${theme.floorGradient}`,
                  backgroundSize: '48px 18px, 48px 18px, 100% 100%',
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
                        <span className="w-6 h-6 rounded-none bg-[#0096C7] text-white flex items-center justify-center shrink-0">
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
                    style={{ backgroundImage: theme.ctaGradient }}
                  >
                    {slide.ctaText || 'Add to Cart'}
                  </Link>
                </div>

                {/* CENTER COLUMN: 3D Glossy Circular "UP TO 65% OFF" Sphere */}
                <div className="hidden sm:flex md:col-span-2 items-center justify-center z-20">
                  <Link
                    href={slide.linkUrl || '/offers'}
                    className={`w-28 h-28 lg:w-32 lg:h-32 rounded-none flex flex-col items-center justify-center text-center shadow-[0_12px_28px_rgba(0,0,0,0.32),inset_0_3px_8px_rgba(255,255,255,0.8)] hover:scale-105 transition-transform shrink-0 ${theme.sphereText}`}
                    style={{ backgroundImage: theme.sphereGradient }}
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

        {/* RIGHT SIDEBAR PROMO CARD (Blue/Cyan Theme) */}
        <div className="hidden lg:flex lg:col-span-3 xl:col-span-2 bg-white rounded-none border border-[#C7F0F5] p-3.5 flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-7 h-7 rounded-none bg-gradient-to-br from-[#0052D4] to-[#00C4D8] text-white flex items-center justify-center font-black text-xs shrink-0">
                AZ
              </span>
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">
                TRY AZIP EXPRESS
              </span>
            </div>

            {/* Royal Blue to Electric Cyan Gradient Promo Box */}
            <div
              className="rounded-none p-3 text-white shadow-inner"
              style={{
                background: 'linear-gradient(145deg, #0038A8 0%, #0077B6 52%, #00C4D8 100%)',
              }}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-cyan-200 mb-1">
                <Star size={12} className="fill-amber-300 text-amber-300" />
                <span>4.9 Rated Store</span>
              </div>
              <p className="text-xs font-extrabold leading-snug mb-3">
                Fast Islandwide School Delivery
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-white/95 text-slate-900 rounded-none px-2.5 py-1.5 text-[11px] font-bold">
                  <span className="w-6 h-6 rounded-none bg-sky-100 text-[#0077B6] flex items-center justify-center shrink-0">
                    <Truck size={13} />
                  </span>
                  <span>Free Shipping</span>
                </div>

                <div className="flex items-center gap-2 bg-white/95 text-slate-900 rounded-none px-2.5 py-1.5 text-[11px] font-bold">
                  <span className="w-6 h-6 rounded-none bg-cyan-100 text-[#0096C7] flex items-center justify-center shrink-0">
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
              className="w-full py-1.5 px-3 rounded-none bg-[#041E42] hover:bg-[#0038A8] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
            >
              <Sparkles size={12} className="text-cyan-300" /> Claim Vouchers
            </Link>
          </div>
        </div>
      </div>

      {/* ── BOTTOM CAMPAIGN STRIP BANNER (Matched to Store Blue / Cyan Theme) ── */}
      <Link
        href="/offers"
        className="relative overflow-hidden rounded-none px-5 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between gap-4 border border-[#00C4D8]/60 shadow-[0_6px_20px_rgba(0,150,199,0.22)] hover:shadow-[0_8px_28px_rgba(0,196,216,0.35)] transition-all"
        style={{
          background:
            'linear-gradient(90deg, #041E42 0%, #004E98 35%, #0077B6 68%, #00B4D8 100%)',
        }}
      >
        {/* Subtle Starburst Rays */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage:
              'repeating-conic-gradient(from 0deg at 30% 50%, rgba(0, 229, 255, 0.25) 0deg 6deg, transparent 6deg 14deg)',
          }}
        />

        <div className="relative z-10 flex items-center gap-3.5">
          <div className="hidden sm:flex items-center gap-1.5">
            <img
              src="/images/hd/products/casio-fx991cw.jpg"
              alt="Calculator"
              className="w-10 h-10 rounded-none bg-white p-1 object-contain border-2 border-[#00E5FF] shadow-xs"
            />
            <img
              src="/images/hd/products/school-backpack-blue.jpg"
              alt="Backpack"
              className="w-10 h-10 rounded-none bg-white p-1 object-contain border-2 border-[#00E5FF] shadow-xs"
            />
            <img
              src="/images/hd/products/atlas-exercise-book.jpg"
              alt="Exercise Book"
              className="hidden md:block w-10 h-10 rounded-none bg-white p-1 object-contain border-2 border-[#00E5FF] shadow-xs"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#00E5FF] text-[#041E42] text-[10px] sm:text-xs font-black uppercase px-2.5 py-0.5 tracking-wider w-fit">
              <Sparkles size={13} className="fill-[#041E42]" /> MEGA STUDENT SALE
            </span>
            <span
              className="text-base sm:text-2xl font-black text-white tracking-tight uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              11.11 School &amp; Stationery Fest
            </span>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 sm:gap-3 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1.5 bg-[#0077B6] text-cyan-100 text-[11px] font-black uppercase px-3 py-1.5 rounded-none border border-[#00E5FF]/60 shadow-xs">
            <span className="w-2 h-2 bg-[#00E5FF] animate-pulse" />
            LIVE NOW
          </span>
          <span className="bg-white hover:bg-[#E0F9FC] text-[#041E42] text-xs sm:text-sm font-black uppercase px-5 sm:px-6 py-2 rounded-none border-2 border-[#00E5FF] shadow-md transition-colors">
            SHOP NOW →
          </span>
        </div>
      </Link>
    </div>
  );
}
