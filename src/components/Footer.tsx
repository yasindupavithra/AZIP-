'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Send,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import AzipLogo from '@/components/brand/AzipLogo';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4500);
    }
  };

  return (
    <footer className="bg-[#050C1A] text-slate-300 font-sans border-t border-white/[0.08] selection:bg-[#0066FF] selection:text-white">
      {/* ── 1. Sleek Newsletter Strip (Compact, High-Converting, No Clutter) ── */}
      <div className="border-b border-white/[0.06] bg-gradient-to-b from-[#09152C] to-[#050C1A] py-8 sm:py-10">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0B1E3D] via-[#0D2650] to-[#0A1B36] p-5 sm:p-8 lg:p-9 shadow-[0_16px_40px_rgba(2,10,24,0.45)] border border-white/10">
            {/* Subtle ambient lighting */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Text content - concise and crisp */}
              <div className="lg:col-span-7 space-y-1.5 sm:space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/10 text-sky-300 text-[11px] font-bold uppercase tracking-wider border border-sky-400/20">
                  <Sparkles size={12} className="text-sky-300" />
                  <span>Exclusive Offer</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-black text-white tracking-tight leading-tight">
                  Get 10% Off Your First Order
                </h3>
                <p className="text-xs sm:text-[13px] text-slate-300/80 font-normal max-w-lg leading-relaxed">
                  Join our community for early access to verified booklist kits, exclusive discounts, and new arrivals.
                </p>
              </div>

              {/* Form - sleek frosted glass pill with controlled max-width */}
              <div className="lg:col-span-5">
                {isSubscribed ? (
                  <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold">
                    <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                    <span>You’re subscribed! Check your inbox for your 10% promo code.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2 max-w-md lg:ml-auto">
                    <div className="relative flex items-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 p-1.5 shadow-inner focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/25 transition-all">
                      <div className="pl-3 pr-2 text-slate-400 shrink-0">
                        <Mail size={17} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        className="flex-1 bg-transparent py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none min-w-0"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-full bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:from-[#0052CC] hover:to-[#0040A0] text-white font-bold text-xs tracking-wide transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 cursor-pointer border-none shrink-0"
                      >
                        <span>Subscribe</span>
                        <Send size={13} />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400/80 pl-3">
                      🔒 No spam. Unsubscribe anytime with a single click.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Refined Trust Strip (Minimalist, Airy & Elegant) ─────── */}
      <div className="border-b border-white/[0.05] bg-[#040A16] py-6 sm:py-7">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Pillar 1 */}
            <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                <Truck size={19} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">Islandwide Delivery</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-tight truncate">All 25 districts covered</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={19} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">100% Genuine Brands</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-tight truncate">Atlas, Casio, Faber-Castell</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <CreditCard size={19} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">Flexible Payments</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-tight truncate">Cash on Delivery &amp; Cards</p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-400 flex items-center justify-center shrink-0">
                <RotateCcw size={19} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">Easy 7-Day Returns</h4>
                <p className="text-[11px] text-slate-400 font-medium leading-tight truncate">Hassle-free replacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Main Footer Links Grid ──────────────────────────────── */}
      <div className="py-10 sm:py-14">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Col 1: Brand & Tagline (Span 4) */}
            <div className="lg:col-span-4 space-y-3.5">
              <Link href="/" className="inline-block group">
                <AzipLogo
                  variant="dark"
                  className="h-11 sm:h-12 w-auto transition-transform group-hover:scale-105"
                />
              </Link>
              
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/[0.07] text-white text-[11px] font-semibold border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Educational Supplier · Sri Lanka</span>
              </div>

              {/* Clean, concise 1-sentence tagline */}
              <p className="text-xs sm:text-[13px] text-slate-300/80 leading-relaxed max-w-sm">
                Your trusted partner for authentic school textbooks, CR notebooks, and student essentials with guaranteed doorstep delivery.
              </p>
              
              <div className="pt-1 flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <Lock size={12} className="text-emerald-400" /> 256-Bit SSL Secured
                </span>
                <span className="text-slate-600">•</span>
                <span>Reg. PV 00291438</span>
              </div>
            </div>

            {/* Col 2: Quick Links (Span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-white text-xs font-black uppercase tracking-[0.14em]">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-300/80 font-medium">
                <li>
                  <Link href="/" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=school-books" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    Student Kits
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    Special Offers
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    About Our Store
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Categories (Span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-white text-xs font-black uppercase tracking-[0.14em]">
                Categories
              </h4>
              <ul className="space-y-2 text-xs sm:text-[13px] text-slate-300/80 font-medium">
                <li>
                  <Link href="/products?category=school-books" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    School Textbooks &amp; Syllabi
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=exercise-books" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    CR &amp; Exercise Notebooks
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=writing-instruments" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    Pens &amp; Writing Stationery
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=mathematical-instruments" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    Casio Scientific Calculators
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=art-craft" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    Art Supplies &amp; Pastels
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=school-accessories" className="hover:text-white hover:translate-x-1 inline-block transition-transform">
                    School &amp; Laptop Backpacks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Socials (Span 3) */}
            <div className="lg:col-span-3 space-y-3.5">
              <h4 className="text-white text-xs font-black uppercase tracking-[0.14em]">
                Get in Touch
              </h4>

              <div className="space-y-2.5 text-xs sm:text-[13px]">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
                    <Phone size={13} />
                  </div>
                  <div>
                    <a href="tel:+94112345678" className="font-bold text-white hover:text-sky-300 transition-colors">
                      +94 11 234 5678
                    </a>
                    <span className="text-[10.5px] text-slate-400 block">Mon - Sat: 8:30 AM – 7:00 PM</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <Mail size={13} />
                  </div>
                  <div>
                    <a href="mailto:info@azipstore.lk" className="text-white font-medium hover:text-sky-300 transition-colors">
                      info@azipstore.lk
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.06] text-slate-400 flex items-center justify-center shrink-0">
                    <MapPin size={13} />
                  </div>
                  <span className="text-slate-300">Colombo &amp; Kandy, Sri Lanka</span>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-2">
                <div className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider mb-2">Follow Us</div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-[#1877F2] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    aria-label="Facebook"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-500 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    aria-label="Instagram"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-[#FF0000] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    aria-label="YouTube"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/[0.06] hover:bg-black text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    aria-label="TikTok"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.68c0 1.52-.36 3.06-1.18 4.34-1.07 1.7-2.84 2.87-4.82 3.25-1.92.38-3.99.04-5.69-.96-1.89-1.1-3.21-3-3.66-5.15-.47-2.17-.05-4.52 1.16-6.39 1.25-1.92 3.29-3.2 5.56-3.47.28-.03.56-.05.84-.05v4.06c-.66.08-1.32.32-1.84.75-.82.68-1.3 1.7-1.34 2.76-.04 1.12.44 2.22 1.28 2.92.83.69 1.97.94 3.01.68.99-.24 1.83-.93 2.27-1.85.3-.64.44-1.35.44-2.07V.02z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── 4. Bottom Legal & Payment Methods Bar (Refined & Unified) ── */}
      <div className="border-t border-white/[0.06] bg-[#030712] pt-5 pb-28 md:pb-6 text-xs text-slate-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-slate-400 text-xs font-medium">
                &copy; {new Date().getFullYear()} <span className="text-white font-bold">AZIP Store (Pvt) Ltd.</span> All rights reserved.
              </p>
            </div>

            {/* Payment Method Badges - Elegant, Subtle & Unified */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <span className="text-[10.5px] text-slate-400 font-semibold mr-1">
                Accepted Payments:
              </span>
              {['VISA', 'MASTERCARD', 'AMEX', 'CASH ON DELIVERY', 'BANK TRANSFER', 'KOKO / MINTPAY'].map((method) => (
                <div
                  key={method}
                  className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.09] text-slate-200 font-bold text-[9px] tracking-wider border border-white/[0.08] transition-colors"
                >
                  {method}
                </div>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-3 text-[11.5px] font-medium text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="text-slate-600">·</span>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <span className="text-slate-600">·</span>
              <Link href="/faq" className="hover:text-white transition-colors">Return Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
