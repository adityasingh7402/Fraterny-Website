
/**
 * Unified CDN utilities for image loading
 */
import { normalizeStoragePath, constructCdnPath } from "./pathUtils";

// Environment configuration - whether to use the CDN or not
const useCdn = process.env.NODE_ENV === 'production';

// Cache of CDN availability to avoid repeated network requests
let cdnAvailabilityCache: { available: boolean; timestamp: number } | null = null;

/**
 * Convert a regular URL to use the CDN if enabled
 * @param url Original URL to the image
 * @param forceCdn Force using CDN even if disabled globally
 * @returns URL to use (either CDN or original)
 */
const CDN_ORIGIN = 'https://image-handler.yashmalhotra.workers.dev';
export const getCdnUrl = (url: string | undefined, forceCdn?: boolean): string | undefined => {
  if (!url) return url;
  
  // Skip CDN for data URLs, blob URLs, and placeholders
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes('placeholder')) {
    return url;
  }
  
  // If CDN is disabled and not forced, ensure we return a proper Supabase URL
  if (!useCdn && !forceCdn) {
    // Critical fix: Make sure we're always returning a full Supabase URL, not a relative path
    if (!url.startsWith('http')) {
      // For relative paths, construct a full Supabase URL
      const pathWithoutLeadingSlash = url.startsWith('/') ? url.substring(1) : url;
      const normalizedPath = normalizeStoragePath(pathWithoutLeadingSlash);
      return `https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/${normalizedPath}`;
    }
    return url;
  }
  
  try {
    // Parse the URL to determine if it needs to be modified
    let parsedUrl: URL;
    
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      // If URL parsing fails, it's likely a relative path
      // Convert it to an absolute Supabase URL
      const pathWithoutLeadingSlash = url.startsWith('/') ? url.substring(1) : url;
      const normalizedPath = normalizeStoragePath(pathWithoutLeadingSlash);
      const supabaseUrl = `https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/${normalizedPath}`;
      parsedUrl = new URL(supabaseUrl);
    }
    
    // If URL is already a CDN URL, don't modify it
    if (parsedUrl.hostname === 'image-handler.yashmalhotra.workers.dev') {
      return url;
    }
    
    // For Supabase URLs, we need to rewrite them to use the CDN
    if (parsedUrl.hostname.includes('supabase')) {
      // Extract the bucket and path
      const pathParts = parsedUrl.pathname.split('/');
      const isStorageUrl = pathParts.includes('storage') && pathParts.includes('object');
      
      if (isStorageUrl) {
        // Get index of 'public' in the path
        const publicIndex = pathParts.indexOf('public');
        if (publicIndex !== -1 && publicIndex < pathParts.length - 1) {
          // Extract everything after 'public', this should directly be the storage_path
          // Join parts after 'public' to get the storage path
          const storagePath = pathParts.slice(publicIndex + 1).join('/');
          
          // Use our path normalization utility to handle potential duplicates
          // and create a properly formatted CDN path
          const cdnPath = constructCdnPath(storagePath);
          
          // Construct CDN URL using the normalized path
          return `${CDN_ORIGIN}/${cdnPath}${parsedUrl.search}`;
        }
      }
    }
    
    // If not a Supabase URL or we couldn't parse it properly, ensure it's a full URL
    if (!url.startsWith('http')) {
      // For relative paths, construct a full Supabase URL
      const pathWithoutLeadingSlash = url.startsWith('/') ? url.substring(1) : url;
      const normalizedPath = normalizeStoragePath(pathWithoutLeadingSlash);
      return `https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/${normalizedPath}`;
    }
    
    return url;
  } catch (error) {
    // If URL parsing fails, fallback to a direct Supabase URL
    console.warn(`Invalid URL format for CDN processing: ${url}`);
    
    // For relative paths, construct a full Supabase URL
    if (!url.startsWith('http')) {
      const pathWithoutLeadingSlash = url.startsWith('/') ? url.substring(1) : url;
      const normalizedPath = normalizeStoragePath(pathWithoutLeadingSlash);
      return `https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/${normalizedPath}`;
    }
    
    return url;
  }
};

/**
 * Check if CDN is enabled based on environment settings
 */
export const isCdnEnabled = (): boolean => {
  return useCdn;
};

/**
 * Check if CDN is available by making a test request
 * @returns Promise resolving to true if CDN is available
 */
export const getCdnAvailability = async (): Promise<boolean> => {
  // Use cache if available and not expired (5 minutes)
  if (cdnAvailabilityCache && (Date.now() - cdnAvailabilityCache.timestamp < 5 * 60 * 1000)) {
    return cdnAvailabilityCache.available;
  }
  
  try {
    // Make a test request to the CDN health endpoint
    const response = await fetch('https://image-handler.yashmalhotra.workers.dev/health', {
      method: 'HEAD',
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    const available = response.ok;
    
    // Cache the result
    cdnAvailabilityCache = {
      available,
      timestamp: Date.now()
    };
    
    return available;
  } catch (error) {
    // If there's an error, assume CDN is not available
    console.warn('CDN availability check failed:', error);
    
    // Cache the negative result
    cdnAvailabilityCache = {
      available: false,
      timestamp: Date.now()
    };
    
    return false;
  }
};

/**
 * Reset CDN availability cache
 */
export const resetCdnAvailabilityCache = (): void => {
  cdnAvailabilityCache = null;
};
