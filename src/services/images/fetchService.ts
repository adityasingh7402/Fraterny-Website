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

/**
 * Fetch image metadata by key with improved caching
 */
export const fetchImageByPath = async (storage_path: string): Promise<WebsiteImage | null> => {
  try {
    if (!storage_path) {
      throw new Error('Image Storage_path is required');
    }
    
    // Normalize the key by trimming whitespace
    const normalizedKey = storage_path.trim();
    console.log(`Fetching image with normalized storage_path: "${normalizedstorage_path}"`);

    // Invalidate any URL cache for this key to ensure we get fresh data
    urlCache.invalidate(`storage_path:${normalizedstorage_path}`);

    // Check cache first
    const cached = getCachedImage(normalizedstorage_path);
    if (cached !== undefined) {
      return cached;
    }
    
    const { data, error } = await supabase
      .from('website_images')
      .select('*')
      .eq('storage_path', normalizedstorage_path)
      .maybeSingle();
    
    if (error) {
      console.error(`Error fetching image with key "${normalizedstorage_path}":`, error);
      return handleApiError(error, `Error fetching image with storage_path "${normalizedstorage_path}"`, { silent: true }) as null;
    }
    
    if (!data) {
      console.warn(`No image found with storage_path "${normalizedstorage_path}"`);
    } else {
      console.log(`Found image with storage_path "${normalizedstorage_path}":`, data.id);
    }
    
    // Cache the result
    cacheImage(normalizedstorage_path, data as WebsiteImage | null);
    
    // Add a computed url property to the returned object
    if (data) {
      // The WebsiteImage type doesn't have 'url' property directly, so we create a new object
      // that combines the WebsiteImage data with a url property
      return {
        ...data,
        // Use CDN URL if available
        url: getCdnUrl(`https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/website-images/${data.storage_path}`) || 
             `https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/website-images/${data.storage_path}`
      };
    }
    
    return null;
  } catch (error) {
    return handleApiError(error, `Unexpected error in fetchImageByPath for storage_path "${storage_path}"`, { silent: true }) as null;
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
