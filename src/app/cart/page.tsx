'use client';

import Link from 'next/link';
import { Minus, Plus, ShoppingBag, ArrowRight, Trash2, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import { useCartStore } from '@/store/cart';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal > 5000 || subtotal === 0 ? 0 : 350;
  const total = subtotal + deliveryFee;

  return (
    <StoreShell>
      <div className="container py-8 md:py-12 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-['Outfit']">
              Shopping Cart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Review your items and proceed to fast checkout.
            </p>
          </div>

          <Link
            href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#e50914] transition-colors"
          >
            <ArrowLeft size={15} /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 px-6 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-20 h-20 bg-red-50 text-[#e50914] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 font-['Outfit'] mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto">
              Looks like you haven't added any stationery, books, or electronics to your cart yet.
            </p>
            <Link href="/products" className="btn-primary text-xs tracking-wider uppercase">
              Start Shopping Now <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex gap-4 sm:gap-6 items-center">
                    {/* Item Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1 mb-1">
                        {item.name}
                      </h3>
                      <div className="text-sm font-extrabold text-[#e50914] font-['Outfit'] mb-3">
                        Rs. {item.price.toLocaleString()} each
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="font-bold text-xs w-8 text-center text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded bg-white text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-sm sm:text-base font-black text-gray-900 font-['Outfit']">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-[#e50914] transition-colors rounded-lg hover:bg-red-50"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center px-2">
                <button
                  onClick={clearCart}
                  className="text-xs font-semibold text-gray-400 hover:text-[#e50914] transition-colors"
                >
                  Clear Cart
                </button>
                <Link
                  href="/products"
                  className="text-xs font-bold text-[#e50914] hover:underline"
                >
                  + Add More Products
                </Link>
              </div>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-28">
                <h2 className="text-lg font-black text-gray-900 font-['Outfit'] pb-4 border-b border-gray-100 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 text-xs sm:text-sm mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Islandwide Delivery</span>
                    <span className="font-bold text-emerald-600">
                      {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                    </span>
                  </div>

                  {deliveryFee > 0 && (
                    <p className="text-[11px] text-gray-400">
                      Add Rs. {(5000 - subtotal).toLocaleString()} more for free island-wide delivery!
                    </p>
                  )}

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-black text-[#e50914] font-['Outfit']">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full btn-primary py-3.5 text-sm uppercase tracking-wider mb-3 text-center"
                >
                  Proceed to Checkout <ArrowRight size={17} />
                </Link>

                <div className="pt-4 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={15} className="text-emerald-600" />
                    <span>Secure Checkout with COD &amp; Transfers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={15} className="text-emerald-600" />
                    <span>Fast Delivery (24-72h)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StoreShell>
  );
}
