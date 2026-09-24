'use client';

import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function CartDrawer() {
  const { items, isOpen, setCartOpen, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setCartOpen(false)}
        className="fixed inset-0 bg-black/50 z-50 transition-opacity backdrop-blur-[2px]"
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-50 shadow-2xl flex flex-col border-l border-gray-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#e50914]" />
            <h3 className="text-base font-black text-gray-900 font-['Outfit']">
              Shopping Cart ({itemCount})
            </h3>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-400">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={28} />
              </div>
              <p className="text-sm font-bold text-gray-700 mb-1">Your cart is empty</p>
              <p className="text-xs text-gray-400 mb-6">Add high quality stationery and books from our catalog.</p>
              <Link
                href="/products"
                onClick={() => setCartOpen(false)}
                className="btn-primary text-xs uppercase tracking-wider"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex gap-3 items-center"
              >
                <div className="w-16 h-16 rounded-lg bg-white border border-gray-100 overflow-hidden shrink-0">
                  <img
                    src={item.image || '/placeholder.png'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate mb-1">
                    {item.name}
                  </h4>
                  <div className="text-xs font-extrabold text-[#e50914] font-['Outfit'] mb-2">
                    Rs. {item.price.toLocaleString()}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded bg-white p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-[#e50914] transition-colors p-1"
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

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-500 font-semibold">Subtotal</span>
              <span className="text-xl font-black text-[#e50914] font-['Outfit']">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setCartOpen(false)}
              className="w-full btn-primary py-3 text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight size={15} />
            </Link>

            <Link
              href="/cart"
              onClick={() => setCartOpen(false)}
              className="w-full block py-2 text-center text-xs font-bold text-gray-600 hover:text-gray-900"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
