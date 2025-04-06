
/**
 * Direct Supabase image utilities
 * 
 * This module replaces the old CDN utilities. It provides simple functions
 * for working with images stored in Supabase.
 */

import { constructSupabaseUrl, storagePathToUrlPath } from './pathUtils';

/**
 * Convert any URL to use Supabase storage if it's a relative path
 * This simplifies the transition from the old CDN architecture
 */
export const getImageUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;
  
  // Don't process data URLs or absolute URLs
  if (url.startsWith('data:') || url.startsWith('http')) {
    return url;
  }
  
  // Handle relative paths - ensure path starts with / for consistent processing
  const normalizedPath = url.startsWith('/') ? url : `/${url}`;
  
  // For image paths, convert to Supabase URL
  if (normalizedPath.startsWith('/images/') || 
      normalizedPath.startsWith('/website-images/')) {
    // Format for Supabase URL - remove leading slash for storage path
    const pathWithoutLeadingSlash = normalizedPath.startsWith('/') ? 
      normalizedPath.substring(1) : normalizedPath;
    
    return constructSupabaseUrl(pathWithoutLeadingSlash);
  }
  
  // For other asset types (CSS, JS, etc.), just use the local path
  return normalizedPath;
};

/**
 * Legacy compatibility functions - these do nothing now but maintain API compatibility
 */
export const isCdnEnabled = (): boolean => false;
export const setCdnEnabled = (_enabled: boolean): void => {};
export const parseSupabaseUrl = (url: string): string | null => null;
export const getCdnUrl = getImageUrl;
