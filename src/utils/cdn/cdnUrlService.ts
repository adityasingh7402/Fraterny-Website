
/**
 * CDN URL Service Module
 * Handles transforming URLs for CDN usage
 * Enhanced with localStorage cache support
 */

import { CDN_URL } from './cdnConfig';
import { shouldExcludePath } from './cdnExclusions';
import { CDN_STORAGE_KEY } from './cdnConfig';
import { localStorageCacheService } from '@/services/images/cache/localStorageCacheService';
import { isCdnAvailabilityCacheValid, getCdnAvailability } from './cdnNetwork';
import { normalizeStoragePath, constructCdnPath } from '@/utils/pathUtils';

// Add a debug mode flag - will output helpful console logs
const DEBUG_CDN = process.env.NODE_ENV === 'development';

// Cache CDN availability in memory to avoid constant checks
let cdnEnabledCache: { enabled: boolean; timestamp: number } | null = null;
const CDN_CACHE_DURATION = 60000; // 1 minute

/**
 * Check if CDN should be used
 * - In production: Always use CDN unless disabled via localStorage
 * - In development: Use CDN only if explicitly enabled via localStorage
 * @param forceCdn Override all settings and force CDN usage
 */
export const shouldUseCdn = async (forceCdn?: boolean): Promise<boolean> => {
  // Force CDN if requested
  if (forceCdn) {
    return true;
  }
  
  // Check if we have a recent cache
  if (cdnEnabledCache && (Date.now() - cdnEnabledCache.timestamp < CDN_CACHE_DURATION)) {
    return cdnEnabledCache.enabled;
  }
  
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production';
  }
  
  // In production, default to true unless explicitly disabled
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Get user preference from localStorage
  let isEnabled = false;
  if (isProduction) {
    isEnabled = localStorage.getItem('disable_cdn_production') !== 'true';
  } else {
    // In development, initialize to true if not set
    if (localStorage.getItem(CDN_STORAGE_KEY) === null) {
      if (DEBUG_CDN) console.log('[CDN] First run detected, enabling CDN in development');
      localStorage.setItem(CDN_STORAGE_KEY, 'true');
      isEnabled = true;
    } else {
      isEnabled = localStorage.getItem(CDN_STORAGE_KEY) === 'true';
    }
  }
  
  // Check availability only if enabled by settings
  if (isEnabled) {
    try {
      const isAvailable = await getCdnAvailability();
      if (!isAvailable) {
        if (DEBUG_CDN) console.warn('[CDN] CDN is unavailable, falling back to direct URLs');
        isEnabled = false;
      }
    } catch (error) {
      console.error('[CDN] Error checking availability:', error);
      isEnabled = false;
    }
  }
  
  // Cache the result
  cdnEnabledCache = {
    enabled: isEnabled,
    timestamp: Date.now()
  };
  
  if (DEBUG_CDN) {
    console.log(`[CDN] ${isProduction ? 'Production' : 'Development'} mode CDN is ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
  }
  
  return isEnabled;
};

// Synchronous version for when async is not possible
export const isCdnEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production';
  }
  
  // Use cached result if available
  if (cdnEnabledCache && (Date.now() - cdnEnabledCache.timestamp < CDN_CACHE_DURATION)) {
    return cdnEnabledCache.enabled;
  }
  
  // Otherwise, just check localStorage without availability test
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    return localStorage.getItem('disable_cdn_production') !== 'true';
  } else {
    // In development, use the value from localStorage
    return localStorage.getItem(CDN_STORAGE_KEY) === 'true';
  }
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
      path: matches[2].startsWith('/') ? matches[2].substring(1) : matches[2]
    };
  }
  
  return null;
};

/**
 * Converts a local image path to a CDN URL with localStorage caching
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
  
  // Generate a cache key for this URL transformation
  const cacheKey = `cdn-url:${imagePath}:${forceCdn ? 'forced' : 'auto'}`;
  
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
  
  // If not in cache, proceed with normal URL transformation
  let transformedUrl: string | null = null;
  
  // Check if CDN is enabled
  const useCdn = forceCdn || isCdnEnabled();
  
  // Handle absolute URLs (including Supabase storage URLs)
  if (imagePath.startsWith('http')) {
    // Check if it's a Supabase URL
    const parsedSupabaseUrl = parseSupabaseUrl(imagePath);
    
    if (parsedSupabaseUrl) {
      const { bucket, path } = parsedSupabaseUrl;
      
      // Use our path normalization utility to handle duplicates and ensure proper formatting
      let normalizedPath = path;
      if (bucket === 'website-images') {
        // If this is our main bucket, use the specialized normalization
        normalizedPath = normalizeStoragePath(`${path}`);
        
        // Ensure proper prefix format for CDN
        const cdnPath = constructCdnPath(normalizedPath);
        
        if (DEBUG_CDN) {
          console.log(`[CDN] Parsed Supabase URL:`, {
            bucket,
            path,
            normalizedPath,
            cdnPath
          });
        }
        
        // Check if this path should bypass the CDN
        if (!forceCdn && shouldExcludePath(cdnPath)) {
          if (DEBUG_CDN) console.log(`[CDN] Bypassing CDN for excluded Supabase path: ${cdnPath}`);
          transformedUrl = imagePath;
        } else {
          // Extract and preserve query parameters
          const urlObj = new URL(imagePath);
          const queryString = urlObj.search;
          
          // Use CDN if enabled and available
          if (useCdn) {
            transformedUrl = `${CDN_URL}/${cdnPath}${queryString}`;
            
            if (DEBUG_CDN) {
              console.log(`[CDN] Transformed Supabase URL:\nFrom: ${imagePath}\nTo: ${transformedUrl}`);
            }
          } else {
            // Fall back to direct Supabase URL if CDN is disabled
            transformedUrl = imagePath;
            
            if (DEBUG_CDN) {
              console.log(`[CDN] Using direct Supabase URL (CDN disabled): ${imagePath}`);
            }
          }
        }
      } else {
        // For other buckets, just use the URL as is
        transformedUrl = imagePath;
      }
    } else {
      // Not a Supabase URL, return unchanged
      transformedUrl = imagePath;
    }
  } else {
    // Handle relative paths (local assets)
    
    // Ensure path starts with /
    const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    
    // Check if this path should bypass the CDN
    if (!forceCdn && shouldExcludePath(normalizedPath)) {
      if (DEBUG_CDN) console.log(`[CDN] Bypassing CDN for excluded path: ${normalizedPath}`);
      transformedUrl = normalizedPath;
    } else {
      // Handle image paths differently based on pattern
      if (normalizedPath.startsWith('/images/') || normalizedPath.startsWith('/website-images/')) {
        // For image paths, use CDN if enabled
        if (useCdn) {
          // Use constructCdnPath to ensure proper format for the CDN
          const cdnPath = constructCdnPath(normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath);
          transformedUrl = `${CDN_URL}/${cdnPath}`;
          
          if (DEBUG_CDN) {
            console.log(`[CDN] Transformed local path:\nFrom: ${normalizedPath}\nTo: ${transformedUrl}`);
          }
        } else {
          // Critical fix: For local image paths, ensure they point to Supabase when CDN is disabled
          // This prevents the issue where images try to load from the website domain
          const pathWithoutLeadingSlash = normalizedPath.startsWith('/') ? normalizedPath.substring(1) : normalizedPath;
          const supabasePath = `/storage/v1/object/public/${pathWithoutLeadingSlash}`;
          transformedUrl = `https://eukenximajiuhrtljnpw.supabase.co${supabasePath}`;
          
          if (DEBUG_CDN) {
            console.log(`[CDN] Using direct Supabase URL (CDN disabled):\nFrom: ${normalizedPath}\nTo: ${transformedUrl}`);
          }
        }
      } else {
        // For other asset types (CSS, JS, etc.), just use the local path
        transformedUrl = normalizedPath;
      }
    }
  }
  
  // Cache the result in localStorage for future use
  try {
    if (transformedUrl && localStorageCacheService.isValid()) {
      // Cache with lower priority (4) since these can be regenerated easily
      localStorageCacheService.setUrl(cacheKey, transformedUrl, 4);
    }
  } catch (err) {
    console.warn('Failed to cache CDN URL in localStorage:', err);
  }
  
  return transformedUrl;
};

// Export the CDN URL for other components to use
export const getCdnBaseUrl = () => CDN_URL;

// Reset the CDN enabled cache
export const resetCdnEnabledCache = () => {
  cdnEnabledCache = null;
};

/**
 * Set the CDN enabled state in localStorage
 * @param enabled - Whether the CDN should be enabled
 */
export const setCdnEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction) {
    localStorage.setItem('disable_cdn_production', enabled ? 'false' : 'true');
  } else {
    localStorage.setItem(CDN_STORAGE_KEY, enabled ? 'true' : 'false');
  }
  
  // Reset the cache
  resetCdnEnabledCache();
};
