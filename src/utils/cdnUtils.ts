
/**
 * Utility for managing image CDN URLs
 */

// Your Cloudflare Worker URL - can be replaced with environment variable later
const CDN_URL = 'https://image-handler.pages.dev';

// Whether to use the CDN in the current environment
const USE_CDN = process.env.NODE_ENV === 'production';

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
  
  // Use CDN in production, direct path in development
  return USE_CDN ? `${CDN_URL}${normalizedPath}` : normalizedPath;
};

/**
 * Test if the CDN is working by fetching a test image
 */
export const testCdnConnection = async (): Promise<boolean> => {
  if (!USE_CDN) return true; // In dev, no need to test
  
  try {
    // Test with a known image path
    const testUrl = `${CDN_URL}/images/hero/luxury-villa-mobile.webp`;
    const response = await fetch(testUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('CDN connection test failed:', error);
    return false;
  }
};
