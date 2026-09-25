import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Vendor from '@/lib/models/Vendor';
import { getLocalOrders, addLocalOrder } from '@/lib/local-db';

// GET /api/orders - List orders (admin only)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let dbOrders: any[] = [];
    try {
      await dbConnect();
      const query: Record<string, unknown> = {};
      if (status && status !== 'all') {
        query.status = status;
      }
      dbOrders = await Order.find(query).sort({ createdAt: -1 }).lean();
    } catch {
      // Ignore DB error
    }

    if (dbOrders.length > 0) {
      return NextResponse.json({ orders: dbOrders });
    }

    let localOrders = getLocalOrders();
    if (status && status !== 'all') {
      localOrders = localOrders.filter(o => o.status === status);
    }

    return NextResponse.json({ orders: localOrders });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json({ orders: getLocalOrders() });
  }
}

// POST /api/orders - Create order (public)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod } = body;

    if (!customer || !items || !items.length) {
      return NextResponse.json(
        { error: 'Customer info and items are required' },
        { status: 400 }
      );
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
    const localOrder = addLocalOrder({
      customer,
      items,
      total: subtotal,
      paymentMethod: paymentMethod || 'cod',
    });

    try {
      await dbConnect();
      const vendor = await Vendor.findOne({ isActive: true });
      await Order.create({
        customer,
        items,
        subtotal,
        deliveryFee: 0,
        total: subtotal,
        paymentMethod: paymentMethod || 'cod',
        vendor: vendor?._id,
      }).catch(() => {});
    } catch {
      // Ignore DB error
    }

    return NextResponse.json({ order: localOrder }, { status: 201 });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create order: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
