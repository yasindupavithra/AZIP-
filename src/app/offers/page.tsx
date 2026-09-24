'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flame, Clock, Tag, Percent, ArrowRight, Sparkles } from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import ProductCard from '@/components/ProductCard';
import { INITIAL_CATALOG_PRODUCTS } from '@/lib/catalog';

export default function OffersPage() {
  const deals = INITIAL_CATALOG_PRODUCTS.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);

  return (
    <StoreShell>
      {/* Banner */}
      <section className="bg-gradient-to-r from-red-700 via-rose-800 to-red-900 text-white py-14 sm:py-18 text-center relative overflow-hidden">
        <div className="container relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-black uppercase tracking-wider mb-3">
            <Flame size={14} className="text-amber-300" /> HOT DEALS &amp; PROMOTIONS
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] mb-3">
            Special Discounts &amp; Offers
          </h1>
          <p className="text-xs sm:text-sm text-red-100 max-w-md mx-auto">
            Save up to 40% on genuine school stationery, Casio scientific calculators, Faber-Castell art sets, and backpacks.
          </p>
        </div>
      </section>

      <div className="container py-10 sm:py-14">
        {/* Promo Coupons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-red-300 shadow-sm flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#e50914] bg-red-50 px-2 py-0.5 rounded">
                FREE DELIVERY
              </span>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-1">Orders Over Rs. 5,000</h3>
              <p className="text-xs text-gray-500">Automatically applied at checkout</p>
            </div>
            <div className="font-['Outfit'] font-black text-xl text-[#e50914]">FREE</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-red-300 shadow-sm flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                STUDENT BUNDLE
              </span>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-1">A/L &amp; O/L Math Packs</h3>
              <p className="text-xs text-gray-500">Geometry + Casio combos</p>
            </div>
            <div className="font-['Outfit'] font-black text-xl text-emerald-600">-20%</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-dashed border-red-300 shadow-sm flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                ARTIST PASS
              </span>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mt-1">Faber-Castell &amp; Paints</h3>
              <p className="text-xs text-gray-500">Studio packs on sale</p>
            </div>
            <div className="font-['Outfit'] font-black text-xl text-blue-600">-15%</div>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-['Outfit']">
            Discounted Products On Sale ({deals.length})
          </h2>
          <span className="text-xs text-gray-400 font-semibold">Limited Stock Available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {deals.map((product) => (
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
      </div>
    </StoreShell>
  );
}
