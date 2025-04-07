import { CACHE_CONFIG, CACHE_VERSIONS } from '../constants';

export interface URLCacheEntry {
  url: string;
  timestamp: number;
  expiresAt: number;
  version: string;
}

export class URLCache {
  private cache = new Map<string, URLCacheEntry>();
  private readonly DEFAULT_TTL = CACHE_CONFIG.URL_TTL;
  private readonly CACHE_VERSION = CACHE_VERSIONS.URL;

  get(key: string): string | null {
    try {
      const entry = this.cache.get(key);
      if (!entry) return null;

      // Check version mismatch
      if (entry.version !== this.CACHE_VERSION) {
        this.cache.delete(key);
        return null;
      }

      if (Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        return null;
      }

      return entry.url;
    } catch (error) {
      console.error(`Failed to retrieve cached URL for key ${key}:`, error);
      return null;
    }
  }

  set(key: string, url: string, ttl: number = this.DEFAULT_TTL): void {
    try {
      this.cache.set(key, {
        url,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        version: this.CACHE_VERSION
      });
    } catch (error) {
      console.error(`Failed to cache URL for key ${key}:`, error);
    }
  }

  delete(key: string): boolean {
    try {
      return this.cache.delete(key);
    } catch (error) {
      console.error(`Failed to delete cached URL for key ${key}:`, error);
      return false;
    }
  }

  clear(): void {
    try {
      this.cache.clear();
    } catch (error) {
      console.error('Failed to clear URL cache:', error);
    }
  }

  // New method to get cache statistics
  getStats(): { size: number; entries: number } {
    return {
      size: Array.from(this.cache.values()).reduce((acc, entry) => acc + entry.url.length, 0),
      entries: this.cache.size
    };
  }
}

export const urlCache = new URLCache(); 
