'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Truck,
  HeadphonesIcon,
  Award,
  ArrowRight,
  Flame,
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Star,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CreditCard,
  Zap,
  Package,
  BadgeCheck,
  Gift,
  Upload,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Users,
  Check
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import ProductCard from '@/components/ProductCard';
import BackToSchoolBundleCard from '@/components/BackToSchoolBundleCard';
import BooklistUploadModal from '@/components/BooklistUploadModal';
import { INITIAL_CATALOG_PRODUCTS, STORE_CATEGORIES, BACK_TO_SCHOOL_BUNDLES } from '@/lib/catalog';
import { useCartStore } from '@/store/cart';

/* ─── Hero Slider Data (5 High Quality Slides) ─────────────────────── */

const HERO_SLIDES = [
  {
    id: 1,
    image: '/hero/slide1.jpg',
    badge: 'Complete Stationery Sets',
    title: 'Vibrant Art & School Supplies',
    subtitle: 'Atlas, Pilot gel pens, geometry sets & watercolor sketchbooks.',
    tag: '100% Genuine Brands',
  },
  {
    id: 2,
    image: '/hero/slide2.jpg',
    badge: 'School Education',
    title: 'Grade Textbooks & CR Books',
    subtitle: 'High-grade 80gsm paper CR books from Grade 1 to A/L.',
    tag: 'Syllabus Approved',
  },
  {
    id: 3,
    image: '/hero/slide3.jpg',
    badge: 'Artist Studio Corner',
    title: 'Faber-Castell & Mont Marte',
    subtitle: 'Watercolour pencils, acrylic paints, brushes & drawing pads.',
    tag: 'Artist Choice',
  },
  {
    id: 4,
    image: '/hero/slide4.jpg',
    badge: 'Exam Approved Tech',
    title: 'Casio Scientific Calculators',
    subtitle: 'Authentic FX-991CW ClassWiz with 3-year warranty & USB drives.',
    tag: 'Authorized Warranty',
  },
  {
    id: 5,
    image: '/hero/slide5.jpg',
    badge: 'Backpacks & Gear',
    title: 'Ergonomic School Backpacks',
    subtitle: 'Waterproof multi-pocket backpacks & essential student gear.',
    tag: 'Islandwide Express',
  },
];

/* ─── Main Category List ───────────────────────────────────────────── */

