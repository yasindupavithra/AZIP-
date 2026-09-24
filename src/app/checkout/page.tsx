'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, MessageCircle, CreditCard, Banknote } from 'lucide-react';
import StoreShell from '@/components/StoreShell';
import { useCartStore } from '@/store/cart';
import { formatWhatsAppMessage, generateWhatsAppUrl } from '@/lib/whatsapp';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = subtotal > 5000 || subtotal === 0 ? 0 : 350;
  const total = subtotal + deliveryFee;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: 'Kandy',
    district: 'Kandy',
    postalCode: '',
    notes: '',
    paymentMethod: 'cod' as 'cod' | 'bank_transfer' | 'whatsapp',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderNumber, setOrderNumber] = useState('');

  if (items.length === 0 && !orderNumber) {
    return (
      <StoreShell>
        <div className="container py-24 text-center max-w-md mx-auto">
          <h2 className="text-2xl font-black text-gray-900 font-['Outfit'] mb-2">Your cart is empty</h2>
          <p className="text-xs text-gray-500 mb-6">Please add items to your cart before proceeding to checkout.</p>
          <Link href="/products" className="btn-primary text-xs uppercase tracking-wider">
            Browse Catalog
          </Link>
        </div>
      </StoreShell>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const generatedOrderNum = 'AZ-' + Math.floor(100000 + Math.random() * 900000);

      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: {
              name: form.name,
              phone: form.phone,
              email: form.email,
              address: {
                street: form.street,
                city: form.city,
                district: form.district,
                postalCode: form.postalCode,
              },
            },
            items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })),
            paymentMethod: form.paymentMethod,
            notes: form.notes,
            subtotal,
            deliveryFee,
            total,
          }),
        });
      } catch (err) {
        console.warn('API Order saving warning:', err);
      }

      setOrderNumber(generatedOrderNum);
      clearCart();

      if (form.paymentMethod === 'whatsapp') {
        const message = formatWhatsAppMessage(
          items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
          { name: form.name, phone: form.phone, address: `${form.street}, ${form.city}`, city: form.city },
          generatedOrderNum,
          total
        );
        window.open(generateWhatsAppUrl(message), '_blank');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (orderNumber) {
    return (
      <StoreShell>
        <div className="container py-16 md:py-24 text-center max-w-xl mx-auto">
          <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-12 shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={44} />
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Order Confirmed
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Outfit'] mb-3">
              Thank You for Your Order!
            </h1>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 my-6">
              <span className="text-xs text-gray-500 block mb-1">Your Order Reference</span>
              <span className="text-2xl font-black text-[#e50914] font-['Outfit'] tracking-wider">
                {orderNumber}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              We have received your order. Our team in Kandy is preparing your package and will contact you via phone/WhatsApp to confirm dispatch.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/products" className="btn-primary text-xs uppercase tracking-wider w-full sm:w-auto">
                Continue Shopping
              </Link>
              <a
                href={`https://wa.me/94770000000?text=Hello%2C%20I%20just%20placed%20order%20${orderNumber}%20on%20AZIP%20Store.`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-full shadow transition-all w-full sm:w-auto"
              >
                <MessageCircle size={16} /> Track on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </StoreShell>
    );
  }

  return (
    <StoreShell>
      <div className="container py-8 md:py-12 max-w-5xl">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#e50914] mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shopping Cart
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-['Outfit'] mb-8">
          Checkout &amp; Delivery
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 font-['Outfit'] mb-4 flex items-center gap-2">
                <Truck size={20} className="text-[#e50914]" />
                1. Delivery Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Kasun Perera"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@email.com (optional)"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    placeholder="House No, Street, Landmark"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="Kandy"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">District *</label>
                    <select
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500 bg-white"
                    >
                      <option value="Kandy">Kandy</option>
                      <option value="Colombo">Colombo</option>
                      <option value="Gampaha">Gampaha</option>
                      <option value="Kalutara">Kalutara</option>
                      <option value="Matale">Matale</option>
                      <option value="Nuwara Eliya">Nuwara Eliya</option>
                      <option value="Galle">Galle</option>
                      <option value="Matara">Matara</option>
                      <option value="Kurunegala">Kurunegala</option>
                      <option value="Kegalle">Kegalle</option>
                      <option value="Ratnapura">Ratnapura</option>
                      <option value="Badulla">Badulla</option>
                      <option value="Anuradhapura">Anuradhapura</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Other">Other District</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Postal Code</label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      placeholder="20000"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Order Notes</label>
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Special delivery instructions, gift wrapping requests, etc."
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 font-['Outfit'] mb-4 flex items-center gap-2">
                <Banknote size={20} className="text-[#e50914]" />
                2. Select Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  onClick={() => setForm({ ...form, paymentMethod: 'cod' })}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    form.paymentMethod === 'cod' ? 'border-[#e50914] bg-red-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={form.paymentMethod === 'cod'}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">Cash on Delivery (COD)</div>
                    <div className="text-xs text-gray-500 mt-0.5">Pay in cash directly to the courier when package arrives.</div>
                  </div>
                </label>

                <label
                  onClick={() => setForm({ ...form, paymentMethod: 'whatsapp' })}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    form.paymentMethod === 'whatsapp' ? 'border-emerald-600 bg-emerald-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={form.paymentMethod === 'whatsapp'}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <span>Order &amp; Confirm on WhatsApp</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">Fastest</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Instant confirmation with our support agents.</div>
                  </div>
                </label>

                <label
                  onClick={() => setForm({ ...form, paymentMethod: 'bank_transfer' })}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    form.paymentMethod === 'bank_transfer' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={form.paymentMethod === 'bank_transfer'}
                    onChange={() => {}}
                    className="mt-1"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">Direct Bank Transfer</div>
                    <div className="text-xs text-gray-500 mt-0.5">Commercial Bank or Sampath Bank online transfer with slip upload.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-28">
              <h2 className="text-lg font-black text-gray-900 font-['Outfit'] pb-4 border-b border-gray-100 mb-4">
                Order Summary ({items.length} items)
              </h2>

              {/* Items preview */}
              <div className="max-h-48 overflow-y-auto space-y-3 pr-2 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs items-center gap-2">
                    <span className="text-gray-700 line-clamp-1 flex-1">
                      {item.name} <span className="text-gray-400 font-semibold">x{item.quantity}</span>
                    </span>
                    <span className="font-bold text-gray-900 shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-xs sm:text-sm pt-4 border-t border-gray-100 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Islandwide Delivery</span>
                  <span className="font-bold text-emerald-600">
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-[#e50914] font-['Outfit']">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl mb-4 font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-sm uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Processing Order...' : 'Place Order Now'}
              </button>

              <div className="pt-4 mt-4 border-t border-gray-100 text-center text-[11px] text-gray-400">
                By placing this order, you agree to AZIP Store's terms and delivery policies.
              </div>
            </div>
          </div>
        </form>
      </div>
    </StoreShell>
  );
}
