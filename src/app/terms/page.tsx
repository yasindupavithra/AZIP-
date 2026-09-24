import StoreShell from '@/components/StoreShell';

export default function TermsPage() {
  return (
    <StoreShell>
      <section className="bg-[#0f172a] text-white py-12 text-center">
        <div className="container max-w-2xl mx-auto">
          <h1 className="text-3xl font-black font-['Outfit'] mb-2">Terms &amp; Conditions</h1>
          <p className="text-xs text-gray-400">Last updated: January 2025</p>
        </div>
      </section>

      <div className="container py-12 max-w-3xl prose text-sm text-gray-700 leading-relaxed space-y-6">
        <p>
          Welcome to <strong>AZIP Store</strong>. By accessing our website, purchasing products, or contacting us for orders, you agree to comply with and be bound by the following terms and conditions.
        </p>

        <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">1. Products &amp; Pricing</h2>
        <p>
          All prices are listed in Sri Lankan Rupees (LKR) and are subject to change without prior notice. We strive for accurate descriptions and images, though physical item packaging may vary slightly based on manufacturer updates.
        </p>

        <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">2. Orders &amp; Delivery</h2>
        <p>
          Cash on Delivery (COD) and Bank Transfer orders are processed upon confirmation. Courier deliveries take 24-72 hours across Sri Lanka. Customers are responsible for providing accurate recipient and delivery addresses.
        </p>

        <h2 className="text-lg font-bold text-gray-900 font-['Outfit']">3. Replacement &amp; Returns</h2>
        <p>
          If you receive a defective or incorrect item, notify us within 7 days for a hassle-free replacement or exchange. Calculator electronic items carry their respective manufacturer warranty cards.
        </p>
      </div>
    </StoreShell>
  );
}
