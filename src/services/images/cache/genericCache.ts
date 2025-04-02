
import { WebsiteImage } from '../types';
import { CacheEntry } from './types';

/**
 * A generic cache service for storing and retrieving data with expiration
 */
export class GenericCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private DEFAULT_TTL: number;
  private MAX_CACHE_SIZE: number;
  private pendingDeletes: Set<string> = new Set();
  private batchDeleteTimeout: NodeJS.Timeout | null = null;
  private BATCH_DELETE_DELAY: number = 100; // 100ms delay for batching
  private verboseLogging: boolean = false; // Control logging verbosity
  
  constructor(defaultTtl: number = 5 * 60 * 1000, maxCacheSize: number = 100, verboseLogging: boolean = false) {
    this.DEFAULT_TTL = defaultTtl;
    this.MAX_CACHE_SIZE = maxCacheSize;
    this.verboseLogging = verboseLogging;
    
    // Periodically clean expired cache entries
    setInterval(() => this.cleanExpired(), 60 * 1000); // Clean every minute
  }

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.delete(key);
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
  
  // Enhanced delete method with batching support
  delete(key: string): boolean {
    // Add to pending batch
    this.pendingDeletes.add(key);
    
    // Schedule batch processing if not already scheduled
    if (!this.batchDeleteTimeout) {
      this.batchDeleteTimeout = setTimeout(() => this.processBatchDeletes(), this.BATCH_DELETE_DELAY);
    }
    
    return true; // Indicate pending deletion (will be processed in batch)
  }
  
  // Process all pending deletes in a single batch
  private processBatchDeletes(): void {
    const deleteCount = this.pendingDeletes.size;
    if (deleteCount === 0) {
      this.batchDeleteTimeout = null;
      return;
    }
    
    // Process all pending deletes
    for (const key of this.pendingDeletes) {
      this.cache.delete(key);
    }
    
    // Only log if verbose or if deleting multiple entries (important operation)
    if (this.verboseLogging || deleteCount > 1) {
      console.log(`Batch deleted ${deleteCount} cache entries`);
    }
    
    // Clear pending set and timeout reference
    this.pendingDeletes.clear();
    this.batchDeleteTimeout = null;
  }
  
  // Enhanced invalidation with batching and reduced logging
  invalidate(keyPattern: string): void {
    let keysToInvalidate: string[] = [];
    
    // Find all entries that match the pattern
    for (const key of this.cache.keys()) {
      if (key.includes(keyPattern)) {
        keysToInvalidate.push(key);
      }
    }
    
    // Add all matching keys to pending deletes
    keysToInvalidate.forEach(key => this.pendingDeletes.add(key));
    
    // Schedule batch processing if not already scheduled and if there are keys to process
    if (keysToInvalidate.length > 0 && !this.batchDeleteTimeout) {
      this.batchDeleteTimeout = setTimeout(() => this.processBatchDeletes(), this.BATCH_DELETE_DELAY);
    }
    
    // Only log if verbose or if invalidating multiple entries (important operation)
    if ((this.verboseLogging || keysToInvalidate.length > 1) && keysToInvalidate.length > 0) {
      console.log(`Scheduled invalidation of ${keysToInvalidate.length} cache entries matching pattern: ${keyPattern}`);
    }
  }
  
  // Invalidate by custom matcher function with batching
  invalidateByMatcher(matcher: (key: string, value?: CacheEntry<T>) => boolean): number {
    let keysToInvalidate: string[] = [];
    
    // Find all entries that match the matcher function
    for (const [key, value] of this.cache.entries()) {
      if (matcher(key, value)) {
        keysToInvalidate.push(key);
      }
    }
    
    // Add all matching keys to pending deletes
    keysToInvalidate.forEach(key => this.pendingDeletes.add(key));
    
    // Schedule batch processing if not already scheduled and if there are keys to process
    if (keysToInvalidate.length > 0 && !this.batchDeleteTimeout) {
      this.batchDeleteTimeout = setTimeout(() => this.processBatchDeletes(), this.BATCH_DELETE_DELAY);
    }
    
    // Only log if verbose or if invalidating multiple entries
    if ((this.verboseLogging || keysToInvalidate.length > 1) && keysToInvalidate.length > 0) {
      console.log(`Scheduled invalidation of ${keysToInvalidate.length} cache entries by matcher function`);
    }
    
    return keysToInvalidate.length;
  }
  
  // Invalidate entries by tag (if entries have associated tags)
  invalidateByTag(tag: string): number {
    let keysToInvalidate: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      // Check if entry has tags and if it includes the specified tag
      if (entry.data && typeof entry.data === 'object' && entry.data !== null) {
        const dataTags = (entry.data as any).tags;
        if (Array.isArray(dataTags) && dataTags.includes(tag)) {
          keysToInvalidate.push(key);
        }
      }
    }
    
    // Add all matching keys to pending deletes
    keysToInvalidate.forEach(key => this.pendingDeletes.add(key));
    
    // Schedule batch processing if not already scheduled and if there are keys to process
    if (keysToInvalidate.length > 0 && !this.batchDeleteTimeout) {
      this.batchDeleteTimeout = setTimeout(() => this.processBatchDeletes(), this.BATCH_DELETE_DELAY);
    }
    
    // Only log if verbose or if invalidating multiple entries
    if ((this.verboseLogging || keysToInvalidate.length > 1) && keysToInvalidate.length > 0) {
      console.log(`Scheduled invalidation of ${keysToInvalidate.length} cache entries with tag: ${tag}`);
    }
    
    return keysToInvalidate.length;
  }
  
  // Force immediate processing of any pending deletes
  flushBatchDeletes(): void {
    if (this.batchDeleteTimeout) {
      clearTimeout(this.batchDeleteTimeout);
      this.processBatchDeletes();
    }
  }
  
  cleanExpired(): void {
    const now = Date.now();
    let expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        expiredKeys.push(key);
      }
    }
    
    // Add all expired keys to pending deletes
    expiredKeys.forEach(key => this.pendingDeletes.add(key));
    
    // Schedule batch processing if not already scheduled and if there are keys to process
    if (expiredKeys.length > 0 && !this.batchDeleteTimeout) {
      this.batchDeleteTimeout = setTimeout(() => this.processBatchDeletes(), this.BATCH_DELETE_DELAY);
    }
    
    // Only log if multiple entries are expired or verbose logging is on
    if ((this.verboseLogging || expiredKeys.length > 1) && expiredKeys.length > 0) {
      console.log(`Cleaned ${expiredKeys.length} expired cache entries`);
    }
  }
  
  clear(): void {
    const count = this.cache.size;
    this.cache.clear();
    
    // Clear any pending operations
    if (this.batchDeleteTimeout) {
      clearTimeout(this.batchDeleteTimeout);
      this.batchDeleteTimeout = null;
    }
    this.pendingDeletes.clear();
    
    // Always log full cache clear as it's a significant operation
    console.log(`Cleared entire cache (${count} entries)`);
  }
  
  // Set logging verbosity
  setVerboseLogging(verbose: boolean): void {
    this.verboseLogging = verbose;
  }
  
  // Get cache statistics
  getStats(): { size: number, oldestTimestamp: number | null, pendingDeletes: number } {
    let oldestTimestamp: number | null = null;
    
    if (this.cache.size > 0) {
      oldestTimestamp = Math.min(
        ...[...this.cache.values()].map(entry => entry.timestamp)
      );
    }
    
    return {
      size: this.cache.size,
      oldestTimestamp,
      pendingDeletes: this.pendingDeletes.size
    };
  }
}

// Image Cache instance for use in image service - set to less verbose logging
export const imageCache = new GenericCache<WebsiteImage | null>(
  5 * 60 * 1000, // 5 minutes TTL 
  100, // Max cache size
  false // Disable verbose logging
);

// URL Cache instance with a shorter TTL for faster updates - set to less verbose logging
export const urlCache = new GenericCache<string>(
  2 * 60 * 1000, // 2 minutes TTL
  100, // Max cache size
  false // Disable verbose logging
);
