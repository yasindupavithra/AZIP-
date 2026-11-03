'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Check, Star } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { getCategoryImage, ProductVariant } from '@/lib/catalog';

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  category: string;
  stock: number;
  brand?: string;
  badge?: string;
  variants?: ProductVariant[];
  specTag?: string;
  viewMode?: 'grid' | 'list';
  rating?: number;
  reviewsCount?: number;
}

export default function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  category,
  stock,
  brand,
  badge,
  viewMode = 'grid',
  rating = 4.8,
}: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const fallbackImg = getCategoryImage(category);
  const imgSrc = imgError || !image ? fallbackImg : image;
  const outOfStock = stock <= 0;
  const hasDiscount = !!compareAtPrice && compareAtPrice > price;
  const discount = hasDiscount ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem({ id, name, price, image: imgSrc, stock });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const button = (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={outOfStock}
      aria-label={outOfStock ? 'Out of stock' : `Add ${name} to cart`}
      className={`flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg border transition-all ${
        added
          ? 'bg-emerald-600 border-emerald-600 text-white'
          : outOfStock
          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
          : 'bg-sky-50/70 border-[#00C4D8]/60 text-[#0096C7] hover:bg-[#0096C7] hover:border-[#0096C7] hover:text-white cursor-pointer'
      } ${viewMode === 'list' ? 'px-5 py-2.5 shrink-0' : 'w-full py-2'}`}
    >
      {added ? <Check size={14} strokeWidth={2.5} /> : <ShoppingCart size={14} />}
      {added ? 'Added to Cart' : outOfStock ? 'Sold Out' : 'Add to Cart'}
    </button>
  );

  const priceBlock = (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className="text-base font-extrabold text-[#E11D48]">Rs. {price.toLocaleString()}</span>
      {hasDiscount && (
        <span className="text-xs text-slate-400 line-through font-medium">
          Rs. {compareAtPrice!.toLocaleString()}
        </span>
      )}
    </div>
  );

  const discountTag = hasDiscount && (
    <span className="absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
      -{discount}%
    </span>
  );

  // ── List view ──
  if (viewMode === 'list') {
    return (
      <div className="group flex items-center gap-4 bg-white rounded-xl border border-slate-200 hover:border-[#00C4D8] shadow-xs hover:shadow-md transition-all p-3.5">
        <Link
          href={`/products/${slug}`}
          className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 bg-white rounded-lg border border-slate-100 flex items-center justify-center p-2"
        >
          {discountTag}
          <img
            src={imgSrc}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="max-w-full max-h-full object-contain"
          />
        </Link>
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              {brand || category.replace(/-/g, ' ')}
            </div>
            <Link href={`/products/${slug}`}>
              <h3 className="text-sm font-semibold text-slate-800 group-hover:text-[#0096C7] line-clamp-2">
                {name}
              </h3>
            </Link>
            <div className="mt-1.5">{priceBlock}</div>
          </div>
          {button}
        </div>
      </div>
    );
  }

  // ── Grid view ──
  return (
    <div className="group flex flex-col h-full bg-white rounded-xl border border-slate-200/90 hover:border-[#00C4D8] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      <Link
        href={`/products/${slug}`}
        className="relative block w-full aspect-square bg-white p-4 border-b border-slate-100 overflow-hidden"
      >
        {discountTag}
        {badge && (
          <span className="absolute top-2.5 right-2.5 z-10 bg-sky-50 text-[#0096C7] border border-sky-200/80 text-[10px] font-bold px-2 py-0.5 rounded-md">
            {badge}
          </span>
        )}
        <img
          src={imgSrc}
          alt={name}
          loading="lazy"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-col flex-1 p-3.5 gap-2">
        <div className="flex items-center justify-between gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          <span className="truncate">{brand || category.replace(/-/g, ' ')}</span>
          <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            <span className="text-slate-600">{rating.toFixed(1)}</span>
          </span>
        </div>

        <Link href={`/products/${slug}`} className="block">
          <h3
            className="text-[13px] font-semibold text-slate-800 group-hover:text-[#0096C7] line-clamp-2 leading-snug min-h-[36px]"
            title={name}
          >
            {name}
          </h3>
        </Link>
        {priceBlock}
        <div className="mt-auto pt-1">{button}</div>
      </div>
    </div>
  );
}
