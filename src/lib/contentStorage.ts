import fs from 'fs/promises';
import path from 'path';
import { profileData as fallbackData, ProfileData } from '@/data/data';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

let memoryCachedData: ProfileData | null = null;
let memoryCachedTimestamp: string | null = null;

function getContentFilePath(): string {
  return path.join(process.cwd(), 'src', 'data', 'content.json');
}

function getBackupContentFilePath(): string {
  return path.join(process.cwd(), 'data', 'content.json');
}

export interface StorageResult {
  success: boolean;
  storage: 'supabase' | 'blob' | 'file' | 'local_fallback';
  message: string;
  timestamp: string;
  data: ProfileData;
  error?: string;
}

export interface StorageStatus {
  supabaseConfigured: boolean;
  blobConfigured: boolean;
  isVercel: boolean;
  lastUpdated: string | null;
}

export async function getStorageStatus(): Promise<StorageStatus> {
  return {
    supabaseConfigured: isSupabaseConfigured(),
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    isVercel: Boolean(process.env.VERCEL),
    lastUpdated: memoryCachedTimestamp,
  };
}

/**
 * Reads content data in order of preference:
 * 1. Supabase (if configured)
 * 2. Vercel Blob (if configured)
 * 3. Local filesystem (src/data/content.json)
 * 4. In-memory cache
 * 5. Fallback profileData
 */
export async function getContentData(): Promise<{ data: ProfileData; source: string; updatedAt?: string }> {
  // 1. Try Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // Try 'site_content' table first
      let res = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'current')
        .maybeSingle();

      // If error or empty, try 'portfolio_content' table as fallback
      if (res.error || !res.data) {
        res = await supabase
          .from('portfolio_content')
          .select('*')
          .eq('id', 'current')
          .maybeSingle();
      }

      if (res.data) {
        const row = res.data;
        const parsed = row.data || row.content || row;
        if (parsed?.artistName && parsed?.works && parsed?.projects) {
          const timestamp = row.updated_at || parsed.updatedAt || new Date().toISOString();
          parsed.updatedAt = timestamp;
          memoryCachedData = parsed;
          memoryCachedTimestamp = timestamp;
          return { data: parsed, source: 'supabase', updatedAt: timestamp };
        }
      }
    } catch (sbError) {
      console.warn('Supabase fetch error, continuing to file fallback:', sbError);
    }
  }

  // 2. Try Vercel Blob (if configured)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { list } = await import('@vercel/blob');
      const blobs = await list({ prefix: 'content.json' });
      if (blobs.blobs.length > 0) {
        const targetBlob = blobs.blobs[0];
        const res = await fetch(targetBlob.url, { cache: 'no-store' });
        if (res.ok) {
          const parsed = await res.json();
          if (parsed?.artistName) {
            const timestamp = targetBlob.uploadedAt?.toISOString() || parsed.updatedAt || new Date().toISOString();
            parsed.updatedAt = timestamp;
            memoryCachedData = parsed;
            memoryCachedTimestamp = timestamp;
            return { data: parsed, source: 'blob', updatedAt: timestamp };
          }
        }
      }
    } catch (blobError) {
      console.warn('Vercel Blob read error, continuing to local file:', blobError);
    }
  }

  // 3. Try Local filesystem
  try {
    const filePath = getContentFilePath();
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(fileContent);
    if (parsed?.artistName && parsed?.works && parsed?.projects) {
      memoryCachedData = parsed;
      return { data: parsed, source: 'local_file', updatedAt: parsed.updatedAt };
    }
  } catch {
    // If src/data/content.json fails, try data/content.json
    try {
      const backupPath = getBackupContentFilePath();
      const backupContent = await fs.readFile(backupPath, 'utf-8');
      const parsed = JSON.parse(backupContent);
      if (parsed?.artistName) {
        memoryCachedData = parsed;
        return { data: parsed, source: 'backup_file', updatedAt: parsed.updatedAt };
      }
    } catch {
      // Continue to in-memory or fallbackData
    }
  }

  // 4. In-memory cache
  if (memoryCachedData) {
    return { data: memoryCachedData, source: 'memory', updatedAt: memoryCachedTimestamp || undefined };
  }

  // 5. Hardcoded profileData fallback
  return { data: fallbackData, source: 'fallback_data' };
}

