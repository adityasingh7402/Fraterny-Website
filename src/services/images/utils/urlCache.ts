import { CACHE_VERSIONS, CACHE_CONFIG, CacheMetadata, migrateCache } from '../constants';

interface URLCacheEntry {
  url: string;
  timestamp: number;
  expiresAt: number;
  version: string;
  metadata: CacheMetadata;
}

class URLCache {
  private cache: Map<string, URLCacheEntry> = new Map();
  private readonly CACHE_VERSION = CACHE_VERSIONS.URL.current;

  set(key: string, url: string, ttl: number = CACHE_CONFIG.URL_TTL): void {
    const metadata: CacheMetadata = {
      version: this.CACHE_VERSION,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      size: url.length,
      type: 'url',
      tags: [key.split('-')[0]] // Extract category from key
    };

    this.cache.set(key, {
      url,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      version: this.CACHE_VERSION,
      metadata
    });

    this.cleanup();
  }

  async get(key: string): Promise<string | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Update last accessed time
    entry.metadata.lastAccessed = Date.now();
    this.cache.set(key, entry);

    if (entry.version !== this.CACHE_VERSION) {
      try {
        const migratedData = await migrateCache(entry.version, this.CACHE_VERSION, entry);
        const newEntry: URLCacheEntry = {
          url: migratedData.url,
          timestamp: migratedData.timestamp,
          expiresAt: migratedData.expiresAt,
          version: migratedData.version,
          metadata: migratedData.metadata
        };
        this.cache.set(key, newEntry);
        return newEntry.url;
      } catch (error) {
        console.error(`Failed to migrate cache entry for key ${key}:`, error);
        this.delete(key);
        return null;
      }
    }

    if (Date.now() > entry.expiresAt) {
      this.delete(key);
      return null;
    }

    return entry.url;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Add method to get cache statistics
  getStats(): { size: number; entries: number; oldestEntry: number | null } {
    let size = 0;
    let oldestEntry: number | null = null;

    for (const entry of this.cache.values()) {
      size += entry.metadata.size;
      if (!oldestEntry || entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
    }

    return {
      size,
      entries: this.cache.size,
      oldestEntry
    };
  }
}

export const urlCache = new URLCache(); 
