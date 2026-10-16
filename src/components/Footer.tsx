import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#041E3A] text-slate-300 font-sans">

      <div className="py-14 sm:py-16 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">

            <div className="lg:col-span-1 space-y-4">
              <Link href="/" className="inline-block group">
                <img
                  src="/azip-logo.png"
                  alt="AZIP Store"
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-[1.03]"
                />
              </Link>
              <div className="text-white text-sm font-bold tracking-tight">
                Your Learning Partner
              </div>
              <p className="text-[13px] text-slate-400 leading-relaxed font-medium max-w-xs">
                Your trusted one-stop destination for genuine educational materials, school stationery, and certified calculators across Sri Lanka.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-['Outfit']">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">Shop</Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Categories */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-['Outfit']">
                Categories
              </h4>
              <ul className="space-y-2.5 text-xs font-medium">
                <li>
                  <Link href="/products?category=school-books" className="hover:text-white transition-colors">School Books</Link>
                </li>
                <li>
                  <Link href="/products?category=exercise-books" className="hover:text-white transition-colors">CR &amp; Notebooks</Link>
                </li>
                <li>
                  <Link href="/products?category=writing-instruments" className="hover:text-white transition-colors">Stationery</Link>
                </li>
                <li>
                  <Link href="/products?category=art-craft" className="hover:text-white transition-colors">Art Supplies</Link>
                </li>
                <li>
                  <Link href="/products?category=school-accessories" className="hover:text-white transition-colors">Backpacks</Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Get In Touch */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-['Outfit']">
                Get In Touch
              </h4>
              <ul className="space-y-3 text-xs font-medium">
                <li className="flex items-center gap-2.5">
                  <Phone size={14} className="text-sky-400 shrink-0" />
                  <a href="tel:+94112345678" className="hover:text-white transition-colors">+94 11 234 5678</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={14} className="text-sky-400 shrink-0" />
                  <a href="mailto:info@azipstore.lk" className="hover:text-white transition-colors">info@azipstore.lk</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin size={14} className="text-sky-400 shrink-0" />
                  <span>Colombo, Sri Lanka</span>
                </li>
              </ul>
            </div>

            {/* Column 5: Follow Us */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 font-['Outfit']">
                Follow Us
              </h4>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#007AFF] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
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
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-500 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
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
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
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
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-black text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
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

      {/* ── Bottom Legal Bar ──────────────────────────────── */}
      <div className="py-5 text-xs text-slate-400">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            &copy; {new Date().getFullYear()} AZIP Store. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-[11px]">
            <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">|</span>
            <Link href="/terms" className="hover:text-slate-200 transition-colors">Terms &amp; Conditions</Link>
            <span className="text-slate-700">|</span>
            <Link href="/faq" className="hover:text-slate-200 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
