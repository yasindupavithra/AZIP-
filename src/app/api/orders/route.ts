import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import Vendor from '@/lib/models/Vendor';

// GET /api/orders - List orders (admin only)
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create order (public)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { customer, items, paymentMethod, notes } = body;

    if (!customer || !items || !items.length) {
      return NextResponse.json(
        { error: 'Customer info and items are required' },
        { status: 400 }
      );
    }

    // Validate and get product details
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product "${item.name}" is not available` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${product.name}"` },
          { status: 400 }
        );
      }

      // Decrease stock
      product.stock -= item.quantity;
      await product.save();

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0]?.url || '',
      });
    }

    // Get default vendor
    let vendor = await Vendor.findOne({ isActive: true });
    if (!vendor) {
      vendor = await Vendor.create({
        name: 'AZip Store',
        slug: 'azip-store',
        contactEmail: 'admin@azipstore.lk',
        contactPhone: '0000000000',
        whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94XXXXXXXXX',
      });
    }

    const deliveryFee = 0; // Free delivery for Stage 1
    const total = subtotal + deliveryFee;

    const order = await Order.create({
      customer,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      paymentMethod: paymentMethod || 'cod',
      vendor: vendor._id,
      notes: notes || '',
      whatsappSent: paymentMethod === 'whatsapp',
    });

    return NextResponse.json(
      {
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          status: order.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
