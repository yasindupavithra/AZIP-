import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import HeroBanner from '@/lib/models/HeroBanner';
import { updateLocalBanner, deleteLocalBanner } from '@/lib/local-db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const body = await request.json();

    try {
      await connectToDatabase();
      const updated = await HeroBanner.findByIdAndUpdate(id, body, { new: true });
      updateLocalBanner(id, body);
      if (updated) return NextResponse.json({ banner: updated });
    } catch (dbErr) {
      console.warn('MongoDB banner update failed, updating local fallback:', dbErr);
    }

    const local = updateLocalBanner(id, body);
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
    try {
      await connectToDatabase();
      await HeroBanner.findByIdAndDelete(id);
      deleteLocalBanner(id);
      return NextResponse.json({ success: true });
    } catch (dbErr) {
      console.warn('MongoDB banner delete failed, deleting local fallback:', dbErr);
    }

    const success = deleteLocalBanner(id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete banner' }, { status: 500 });
  }
}
