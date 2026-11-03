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
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  LayoutGrid,
  List,
  Upload,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
} from 'lucide-react';
import { STORE_CATEGORIES, CatalogProduct, getCategoryLabel } from '@/lib/catalog';
import AzipLogo, {
  LOGO_PRESETS,
  LOGO_PRESET_STORAGE_KEY,
  type LogoStylePreset,
} from '@/components/brand/AzipLogo';

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
  discountText?: string;
  ctaText?: string;
  bgTheme?: string;
  displayMode?: 'daraz-stage' | 'full-image';
  image: string;
  secondaryImages?: string[];
  linkUrl: string;
  isActive: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
}

const PRESET_IMAGES = [
  { label: 'Exercise Book', url: '/images/hd/products/atlas-exercise-book.jpg' },
  { label: 'Gel Pens', url: '/images/hd/products/pilot-g2-pens.jpg' },
  { label: 'Calculator', url: '/images/hd/products/casio-fx991cw.jpg' },
  { label: 'Water Colors', url: '/images/hd/products/faber-castell-water-color.jpg' },
  { label: 'Backpack', url: '/images/hd/products/school-backpack-blue.jpg' },
  { label: 'Geometry Set', url: '/images/hd/products/geometry-set.jpg' },
  { label: 'Highlighters', url: '/images/hd/products/highlighters-set.jpg' },
  { label: 'Water Bottle', url: '/images/hd/products/water-bottle.jpg' },
  { label: 'Lunch Box', url: '/images/hd/products/lunch-box.jpg' },
];

const PRESET_BANNER_IMAGES = [
  { label: 'School Backpack', url: '/images/hd/products/school-backpack-blue.jpg', mode: 'daraz-stage' as const },
  { label: 'Casio Calculator', url: '/images/hd/products/casio-fx991cw.jpg', mode: 'daraz-stage' as const },
  { label: 'Atlas Exercise Book', url: '/images/hd/products/atlas-exercise-book.jpg', mode: 'daraz-stage' as const },
  { label: 'Faber-Castell Colors', url: '/images/hd/products/faber-castell-water-color.jpg', mode: 'daraz-stage' as const },
  { label: 'Daraz Orange Banner (Full)', url: '/banners/daraz-hot-orange.jpg', mode: 'full-image' as const },
  { label: 'Daraz Blue Banner (Full)', url: '/banners/daraz-tech-blue.jpg', mode: 'full-image' as const },
  { label: 'Daraz Red Banner (Full)', url: '/banners/daraz-fashion-red.jpg', mode: 'full-image' as const },
  { label: 'Daraz Teal Banner (Full)', url: '/banners/daraz-home-teal.jpg', mode: 'full-image' as const },
];

