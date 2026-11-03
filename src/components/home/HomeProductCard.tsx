'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, Star, Flame } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export type HomeProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewsCount: number;
  sold?: number;
  image: string;
  category?: string;
  brand?: string;
  badge?: string;
  discountBadge?: string;
  stock?: number;
  isNew?: boolean;
  isHot?: boolean;
};

const FALLBACK_IMAGES: Record<string, string> = {
  'school-books': '/images/hd/categories/school-books.jpg',
  'exercise-books': '/images/hd/products/atlas-exercise-book.jpg',
  'writing-instruments': '/images/hd/products/pilot-g2-pens.jpg',
  'mathematical-instruments': '/images/hd/products/geometry-set.jpg',
  'art-craft': '/images/hd/products/faber-castell-water-color.jpg',
  'school-accessories': '/images/hd/products/school-backpack-blue.jpg',
  'office-supplies': '/images/hd/products/sticky-notes.jpg',
  'files-organization': '/images/hd/categories/exercise-books.jpg',
  'science-laboratory': '/products/microscope.jpg',
  'educational-materials': '/products/globe.jpg',
  'electronics': '/images/hd/products/casio-fx991cw.jpg',
  'preschool-kids': '/images/hd/products/drawing-kit.jpg',
};

export default function HomeProductCard({
  product,
  compact = false,
  showCart = true,
  isFlashDeal = false,
}: {
  product: HomeProduct;
  compact?: boolean;
  showCart?: boolean;
  isFlashDeal?: boolean;
  onPreview360?: (product: HomeProduct) => void;
}) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const hasDiscount = !!product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const fallbackImg =
    (product.category && FALLBACK_IMAGES[product.category]) ||
    '/images/hd/products/atlas-exercise-book.jpg';
  const displayImg = imgError || !product.image ? fallbackImg : product.image;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: displayImg,
      stock: product.stock || 50,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const soldPercent = product.stock
    ? Math.min(92, Math.max(45, 100 - product.stock * 3))
    : 76;

  return (
    <article className="group flex flex-col h-full bg-white rounded-none border border-slate-200/90 hover:border-[#00C4D8] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Product Image Box */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={product.name}
        className={`relative block w-full aspect-square bg-white border-b border-slate-100 overflow-hidden ${
          compact ? 'p-2.5' : 'p-4'
        }`}
      >
        {/* Top-left Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-none shadow-xs">
            -{discount}%
          </span>
        )}

        {/* Top-right Custom Badge or Brand */}
        {(product.badge || product.isNew) && !compact && (
          <span className="absolute top-2.5 right-2.5 z-10 bg-sky-50 text-[#0096C7] border border-sky-200/80 text-[10px] font-bold px-2 py-0.5 rounded-none">
            {product.badge || 'NEW'}
          </span>
        )}

        <img
          src={displayImg}
          alt={product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Product Details */}
      <div className={`flex flex-col flex-1 ${compact ? 'p-2.5 gap-1' : 'p-3.5 gap-2'}`}>
        {/* Brand / Category Sub-label */}
        {!compact && (product.brand || product.category) && (
          <div className="flex items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span className="truncate">{product.brand || product.category?.replace(/-/g, ' ')}</span>
            {product.rating > 0 && (
              <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span className="text-slate-600">{product.rating.toFixed(1)}</span>
              </span>
            )}
          </div>
        )}

        {/* Product Title */}
        <Link
          href={`/products/${product.slug}`}
          className={`font-semibold text-slate-800 group-hover:text-[#0096C7] line-clamp-2 leading-snug transition-colors ${
            compact ? 'text-xs min-h-[32px]' : 'text-[13px] min-h-[36px]'
          }`}
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Price Row */}
        <div className="flex items-baseline gap-2 flex-wrap pt-0.5">
          <span className={`font-extrabold text-[#E11D48] ${compact ? 'text-sm' : 'text-base'}`}>
            Rs. {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-slate-400 line-through font-medium">
              Rs. {product.compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>

        {/* Flash Deal Sold Progress Bar */}
        {isFlashDeal && !compact && (
          <div className="mt-0.5">
            <div className="w-full h-3.5 bg-rose-100 rounded-none overflow-hidden relative flex items-center">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-rose-600 rounded-none"
                style={{ width: `${soldPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-rose-950 uppercase tracking-wider">
                <Flame size={9} className="text-orange-600 fill-orange-500 mr-0.5" />
                {product.stock && product.stock < 15 ? `Only ${product.stock} left` : `${soldPercent}% Sold`}
              </span>
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        {showCart && !compact && (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`mt-auto pt-1 w-full py-2 rounded-none flex items-center justify-center gap-1.5 text-xs font-bold border transition-all cursor-pointer ${
              added
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'bg-sky-50/70 border-[#00C4D8]/60 text-[#0096C7] hover:bg-[#0096C7] hover:border-[#0096C7] hover:text-white'
            }`}
          >
            {added ? <Check size={14} strokeWidth={2.5} /> : <ShoppingCart size={14} />}
            {added ? 'Added to Cart' : 'Add to Cart'}
          </button>
        )}
      </div>
    </article>
  );
}
