
import { supabase } from '@/integrations/supabase/client';
import { WebsiteImage } from './types';
import { urlCache } from './cacheService';
import { fetchImageByKey } from './fetchService';
import { defaultImagesMap } from './constants';

/**
 * Enhanced image URL service with caching and placeholder support
 */

// Cache duration increased to 5 minutes for better performance
const URL_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get the URL of an image by its key with enhanced caching
 * @param key Unique key to identify the image
 * @returns URL of the image
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
  try {
    if (!key) {
      throw new Error('Image key is required');
    }

    // Check for any spaces or special characters in the key that might cause issues
    const sanitizedKey = key.trim();
    
    console.log(`Attempting to get image URL for key: "${sanitizedKey}"`);

    // Check cache first (before defaultImagesMap to ensure fresh uploads are used)
    const cacheKey = `key:${sanitizedKey}`;
    const cached = urlCache.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for image key: ${sanitizedKey}`);
      return cached;
    }
    
    // Fetch the image record from the database
    const imageRecord = await fetchImageByKey(sanitizedKey);
    
    if (imageRecord) {
      // Get the public URL from storage
      const { data: urlData } = supabase.storage
        .from('website-images')
        .getPublicUrl(imageRecord.storage_path, {
          // Add cache busting if needed
          // download: `${sanitizedKey}-${Date.now()}`
        });
      
      if (urlData.publicUrl) {
        // Cache the result with extended duration
        urlCache.set(cacheKey, urlData.publicUrl, URL_CACHE_DURATION);
        
        // Add console log for debugging
        console.log(`Retrieved image URL for key "${sanitizedKey}":`, urlData.publicUrl);
        
        return urlData.publicUrl;
      }
    }
    
    // If we reach here, the image was not found in the database or failed to get URL
    console.warn(`Image with key "${sanitizedKey}" not found in database or failed to get URL`);
    
    // For non-production environment, use defaults if available
    if (process.env.NODE_ENV !== 'production' && defaultImagesMap[sanitizedKey]) {
      console.log(`Using default image for key: ${sanitizedKey}`);
      return defaultImagesMap[sanitizedKey];
    }
    
    // Return placeholder image
    return '/placeholder.svg';
  } catch (error) {
    console.error(`Failed to get image with key "${key}"`, error);
    // Return placeholder image instead of throwing error
    return '/placeholder.svg';
  }
};

/**
 * Get the URL of an image by its key and size with enhanced caching
 * @param key Unique key to identify the image
 * @param size Size of the image (small, medium, large)
 * @returns URL of the sized image or original if the size doesn't exist
 */
export const getImageUrlByKeyAndSize = async (
  key: string, 
  size: 'small' | 'medium' | 'large'
): Promise<string> => {
  try {
    if (!key) {
      throw new Error('Image key is required');
    }

    // For production environment, skip defaults and always try to fetch from Supabase
    if (process.env.NODE_ENV === 'production') {
      console.log('Production environment detected, skipping default images');
    }
    // For other environments, use defaults if available
    else if (defaultImagesMap[key]) {
      console.log(`Using default image for key: ${key} and size: ${size}`);
      return defaultImagesMap[key];
    }

    // Check cache first with extended cache duration
    const cacheKey = `key:${key}:size:${size}`;
    const cached = urlCache.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for image key: ${key}, size: ${size}`);
      return cached;
    }
    
    // Fetch the image record from the database
    const imageRecord = await fetchImageByKey(key);
    
    if (!imageRecord) {
      console.warn(`Image with key "${key}" not found`);
      // Return placeholder image
      return '/placeholder.svg';
    }
    
    // Check if the requested size exists
    if (imageRecord.sizes && typeof imageRecord.sizes === 'object') {
      const sizes = imageRecord.sizes as Record<string, string>;
      
      if (sizes[size]) {
        // Get the public URL for the sized version with enhanced caching
        const { data: urlData } = supabase.storage
          .from('website-images')
          .getPublicUrl(sizes[size], {
            // Add cache busting if needed
            // download: `${key}-${size}-${Date.now()}`
          });
        
        if (urlData.publicUrl) {
          // Cache the result with extended duration
          urlCache.set(cacheKey, urlData.publicUrl, URL_CACHE_DURATION);
          
          return urlData.publicUrl;
        }
      }
    }
    
    // Fallback to original image if size doesn't exist
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(imageRecord.storage_path, {
        // Add cache busting if needed
        // download: `${key}-${Date.now()}`
      });
    
    if (!urlData.publicUrl) {
      console.warn(`Failed to get public URL for image with key "${key}"`);
      // Return placeholder image
      return '/placeholder.svg';
    }
    
    // Cache the result with extended duration
    urlCache.set(cacheKey, urlData.publicUrl, URL_CACHE_DURATION);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Failed to get image with key "${key}" and size ${size}`, error);
    // Return placeholder image instead of throwing error
    return '/placeholder.svg';
  }
};

/**
 * Get placeholder data for an image by its key
 * @param key Unique key to identify the image
 * @returns Object containing tiny image and color placeholders
 */
export const getImagePlaceholdersByKey = async (
  key: string
): Promise<{tinyPlaceholder: string | null; colorPlaceholder: string | null}> => {
  try {
    if (!key) {
      return { tinyPlaceholder: null, colorPlaceholder: null };
    }

    // Check for cache first
    const cacheKey = `placeholder:${key}`;
    const cached = urlCache.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }
    
    // Fetch the image record from the database
    const imageRecord = await fetchImageByKey(key);
    
    if (!imageRecord || !imageRecord.metadata) {
      return { tinyPlaceholder: null, colorPlaceholder: null };
    }
    
    // Extract placeholder data if available
    const metadata = imageRecord.metadata as any;
    const tinyPlaceholder = metadata.placeholders?.tiny || null;
    const colorPlaceholder = metadata.placeholders?.color || null;
    
    // Cache the result
    const result = { tinyPlaceholder, colorPlaceholder };
    urlCache.set(cacheKey, JSON.stringify(result), URL_CACHE_DURATION);
    
    return result;
  } catch (error) {
    console.error(`Failed to get placeholders for image with key "${key}":`, error);
    return { tinyPlaceholder: null, colorPlaceholder: null };
  }
};

/**
 * Clear the URL cache
 */
export const clearImageUrlCache = (): void => {
  urlCache.clear();
  console.log('Image URL cache cleared');
};

/**
 * Clear the URL cache for a specific key
 */
export const clearImageUrlCacheForKey = (key: string): void => {
  // Clear all entries related to this key (including sized versions and placeholders)
  urlCache.invalidate(`key:${key}`);
  urlCache.invalidate(`placeholder:${key}`);
  console.log(`Image URL cache cleared for key: ${key}`);
};
