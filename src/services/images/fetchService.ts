
import { supabase } from "@/integrations/supabase/client";
import { getCdnUrl } from "@/utils/cdnUtils";
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
import { normalizeStoragePath } from "@/utils/pathUtils";

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
      return cached;
    }
    
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('key', normalizedKey)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching image with key "${normalizedKey}":`, error);
      return handleApiError(error, `Error fetching image with storage_path "${normalizedKey}"`, { silent: true }) as null;
    }
    
    if (!data) {
      console.warn(`No image found with key "${normalizedKey}"`);
    } else {
      console.log(`Found image with key "${normalizedKey}":`, data.id);
    }
    
    // Cache the result
    cacheImage(normalizedKey, data as WebsiteImage | null);
    
    // Add a computed url property to the returned object
    if (data) {
      // The WebsiteImage type doesn't have 'url' property directly, so we create a new object
      // that combines the WebsiteImage data with a url property
      
      // Use the path normalization utility to avoid duplicate bucket prefixes
      const storagePath = data.storage_path;
      
      // Normalize the storage path to avoid duplicate bucket names
      const normalizedStoragePath = normalizeStoragePath(storagePath);
      
      // Construct the URL with the normalized path, ensuring bucket name is present
      const constructedUrl = `https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/website-images/${normalizedStoragePath}`;
      const cdnUrl = getCdnUrl(constructedUrl) || constructedUrl;
      
      console.log(`[Image Service] Constructed URL for ${key}: ${cdnUrl}`);
      
      return {
        ...data,
        url: cdnUrl
      };
    }
    
    return null;
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
