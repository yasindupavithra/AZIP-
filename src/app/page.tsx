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
  RotateCcw,
  CreditCard,
  Zap,
  Package,
  BadgeCheck,
  Gift
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import ProductCard from '@/components/ProductCard';
import { INITIAL_CATALOG_PRODUCTS, STORE_CATEGORIES } from '@/lib/catalog';
import { useCartStore } from '@/store/cart';

/* ─── Data ────────────────────────────────────────────── */

const mainCategories = [
  { slug: 'books', label: 'Books & Textbooks', action: 'Explore Books', image: '/categories/cat_books.jpg', icon: '📚' },
  { slug: 'exercise-books', label: 'Exercise & CR Books', action: 'Shop CR Books', image: '/categories/cat_stationery.jpg', icon: '📓' },
  { slug: 'writing-instruments', label: 'Pens & Stationery', action: 'View Pens', image: '/categories/cat_gifts.jpg', icon: '✒️' },
  { slug: 'art-craft', label: 'Fine Art & Craft', action: 'Explore Studio', image: '/categories/cat_art.jpg', icon: '🎨' },
  { slug: 'school-accessories', label: 'School Gear & Bags', action: 'Shop Gear', image: '/categories/cat_school.jpg', icon: '🎒' },
  { slug: 'electronics', label: 'Calculators & Tech', action: 'Shop Tech', image: '/categories/cat_lifestyle.jpg', icon: '🖩' },
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
    content: "I sent my children's school booklist via WhatsApp and AZIP team packed every single item and delivered straight to my doorstep. Super convenient!",
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
  const [products] = useState(INITIAL_CATALOG_PRODUCTS);
  const addItem = useCartStore((s) => s.addItem);

  const displayedProducts = activeTab === 'newest'
    ? products.slice(0, 8)
    : [...products].reverse().slice(0, 8);

  // Scroll-reveal sections
  const heroRef = useInView();
  const dealsRef = useInView();
  const bannersRef = useInView();
  const categoriesRef = useInView();
  const trustRef = useInView();
  const whatsappRef = useInView();
  const brandsRef = useInView();
  const reviewsRef = useInView();

  return (
    <StoreShell>

      {/* ═══════════════════════════════════════════════════
          1. HERO SECTION — Full Width with Premium Image
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={heroRef.ref}
        className="relative bg-gradient-to-br from-white via-slate-50 to-red-50/20 overflow-hidden"
      >
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-red-100/30 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-50/40 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-purple-50/20 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="container mx-auto py-14 md:py-20 lg:py-24 relative z-10">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${heroRef.isInView ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* Left: Content */}
            <div className={`${heroRef.isInView ? 'animate-slide-left' : ''} order-2 lg:order-1`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 text-[#DC2626] text-[11px] font-bold rounded-full mb-7 uppercase tracking-wider">
                <Sparkles size={13} /> Trusted by 10,000+ Students
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 tracking-tight leading-[1.08] font-['Outfit'] mb-6">
                Your One-Stop Shop for
                <span className="block mt-2 bg-gradient-to-r from-[#DC2626] via-[#E11D48] to-[#9333EA] bg-clip-text text-transparent">
                  Education & Stationery
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-500 font-medium mb-9 max-w-lg leading-relaxed">
                Premium books, Atlas CR notebooks, Casio calculators, Faber-Castell art sets — delivered island-wide in 24-72 hours with Cash on Delivery.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 transition-all duration-300 hover:-translate-y-1 uppercase tracking-wider flex items-center gap-2.5"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>

                <Link
                  href="/offers"
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 text-sm font-bold rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex items-center gap-2.5"
                >
                  <Flame size={16} className="text-[#DC2626]" /> View Deals
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] font-semibold text-gray-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={17} className="text-emerald-500" /> 100% Genuine Brands
                </span>
                <span className="flex items-center gap-2">
                  <Truck size={17} className="text-blue-500" /> Island-wide Delivery
                </span>
                <span className="flex items-center gap-2">
                  <CreditCard size={17} className="text-purple-500" /> Cash on Delivery
                </span>
              </div>
            </div>

            {/* Right: Stunning Hero Image */}
            <div className={`order-1 lg:order-2 ${heroRef.isInView ? 'animate-slide-right' : ''}`}>
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-900/10 border border-white/50">
                  <img
                    src="/mockup/hero_premium.jpg"
                    alt="Premium Stationery & Educational Materials — Colorful pencils, calculator, art supplies, and backpack arranged in a stunning flat-lay"
                    className="w-full h-[320px] sm:h-[380px] lg:h-[440px] object-cover"
                  />
                  {/* Subtle gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 pointer-events-none" />
                </div>

                {/* Floating badge: Free Delivery */}
                <div className="absolute -bottom-4 left-4 sm:-bottom-5 sm:-left-5 bg-white rounded-2xl shadow-xl shadow-gray-900/10 p-3.5 border border-gray-100 animate-fade-in delay-500 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Truck size={22} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Free Delivery</div>
                      <div className="text-[10px] text-gray-400 font-medium">Orders above Rs 3,000</div>
                    </div>
                  </div>
                </div>

                {/* Floating badge: Authorized */}
                <div className="absolute -top-4 right-4 sm:-top-5 sm:-right-5 bg-white rounded-2xl shadow-xl shadow-gray-900/10 p-3.5 border border-gray-100 animate-fade-in delay-700 z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Award size={22} className="text-amber-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">Authorized</div>
                      <div className="text-[10px] text-gray-400 font-medium">All brands genuine</div>
                    </div>
                  </div>
                </div>

                {/* Floating stats badge */}
                <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-3 border border-white/50 animate-fade-in delay-800 z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#DC2626] flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-white">A</div>
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-white">C</div>
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-white">P</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-900">10K+ Happy Customers</div>
                      <div className="flex gap-0.5 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={9} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          2. EXPLORE NEWEST — Full Width Products
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={dealsRef.ref}
        className="section-spacing bg-white"
      >
        <div className="container mx-auto">
          <div className={`${dealsRef.isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              
            {/* Header with Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="section-label">
                  <Zap size={13} /> Fresh Arrivals
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight font-['Outfit']">
                  Explore The Newest
                </h2>
              </div>

              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setActiveTab('newest')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border-none ${
                    activeTab === 'newest'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'bg-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  New Arrivals
                </button>
                <button
                  onClick={() => setActiveTab('trending')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border-none ${
                    activeTab === 'trending'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'bg-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Trending
                </button>
              </div>
            </div>

            {/* Product Grid — Full Width */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
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
                />
              ))}
            </div>

            {/* View All */}
            <div className="mt-10 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all hover:-translate-y-0.5"
              >
                View All Products <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          3. SERVICE BANNERS — Three Premium Cards
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={bannersRef.ref}
        className="section-spacing bg-gray-50/70"
      >
        <div className="container mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${bannersRef.isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            
            {/* Booklist */}
            <div className="group bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Package size={24} className="text-emerald-600" />
                </div>
                <h3 className="font-['Outfit'] font-bold text-lg text-gray-900 mb-2">
                  School Booklist Packs
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  Grade 1 to A/L term booklist bundle packs with covers, pens, and Atlas exercise books packed for you.
                </p>
              </div>
              <a
                href="https://wa.me/94770000000?text=Hello%2C%20I%20have%20a%20school%20booklist%20to%20order"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
              >
                Send on WhatsApp <ArrowRight size={14} />
              </a>
            </div>

            {/* Art Studio */}
            <div className="group bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Gift size={24} className="text-[#DC2626]" />
                </div>
                <h3 className="font-['Outfit'] font-bold text-lg text-gray-900 mb-2">
                  Faber-Castell & Mont Marte
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  Watercolour pencils, canvases, acrylic sets, and drawing tools for students and artists.
                </p>
              </div>
              <Link
                href="/products?category=art-craft"
                className="text-sm font-bold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1.5 transition-colors"
              >
                Explore Art Supplies <ArrowRight size={14} />
              </Link>
            </div>

            {/* Calculators */}
            <div className="group bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap size={24} className="text-blue-600" />
                </div>
                <h3 className="font-['Outfit'] font-bold text-lg text-gray-900 mb-2">
                  Casio & SanDisk Tech
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  Genuine ClassWiz scientific calculators with 3-year warranty and high-speed USB flash drives.
                </p>
              </div>
              <Link
                href="/products?category=electronics"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
              >
                View Tech Catalog <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          4. SHOP BY CATEGORY — Clean Icon Grid
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={categoriesRef.ref}
        className="section-spacing bg-white"
      >
        <div className="container mx-auto">
          
          <div className={`flex items-end justify-between mb-10 ${categoriesRef.isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div>
              <div className="section-label"><Sparkles size={13} /> Browse</div>
              <h2 className="section-title">Featured Categories</h2>
              <p className="section-subtitle">Explore by category for faster shopping</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-[#DC2626] hover:text-[#B91C1C] transition-colors"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 ${categoriesRef.isInView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            {mainCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 hover:border-[#DC2626]/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-4 flex flex-col items-center text-center overflow-hidden"
              >
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-white mb-4 shadow-sm">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <h3 className="font-['Outfit'] font-bold text-sm text-gray-900 group-hover:text-[#DC2626] transition-colors leading-snug line-clamp-1 mb-1">
                  {cat.label}
                </h3>
                <span className="text-[11px] font-semibold text-gray-400 group-hover:text-[#DC2626]/70 transition-colors">
                  {cat.action} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          5. TRUST BAR — Full Width with Icons
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={trustRef.ref}
        className="bg-gray-900 text-white py-14"
      >
        <div className={`container mx-auto ${trustRef.isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Truck size={28} />, title: 'Island Wide Delivery', desc: 'Fast 24-72 hours to all cities', color: 'bg-blue-500/10 text-blue-400' },
              { icon: <Award size={28} />, title: '100% Genuine Brands', desc: 'Authorized manufacturer warranty', color: 'bg-amber-500/10 text-amber-400' },
              { icon: <HeadphonesIcon size={28} />, title: 'Dedicated Support', desc: 'Direct WhatsApp & Hotline', color: 'bg-emerald-500/10 text-emerald-400' },
              { icon: <RotateCcw size={28} />, title: 'Easy Returns', desc: 'Hassle-free 7-day exchange', color: 'bg-purple-500/10 text-purple-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">{item.title}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          6. WHATSAPP BOOKLIST CTA — Premium Dark Section
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={whatsappRef.ref}
        className="section-spacing bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] pointer-events-none" />
        
        <div className={`container mx-auto relative z-10 ${whatsappRef.isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-full text-[11px] font-bold uppercase tracking-wider mb-6 border border-emerald-500/20">
              <MessageCircle size={14} /> Direct WhatsApp Service
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-['Outfit'] leading-tight mb-4">
              Have a School Booklist or
              <br />Bulk Requirement?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed max-w-lg mx-auto mb-8">
              Snap a photo of your school booklist or office requirements and send it on WhatsApp. 
              Our team will pack and deliver straight to your address.
            </p>

            <a
              href="https://wa.me/94770000000?text=Hello%20AZIP%20Store%2C%20I%20would%20like%20to%20order%20stationery%2Fbooks"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl uppercase tracking-wider animate-pulse-glow"
            >
              <MessageCircle size={20} />
              Send Booklist on WhatsApp
            </a>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          7. TOP BRANDS — Scrollable Showcase
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={brandsRef.ref}
        className="section-spacing bg-white"
      >
        <div className="container mx-auto">
          <div className={`text-center mb-10 ${brandsRef.isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-label justify-center"><BadgeCheck size={13} /> Authenticity Guaranteed</div>
            <h2 className="section-title text-center">Official Brands We Stock</h2>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-5 gap-4 ${brandsRef.isInView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            {brandLogos.map((b) => (
              <Link
                key={b.name}
                href={`/products?search=${encodeURIComponent(b.name)}`}
                className="group p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#DC2626]/20 hover:shadow-md transition-all duration-300 text-center cursor-pointer hover:-translate-y-1"
              >
                <div className="font-['Outfit'] font-black text-base text-gray-800 group-hover:text-[#DC2626] transition-colors">
                  {b.name}
                </div>
                <div className="text-[11px] text-gray-400 font-medium mt-1">
                  {b.tag}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════
          8. CUSTOMER REVIEWS — Premium Testimonials
          ═══════════════════════════════════════════════════ */}
      <section 
        ref={reviewsRef.ref}
        className="section-spacing bg-gray-50/70"
      >
        <div className="container mx-auto">
          <div className={`text-center max-w-md mx-auto mb-12 ${reviewsRef.isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-label justify-center"><Star size={13} className="fill-[#DC2626]" /> Reviews</div>
            <h2 className="section-title text-center">What Our Customers Say</h2>
            <p className="section-subtitle mx-auto text-center">
              Trusted by 10,000+ students, schools, teachers, and university faculties.
            </p>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${reviewsRef.isInView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
            {customerReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-7 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    &ldquo;{rev.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{rev.name}</h4>
                    <p className="text-[11px] text-gray-400 font-medium">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </StoreShell>
  );
}

function ShoppingBag(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}
