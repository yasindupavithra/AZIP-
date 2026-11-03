'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Trash2,
  Tag,
  Sparkles,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useLanguage } from '@/lib/languageContext';

interface ActiveCoupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  label: string;
}

const VALID_COUPONS: Record<string, ActiveCoupon> = {
  ANTIGRAVITY: {
    code: 'ANTIGRAVITY',
    type: 'percent',
    value: 15,
    label: '15% off',
  },
  CYBERSTUDENT: {
    code: 'CYBERSTUDENT',
    type: 'flat',
    value: 500,
    label: 'Rs. 500 off',
  },
  AZIP2026: {
    code: 'AZIP2026',
    type: 'percent',
    value: 10,
    label: '10% off',
  },
};

const FREE_SHIPPING_THRESHOLD = 5000;

export default function CartDrawer() {
  const { t } = useLanguage();
  const { items, isOpen, setCartOpen, removeItem, updateQuantity } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<ActiveCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // Discount calculation
  let couponDiscount = 0;
  if (appliedCoupon && subtotal > 0) {
    if (appliedCoupon.type === 'percent') {
      couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      couponDiscount = Math.min(subtotal, appliedCoupon.value);
    }
  }

  const finalTotal = Math.max(0, subtotal - couponDiscount);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (VALID_COUPONS[code]) {
      setAppliedCoupon(VALID_COUPONS[code]);
      setCouponSuccess(`Coupon "${code}" applied`);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponSuccess('');
    setCouponError('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-[#050B14]/75 z-50 transition-opacity backdrop-blur-sm"
      />

      {/* Floating Futuristic Cyan Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[440px] bg-white z-50 shadow-[-12px_0_40px_rgba(0,196,216,0.22)] flex flex-col border-l-2 border-[#00C4D8] animate-slide-left">
        {/* Top Cyan Accent Strip */}
        <div className="h-1 bg-gradient-to-r from-[#00C4D8] via-[#00E5FF] to-[#009BB0]" />

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-[#F2FBFC] to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-none bg-[#00C4D8]/15 text-[#008D9B] flex items-center justify-center border border-[#00C4D8]/30">
              <ShoppingBag size={19} className="text-[#00C4D8]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 font-['Outfit'] flex items-center gap-1.5">
                {t('cart.title')}
                <span className="text-xs font-bold text-[#008D9B] bg-[#00C4D8]/15 px-2 py-0.5 rounded-none border border-[#00C4D8]/20">
                  {itemCount}
                </span>
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-none bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer border-none"
            aria-label="Close cart"
          >
            <X size={17} />
          </button>
        </div>

        {/* Free Shipping Dynamic Progress Meter */}
        <div className="px-5 py-3 bg-[#E6FCFD]/80 border-b border-[#00C4D8]/20">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="flex items-center gap-1.5 text-[#008D9B]">
              <Truck size={14} />
              {remainingForFreeShipping > 0
                ? t('cart.free_shipping_hint').replace('{amount}', remainingForFreeShipping.toLocaleString())
                : t('cart.free_shipping_unlocked')}
            </span>
            <span className="text-[11px] font-mono text-slate-600">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200/80 rounded-none overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00C4D8] to-[#00E5FF] transition-all duration-500 rounded-none shadow-[0_0_8px_#00C4D8]"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 px-4 text-slate-400">
              <div className="w-20 h-20 bg-[#E6FCFD] text-[#00C4D8] rounded-none flex items-center justify-center mb-4 border border-[#00C4D8]/30 antigravity-levitate">
                <ShoppingBag size={34} />
              </div>
              <h4 className="text-base font-black text-slate-800 mb-1 font-['Outfit']">
                {t('cart.empty_title')}
              </h4>
              <p className="text-xs text-slate-500 mb-6 max-w-xs leading-relaxed">
                {t('cart.empty_desc')}
              </p>
              <Link
                href="/products"
                onClick={() => setCartOpen(false)}
                className="btn-primary text-xs uppercase tracking-wider"
              >
                Browse Books &amp; Stationery
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-white rounded-none border border-slate-200/90 hover:border-[#00C4D8]/60 transition-all flex gap-3 items-center shadow-xs group"
              >
                <div className="w-16 h-16 rounded-none bg-slate-50 border border-slate-100 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate mb-1">
                    {item.name}
                  </h4>
                  <div className="text-xs font-black text-[#008D9B] font-['Outfit'] mb-2">
                    Rs. {item.price.toLocaleString()}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-slate-200 rounded-none bg-slate-50 p-0.5 shadow-xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-white rounded-none cursor-pointer border-none bg-transparent"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center text-slate-900 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-600 hover:bg-white rounded-none cursor-pointer border-none bg-transparent"
                        aria-label="Increase quantity"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1 cursor-pointer border-none bg-transparent"
                      title="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon Engine & Totals */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white space-y-3.5 shadow-lg">
            {/* Interactive Coupon Code Engine */}
            <div className="p-3 rounded-none bg-slate-50 border border-slate-200/80">
              {appliedCoupon ? (
                <div className="flex items-center justify-between gap-2 p-2 rounded-none bg-[#E6FCFD] border border-[#00C4D8]/50">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Tag size={13} className="text-[#00C4D8] shrink-0" />
                    <div>
                      <span className="text-xs font-black text-slate-900 font-mono">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[10px] text-[#008D9B] font-semibold truncate">
                        {appliedCoupon.label}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs text-slate-400 hover:text-red-500 font-bold border-none bg-transparent cursor-pointer p-1"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder={t('cart.coupon_placeholder')}
                        className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-none focus:outline-none focus:border-[#00C4D8] uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#00C4D8] hover:bg-[#00A3B5] text-white text-xs font-bold rounded-none cursor-pointer border-none transition-colors shrink-0"
                    >
                      {t('cart.coupon_apply')}
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[10.5px] text-red-500 font-semibold flex items-center gap-1">
                      <AlertCircle size={11} /> {couponError}
                    </p>
                  )}
                  {couponSuccess && (
                    <p className="text-[10.5px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={11} /> {couponSuccess}
                    </p>
                  )}

                  {/* Active promo hint */}
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium pt-0.5">
                    <Sparkles size={11} className="text-[#00C4D8]" />
                    <span>Try promo code <strong className="text-[#008D9B]">ANTIGRAVITY</strong> for 15% off</span>
                  </div>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span className="font-bold text-slate-800">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#008D9B] font-bold">
                  <span>{t('cart.coupon_discount')}</span>
                  <span>- Rs. {couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Islandwide Delivery</span>
                <span className="font-bold text-emerald-600">
                  {remainingForFreeShipping === 0 ? 'FREE' : 'Rs. 350'}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 text-slate-900">
                <span className="text-sm font-black">{t('cart.total')}</span>
                <span className="text-xl font-black text-[#008D9B] font-['Outfit']">
                  Rs. {finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="w-full btn-primary py-3.5 text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              {t('cart.checkout')} <ArrowRight size={15} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
