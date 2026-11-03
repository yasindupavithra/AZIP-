import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import HeroBanner from '@/lib/models/HeroBanner';
import { updateLocalBanner, deleteLocalBanner } from '@/lib/local-db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = await request.json();

    const local = updateLocalBanner(id, body);

    try {
      await connectToDatabase();
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        const updated = await HeroBanner.findByIdAndUpdate(id, body, { new: true });
        if (updated && !local) {
          return NextResponse.json({ banner: updated });
        }
      }
    } catch {
      // Local store already updated
    }

    if (local) return NextResponse.json({ banner: local });
    return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update banner' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  return PUT(request, context);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    deleteLocalBanner(id);

    try {
      await connectToDatabase();
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        await HeroBanner.findByIdAndDelete(id);
      }
    } catch {
      // Local store already updated
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete banner' }, { status: 500 });
  }
}
