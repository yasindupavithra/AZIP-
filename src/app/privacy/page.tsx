import StoreShell from '@/components/StoreShell';

export default function PrivacyPage() {
  return (
    <StoreShell>
      <section className="bg-[#0f172a] text-white py-12 text-center">
        <div className="container max-w-2xl mx-auto">
          <h1 className="text-3xl font-black font-['Outfit'] mb-2">Privacy Policy</h1>
          <p className="text-xs text-gray-400">Last updated: January 2025</p>
        </div>
      </section>

      <div className="container py-12 max-w-3xl prose text-sm text-gray-700 leading-relaxed space-y-6">
        <p>
          At <strong>AZIP Store</strong>, we respect your privacy and are committed to protecting any personal data you share with us when ordering stationery, books, and electronic supplies.
        </p>

        <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">1. Information We Collect</h2>
        <p>
          When you place an order, contact us on WhatsApp, or browse our store, we collect necessary information to fulfill deliveries, including your full name, delivery address, phone number, and optional email address.
        </p>

        <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">2. How We Use Your Data</h2>
        <p>
          Your information is used solely to process orders, communicate tracking updates, handle customer inquiries, and deliver packages via courier partners. We do not sell or rent customer information to third parties.
        </p>

        <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">3. Data Security</h2>
        <p>
          We implement standard encryption and access controls to keep your personal data secure. If you have questions about your stored data, feel free to contact us at support@azipstore.lk.
        </p>
      </div>
    </StoreShell>
  );
}
