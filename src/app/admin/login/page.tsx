'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@azipstore.lk');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sm:p-10">
        
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img
              src="/azip-logo.png"
              alt="AZIP .store"
              className="h-12 w-auto mx-auto object-contain drop-shadow-xs"
            />
          </Link>
          <h1 className="text-2xl font-black text-gray-900 font-['Outfit']">Admin Portal</h1>
          <p className="text-xs font-semibold text-gray-500 mt-1">
            Store Management &amp; Order Dashboard
          </p>
        </div>

        {/* Demo Credentials Notice */}
        <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs text-gray-700">
          <p className="font-bold text-[#e3004f] mb-1">🔑 Default Login Credentials:</p>
          <div className="space-y-0.5 font-mono text-[11px]">
            <div>Email: <span className="font-bold text-gray-900">admin@azipstore.lk</span></div>
            <div>Password: <span className="font-bold text-gray-900">admin123</span></div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Admin Email Address
            </label>
            <input
              type="email"
              placeholder="admin@azipstore.lk"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#e3004f] focus:ring-1 focus:ring-[#e3004f] transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#e3004f] focus:ring-1 focus:ring-[#e3004f] transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#e3004f] hover:bg-[#cc0043] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border-none disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <p className="text-center mt-6 text-xs text-gray-500">
          <Link href="/" className="font-semibold text-gray-600 hover:text-[#e3004f] transition-colors">
            ← Back to Public Store
          </Link>
        </p>

      </div>
    </div>
  );
}