const mainCategories = [
  { slug: 'school-books', label: 'School Education & Textbooks', action: 'Shop Grade Books', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80', icon: '🎓' },
  { slug: 'exercise-books', label: 'CR & Exercise Notebooks', action: 'Shop CR Books', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80', icon: '📓' },
  { slug: 'writing-instruments', label: 'Pens & Writing Tools', action: 'View Pilot & Pens', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80', icon: '✒️' },
  { slug: 'mathematical-instruments', label: 'Calculators & Geometry', action: 'Explore Maths', image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=600&q=80', icon: '📐' },
  { slug: 'art-craft', label: 'Fine Art & Craft Paints', action: 'Explore Studio', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80', icon: '🎨' },
  { slug: 'school-accessories', label: 'Backpacks & Accessories', action: 'Shop Backpacks', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', icon: '🎒' },
];

/* ─── Store Features / Value Propositions ─────────────────────────── */

const storeFeatures = [
  {
    icon: ShieldCheck,
    title: '100% Genuine Guarantee',
    desc: 'Direct from authorized agents for Atlas, Casio, Pilot & Faber-Castell.',
    color: 'text-red-600 bg-red-50 border-red-100',
  },
  {
    icon: Truck,
    title: 'Islandwide Express Delivery',
    desc: 'Fast 24-48h shipping straight to your doorstep across Sri Lanka.',
    color: 'text-blue-600 bg-blue-50 border-blue-100',
  },
  {
    icon: CreditCard,
    title: 'Cash on Delivery Available',
    desc: 'Pay conveniently upon receiving your order at home or school.',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  },
  {
    icon: Upload,
    title: 'Booklist Direct Upload',
    desc: 'Upload your school list document for an instant total quotation.',
    color: 'text-purple-600 bg-purple-50 border-purple-100',
  },
];

const statsData = [
  { value: '50,000+', label: 'Students & Parents Served' },
  { value: '100%', label: 'Genuine Brand Guarantee' },
  { value: '25 Districts', label: 'Islandwide Home Delivery' },
  { value: '4.9 / 5.0★', label: 'Customer Rating' },
];

const brandLogos = [
  { name: 'Atlas', tag: 'Sri Lanka #1 Stationery' },
  { name: 'Casio', tag: 'Scientific Calculators' },
  { name: 'Pilot', tag: 'Smooth Gel & Ballpoint' },
  { name: 'Faber-Castell', tag: 'Fine Art & Colours' },
  { name: 'Oxford', tag: 'Dictionaries & Geometry' },
  { name: 'Mont Marte', tag: 'Studio Art & Canvases' },
  { name: 'Stabilo', tag: 'Boss Highlighters' },
  { name: 'SanDisk', tag: 'High-speed Storage' },
  { name: 'Nataraj', tag: 'Writing Pencils' },
  { name: 'Kangaro', tag: 'Heavy Duty Staplers' },
];

const customerReviews = [
  {
    id: 1,
    name: 'Kavindu Senanayake',
    role: 'A/L Physical Science Student, Kandy',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    content: 'Bought my Casio FX-991CW calculator and Pilot pens from AZIP Store. Received them next day in perfect original packaging. Best bookshop in Kandy!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Dilini Wickramasinghe',
    role: 'Mother of 2 School Kids, Peradeniya',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    content: "I uploaded my children's school booklist online and AZIP team packed every single item and delivered straight to my doorstep. Super convenient!",
    rating: 5,
  },
  {
    id: 3,
    name: 'Nadeesh Fernando',
    role: 'Graphic Design & Fine Arts Student',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    content: 'The Faber-Castell watercolour pencils and Mont Marte acrylic paints are 100% genuine and priced way better than other stores in town.',
    rating: 5,
  },
];

/* ─── Scroll Animation Hook ──────────────────────────── */

function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

/* ─── Component ──────────────────────────────────────── */

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'newest' | 'trending'>('newest');
  const [products, setProducts] = useState(INITIAL_CATALOG_PRODUCTS);
  const [heroSlides, setHeroSlides] = useState<any[]>(HERO_SLIDES);
  const [isBooklistModalOpen, setIsBooklistModalOpen] = useState(false);

  // Hero Carousel Slide State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-play timer (slides every 4 seconds)
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch('/api/products?limit=50');
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live products on home page:', err);
      }
    }

    async function loadLiveBanners() {
      try {
        const res = await fetch('/api/banners');
        if (res.ok) {
          const data = await res.json();
          if (data.banners && data.banners.length > 0) {
            const mapped = data.banners.map((b: any, idx: number) => ({
              id: b._id || idx,
              image: b.image,
              badge: b.badge || 'Special Offer',
              title: b.title,
              subtitle: b.subtitle,
              linkUrl: b.linkUrl || '/products',
            }));
            setHeroSlides(mapped);
          }
        }
      } catch (err) {
        console.warn('Could not fetch live banners on home page:', err);
      }
    }

    loadLiveProducts();
    loadLiveBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const displayedProducts = activeTab === 'newest'
    ? products.slice(0, 12)
    : [...products].reverse().slice(0, 12);

  // Scroll-reveal sections
  const heroRef = useInView();
  const featuresRef = useInView();
  const categoriesRef = useInView();
  const bundlesRef = useInView();
  const dealsRef = useInView();
  const whatsappRef = useInView();
  const brandsRef = useInView();
  const reviewsRef = useInView();

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <StoreShell>

      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION — Full Width Banner Carousel (Daraz Layout)
          ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef.ref}
        className="relative bg-slate-50/70 font-sans border-b border-slate-100 pt-8 sm:pt-12 pb-8 sm:pb-12"
      >
        <div className="container mx-auto px-4">

          {/* Main Full-Width Banner Slider Container */}
          <div className="relative group rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900 h-[280px] sm:h-[380px] lg:h-[440px] mt-2 sm:mt-4">

            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark Gradient Overlay for optimal text legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent flex items-center" />

                {/* Banner Text Overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-2xl text-white">

                  <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#E11D48] text-white text-[10px] sm:text-xs font-extrabold rounded-full uppercase tracking-widest mb-3 sm:mb-4 w-fit shadow-md">
                    <Sparkles size={13} className="fill-white" />
                    <span>{slide.badge}</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-[1.15] drop-shadow-lg font-['Outfit'] tracking-tight mb-3 sm:mb-4">
                    {slide.title}
                  </h2>

                  <p className="text-xs sm:text-base text-slate-100 font-medium leading-relaxed tracking-wide max-w-lg drop-shadow-sm mb-4">
                    {slide.subtitle}
                  </p>

                  {slide.linkUrl && (
                    <Link
                      href={slide.linkUrl}
                      className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be123c] text-white px-5 py-2.5 rounded-xl text-xs font-black w-fit shadow-lg transition-all hover:scale-105 border border-rose-300/30 font-['Outfit'] uppercase tracking-wider"
                    >
                      <span>Explore Offer</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}

                </div>
              </div>
            ))}

            {/* Slider Arrow Controls */}
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/20 cursor-pointer backdrop-blur-md shadow-lg"
              title="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/20 cursor-pointer backdrop-blur-md shadow-lg"
              title="Next Slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Slider Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-slate-950/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              {heroSlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlideIndex(dotIdx)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all border-none cursor-pointer ${dotIdx === currentSlideIndex
                      ? 'w-6 sm:w-8 bg-[#E11D48]'
                      : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white'
                    }`}
                  title={`Slide ${dotIdx + 1}`}
                />
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. FEATURE HIGHLIGHTS BAR (Clean White Card Row)
          ═══════════════════════════════════════════════════ */}
      <section ref={featuresRef.ref} className="py-12 bg-white border-b border-slate-100 font-sans">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {storeFeatures.map((feat, i) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${feat.color}`}>
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 font-['Outfit'] mb-1">
                      {feat.title}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          3. EXPLORE MAIN CATEGORIES (Clean White Cards)
          ═══════════════════════════════════════════════════ */}
      <section
        ref={categoriesRef.ref}
        className="section-spacing bg-white font-sans"
      >
        <div className="container mx-auto px-4">

          <div className="flex items-end justify-between mb-9">
            <div>
              <div className="section-label"><Sparkles size={13} /> Store Categories</div>
              <h2 className="section-title">Explore Main Categories</h2>
              <p className="section-subtitle">Find grade textbooks, CR notebooks, writing instruments &amp; fine art supplies</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-all"
            >
              <span>View Full Catalog</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {mainCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/80 hover:border-red-500/40 shadow-xs hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1.5 p-4 flex flex-col items-center text-center overflow-hidden card-shine"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3.5 shadow-2xs flex items-center justify-center p-2.5 border border-slate-100">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-red-600 transition-colors leading-snug line-clamp-2 mb-1.5">
                  {cat.label}
                </h3>
                <span className="text-[10px] sm:text-xs font-black text-red-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  {cat.action} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. BACK TO SCHOOL MASTER KITS (Light Neutral Section)
          ═══════════════════════════════════════════════════ */}
      <section ref={bundlesRef.ref} className="py-16 bg-slate-50/80 text-slate-900 font-sans border-y border-slate-200/60 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 uppercase tracking-wider mb-2 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                <Sparkles size={14} className="fill-red-600" /> One-Click Complete Bundles
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                Back to School Master Kits
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Pre-packed essentials matched to student grade syllabuses</p>
            </div>
            <Link href="/products" className="text-xs font-extrabold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 bg-white hover:bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/80 transition-all shadow-2xs">
              <span>View All Bundles</span>
              <ArrowRight size={14} className="text-red-600" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BACK_TO_SCHOOL_BUNDLES.map((bundle) => (
              <BackToSchoolBundleCard key={bundle.id} bundle={bundle} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. FEATURED PRODUCTS CATALOG GRID (Widescreen 5-6 Cols)
          ═══════════════════════════════════════════════════ */}
      <section
        ref={dealsRef.ref}
        className="section-spacing bg-white font-sans"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-9">
            <div>
              <div className="section-label">
                <Zap size={13} /> Recommended Items
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-['Outfit']">
                Featured Educational Products
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
              <button
                onClick={() => setActiveTab('newest')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer border-none ${activeTab === 'newest'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'bg-transparent text-slate-600 hover:text-slate-900'
                  }`}
              >
                Top Picks
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer border-none ${activeTab === 'trending'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'bg-transparent text-slate-600 hover:text-slate-900'
                  }`}
              >
                Trending
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                image={product.images[0]?.url || ''}
                category={product.category}
                stock={product.stock}
                brand={product.brand}
                badge={product.badge}
                variants={product.variants}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-black rounded-2xl shadow-md hover:scale-105"
            >
              <span>View Full Stationery Catalog</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. WHATSAPP & BOOKLIST DIRECT ORDER CTA
          ═══════════════════════════════════════════════════ */}
      <section
        ref={whatsappRef.ref}
        className="py-16 bg-[#E11D48] text-white relative overflow-hidden font-sans border-y border-rose-400/30 shadow-md"
      >
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white rounded-full text-xs font-black mb-4 border border-white/30 shadow-xs backdrop-blur-md">
            <Sparkles size={14} className="text-amber-300 animate-pulse" />
            <span>School Booklist Direct Order</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black font-['Outfit'] mb-3.5 tracking-tight text-white drop-shadow-sm">
            Send School Booklist for Quick Home Delivery
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium mb-8 leading-relaxed max-w-xl mx-auto">
            Upload your booklist document or photo to get an instant price estimate with island-wide doorstep delivery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setIsBooklistModalOpen(true)}
              className="px-8 py-4 bg-white hover:bg-rose-50 text-[#E11D48] text-xs sm:text-sm font-black rounded-2xl shadow-xl hover:scale-105 flex items-center gap-2.5 cursor-pointer border-none font-['Outfit'] uppercase tracking-wider transition-all"
            >
              <Upload size={18} /> Upload Booklist Online
            </button>

            <a
              href="https://wa.me/94770000000?text=Hello%20AZIP%20Store%2C%20I%20have%20a%20school%20booklist%20inquiry"
              target="_blank"
              rel="noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2.5 cursor-pointer border-none font-['Outfit'] uppercase tracking-wider"
            >
              <MessageCircle size={18} /> Order via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          7. TOP GENUINE BRANDS GRID
          ═══════════════════════════════════════════════════ */}
      <section ref={brandsRef.ref} className="py-14 bg-white font-sans border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="section-label justify-center"><BadgeCheck size={13} /> Genuine Guarantee</div>
            <h2 className="section-title text-center">Authorised &amp; 100% Genuine Brands</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3.5">
            {brandLogos.map((brand, idx) => (
              <Link
                key={idx}
                href={`/products?search=${encodeURIComponent(brand.name)}`}
                className="p-4 bg-white rounded-xl border border-slate-200/80 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:shadow-md hover:border-red-300 transition-all cursor-pointer shadow-2xs"
              >
                <span className="font-black text-sm text-slate-900 font-['Outfit']">
                  {brand.name}
                </span>
                <span className="text-[9px] text-slate-500 font-semibold truncate max-w-full mt-0.5">
                  {brand.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          8. CUSTOMER TESTIMONIALS
          ═══════════════════════════════════════════════════ */}
      <section ref={reviewsRef.ref} className="section-spacing bg-slate-50/70 font-sans">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="section-label justify-center"><Star size={13} className="fill-amber-400 text-amber-400" /> Customer Testimonials</div>
            <h2 className="section-title">Loved by Students &amp; Parents</h2>
            <p className="section-subtitle">Real feedback from our customers across Kandy &amp; Sri Lanka</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6 italic">
                    "{rev.content}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{rev.name}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booklist Direct Upload Modal */}
      <BooklistUploadModal
        isOpen={isBooklistModalOpen}
        onClose={() => setIsBooklistModalOpen(false)}
      />

    </StoreShell>
  );
}
