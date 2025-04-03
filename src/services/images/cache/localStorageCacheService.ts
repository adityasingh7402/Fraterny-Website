import { storageUtils } from '@/utils/storageUtils';
import { WebsiteImage } from '../types';

// Configuration constants
const CACHE_VERSION = '1.0';
const DEFAULT_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const IMAGE_CACHE_KEY = 'website_image_cache';
const URL_CACHE_KEY = 'website_image_url_cache';
const METADATA_CACHE_KEY = 'website_cache_metadata';
const MAX_ENTRIES_PER_CACHE = 200;

// Types for our cache structure
interface CacheMetadata {
  version: string;
  lastUpdated: number;
  globalVersion?: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  lastAccessed: number;
  priority: number; // Lower number = higher priority
}

interface StorageCache<T> {
  [key: string]: CacheEntry<T>;
}

/**
 * Service to handle persistent caching to localStorage
 */
export const localStorageCacheService = {
  /**
   * Initialize the cache system, setting up necessary metadata
   */
  initialize: (): boolean => {
    // Skip if storage is not available
    if (!storageUtils.isStorageAvailable()) {
      console.log('[LocalStorageCache] Storage not available, skipping initialization');
      return false;
    }

    try {
      // Set up metadata if it doesn't exist
      const metadata = storageUtils.getWithDecompression<CacheMetadata>(METADATA_CACHE_KEY);
      if (!metadata) {
        storageUtils.setWithCompression(METADATA_CACHE_KEY, {
          version: CACHE_VERSION,
          lastUpdated: Date.now(),
        });
        console.log('[LocalStorageCache] Initialized with version', CACHE_VERSION);
      } else if (metadata.version !== CACHE_VERSION) {
        // Version mismatch - clear caches and update version
        console.log(`[LocalStorageCache] Version mismatch, upgrading from ${metadata.version} to ${CACHE_VERSION}`);
        localStorage.removeItem(IMAGE_CACHE_KEY);
        localStorage.removeItem(URL_CACHE_KEY);
        storageUtils.setWithCompression(METADATA_CACHE_KEY, {
          version: CACHE_VERSION,
          lastUpdated: Date.now(),
          globalVersion: metadata.globalVersion, // Preserve global version
        });
      }
      return true;
    } catch (error) {
      console.error('[LocalStorageCache] Initialization failed:', error);
      return false;
    }
  },

  /**
   * Get image from cache
   */
  getImage: (key: string): WebsiteImage | null => {
    if (!storageUtils.isStorageAvailable()) return null;

    try {
      const cache = storageUtils.getWithDecompression<StorageCache<WebsiteImage>>(IMAGE_CACHE_KEY) || {};
      const entry = cache[key];
      
      if (!entry) return null;
      
      // Check if expired
      if (Date.now() > entry.expiresAt) {
        // Expired - remove from cache
        delete cache[key];
        storageUtils.setWithCompression(IMAGE_CACHE_KEY, cache);
        return null;
      }
      
      // Update last accessed time
      entry.lastAccessed = Date.now();
      cache[key] = entry;
      storageUtils.setWithCompression(IMAGE_CACHE_KEY, cache);
      
      return entry.data;
    } catch (error) {
      console.error('[LocalStorageCache] Error getting image:', error);
      return null;
    }
  },
  
  /**
   * Set image in cache
   */
  setImage: (key: string, image: WebsiteImage | null, priority: number = 3): boolean => {
    if (!storageUtils.isStorageAvailable() || !image) return false;
    
    try {
      // Get existing cache or initialize empty
      const cache = storageUtils.getWithDecompression<StorageCache<WebsiteImage>>(IMAGE_CACHE_KEY) || {};
      
      // Create entry
      cache[key] = {
        data: image,
        timestamp: Date.now(),
        expiresAt: Date.now() + DEFAULT_TTL,
        lastAccessed: Date.now(),
        priority: priority
      };
      
      // If we're approaching storage limits, prune cache
      if (storageUtils.isApproachingStorageLimit() || Object.keys(cache).length > MAX_ENTRIES_PER_CACHE) {
        localStorageCacheService.pruneCache(cache, 0.25); // Remove 25% of entries
      }
      
      // Save updated cache
      storageUtils.setWithCompression(IMAGE_CACHE_KEY, cache);
      
      // Update metadata
      const metadata = storageUtils.getWithDecompression<CacheMetadata>(METADATA_CACHE_KEY) || {
        version: CACHE_VERSION,
        lastUpdated: Date.now()
      };
      metadata.lastUpdated = Date.now();
      storageUtils.setWithCompression(METADATA_CACHE_KEY, metadata);
      
      return true;
    } catch (error) {
      console.error('[LocalStorageCache] Error setting image:', error);
      return false;
    }
  },
  
  /**
   * Get URL from cache
   */
  getUrl: (key: string): string | null => {
    if (!storageUtils.isStorageAvailable()) return null;

    try {
      const cache = storageUtils.getWithDecompression<StorageCache<string>>(URL_CACHE_KEY) || {};
      const entry = cache[key];
      
      if (!entry) return null;
      
      // Check if expired
      if (Date.now() > entry.expiresAt) {
        // Expired - remove from cache
        delete cache[key];
        storageUtils.setWithCompression(URL_CACHE_KEY, cache);
        return null;
      }
      
      // Update last accessed time
      entry.lastAccessed = Date.now();
      cache[key] = entry;
      storageUtils.setWithCompression(URL_CACHE_KEY, cache);
      
      return entry.data;
    } catch (error) {
      console.error('[LocalStorageCache] Error getting URL:', error);
      return null;
    }
  },
  
  /**
   * Set URL in cache
   */
  setUrl: (key: string, url: string, priority: number = 3): boolean => {
    if (!storageUtils.isStorageAvailable() || !url) return false;
    
    try {
      // Get existing cache or initialize empty
      const cache = storageUtils.getWithDecompression<StorageCache<string>>(URL_CACHE_KEY) || {};
      
      // Create entry
      cache[key] = {
        data: url,
        timestamp: Date.now(),
        expiresAt: Date.now() + DEFAULT_TTL,
        lastAccessed: Date.now(),
        priority: priority
      };
      
      // If we're approaching storage limits, prune cache
      if (storageUtils.isApproachingStorageLimit() || Object.keys(cache).length > MAX_ENTRIES_PER_CACHE) {
        localStorageCacheService.pruneCache(cache, 0.25); // Remove 25% of entries
      }
      
      // Save updated cache
      storageUtils.setWithCompression(URL_CACHE_KEY, cache);
      
      // Update metadata
      const metadata = storageUtils.getWithDecompression<CacheMetadata>(METADATA_CACHE_KEY) || {
        version: CACHE_VERSION,
        lastUpdated: Date.now()
      };
      metadata.lastUpdated = Date.now();
      storageUtils.setWithCompression(METADATA_CACHE_KEY, metadata);
      
      return true;
    } catch (error) {
      console.error('[LocalStorageCache] Error setting URL:', error);
      return false;
    }
  },
  
  /**
   * Clear all caches
   */
  clearCache: (): boolean => {
    if (!storageUtils.isStorageAvailable()) return false;
    
    try {
      localStorage.removeItem(IMAGE_CACHE_KEY);
      localStorage.removeItem(URL_CACHE_KEY);
      
      // Update metadata timestamp but keep version
      const metadata = storageUtils.getWithDecompression<CacheMetadata>(METADATA_CACHE_KEY) || {
        version: CACHE_VERSION,
        lastUpdated: Date.now()
      };
      metadata.lastUpdated = Date.now();
      storageUtils.setWithCompression(METADATA_CACHE_KEY, metadata);
      
      console.log('[LocalStorageCache] All caches cleared');
      return true;
    } catch (error) {
      console.error('[LocalStorageCache] Error clearing cache:', error);
      return false;
    }
  },
  
  /**
   * Clear URL cache for a specific key
   */
  clearUrlCacheForKey: (key: string): boolean => {
    if (!storageUtils.isStorageAvailable()) return false;
    
    try {
      const cache = storageUtils.getWithDecompression<StorageCache<string>>(URL_CACHE_KEY);
      if (cache && cache[key]) {
        delete cache[key];
        storageUtils.setWithCompression(URL_CACHE_KEY, cache);
        console.log(`[LocalStorageCache] URL cache cleared for key: ${key}`);
      }
      return true;
    } catch (error) {
      console.error('[LocalStorageCache] Error clearing URL cache for key:', error);
      return false;
    }
  },
  
  /**
   * Update global version to force invalidation of all caches
   */
  updateGlobalVersion: (version: string): boolean => {
    if (!storageUtils.isStorageAvailable()) return false;
    
    try {
      const metadata = storageUtils.getWithDecompression<CacheMetadata>(METADATA_CACHE_KEY) || {
        version: CACHE_VERSION,
        lastUpdated: Date.now()
      };
      metadata.globalVersion = version;
      metadata.lastUpdated = Date.now();
      storageUtils.setWithCompression(METADATA_CACHE_KEY, metadata);
      
      console.log(`[LocalStorageCache] Global version updated to: ${version}`);
      return true;
    } catch (error) {
      console.error('[LocalStorageCache] Error updating global version:', error);
      return false;
    }
  },
  
  /**
   * Get current global version
   */
  getGlobalVersion: (): string | undefined => {
    if (!storageUtils.isStorageAvailable()) return undefined;
    
    try {
      const metadata = storageUtils.getWithDecompression<CacheMetadata>(METADATA_CACHE_KEY);
      return metadata?.globalVersion;
    } catch (error) {
      console.error('[LocalStorageCache] Error getting global version:', error);
      return undefined;
    }
  },
  
  /**
   * Check if the cache is initialized and valid
   */
  isValid: (): boolean => {
    if (!storageUtils.isStorageAvailable()) return false;
    
    try {
      const metadata = storageUtils.getWithDecompression<CacheMetadata>(METADATA_CACHE_KEY);
      return !!metadata && metadata.version === CACHE_VERSION;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Remove expired entries from all caches
   */
  cleanExpired: (): void => {
    if (!storageUtils.isStorageAvailable()) return;
    
    try {
      const now = Date.now();
      
      // Clean image cache
      const imageCache = storageUtils.getWithDecompression<StorageCache<WebsiteImage>>(IMAGE_CACHE_KEY);
      if (imageCache) {
        let imageEntriesRemoved = 0;
        Object.keys(imageCache).forEach(key => {
          if (imageCache[key].expiresAt < now) {
            delete imageCache[key];
            imageEntriesRemoved++;
          }
        });
        if (imageEntriesRemoved > 0) {
          storageUtils.setWithCompression(IMAGE_CACHE_KEY, imageCache);
          console.log(`[LocalStorageCache] Removed ${imageEntriesRemoved} expired image cache entries`);
        }
      }
      
      // Clean URL cache
      const urlCache = storageUtils.getWithDecompression<StorageCache<string>>(URL_CACHE_KEY);
      if (urlCache) {
        let urlEntriesRemoved = 0;
        Object.keys(urlCache).forEach(key => {
          if (urlCache[key].expiresAt < now) {
            delete urlCache[key];
            urlEntriesRemoved++;
          }
        });
        if (urlEntriesRemoved > 0) {
          storageUtils.setWithCompression(URL_CACHE_KEY, urlCache);
          console.log(`[LocalStorageCache] Removed ${urlEntriesRemoved} expired URL cache entries`);
        }
      }
    } catch (error) {
      console.error('[LocalStorageCache] Error cleaning expired entries:', error);
    }
  },
  
  /**
   * Prune cache entries based on LRU and priority
   */
  pruneCache: <T>(cache: StorageCache<T>, percentageToRemove: number = 0.2): void => {
    try {
      const entries = Object.entries(cache);
      if (entries.length === 0) return;
      
      // Sort by priority (ascending) and then by lastAccessed (ascending)
      const sorted = entries.sort((a, b) => {
        // First compare by priority (lower = higher priority)
        const priorityDiff = b[1].priority - a[1].priority;
        if (priorityDiff !== 0) return priorityDiff;
        
        // If priority is the same, compare by last accessed time
        return a[1].lastAccessed - b[1].lastAccessed;
      });
      
      // Calculate how many entries to remove
      const removeCount = Math.ceil(sorted.length * percentageToRemove);
      if (removeCount <= 0) return;
      
      // Remove oldest entries
      for (let i = 0; i < removeCount; i++) {
        const [key] = sorted[i];
        delete cache[key];
      }
      
      console.log(`[LocalStorageCache] Pruned ${removeCount} cache entries to save space`);
    } catch (error) {
      console.error('[LocalStorageCache] Error pruning cache:', error);
    }
  }
};
