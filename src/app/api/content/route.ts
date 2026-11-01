import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { ProfileData } from '@/data/data';
import { getContentData, saveContentData, getStorageStatus } from '@/lib/contentStorage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noCacheHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.get('status') === 'true') {
      const status = await getStorageStatus();
      return NextResponse.json(status, {
        status: 200,
        headers: noCacheHeaders,
      });
    }

    const result = await getContentData();
    return NextResponse.json(result.data, {
      status: 200,
      headers: {
        ...noCacheHeaders,
        'x-storage-source': result.source,
      },
    });
  } catch (error) {
    console.error('API /api/content GET error:', error);
    const fallback = await getContentData();
    return NextResponse.json(fallback.data, {
      status: 200,
      headers: noCacheHeaders,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data: ProfileData = body.data || body;

    if (!data || !data.artistName || !data.works || !data.projects || !data.cv) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format. Required fields missing.' },
        { status: 400, headers: noCacheHeaders }
      );
    }

    const result = await saveContentData(data);

    try {
      revalidatePath('/');
      revalidatePath('/ko');
      revalidatePath('/en');
      revalidatePath('/[lang]', 'page');
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    return NextResponse.json(
      {
        success: result.success,
        storage: result.storage,
        message: result.message,
        timestamp: result.timestamp,
        error: result.error,
      },
      {
        status: 200,
        headers: noCacheHeaders,
      }
    );
  } catch (error: any) {
    console.error('Failed to save content in /api/content:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process save request' },
      { status: 500, headers: noCacheHeaders }
    );
  }
}
