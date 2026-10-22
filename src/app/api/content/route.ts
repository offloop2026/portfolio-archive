import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { profileData as fallbackData, ProfileData } from '@/data/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getContentFilePath(): string {
  return path.join(process.cwd(), 'src', 'data', 'content.json');
}

export async function GET() {
  try {
    const filePath = getContentFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.warn('Could not read content.json, returning fallback profileData:', error);
    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
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
        { status: 400 }
      );
    }

    const filePath = getContentFilePath();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

    // Also write to data/content.json if the directory exists
    try {
      const backupPath = path.join(process.cwd(), 'data', 'content.json');
      await fs.writeFile(backupPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // Ignore backup error if data/ dir doesn't exist
    }

    return NextResponse.json({
      success: true,
      message: '성공적으로 저장되었습니다.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Failed to save content:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to write content file' },
      { status: 500 }
    );
  }
}
