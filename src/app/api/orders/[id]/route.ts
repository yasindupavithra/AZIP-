import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/lib/models/Order';
import { updateLocalOrderStatus, getLocalOrders } from '@/lib/local-db';

// GET /api/orders/[id]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let order = null;

    try {
      await dbConnect();
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id).lean();
      }
      if (!order) {
        order = await Order.findOne({ orderNumber: id }).lean();
      }
    } catch {
      // Ignore DB error
    }

    if (!order) {
      const localOrders = getLocalOrders();
      order = localOrders.find(o => o._id === id || o.orderNumber === id) || null;
    }

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handler for status updates (PUT or PATCH)
async function updateStatus(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const status = body.status;

    const updatedLocal = updateLocalOrderStatus(id, status);

    try {
      await dbConnect();
      await Order.findByIdAndUpdate(id, { status }, { new: true }).catch(() => {});
    } catch {
      // Ignore DB error
    }

    return NextResponse.json({ success: true, order: updatedLocal });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return updateStatus(request, context);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  return updateStatus(request, context);
}
