import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { addLocalBooklist } from '@/lib/local-db';

// Allowed MIME types mapped to safe extensions
const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/heic': '.heic',
  'image/heif': '.heif',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

// Whitelist of allowed file extensions
const ALLOWED_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.heic',
  '.heif',
  '.pdf',
  '.doc',
  '.docx',
]);

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB safe limit

// POST /api/upload - Secure file upload with Cloudinary and safe local fallback
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum allowed file size is 15MB.' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Uploaded file is empty.' },
        { status: 400 }
      );
    }

    // 2. Validate MIME type and file extension (Defense in Depth)
    const mimeType = (file.type || '').toLowerCase();
    const rawExt = path.extname(file.name || '').toLowerCase();

    const isMimeAllowed = Boolean(mimeType && ALLOWED_MIME_TYPES[mimeType]);
    const isExtAllowed = ALLOWED_EXTENSIONS.has(rawExt);

    if (!isMimeAllowed && !isExtAllowed) {
      return NextResponse.json(
        {
          error:
            'Invalid file format. Only images (JPG, PNG, WEBP, GIF, HEIC) and documents (PDF, Word) are allowed.',
        },
        { status: 400 }
      );
    }

    const safeExt = isExtAllowed ? rawExt : ALLOWED_MIME_TYPES[mimeType] || '.jpg';

    // 3. Folder validation & path traversal prevention
    const rawFolder = formData.get('folder');
    let folder = 'azip-store/uploads';

    if (typeof rawFolder === 'string' && rawFolder.trim()) {
      const sanitizedFolder = rawFolder
        .trim()
        .replace(/^\/+|\/+$/g, '')
        .replace(/\.\./g, '');
      if (/^[a-zA-Z0-9_\-\/]+$/.test(sanitizedFolder)) {
        folder = sanitizedFolder;
      }
    }

    // 4. Safe unique filename generation
    const randomSuffix = crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).substring(2, 10);
    const cleanBaseName = path
      .basename(file.name || 'file', rawExt)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 30);
    const fileName = `${Date.now()}_${randomSuffix}_${cleanBaseName}${safeExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // 5. Cloudinary check & upload
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const isCloudinaryConfigured =
      Boolean(cloudName) &&
      cloudName !== 'your_cloud_name' &&
      Boolean(process.env.CLOUDINARY_API_KEY) &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
      Boolean(process.env.CLOUDINARY_API_SECRET) &&
      process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

    let uploadedUrl = '';
    let publicId = '';
    let isLocal = false;

    if (isCloudinaryConfigured) {
      try {
        const result = await uploadImage(buffer, folder);
        uploadedUrl = result.url;
        publicId = result.publicId;
      } catch (cloudErr: any) {
        console.warn(
          'Cloudinary upload failed, attempting local fallback:',
          cloudErr?.message || cloudErr
        );
      }
    }

    // 6. Local Storage Fallback with Graceful Serverless Data URL Fallback
    if (!uploadedUrl) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        uploadedUrl = `/uploads/${fileName}`;
        publicId = fileName;
        isLocal = true;
      } catch (fsErr: any) {
        console.warn(
          'Local disk write failed (expected on read-only serverless e.g. Vercel), falling back to optimized inline Data URL:',
          fsErr?.message
        );
        try {
          if (mimeType.startsWith('image/')) {
            const sharp = (await import('sharp')).default;
            const optimized = await sharp(buffer)
              .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
              .webp({ quality: 80 })
              .toBuffer();
            uploadedUrl = `data:image/webp;base64,${optimized.toString('base64')}`;
          } else {
            uploadedUrl = `data:${mimeType || 'application/octet-stream'};base64,${buffer.toString('base64')}`;
          }
          publicId = fileName;
          isLocal = false;
        } catch (dataUrlErr: any) {
          console.error('Data URL fallback error:', dataUrlErr);
          uploadedUrl = `data:${mimeType || 'image/jpeg'};base64,${buffer.toString('base64')}`;
          publicId = fileName;
          isLocal = false;
        }
      }
    }

    // 7. Save metadata if this is a School Booklist upload
    const studentName = ((formData.get('studentName') as string) || '').trim();
    const grade = ((formData.get('grade') as string) || '').trim();
    const schoolName = ((formData.get('schoolName') as string) || '').trim();
    const parentPhone = ((formData.get('parentPhone') as string) || '').trim();
    const city = ((formData.get('city') as string) || '').trim();
    const notes = ((formData.get('notes') as string) || '').trim();

    if (studentName || parentPhone) {
      try {
        addLocalBooklist({
          studentName,
          grade,
          schoolName,
          parentPhone,
          city,
          notes,
          fileUrl: uploadedUrl,
          fileName: file.name || fileName,
        });
      } catch (dbErr) {
        console.warn('Failed to save booklist entry:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrl,
      publicId,
      fileName,
      originalName: file.name,
      fileSize: file.size,
      mimeType,
      isLocal,
    });
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload file. Please try again.' },
      { status: 500 }
    );
  }
}