const ITEMS_PER_PAGE = 12;

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'banners'>('products');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [banners, setBanners] = useState<HeroBannerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Search, Filters, View Mode & Pagination for Products
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productViewMode, setProductViewMode] = useState<'table' | 'grid'>('table');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal State for Create / Edit Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingProductImg, setUploadingProductImg] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedLogoPreset, setSelectedLogoPreset] = useState<LogoStylePreset>('modern-mall');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOGO_PRESET_STORAGE_KEY) as LogoStylePreset | null;
      if (saved) setSelectedLogoPreset(saved);
    } catch {
      // ignore
    }
  }, []);

  const handleSelectLogoPreset = (preset: LogoStylePreset) => {
    setSelectedLogoPreset(preset);
    try {
      localStorage.setItem(LOGO_PRESET_STORAGE_KEY, preset);
      window.dispatchEvent(new Event('azip-logo-change'));
      showToast('✨ Store Brand Logo updated across all pages!');
    } catch {
      // ignore
    }
  };

  // Modal State for Create / Edit Banner
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBannerItem | null>(null);
  const [submittingBanner, setSubmittingBanner] = useState(false);
  const [uploadingBannerImg, setUploadingBannerImg] = useState(false);

  // Form State Product
  const [formData, setFormData] = useState({
    name: '',
    category: 'exercise-books',
    subcategory: '',
    price: '',
    compareAtPrice: '',
    stock: '50',
    description: '',
    imageUrl: PRESET_IMAGES[0].url,
    sku: '',
    tags: '',
    badge: '',
    isFeatured: false,
  });

  // Form State Banner
  const [bannerFormData, setBannerFormData] = useState({
    title: '',
    subtitle: '',
    badge: '11.11 SHOPPING FEST',
    discountText: '65%',
    ctaText: 'Add to Cart',
    bgTheme: 'orange',
    displayMode: 'daraz-stage' as 'daraz-stage' | 'full-image',
    image: '/images/hd/products/school-backpack-blue.jpg',
    linkUrl: '/offers',
    isActive: true,
    order: '1',
    startDate: '',
    endDate: '',
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

      const [productsRes, ordersRes, bannersRes] = await Promise.all([
        fetch('/api/products?limit=250'),
        fetch('/api/orders'),
        fetch('/api/banners?all=true'),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }
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

  // Reset pagination when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, productSearch]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Product Actions
  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: selectedCategory !== 'all' ? selectedCategory : 'exercise-books',
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

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProductImg(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'azip-store/products');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        showToast('📷 Product photo uploaded!');
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch {
      alert('Error uploading image');
    } finally {
      setUploadingProductImg(false);
    }
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
        showToast(editingProduct ? '✅ Product updated!' : '🎉 New product published!');
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
    if (!confirm(`Delete "${name}" from store catalog?`)) return;

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
      title: 'HOT DEALS',
      subtitle: 'Too Hot to Last. Best Prices.',
      badge: '11.11 SHOPPING FEST',
      discountText: '65%',
      ctaText: 'Add to Cart',
      bgTheme: 'orange',
      displayMode: 'daraz-stage',
      image: PRESET_BANNER_IMAGES[0].url,
      linkUrl: '/offers',
      isActive: true,
      order: String(banners.length + 1),
      startDate: '',
      endDate: '',
    });
    setIsBannerModalOpen(true);
  };

  const openEditBannerModal = (b: HeroBannerItem) => {
    setEditingBanner(b);
    setBannerFormData({
      title: b.title,
      subtitle: b.subtitle,
      badge: b.badge || '11.11 SHOPPING FEST',
      discountText: b.discountText || '65%',
      ctaText: b.ctaText || 'Add to Cart',
      bgTheme: b.bgTheme || 'orange',
      displayMode: b.displayMode || 'daraz-stage',
      image: b.image,
      linkUrl: b.linkUrl || '/products',
      isActive: Boolean(b.isActive),
      order: String(b.order || 1),
      startDate: b.startDate || '',
      endDate: b.endDate || '',
    });
    setIsBannerModalOpen(true);
  };

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBannerImg(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'azip-store/banners');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) {
        setBannerFormData((prev) => ({ ...prev, image: data.url }));
        showToast('🖼️ Banner image uploaded!');
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch {
      alert('Error uploading image');
    } finally {
      setUploadingBannerImg(false);
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBanner(true);

    const payload = {
      title: bannerFormData.title,
      subtitle: bannerFormData.subtitle,
      badge: bannerFormData.badge,
      discountText: bannerFormData.discountText || '65%',
      ctaText: bannerFormData.ctaText || 'Add to Cart',
      bgTheme: bannerFormData.bgTheme || 'orange',
      displayMode: bannerFormData.displayMode || 'daraz-stage',
      image: bannerFormData.image,
      linkUrl: bannerFormData.linkUrl,
      isActive: bannerFormData.isActive,
      order: Number(bannerFormData.order) || 1,
      startDate: bannerFormData.startDate || '',
      endDate: bannerFormData.endDate || '',
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
        showToast(editingBanner ? '✨ Offer Banner updated!' : '🎉 New Offer Banner published!');
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
        showToast(
          newStatus
            ? `👁️ Banner "${banner.title}" is now ACTIVE!`
            : `🙈 Banner "${banner.title}" HIDDEN from Homepage.`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBanner = async (id: string, title: string) => {
    if (!confirm(`Delete banner slide "${title}"?`)) return;

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
    const q = productSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));
    return matchesCat && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Category counts for quick pills
  const categoryCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeBannersCount = banners.filter((b) => b.isActive).length;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  const modalDiscountPreview =
    Number(formData.compareAtPrice) > Number(formData.price) && Number(formData.price) > 0
      ? Math.round(
          ((Number(formData.compareAtPrice) - Number(formData.price)) /
            Number(formData.compareAtPrice)) *
            100
        )
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#0096C7] border-t-transparent rounded-none animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Loading Control Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-slate-800 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-none shadow-2xl text-xs font-bold flex items-center gap-2.5 border border-slate-700">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── TOP HEADER BAR ───────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Link href="/" className="shrink-0">
              <AzipLogo className="h-10 w-auto" />
            </Link>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <span className="px-3 py-1 rounded-none text-xs font-bold bg-slate-900 text-white tracking-wide">
              Admin Control Center
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={loadData}
              className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-none transition-colors cursor-pointer border-none"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-none transition-colors"
            >
              <span>View Live Store</span>
              <ExternalLink size={13} />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-none transition-colors border border-rose-200 cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN WORKSPACE ───────────────────────────────────────── */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Title Row + Primary Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-none border border-slate-200/90 shadow-xs">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] tracking-tight">
              Store Management Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Organize your product catalog, manage Daraz-style homepage banners, and track customer orders.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={openCreateBannerModal}
              className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-none font-bold text-xs shadow-sm transition-all border-none cursor-pointer"
            >
              <Sparkles size={15} /> + New Offer Banner
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-[#0096C7] hover:bg-[#007BA8] text-white px-5 py-2.5 rounded-none font-bold text-xs shadow-sm transition-all border-none cursor-pointer"
            >
              <Plus size={16} /> + Add New Product
            </button>
          </div>
        </div>

        {/* 1-Click Store Brand Logo Switcher */}
        <div className="bg-white p-5 rounded-none border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Store Brand Logo Style (1-Click Live Switch)
              </h2>
              <p className="text-xs text-slate-500">
                Click any logo design below to instantly apply it to the Header, Footer &amp; Admin Panel
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {LOGO_PRESETS.map((item) => {
              const active = selectedLogoPreset === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectLogoPreset(item.id)}
                  className={`p-3.5 rounded-none border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                    active
                      ? 'border-[#0096C7] bg-sky-50/50 ring-2 ring-[#0096C7]/30 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="h-12 flex items-center">
                    <AzipLogo preset={item.id} className="h-10" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-slate-800">{item.label}</span>
                    {active && (
                      <span className="text-[10px] font-black uppercase bg-[#0096C7] text-white px-2 py-0.5 rounded-none">
                        Active
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            onClick={() => setActiveTab('products')}
            className="bg-white p-5 rounded-none border border-slate-200/90 shadow-xs hover:border-[#0096C7] transition-all cursor-pointer flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Catalog Inventory
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-['Outfit']">
                {products.length}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mt-1.5">
                {lowStockCount > 0 ? `${lowStockCount} items low stock` : 'All items well stocked'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-none bg-sky-50 text-[#0096C7] flex items-center justify-center shrink-0">
              <Package size={24} />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('orders')}
            className="bg-white p-5 rounded-none border border-slate-200/90 shadow-xs hover:border-blue-500 transition-all cursor-pointer flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Customer Orders
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-['Outfit']">
                {orders.length}
              </h3>
              <p className="text-xs text-blue-600 font-semibold mt-1.5">
                Online &amp; WhatsApp COD
              </p>
            </div>
            <div className="w-12 h-12 rounded-none bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={24} />
            </div>
          </div>

          <div
            onClick={() => setActiveTab('banners')}
            className="bg-white p-5 rounded-none border border-slate-200/90 shadow-xs hover:border-rose-500 transition-all cursor-pointer flex items-start justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Homepage Banners
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-['Outfit']">
                {activeBannersCount} <span className="text-base font-bold text-slate-400">/ {banners.length}</span>
              </h3>
              <p className="text-xs text-rose-600 font-semibold mt-1.5">
                Daraz Starburst Slider Active
              </p>
            </div>
            <div className="w-12 h-12 rounded-none bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <ImageIcon size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-none border border-slate-200/90 shadow-xs flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="text-3xl font-black text-slate-900 mt-1 font-['Outfit']">
                Rs. {totalSales.toLocaleString()}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1.5">
                Islandwide Deliveries
              </p>
            </div>
            <div className="w-12 h-12 rounded-none bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <BarChart3 size={24} />
            </div>
          </div>
        </div>

        {/* Navigation Pill Tabs */}
        <div className="bg-white p-2 rounded-none border border-slate-200/90 shadow-xs inline-flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package size={16} />
            <span>Products Catalog ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === 'banners'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles size={16} />
            <span>Hero Banners &amp; Daily Offers ({banners.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-none text-xs font-bold transition-all border-none cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag size={16} />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════
            TAB 1: ORGANIZED PRODUCT MANAGEMENT
           ════════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-5">
            {/* Search + Category Filter + View Mode Toolbar */}
            <div className="bg-white p-5 rounded-none border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search products by name, SKU code, or tag..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 text-sm border border-slate-200 rounded-none focus:outline-none focus:border-[#0096C7] bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                {/* Category Select + View Switcher */}
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="flex items-center gap-2 flex-1 lg:flex-initial">
                    <Filter size={16} className="text-slate-400 shrink-0" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full lg:w-56 px-3.5 py-2.5 text-xs border border-slate-200 rounded-none focus:outline-none focus:border-[#0096C7] bg-slate-50 font-bold text-slate-700 cursor-pointer"
                    >
                      <option value="all">All Categories ({products.length})</option>
                      {STORE_CATEGORIES.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.label} ({categoryCounts[c.slug] || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Table / Grid View Toggle */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-none border border-slate-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setProductViewMode('table')}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none transition-all ${
                        productViewMode === 'table'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'bg-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <List size={14} /> List
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductViewMode('grid')}
                      className={`px-3 py-1.5 rounded-none text-xs font-bold flex items-center gap-1.5 cursor-pointer border-none transition-all ${
                        productViewMode === 'grid'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'bg-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LayoutGrid size={14} /> Grid
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Category Pills Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-none text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === 'all'
                      ? 'bg-[#0096C7] text-white border-[#0096C7]'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  All Items ({products.length})
                </button>
                {STORE_CATEGORIES.filter((c) => (categoryCounts[c.slug] || 0) > 0).map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3.5 py-1.5 rounded-none text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                      selectedCategory === cat.slug
                        ? 'bg-[#0096C7] text-white border-[#0096C7]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {cat.label} ({categoryCounts[cat.slug] || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCTS VIEW: TABLE OR GRID */}
            {productViewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {paginatedProducts.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded-none border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between p-4"
                  >
                    <div>
                      <div className="relative h-40 w-full bg-slate-50 rounded-none border border-slate-100 p-3 flex items-center justify-center mb-3">
                        {p.badge && (
                          <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-none">
                            {p.badge}
                          </span>
                        )}
                        <span
                          className={`absolute top-2 right-2 px-2 py-0.5 rounded-none text-[10px] font-bold ${
                            p.stock > 10
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {p.stock} in stock
                        </span>
                        <img
                          src={p.images?.[0]?.url || PRESET_IMAGES[0].url}
                          alt={p.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#0096C7]">
                        {getCategoryLabel(p.category)}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5 min-h-[40px]">
                        {p.name}
                      </h4>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        SKU: {p.sku || 'N/A'}
                      </div>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-base font-black text-slate-900">
                          Rs. {p.price.toLocaleString()}
                        </div>
                        {p.compareAtPrice && p.compareAtPrice > p.price && (
                          <div className="text-[11px] text-slate-400 line-through">
                            Rs. {p.compareAtPrice.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(p)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-none text-xs font-bold flex items-center gap-1 border border-blue-200 cursor-pointer"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p._id, p.name)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-none border border-rose-200 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-none border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th className="py-4 px-5">Product</th>
                        <th className="py-4 px-4">Category</th>
                        <th className="py-4 px-4">Selling Price</th>
                        <th className="py-4 px-4">Stock Level</th>
                        <th className="py-4 px-4">Badge</th>
                        <th className="py-4 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {paginatedProducts.length > 0 ? (
                        paginatedProducts.map((p) => (
                          <tr key={p._id} className="hover:bg-slate-50/90 transition-colors">
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-none bg-slate-50 border border-slate-200 p-1.5 flex items-center justify-center shrink-0">
                                  <img
                                    src={p.images?.[0]?.url || PRESET_IMAGES[0].url}
                                    alt={p.name}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1">
                                    {p.name}
                                  </h4>
                                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                                    SKU: {p.sku || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <span className="inline-block px-3 py-1 rounded-none bg-slate-100 text-slate-700 text-xs font-semibold">
                                {getCategoryLabel(p.category)}
                              </span>
                            </td>

                            <td className="py-4 px-4">
                              <div className="font-bold text-slate-900 text-sm">
                                Rs. {p.price.toLocaleString()}
                              </div>
                              {p.compareAtPrice && p.compareAtPrice > p.price && (
                                <div className="text-xs text-slate-400 line-through">
                                  Rs. {p.compareAtPrice.toLocaleString()}
                                </div>
                              )}
                            </td>

                            <td className="py-4 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-none text-xs font-bold ${
                                  p.stock > 10
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {p.stock <= 10 && <AlertTriangle size={12} />}
                                {p.stock} in stock
                              </span>
                            </td>

                            <td className="py-4 px-4">
                              {p.badge ? (
                                <span className="px-2.5 py-1 rounded-none text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                                  {p.badge}
                                </span>
                              ) : (
                                <span className="text-slate-300 text-xs">—</span>
                              )}
                            </td>

                            <td className="py-4 px-5 text-right">
                              <div className="inline-flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(p)}
                                  className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-none transition-colors border border-blue-200 cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Edit2 size={13} /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProduct(p._id, p.name)}
                                  className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-none transition-colors border border-rose-200 cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Trash2 size={13} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-medium">
                            No matching products found. Try changing filters or add a new product.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                {filteredProducts.length > ITEMS_PER_PAGE && (
                  <div className="px-5 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-slate-500">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} –{' '}
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{' '}
                      {filteredProducts.length} products
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1.5 rounded-none border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <ChevronLeft size={14} /> Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-8 h-8 rounded-none text-xs font-bold cursor-pointer border ${
                            currentPage === page
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="px-3 py-1.5 rounded-none border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 2: ORDER MANAGEMENT
           ════════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-none border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">Customer Order Queue</h3>
              <span className="text-xs text-slate-500 font-bold">{orders.length} total orders</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="py-4 px-5">Order ID &amp; Date</th>
                    <th className="py-4 px-4">Customer Info</th>
                    <th className="py-4 px-4">Items Purchased</th>
                    <th className="py-4 px-4">Total Amount</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-5 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {orders.length > 0 ? (
                    orders.map((o) => (
                      <tr key={o._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-5 font-mono">
                          <div className="font-bold text-slate-900 text-sm">{o.orderNumber || o._id}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {new Date(o.createdAt).toLocaleDateString()}{' '}
                            {new Date(o.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 text-sm">
                            {o.customer?.name || 'Guest Customer'}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">{o.customer?.phone}</div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {o.items?.map((it, idx) => (
                              <div key={idx} className="text-xs text-slate-700">
                                <span className="font-bold">{it.quantity}x</span> {it.name}
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 text-sm">
                            Rs. {o.total?.toLocaleString()}
                          </div>
                          <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                            {o.paymentMethod || 'COD'}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-none text-xs font-bold capitalize ${
                              o.status === 'completed' || o.status === 'delivered'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : o.status === 'cancelled'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {o.status}
                          </span>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <select
                            value={o.status}
                            disabled={updatingOrderId === o._id}
                            onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                            className="px-3 py-1.5 text-xs border border-slate-300 rounded-none bg-white font-bold text-slate-700 focus:outline-none focus:border-blue-600 cursor-pointer"
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
                      <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-medium">
                        No customer orders placed yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════
            TAB 3: HERO OFFER BANNERS MANAGEMENT
           ════════════════════════════════════════════════════════════ */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Header Banner Control Bar */}
            <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-6 sm:p-8 rounded-none text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/25 text-rose-200 rounded-none text-xs font-bold uppercase tracking-wider mb-2 border border-rose-400/30">
                  <Sparkles size={13} className="text-amber-300" /> Live Daraz Campaign Slider
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-['Outfit']">
                  Homepage Daily Offer Banners
                </h2>
                <p className="text-xs sm:text-sm text-rose-100/80 mt-1 max-w-xl">
                  Add, edit, schedule by date, or hide promotional slides on the homepage carousel.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateBannerModal}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-black rounded-none shadow-md transition-all uppercase tracking-wider shrink-0 cursor-pointer border-none"
              >
                + Add New Offer Banner
              </button>
            </div>

            {/* Banners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((b, idx) => {
                const now = Date.now();
                const isScheduledFuture =
                  b.isActive && b.startDate && new Date(b.startDate).getTime() > now;
                const isExpired =
                  b.isActive &&
                  b.endDate &&
                  new Date(b.endDate.length === 10 ? `${b.endDate}T23:59:59` : b.endDate).getTime() <
                    now;

                return (
                  <div
                    key={b._id}
                    className={`bg-white rounded-none border ${
                      b.isActive && !isExpired
                        ? 'border-slate-200 shadow-xs'
                        : 'border-slate-200 opacity-65 bg-slate-50'
                    } overflow-hidden transition-all flex flex-col justify-between`}
                  >
                    <div className="p-6 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between gap-5 min-h-[180px]">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-none">
                            Slide #{b.order || idx + 1}
                          </span>
                          <span className="bg-orange-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-none uppercase">
                            {b.badge || '11.11 SHOPPING FEST'}
                          </span>
                          <span className="bg-amber-100 text-amber-900 text-[11px] font-black px-2.5 py-0.5 rounded-none">
                            UP TO {b.discountText || '65%'} OFF
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-slate-900 leading-snug line-clamp-1 font-['Outfit']">
                          {b.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">{b.subtitle}</p>

                        {(b.startDate || b.endDate) && (
                          <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-none px-3 py-1">
                            <span>📅</span>
                            <span>{b.startDate || 'Now'}</span>
                            <span>→</span>
                            <span>{b.endDate || 'Ongoing'}</span>
                          </div>
                        )}
                      </div>

                      <div className="w-28 h-28 bg-white rounded-none border border-slate-200 p-2.5 flex items-center justify-center shrink-0 shadow-2xs">
                        <img
                          src={b.image}
                          alt={b.title}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => handleToggleBannerActive(b)}
                          className={`px-3.5 py-1.5 rounded-none text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-none ${
                            !b.isActive
                              ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              : isExpired
                              ? 'bg-amber-100 text-amber-800'
                              : isScheduledFuture
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {b.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                          <span>
                            {!b.isActive
                              ? 'HIDDEN'
                              : isExpired
                              ? 'EXPIRED'
                              : isScheduledFuture
                              ? 'SCHEDULED'
                              : 'ACTIVE ON HOME'}
                          </span>
                        </button>

                        <span className="truncate font-mono text-xs text-slate-400 max-w-[160px]">
                          {b.linkUrl || '/offers'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditBannerModal(b)}
                          className="px-3.5 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-none transition-colors border border-blue-200 cursor-pointer"
                        >
                          Edit Slide
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(b._id, b.title)}
                          className="px-3.5 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-none transition-colors border border-rose-200 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ════════════════════════════════════════════════════════════
          MODAL 1: NEXT-LEVEL CREATE / EDIT PRODUCT (2-Column with Live Preview)
         ════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-none max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-5 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0096C7]">
                  Catalog Manager
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] mt-0.5">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product to Store'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT COLUMN (4 cols): Live Image Preview + Upload + Presets */}
                <div className="lg:col-span-4 bg-slate-50 p-4 rounded-none border border-slate-200 space-y-4">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Product Preview</span>
                    {modalDiscountPreview > 0 && (
                      <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-none">
                        -{modalDiscountPreview}% OFF
                      </span>
                    )}
                  </div>

                  {/* Preview Image Box */}
                  <div className="w-full aspect-square bg-white rounded-none border border-slate-200 p-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={formData.imageUrl || PRESET_IMAGES[0].url}
                      alt={formData.name || 'Preview'}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Upload from PC / Phone Button */}
                  <label className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-none flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs">
                    <Upload size={14} />
                    <span>{uploadingProductImg ? 'Uploading Photo...' : 'Upload Photo from PC / Phone'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                      disabled={uploadingProductImg}
                    />
                  </label>

                  {/* Image URL Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Or Paste Image URL *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="/images/hd/products/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0096C7] text-slate-800 font-mono"
                    />
                  </div>

                  {/* Quick HD Presets */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
                      Quick Studio Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: preset.url })}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-none border cursor-pointer transition-colors ${
                            formData.imageUrl === preset.url
                              ? 'bg-[#0096C7] text-white border-[#0096C7]'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (8 cols): Clean Structured Fields */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Product Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Atlas CR 80GSM 120 Pages Single Ruled Book"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-none focus:outline-none focus:border-[#0096C7] font-semibold text-slate-900"
                    />
                  </div>

                  {/* Category & Subcategory */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Store Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-none focus:outline-none focus:border-[#0096C7] font-semibold text-slate-800 bg-white"
                      >
                        {STORE_CATEGORIES.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Subcategory / Type
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CR Books, Scientific Calculators"
                        value={formData.subcategory}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-none focus:outline-none focus:border-[#0096C7] text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Price, Compare Price & Stock */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-none border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Selling Price (Rs.) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="450"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0096C7] font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Original Price (Rs.)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="600 (optional)"
                        value={formData.compareAtPrice}
                        onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0096C7] text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="50"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-none bg-white focus:outline-none focus:border-[#0096C7] font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Product Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write a clear, helpful description of this item..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-none focus:outline-none focus:border-[#0096C7] text-slate-900"
                    />
                  </div>

                  {/* SKU, Tags & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        SKU Code
                      </label>
                      <input
                        type="text"
                        placeholder="AZ-NB-001"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-[#0096C7] font-mono text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Search Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="a4, notebook, atlas"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-[#0096C7] text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Highlight Badge
                      </label>
                      <input
                        type="text"
                        placeholder="Best Seller, Exam Special"
                        value={formData.badge}
                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-[#0096C7] text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <label
                    htmlFor="isFeatured"
                    className="flex items-center gap-3 p-3.5 rounded-none bg-sky-50/70 border border-sky-200/80 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 accent-[#0096C7] rounded-none cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Feature this product on Homepage &amp; Special Offers Page
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-5 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-none cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-2.5 bg-[#0096C7] hover:bg-[#007BA8] text-white font-bold text-xs rounded-none shadow-md transition-all cursor-pointer border-none disabled:opacity-50"
                >
                  {submitting
                    ? 'Saving...'
                    : editingProduct
                    ? 'Save Product Changes'
                    : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          MODAL 2: CREATE / EDIT DARAZ HERO BANNER
         ════════════════════════════════════════════════════════════ */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-none max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                  Daraz Campaign Slider
                </span>
                <h3 className="text-xl font-black text-slate-900 font-['Outfit'] mt-0.5">
                  {editingBanner ? 'Edit Hero Offer Banner' : 'Add New Daily Offer Banner'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="w-9 h-9 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold border-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="space-y-5">
              {/* Banner Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Main Impact Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HOT DEALS or 11.11 TECH ZONE"
                    value={bannerFormData.title}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, title: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-none focus:outline-none focus:border-rose-600 font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Subtitle / Offer Line *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Too Hot to Last. Best Prices."
                    value={bannerFormData.subtitle}
                    onChange={(e) =>
                      setBannerFormData({ ...bannerFormData, subtitle: e.target.value })
                    }
                    className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-none focus:outline-none focus:border-rose-600 text-slate-900"
                  />
                </div>
              </div>

              {/* Badge, Circle Discount %, CTA Button Text */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Top-Left Ribbon Badge
                  </label>
                  <input
                    type="text"
                    placeholder="11.11 SHOPPING FEST"
                    value={bannerFormData.badge}
                    onChange={(e) => setBannerFormData({ ...bannerFormData, badge: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-rose-600 text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    3D Circle Discount (UP TO ... OFF)
                  </label>
                  <input
                    type="text"
                    placeholder="65%"
                    value={bannerFormData.discountText}
                    onChange={(e) =>
                      setBannerFormData({ ...bannerFormData, discountText: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-rose-600 text-slate-900 font-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Pill Button Text (CTA)
                  </label>
                  <input
                    type="text"
                    placeholder="Add to Cart / Shop Now"
                    value={bannerFormData.ctaText}
                    onChange={(e) =>
                      setBannerFormData({ ...bannerFormData, ctaText: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-rose-600 text-slate-900 font-semibold"
                  />
                </div>
              </div>

              {/* Display Mode, Stage Color, Target Link, Slide Order */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Display Mode
                  </label>
                  <select
                    value={bannerFormData.displayMode}
                    onChange={(e) =>
                      setBannerFormData({
                        ...bannerFormData,
                        displayMode: e.target.value as 'daraz-stage' | 'full-image',
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-rose-600 text-slate-900 font-semibold"
                  >
                    <option value="daraz-stage">Daraz Starburst Stage</option>
                    <option value="full-image">Full Banner Image</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Daraz Stage Color
                  </label>
                  <select
                    value={bannerFormData.bgTheme}
                    onChange={(e) =>
                      setBannerFormData({ ...bannerFormData, bgTheme: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-rose-600 text-slate-900 font-semibold"
                  >
                    <option value="orange">🔥 Fiery Orange</option>
                    <option value="blue">⚡ Tech Blue</option>
                    <option value="red">❤️ Fiesta Red</option>
                    <option value="teal">🌊 Saver Teal</option>
                    <option value="emerald">🌿 Herbal Green</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Link URL
                  </label>
                  <input
                    type="text"
                    placeholder="/offers"
                    value={bannerFormData.linkUrl}
                    onChange={(e) =>
                      setBannerFormData({ ...bannerFormData, linkUrl: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-rose-600 text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Slide Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bannerFormData.order}
                    onChange={(e) =>
                      setBannerFormData({ ...bannerFormData, order: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-rose-600 text-slate-900 font-bold"
                  />
                </div>
              </div>

              {/* Schedule Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-none border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date (Optional — Auto Show)
                  </label>
                  <input
                    type="date"
                    value={bannerFormData.startDate}
                    onChange={(e) =>
                      setBannerFormData({ ...bannerFormData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-rose-600 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Date (Optional — Auto Expire)
                  </label>
                  <input
                    type="date"
                    value={bannerFormData.endDate}
                    onChange={(e) =>
                      setBannerFormData({ ...bannerFormData, endDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-none bg-white focus:outline-none focus:border-rose-600 text-slate-900"
                  />
                </div>
              </div>

              {/* Image URL + Upload + Presets */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Banner Product / Campaign Image *
                  </label>
                  <label className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-none cursor-pointer transition-colors inline-flex items-center gap-1.5">
                    <Upload size={13} />
                    <span>{uploadingBannerImg ? 'Uploading...' : 'Upload from PC / Phone'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerImageUpload}
                      className="hidden"
                      disabled={uploadingBannerImg}
                    />
                  </label>
                </div>

                <input
                  type="text"
                  required
                  placeholder="/images/hd/products/school-backpack-blue.jpg"
                  value={bannerFormData.image}
                  onChange={(e) => setBannerFormData({ ...bannerFormData, image: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-none focus:outline-none focus:border-rose-600 text-slate-900 font-mono"
                />

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {PRESET_BANNER_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() =>
                        setBannerFormData({
                          ...bannerFormData,
                          image: preset.url,
                          displayMode: preset.mode || bannerFormData.displayMode,
                        })
                      }
                      className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold rounded-none border border-rose-200 cursor-pointer transition-colors"
                    >
                      🖼️ {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Checkbox */}
              <label
                htmlFor="isBannerActive"
                className="flex items-center gap-3 p-3.5 rounded-none bg-rose-50/70 border border-rose-200 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  id="isBannerActive"
                  checked={bannerFormData.isActive}
                  onChange={(e) =>
                    setBannerFormData({ ...bannerFormData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-rose-600 rounded-none cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Show this banner slide on the Homepage right now
                </span>
              </label>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-none cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBanner}
                  className="px-7 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-none shadow-md transition-all cursor-pointer border-none disabled:opacity-50"
                >
                  {submittingBanner
                    ? 'Publishing...'
                    : editingBanner
                    ? 'Update Banner'
                    : 'Publish Banner Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
