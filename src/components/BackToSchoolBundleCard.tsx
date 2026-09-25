'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Sparkles, CheckCircle2, PackageCheck } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { SchoolBundleKit } from '@/lib/catalog';

interface BackToSchoolBundleCardProps {
  bundle: SchoolBundleKit;
}

export default function BackToSchoolBundleCard({ bundle }: BackToSchoolBundleCardProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddBundleToCart = () => {
    addItem({
      id: bundle.id,
      name: bundle.name,
      price: bundle.price,
      image: bundle.image,
      stock: 50,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full font-sans">
      
      {/* Top Banner Tag */}
      <div className="relative aspect-16/10 bg-gray-50 overflow-hidden shrink-0">
        <img
          src={bundle.image}
          alt={bundle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        
        {/* Savings Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#DC2626] text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-md">
          <Sparkles size={12} className="fill-white" />
          <span>Save {bundle.savingsPercentage}% Off</span>
        </div>

        {/* Grade Badge */}
        <div className="absolute top-3 right-3 z-10 bg-slate-900/90 backdrop-blur-md text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-full border border-slate-700">
          {bundle.gradeBadge}
        </div>

        {/* Bottom Overlay Title */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <h3 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-sm">
            {bundle.name}
          </h3>
        </div>
      </div>

      {/* Body: Items Included */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <p className="text-xs text-gray-600 font-medium mb-3.5 leading-relaxed">
            {bundle.description}
          </p>

          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 mb-4">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <PackageCheck size={14} className="text-[#DC2626]" />
              <span>Items Included in Kit ({bundle.itemsIncluded.length}):</span>
            </div>
            <ul className="space-y-1.5">
              {bundle.itemsIncluded.map((item, idx) => (
                <li key={idx} className="text-xs text-gray-700 font-medium flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-gray-400 font-medium">Bundle Special Price</div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight font-['Outfit']">
                Rs {bundle.price.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through font-medium">
                Rs {bundle.originalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddBundleToCart}
            className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer border-none shadow-md ${
              added
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-gradient-to-r from-[#DC2626] to-[#E11D48] hover:from-[#B91C1C] hover:to-[#C2410C] text-white hover:scale-105 hover:shadow-lg'
            }`}
          >
            {added ? (
              <>
                <Check size={16} />
                <span>Kit Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>Add Kit to Cart</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
