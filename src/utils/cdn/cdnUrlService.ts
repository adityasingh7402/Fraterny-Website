
/**
 * CDN URL Service Module - DEPRECATED
 * This file is kept for backward compatibility but all functionality
 * now redirects to direct Supabase URLs
 */

import { normalizeStoragePath, storagePathToCdnPath } from '@/utils/pathUtils';
import { localStorageCacheService } from '@/services/images/cache/localStorageCacheService';

// All CDN functionality is deprecated in favor of direct Supabase integration
const SUPABASE_URL = 'https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/';

/**
 * Check if CDN should be used - now always returns false as CDN is deprecated
 */
export const shouldUseCdn = async (): Promise<boolean> => {
  return false;
};

/**
 * Synchronous version - now always returns false as CDN is deprecated
 */
export const isCdnEnabled = (): boolean => {
  return false;
};

/**
 * Parse a Supabase URL to extract bucket and path information
 * Still functional but maintained only for backward compatibility
 */
export const parseSupabaseUrl = (url: string): { bucket: string; path: string } | null => {
  // Match Supabase storage URLs
  const supabasePattern = /\/storage\/v1\/object\/public\/([^\/]+)(\/.*)/;
  const matches = url.match(supabasePattern);
  
  if (matches && matches[1] && matches[2]) {
    return {
      bucket: matches[1],
      path: matches[2].startsWith('/') ? matches[2].substring(1) : matches[2]
    };
  }
  
  return null;
};

/**
 * Converts any image path to a direct Supabase URL
 * This function maintains backward compatibility but now always returns direct Supabase URLs
 */
export const getCdnUrl = (
  imagePath: string | null | undefined
): string | null => {
  if (!imagePath) return null;
  
  // Don't process data URLs
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Special handling for placeholder.svg - always use local version
  if (imagePath.includes('placeholder.svg')) {
    return imagePath;
  }
  
  // Generate a cache key for this URL transformation
  const cacheKey = `cdn-url:${imagePath}`;
  
  // Try to get from localStorage cache first
  try {
    if (localStorageCacheService.isValid()) {
      const cachedUrl = localStorageCacheService.getUrl(cacheKey);
      if (cachedUrl) {
        return cachedUrl;
      }
    }
  } catch (err) {
    console.warn('Failed to check localStorage cache:', err);
  }
  
  // Handle absolute URLs (including Supabase storage URLs)
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Handle relative paths (local assets)
  // Ensure path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // For image paths, convert to Supabase URL
  if (normalizedPath.startsWith('/images/') || normalizedPath.startsWith('/website-images/')) {
    // Format for Supabase URL
    const pathWithoutLeadingSlash = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
    const supabasePath = storagePathToCdnPath(pathWithoutLeadingSlash);
    const transformedUrl = `${SUPABASE_URL}${supabasePath}`;
    
    // Cache the URL for future use
    try {
      if (localStorageCacheService.isValid()) {
        localStorageCacheService.setUrl(cacheKey, transformedUrl, 4);
      }
    } catch (err) {
      console.warn('Failed to cache URL in localStorage:', err);
    }
    
    return transformedUrl;
  }
  
  // For other asset types (CSS, JS, etc.), just use the local path
  return normalizedPath;
};

// For compatibility with existing code
export const getCdnBaseUrl = () => SUPABASE_URL;
export const resetCdnEnabledCache = () => {};
export const setCdnEnabled = () => {};
