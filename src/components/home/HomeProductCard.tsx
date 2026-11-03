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

/**
 * Cute, kid-friendly pastel "photo studio" backdrops per category.
 * The product photo is blended onto this colour with `mix-blend-multiply`,
 * so plain white studio backgrounds turn into a soft coloured stage.
 */
const CATEGORY_BACKDROPS: Record<string, string> = {
  'school-books': '#FFE9A8',
  books: '#FFE3C7',
  'exercise-books': '#CFEAFF',
  'writing-instruments': '#FFD9E4',
  'mathematical-instruments': '#D5F3E4',
  'art-craft': '#FFE1C2',
  'school-accessories': '#CDE7FF',
  'office-supplies': '#E6E0FF',
  'files-organization': '#D3F5EF',
  'science-laboratory': '#D9F1FF',
  'educational-materials': '#FFF0B8',
  electronics: '#DFE6F1',
  'preschool-kids': '#FFD6EC',
  'gifts-accessories': '#F1DCFF',
};
const BACKDROP_CYCLE = ['#FFE9A8', '#CFEAFF', '#FFD9E4', '#D5F3E4', '#E6E0FF', '#FFE1C2'];

function pickBackdrop(product: HomeProduct): string {
  if (product.category && CATEGORY_BACKDROPS[product.category]) {
    return CATEGORY_BACKDROPS[product.category];
  }
  let hash = 0;
  for (const ch of product.id || product.slug || '') hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return BACKDROP_CYCLE[hash % BACKDROP_CYCLE.length];
}

/** 12-point starburst sticker polygon — sharp points, no curves */
const STARBURST =
  'polygon(50% 0%, 61% 13%, 77% 7%, 79% 23%, 95% 25%, 89% 40%, 100% 50%, 89% 60%, 95% 75%, 79% 77%, 77% 93%, 61% 87%, 50% 100%, 39% 87%, 23% 93%, 21% 77%, 5% 75%, 11% 60%, 0% 50%, 11% 40%, 5% 25%, 21% 23%, 23% 7%, 39% 13%)';

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
  const backdrop = pickBackdrop(product);

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

  const lowStock = !!product.stock && product.stock < 15;

  return (
    <article className="group flex flex-col h-full bg-white rounded-none overflow-hidden shadow-[0_2px_10px_rgba(4,30,66,0.06)] hover:shadow-[0_14px_32px_rgba(4,30,66,0.14)] hover:-translate-y-1 transition-all duration-300">
      {/* ── Big, clean full-bleed product photo on a pastel stage ── */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={product.name}
        className="relative block w-full aspect-square overflow-hidden"
        style={{ backgroundColor: backdrop }}
      >
        {/* Soft spotlight so the product pops */}
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 62%)',
          }}
        />

        <img
          src={displayImg}
          alt={product.name}
          loading="lazy"
          onError={() => setImgError(true)}
          className={`relative w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.07] ${
            compact ? 'p-3' : 'p-5 sm:p-6'
          }`}
        />

        {/* Starburst SALE sticker (sharp points) */}
        {hasDiscount && (
          <span
            className={`absolute top-2.5 left-2.5 z-10 flex flex-col items-center justify-center text-center bg-[#7B2FF7] text-white font-black leading-none -rotate-12 group-hover:rotate-0 transition-transform duration-300 drop-shadow-[0_3px_6px_rgba(0,0,0,0.25)] ${
              compact ? 'w-11 h-11 text-[9px]' : 'w-14 h-14 sm:w-16 sm:h-16 text-[10px] sm:text-[11px]'
            }`}
            style={{ clipPath: STARBURST }}
          >
            <span className="text-[#FFE14D] text-[8px] sm:text-[9px] tracking-wider">SALE</span>
            <span className={compact ? 'text-[11px]' : 'text-sm sm:text-base'}>-{discount}%</span>
          </span>
        )}

        {/* Flash-deal low-stock ribbon at the bottom of the photo */}
        {isFlashDeal && !compact && lowStock && (
          <span className="absolute bottom-0 left-0 z-10 inline-flex items-center gap-1 bg-[#E11D48] text-white text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1">
            <Flame size={11} className="fill-white" /> Only {product.stock} left
          </span>
        )}
      </Link>

      {/* ── Details ── */}
      <div className={`flex flex-col flex-1 ${compact ? 'p-2.5 gap-1' : 'p-3 sm:p-4 gap-2'}`}>
        {/* Rating chip + highlight badge */}
        {!compact && (
          <div className="flex items-center justify-between gap-2 min-h-[22px]">
            {product.rating > 0 ? (
              <span className="inline-flex items-center gap-1 bg-sky-50 text-slate-700 text-[11px] font-bold px-2 py-0.5">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                {product.rating.toFixed(1)}
              </span>
            ) : (
              <span />
            )}
            {(product.badge || product.isNew) && (
              <span className="truncate bg-[#FFF3B0] text-[#5B4300] text-[10px] sm:text-[11px] font-extrabold px-2 py-0.5">
                {product.badge || 'New Launch'}
              </span>
            )}
          </div>
        )}

        {/* Product Title */}
        <Link
          href={`/products/${product.slug}`}
          className={`font-semibold text-slate-800 group-hover:text-[#0077B6] line-clamp-2 leading-snug transition-colors ${
            compact ? 'text-xs min-h-[32px]' : 'text-[13px] sm:text-[15px] min-h-[38px] sm:min-h-[42px]'
          }`}
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Price Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-extrabold text-[#F05A28] ${compact ? 'text-sm' : 'text-base sm:text-lg'}`}>
            Rs. {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium">
                Rs. {product.compareAtPrice!.toLocaleString()}
              </span>
              {!compact && (
                <span className="bg-[#FFE14D] text-[#3D2E00] text-[10px] sm:text-[11px] font-extrabold px-1.5 py-0.5">
                  {discount}% off
                </span>
              )}
            </>
          )}
        </div>

        {/* Big Add to Cart Button */}
        {showCart && !compact && (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className={`mt-auto w-full py-2.5 sm:py-3 rounded-none flex items-center justify-center gap-2 text-sm sm:text-[15px] font-extrabold transition-all cursor-pointer border-none active:scale-[0.98] ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-[#00C4D8] text-[#041E42] hover:bg-[#0096C7] hover:text-white'
            }`}
          >
            {added ? <Check size={16} strokeWidth={2.75} /> : <ShoppingCart size={16} strokeWidth={2.5} />}
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        )}
      </div>
    </article>
  );
}
