import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST /api/upload - Upload image/document to Cloudinary (with local storage fallback)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file size (increased max size to 25MB to prevent rejections)
    const maxSize = 25 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum allowed file size is 25MB.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = (formData.get('folder') as string) || 'azip-store/uploads';

    // Check Cloudinary configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const isCloudinaryConfigured =
      cloudName &&
      cloudName !== 'your_cloud_name' &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key';

    if (isCloudinaryConfigured) {
      try {
        const result = await uploadImage(buffer, folder);
        return NextResponse.json({
          url: result.url,
          publicId: result.publicId,
        });
      } catch (cloudErr: any) {
        console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr?.message || cloudErr);
      }
    }

    // Local Storage Fallback (when Cloudinary is unconfigured or fails)
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}_${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);
    const localUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      url: localUrl,
      publicId: fileName,
      isLocal: true,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload file. Please try again.' },
      { status: 500 }
    );
  }
}
