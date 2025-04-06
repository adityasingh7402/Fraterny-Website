/**
 * Centralized Image Service
 * Handles image URL generation, caching, and optimization
 */
import { supabase } from "@/integrations/supabase/client";
import { Cache } from "./cache/Cache";
import { STORAGE_BUCKET_NAME, CACHE_DURATIONS, CACHE_PRIORITIES } from "./constants";
import { WebsiteImage } from "./types";

// Create cache instances
const imageCache = new Cache<WebsiteImage>("imageCache", CACHE_DURATIONS.MEDIUM);
const urlCache = new Cache<string>("urlCache", CACHE_DURATIONS.SHORT);

/**
 * Validate image key format
 */
export const isValidImageKey = (key: string | null | undefined): boolean => {
  if (!key || typeof key !== 'string' || key.trim() === '') {
    return false;
  }
  
  return true;
};

/**
 * Get image URL from Supabase Storage
 */
export const getImageUrl = async (key: string | undefined): Promise<string> => {
  // Early validation
  if (!key || !isValidImageKey(key)) {
    console.warn(`Invalid image key provided: "${key}"`);
    return '/placeholder.svg';
  }
  
  const normalizedKey = key.trim();
  const cacheKey = `url:${normalizedKey}`;
  
  // Check cache first
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }
  
  try {
    // Get image record from database
    const { data: imageRecord, error } = await supabase
      .from('website_images')
      .select('id, key, storage_path')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    if (error) {
      console.error(`Database error for key "${normalizedKey}":`, error);
      return '/placeholder.svg';
    }
    
    if (!imageRecord) {
      console.warn(`No image found with key "${normalizedKey}" in database`);
      return '/placeholder.svg';
    }
    
    // Use the storage_path if available, otherwise use the key
    const storagePath = imageRecord.storage_path || imageRecord.key;
    
    // Get the URL from Supabase Storage
    const { data: urlData } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(storagePath);
    
    if (!urlData || !urlData.publicUrl) {
      console.error(`Failed to generate URL for "${normalizedKey}"`);
      return '/placeholder.svg';
    }
    
    // Add cache busting parameter
    const timestamp = Date.now();
    const url = new URL(urlData.publicUrl);
    url.searchParams.set('v', timestamp.toString());
    const finalUrl = url.toString();
    
    // Cache the URL
    urlCache.set(cacheKey, finalUrl, {
      ttl: CACHE_DURATIONS.SHORT,
      priority: CACHE_PRIORITIES.NORMAL
    });
    
    return finalUrl;
  } catch (error) {
    console.error(`Error getting URL for image "${normalizedKey}":`, error);
    return '/placeholder.svg';
  }
};

/**
 * Alias for getImageUrl to maintain compatibility with various components
 */
export const getImageUrlByKey = getImageUrl;

/**
 * Get a specific size variant of an image
 */
export const getImageUrlBySize = async (
  key: string,
  size: 'small' | 'medium' | 'large'
): Promise<string> => {
  if (!isValidImageKey(key)) {
    return '/placeholder.svg';
  }
  
  const normalizedKey = key.trim();
  const cacheKey = `url:${normalizedKey}:${size}`;
  
  // Check cache first
  const cachedUrl = urlCache.get(cacheKey);
  if (cachedUrl) {
    return cachedUrl;
  }
  
  try {
    // Get image record from database
    const { data: imageRecord, error } = await supabase
      .from('website_images')
      .select('key, storage_path, sizes')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    if (error || !imageRecord) {
      console.error(`Failed to find image "${normalizedKey}":`, error || 'No record found');
      return '/placeholder.svg';
    }
    
    // Check if we have a pre-generated size in the sizes JSON field
    if (imageRecord.sizes && typeof imageRecord.sizes === 'object' && imageRecord.sizes[size]) {
      const sizePath = imageRecord.sizes[size] as string;
      
      // Get the URL from Supabase Storage
      const { data: urlData } = await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .getPublicUrl(sizePath);
        
      if (urlData?.publicUrl) {
        // Add cache busting
        const url = new URL(urlData.publicUrl);
        url.searchParams.set('v', Date.now().toString());
        const finalUrl = url.toString();
        
        // Cache the sized URL
        urlCache.set(cacheKey, finalUrl, {
          ttl: CACHE_DURATIONS.SHORT,
          priority: CACHE_PRIORITIES.NORMAL
        });
        
        return finalUrl;
      }
    }
    
    // If no sized version, fall back to original
    return getImageUrl(normalizedKey);
  } catch (error) {
    console.error(`Error getting sized URL for "${key}":`, error);
    return getImageUrl(normalizedKey); // Fall back to original
  }
};

