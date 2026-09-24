'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Heart, Check, Eye } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { getCategoryImage, getCategoryLabel } from '@/lib/catalog';

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
  specTag
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const discount = compareAtPrice && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addItem({ id, name, price, image: image || getCategoryImage(category), stock });
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  // Determine Brand from name if not provided
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
    <div className="product-card group relative flex flex-col h-full bg-white rounded-2xl border border-gray-100 overflow-hidden">
      
      {/* Image Container */}
      <Link href={`/products/${slug}`} className="block relative aspect-square bg-gray-50/50 overflow-hidden">
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center bg-[#DC2626] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide shadow-sm">
              -{discount}%
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#DC2626] transition-all duration-200 border border-gray-100 cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110"
          title="Add to Wishlist"
        >
          <Heart size={14} className={isWishlisted ? "fill-[#DC2626] text-[#DC2626]" : ""} />
        </button>

        {/* Quick View Button */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center pb-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Link
            href={`/products/${slug}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/95 hover:bg-white text-gray-800 text-[11px] font-bold rounded-full shadow-lg border border-gray-100 transition-all hover:scale-105 backdrop-blur-sm"
          >
            <Eye size={13} /> Quick View
          </Link>
        </div>

        {/* Product Image */}
        <div className="w-full h-full p-6 flex items-center justify-center">
          <img
            src={image || getCategoryImage(category)}
            alt={name}
            className="max-w-full max-h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand */}
          <div className="text-[10px] font-bold tracking-[0.08em] text-gray-400 uppercase mb-1.5">
            {detectedBrand}
          </div>

          {/* Product Title */}
          <Link href={`/products/${slug}`} className="block group/title">
            <h3 className="text-[13px] font-semibold text-gray-800 group-hover/title:text-[#DC2626] transition-colors line-clamp-2 leading-[1.4] mb-2 min-h-[36px]" title={name}>
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">(5.0)</span>
          </div>
        </div>

        {/* Price + Cart */}
        <div className="pt-3 mt-auto border-t border-gray-50">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-base font-extrabold text-gray-900 tracking-tight font-['Outfit']">
                Rs {price.toLocaleString()}
              </div>
              {compareAtPrice && compareAtPrice > price && (
                <div className="text-[11px] text-gray-400 line-through mt-0.5">
                  Rs {compareAtPrice.toLocaleString()}
                </div>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={stock === 0}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer border-none ${
                added
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : stock === 0
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-600 hover:bg-[#DC2626] hover:text-white hover:shadow-md hover:scale-110'
              }`}
              title={stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            >
              {added ? <Check size={16} /> : <ShoppingCart size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
