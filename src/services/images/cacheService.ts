/**
 * A generic cache service for storing and retrieving data with expiration
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { urlCache } from './utils/urlCache';

interface ImageCacheEntry {
  data: Blob;
  timestamp: number;
  expiresAt: number;
  version: string;
}

interface ImageCacheDB extends DBSchema {
  images: {
    key: string;
    value: ImageCacheEntry;
  };
}

class EnhancedImageCache {
  private db: IDBPDatabase<ImageCacheDB> | null = null;
  private readonly DB_NAME = 'image-cache';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'images';
  private readonly MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB
  private readonly CACHE_VERSION = '1.0';

  async initialize(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<ImageCacheDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images');
        }
      }
    });
  }

  async set(key: string, data: Blob, ttl: number = 5 * 60 * 1000): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    const entry: ImageCacheEntry = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
      version: this.CACHE_VERSION
    };

    await this.db.put(this.STORE_NAME, entry, key);
    await this.cleanup();
  }

  async get(key: string): Promise<Blob | null> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    const entry = await this.db.get(this.STORE_NAME, key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      await this.invalidate(key);
      return null;
    }

    return entry.data;
  }

  async invalidate(key: string): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.delete(this.STORE_NAME, key);
    urlCache.delete(key);
  }

  async clear(): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    await this.db.clear(this.STORE_NAME);
    urlCache.clear();
  }

  private async cleanup(): Promise<void> {
    if (!this.db) return;

    const tx = this.db.transaction(this.STORE_NAME, 'readwrite');
    const store = tx.objectStore(this.STORE_NAME);
    let totalSize = 0;
    const entries: { key: string; size: number }[] = [];

    await store.openCursor().then(async (cursor) => {
      while (cursor) {
        const size = cursor.value.data.size;
        totalSize += size;
        entries.push({ key: cursor.key as string, size });
        cursor = await cursor.continue();
      }
    });

    if (totalSize > this.MAX_CACHE_SIZE) {
      entries.sort((a, b) => a.size - b.size);
      let sizeToRemove = totalSize - this.MAX_CACHE_SIZE;
      
      for (const entry of entries) {
        if (sizeToRemove <= 0) break;
        await this.invalidate(entry.key);
        sizeToRemove -= entry.size;
      }
    }
  }
}

// Export singleton instance
export const imageCache = new EnhancedImageCache();

// Initialize cache
imageCache.initialize().catch(console.error);

// Re-export types needed for the cache
import { WebsiteImage } from './types';
