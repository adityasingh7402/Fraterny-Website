import { CacheEntry } from './types';
import { localStorageCacheService } from './localStorageCacheService';

/**
 * A generic cache service for storing and retrieving data with expiration
 * Enhanced with localStorage persistence
 */
export class GenericCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private DEFAULT_TTL: number;
  private MAX_CACHE_SIZE: number;
  private pendingDeletes: Set<string> = new Set();
  private batchDeleteTimeout: NodeJS.Timeout | null = null;
  private BATCH_DELETE_DELAY: number = 100; // 100ms delay for batching
  private verboseLogging: boolean = false; // Control logging verbosity
  private name: string; // Name of this cache instance for localStorage persistence
  private persistToStorage: boolean = false; // Whether to persist to localStorage
  private storageInitialized: boolean = false; // Whether localStorage has been initialized
  
  constructor(
    name: string = 'default',
    defaultTtl: number = 5 * 60 * 1000, 
    maxCacheSize: number = 100, 
    verboseLogging: boolean = false,
    persistToStorage: boolean = true
  ) {
    this.DEFAULT_TTL = defaultTtl;
    this.MAX_CACHE_SIZE = maxCacheSize;
    this.verboseLogging = verboseLogging;
    this.name = name;
    this.persistToStorage = persistToStorage;
    
    // Initialize storage if persistence is enabled
    if (this.persistToStorage) {
      try {
        this.storageInitialized = localStorageCacheService.isValid();
        
        // Clean expired entries on initialization
        if (this.storageInitialized) {
          localStorageCacheService.cleanExpired();
        }
      } catch (err) {
        console.error(`[GenericCache:${this.name}] Error initializing storage:`, err);
        this.storageInitialized = false;
      }
    }
    
    // Periodically clean expired cache entries
    setInterval(() => this.cleanExpired(), 60 * 1000); // Clean every minute
  }

  get(key: string): T | undefined {
    // First try memory cache
    const entry = this.cache.get(key);
    
    if (entry) {
      // Check if memory entry has expired
      if (Date.now() > entry.expiresAt) {
        this.delete(key);
        
        // If persistence is enabled, try localStorage before returning undefined
        if (this.persistToStorage && this.storageInitialized) {
          if (this.name === 'imageCache') {
            return localStorageCacheService.getImage(key) as unknown as T;
          } else if (this.name === 'urlCache') {
            return localStorageCacheService.getUrl(key) as unknown as T;
          }
        }
        
        return undefined;
      }
      
      return entry.data;
    }
    
    // If not in memory and persistence is enabled, try localStorage
    if (this.persistToStorage && this.storageInitialized) {
      let persistedData: any = null;
      
      if (this.name === 'imageCache') {
        persistedData = localStorageCacheService.getImage(key);
      } else if (this.name === 'urlCache') {
        persistedData = localStorageCacheService.getUrl(key);
      }
      
      // If found in localStorage, add to memory cache
      if (persistedData !== null) {
        if (this.verboseLogging) {
          console.log(`[GenericCache:${this.name}] Cache hit from localStorage for key: ${key}`);
        }
        
        this.cache.set(key, {
          data: persistedData as T,
          timestamp: Date.now(),
          expiresAt: Date.now() + this.DEFAULT_TTL
        });
        
        return persistedData as T;
      }
    }
    
    return undefined;
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
    
    // Add to memory cache
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    });
    
    // If persistence is enabled, also persist to localStorage
    if (this.persistToStorage && this.storageInitialized) {
      try {
        // Calculate priority based on key patterns
        let priority = 3; // Default priority
        
        // Higher priority (1) for frequently used items
        if (key.includes('hero-') || key.includes('logo') || 
            key.includes('navigation') || key.includes('header')) {
          priority = 1;
        } 
        // Medium priority (2) for common content items
        else if (key.includes('feature-') || key.includes('product-')) {
          priority = 2;
        }
        
        if (this.name === 'imageCache') {
          localStorageCacheService.setImage(key, data as any, priority);
        } else if (this.name === 'urlCache') {
          localStorageCacheService.setUrl(key, data as any, priority);
        }
      } catch (err) {
        console.error(`[GenericCache:${this.name}] Error persisting to localStorage:`, err);
      }
    }
  }
  
  delete(key: string): boolean {
    // Add to pending batch
    this.pendingDeletes.add(key);
    
    // Schedule batch processing if not already scheduled
    if (!this.batchDeleteTimeout) {
      this.batchDeleteTimeout = setTimeout(() => this.processBatchDeletes(), this.BATCH_DELETE_DELAY);
    }
    
    // Also remove from localStorage if persistence is enabled
    if (this.persistToStorage && this.storageInitialized && this.name === 'urlCache') {
      try {
        localStorageCacheService.clearUrlCacheForKey(key);
      } catch (err) {
        console.error(`[GenericCache:${this.name}] Error removing from localStorage:`, err);
      }
    }
    
    return true; // Indicate pending deletion (will be processed in batch)
  }
  
  processBatchDeletes(): void {
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
      console.log(`[GenericCache:${this.name}] Batch deleted ${deleteCount} cache entries`);
    }
    
    // Clear pending set and timeout reference
    this.pendingDeletes.clear();
    this.batchDeleteTimeout = null;
  }
  
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
      console.log(`[GenericCache:${this.name}] Scheduled invalidation of ${keysToInvalidate.length} cache entries matching pattern: ${keyPattern}`);
    }
  }
  
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
      console.log(`[GenericCache:${this.name}] Scheduled invalidation of ${keysToInvalidate.length} cache entries by matcher function`);
    }
    
    return keysToInvalidate.length;
  }
  
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
      console.log(`[GenericCache:${this.name}] Scheduled invalidation of ${keysToInvalidate.length} cache entries with tag: ${tag}`);
    }
    
    return keysToInvalidate.length;
  }
  
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
      console.log(`[GenericCache:${this.name}] Cleaned ${expiredKeys.length} expired cache entries`);
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
    
    // Also clear localStorage if persistence is enabled
    if (this.persistToStorage && this.storageInitialized) {
      try {
        localStorageCacheService.clearCache();
      } catch (err) {
        console.error(`[GenericCache:${this.name}] Error clearing localStorage:`, err);
      }
    }
    
    // Always log full cache clear as it's a significant operation
    console.log(`[GenericCache:${this.name}] Cleared entire cache (${count} entries)`);
  }
  
  setVerboseLogging(verbose: boolean): void {
    this.verboseLogging = verbose;
  }
  
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
