'use client';

import { useEffect, useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/store/cart';
import { getCategoryLabel, getCategoryImage, INITIAL_CATALOG_PRODUCTS, CatalogProduct } from '@/lib/catalog';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images?: Array<{ url: string; alt?: string }>;
  category: string;
  stock: number;
  specifications?: Record<string, string>;
  sku?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const addItem = useCartStore((s) => s.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'shipping' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setSelectedImage(data.product.images?.[0]?.url || getCategoryImage(data.product.category));
        } else {
          // Fallback to local catalog
          const fallback = INITIAL_CATALOG_PRODUCTS.find((p) => p.slug === slug || p._id === slug);
          if (fallback) {
            setProduct(fallback as any);
            setSelectedImage(fallback.images[0]?.url || getCategoryImage(fallback.category));
          }
        }
      } catch (err) {
        const fallback = INITIAL_CATALOG_PRODUCTS.find((p) => p.slug === slug || p._id === slug);
        if (fallback) {
          setProduct(fallback as any);
          setSelectedImage(fallback.images[0]?.url || getCategoryImage(fallback.category));
        }
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <StoreShell>
        <div className="container py-24 text-center">
          <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-gray-500">Loading product details...</p>
        </div>
      </StoreShell>
    );
  }

  if (!product) {
    return (
      <StoreShell>
        <div className="container py-24 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-50 text-[#e50914] rounded-full flex items-center justify-center mx-auto mb-4">
            <RotateCcw size={28} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2 font-['Outfit']">Product not found</h1>
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

  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const images = product.images && product.images.length > 0
    ? product.images.map(img => img.url)
    : [getCategoryImage(product.category)];

  const relatedProducts = INITIAL_CATALOG_PRODUCTS
    .filter((p) => p._id !== product._id)
    .slice(0, 4);

  const specs = product.specifications ? Object.entries(product.specifications) : [];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello AZIP Store! I'm interested in ordering: ${product.name} (Rs. ${product.price.toLocaleString()}) x ${quantity}`
  );

  return (
    <StoreShell>
      <div className="container py-8 md:py-12">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#e50914] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </Link>

          <div className="text-xs text-gray-400 hidden sm:flex items-center gap-2">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span>/</span>
            <Link href={`/products?category=${product.category}`} className="hover:text-gray-700">
              {getCategoryLabel(product.category)}
            </Link>
            <span>/</span>
            <span className="text-gray-700 font-medium line-clamp-1 max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Main Product Showcase Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Product Images Gallery */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-[#e50914] text-white text-xs font-black px-3 py-1 rounded-full shadow-md z-10">
                    SAVE {discount}%
                  </span>
                )}
                <img
                  src={selectedImage || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === img ? 'border-[#e50914] shadow-md scale-105' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details & Purchase Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#e50914] bg-red-50 px-3 py-1 rounded-full">
                    {getCategoryLabel(product.category)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="p-2 rounded-full border border-gray-200 hover:bg-red-50 text-gray-500 hover:text-[#e50914] transition-colors"
                      title="Add to wishlist"
                    >
                      <Heart size={16} className={isWishlisted ? 'fill-[#e50914] text-[#e50914]' : ''} />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-500 transition-colors"
                      title="Share product link"
                    >
                      {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                    </button>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit'] leading-snug mb-3">
                  {product.name}
                </h1>

                {/* Rating & Stock Status */}
                <div className="flex items-center gap-4 mb-5 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} className="fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-700 ml-1">5.0</span>
                    <span className="text-xs text-gray-400">(48 verified reviews)</span>
                  </div>

                  <span className="text-gray-300">|</span>

                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    <CheckCircle2 size={14} />
                    <span>In Stock &amp; Ready to Ship</span>
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl sm:text-4xl font-black text-[#e50914] font-['Outfit']">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-lg text-gray-400 line-through">
                        Rs. {product.compareAtPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Includes all applicable taxes. Cash on delivery available island-wide.
                  </p>
                </div>

                {/* Short description */}
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Quantity & Add to Cart */}
                <div className="space-y-4 mb-6">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Quantity Picker */}
                    <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="font-bold text-sm w-10 text-center text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-9 h-9 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => {
                        for (let i = 0; i < quantity; i++) {
                          addItem({
                            id: product._id,
                            name: product.name,
                            price: product.price,
                            image: selectedImage || images[0],
                            stock: product.stock,
                          });
                        }
                      }}
                      className="flex-1 btn-primary py-3.5 text-sm uppercase tracking-wider"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart (Rs. {(product.price * quantity).toLocaleString()})
                    </button>
                  </div>

                  {/* WhatsApp Direct Order Button */}
                  <a
                    href={`https://wa.me/94770000000?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-sm uppercase tracking-wider"
                  >
                    <MessageCircle size={17} />
                    Quick Order via WhatsApp
                  </a>
                </div>
              </div>

              {/* Trust Badges under actions */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 text-center">
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <Truck size={18} className="text-[#e50914] mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-gray-900">Fast Islandwide</div>
                  <div className="text-[10px] text-gray-500">2-3 Business Days</div>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <ShieldCheck size={18} className="text-[#e50914] mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-gray-900">100% Genuine</div>
                  <div className="text-[10px] text-gray-500">Official Warranty</div>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50">
                  <RotateCcw size={18} className="text-[#e50914] mx-auto mb-1" />
                  <div className="text-[11px] font-bold text-gray-900">Easy Returns</div>
                  <div className="text-[10px] text-gray-500">7-Day Replacement</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-14">
          <div className="flex border-b border-gray-200 bg-gray-50">
            {[
              { id: 'description', label: 'Detailed Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'shipping', label: 'Delivery & Payment Policy' },
              { id: 'reviews', label: 'Customer Reviews (48)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#e50914] text-[#e50914] bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-sm text-gray-700 leading-relaxed">
                <p className="mb-4">{product.description}</p>
                <p>
                  At AZIP Store, every product is thoroughly inspected to ensure genuine quality, perfect binding, and factory-sealed condition. Whether you are a student preparing for examinations or an artist creating masterpieces, AZIP delivers the finest stationery right to your home in Sri Lanka.
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                {specs.length > 0 ? (
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    {specs.map(([k, v], idx) => (
                      <div
                        key={k}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 text-xs sm:text-sm ${
                          idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <span className="font-bold text-gray-600">{k}</span>
                        <span className="font-semibold text-gray-900">{v}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Standard specifications apply to this product category.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <Truck size={18} className="text-[#e50914] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Island-Wide Courier Delivery</h4>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Delivery to Kandy within 24 hours. Colombo, Gampaha, Kurunegala, Galle, Matara, Jaffna and all other districts within 48-72 hours.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-[#e50914] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900">Payment Modes</h4>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Cash on Delivery (COD), Direct Bank Transfer (Commercial Bank / Sampath Bank), or WhatsApp Order Confirmation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="text-center">
                    <div className="text-3xl font-black text-gray-900 font-['Outfit']">5.0</div>
                    <div className="flex text-amber-400 gap-0.5 justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400" />
                      ))}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">48 Reviews</div>
                  </div>
                  <div className="border-l border-gray-200 pl-4 flex-1 text-xs text-gray-600">
                    100% of customers recommend this product for quality and swift delivery by AZIP Store.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related / Recommended Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit']">
              You May Also Like
            </h2>
            <Link href="/products" className="text-xs font-bold text-[#e50914] hover:underline">
              View All Products →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
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
    </StoreShell>
  );
}
