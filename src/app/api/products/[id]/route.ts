import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/models/Product';
import '@/lib/models/Vendor';
import { getLocalProducts, updateLocalProduct, deleteLocalProduct } from '@/lib/local-db';

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
      const localItems = getLocalProducts();
      const fallback = localItems.find((p) => p._id === id || p.slug === id);
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
    const { id } = await params;
    const body = await request.json();

    // Update in local DB
    const updatedLocal = updateLocalProduct(id, body);

    // Try updating in MongoDB if available
    try {
      await dbConnect();
      await Product.findByIdAndUpdate(
        id,
        { $set: body },
        { new: true, runValidators: true }
      ).catch(() => {});
    } catch {
      // Ignore DB error
    }

    if (!updatedLocal) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: updatedLocal });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Failed to update product: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete in local DB
    const deleted = deleteLocalProduct(id);

    // Try deleting in MongoDB if available
    try {
      await dbConnect();
      await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      ).catch(() => {});
    } catch {
      // Ignore DB error
    }

    return NextResponse.json({ success: true, deleted });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
