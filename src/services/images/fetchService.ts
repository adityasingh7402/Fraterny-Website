/**
 * Service for fetching images and cache invalidation
 */
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { Cache } from "./cache/Cache";
import { CACHE_DURATIONS, CACHE_PRIORITIES } from "./constants";

// Create cache instances if they don't exist in this context
const imageCache = new Cache<WebsiteImage>("imageCache", CACHE_DURATIONS.MEDIUM);
const urlCache = new Cache<string>("urlCache", CACHE_DURATIONS.SHORT);

/**
 * Fetch image by key - for React Query compatibility
 */
export const fetchImageByKey = async (key: string): Promise<WebsiteImage | null> => {
  if (!key || typeof key !== 'string' || key.trim() === '') {
    console.warn('Invalid image key provided for fetch');
    return null;
  }
  
  const normalizedKey = key.trim();
  const cacheKey = `image:${normalizedKey}`;
  
  // Check cache first
  const cachedImage = imageCache.get(cacheKey);
  if (cachedImage) {
    return cachedImage;
  }
  
  try {
    // Get image from database
    const { data: image, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    if (error) {
      console.error(`Database error for image "${normalizedKey}":`, error);
      return null;
    }
    
    if (!image) {
      console.warn(`No image found with key "${normalizedKey}"`);
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = await supabase.storage
      .from('Website Images')
      .getPublicUrl(image.storage_path);
    
    // Add URL to the image object and fix type issues
    const imageWithUrl: WebsiteImage = {
      ...image,
      sizes: image.sizes as Record<string, string> | null,
      metadata: image.metadata as Record<string, any> | null,
      url: urlData?.publicUrl || null
    };
    
    // Cache the image metadata
    imageCache.set(cacheKey, imageWithUrl, {
      ttl: CACHE_DURATIONS.MEDIUM,
      priority: CACHE_PRIORITIES.NORMAL
    });
    
    return imageWithUrl;
  } catch (error) {
    console.error(`Error getting image metadata for "${normalizedKey}":`, error);
    return null;
  }
};

/**
 * Fetch all images with pagination and search
 */
export const fetchAllImages = async (
  page: number = 1,
  pageSize: number = 20,
  searchTerm?: string
): Promise<{ images: WebsiteImage[]; total: number }> => {
  try {
    let query = supabase
      .from('website_images')
      .select('*', { count: 'exact' });
      
    // Add search if provided
    if (searchTerm) {
      query = query.or(`key.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    // Add pagination
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching images:', error);
      return { images: [], total: 0 };
    }
    
    // Add URLs to the images and fix type issues
    const imagesWithUrls = await Promise.all(
      (data || []).map(async (image) => {
        // Get the public URL
        const { data: urlData } = await supabase.storage
          .from('Website Images')
          .getPublicUrl(image.storage_path);
          
        return {
          ...image,
          sizes: image.sizes as Record<string, string> | null,
          metadata: image.metadata as Record<string, any> | null,
          url: urlData?.publicUrl || null
        };
      })
    );
    
    return {
      images: imagesWithUrls as WebsiteImage[],
      total: count || 0
    };
  } catch (error) {
    console.error('Unexpected error fetching images:', error);
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
): Promise<{ images: WebsiteImage[]; total: number }> => {
  try {
    let query = supabase
      .from('website_images')
      .select('*', { count: 'exact' })
      .eq('category', category);
      
    // Add search if provided
    if (searchTerm) {
      query = query.or(`key.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    // Add pagination
    const from = (page - 1) * pageSize;
    query = query.range(from, from + pageSize - 1);
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error(`Error fetching images for category "${category}":`, error);
      return { images: [], total: 0 };
    }
    
    // Add URLs to the images and fix type issues
    const imagesWithUrls = await Promise.all(
      (data || []).map(async (image) => {
        // Get the public URL
        const { data: urlData } = await supabase.storage
          .from('Website Images')
          .getPublicUrl(image.storage_path);
          
        return {
          ...image,
          sizes: image.sizes as Record<string, string> | null,
          metadata: image.metadata as Record<string, any> | null,
          url: urlData?.publicUrl || null
        };
      })
    );
    
    return {
      images: imagesWithUrls as WebsiteImage[],
      total: count || 0
    };
  } catch (error) {
    console.error(`Unexpected error fetching images for category "${category}":`, error);
    return { images: [], total: 0 };
  }
};

/**
 * Invalidate image cache for a specific key
 */
export const invalidateImageCache = (key: string): void => {
  if (!key || typeof key !== 'string' || key.trim() === '') {
    console.warn('Invalid key for cache invalidation');
    return;
  }
  
  try {
    const normalizedKey = key.trim();
    
    // Clear from image cache
    imageCache.delete(`image:${normalizedKey}`);
    
    // Clear from URL cache
    urlCache.delete(`url:${normalizedKey}`);
    urlCache.delete(`url:${normalizedKey}:small`);
    urlCache.delete(`url:${normalizedKey}:medium`);
    urlCache.delete(`url:${normalizedKey}:large`);
    urlCache.delete(`placeholder:${normalizedKey}`);
    
    console.log(`Cache invalidated for key: ${normalizedKey}`);
  } catch (error) {
    console.error(`Error invalidating cache for key "${key}":`, error);
  }
};

/**
 * Clear all image caches
 */
export const clearAllImageCaches = (): void => {
  try {
    // Clear both caches
    imageCache.clear();
    urlCache.clear();
    console.log('All image caches cleared');
  } catch (error) {
    console.error('Error clearing all image caches:', error);
  }
};

/**
 * Get image URL from storage path
 */
export const getImageUrlFromPath = async (storagePath: string): Promise<string | null> => {
  if (!storagePath) {
    return null;
  }
  
  try {
    const { data } = await supabase.storage
      .from('Website Images')
      .getPublicUrl(storagePath);
      
    return data?.publicUrl || null;
  } catch (error) {
    console.error(`Error getting URL from path "${storagePath}":`, error);
    return null;
  }
};

// Export cache instances for direct access if needed
export { imageCache, urlCache };
