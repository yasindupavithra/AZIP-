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
  GraduationCap
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

/* ─── Category Cards with Legible Explicit Typography ──────────────── */

const mainCategories = [
  { slug: 'school-books', label: 'School Education & Textbooks', action: 'Shop Grade Books', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80', icon: '🎓' },
  { slug: 'exercise-books', label: 'CR & Exercise Notebooks', action: 'Shop CR Books', image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80', icon: '📓' },
  { slug: 'writing-instruments', label: 'Pens & Writing Tools', action: 'View Pilot & Pens', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80', icon: '✒️' },
  { slug: 'mathematical-instruments', label: 'Calculators & Geometry', action: 'Explore Maths', image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=600&q=80', icon: '📐' },
  { slug: 'art-craft', label: 'Fine Art & Craft Paints', action: 'Explore Studio', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80', icon: '🎨' },
  { slug: 'school-accessories', label: 'Backpacks & Accessories', action: 'Shop Backpacks', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80', icon: '🎒' },
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
  const [isBooklistModalOpen, setIsBooklistModalOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Hero Carousel Slide State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-play timer (slides every 4 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadLiveProducts() {
      try {
        const res = await fetch('/api/products?limit=40');
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
    loadLiveProducts();
  }, []);

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const displayedProducts = activeTab === 'newest'
    ? products.slice(0, 10)
    : [...products].reverse().slice(0, 10);

  // Scroll-reveal sections
  const heroRef = useInView();
  const bundlesRef = useInView();
  const dealsRef = useInView();
  const categoriesRef = useInView();
  const trustRef = useInView();
  const whatsappRef = useInView();
  const brandsRef = useInView();
  const reviewsRef = useInView();

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  return (
    <StoreShell>

      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION — Auto-sliding 5 Image Carousel
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={heroRef.ref}
        className="relative bg-gradient-to-br from-white via-slate-50 to-red-50/20 overflow-hidden font-sans"
      >
        <div className="container mx-auto py-10 md:py-16 lg:py-20 relative z-10">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center ${heroRef.isInView ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* Left: Content */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 border border-red-100 text-[#DC2626] text-[11px] font-extrabold rounded-full mb-5 uppercase tracking-wider">
                <Sparkles size={13} /> {currentSlide.tag}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.3rem] font-black text-gray-900 tracking-tight leading-[1.08] font-['Outfit'] mb-5 transition-all duration-300">
                Your Preferred Online
                <span className="block mt-2 bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#9333EA] bg-clip-text text-transparent">
                  Stationery &amp; Bookshop
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 font-medium mb-7 max-w-lg leading-relaxed transition-all duration-300">
                {currentSlide.subtitle} Grade textbooks, CR exercise books, Pilot gel pens, Casio scientific calculators, and Faber-Castell art sets delivered island-wide.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-9">
                <button
                  type="button"
                  onClick={() => setIsBooklistModalOpen(true)}
                  className="px-7 py-4 bg-gradient-to-r from-[#DC2626] to-[#E11D48] hover:from-[#B91C1C] hover:to-[#C2410C] text-white text-xs sm:text-sm font-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 uppercase tracking-wider flex items-center gap-2.5 cursor-pointer border-none"
                >
                  <Upload size={16} /> Upload School Booklist
                </button>

                <Link
                  href="/products"
                  className="px-7 py-4 bg-white hover:bg-gray-50 text-gray-900 text-xs sm:text-sm font-bold rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  Browse Catalog <ArrowRight size={15} />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-500" /> 100% Genuine Brands
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck size={16} className="text-blue-500" /> Island-wide Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard size={16} className="text-purple-500" /> Cash on Delivery
                </span>
              </div>
            </div>

            {/* Right: Auto-playing 5 Image Slider */}
            <div className="order-1 lg:order-2">
              <div className="relative group">
                
                {/* Image Slider Container with 16:9 aspect */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60 bg-slate-100 aspect-16/10">
                  
                  {HERO_SLIDES.map((slide, idx) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                        idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover scale-100 group-hover:scale-103 transition-transform duration-700"
                      />
                      
                      {/* Gradient Overlay for Text Legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                      {/* Slide Caption Overlay */}
                      <div className="absolute bottom-5 left-5 right-5 z-20 text-white">
                        <span className="inline-block px-3 py-1 bg-[#DC2626] text-white text-[10px] font-black rounded-full uppercase tracking-wider mb-1.5 shadow-sm">
                          {slide.badge}
                        </span>
                        <h3 className="text-base sm:text-xl font-black text-white leading-tight drop-shadow-sm font-['Outfit']">
                          {slide.title}
                        </h3>
                      </div>
                    </div>
                  ))}

                  {/* Left / Right Slider Controls */}
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/20 cursor-pointer"
                    title="Previous Slide"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/20 cursor-pointer"
                    title="Next Slide"
                  >
                    <ChevronRight size={20} />
                  </button>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-3 right-5 z-30 flex items-center gap-1.5">
                    {HERO_SLIDES.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={() => setCurrentSlideIndex(dotIdx)}
                        className={`h-2 rounded-full transition-all border-none cursor-pointer ${
                          dotIdx === currentSlideIndex
                            ? 'w-6 bg-[#DC2626]'
                            : 'w-2 bg-white/60 hover:bg-white'
                        }`}
                        title={`Slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                </div>

                {/* Floating Fast Delivery Badge */}
                <div className="absolute -bottom-4 left-4 bg-white rounded-2xl shadow-xl p-3.5 border border-gray-100 z-30 flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Truck size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Fast Home Delivery</div>
                    <div className="text-[10px] text-gray-500 font-medium">Island-wide express shipping</div>
                  </div>
                </div>

                {/* Floating Authentic Badge */}
                <div className="absolute -top-4 right-4 bg-white rounded-2xl shadow-xl p-3.5 border border-gray-100 z-30 flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">100% Authentic</div>
                    <div className="text-[10px] text-gray-500 font-medium">Atlas, Casio, Pilot &amp; Faber</div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          2. Back to School Kit Showcase
          ═══════════════════════════════════════════════════ */}
      <section ref={bundlesRef.ref} className="py-12 bg-slate-900 text-white font-sans">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#DC2626] uppercase tracking-wider mb-1">
                <Sparkles size={14} className="fill-[#DC2626]" /> One-Click Bundles
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-['Outfit']">
                Back to School Master Kit Bundles
              </h2>
            </div>
            <Link href="/products" className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1">
              View All Bundles <ArrowRight size={14} />
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
          3. Category Cards with Legible Typography
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={categoriesRef.ref}
        className="section-spacing bg-white font-sans"
      >
        <div className="container mx-auto px-4">
          
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="section-label"><Sparkles size={13} /> Categories</div>
              <h2 className="section-title">Explore Main Categories</h2>
              <p className="section-subtitle">Categorized for fast browsing</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#DC2626] hover:text-[#B91C1C]"
            >
              View Full Catalog <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {mainCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-[#DC2626]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-3.5 flex flex-col items-center text-center overflow-hidden"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-3 shadow-xs flex items-center justify-center p-2">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-bold text-xs text-gray-900 group-hover:text-[#DC2626] transition-colors leading-snug line-clamp-2 mb-1">
                  {cat.label}
                </h3>
                <span className="text-[10px] font-bold text-[#DC2626] group-hover:underline">
                  {cat.action} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          4. FEATURED PRODUCTS CATALOG GRID
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={dealsRef.ref}
        className="section-spacing bg-gray-50/70 font-sans"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="section-label">
                <Zap size={13} /> Recommended Items
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-['Outfit']">
                Featured Educational Products
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-gray-200/60 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('newest')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border-none ${
                  activeTab === 'newest'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Top Picks
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border-none ${
                  activeTab === 'trending'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'bg-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Trending
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-bold rounded-xl shadow-md transition-all hover:scale-105"
            >
              View Full Stationery Catalog <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          5. WHATSAPP & BOOKLIST DIRECT ORDER CTA
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={whatsappRef.ref}
        className="py-14 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden font-sans"
      >
        <div className="container mx-auto px-4 text-center relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-extrabold mb-4 border border-emerald-500/20">
            <MessageCircle size={15} /> School Booklist Direct Order
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] mb-3">
            Send School Booklist for Quick Home Delivery
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium mb-6 leading-relaxed">
            Upload your booklist document/image or send via WhatsApp for an instant price estimate with island-wide home delivery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsBooklistModalOpen(true)}
              className="px-6 py-3 bg-[#DC2626] hover:bg-[#b91c1c] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer border-none"
            >
              <Upload size={15} /> Upload Booklist Online
            </button>

            <a
              href="https://wa.me/94770000000?text=Hello%20AZIP%20Store%2C%20I%20have%20a%20school%20booklist%20inquiry"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle size={15} /> Send via WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          6. TOP BRANDS WE STOCK
          ═══════════════════════════════════════════════════ */}
      <section ref={brandsRef.ref} className="py-12 bg-white font-sans">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="section-label justify-center"><BadgeCheck size={13} /> Genuine Guarantee</div>
            <h2 className="section-title text-center">Top Brands Authorized</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {brandLogos.map((b) => (
              <Link
                key={b.name}
                href={`/products?search=${encodeURIComponent(b.name)}`}
                className="group p-4 rounded-xl border border-gray-100 bg-slate-50/50 hover:bg-white hover:border-[#DC2626]/20 hover:shadow-md transition-all text-center"
              >
                <div className="font-black text-sm text-gray-800 group-hover:text-[#DC2626] transition-colors">
                  {b.name}
                </div>
                <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {b.tag}
                </div>
              </Link>
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
