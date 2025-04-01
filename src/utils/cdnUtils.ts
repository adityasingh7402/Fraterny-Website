
/**
 * Utility for managing image CDN URLs
 */

// Your Cloudflare Worker URL - can be replaced with environment variable later
const CDN_URL = 'https://image-handler.pages.dev';

// Storage key for CDN toggle in development
const CDN_STORAGE_KEY = 'use_cdn_development';

/**
 * Check if CDN should be used
 * - In production: Always use CDN
 * - In development: Use CDN only if explicitly enabled via localStorage
 */
const shouldUseCdn = (): boolean => {
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  
  // In development, check localStorage preference
  if (typeof window !== 'undefined') {
    return localStorage.getItem(CDN_STORAGE_KEY) === 'true';
  }
  
  return false;
};

/**
 * Converts a local image path to a CDN URL
 * @param imagePath - The path to the image (e.g., /images/hero/image.webp)
 * @returns The CDN URL or original path based on environment
 */
export const getCdnUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null;
  
  // Don't process already absolute URLs (including data URLs)
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Ensure path starts with /
  const normalizedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  // Use CDN if enabled (production or manually in development)
  return shouldUseCdn() ? `${CDN_URL}${normalizedPath}` : normalizedPath;
};

/**
 * Test if the CDN is working by fetching a test image
 */
export const testCdnConnection = async (): Promise<boolean> => {
  try {
    // Always test even in dev mode to check if the CDN is reachable
    const testUrl = `${CDN_URL}/images/hero/luxury-villa-mobile.webp`;
    const response = await fetch(testUrl, { 
      method: 'HEAD',
      // Prevent caching this request to get accurate CDN status
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    console.log(`CDN test result for ${testUrl}:`, response.status, response.ok);
    return response.ok;
  } catch (error) {
    console.error('CDN connection test failed:', error);
    return false;
  }
};

// Export the CDN URL for other components to use
export const getCdnBaseUrl = () => CDN_URL;

// Export function to check if CDN is enabled
export const isCdnEnabled = () => shouldUseCdn();
