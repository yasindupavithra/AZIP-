'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingBag, LogOut, BarChart3 } from 'lucide-react';

interface Order {
  _id: string;
  orderNumber: string;
  customer: { name: string; phone: string };
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const meRes = await fetch('/api/auth/me');
      if (!meRes.ok) {
        router.push('/admin/login');
        return;
      }
      const ordersRes = await fetch('/api/orders?limit=25');
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders || []);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#e3004f] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="shrink-0">
              <img
                src="/azip-logo.png"
                alt="AZIP .store"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-[#e3004f]">
              Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              View Store →
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer border border-red-200"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        
        {/* Welcome Banner */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Dashboard Overview</h1>
          <p className="text-xs text-gray-500 mt-1">
            Monitor educational product orders, store catalog, and customer shipments.
          </p>
        </div>

        {/* 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-red-50 text-[#e3004f] flex items-center justify-center mb-3">
              <Package size={20} />
            </div>
            <p className="text-xs font-medium text-gray-500">Catalog Products</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">20+ Items</h3>
            <Link href="/products" className="text-xs font-semibold text-[#e3004f] hover:underline mt-2 inline-block">
              Browse Public Catalog →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <ShoppingBag size={20} />
            </div>
            <p className="text-xs font-medium text-gray-500">Total Customer Orders</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</h3>
            <span className="text-xs text-emerald-600 font-semibold mt-2 inline-block">
              Live database sync
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <BarChart3 size={20} />
            </div>
            <p className="text-xs font-medium text-gray-500">Order Volume Total</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">Rs. {totalSales.toLocaleString()}</h3>
            <span className="text-xs text-gray-400 mt-2 inline-block">
              Island-wide deliveries
            </span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <ShoppingBag size={20} />
            </div>
            <p className="text-xs font-medium text-gray-500">Booklist WhatsApp</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">Active</h3>
            <a
              href="https://wa.me/94770000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-emerald-600 hover:underline mt-2 inline-block"
            >
              Open Direct WhatsApp →
            </a>
          </div>

        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900">Recent Customer Orders</h2>
              <p className="text-xs text-gray-500">Orders placed through Checkout and Booklist concierge</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <ShoppingBag size={36} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-semibold">No orders in the database yet</p>
              <p className="text-xs text-gray-400 mt-1">Orders placed on the store checkout will appear here in real-time.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3.5">Order #</th>
                    <th className="px-5 py-3.5">Customer</th>
                    <th className="px-5 py-3.5">Total (LKR)</th>
                    <th className="px-5 py-3.5">Date</th>
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
                        <td className="px-5 py-3.5 font-bold text-gray-900">
                          Rs. {order.total.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5 text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <select
                            value={order.status}
                            disabled={updatingId === order._id}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="text-[11px] font-semibold px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-[#e3004f]"
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

      </main>
    </div>
  );
}
