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
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#051329] text-slate-300 font-sans border-t border-white/10 selection:bg-[#0066FF] selection:text-white">
      {/* ── 1. Top Newsletter Strip ─────────────────────────────────── */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[#081B3A] to-[#051329] py-10 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C346D] via-[#0E448E] to-[#0A2A57] p-6 sm:p-10 shadow-[0_16px_40px_rgba(2,12,27,0.35)] border border-white/15">
            {/* Ambient decorative lighting */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/15 text-sky-300 text-[11px] font-bold uppercase tracking-wider border border-sky-400/25">
                  <Sparkles size={12} className="text-sky-300" />
                  <span>Student &amp; Parent Community</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Get 10% Off Your First Term Order
                </h3>
                <p className="text-sm text-slate-200/90 font-medium max-w-xl leading-relaxed">
                  Join 15,000+ parents and students across Sri Lanka receiving early access to verified booklist kits, exclusive Casio discounts, and new arrivals.
                </p>
              </div>

              <div className="lg:col-span-5">
                {isSubscribed ? (
                  <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-sm font-semibold">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    <span>Thank you for subscribing! Check your email for your 10% discount code.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSubscribe} className="space-y-2">
                    <div className="relative flex items-center rounded-full bg-white p-1.5 shadow-lg shadow-black/20 focus-within:ring-4 focus-within:ring-sky-400/20 transition-all">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address..."
                        className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-bold text-xs uppercase tracking-wider transition-all hover:shadow-md cursor-pointer border-none shrink-0"
                      >
                        <span>Subscribe</span>
                        <Send size={13} />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-300/70 pl-3">
                      🔒 No spam guaranteed. You can unsubscribe with one click anytime.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Value Pillars (Trust Strip) ─────────────────────────── */}
      <div className="border-b border-white/5 bg-[#041024] py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Pillar 1 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.05] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/20 text-sky-400 flex items-center justify-center shrink-0">
                <Truck size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Islandwide Delivery</h4>
                <p className="text-[12px] text-slate-400 font-medium leading-snug">Fast doorstep delivery to all 25 districts</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.05] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">100% Genuine Brands</h4>
                <p className="text-[12px] text-slate-400 font-medium leading-snug">Atlas, Casio, Pilot &amp; Faber-Castell direct</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.05] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
                <CreditCard size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Secure Payment Modes</h4>
                <p className="text-[12px] text-slate-400 font-medium leading-snug">Cash on Delivery, Cards &amp; Bank Transfer</p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/8 hover:bg-white/[0.05] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-400/20 text-purple-400 flex items-center justify-center shrink-0">
                <RotateCcw size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">Easy 7-Day Exchange</h4>
                <p className="text-[12px] text-slate-400 font-medium leading-snug">Hassle-free replacement for items &amp; books</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Main Footer Links Grid ──────────────────────────────── */}
      <div className="py-14 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
            
            {/* Col 1: Brand & Bio (Span 4) */}
            <div className="lg:col-span-4 space-y-4">
              <Link href="/" className="inline-block group">
                <img
                  src="/azip-logo.png"
                  alt="AZIP Store"
                  className="h-11 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-white text-[11px] font-bold tracking-tight">
                <CheckCircle2 size={13} className="text-sky-400" />
                <span>Verified Educational Supplier · Sri Lanka</span>
              </div>
              <p className="text-[13px] text-slate-300/85 leading-relaxed font-normal max-w-sm">
                AZIP Store is Sri Lanka’s premier educational partner. We supply genuine school textbooks, CR notebooks, certified scientific calculators, and premium stationery kits with islandwide home delivery.
              </p>
              
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Lock size={12} className="text-emerald-400" /> 256-Bit SSL Secured
                </span>
                <span>•</span>
                <span>Registered PV 00291438</span>
              </div>
            </div>

            {/* Col 2: Quick Links (Span 2) */}
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-white text-xs font-black uppercase tracking-[0.16em] mb-4 pb-1 border-b border-white/10 inline-block">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-[13px] font-medium text-slate-300/90">
                <li>
                  <Link href="/" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=school-books" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> Student Kits
                  </Link>
                </li>
                <li>
                  <Link href="/offers" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> Special Offers
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> About Our Store
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> Contact Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Popular Categories (Span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-white text-xs font-black uppercase tracking-[0.16em] mb-4 pb-1 border-b border-white/10 inline-block">
                Top Categories
              </h4>
              <ul className="space-y-2.5 text-[13px] font-medium text-slate-300/90">
                <li>
                  <Link href="/products?category=school-books" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> School Books &amp; Syllabi
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=exercise-books" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> CR &amp; Exercise Notebooks
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=writing-instruments" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> Pens &amp; Writing Stationery
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=mathematical-instruments" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> Casio Scientific Calculators
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=art-craft" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> Art Supplies &amp; Pastels
                  </Link>
                </li>
                <li>
                  <Link href="/products?category=school-accessories" className="hover:text-white hover:translate-x-1 inline-flex items-center gap-1 transition-all">
                    <ChevronRight size={12} className="text-sky-400" /> School &amp; Laptop Backpacks
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Socials (Span 3) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="text-white text-xs font-black uppercase tracking-[0.16em] mb-4 pb-1 border-b border-white/10 inline-block">
                Get in Touch
              </h4>
              <ul className="space-y-3 text-[13px] font-medium text-slate-300">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-sky-400">
                    <Phone size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Hotline &amp; Orders</div>
                    <a href="tel:+94112345678" className="hover:text-sky-300 transition-colors font-bold text-white text-sm">
                      +94 11 234 5678
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                    <Mail size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Customer Support</div>
                    <a href="mailto:info@azipstore.lk" className="hover:text-sky-300 transition-colors font-semibold text-white">
                      info@azipstore.lk
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-sky-400">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Store Locations</div>
                    <span className="text-slate-300 text-xs">Colombo &amp; Kandy, Sri Lanka</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-sky-400">
                    <Clock size={14} />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Working Hours</div>
                    <span className="text-slate-300 text-xs">Mon - Sat: 8:30 AM – 7:00 PM</span>
                  </div>
                </li>
              </ul>

              {/* Social Channels */}
              <div className="pt-2">
                <div className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2.5">Follow Our Socials</div>
                <div className="flex items-center gap-2.5">
                  {/* Facebook */}
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#1877F2] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-500 text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* YouTube */}
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#FF0000] text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>

                  {/* TikTok */}
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-black text-white flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                    aria-label="TikTok"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.68c0 1.52-.36 3.06-1.18 4.34-1.07 1.7-2.84 2.87-4.82 3.25-1.92.38-3.99.04-5.69-.96-1.89-1.1-3.21-3-3.66-5.15-.47-2.17-.05-4.52 1.16-6.39 1.25-1.92 3.29-3.2 5.56-3.47.28-.03.56-.05.84-.05v4.06c-.66.08-1.32.32-1.84.75-.82.68-1.3 1.7-1.34 2.76-.04 1.12.44 2.22 1.28 2.92.83.69 1.97.94 3.01.68.99-.24 1.83-.93 2.27-1.85.3-.64.44-1.35.44-2.07V.02z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── 4. Bottom Legal & Payment Methods Bar ───────────────────── */}
      <div className="border-t border-white/10 bg-[#030B17] pt-6 pb-28 md:pb-8 text-xs text-slate-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-slate-400 text-xs font-medium">
                &copy; {new Date().getFullYear()} <span className="text-white font-bold">AZIP Store (Pvt) Ltd.</span> All rights reserved.
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Empowering education and literacy across Sri Lanka since 2018.
              </p>
            </div>

            {/* Payment Method Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-md">
              <span className="text-[11px] text-slate-400 font-semibold w-full text-center sm:w-auto mr-1 mb-1 sm:mb-0">
                Accepted Payments:
              </span>
              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-white/10 text-white font-bold text-[9.5px] sm:text-[10px] tracking-wider border border-white/10">
                VISA
              </div>
              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-white/10 text-white font-bold text-[9.5px] sm:text-[10px] tracking-wider border border-white/10">
                MASTERCARD
              </div>
              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-white/10 text-white font-bold text-[9.5px] sm:text-[10px] tracking-wider border border-white/10">
                AMEX
              </div>
              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-emerald-500/15 text-emerald-300 font-bold text-[9.5px] sm:text-[10px] tracking-wider border border-emerald-400/20">
                CASH ON DELIVERY
              </div>
              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-sky-500/15 text-sky-300 font-bold text-[9.5px] sm:text-[10px] tracking-wider border border-sky-400/20">
                BANK TRANSFER
              </div>
              <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[#25D366]/20 text-[#25D366] font-bold text-[9.5px] sm:text-[10px] tracking-wider border border-[#25D366]/30">
                KOKO / MINTPAY
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-3 sm:gap-4 text-[11.5px] sm:text-[12px] font-medium text-slate-400">
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
