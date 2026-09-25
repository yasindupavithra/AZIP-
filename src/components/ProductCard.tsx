'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Heart, Check, Eye, Layers } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { getCategoryImage, getCategoryLabel, ProductVariant } from '@/lib/catalog';

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
  variants,
  specTag
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  
  // Active variant option selection state
  const defaultVariantOption = variants?.[0]?.options?.[0] || null;
  const [selectedVariant, setSelectedVariant] = useState<string | null>(defaultVariantOption);

  const addItem = useCartStore((s) => s.addItem);

  const discount = compareAtPrice && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      const variantSuffix = selectedVariant ? ` (${selectedVariant})` : '';
      addItem({ 
        id, 
        name: `${name}${variantSuffix}`, 
        price, 
        image: image || getCategoryImage(category), 
        stock 
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  // Determine Brand from prop or fallback detection
  const detectedBrand = brand || (
    name.toLowerCase().includes('casio') ? 'CASIO' :
    name.toLowerCase().includes('pilot') ? 'PILOT' :
    name.toLowerCase().includes('atlas') ? 'ATLAS' :
    name.toLowerCase().includes('faber') ? 'FABER-CASTELL' :
    name.toLowerCase().includes('oxford') || name.toLowerCase().includes('helix') ? 'OXFORD' :
    name.toLowerCase().includes('stabilo') ? 'STABILO' :
    name.toLowerCase().includes('sandisk') ? 'SANDISK' :
    name.toLowerCase().includes('mont marte') ? 'MONT MARTE' :
    'AZIP GENUINE'
  );

  return (
    <div className="product-card group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden font-sans">
      
      {/* 1:1 Square Aspect Ratio Media Container */}
      <Link href={`/products/${slug}`} className="block relative w-full aspect-square bg-slate-50/60 overflow-hidden shrink-0">
        
        {/* Requirement 2: Correct Badge positioning (absolute top-2 left-2 z-10) */}
        <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1">
          {discount > 0 && (
            <span className="inline-flex items-center bg-[#DC2626] text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wide shadow-sm">
              -{discount}%
            </span>
          )}
          {badge && (
            <span className="inline-flex items-center bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
              {badge}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#DC2626] transition-all duration-200 border border-gray-100 cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110"
          title="Add to Wishlist"
        >
          <Heart size={14} className={isWishlisted ? "fill-[#DC2626] text-[#DC2626]" : ""} />
        </button>

        {/* Quick View Button */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <span
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 hover:bg-white text-gray-800 text-[11px] font-bold rounded-full shadow-lg border border-gray-100 transition-all hover:scale-105 backdrop-blur-sm"
          >
            <Eye size={13} /> View Details
          </span>
        </div>

        {/* Product Image Normalized Container */}
        <div className="w-full h-full p-5 flex items-center justify-center">
          <img
            src={image || getCategoryImage(category)}
            alt={name}
            className="max-w-full max-h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Brand Tag & Category */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-extrabold tracking-[0.08em] text-[#DC2626] uppercase">
              {detectedBrand}
            </span>
            <span className="text-[10px] font-semibold text-gray-400 truncate max-w-[100px]">
              {getCategoryLabel(category)}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${slug}`} className="block group/title">
            <h3 className="text-[13px] font-bold text-gray-800 group-hover/title:text-[#DC2626] transition-colors line-clamp-2 leading-[1.4] mb-2 min-h-[36px]" title={name}>
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">(5.0)</span>
          </div>

          {/* Requirement 4: Variant Selectors (e.g., page counts: 80p/120p/200p; colors: Blue/Black/Red) */}
          {variants && variants.length > 0 && variants[0].options?.length > 0 && (
            <div className="mb-3 pt-1">
              <div className="text-[10px] text-gray-500 font-bold mb-1 flex items-center gap-1">
                <Layers size={10} className="text-[#DC2626]" />
                <span>{variants[0].name}:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {variants[0].options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariant(opt);
                    }}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border transition-all cursor-pointer ${
                      selectedVariant === opt
                        ? 'border-[#DC2626] bg-red-50 text-[#DC2626] shadow-2xs'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Price + Cart */}
        <div className="pt-3 mt-auto border-t border-gray-100">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-base font-black text-gray-900 tracking-tight font-['Outfit']">
                Rs {price.toLocaleString()}
              </div>
              {compareAtPrice && compareAtPrice > price && (
                <div className="text-[11px] text-gray-400 line-through mt-0.5 font-medium">
                  Rs {compareAtPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={stock === 0}
              className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all duration-200 cursor-pointer border-none shadow-xs ${
                added
                  ? 'bg-emerald-600 text-white shadow-md scale-105'
                  : stock === 0
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#DC2626] to-[#E11D48] hover:from-[#B91C1C] hover:to-[#C2410C] text-white hover:shadow-md hover:scale-105'
              }`}
              title={stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              {added ? (
                <>
                  <Check size={14} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={14} />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