/**
 * Alias for getImageUrlBySize to maintain compatibility with various components
 */
export const getImageUrlByKeyAndSize = getImageUrlBySize;

/**
 * Get multiple image URLs in one batch
 */
export const getMultipleImageUrls = async (
  keys: string[] | undefined
): Promise<Record<string, string>> => {
  if (!keys || !Array.isArray(keys) || keys.length === 0) {
    return {};
  }
  
  // Filter valid keys
  const validKeys = keys
    .filter(Boolean)
    .filter(isValidImageKey)
    .map(key => key.trim());
    
  if (validKeys.length === 0) {
    return {};
  }
  
  // Process in parallel for efficiency
  const results = await Promise.all(
    validKeys.map(async (key) => {
      const url = await getImageUrl(key);
      return { key, url };
    })
  );
  
  // Convert to record format
  return results.reduce((acc, { key, url }) => {
    acc[key] = url;
    return acc;
  }, {} as Record<string, string>);
};

/**
 * Alias for getMultipleImageUrls to maintain compatibility
 */
export const batchGetImageUrls = getMultipleImageUrls;

/**
 * Another alias for getMultipleImageUrls for specific components
 */
export const getImageUrlBatched = async (key: string): Promise<string> => {
  const result = await getMultipleImageUrls([key]);
  return result[key] || '/placeholder.svg';
};

/**
 * Get image placeholder data for progressive loading
 */
export const getImagePlaceholdersByKey = async (key: string): Promise<{
  tinyPlaceholder: string | null;
  colorPlaceholder: string | null;
}> => {
  if (!isValidImageKey(key)) {
    return { tinyPlaceholder: null, colorPlaceholder: null };
  }
  
  const normalizedKey = key.trim();
  const cacheKey = `placeholder:${normalizedKey}`;
  
  // Check cache first
  const cachedPlaceholder = urlCache.get(cacheKey);
  if (cachedPlaceholder) {
    try {
      return JSON.parse(cachedPlaceholder);
    } catch (e) {
      console.warn(`Invalid placeholder cache for "${normalizedKey}"`);
    }
  }
  
  try {
    // Get image record from database
    const { data: imageRecord, error } = await supabase
      .from('website_images')
      .select('metadata')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    if (error || !imageRecord) {
      console.warn(`No placeholders for "${normalizedKey}":`, error || 'No record found');
      return { tinyPlaceholder: null, colorPlaceholder: null };
    }
    
    // Extract placeholders from metadata
    const metadata = imageRecord.metadata || {};
    const placeholders = typeof metadata === 'object' && metadata !== null ? 
      (metadata as any).placeholders || {} : {};
    
    const result = {
      tinyPlaceholder: placeholders.tiny || null,
      colorPlaceholder: placeholders.color || null
    };
    
    // Cache the placeholders
    urlCache.set(cacheKey, JSON.stringify(result), {
      ttl: CACHE_DURATIONS.LONG,
      priority: CACHE_PRIORITIES.NORMAL
    });
    
    return result;
  } catch (error) {
    console.error(`Error getting placeholders for "${normalizedKey}":`, error);
    return { tinyPlaceholder: null, colorPlaceholder: null };
  }
};

/**
 * Get global cache version for coordinating cache invalidation
 */
export const getGlobalCacheVersion = async (): Promise<string | null> => {
  try {
    const cacheKey = 'global:cache:version';
    
    // Check cache first
    const cachedVersion = urlCache.get(cacheKey);
    if (cachedVersion) {
      return cachedVersion;
    }
    
    // Get from database
    const { data, error } = await supabase
      .from('website_settings')
      .select('value')
      .eq('key', 'image_cache_version')
      .maybeSingle();
      
    if (error || !data) {
      console.warn('Failed to get global cache version:', error || 'No data');
      return null;
    }
    
    const version = data.value as string;
    
    // Cache it
    urlCache.set(cacheKey, version, {
      ttl: CACHE_DURATIONS.SHORT,
      priority: CACHE_PRIORITIES.CRITICAL
    });
    
    return version;
  } catch (error) {
    console.error('Error getting global cache version:', error);
    return null;
  }
};

