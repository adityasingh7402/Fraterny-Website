
import { supabase } from "@/integrations/supabase/client";
import { WebsiteImage } from "./types";
import { handleApiError } from "@/utils/errorHandling";
import { urlCache } from "./cacheService";
import { 
  getCachedImage, 
  cacheImage, 
  clearImageCache, 
  invalidateImageCache 
} from "./utils/cacheUtils";
import {
  createImagesQuery,
  applySearchFilter,
  applyPagination,
  processQueryResponse
} from "./utils/queryUtils";

/**
 * Fetch image metadata by key with improved caching
 */
export const fetchImageByKey = async (key: string): Promise<WebsiteImage | null> => {
  try {
    if (!key) {
      throw new Error('Image Key is required');
    }
    
    // Normalize the key by trimming whitespace
    const normalizedKey = key.trim();
    console.log(`Fetching image with normalized key: "${normalizedKey}"`);

    // Invalidate any URL cache for this key to ensure we get fresh data
    urlCache.invalidate(`key:${normalizedKey}`);

    // Check cache first
    const cached = getCachedImage(normalizedKey);
    if (cached !== undefined) {
      // Add a URL property if it doesn't exist
      if (cached && !cached.url) {
        // CRITICAL FIX: Use key directly to generate URL
        const { data } = await supabase.storage
          .from('website-images')
          .getPublicUrl(cached.key);
          
        cached.url = data.publicUrl;
      }
      return cached;
    }
    
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching image with key "${normalizedKey}":`, error);
      return handleApiError(error, `Error fetching image with key "${normalizedKey}"`, { silent: true }) as null;
    }
    
    if (!data) {
      console.warn(`No image found with key "${normalizedKey}"`);
      return null;
    } else {
      console.log(`Found image with key "${normalizedKey}":`, data.id);
    }
    
    // Add a computed url property to the returned object
    let result = data as WebsiteImage;
    
    // CRITICAL FIX: Use key instead of storage_path
    // Get the direct URL from Supabase
    const { data: urlData } = await supabase.storage
      .from('website-images')
      .getPublicUrl(data.key);
      
    // Set the URL property
    result.url = urlData.publicUrl;
    
    // Get WebP URL if the browser supports it
    const supportsWebP = true; // Modern browsers all support WebP
    
    if (supportsWebP && 
        (result.url.endsWith('.jpg') || 
         result.url.endsWith('.jpeg') || 
         result.url.endsWith('.png'))) {
      // For WebP support, try to get the WebP version if it exists
      const webpKey = data.key.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      const { data: webpData } = await supabase.storage
        .from('website-images')
        .getPublicUrl(webpKey);
        
      // Only use WebP if it exists (check URL is not empty)
      if (webpData && webpData.publicUrl) {
        // Verify WebP file exists before using it
        try {
          const checkResponse = await fetch(webpData.publicUrl, { 
            method: 'HEAD',
            cache: 'no-cache' 
          });
          if (checkResponse.ok) {
            result.url = webpData.publicUrl;
          }
        } catch (error) {
          console.warn(`WebP version check failed for ${webpKey}:`, error);
          // Continue with original URL
        }
      }
    }
    
    // Cache the result
    cacheImage(normalizedKey, result);
    
    return result;
  } catch (error) {
    return handleApiError(error, `Unexpected error in fetchImageByKey for key "${key}"`, { silent: true }) as null;
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
    let query = createImagesQuery();
    
    // Add search functionality if search term is provided
    query = applySearchFilter(query, searchTerm);
    
    // Add pagination
    const { data, error, count } = await applyPagination(query, page, pageSize);
    
    return processQueryResponse(data, error, count, 'Error fetching images');
  } catch (error) {
    handleApiError(error, 'Unexpected error in fetchAllImages', { silent: true });
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
    let query = createImagesQuery().eq('category', category);
    
    // Add search functionality if search term is provided
    query = applySearchFilter(query, searchTerm);
    
    // Add pagination
    const { data, error, count } = await applyPagination(query, page, pageSize);
    
    return processQueryResponse(
      data, 
      error, 
      count, 
      `Error fetching images by category "${category}"`
    );
  } catch (error) {
    handleApiError(error, `Unexpected error in fetchImagesByCategory for category "${category}"`, { silent: true });
    return { images: [], total: 0 };
  }
};

// Re-export cache management functions from cacheUtils
export { clearImageCache, invalidateImageCache };
