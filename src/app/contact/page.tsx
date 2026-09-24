'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, CheckCircle2 } from 'lucide-react';
import StoreShell from '@/components/StoreShell';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <StoreShell>
      {/* Header */}
      <section className="bg-[#0f172a] text-white py-14 sm:py-20 text-center">
        <div className="container max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/30 text-red-300 text-xs font-black uppercase rounded-full mb-3 tracking-wider">
            Customer Support &amp; Branch Info
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] mb-3">
            Contact <span className="text-[#e50914]">AZIP STORE</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Have questions about a book, bulk orders, or your delivery? We are here to help!
          </p>
        </div>
      </section>

      <div className="container py-12 sm:py-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-gray-900 font-['Outfit'] pb-3 border-b border-gray-100">
                Store Location &amp; Contact
              </h2>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e50914] flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Address</h3>
                  <p className="text-sm font-semibold text-gray-900 leading-snug">
                    AZIP Store, Peradeniya Road,<br />Kandy 20000, Sri Lanka
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e50914] flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Phone Call</h3>
                  <p className="text-sm font-semibold text-gray-900">+94 81 222 2222 / +94 77 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">WhatsApp Orders</h3>
                  <p className="text-sm font-semibold text-emerald-700">+94 77 000 0000</p>
                  <a
                    href="https://wa.me/94770000000"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:underline mt-1 inline-block"
                  >
                    Click to Open WhatsApp Chat →
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#e50914] flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Email Support</h3>
                  <p className="text-sm font-semibold text-gray-900">support@azipstore.lk</p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-2 border-t border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Opening Hours</h3>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Mon - Sat: 8:30 AM – 7:00 PM<br />
                    Sunday &amp; Poya: 9:00 AM – 2:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 font-['Outfit'] mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill out the form below and our team will get back to you within 2-4 hours.
              </p>

              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-['Outfit'] mb-1">Message Sent Successfully!</h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
                    Thank you for reaching out. We have received your inquiry and will contact you shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="btn-primary text-xs uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Kasun Perera"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="077 XXXXXXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Subject</label>
                      <input
                        type="text"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        placeholder="School Booklist / Product Inquiry"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Write your questions, product names, or book details..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary py-3.5 px-8 text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    <Send size={15} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </StoreShell>
  );
}
