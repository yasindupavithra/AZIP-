import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-in-production'
);

// Routes that require admin authentication
const protectedPaths = ['/admin'];
const protectedApiPaths = ['/api/upload', '/api/analytics'];
const publicPaths = ['/admin/login'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public admin paths
  if (publicPaths.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  // Check if path needs protection
  const isProtectedPage = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isProtectedApi = protectedApiPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Check admin API routes (POST/PUT/DELETE on products, orders)
  const isAdminApiMutation =
    (pathname.startsWith('/api/products') && request.method !== 'GET') ||
    (pathname.startsWith('/api/orders') &&
      (request.method === 'PATCH' || request.method === 'DELETE'));

  if (!isProtectedPage && !isProtectedApi && !isAdminApiMutation) {
    return NextResponse.next();
  }

  // Get token from cookie
  const token = request.cookies.get('azip-admin-token')?.value;

  if (!token) {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify JWT
  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    if (isProtectedPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/upload/:path*', '/api/analytics/:path*', '/api/products/:path*', '/api/orders/:path*'],
};
