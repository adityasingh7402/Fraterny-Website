
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
 * Converts a local image path to a CDN URL
 * @param imagePath - The path to the image (e.g., /images/hero/image.webp)
 * @param forceCdn - Override settings and force CDN usage (optional)
 * @returns The CDN URL or original path based on environment
 */
export const getCdnUrl = (
  imagePath: string | null | undefined, 
  forceCdn?: boolean
): string | null => {
  if (!imagePath) return null;
  
  // Don't process already absolute URLs (including data URLs)
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    // If the URL is already pointing to Supabase, route it through the CDN
    if (imagePath.includes('supabase.co/storage/v1/object/public')) {
      // Extract the path part after "public" to send to our CDN
      const publicPathMatch = imagePath.match(/\/public(\/.*)/);
      if (publicPathMatch && publicPathMatch[1]) {
        const pathForCdn = publicPathMatch[1];
        // Check if this path should bypass the CDN
        if (!forceCdn && shouldExcludePath(pathForCdn)) {
          console.log(`[CDN] Bypassing CDN for excluded Supabase path: ${pathForCdn}`);
          return imagePath;
        }
        
        // Include query parameters in the CDN URL
        const urlObj = new URL(imagePath);
        const queryString = urlObj.search;
        
        // Use CDN if enabled
        const useCdn = forceCdn || shouldUseCdn();
        return useCdn ? `${CDN_URL}${pathForCdn}${queryString}` : imagePath;
      }
    }
    return imagePath;
  }

  // Special handling for placeholder.svg - always use CDN version
  if (imagePath.includes('placeholder.svg')) {
    const useCdn = forceCdn || shouldUseCdn();
    return useCdn ? `${CDN_URL}/placeholder.svg` : imagePath;
  }
  
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
