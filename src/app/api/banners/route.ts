import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import HeroBanner from '@/lib/models/HeroBanner';
import { getLocalBanners, addLocalBanner } from '@/lib/local-db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  try {
    await connectToDatabase();
    const query = all ? {} : { isActive: true };
    const banners = await HeroBanner.find(query).sort({ order: 1, createdAt: -1 }).lean();
    if (banners && banners.length > 0) {
      return NextResponse.json({ banners });
    }
  } catch (err) {
    console.warn('MongoDB banners fetch failed, using local storage fallback:', err);
  }

  // Fallback to local DB
  const localBanners = getLocalBanners();
  const filtered = all ? localBanners : localBanners.filter(b => b.isActive);
  return NextResponse.json({ banners: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, subtitle, badge, image, linkUrl, isActive, order } = body;

    if (!title || !subtitle || !image) {
      return NextResponse.json({ error: 'Title, Subtitle and Image are required' }, { status: 400 });
    }

    try {
      await connectToDatabase();
      const banner = await HeroBanner.create({
        title,
        subtitle,
        badge: badge || 'Special Offer',
        image,
        linkUrl: linkUrl || '/products',
        isActive: isActive !== undefined ? isActive : true,
        order: Number(order) || 0,
      });
      addLocalBanner(body);
      return NextResponse.json({ banner }, { status: 201 });
    } catch (dbErr) {
      console.warn('MongoDB banner create failed, writing to local fallback:', dbErr);
      const local = addLocalBanner(body);
      return NextResponse.json({ banner: local }, { status: 201 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create banner' }, { status: 500 });
  }
}
