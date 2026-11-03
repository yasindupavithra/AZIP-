import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import HeroBanner from '@/lib/models/HeroBanner';
import { getLocalBanners, addLocalBanner, LocalBanner } from '@/lib/local-db';

function isBannerCurrentlyScheduled(b: Partial<LocalBanner>): boolean {
  if (!b.isActive) return false;
  const now = Date.now();

  if (b.startDate && b.startDate.trim()) {
    const startMs = new Date(b.startDate).getTime();
    if (!Number.isNaN(startMs) && now < startMs) {
      return false;
    }
  }

  if (b.endDate && b.endDate.trim()) {
    const rawEnd = b.endDate.trim();
    const endIso = rawEnd.length === 10 ? `${rawEnd}T23:59:59` : rawEnd;
    const endMs = new Date(endIso).getTime();
    if (!Number.isNaN(endMs) && now > endMs) {
      return false;
    }
  }

  return true;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  // Always check local JSON store first so admin edits reflect reliably
  const localBanners = getLocalBanners();

  try {
    await connectToDatabase();
    const dbBanners = await HeroBanner.find({}).sort({ order: 1, createdAt: -1 }).lean();
    if (dbBanners && dbBanners.length > 0 && localBanners.length === 0) {
      const list = all ? dbBanners : dbBanners.filter((b: any) => isBannerCurrentlyScheduled(b));
      return NextResponse.json({ banners: list });
    }
  } catch {
    // Fallback to local banners seamlessly
  }

  const sorted = [...localBanners].sort((a, b) => (a.order || 99) - (b.order || 99));
  const filtered = all ? sorted : sorted.filter((b) => isBannerCurrentlyScheduled(b));
  return NextResponse.json({ banners: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      badge,
      discountText,
      ctaText,
      bgTheme,
      displayMode,
      image,
      secondaryImages,
      linkUrl,
      isActive,
      order,
      startDate,
      endDate,
    } = body;

    if (!title || !subtitle || !image) {
      return NextResponse.json({ error: 'Title, Subtitle and Image are required' }, { status: 400 });
    }

    const local = addLocalBanner({
      title,
      subtitle,
      badge: badge || '11.11 SHOPPING FEST',
      discountText: discountText || '65%',
      ctaText: ctaText || 'Add to Cart',
      bgTheme: bgTheme || 'orange',
      displayMode: displayMode || 'daraz-stage',
      image,
      secondaryImages: Array.isArray(secondaryImages) ? secondaryImages : [],
      linkUrl: linkUrl || '/products',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      order: Number(order) || 1,
      startDate: startDate || '',
      endDate: endDate || '',
    });

    try {
      await connectToDatabase();
      await HeroBanner.create({
        title: local.title,
        subtitle: local.subtitle,
        badge: local.badge,
        discountText: local.discountText,
        ctaText: local.ctaText,
        bgTheme: local.bgTheme,
        displayMode: local.displayMode,
        image: local.image,
        secondaryImages: local.secondaryImages,
        linkUrl: local.linkUrl,
        isActive: local.isActive,
        order: local.order,
        startDate: local.startDate,
        endDate: local.endDate,
      });
    } catch {
      // Saved in local fallback already
    }

    return NextResponse.json({ banner: local }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create banner' }, { status: 500 });
  }
}
