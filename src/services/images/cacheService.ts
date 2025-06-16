/**
 * A generic cache service for storing and retrieving data with expiration
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class GenericCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private DEFAULT_TTL: number;
  private MAX_CACHE_SIZE: number;
  private lock: Promise<void> = Promise.resolve();
  
  constructor(defaultTtl: number = 5 * 60 * 1000, maxCacheSize: number = 100) {
    this.DEFAULT_TTL = defaultTtl;
    this.MAX_CACHE_SIZE = maxCacheSize;
    
    // Periodically clean expired cache entries
    setInterval(() => this.cleanExpired(), 60 * 1000); // Clean every minute
  }

  private async withLock(fn: () => void | Promise<void>): Promise<void> {
    const prev = this.lock;
    let release: (() => void) | undefined;
    this.lock = new Promise<void>(resolve => {
      release = resolve;
    });
    await prev;
    try {
      await fn();
    } finally {
      if (release) {
        release();
      }
    }
  }

  async get(key: string): Promise<T | undefined> {
    let result: T | undefined;
    await this.withLock(() => {
      const entry = this.cache.get(key);
      if (!entry) return;
      if (Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        return;
      }
      result = entry.data;
    });
    return result;
  }
  
  async set(key: string, data: T, ttl: number = this.DEFAULT_TTL): Promise<void> {
    await this.withLock(() => {
      if (this.cache.size >= this.MAX_CACHE_SIZE) {
        const oldestEntry = [...this.cache.entries()]
          .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
        if (oldestEntry) {
          this.cache.delete(oldestEntry[0]);
        }
      }
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttl
      });
    });
  }
  
  async delete(key: string): Promise<boolean> {
    let deleted = false;
    await this.withLock(() => {
      deleted = this.cache.delete(key);
    });
    return deleted;
  }
  
  async invalidate(keyPattern: string): Promise<void> {
    await this.withLock(() => {
      for (const key of this.cache.keys()) {
        if (key.includes(keyPattern)) {
          this.cache.delete(key);
        }
      }
    });
  }
  
  async cleanExpired(): Promise<void> {
    await this.withLock(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now > entry.expiresAt) {
          this.cache.delete(key);
        }
      }
    });
  }
  
  async clear(): Promise<void> {
    await this.withLock(() => {
      this.cache.clear();
    });
  }

  // Add size getter
  get size(): number {
    return this.cache.size;
  }

  // Add entries method
  entries(): [string, CacheEntry<T>][] {
    return [...this.cache.entries()];
  }
}

// Image Cache instance for use in image service
export const imageCache = new GenericCache<WebsiteImage | null>();

// URL Cache instance with TTL matching version cache
export const urlCache = new GenericCache<string>(5 * 60 * 1000); // 5 minutes TTL to match version cache

// Function to clear image URL cache
export const clearImageUrlCache = async (): Promise<void> => {
  await urlCache.clear();
  console.log('Image URL cache cleared');
};

// Re-export types needed for the cache
import { WebsiteImage } from './types';
