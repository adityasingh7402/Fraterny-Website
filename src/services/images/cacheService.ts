/**
 * A generic cache service for storing and retrieving data with expiration
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { urlCache } from './utils/urlCache';
import { CACHE_VERSIONS, CACHE_CONFIG, CacheMetadata, migrateCache } from './constants';

interface ImageCacheEntry {
  data: Blob;
  timestamp: number;
  expiresAt: number;
  version: string;
  metadata: CacheMetadata;
}

interface ImageCacheDB extends DBSchema {
  images: {
    key: string;
    value: ImageCacheEntry;
  };
  metadata: {
    key: string;
    value: {
      lastVersionCheck: number;
      lastMigration: number;
    };
  };
}

class EnhancedImageCache {
  private db: IDBPDatabase<ImageCacheDB> | null = null;
  private readonly DB_NAME = 'image-cache';
  private readonly DB_VERSION = 2; // Incremented for metadata support
  private readonly STORE_NAME = 'images';
  private readonly METADATA_STORE = 'metadata';
  private readonly MAX_CACHE_SIZE = CACHE_CONFIG.MAX_CACHE_SIZE;
  private readonly CACHE_VERSION = CACHE_VERSIONS.IMAGE.current;

  async initialize(): Promise<void> {
    if (this.db) return;

    try {
      this.db = await openDB<ImageCacheDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('images')) {
            db.createObjectStore('images');
          }
          if (!db.objectStoreNames.contains('metadata')) {
            db.createObjectStore('metadata');
          }
        }
      });

      // Check for version updates and migrate if needed
      await this.checkAndMigrate();
    } catch (error) {
      console.error('Failed to initialize image cache:', error);
      // Clear any potentially corrupted cache
      await this.clear();
    }
  }

  private async checkAndMigrate(): Promise<void> {
    if (!this.db) return;

    try {
      const metadata = await this.db.get(this.METADATA_STORE, 'version');
      const now = Date.now();

      // Check if we need to perform version check
      if (!metadata || (now - metadata.lastVersionCheck) > CACHE_CONFIG.VERSION_CHECK_INTERVAL) {
        await this.migrateCacheEntries();
        await this.db.put(this.METADATA_STORE, {
          lastVersionCheck: now,
          lastMigration: now
        }, 'version');
      }
    } catch (error) {
      console.error('Failed to check and migrate cache:', error);
    }
  }

  private async migrateCacheEntries(): Promise<void> {
    if (!this.db) return;

    try {
      const tx = this.db.transaction(this.STORE_NAME, 'readwrite');
      const store = tx.objectStore(this.STORE_NAME);
      let cursor = await store.openCursor();
      let batchCount = 0;

      while (cursor) {
        const entry = cursor.value;
        if (entry.version !== this.CACHE_VERSION) {
          const migratedData = await migrateCache(entry.version, this.CACHE_VERSION, entry);
          await cursor.update(migratedData);
          batchCount++;

          if (batchCount >= CACHE_CONFIG.MIGRATION_BATCH_SIZE) {
            await tx.done;
            batchCount = 0;
          }
        }
        cursor = await cursor.continue();
      }
    } catch (error) {
      console.error('Failed to migrate cache entries:', error);
    }
  }

  async set(key: string, data: Blob, ttl: number = CACHE_CONFIG.IMAGE_TTL): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const metadata: CacheMetadata = {
        version: this.CACHE_VERSION,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        size: data.size,
        type: 'image',
        tags: [key.split('-')[0]] // Extract category from key
      };

      const entry: ImageCacheEntry = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl,
        version: this.CACHE_VERSION,
        metadata
      };

      await this.db.put(this.STORE_NAME, entry, key);
      await this.cleanup();
    } catch (error) {
      console.error(`Failed to cache image for key ${key}:`, error);
      await this.invalidate(key);
    }
  }

  async get(key: string): Promise<Blob | null> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      const entry = await this.db.get(this.STORE_NAME, key);
      if (!entry) return null;

      // Update last accessed time
      entry.metadata.lastAccessed = Date.now();
      await this.db.put(this.STORE_NAME, entry, key);

      if (entry.version !== this.CACHE_VERSION) {
        const migratedData = await migrateCache(entry.version, this.CACHE_VERSION, entry);
        await this.db.put(this.STORE_NAME, migratedData, key);
        return migratedData.data;
      }

      if (Date.now() > entry.expiresAt) {
        await this.invalidate(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error(`Failed to retrieve cached image for key ${key}:`, error);
      return null;
    }
  }

  async invalidate(key: string): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.delete(this.STORE_NAME, key);
      urlCache.delete(key);
    } catch (error) {
      console.error(`Failed to invalidate cache for key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    await this.initialize();
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.clear(this.STORE_NAME);
      urlCache.clear();
    } catch (error) {
      console.error('Failed to clear image cache:', error);
    }
  }

  private async cleanup(): Promise<void> {
    if (!this.db) return;

    try {
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
    } catch (error) {
      console.error('Failed to clean up image cache:', error);
    }
  }
}

// Export singleton instance
export const imageCache = new EnhancedImageCache();

// Initialize cache
imageCache.initialize().catch(console.error);

// Re-export urlCache from utils for convenience
export { urlCache } from './utils/urlCache';

// Re-export types needed for the cache
import { WebsiteImage } from './types';