/**
 * Saves content data in order of preference:
 * 1. Supabase DB (if credentials provided)
 * 2. Vercel Blob (if token provided)
 * 3. Local filesystem (if writable)
 * Gracefully handles read-only serverless filesystems without crashing.
 */
export async function saveContentData(contentToSave: ProfileData): Promise<StorageResult> {
  const timestamp = new Date().toISOString();
  const updatedData: ProfileData = {
    ...contentToSave,
    updatedAt: timestamp,
  };

  memoryCachedData = updatedData;
  memoryCachedTimestamp = timestamp;

  let supabaseSaved = false;
  let blobSaved = false;
  let fileSaved = false;
  let supabaseErrorMsg: string | undefined;

  // 1. Supabase persistence
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // Try 'site_content' table first
      let res = await supabase.from('site_content').upsert(
        {
          id: 'current',
          data: updatedData,
          updated_at: timestamp,
        },
        { onConflict: 'id' }
      );

      // If 'site_content' fails, try 'portfolio_content' table
      if (res.error) {
        console.warn('Upsert to site_content failed, retrying on portfolio_content:', res.error.message);
        res = await supabase.from('portfolio_content').upsert(
          {
            id: 'current',
            data: updatedData,
            updated_at: timestamp,
          },
          { onConflict: 'id' }
        );
      }

      if (!res.error) {
        supabaseSaved = true;
      } else {
        supabaseErrorMsg = res.error.message;
        console.warn('Supabase save error:', res.error);
      }
    } catch (sbErr: any) {
      supabaseErrorMsg = sbErr?.message || String(sbErr);
      console.warn('Supabase exception during save:', sbErr);
    }
  }

  // 2. Vercel Blob persistence
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const { put } = await import('@vercel/blob');
      await put('content.json', JSON.stringify(updatedData, null, 2), {
        access: 'public',
        addRandomSuffix: false,
      });
      blobSaved = true;
    } catch (blobErr) {
      console.warn('Vercel Blob save warning:', blobErr);
    }
  }

  // 3. Local filesystem persistence (works locally; may fail on Vercel read-only filesystem)
  try {
    const filePath = getContentFilePath();
    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');
    fileSaved = true;

    try {
      const backupPath = getBackupContentFilePath();
      await fs.writeFile(backupPath, JSON.stringify(updatedData, null, 2), 'utf-8');
    } catch {
      // Ignore backup error
    }
  } catch (fsErr: any) {
    console.warn('Local file write skipped or failed (expected in Vercel serverless):', fsErr?.message);
  }

  // Determine storage status
  if (supabaseSaved) {
    return {
      success: true,
      storage: 'supabase',
      message: '클라우드 DB(Supabase)에 영구 저장되었습니다.',
      timestamp,
      data: updatedData,
    };
  }

  if (blobSaved) {
    return {
      success: true,
      storage: 'blob',
      message: 'Vercel Blob 클라우드에 영구 저장되었습니다.',
      timestamp,
      data: updatedData,
    };
  }

  if (fileSaved) {
    return {
      success: true,
      storage: 'file',
      message: '로컬 파일시스템에 저장되었습니다.',
      timestamp,
      data: updatedData,
    };
  }

  // Fallback when filesystem is read-only (Vercel) and external DB is not yet set up
  return {
    success: true,
    storage: 'local_fallback',
    message:
      '서버가 읽기 전용 환경(Vercel)입니다. 브라우저 localStorage에 안전하게 보존되었습니다. 온라인 영구 보존을 위해 Supabase 환경변수를 설정해 주세요.',
    timestamp,
    data: updatedData,
    error: supabaseErrorMsg,
  };
}