/**
 * Update global cache version to trigger cache invalidation
 */
export const updateGlobalCacheVersion = async (options?: {
  scope?: 'global' | 'prefix' | 'key';
  target?: string;
}): Promise<boolean> => {
  try {
    const newVersion = Date.now().toString();
    
    // Update database
    const { error } = await supabase
      .from('website_settings')
      .upsert({
        key: 'image_cache_version',
        value: newVersion,
        scope: options?.scope || 'global',
        target: options?.target || null
      });
      
    if (error) {
      console.error('Failed to update global cache version:', error);
      return false;
    }
    
    // Clear local cache
    urlCache.set('global:cache:version', newVersion, {
      ttl: CACHE_DURATIONS.SHORT,
      priority: CACHE_PRIORITIES.CRITICAL
    });
    
    return true;
  } catch (error) {
    console.error('Error updating global cache version:', error);
    return false;
  }
};

/**
 * Get full image metadata by key
 */
export const getImageMetadata = async (key: string): Promise<WebsiteImage | null> => {
  if (!isValidImageKey(key)) {
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
    
    // Add URL to the image object and fix type issues
    const imageWithUrl: WebsiteImage = {
      ...image,
      sizes: image.sizes as Record<string, string> | null,
      metadata: image.metadata as Record<string, any> | null,
      url: await getImageUrl(normalizedKey)
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
 * Fetch image by key - for React Query compatibility
 */
export const fetchImageByKey = getImageMetadata;

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
      (data || []).map(async (image) => ({
        ...image,
        sizes: image.sizes as Record<string, string> | null,
        metadata: image.metadata as Record<string, any> | null,
        url: await getImageUrl(image.key)
      }))
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
      (data || []).map(async (image) => ({
        ...image,
        sizes: image.sizes as Record<string, string> | null,
        metadata: image.metadata as Record<string, any> | null,
        url: await getImageUrl(image.key)
      }))
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
 * Clear URL cache for a specific key
 */
export const clearImageUrlCacheForKey = (key: string): void => {
  if (!isValidImageKey(key)) {
    return;
  }
  
  const normalizedKey = key.trim();
  urlCache.delete(`url:${normalizedKey}`);
  urlCache.delete(`url:${normalizedKey}:small`);
  urlCache.delete(`url:${normalizedKey}:medium`);
  urlCache.delete(`url:${normalizedKey}:large`);
  urlCache.delete(`placeholder:${normalizedKey}`);
};

/**
 * Clear URL cache to force fresh URL generation
 */
export const clearImageUrlCache = (key?: string): void => {
  if (key) {
    clearImageUrlCacheForKey(key);
  } else {
    // Clear all URL cache
    urlCache.clear();
  }
};

/**
 * Clear image metadata cache
 */
export const clearImageCache = (key?: string): void => {
  if (key) {
    // Clear specific key
    const normalizedKey = key.trim();
    imageCache.delete(`image:${normalizedKey}`);
    // Also clear URL cache
    clearImageUrlCacheForKey(normalizedKey);
  } else {
    // Clear all image cache
    imageCache.clear();
    // Also clear URL cache
    urlCache.clear();
  }
};

/**
 * Upload a new image to storage and database
 */
export const uploadImage = async (
  file: File,
  key: string,
  description: string,
  altText: string,
  category?: string
): Promise<WebsiteImage | null> => {
  if (!isValidImageKey(key)) {
    console.error(`Invalid image key for upload: "${key}"`);
    return null;
  }
  
  const normalizedKey = key.trim();
  
  try {
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .upload(normalizedKey, file, {
        cacheControl: '31536000', // 1 year
        upsert: true
      });
      
    if (uploadError) {
      console.error(`Error uploading file for key "${normalizedKey}":`, uploadError);
      return null;
    }
    
    const storagePath = uploadData?.path || normalizedKey;
    
    // Get dimensions from file (if it's an image)
    let width = null;
    let height = null;
    
    if (file.type.startsWith('image/')) {
      try {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        await new Promise<void>((resolve) => {
          img.onload = () => {
            width = img.width;
            height = img.height;
            URL.revokeObjectURL(img.src);
            resolve();
          };
        });
      } catch (e) {
        console.warn(`Could not get dimensions for image "${normalizedKey}":`, e);
      }
    }
    
    // Create database record
    const { data: dbData, error: dbError } = await supabase
      .from('website_images')
      .insert({
        key: normalizedKey,
        description,
        storage_path: storagePath,
        alt_text: altText,
        category: category || null,
        width,
        height,
        sizes: {}
      })
      .select()
      .single();
      
    if (dbError) {
      console.error(`Error creating database record for "${normalizedKey}":`, dbError);
      // Clean up the uploaded file
      await supabase.storage
        .from(STORAGE_BUCKET_NAME)
        .remove([storagePath]);
      return null;
    }
    
    // Get the public URL
    const { data: urlData } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .getPublicUrl(storagePath);
      
    // Format the result with proper type casting
    const result: WebsiteImage = {
      ...dbData,
      sizes: dbData.sizes as Record<string, string> | null,
      metadata: dbData.metadata as Record<string, any> | null,
      url: urlData?.publicUrl || null
    };
    
    // Clear any existing cache for this key
    clearImageCache(normalizedKey);
    
    return result;
  } catch (error) {
    console.error(`Unexpected error in uploadImage for key "${normalizedKey}":`, error);
    return null;
  }
};

/**
 * Update an existing image record
 */
export const updateImage = async (
  id: string,
  updates: Partial<WebsiteImage>
): Promise<WebsiteImage | null> => {
  try {
    // Update database record
    const { data, error } = await supabase
      .from('website_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error(`Error updating image with id "${id}":`, error);
      return null;
    }
    
    // Clear cache for this image
    if (data.key) {
      clearImageCache(data.key);
    }
    
    // Get the URL and fix type issues
    const url = data.key ? await getImageUrl(data.key) : null;
    
    return { 
      ...data,
      sizes: data.sizes as Record<string, string> | null,
      metadata: data.metadata as Record<string, any> | null,
      url 
    } as WebsiteImage;
  } catch (error) {
    console.error(`Unexpected error in updateImage for id "${id}":`, error);
    return null;
  }
};

/**
 * Delete an image from storage and database
 */
export const deleteImage = async (key: string): Promise<boolean> => {
  if (!isValidImageKey(key)) {
    return false;
  }
  
  const normalizedKey = key.trim();
  
  try {
    // Get the image record to find storage path and sizes
    const { data: image, error: getError } = await supabase
      .from('website_images')
      .select('storage_path, sizes')
      .eq('key', normalizedKey)
      .maybeSingle();
      
    if (getError || !image) {
      console.error(`Error getting image "${normalizedKey}" for deletion:`, getError || 'Not found');
      return false;
    }
    
    // Prepare list of paths to delete
    const pathsToDelete = [image.storage_path];
    
    // Add any size variants
    if (image.sizes && typeof image.sizes === 'object') {
      Object.values(image.sizes).forEach(path => {
        if (typeof path === 'string' && path) {
          pathsToDelete.push(path);
        }
      });
    }
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET_NAME)
      .remove(pathsToDelete);
      
    if (storageError) {
      console.error(`Error deleting storage files for "${normalizedKey}":`, storageError);
      // Continue with database deletion even if storage deletion fails
    }
    
    // Delete database record
    const { error: dbError } = await supabase
      .from('website_images')
      .delete()
      .eq('key', normalizedKey);
      
    if (dbError) {
      console.error(`Error deleting database record for "${normalizedKey}":`, dbError);
      return false;
    }
    
    // Clear cache
    clearImageCache(normalizedKey);
    
    return true;
  } catch (error) {
    console.error(`Unexpected error in deleteImage for key "${normalizedKey}":`, error);
    return false;
  }
};

// Export cache instances for direct access if needed
export { imageCache, urlCache };
