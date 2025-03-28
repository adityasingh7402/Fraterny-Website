
import { supabase } from '@/integrations/supabase/client';
import { WebsiteImage } from './types';
import { urlCache } from './cacheService';
import { fetchImageByKey } from './fetchService';
import { defaultImagesMap } from './constants';

/**
 * Get the URL of an image by its key with caching
 * @param key Unique key to identify the image
 * @returns URL of the image
 */
export const getImageUrlByKey = async (key: string): Promise<string> => {
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
      console.log(`Using default image for key: ${key}`);
      return defaultImagesMap[key];
    }

    // Check cache first
    const cacheKey = `key:${key}`;
    const cached = urlCache.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for image key: ${key}`);
      return cached;
    }
    
    // Fetch the image record from the database
    const imageRecord = await fetchImageByKey(key);
    
    if (!imageRecord) {
      console.warn(`Image with key "${key}" not found`);
      // Return placeholder image
      return '/placeholder.svg';
    }
    
    // Get the public URL from storage
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(imageRecord.storage_path);
    
    if (!urlData.publicUrl) {
      console.warn(`Failed to get public URL for image with key "${key}"`);
      // Return placeholder image
      return '/placeholder.svg';
    }
    
    // Cache the result
    urlCache.set(cacheKey, urlData.publicUrl);
    
    // Add console log for debugging
    console.log(`Retrieved image URL for key "${key}":`, urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Failed to get image with key "${key}"`, error);
    // Return placeholder image instead of throwing error
    return '/placeholder.svg';
  }
};

/**
 * Get the URL of an image by its key and size with caching
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

    // Check cache first
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
        // Get the public URL for the sized version
        const { data: urlData } = supabase.storage
          .from('website-images')
          .getPublicUrl(sizes[size]);
        
        if (urlData.publicUrl) {
          // Cache the result
          urlCache.set(cacheKey, urlData.publicUrl);
          
          return urlData.publicUrl;
        }
      }
    }
    
    // Fallback to original image if size doesn't exist
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(imageRecord.storage_path);
    
    if (!urlData.publicUrl) {
      console.warn(`Failed to get public URL for image with key "${key}"`);
      // Return placeholder image
      return '/placeholder.svg';
    }
    
    // Cache the result
    urlCache.set(cacheKey, urlData.publicUrl);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Failed to get image with key "${key}" and size ${size}`, error);
    // Return placeholder image instead of throwing error
    return '/placeholder.svg';
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
  // Clear all entries related to this key (including sized versions)
  urlCache.invalidate(`key:${key}`);
  console.log(`Image URL cache cleared for key: ${key}`);
};
