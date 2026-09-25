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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'analytics'>('products');
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
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

  // Form State
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

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      showToast('❌ Product name and price are required!');
      return;
    }

    setSubmitting(true);
    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      subcategory: formData.subcategory.trim(),
      price: Number(formData.price),
      compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
      stock: Number(formData.stock),
      description: formData.description.trim(),
      images: [{ url: formData.imageUrl.trim(), alt: formData.name }],
      sku: formData.sku.trim() || `AZ-${Math.floor(1000 + Math.random() * 9000)}`,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : [],
      badge: formData.badge.trim() || undefined,
      isFeatured: formData.isFeatured,
    };

    try {
      if (editingProduct) {
        // Edit existing product
        const res = await fetch(`/api/products/${editingProduct._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          setProducts((prev) =>
            prev.map((p) => (p._id === editingProduct._id ? { ...p, ...data.product } : p))
          );
          showToast('✅ Product updated successfully!');
          setIsModalOpen(false);
        } else {
          showToast('❌ Failed to update product');
        }
      } else {
        // Create new product
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.product) {
            setProducts((prev) => [data.product, ...prev]);
          }
          showToast('🎉 New product created & published to store!');
          setIsModalOpen(false);
        } else {
          showToast('❌ Failed to create product');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Server error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showToast('🗑️ Product deleted from store!');
      } else {
        showToast('❌ Failed to delete product');
      }
    } catch (err) {
      console.error(err);
      showToast('❌ Server error deleting product');
    }
  };

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
              className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
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
            <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Store Management Portal</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Add new products, edit catalog items, change order status &amp; manage inventory in real-time.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all border-none cursor-pointer"
          >
            <Plus size={16} /> Add New Product
          </button>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
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
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              {filteredProducts.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <Package size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm font-bold text-gray-800">No products found</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Click below to add your first product to this category!</p>
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 bg-[#DC2626] text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    <Plus size={14} /> Add Product Now
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
                      <tr>
                        <th className="px-5 py-3.5">Product</th>
                        <th className="px-5 py-3.5">Category</th>
                        <th className="px-5 py-3.5">Price</th>
                        <th className="px-5 py-3.5">Stock</th>
                        <th className="px-5 py-3.5">Featured</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredProducts.map((p) => {
                        const imgUrl = p.images && p.images[0] ? p.images[0].url : PRESET_IMAGES[0].url;
                        const catLabel = STORE_CATEGORIES.find((c) => c.slug === p.category)?.label || p.category;

                        return (
                          <tr key={p._id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                <img
                                  src={imgUrl}
                                  alt={p.name}
                                  className="w-12 h-12 object-contain rounded-xl border border-gray-100 bg-gray-50 p-1 shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-gray-900 line-clamp-1">{p.name}</div>
                                  <div className="text-[11px] text-gray-400 font-mono">SKU: {p.sku || 'N/A'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gray-100 text-gray-700">
                                {catLabel}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 font-bold text-gray-900">
                              Rs. {p.price.toLocaleString()}
                              {p.compareAtPrice && (
                                <span className="text-[10px] text-gray-400 line-through block font-normal">
                                  Rs. {p.compareAtPrice.toLocaleString()}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              {p.stock > 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  In Stock ({p.stock})
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                                  Out of Stock
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              {p.isFeatured ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                                  <Sparkles size={12} /> Yes
                                </span>
                              ) : (
                                <span className="text-gray-400 text-[11px]">No</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditModal(p)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p._id, p.name)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── TAB 2: CUSTOMER ORDERS ────────────────────────── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Customer Orders</h2>
                <p className="text-xs text-gray-500">View and process customer orders placed on store</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <ShoppingBag size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm font-bold text-gray-800">No orders received yet</p>
                <p className="text-xs text-gray-400 mt-1">When customers place orders, they will show up here instantly!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3.5">Order #</th>
                      <th className="px-5 py-3.5">Customer</th>
                      <th className="px-5 py-3.5">Items</th>
                      <th className="px-5 py-3.5">Total (LKR)</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => {
                      const statusColor =
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800';

                      return (
                        <tr key={order._id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-gray-900">
                            {order.orderNumber}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-gray-900">{order.customer.name}</div>
                            <div className="text-[11px] text-gray-500">{order.customer.phone}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-[11px] text-gray-700">
                              {order.items && order.items.length > 0 ? (
                                order.items.map((i, idx) => (
                                  <div key={idx} className="truncate max-w-[200px]">
                                    {i.quantity}x {i.name}
                                  </div>
                                ))
                              ) : (
                                <span className="text-gray-400">Stationery order</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-gray-900">
                            Rs. {(order.total || 0).toLocaleString()}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <select
                              value={order.status}
                              disabled={updatingOrderId === order._id}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="text-[11px] font-semibold px-2 py-1 border border-gray-300 rounded-lg bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-[#DC2626]"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ── CREATE / EDIT PRODUCT MODAL ───────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-8 animate-fade-in">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Package size={18} className="text-[#DC2626]" />
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold border-none bg-transparent cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Product Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atlas A4 200 Pages CR Book"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-[#DC2626] font-medium text-gray-900"
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

    </div>
  );
}

