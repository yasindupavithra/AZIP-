'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';
import StoreShell from '@/components/StoreShell';

const faqs = [
  {
    q: 'How long does delivery take across Sri Lanka?',
    a: 'Orders within Kandy district are delivered within 24 hours. For Colombo, Gampaha, Kurunegala, Galle, Matara, Jaffna and all other districts, courier delivery takes 48 to 72 hours (2-3 working days).'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery (COD) islandwide, Direct Bank Transfers (Commercial Bank & Sampath Bank), and direct WhatsApp order confirmation.'
  },
  {
    q: 'Can I send a photo of my child’s school booklist to order?',
    a: 'Yes! You can simply snap a photo of your school booklist and send it to our WhatsApp number (+94 77 000 0000). Our team will prepare the exact books, exercise books, stationery, and book covers, and send you the invoice before dispatching.'
  },
  {
    q: 'Are all Casio calculators 100% original with warranty?',
    a: 'Yes, 100%. All Casio calculators sold at AZIP Store are genuine official units with authorized 3-year warranty and anti-counterfeit QR security tags.'
  },
  {
    q: 'Is there a minimum order amount for delivery?',
    a: 'No minimum order amount is required. Standard islandwide delivery is Rs. 350, and all orders over Rs. 5,000 qualify for 100% FREE delivery.'
  },
  {
    q: 'What should I do if an item is damaged upon arrival?',
    a: 'Please contact us on WhatsApp or call within 7 days of receiving your package. We will immediately arrange a free exchange or full refund.'
  }
];

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <StoreShell>
      <section className="bg-[#0f172a] text-white py-14 sm:py-20 text-center">
        <div className="container max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/30 text-red-300 text-xs font-black uppercase rounded-full mb-3 tracking-wider">
            Help &amp; Support
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Find quick answers to common questions about ordering, delivery, and products.
          </p>
        </div>
      </section>

      <div className="container py-12 sm:py-16 max-w-3xl">
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-gray-900 text-sm sm:text-base hover:text-[#e50914] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition-transform text-gray-400 ${isOpen ? 'rotate-180 text-[#e50914]' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 p-8 bg-gray-50 border border-gray-200 rounded-2xl text-center">
          <h3 className="text-base font-bold text-gray-900 mb-1">Still have questions?</h3>
          <p className="text-xs text-gray-500 mb-6">Our customer support team is available 7 days a week on WhatsApp.</p>
          <a
            href="https://wa.me/94770000000"
            target="_blank"
            rel="noreferrer"
            className="btn-primary text-xs uppercase tracking-wider inline-flex items-center gap-2"
          >
            <MessageCircle size={16} /> Chat on WhatsApp
          </a>
        </div>
      </div>
    </StoreShell>
  );
}
