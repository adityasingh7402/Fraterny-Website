import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";
import { urlCache } from "./utils/urlCache";

// Cache configuration
const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 1000, // Maximum number of cached items
};

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  REQUESTS_PER_MINUTE: 100,
  BATCH_SIZE: 50, // Maximum number of items per batch request
  SEARCH_BATCH_SIZE: 20, // Smaller batch size for search operations
};

// Performance monitoring
const API_METRICS = {
  batchRequests: 0,
  singleRequests: 0,
  cacheHits: 0,
  cacheMisses: 0,
  searchRequests: 0,
  lastReset: Date.now(),
  
  reset() {
    this.batchRequests = 0;
    this.singleRequests = 0;
    this.cacheHits = 0;
    this.cacheMisses = 0;
    this.searchRequests = 0;
    this.lastReset = Date.now();
  },
  
  getMetrics() {
    const now = Date.now();
    const duration = (now - this.lastReset) / 1000; // seconds
    
    return {
      batchRequests: this.batchRequests,
      singleRequests: this.singleRequests,
      cacheHits: this.cacheHits,
      cacheMisses: this.cacheMisses,
      searchRequests: this.searchRequests,
      duration,
      requestsPerSecond: (this.batchRequests + this.singleRequests) / duration,
      cacheHitRate: this.cacheHits / (this.cacheHits + this.cacheMisses) || 0
    };
  }
};

// Cache implementation
class ApiCache {
  private cache: Map<string, { data: any, timestamp: number }> = new Map();
  private accessOrder: string[] = [];

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.TTL) {
      API_METRICS.cacheHits++;
      // Update access order
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      this.accessOrder.push(key);
      return cached.data;
    }
    API_METRICS.cacheMisses++;
    return null;
  }

  set(key: string, data: any): void {
    if (this.cache.size >= CACHE_CONFIG.MAX_SIZE) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { data, timestamp: Date.now() });
    this.accessOrder.push(key);
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }
}

// Request batching implementation
class RequestBatcher {
  private batch: Map<string, Promise<any>> = new Map();
  private timeout: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY = 100; // ms

  async add<T>(key: string, request: () => Promise<T>): Promise<T> {
    if (this.batch.has(key)) {
      return this.batch.get(key) as Promise<T>;
    }

    const promise = new Promise<T>((resolve) => {
      if (this.timeout) clearTimeout(this.timeout);
      
      this.timeout = setTimeout(async () => {
        const result = await request();
        resolve(result);
        this.batch.delete(key);
      }, this.BATCH_DELAY);
    });

    this.batch.set(key, promise);
    return promise;
  }
}

// Rate limiter implementation
class RateLimiter {
  private requests: number[] = [];
  private readonly windowMs = 60000; // 1 minute

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= RATE_LIMIT_CONFIG.REQUESTS_PER_MINUTE) {
      const waitTime = this.windowMs - (now - this.requests[0]);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.requests.push(Date.now());
  }
}

// Initialize services
const cache = new ApiCache();
const batcher = new RequestBatcher();
const rateLimiter = new RateLimiter();

/**
 * Fetch multiple images in a single batch request with search support
 */
export const fetchImagesBatch = async (
  keys: string[],
  searchTerm?: string
): Promise<WebsiteImage[]> => {
  try {
    API_METRICS.batchRequests++;
    
    // Apply search filter if provided
    if (searchTerm) {
      API_METRICS.searchRequests++;
      const searchLower = searchTerm.toLowerCase();
      keys = keys.filter(key => key.toLowerCase().includes(searchLower));
    }

    // Check cache first
    const cachedResults = keys.map(key => cache.get(key)).filter(Boolean);
    if (cachedResults.length === keys.length) {
      return cachedResults as WebsiteImage[];
    }

    // Split into batches if necessary
    const batchSize = searchTerm ? RATE_LIMIT_CONFIG.SEARCH_BATCH_SIZE : RATE_LIMIT_CONFIG.BATCH_SIZE;
    const batches = [];
    for (let i = 0; i < keys.length; i += batchSize) {
      batches.push(keys.slice(i, i + batchSize));
    }

    const results: WebsiteImage[] = [];
    for (const batch of batches) {
      await rateLimiter.waitForSlot();
      
      const { data, error } = await supabase
        .from('website_images')
        .select('*')
        .in('key', batch);

      if (error) throw error;
      
      if (data) {
        data.forEach((image: WebsiteImage) => {
          cache.set(image.key, image);
          // Store the storage path in URL cache
          urlCache.set(`key:${image.key}`, image.storage_path);
          results.push(image);
        });
      }
    }

    return results;
  } catch (error) {
    console.error('Error fetching image batch:', error);
    return [];
  }
};

/**
 * Fetch a single image with caching and batching
 */
export const fetchImageOptimized = async (key: string): Promise<WebsiteImage | null> => {
  try {
    API_METRICS.singleRequests++;
    
    // Check cache first
    const cached = cache.get(key);
    if (cached) return cached as WebsiteImage;

    // Use batcher for single requests
    return await batcher.add(key, async () => {
      await rateLimiter.waitForSlot();
      
      const { data, error } = await supabase
        .from('website_images')
        .select('*')
        .eq('key', key)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        cache.set(key, data);
        // Store the storage path in URL cache
        urlCache.set(`key:${key}`, data.storage_path);
      }
      
      return data;
    });
  } catch (error) {
    return handleApiError(error, `Error fetching image with key "${key}"`, false) as null;
  }
};

/**
 * Invalidate cache for specific keys
 */
export const invalidateCache = (keys: string[]): void => {
  keys.forEach(key => {
    cache.invalidate(key);
    urlCache.delete(`key:${key}`);
  });
};

/**
 * Clear entire cache
 */
export const clearCache = (): void => {
  cache.clear();
  urlCache.clear();
};

/**
 * Get current API metrics
 */
export const getApiMetrics = () => {
  return API_METRICS.getMetrics();
};

/**
 * Reset API metrics
 */
export const resetApiMetrics = () => {
  API_METRICS.reset();
}; 