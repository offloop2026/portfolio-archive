import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: '업로드할 파일이 전달되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 1. Check if Vercel Blob Token exists in environment
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const filename = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const blob = await put(filename, file, { access: 'public' });
        return NextResponse.json({
          success: true,
          url: blob.url,
          storage: 'vercel-blob',
        });
      } catch (blobErr: any) {
        console.warn('Vercel Blob upload failed, falling back to local storage:', blobErr);
      }
    }

    // 2. Fallback: Save to local public/uploads directory
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `img-${Date.now()}-${safeName}`;
      const filePath = path.join(uploadsDir, filename);

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.writeFile(filePath, buffer);

      const publicUrl = `/uploads/${filename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        storage: 'local',
      });
    } catch (fsErr: any) {
      console.warn('Local file write failed (e.g. read-only serverless environment):', fsErr);
      return NextResponse.json(
        {
          success: false,
          error: 'Local filesystem write failed. Use Base64 fallback.',
          canFallbackBase64: true,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('File upload server error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server upload failed' },
      { status: 500 }
    );
  }
}
