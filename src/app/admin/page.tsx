'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  LogOut,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Tag,
  Layers,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Link as LinkIcon
} from 'lucide-react';
import { STORE_CATEGORIES, CatalogProduct } from '@/lib/catalog';

interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string; email?: string; address?: any };
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  status: string;
  paymentMethod?: string;
  createdAt: string;
}

interface HeroBannerItem {
  _id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  linkUrl: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
}

const PRESET_IMAGES = [
  { label: 'Notebook', url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80' },
  { label: 'Books', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80' },
  { label: 'Pens', url: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=900&q=80' },
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?auto=format&fit=crop&w=900&q=80' },
  { label: 'Geometry', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80' },
  { label: 'Art Colors', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80' },
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80' },
  { label: 'Paper', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=900&q=80' },
  { label: 'Electronics', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=900&q=80' },
];

const PRESET_BANNER_IMAGES = [
  { label: 'Stationery Set', url: '/hero/slide1.jpg' },
  { label: 'Education Textbooks', url: '/hero/slide2.jpg' },
  { label: 'Faber Castell Colors', url: '/hero/slide3.jpg' },
  { label: 'Casio Calculators', url: '/hero/slide4.jpg' },
  { label: 'School Bags', url: '/hero/slide5.jpg' },
  { label: 'Unsplash Books', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'banners'>('products');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Search & Filters for Products
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State for Create / Edit Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State for Create / Edit Banner
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBannerItem | null>(null);
  const [submittingBanner, setSubmittingBanner] = useState(false);

  // Form State Product
  const [formData, setFormData] = useState({
    name: '',
    category: 'books',
    subcategory: '',
    price: '',
    compareAtPrice: '',
    stock: '50',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    sku: '',
    tags: '',
    badge: '',
    isFeatured: false,
  });

  // Form State Banner
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    subtitle: '',
    badge: 'Special Offer',
    image: '/hero/slide1.jpg',
    linkUrl: '/products',
    isActive: true,
    order: '1',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push('/admin/login');
        return;
      }

      // Load products
      const productsRes = await fetch('/api/products?limit=100');
      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }

      // Load orders
      const ordersRes = await fetch('/api/orders');
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }

      // Load banners
      const bannersRes = await fetch('/api/banners?all=true');
      if (bannersRes.ok) {
        const data = await bannersRes.json();
        setBanners(data.banners || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Product Actions
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'exercise-books',
      subcategory: 'CR Books',
      price: '',
      compareAtPrice: '',
      stock: '50',
      description: '',
      imageUrl: PRESET_IMAGES[0].url,
      sku: `AZ-${Math.floor(1000 + Math.random() * 9000)}`,
      tags: '',
      badge: 'New',
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: CatalogProduct) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory || '',
      price: String(p.price),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      stock: String(p.stock),
      description: p.description || '',
      imageUrl: p.images && p.images[0] ? p.images[0].url : PRESET_IMAGES[0].url,
      sku: p.sku || '',
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      badge: p.badge || '',
      isFeatured: Boolean(p.isFeatured),
    });
    setIsModalOpen(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name,
      category: formData.category,
      subcategory: formData.subcategory,
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      stock: Number(formData.stock),
      description: formData.description,
      images: [{ url: formData.imageUrl, alt: formData.name }],
      sku: formData.sku,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      badge: formData.badge,
      isFeatured: formData.isFeatured,
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingProduct ? '✅ Product updated successfully!' : '🎉 New product published to store!');
        setIsModalOpen(false);
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save product');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from store catalog?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showToast(`🗑️ Product "${name}" deleted.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Banner Actions
  const openCreateBannerModal = () => {
    setEditingBanner(null);
    setBannerFormData({
      title: '',
      subtitle: '',
      badge: 'Daily Offer 20% Off',
      image: PRESET_BANNER_IMAGES[0].url,
      linkUrl: '/products',
      isActive: true,
      order: String(banners.length + 1),
    });
    setIsBannerModalOpen(true);
  };

  const openEditBannerModal = (b: HeroBannerItem) => {
    setEditingBanner(b);
    setBannerFormData({
      title: b.title,
      subtitle: b.subtitle,
      badge: b.badge || '',
      image: b.image,
      linkUrl: b.linkUrl || '/products',
      isActive: Boolean(b.isActive),
      order: String(b.order || 1),
    });
    setIsBannerModalOpen(true);
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBanner(true);

    const payload = {
      title: bannerFormData.title,
      subtitle: bannerFormData.subtitle,
      badge: bannerFormData.badge,
      image: bannerFormData.image,
      linkUrl: bannerFormData.linkUrl,
      isActive: bannerFormData.isActive,
      order: Number(bannerFormData.order) || 1,
    };

    try {
      const url = editingBanner ? `/api/banners/${editingBanner._id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingBanner ? '✨ Offer Banner updated successfully!' : '🎉 New Offer Banner published to Homepage!');
        setIsBannerModalOpen(false);
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save banner');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving banner');
    } finally {
      setSubmittingBanner(false);
    }
  };

  const handleToggleBannerActive = async (banner: HeroBannerItem) => {
    try {
      const newStatus = !banner.isActive;
      const res = await fetch(`/api/banners/${banner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (res.ok) {
        setBanners((prev) =>
          prev.map((b) => (b._id === banner._id ? { ...b, isActive: newStatus } : b))
        );
        showToast(newStatus ? `👁️ Banner "${banner.title}" is now ACTIVE on Homepage!` : `🙈 Banner "${banner.title}" HIDDEN from Homepage.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBanner = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete banner slide "${title}"?`)) return;

    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
        showToast(`🗑️ Banner "${title}" deleted.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`📦 Order status updated to "${newStatus}"!`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = productSearch.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesCat && matchesSearch;
  });

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeBannersCount = banners.filter(b => b.isActive).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0">
              <img src="/azip-logo.png" alt="AZIP .store" className="h-9 w-auto object-contain" />
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-[#DC2626]">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer border-none"
              title="Refresh Data"
            >
              <RefreshCw size={15} />
            </button>
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              View Public Store →
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 cursor-pointer"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 py-8">

        {/* Dashboard Title & Stats Overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">AZIP Store Control Center</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage products, daily offer banners, order fulfillments &amp; homepage content in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'banners' ? (
              <button
                onClick={openCreateBannerModal}
                className="inline-flex items-center gap-2 bg-[#E11D48] hover:bg-[#be123c] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all border-none cursor-pointer"
              >
                <Plus size={16} /> Add New Offer Banner
              </button>
            ) : (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all border-none cursor-pointer"
              >
                <Plus size={16} /> Add New Product
              </button>
            )}
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center mb-3">
              <Package size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Catalog Inventory</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{products.length} Products</h3>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">Live Store Sync Active</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <ShoppingBag size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer Orders</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{orders.length} Orders</h3>
            <p className="text-[11px] text-blue-600 font-medium mt-1">Online &amp; Concierge</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#E11D48] flex items-center justify-center mb-3">
              <ImageIcon size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hero Offer Banners</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{banners.length} Slides ({activeBannersCount} Active)</h3>
            <p className="text-[11px] text-[#E11D48] font-medium mt-1">Daraz Style Slider</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <BarChart3 size={20} />
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Sales Volume</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">Rs. {totalSales.toLocaleString()}</h3>
            <p className="text-[11px] text-gray-400 mt-1">Island-wide deliveries</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all border-none bg-transparent cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#DC2626] text-[#DC2626] bg-red-50/50 rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Package size={16} /> Products ({products.length})
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all border-none bg-transparent cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#DC2626] text-[#DC2626] bg-red-50/50 rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShoppingBag size={16} /> Customer Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all border-none bg-transparent cursor-pointer ${
              activeTab === 'banners'
                ? 'border-[#E11D48] text-[#E11D48] bg-rose-50/50 rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sparkles size={16} className="text-[#E11D48]" /> Hero Banners &amp; Daily Offers ({banners.length})
          </button>
        </div>

        {/* ── TAB 1: PRODUCT MANAGEMENT ────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
              
              <div className="relative flex-1 w-full">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by title, tag, description..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#DC2626] bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Filter size={15} className="text-gray-400 shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full md:w-56 px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-[#DC2626] bg-gray-50 font-semibold text-gray-700 cursor-pointer"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {STORE_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="py-3.5 px-4">Product Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Badge</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 p-1 flex items-center justify-center shrink-0">
                                <img
                                  src={p.images?.[0]?.url || PRESET_IMAGES[0].url}
                                  alt={p.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-xs line-clamp-1">{p.name}</h4>
                                <div className="text-[11px] text-gray-400 font-mono mt-0.5">SKU: {p.sku || 'N/A'}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 capitalize font-semibold text-gray-600">
                            {p.category.replace('-', ' ')}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-gray-900">Rs {p.price.toLocaleString()}</div>
                            {p.compareAtPrice && (
                              <div className="text-[10px] text-gray-400 line-through">Rs {p.compareAtPrice.toLocaleString()}</div>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              p.stock > 10 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {p.stock} in stock
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            {p.badge ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-[#DC2626]">
                                {p.badge}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-[10px]">-</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditModal(p)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.name)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400 text-xs font-medium">
                          No matching products found. Try changing filters or add a new product.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ── TAB 2: ORDER MANAGEMENT ──────────────────────── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-600">Customer Order Queue</h3>
                <span className="text-xs text-gray-500 font-semibold">{orders.length} total orders</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="py-3.5 px-4">Order ID &amp; Date</th>
                      <th className="py-3.5 px-4">Customer Info</th>
                      <th className="py-3.5 px-4">Items Purchased</th>
                      <th className="py-3.5 px-4">Total Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {orders.length > 0 ? (
                      orders.map((o) => (
                        <tr key={o._id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono">
                            <div className="font-bold text-gray-900">{o.orderNumber || o._id}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5">
                              {new Date(o.createdAt).toLocaleDateString()} {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-gray-900">{o.customer?.name || 'Guest Customer'}</div>
                            <div className="text-[11px] text-gray-500">{o.customer?.phone}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              {o.items?.map((it, idx) => (
                                <div key={idx} className="text-[11px] text-gray-700">
                                  <span className="font-bold">{it.quantity}x</span> {it.name}
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-gray-900">Rs {o.total?.toLocaleString()}</div>
                            <div className="text-[10px] uppercase font-bold text-gray-400">{o.paymentMethod || 'COD'}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                              o.status === 'completed' || o.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : o.status === 'cancelled'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {o.status}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <select
                              value={o.status}
                              disabled={updatingOrderId === o._id}
                              onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                              className="px-2.5 py-1 text-xs border border-gray-300 rounded-lg bg-white font-bold text-gray-700 focus:outline-none focus:border-[#DC2626] cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400 text-xs font-medium">
                          No customer orders placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: HERO OFFER BANNERS MANAGEMENT ──────────── */}
        {activeTab === 'banners' && (
          <div className="space-y-6">

            {/* Header Banner Control Bar */}
            <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-rose-700/40">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/30 text-pink-200 rounded-full text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-rose-400/30">
                  <Sparkles size={12} className="text-amber-300 animate-pulse" /> Live Dynamic Hero Slider
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-['Outfit']">Homepage Daily Offer Banners</h2>
                <p className="text-xs text-rose-100/80 mt-1 max-w-xl">
                  Add, edit, enable or disable daily special offer slides for homepage carousel without touching any code!
                </p>
              </div>

              <button
                onClick={openCreateBannerModal}
                className="px-5 py-3 bg-[#E11D48] hover:bg-[#be123c] text-white text-xs font-black rounded-2xl shadow-lg transition-all hover:scale-105 border border-rose-300/30 uppercase tracking-wider shrink-0 cursor-pointer"
              >
                + Add New Offer Banner
              </button>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b, idx) => (
                <div
                  key={b._id}
                  className={`bg-white rounded-3xl border ${
                    b.isActive ? 'border-rose-200 shadow-md' : 'border-gray-200 opacity-60 bg-gray-50'
                  } overflow-hidden transition-all duration-300 flex flex-col justify-between`}
                >
                  {/* Banner Image Preview */}
                  <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

                    {/* Top Status & Badge overlay */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                      <span className="bg-[#E11D48] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {b.badge || 'Special Offer'}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={() => handleToggleBannerActive(b)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer border-none ${
                          b.isActive
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-900'
                        }`}
                        title={b.isActive ? 'Click to Hide from Homepage' : 'Click to Enable on Homepage'}
                      >
                        {b.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        <span>{b.isActive ? 'ACTIVE' : 'HIDDEN'}</span>
                      </button>
                    </div>

                    {/* Banner Title & Subtitle Preview Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 z-10 text-white">
                      <h3 className="text-base font-black leading-snug drop-shadow-sm font-['Outfit']">
                        {b.title}
                      </h3>
                      <p className="text-xs text-slate-200 font-medium line-clamp-1 drop-shadow-xs mt-0.5">
                        {b.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Banner Action Controls Bar */}
                  <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600">
                    <div className="flex items-center gap-2 truncate max-w-[60%]">
                      <LinkIcon size={14} className="text-rose-500 shrink-0" />
                      <span className="truncate font-mono text-[11px] text-gray-500">
                        {b.linkUrl || '/products'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEditBannerModal(b)}
                        className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 cursor-pointer"
                      >
                        Edit Slide
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b._id, b.title)}
                        className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* ── MODAL: CREATE / EDIT PRODUCT ─────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 my-8">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-black text-gray-900 font-['Outfit']">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Fill in product information to show on store front</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4">
              
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atlas CR 80GSM 120 Pages Notebook"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] font-semibold text-gray-900"
                />
              </div>

              {/* Category & Subcategory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Store Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] font-semibold text-gray-800 bg-white"
                  >
                    {STORE_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pens, Calculators, Notebooks"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] text-gray-900"
                  />
                </div>
              </div>

              {/* Price & Compare Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Selling Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="450"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Original / Compare Price
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="600"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="100"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] font-bold text-gray-900"
                  />
                </div>
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Product Image URL *</span>
                  <span className="text-[10px] text-gray-400 font-normal">Pick a preset or paste custom image link</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] text-gray-900 font-mono text-[11px]"
                />

                {/* Quick Preset Buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                      className="px-2.5 py-1 bg-gray-100 hover:bg-red-50 hover:text-[#DC2626] text-[10px] font-semibold text-gray-600 rounded-lg border border-gray-200 cursor-pointer transition-colors"
                    >
                      📷 {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter detailed description of the product..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] text-gray-900"
                />
              </div>

              {/* SKU, Tags & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    placeholder="AZ-NB-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] font-mono text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="a4, notebook, school"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Best Seller, Hot Deal"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] text-gray-900"
                  />
                </div>
              </div>

              {/* Is Featured Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#DC2626] rounded border-gray-300 focus:ring-[#DC2626] cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-xs font-bold text-gray-800 cursor-pointer select-none">
                  Show as Featured Product on Homepage &amp; Hot Offers
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border-none disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Publish Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ── MODAL: CREATE / EDIT HERO BANNER ─────────────── */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 my-8">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-black text-gray-900 font-['Outfit']">
                  {editingBanner ? 'Edit Hero Offer Banner' : 'Add New Daily Offer Banner'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Publish promotional slides for homepage Daraz-style carousel</p>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-4">
              
              {/* Banner Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Banner Main Heading (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Friday Mega Discount 25% Off"
                  value={bannerFormData.title}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#E11D48] font-black text-gray-900"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Banner Subtitle / Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free home delivery on all Atlas CR Books & Pilot Gel Pens in Kandy"
                  value={bannerFormData.subtitle}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#E11D48] text-gray-900"
                />
              </div>

              {/* Badge & Target Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Highlight Badge Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weekend Flash Sale, 15% OFF"
                    value={bannerFormData.badge}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, badge: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#E11D48] text-gray-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Target Button Link URL
                  </label>
                  <input
                    type="text"
                    placeholder="/products?category=exercise-books"
                    value={bannerFormData.linkUrl}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, linkUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#E11D48] text-gray-900 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Image URL & Presets */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Banner Image URL *</span>
                  <span className="text-[10px] text-gray-400 font-normal">Pick a banner background preset or paste custom link</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="/hero/slide1.jpg or https://..."
                  value={bannerFormData.image}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, image: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#E11D48] text-gray-900 font-mono text-[11px]"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PRESET_BANNER_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setBannerFormData({ ...bannerFormData, image: preset.url })}
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 hover:text-[#E11D48] text-[10px] font-semibold text-rose-800 rounded-lg border border-rose-200 cursor-pointer transition-colors"
                    >
                      🖼️ {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Is Active Checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBannerActive"
                  checked={bannerFormData.isActive}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#E11D48] rounded border-gray-300 focus:ring-[#E11D48] cursor-pointer"
                />
                <label htmlFor="isBannerActive" className="text-xs font-bold text-gray-800 cursor-pointer select-none">
                  Make Banner Slide ACTIVE on Homepage Carousel Right Now
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBanner}
                  className="px-6 py-2.5 bg-[#E11D48] hover:bg-[#be123c] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer border-none disabled:opacity-50 uppercase tracking-wider"
                >
                  {submittingBanner ? 'Publishing...' : editingBanner ? 'Update Banner' : 'Publish Banner Slide'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
