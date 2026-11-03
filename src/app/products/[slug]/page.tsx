'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  MessageCircle,
  Heart,
  Share2,
  Check,
  CheckCircle2,
  MapPin,
  Banknote,
  Store,
  Zap,
  HelpCircle,
  ThumbsUp,
  X,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Clock,
  Award,
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import ProductCard from '@/components/ProductCard';
import ProductImageZoom from '@/components/ProductImageZoom';
import { useCartStore } from '@/store/cart';
import {
  getCategoryLabel,
  getCategoryImage,
  INITIAL_CATALOG_PRODUCTS,
  CatalogProduct,
  resolveProductBySlugOrId,
} from '@/lib/catalog';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images?: Array<{ url: string; alt?: string }>;
  category: string;
  subcategory?: string;
  stock: number;
  specifications?: Record<string, string>;
  sku?: string;
  brand?: string;
  grade?: string;
  language?: string;
  rulingType?: string;
  rating?: number;
  reviewsCount?: number;
  badge?: string;
  tags?: string[];
  variants?: Array<{ name: string; options: string[] }>;
}

const SRI_LANKA_LOCATIONS = [
  { region: 'Western Province', city: 'Colombo 1-15, Colombo Fort', fee: 300, days: '1-2 Days' },
  { region: 'Western Province', city: 'Gampaha, Negombo, Kelaniya', fee: 300, days: '2-3 Days' },
  { region: 'Central Province', city: 'Kandy - City Center & Peradeniya', fee: 250, days: '24 Hours' },
  { region: 'Central Province', city: 'Matale, Katugastota, Kundasale', fee: 250, days: '1-2 Days' },
  { region: 'Southern Province', city: 'Galle, Matara, Weligama', fee: 350, days: '2-3 Days' },
  { region: 'North Western', city: 'Kurunegala, Kuliyapitiya, Chilaw', fee: 300, days: '2-3 Days' },
  { region: 'All Other Districts', city: 'Jaffna, Badulla, Anuradhapura, Ratnapura', fee: 350, days: '2-4 Days' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useCartStore((s) => s.setCartOpen);

  const [product, setProduct] = useState<Product | null>(() =>
    resolveProductBySlugOrId(slug, INITIAL_CATALOG_PRODUCTS) as Product | null
  );
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('Standard Edition');
  const [activeTab, setActiveTab] = useState<'details' | 'specifications' | 'reviews' | 'qa'>('details');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(SRI_LANKA_LOCATIONS[2]); // Kandy default
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | '5' | 'with-images'>('all');

  useEffect(() => {
    const resolvedLocal = resolveProductBySlugOrId(slug, INITIAL_CATALOG_PRODUCTS);
    if (resolvedLocal) {
      setProduct(resolvedLocal as any);
    }

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.product) {
            setProduct(data.product);
            return;
          }
        }
      } catch {
        // Use local resolved product
      }
      const fallback = resolveProductBySlugOrId(slug, INITIAL_CATALOG_PRODUCTS);
      if (fallback) {
        setProduct(fallback as any);
      }
    }
    fetchProduct();
  }, [slug]);

  // Multi-angle realistic gallery generator for authentic Daraz-style thumbnail strip
  const galleryImages = useMemo(() => {
    if (!product) return [];

    if (product.images && product.images.length > 1) {
      return product.images;
    }

    const primary = (product.images && product.images[0]?.url) || getCategoryImage(product.category);

    const categoryAngles: Record<string, string[]> = {
      'school-books': [
        '/images/hd/products/sl-textbooks-stack.jpg',
        '/images/hd/products/sl-scholarship-workbooks.jpg',
        '/images/hd/products/atlas-exercise-book.jpg',
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
        '/images/hd/products/atlas-exercise-book.jpg',
      ],
      'art-craft': [
        '/images/hd/products/sl-art-pencils-paints.jpg',
        '/images/hd/products/faber-castell-water-color.jpg',
        '/images/hd/products/drawing-kit.jpg',
      ],
      books: [
        '/images/hd/products/sl-dictionary-novels.jpg',
        '/images/cat_books_4k.jpg',
        '/images/hd/products/sl-textbooks-stack.jpg',
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
      ],
      'files-organization': [
        '/images/hd/products/sl-files-binders.jpg',
        '/images/hd/products/sl-button-folders-organizer.jpg',
        '/images/hd/products/sl-office-paper-stapler.jpg',
      ],
      'educational-materials': [
        '/products/globe.jpg',
        '/images/hd/products/sl-scholarship-workbooks.jpg',
        '/images/hd/products/sl-textbooks-stack.jpg',
      ],
      'preschool-kids': [
        '/images/hd/products/sl-preschool-crayons-clay.jpg',
        '/images/hd/products/sl-scholarship-workbooks.jpg',
        '/images/hd/products/faber-castell-water-color.jpg',
      ],
      'science-laboratory': [
        '/products/microscope.jpg',
        '/products/globe.jpg',
        '/images/hd/products/casio-fx991cw.jpg',
      ],
      'gifts-accessories': [
        '/images/hd/products/sl-executive-gift-pen.jpg',
        '/images/cat_gifts_4k.jpg',
        '/images/hd/products/drawing-kit.jpg',
      ],
      electronics: [
        '/images/hd/products/sl-electronics-study.jpg',
        '/images/hd/products/casio-fx991cw.jpg',
        '/images/hd/products/geometry-set.jpg',
      ],
    };

    const extras = categoryAngles[product.category] || [
      '/images/hd/products/atlas-exercise-book.jpg',
      '/images/hd/products/pilot-g2-pens.jpg',
      '/images/hd/products/geometry-set.jpg',
    ];

    return [
      { url: primary, alt: `${product.name} - Front View` },
      { url: extras[0], alt: `${product.name} - Studio View 2` },
      { url: extras[1], alt: `${product.name} - Studio View 3` },
      { url: extras[2], alt: `${product.name} - Studio View 4` },
    ];
  }, [product]);

  if (loading) {
    return (
      <StoreShell>
        <div className="container py-24 text-center">
          <div className="w-10 h-10 border-3 border-[#0066FF] border-t-transparent rounded-none animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading product details...</p>
        </div>
      </StoreShell>
    );
  }

  if (!product) {
    return (
      <StoreShell>
        <div className="container py-24 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-[#0066FF] rounded-none flex items-center justify-center mx-auto mb-4">
            <RotateCcw size={28} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 font-['Outfit']">Product Not Found</h1>
          <p className="text-xs text-gray-500 mb-6">
            The product you are looking for might have been moved or is currently unavailable.
          </p>
          <Link href="/products" className="btn-primary text-xs">
            Back to Catalog
          </Link>
        </div>
      </StoreShell>
    );
  }

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const relatedProducts = INITIAL_CATALOG_PRODUCTS.filter(
    (p) => p.category === product.category && p._id !== product._id
  ).slice(0, 4);

  const fallbackRelated =
    relatedProducts.length > 0
      ? relatedProducts
      : INITIAL_CATALOG_PRODUCTS.filter((p) => p._id !== product._id).slice(0, 4);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: galleryImages[0]?.url || '',
        stock: product.stock,
      });
    }
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product._id,
        name: product.name,
        price: product.price,
        image: galleryImages[0]?.url || '',
        stock: product.stock,
      });
    }
    router.push('/checkout');
  };

  const whatsappMessage = encodeURIComponent(
    `Hello AZIP Store! I would like to order with Cash on Delivery:\n\n*Product:* ${product.name}\n*Price:* Rs. ${product.price.toLocaleString()}\n*Quantity:* ${quantity}\n*Total:* Rs. ${(product.price * quantity).toLocaleString()}\n*Delivery Location:* ${selectedLocation.city}\n\nPlease confirm my order!`
  );

  const variantOptions = [
    'Standard Edition',
    'Value Multi-Pack',
    'School Special Kit',
  ];

  return (
    <StoreShell>
      <div className="bg-[#f5f7fa] py-4 md:py-6 border-b border-gray-200">
        <div className="container max-w-[1400px]">
          {/* Breadcrumb Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 font-bold text-gray-600 hover:text-[#0066FF] transition-colors"
            >
              <ArrowLeft size={15} /> Back to Catalog
            </Link>

            <div className="flex items-center gap-2 text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <span>/</span>
              <Link href={`/products?category=${product.category}`} className="hover:text-gray-900">
                {getCategoryLabel(product.category)}
              </Link>
              <span>/</span>
              <span className="text-gray-800 font-semibold line-clamp-1 max-w-[280px]">
                {product.name}
              </span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════
              MAIN 3-COLUMN SHOWCASE (DARAZ STYLE)
              Column 1: Image Gallery + Magnifier Zoom Lens (hover opens high-res detail)
              Column 2: Product Info, Price, Installment, Options, Buy Now / Add to Cart
              Column 3: Delivery Options, Cash on Delivery Reassurance, Return & Seller
             ═══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-none border border-gray-200/90 shadow-sm p-4 sm:p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* ─────────────────── COLUMN 1: IMAGE + HOVER ZOOM ─────────────────── */}
              <div className="lg:col-span-4 relative z-30">
                <ProductImageZoom
                  images={galleryImages}
                  productName={product.name}
                  discountBadge={discount > 0 ? `SAVE ${discount}%` : (product.badge || null)}
                />

                <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500 px-1">
                  <span className="flex items-center gap-1 text-[#0066FF] font-medium">
                    <Sparkles size={13} /> Roll over image to zoom in
                  </span>
                  <span>Click image to expand</span>
                </div>
              </div>

              {/* ─────────────────── COLUMN 2: PRODUCT CORE DETAILS ─────────────────── */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  {/* Flash Sale / Limited Time Banner */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 rounded-none p-2.5 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#0066FF] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-none tracking-wider flex items-center gap-1 shadow-sm">
                        <Zap size={11} className="fill-white" /> FLASH SALE
                      </span>
                      <span className="text-xs font-bold text-gray-800">Verified Authentic Stock</span>
                    </div>
                    <div className="text-[11px] font-semibold text-gray-600">
                      <span className="text-[#0066FF] font-black">{product.reviewsCount || 48} sold</span> • High Demand
                    </div>
                  </div>

                  {/* Product Title */}
                  <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit'] leading-snug mb-2">
                    {product.name}
                  </h1>

                  {/* Rating, Reviews count & Share / Wishlist */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className="fill-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">{product.rating || 4.9}</span>
                      <span className="text-[#0066FF] font-medium cursor-pointer hover:underline" onClick={() => setActiveTab('reviews')}>
                        ({product.reviewsCount || 48} Ratings)
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">120 Answered Questions</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`p-1.5 rounded-none border transition-all ${
                          isWishlisted
                            ? 'border-red-200 bg-red-50 text-red-500'
                            : 'border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-[#0066FF]'
                        }`}
                        title="Add to wishlist"
                      >
                        <Heart size={16} className={isWishlisted ? 'fill-red-500' : ''} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-1.5 rounded-none border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
                        title="Share product link"
                      >
                        {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Brand & Category row */}
                  <div className="text-xs text-gray-600 mb-4 flex items-center gap-2">
                    <span>Brand:</span>
                    <Link
                      href={`/products?search=${encodeURIComponent(product.brand || 'Atlas')}`}
                      className="text-[#0066FF] font-bold hover:underline"
                    >
                      {product.brand || 'AZIP GENUINE'}
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      href={`/products?category=${product.category}`}
                      className="text-gray-600 hover:text-[#0066FF]"
                    >
                      More {getCategoryLabel(product.category)} from AZIP
                    </Link>
                  </div>

                  {/* Pricing Box (Daraz Style) */}
                  <div className="bg-[#f8fafc] rounded-none p-4 mb-4 border border-gray-200/80">
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-black text-[#0066FF] font-['Outfit']">
                        Rs. {product.price.toLocaleString()}
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <>
                          <span className="text-sm text-gray-400 line-through">
                            Rs. {product.compareAtPrice.toLocaleString()}
                          </span>
                          <span className="text-xs font-black text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-none">
                            -{discount}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Installment Line */}
                    <div className="mt-2.5 pt-2.5 border-t border-gray-200/60 flex items-center gap-2 text-xs text-gray-600">
                      <span className="font-bold text-gray-800">Installment</span>
                      <span className="text-gray-300">•</span>
                      <span>
                        Up to 3 months, as low as <strong className="text-gray-900 font-bold">Rs. {Math.round(product.price / 3).toLocaleString()}</strong> / mo with Koko / Mintpay
                      </span>
                    </div>
                  </div>

                  {/* Variations / Pack options */}
                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-800 mb-2 flex items-center gap-1.5">
                      <span>Package Option:</span>
                      <span className="text-[#0066FF] font-semibold">{selectedVariant}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {variantOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setSelectedVariant(opt)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-none border transition-all cursor-pointer ${
                            selectedVariant === opt
                              ? 'border-[#0066FF] bg-blue-50 text-[#0066FF] shadow-sm ring-1 ring-[#0066FF]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-4 mb-5">
                    <span className="text-xs font-bold text-gray-700">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-none bg-white overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-xs">
                      {product.stock > 10 ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 size={13} className="text-emerald-600" /> In Stock ({product.stock} units available)
                        </span>
                      ) : (
                        <span className="text-amber-600 font-bold">
                          Only {product.stock} units left - order soon!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons: BUY NOW (Royal Blue) & ADD TO CART (Navy) */}
                  <div className="space-y-3 mb-4">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-none bg-[#0066FF] hover:bg-[#0052cc] text-white font-black text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <Zap size={17} className="fill-white" />
                        Buy Now
                      </button>

                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full sm:flex-1 py-3.5 px-6 rounded-none bg-[#0A2540] hover:bg-[#0C3E7C] text-white font-black text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <ShoppingCart size={17} />
                        Add to Cart
                      </button>
                    </div>

                    {/* WhatsApp Quick Order Button */}
                    <a
                      href={`https://wa.me/94770000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#1ebe57] text-white font-bold text-xs sm:text-sm rounded-none transition-all shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer active:scale-98"
                    >
                      <MessageCircle size={18} />
                      Quick Order via WhatsApp (Cash on Delivery)
                    </a>
                  </div>

                  {/* Cash on delivery reassurance banner below buttons */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-1">
                    <Banknote size={15} className="text-emerald-600" />
                    <span><strong>Cash on Delivery (COD)</strong> accepted directly at your doorstep!</span>
                  </div>
                </div>
              </div>

              {/* ─────────────────── COLUMN 3: DELIVERY & SERVICE WIDGET ─────────────────── */}
              <div className="lg:col-span-3 bg-[#f8fafc] rounded-none border border-gray-200 p-4 flex flex-col justify-between space-y-5">
                {/* 1. Delivery Options */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                    <span>Delivery Options</span>
                    <button
                      type="button"
                      onClick={() => setIsLocationModalOpen(true)}
                      className="text-[#0066FF] hover:underline normal-case text-xs font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      CHANGE
                    </button>
                  </div>

                  {/* Current Selected Location */}
                  <div className="flex items-start gap-2.5 pb-3 border-b border-gray-200/80 text-xs">
                    <MapPin size={16} className="text-[#0066FF] shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 leading-tight">
                        {selectedLocation.city}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {selectedLocation.region}
                      </div>
                    </div>
                  </div>

                  {/* Standard Courier Delivery */}
                  <div className="flex items-start justify-between gap-2.5 py-3 border-b border-gray-200/80 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Truck size={16} className="text-gray-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-900">Standard Delivery</div>
                        <div className="text-[11px] text-gray-500">Get within {selectedLocation.days}</div>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">Rs. {selectedLocation.fee}</span>
                  </div>

                  {/* Store Collection Point */}
                  <div className="flex items-start justify-between gap-2.5 py-3 border-b border-gray-200/80 text-xs">
                    <div className="flex items-start gap-2.5">
                      <Store size={16} className="text-gray-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-900">Store Collection Point</div>
                        <div className="text-[11px] text-gray-500">AZIP Store - Kandy Branch</div>
                      </div>
                    </div>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>

                  {/* Cash on Delivery Available Highlight (User's specific rule!) */}
                  <div className="pt-3">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-none p-3 flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-none bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Banknote size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-emerald-800 flex items-center gap-1">
                          <span>Cash on Delivery Available</span>
                          <CheckCircle2 size={13} className="text-emerald-600 fill-emerald-100" />
                        </div>
                        <p className="text-[11px] text-emerald-900/80 mt-0.5 leading-snug">
                          Pay with cash upon doorstep delivery anywhere in Sri Lanka.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Return & Warranty */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                    Return &amp; Warranty
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5">
                      <RotateCcw size={16} className="text-gray-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-900">7 Days Easy Return</div>
                        <div className="text-[11px] text-gray-500">Hassle-free replacement for defective items</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <ShieldCheck size={16} className="text-[#0066FF] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-900">100% Authentic Guarantee</div>
                        <div className="text-[11px] text-gray-500">Direct from authorized suppliers</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Award size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-gray-900">Official Brand Warranty</div>
                        <div className="text-[11px] text-gray-500">Applicable on branded electronics & tools</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Seller Card */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Sold by</div>
                      <div className="text-sm font-black text-gray-900 font-['Outfit']">AZIP Store (Pvt) Ltd</div>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 text-[#0066FF] px-2 py-0.5 rounded-none">
                      Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2 bg-white rounded-none border border-gray-200 text-center mb-3">
                    <div>
                      <div className="text-xs font-black text-gray-900">98%</div>
                      <div className="text-[10px] text-gray-500">Positive Rating</div>
                    </div>
                    <div className="border-x border-gray-100">
                      <div className="text-xs font-black text-emerald-600">100%</div>
                      <div className="text-[10px] text-gray-500">Ship on Time</div>
                    </div>
                    <div>
                      <div className="text-xs font-black text-blue-600">99%</div>
                      <div className="text-[10px] text-gray-500">Chat Response</div>
                    </div>
                  </div>

                  <Link
                    href="/products"
                    className="w-full inline-flex items-center justify-center py-2 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-none border border-gray-300 transition-colors"
                  >
                    VISIT STORE
                  </Link>
                </div>

              </div>

            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════
              DETAILED SPECIFICATIONS, REVIEWS, & Q&A TABS (DARAZ STYLE)
             ═══════════════════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-none border border-gray-200 overflow-hidden shadow-sm mb-12">
            <div className="flex items-center gap-1 border-b border-gray-200 bg-gray-50/90 px-3 overflow-x-auto scrollbar-none">
              {[
                { id: 'details', label: 'Product Details' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: `Ratings & Reviews (${product.reviewsCount || 48})` },
                { id: 'qa', label: 'Questions About This Product (4)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#0066FF] text-[#0066FF] bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 md:p-8">
              {/* TAB 1: PRODUCT DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-3">Highlights</h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#0066FF] shrink-0" />
                        <span>100% Genuine {product.brand || 'AZIP'} product with official seal</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#0066FF] shrink-0" />
                        <span>Manufactured according to approved Sri Lankan educational standards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#0066FF] shrink-0" />
                        <span>Fast delivery across all 25 districts with Cash on Delivery</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-[#0066FF] shrink-0" />
                        <span>Carefully packed with protective bubble wrap for safe arrival</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 mb-3">Description</h3>
                    <div className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3">
                      <p>{product.description}</p>
                      <p>
                        Whether preparing for crucial school examinations or setting up a professional workstation, this {product.name} delivers consistent quality and longevity. Inspected by the AZIP Store quality team before dispatch to ensure zero defect delivery.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SPECIFICATIONS */}
              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-4">Product Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 border border-gray-200 rounded-none overflow-hidden divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                    <div className="divide-y divide-gray-200">
                      <div className="flex justify-between p-3.5 text-xs sm:text-sm bg-gray-50">
                        <span className="text-gray-500 font-medium">Brand</span>
                        <span className="font-bold text-gray-900">{product.brand || 'AZIP GENUINE'}</span>
                      </div>
                      <div className="flex justify-between p-3.5 text-xs sm:text-sm bg-white">
                        <span className="text-gray-500 font-medium">Category</span>
                        <span className="font-bold text-gray-900">{getCategoryLabel(product.category)}</span>
                      </div>
                      <div className="flex justify-between p-3.5 text-xs sm:text-sm bg-gray-50">
                        <span className="text-gray-500 font-medium">SKU</span>
                        <span className="font-bold text-gray-900">{product.sku || 'AZ-STORE-001'}</span>
                      </div>
                      {product.grade && (
                        <div className="flex justify-between p-3.5 text-xs sm:text-sm bg-white">
                          <span className="text-gray-500 font-medium">Grade / Level</span>
                          <span className="font-bold text-gray-900">{product.grade}</span>
                        </div>
                      )}
                    </div>

                    <div className="divide-y divide-gray-200">
                      {product.language && (
                        <div className="flex justify-between p-3.5 text-xs sm:text-sm bg-gray-50 sm:bg-white">
                          <span className="text-gray-500 font-medium">Medium / Language</span>
                          <span className="font-bold text-gray-900">{product.language}</span>
                        </div>
                      )}
                      {product.rulingType && (
                        <div className="flex justify-between p-3.5 text-xs sm:text-sm bg-white sm:bg-gray-50">
                          <span className="text-gray-500 font-medium">Ruling / Format</span>
                          <span className="font-bold text-gray-900">{product.rulingType}</span>
                        </div>
                      )}
                      <div className="flex justify-between p-3.5 text-xs sm:text-sm bg-gray-50">
                        <span className="text-gray-500 font-medium">Payment Mode</span>
                        <span className="font-bold text-emerald-700">Cash on Delivery (Islandwide)</span>
                      </div>
                      <div className="flex justify-between p-3.5 text-xs sm:text-sm bg-white">
                        <span className="text-gray-500 font-medium">Warranty</span>
                        <span className="font-bold text-gray-900">7 Days Return / Replacement</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RATINGS & REVIEWS (DARAZ STYLE) */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Reviews Summary Header */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 bg-gray-50 rounded-none border border-gray-200">
                    <div className="md:col-span-4 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
                      <div className="text-5xl font-black text-gray-900 font-['Outfit']">
                        {product.rating || 4.9}
                        <span className="text-2xl text-gray-400 font-normal">/5</span>
                      </div>
                      <div className="flex text-amber-400 gap-1 my-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={18} className="fill-amber-400" />
                        ))}
                      </div>
                      <div className="text-xs font-semibold text-gray-500">
                        {product.reviewsCount || 48} Ratings &amp; Reviews
                      </div>
                    </div>

                    {/* Breakdown Bars */}
                    <div className="md:col-span-8 space-y-2 flex flex-col justify-center">
                      {[
                        { star: 5, pct: 92, count: 44 },
                        { star: 4, pct: 6, count: 3 },
                        { star: 3, pct: 2, count: 1 },
                        { star: 2, pct: 0, count: 0 },
                        { star: 1, pct: 0, count: 0 },
                      ].map((item) => (
                        <div key={item.star} className="flex items-center gap-3 text-xs">
                          <span className="w-12 text-gray-600 font-bold flex items-center gap-1">
                            {item.star} <Star size={11} className="fill-amber-400 text-amber-400" />
                          </span>
                          <div className="flex-1 h-2.5 bg-gray-200 rounded-none overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-none transition-all duration-500"
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-gray-500 text-right">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setReviewFilter('all')}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all ${
                        reviewFilter === 'all'
                          ? 'bg-[#0066FF] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Reviews ({product.reviewsCount || 48})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('5')}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all ${
                        reviewFilter === '5'
                          ? 'bg-[#0066FF] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      5 Stars Only (44)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter('with-images')}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold transition-all ${
                        reviewFilter === 'with-images'
                          ? 'bg-[#0066FF] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Verified Purchases (48)
                    </button>
                  </div>

                  {/* Verified Reviews List */}
                  <div className="divide-y divide-gray-100">
                    {[
                      {
                        name: 'Kasun Bandara',
                        city: 'Kandy',
                        date: '18 Oct 2026',
                        rating: 5,
                        comment:
                          'Super fast delivery to Kandy! Paid cash on delivery when the courier called. Product is 100% original, brand new sealed.',
                      },
                      {
                        name: 'Nadeesha Perera',
                        city: 'Colombo 07',
                        date: '14 Oct 2026',
                        rating: 5,
                        comment:
                          'Very high quality stationery. The pricing is much better than physical bookstores in Colombo. Highly recommended seller!',
                      },
                      {
                        name: 'Dilan Wickramasinghe',
                        city: 'Galle',
                        date: '10 Oct 2026',
                        rating: 5,
                        comment:
                          'Ordered 3 units for my children. Arrived safely packed without any folds or damage. Easy payment with cash at home.',
                      },
                    ].map((rev, idx) => (
                      <div key={idx} className="py-4 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{rev.name}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Verified Purchase ({rev.city})
                            </span>
                          </div>
                          <span className="text-gray-400">{rev.date}</span>
                        </div>

                        <div className="flex text-amber-400 gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={12} className="fill-amber-400" />
                          ))}
                        </div>

                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                          {rev.comment}
                        </p>

                        <div className="flex items-center gap-4 pt-1 text-[11px] text-gray-400">
                          <button className="flex items-center gap-1 hover:text-gray-700 cursor-pointer">
                            <ThumbsUp size={12} /> Helpful (12)
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: Q&A */}
              {activeTab === 'qa' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    Questions &amp; Answers About This Product
                  </h3>

                  <div className="divide-y divide-gray-100">
                    <div className="py-3.5 space-y-1">
                      <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-start gap-2">
                        <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-none text-[10px]">Q</span>
                        <span>Is Cash on Delivery available for outstation districts?</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700 pl-6 flex items-start gap-2">
                        <span className="bg-[#0066FF] text-white px-1.5 py-0.5 rounded-none text-[10px] font-bold">A</span>
                        <span>
                          Yes! Cash on Delivery is available for all 25 districts in Sri Lanka. You pay the courier directly when your package arrives at your doorstep.
                        </span>
                      </div>
                    </div>

                    <div className="py-3.5 space-y-1">
                      <div className="text-xs sm:text-sm font-bold text-gray-900 flex items-start gap-2">
                        <span className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-none text-[10px]">Q</span>
                        <span>How soon can I receive this in Kandy or Colombo?</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700 pl-6 flex items-start gap-2">
                        <span className="bg-[#0066FF] text-white px-1.5 py-0.5 rounded-none text-[10px] font-bold">A</span>
                        <span>
                          Deliveries within Kandy arrive within 24 hours. Deliveries to Colombo and Western Province take 1-2 business days.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════════════
              RELATED PRODUCTS (DARAZ STYLE "PEOPLE ALSO BOUGHT")
             ═══════════════════════════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 font-['Outfit']">
                  People Also Bought
                </h2>
                <p className="text-xs text-gray-500">More recommended items from {getCategoryLabel(product.category)}</p>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-xs font-bold text-[#0066FF] hover:underline flex items-center gap-1"
              >
                View More <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
              {fallbackRelated.map((p) => (
                <ProductCard
                  key={p._id}
                  id={p._id}
                  name={p.name}
                  slug={p.slug}
                  price={p.price}
                  compareAtPrice={p.compareAtPrice}
                  image={p.images[0]?.url || ''}
                  category={p.category}
                  stock={p.stock}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ─────────────────── LOCATION SELECTOR MODAL ─────────────────── */}
      {isLocationModalOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsLocationModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-none shadow-2xl overflow-hidden p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-[#0066FF]" />
                <h3 className="text-base font-black text-gray-900 font-['Outfit']">
                  Choose Delivery Destination
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1.5 rounded-none hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-500 my-3">
              Select your delivery area in Sri Lanka to see accurate delivery time and courier rates:
            </p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {SRI_LANKA_LOCATIONS.map((loc, idx) => {
                const isSelected = selectedLocation.city === loc.city;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationModalOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-none border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-[#0066FF] bg-blue-50/70 shadow-xs ring-1 ring-[#0066FF]'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-gray-900">{loc.city}</div>
                      <div className="text-[11px] text-gray-500">{loc.region} • {loc.days}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-gray-900">Rs. {loc.fee}</div>
                      {isSelected && (
                        <div className="text-[10px] font-bold text-[#0066FF]">Selected</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </StoreShell>
  );
}
