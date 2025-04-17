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
  
  constructor(defaultTtl: number = 5 * 60 * 1000, maxCacheSize: number = 100) {
    this.DEFAULT_TTL = defaultTtl;
    this.MAX_CACHE_SIZE = maxCacheSize;
    
    // Periodically clean expired cache entries
    setInterval(() => this.cleanExpired(), 60 * 1000); // Clean every minute
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.data;
  }
  
  set(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    // If cache is at capacity, remove oldest entries
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
  }
  
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  invalidate(keyPattern: string): void {
    // Remove all entries that match the pattern
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
      }
    }
  }
  
  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
  
  clear(): void {
    this.cache.clear();
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

// Re-export types needed for the cache
import { WebsiteImage } from './types';
