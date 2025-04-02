
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
  
  // Add the missing delete method
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
  
  // Enhanced invalidation with pattern matching
  invalidate(keyPattern: string): void {
    let invalidatedCount = 0;
    
    // Remove all entries that match the pattern
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }
    
    if (invalidatedCount > 0) {
      console.log(`Invalidated ${invalidatedCount} cache entries matching pattern: ${keyPattern}`);
    }
  }
  
  // New method: Invalidate by custom matcher function
  invalidateByMatcher(matcher: (key: string, value?: CacheEntry<T>) => boolean): number {
    let invalidatedCount = 0;
    
    // Remove all entries that match the matcher function
    for (const [key, value] of this.cache.entries()) {
      if (matcher(key, value)) {
        this.cache.delete(key);
        invalidatedCount++;
      }
    }
    
    return invalidatedCount;
  }
  
  // Invalidate entries by tag (if entries have associated tags)
  invalidateByTag(tag: string): number {
    let invalidatedCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      // Check if entry has tags and if it includes the specified tag
      if (entry.data && typeof entry.data === 'object' && entry.data !== null) {
        const dataTags = (entry.data as any).tags;
        if (Array.isArray(dataTags) && dataTags.includes(tag)) {
          this.cache.delete(key);
          invalidatedCount++;
        }
      }
    }
    
    return invalidatedCount;
  }
  
  cleanExpired(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      console.log(`Cleaned ${expiredCount} expired cache entries`);
    }
  }
  
  clear(): void {
    const count = this.cache.size;
    this.cache.clear();
    console.log(`Cleared entire cache (${count} entries)`);
  }
  
  // Get cache statistics
  getStats(): { size: number, oldestTimestamp: number | null } {
    let oldestTimestamp: number | null = null;
    
    if (this.cache.size > 0) {
      oldestTimestamp = Math.min(
        ...[...this.cache.values()].map(entry => entry.timestamp)
      );
    }
    
    return {
      size: this.cache.size,
      oldestTimestamp
    };
  }
}

// Image Cache instance for use in image service
export const imageCache = new GenericCache<WebsiteImage | null>();

// URL Cache instance with a shorter TTL for faster updates
export const urlCache = new GenericCache<string>((2 * 60 * 1000)); // 2 minutes TTL

// Re-export types needed for the cache
import { WebsiteImage } from './types';

