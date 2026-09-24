import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import '@/lib/models/Vendor';
import { INITIAL_CATALOG_PRODUCTS } from '@/lib/catalog';

// GET /api/products/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let product = null;

    try {
      await dbConnect();
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id).populate('vendor', 'name slug whatsappNumber').lean();
      }
      if (!product) {
        product = await Product.findOne({ slug: id, isActive: true }).populate('vendor', 'name slug whatsappNumber').lean();
      }
    } catch (err) {
      console.warn('MongoDB query issue for product id/slug:', err);
    }

    if (!product) {
      // Look in INITIAL_CATALOG_PRODUCTS
      const fallback = INITIAL_CATALOG_PRODUCTS.find(
        (p) => p._id === id || p.slug === id
      );
      if (fallback) {
        product = fallback;
      }
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Soft delete (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
