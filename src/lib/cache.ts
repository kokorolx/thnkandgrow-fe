import fs from 'fs';
import path from 'path';

export interface CachedData {
  timestamp: number;
  categories: any[];
  settings: any;
  posts: any[];
  tags: any[];
  authors: any[];
  postSlugs: any[];
}

const CACHE_FILE = path.join(process.cwd(), '.cache', 'graphql-data.json');

let cachedData: CachedData | null = null;

export function getCachedData(): CachedData | null {
  try {
    // Return in-memory cache if available
    if (cachedData) {
      return cachedData;
    }

    // Try to read from file
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(data);
      return cachedData;
    }

    return null;
  } catch (error) {
    console.warn('⚠️ Failed to read cache file:', error);
    return null;
  }
}

export function isCacheValid(): boolean {
  const data = getCachedData();
  if (!data) return false;

  // Cache is valid for 24 hours
  const CACHE_TTL = 24 * 60 * 60 * 1000;
  const age = Date.now() - data.timestamp;
  return age < CACHE_TTL;
}

export function getCachedCategories(): any[] {
  const data = getCachedData();
  return data?.categories || [];
}

export function getCachedSettings(): any {
  const data = getCachedData();
  return data?.settings || {};
}

export function getCachedPosts(): any[] {
  const data = getCachedData();
  return data?.posts || [];
}

export function getCachedTags(): any[] {
  const data = getCachedData();
  return data?.tags || [];
}

export function getCachedAuthors(): any[] {
  const data = getCachedData();
  return data?.authors || [];
}

export function getCachedPostSlugs(): any[] {
  const data = getCachedData();
  return data?.postSlugs || [];
}

export function clearCache(): void {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      fs.unlinkSync(CACHE_FILE);
      cachedData = null;
      console.log('✅ Cache cleared');
    }
  } catch (error) {
    console.warn('⚠️ Failed to clear cache:', error);
  }
}
