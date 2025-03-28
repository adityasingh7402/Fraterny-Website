
import { supabase } from '@/integrations/supabase/client';
import { WebsiteImage } from './types';
import { handleApiError } from '@/utils/errorHandling';

// Simple in-memory cache for image URLs
const urlCache = new Map<string, {url: string, timestamp: number}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Default placeholder images for development
const DEFAULT_IMAGES: Record<string, string> = {
  'hero-background': '/images/hero/experience-hero-desktop.webp',
  'villalab-social': '/images/hero/luxury-villa-desktop.webp',
  'villalab-mentorship': '/images/hero/luxury-villa-desktop.webp',
  'villalab-brainstorm': '/images/hero/luxury-villa-desktop.webp',
  'villalab-group': '/images/hero/luxury-villa-desktop.webp',
  'villalab-networking': '/images/hero/luxury-villa-desktop.webp',
  'villalab-candid': '/images/hero/luxury-villa-desktop.webp',
  'villalab-gourmet': '/images/hero/luxury-villa-desktop.webp',
  'villalab-workshop': '/images/hero/luxury-villa-desktop.webp',
  'villalab-evening': '/images/hero/luxury-villa-desktop.webp',
};

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

    // Check if we have a default image for development
    if (DEFAULT_IMAGES[key]) {
      console.log(`Using default image for key: ${key}`);
      return DEFAULT_IMAGES[key];
    }

    // Check cache first
    const cacheKey = `key:${key}`;
    const cached = urlCache.get(cacheKey);
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
      console.warn(`Image with key "${key}" not found: ${error.message}`);
      // Return placeholder image
      return '/placeholder.svg';
    }
    
    if (!data) {
      console.warn(`Image with key "${key}" not found`);
      // Return placeholder image
      return '/placeholder.svg';
    }
    
    const imageRecord = data as WebsiteImage;
    
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
    urlCache.set(cacheKey, {
      url: urlData.publicUrl,
      timestamp: Date.now()
    });
    
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

    // Check if we have a default image for development
    if (DEFAULT_IMAGES[key]) {
      console.log(`Using default image for key: ${key} and size: ${size}`);
      return DEFAULT_IMAGES[key];
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
      console.warn(`Image with key "${key}" not found: ${error.message}`);
      // Return placeholder image
      return '/placeholder.svg';
    }
    
    if (!data) {
      console.warn(`Image with key "${key}" not found`);
      // Return placeholder image
      return '/placeholder.svg';
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
      console.warn(`Failed to get public URL for image with key "${key}"`);
      // Return placeholder image
      return '/placeholder.svg';
    }
    
    // Cache the result
    urlCache.set(cacheKey, {
      url: urlData.publicUrl,
      timestamp: Date.now()
    });
    
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Failed to get image with key "${key}" and size ${size}`, error);
    // Return placeholder image instead of throwing error
    return '/placeholder.svg';
  }
};

// Function to clear the cache if needed
export const clearImageUrlCache = (): void => {
  urlCache.clear();
  console.log('Image URL cache cleared');
};
