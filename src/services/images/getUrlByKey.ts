
import { supabase } from '@/integrations/supabase/client';
import { WebsiteImage } from './types';
import { handleApiError } from '@/utils/errorHandling';

// Simple in-memory cache for image URLs
const urlCache = new Map<string, {url: string, timestamp: number}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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

    // Check cache first
    const cached = urlCache.get(`key:${key}`);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log(`Cache hit for image key: ${key}`);
      return cached.url;
    }
    
    // Fetch the image record from the database
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error) {
      throw new Error(`Image with key "${key}" not found: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`Image with key "${key}" not found`);
    }
    
    const imageRecord = data as WebsiteImage;
    
    // Get the public URL from storage
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(imageRecord.storage_path);
    
    if (!urlData.publicUrl) {
      throw new Error(`Failed to get public URL for image with key "${key}"`);
    }
    
    // Cache the result
    urlCache.set(`key:${key}`, {
      url: urlData.publicUrl,
      timestamp: Date.now()
    });
    
    return urlData.publicUrl;
  } catch (error) {
    return handleApiError(error, `Failed to get image with key "${key}"`, true).message;
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

    // Check cache first
    const cacheKey = `key:${key}:size:${size}`;
    const cached = urlCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      console.log(`Cache hit for image key: ${key}, size: ${size}`);
      return cached.url;
    }
    
    // Fetch the image record from the database
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', key)
      .single();
    
    if (error) {
      throw new Error(`Image with key "${key}" not found: ${error.message}`);
    }
    
    if (!data) {
      throw new Error(`Image with key "${key}" not found`);
    }
    
    const imageRecord = data as WebsiteImage;
    
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
          urlCache.set(cacheKey, {
            url: urlData.publicUrl,
            timestamp: Date.now()
          });
          
          return urlData.publicUrl;
        }
      }
    }
    
    // Fallback to original image if size doesn't exist
    const { data: urlData } = supabase.storage
      .from('website-images')
      .getPublicUrl(imageRecord.storage_path);
    
    if (!urlData.publicUrl) {
      throw new Error(`Failed to get public URL for image with key "${key}"`);
    }
    
    // Cache the result
    urlCache.set(cacheKey, {
      url: urlData.publicUrl,
      timestamp: Date.now()
    });
    
    return urlData.publicUrl;
  } catch (error) {
    return handleApiError(error, `Failed to get image with key "${key}" and size ${size}`, true).message;
  }
};

// Function to clear the cache if needed
export const clearImageUrlCache = (): void => {
  urlCache.clear();
  console.log('Image URL cache cleared');
};
