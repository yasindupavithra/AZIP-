'use client';

import Link from 'next/link';
import { BookOpen, Award, Truck, ShieldCheck, Heart, Users, MapPin, Phone, Mail } from 'lucide-react';
import StoreShell from '@/components/StoreShell';

export default function AboutPage() {
  return (
    <StoreShell>
      {/* Banner */}
      <section className="bg-[#0f172a] text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="container relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/30 text-red-300 text-xs font-black uppercase rounded-full mb-3 tracking-wider">
            Our Story &amp; Purpose
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] mb-4">
            About <span className="text-[#e50914]">AZIP STORE</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Sri Lanka's trusted destination for school books, university textbooks, professional art supplies, stationery, and student electronics.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-12 sm:py-16 space-y-16 max-w-5xl">
        {/* Mission and Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#e50914] mb-2">
              Empowering Sri Lankan Education
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-['Outfit'] mb-4">
              Building a Brighter Future with Quality Learning Tools
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Founded in Kandy, AZIP Store was created to provide students, teachers, parents, and artists with easy access to 100% genuine stationery and books at honest, transparent prices.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              From kindergarten drawing supplies and school grade term textbooks, up to A/L science calculators and university research materials, we ensure no student is left behind without the essentials they need to excel.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-black text-[#e50914] font-['Outfit']">10,000+</div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">Students Served</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-2xl font-black text-[#e50914] font-['Outfit']">500+</div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">Official Brands</div>
              </div>
            </div>
          </div>

          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1507842229458-77903be6772b?auto=format&fit=crop&w=1200&q=80"
              alt="AZIP Bookstore"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 4 Pillars of Excellence */}
        <div>
          <div className="text-center max-w-md mx-auto mb-10">
            <h2 className="text-2xl font-black text-gray-900 font-['Outfit']">Why People Trust Us</h2>
            <p className="text-xs text-gray-500 mt-1">Our commitment to every learner and customer</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-red-50 text-[#e50914] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">100% Genuine Brands</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Direct authorized sourcing from Atlas, Casio, Pilot, Faber-Castell, and Oxford.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-red-50 text-[#e50914] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Truck size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Island-Wide Delivery</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Fast courier logistics to every city, town, and village in Sri Lanka within 24-72 hours.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-red-50 text-[#e50914] rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">School Booklist Packing</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Send your booklist on WhatsApp and our team will assemble, label, and pack everything.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
              <div className="w-12 h-12 bg-red-50 text-[#e50914] rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-1">Secure &amp; Reliable</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Convenient Cash on Delivery, bank transfers, and guaranteed safe packaging.
              </p>
            </div>
          </div>
        </div>

        {/* Visit Us in Kandy */}
        <div className="bg-gray-900 text-white rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] mb-3">
            Visit Our Store or Order Online
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mb-6">
            We are located in the heart of Kandy, Sri Lanka. Open Monday to Saturday 8:30 AM to 7:00 PM.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products" className="btn-primary text-xs uppercase tracking-wider">
              Shop Online Catalog
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-all"
            >
              Contact Our Kandy Branch
            </Link>
          </div>
        </div>
      </div>
    </StoreShell>
  );
}
