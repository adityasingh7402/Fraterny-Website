
/**
 * Utilities for handling CDN URLs
 */

// Environment configuration - whether to use the CDN or not
const useCdn = process.env.NODE_ENV === 'production';

/**
 * Convert a regular URL to use the CDN if enabled
 * @param url Original URL to the image
 * @param forceCdn Force using CDN even if disabled globally
 * @returns URL to use (either CDN or original)
 */
export const getCdnUrl = (url: string | undefined, forceCdn?: boolean): string | undefined => {
  if (!url) return url;
  
  // Skip CDN for data URLs, blob URLs, and placeholders
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes('placeholder.svg')) {
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
    
    console.log(`Using CDN URL for: ${url}`);
    
    // For simplicity and testing, we're just returning the original URL
    // In production, you would rewrite this to your actual CDN URL pattern
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
  // For now, just return true to indicate CDN is always available
  // In production, you could make a test request to your CDN
  return Promise.resolve(true);
};
