'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Tag, ShoppingCart, HelpCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { toggleCart, getItemCount } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;

  // Don't show in admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Categories', href: '/products', icon: LayoutGrid },
    { label: 'Offers', href: '/offers', icon: Tag },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] py-1.5 px-3"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#0066FF] font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart button */}
        <button
          type="button"
          onClick={toggleCart}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-900 font-medium border-none bg-transparent cursor-pointer relative"
        >
          <div className="relative">
            <ShoppingCart size={20} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-[#0066FF] text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
        </button>

        {/* Support */}
        <Link
          href="/faq"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            pathname === '/faq'
              ? 'text-[#0066FF] font-bold'
              : 'text-slate-500 hover:text-slate-900 font-medium'
          }`}
        >
          <HelpCircle size={20} strokeWidth={pathname === '/faq' ? 2.4 : 1.8} />
          <span className="text-[10px] mt-0.5 tracking-tight">Help</span>
        </Link>
      </div>
    </nav>
  );
}
