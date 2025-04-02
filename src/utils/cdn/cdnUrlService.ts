/**
 * CDN URL Service Module
 * Handles transforming URLs for CDN usage
 */

import { CDN_URL } from './cdnConfig';
import { shouldExcludePath } from './cdnExclusions';
import { CDN_STORAGE_KEY } from './cdnConfig';

/**
 * Check if CDN should be used
 * - In production: Always use CDN unless disabled via localStorage
 * - In development: Use CDN only if explicitly enabled via localStorage
 */
export const shouldUseCdn = (): boolean => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production';
  }
  
  // In production, default to true unless explicitly disabled
  if (process.env.NODE_ENV === 'production') {
    return localStorage.getItem('disable_cdn_production') !== 'true';
  }
  
  // In development, check localStorage preference
  return localStorage.getItem(CDN_STORAGE_KEY) === 'true';
};

/**
 * Parse a Supabase URL to extract bucket and path information
 * @param url - The Supabase URL to parse
 * @returns Extracted bucket and path, or null if not a valid Supabase URL
 */
export const parseSupabaseUrl = (url: string): { bucket: string; path: string } | null => {
  // Match Supabase storage URLs
  const supabasePattern = /\/storage\/v1\/object\/public\/([^\/]+)(\/.*)/;
  const matches = url.match(supabasePattern);
  
  if (matches && matches[1] && matches[2]) {
    return {
      bucket: matches[1],
      path: matches[2]
    };
  }
  
  return null;
};

/**
 * Converts a local image path to a CDN URL
 * @param imagePath - The path to the image (e.g., /images/hero/image.webp or Supabase URL)
 * @param forceCdn - Override settings and force CDN usage (optional)
 * @returns The CDN URL or original path based on environment
 */
export const getCdnUrl = (
  imagePath: string | null | undefined, 
  forceCdn?: boolean
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
  
  // Handle absolute URLs (including Supabase storage URLs)
  if (imagePath.startsWith('http')) {
    // Check if this is a Supabase storage URL
    const parsedSupabaseUrl = parseSupabaseUrl(imagePath);
    
    if (parsedSupabaseUrl) {
      const { bucket, path } = parsedSupabaseUrl;
      const cdnPath = `/${bucket}${path}`;
      
      // Check if this path should bypass the CDN
      if (!forceCdn && shouldExcludePath(cdnPath)) {
        console.log(`[CDN] Bypassing CDN for excluded Supabase path: ${cdnPath}`);
        return imagePath;
      }
      
      // Extract and preserve query parameters
      const urlObj = new URL(imagePath);
      const queryString = urlObj.search;
      
      // Use CDN if enabled
      const useCdn = forceCdn || shouldUseCdn();
      return useCdn ? `${CDN_URL}${cdnPath}${queryString}` : imagePath;
    }
    
    // Not a Supabase URL, return unchanged
    return imagePath;
  }

  // Handle relative paths (local assets)
  
  // Ensure path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Check if this path should bypass the CDN
  if (!forceCdn && shouldExcludePath(normalizedPath)) {
    console.log(`[CDN] Bypassing CDN for excluded path: ${normalizedPath}`);
    return normalizedPath;
  }
  
  // Use CDN if enabled (production or manually in development)
  const useCdn = forceCdn || shouldUseCdn();
  
  return useCdn ? `${CDN_URL}${normalizedPath}` : normalizedPath;
};

// Export the CDN URL for other components to use
export const getCdnBaseUrl = () => CDN_URL;

// Export function to check if CDN is enabled
export const isCdnEnabled = () => shouldUseCdn();
