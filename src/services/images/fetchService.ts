
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";

// Cache for recently fetched images with improved management
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class ImageCache {
  private cache = new Map<string, CacheEntry<WebsiteImage | null>>();
  private DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds
  private MAX_CACHE_SIZE = 100;
  
  constructor() {
    // Periodically clean expired cache entries
    setInterval(() => this.cleanExpired(), 60 * 1000); // Clean every minute
  }

  get(key: string): WebsiteImage | null | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) return undefined;
    
    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    
    return entry.data;
  }
  
  set(key: string, data: WebsiteImage | null, ttl: number = this.DEFAULT_TTL): void {
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
}

// Single cache instance
const imageCache = new ImageCache();

/**
 * Fetch image metadata by key with improved caching
 */
export const fetchImageByKey = async (key: string): Promise<WebsiteImage | null> => {
  try {
    // Check cache first
    const cacheKey = `image:${key}`;
    const cached = imageCache.get(cacheKey);
    
    if (cached !== undefined) {
      console.log(`Cache hit for fetchImageByKey: ${key}`);
      return cached;
    }
    
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', key)
      .maybeSingle();
    
    if (error) {
      return handleApiError(error, `Error fetching image with key "${key}"`, false) as null;
    }
    
    // Cache the result
    imageCache.set(cacheKey, data as WebsiteImage | null);
    
    return data;
  } catch (error) {
    return handleApiError(error, `Unexpected error in fetchImageByKey for key "${key}"`, false) as null;
  }
};

/**
 * Fetch all website images with pagination and search
 */
export const fetchAllImages = async (
  page: number = 1, 
  pageSize: number = 20,
  searchTerm?: string
): Promise<{
  images: WebsiteImage[],
  total: number
}> => {
  try {
    let query = supabase.from('website_images').select('*', { count: 'exact' });
    
    // Add search functionality if search term is provided
    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.trim();
      // Search in key, description, alt_text and category
      query = query.or(`key.ilike.%${term}%,description.ilike.%${term}%,alt_text.ilike.%${term}%,category.ilike.%${term}%`);
    }
    
    // Add pagination
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      return handleApiError(error, 'Error fetching images', false) as unknown as { images: WebsiteImage[], total: number };
    }
    
    return { 
      images: data || [], 
      total: count || 0 
    };
  } catch (error) {
    handleApiError(error, 'Unexpected error in fetchAllImages', false);
    return { images: [], total: 0 };
  }
};

/**
 * Fetch images by category with pagination and search
 */
export const fetchImagesByCategory = async (
  category: string,
  page: number = 1, 
  pageSize: number = 20,
  searchTerm?: string
): Promise<{
  images: WebsiteImage[],
  total: number
}> => {
  try {
    let query = supabase
      .from('website_images')
      .select('*', { count: 'exact' })
      .eq('category', category);
    
    // Add search functionality if search term is provided
    if (searchTerm && searchTerm.trim().length > 0) {
      const term = searchTerm.trim();
      // Search in key, description and alt_text
      query = query.or(`key.ilike.%${term}%,description.ilike.%${term}%,alt_text.ilike.%${term}%`);
    }
    
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      return handleApiError(error, `Error fetching images by category "${category}"`, false) as unknown as { images: WebsiteImage[], total: number };
    }
    
    return { 
      images: data || [], 
      total: count || 0 
    };
  } catch (error) {
    handleApiError(error, `Unexpected error in fetchImagesByCategory for category "${category}"`, false);
    return { images: [], total: 0 };
  }
};

/**
 * Clear image cache
 */
export const clearImageCache = (): void => {
  imageCache.clear();
  console.log('Image cache cleared');
};

/**
 * Invalidate cache for specific image
 */
export const invalidateImageCache = (key: string): void => {
  imageCache.invalidate(key);
  console.log(`Cache invalidated for image with key: ${key}`);
};

// Export the cache for use in other services
export { imageCache };
