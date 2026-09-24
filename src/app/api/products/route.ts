import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import '@/lib/models/Vendor';
import { INITIAL_CATALOG_PRODUCTS } from '@/lib/catalog';

// GET /api/products - List products with filtering & fallback
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
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
    } catch (err) {
      console.warn('MongoDB connection/query issue, falling back to static catalog:', err);
    }

    // If DB returned products, return them
    if (dbProducts.length > 0) {
      return NextResponse.json({
        products: dbProducts,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: Math.ceil(totalCount / limit),
        },
      });
    }

    // Otherwise fallback gracefully to rich initial catalog
    let catalog = [...INITIAL_CATALOG_PRODUCTS];

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
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    const startIndex = (page - 1) * limit;
    const paginatedProducts = catalog.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        page,
        limit,
        total: catalog.length,
        pages: Math.ceil(catalog.length / limit) || 1,
      },
    });
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
    await dbConnect();
    const body = await request.json();

    const slug = body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now().toString(36);

    const product = await Product.create({
      ...body,
      slug,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
