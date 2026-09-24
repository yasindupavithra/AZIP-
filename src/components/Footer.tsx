import Link from 'next/link';
import { ArrowRight, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white font-sans">
      
      {/* ── Main Footer Content ─────────────────────────── */}
      <div className="section-spacing-sm border-b border-white/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-block mb-5 group">
                <img
                  src="/azip-logo.png"
                  alt="AZIP .store"
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]"
                />
              </Link>
              
              <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-sm">
                Your trusted one-stop shop for premium educational materials, stationery, and school supplies. 
                Serving students across all 25 districts of Sri Lanka.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a href="tel:+94812222222" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <Phone size={15} className="text-gray-500 shrink-0" />
                  +94 81 222 2222
                </a>
                <a href="https://wa.me/94770000000" className="flex items-center gap-3 text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                  <MessageCircle size={15} className="text-gray-500 shrink-0" />
                  +94 77 000 0000 (WhatsApp)
                </a>
                <span className="flex items-center gap-3 text-sm text-gray-400">
                  <MapPin size={15} className="text-gray-500 shrink-0" />
                  Kandy, Sri Lanka
                </span>
                <span className="flex items-center gap-3 text-sm text-gray-400">
                  <Clock size={15} className="text-gray-500 shrink-0" />
                  Mon – Sat: 8:30 AM – 6:00 PM
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-white mb-5">
                Quick Links
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'All Products', href: '/products' },
                  { label: 'Special Offers', href: '/offers' },
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'FAQ', href: '/faq' },
                ].map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="block text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-white mb-5">
                Categories
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Books & Textbooks', slug: 'books' },
                  { label: 'Exercise & CR Books', slug: 'exercise-books' },
                  { label: 'Pens & Stationery', slug: 'writing-instruments' },
                  { label: 'Fine Art & Craft', slug: 'art-craft' },
                  { label: 'School Bags & Gear', slug: 'school-accessories' },
                  { label: 'Calculators & Tech', slug: 'electronics' },
                ].map((cat) => (
                  <Link 
                    key={cat.slug} 
                    href={`/products?category=${cat.slug}`}
                    className="block text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-1 transform duration-200"
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Column */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-white mb-5">
                Shop With Confidence
              </h4>
              
              <div className="space-y-4 mb-8">
                {[
                  '100% Genuine Authorized Products',
                  'Island-wide Delivery (24-72h)',
                  'Cash on Delivery Available',
                  '7-Day Easy Returns',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-red-900/20 transition-all hover:scale-105 uppercase tracking-wider"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────── */}
      <div className="py-5">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} AZIP Store. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium">Follow Us</span>
            <div className="flex gap-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all" title="Facebook">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all" title="Instagram">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all" title="YouTube">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
