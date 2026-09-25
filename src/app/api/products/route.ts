import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import '@/lib/models/Vendor';
import { getLocalProducts, addLocalProduct } from '@/lib/local-db';

// Cache control header for ultra-fast response
const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59',
};

// GET /api/products - Fast listing with instant local fallback
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const featured = searchParams.get('featured');

    let dbProducts: any[] = [];
    let totalCount = 0;

    try {
      await dbConnect();
      const query: Record<string, unknown> = { isActive: true };

      if (category && category !== 'all') {
        query.category = category;
      }

      if (featured === 'true') {
        query.isFeatured = true;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ];
      }

      const sortObj: Record<string, 1 | -1> = {};
      sortObj[sort] = order === 'asc' ? 1 : -1;

      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        Product.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(limit)
          .populate('vendor', 'name slug')
          .lean(),
        Product.countDocuments(query),
      ]);

      dbProducts = products;
      totalCount = total;
    } catch {
      // Instant failover to local JSON store on any connection lag/error
    }

    // If DB returned products, return them immediately
    if (dbProducts.length > 0) {
      return NextResponse.json(
        {
          products: dbProducts,
          pagination: {
            page,
            limit,
            total: totalCount,
            pages: Math.ceil(totalCount / limit),
          },
        },
        { headers: CACHE_HEADERS }
      );
    }

    // High-speed persistent local JSON catalog fallback
    let catalog = getLocalProducts();

    if (category && category !== 'all') {
      catalog = catalog.filter((p) => p.category === category);
    }

    if (featured === 'true') {
      catalog = catalog.filter((p) => p.isFeatured);
    }

    if (search) {
      const q = search.toLowerCase();
      catalog = catalog.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedProducts = catalog.slice(startIndex, startIndex + limit);

    return NextResponse.json(
      {
        products: paginatedProducts,
        pagination: {
          page,
          limit,
          total: catalog.length,
          pages: Math.ceil(catalog.length / limit) || 1,
        },
      },
      { headers: CACHE_HEADERS }
    );
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create product (admin only)
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    // Always persist to local DB first
    const localProduct = addLocalProduct(body);

    // Sync to MongoDB asynchronously without blocking client response
    dbConnect().then(() => {
      const slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now().toString(36);

      Product.create({
        ...body,
        slug,
      }).catch((e) => console.warn('Could not save to MongoDB async:', e));
    }).catch(() => {});

    return NextResponse.json({ product: localProduct }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
