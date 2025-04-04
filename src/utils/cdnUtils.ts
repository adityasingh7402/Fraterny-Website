
/**
 * Unified CDN utilities for image loading
 */

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
  
  // If CDN is disabled and not forced, return original
  if (!useCdn && !forceCdn) {
    return url;
  }
  
  try {
    // Parse the URL to determine if it needs to be modified
    const parsedUrl = new URL(url);
    
    // If URL is already a CDN URL, don't modify it
    if (parsedUrl.hostname === 'lovable-cdn.com') {
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
          // Extract everything after 'public'
          const bucketAndPath = pathParts.slice(publicIndex + 1).join('/');
          // Construct CDN URL
          return `${CDN_ORIGIN}/website-images/${bucketAndPath}${parsedUrl.search}`;
        }
      }
    }
    
    // If not a Supabase URL or we couldn't parse it properly, return the original URL
    return url;
  } catch (error) {
    // If URL parsing fails, return the original URL
    console.warn(`Invalid URL format for CDN processing: ${url}`);
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
    const response = await fetch('https://lovable-cdn.com/health', {
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
