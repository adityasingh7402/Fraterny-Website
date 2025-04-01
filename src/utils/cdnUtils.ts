
/**
 * Utility for managing image CDN URLs
 */

// Your Cloudflare Worker URL - replace with environment variable later if needed
const CDN_URL = 'https://yash.yashmaihotra.workers.dev';

// Storage key for CDN toggle in development
const CDN_STORAGE_KEY = 'use_cdn_development';

// Storage key for path exclusions (paths that should bypass the CDN)
const CDN_EXCLUSIONS_KEY = 'cdn_path_exclusions';

/**
 * Check if CDN should be used
 * - In production: Always use CDN unless disabled via localStorage
 * - In development: Use CDN only if explicitly enabled via localStorage
 */
const shouldUseCdn = (): boolean => {
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
 * Get path exclusions - paths that should bypass the CDN
 * This is useful for images that might not work well with the CDN
 */
const getPathExclusions = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const exclusions = localStorage.getItem(CDN_EXCLUSIONS_KEY);
    if (!exclusions) return [];
    
    return JSON.parse(exclusions);
  } catch (error) {
    console.error('Error parsing CDN path exclusions:', error);
    return [];
  }
};

/**
 * Check if a path should be excluded from CDN
 */
const shouldExcludePath = (path: string): boolean => {
  if (!path) return false;
  
  const exclusions = getPathExclusions();
  return exclusions.some(exclusion => 
    path.includes(exclusion) || 
    (exclusion.endsWith('*') && path.startsWith(exclusion.slice(0, -1)))
  );
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
    return imagePath;
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

/**
 * Test if the CDN is working by fetching a test image
 */
export const testCdnConnection = async (): Promise<boolean> => {
  try {
    // Always test even in dev mode to check if the CDN is reachable
    const testUrl = `${CDN_URL}/images/hero/luxury-villa-mobile.webp`;
    console.log(`[CDN] Testing CDN connection with URL: ${testUrl}`);
    
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
    
    console.log(`[CDN] Test result for ${testUrl}:`, response.status, response.ok);
    return response.ok;
  } catch (error) {
    console.error('[CDN] Connection test failed:', error);
    return false;
  }
};

/**
 * Add a path to the exclusion list
 */
export const addCdnPathExclusion = (path: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const exclusions = getPathExclusions();
    
    // Don't add duplicates
    if (!exclusions.includes(path)) {
      exclusions.push(path);
      localStorage.setItem(CDN_EXCLUSIONS_KEY, JSON.stringify(exclusions));
      console.log(`[CDN] Added path exclusion: ${path}`);
    }
  } catch (error) {
    console.error('[CDN] Error updating path exclusions:', error);
  }
};

/**
 * Remove a path from the exclusion list
 */
export const removeCdnPathExclusion = (path: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const exclusions = getPathExclusions();
    const newExclusions = exclusions.filter(item => item !== path);
    localStorage.setItem(CDN_EXCLUSIONS_KEY, JSON.stringify(newExclusions));
    console.log(`[CDN] Removed path exclusion: ${path}`);
  } catch (error) {
    console.error('[CDN] Error updating path exclusions:', error);
  }
};

/**
 * Clear all path exclusions
 */
export const clearCdnPathExclusions = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(CDN_EXCLUSIONS_KEY);
  console.log('[CDN] Cleared all path exclusions');
};

// Export the CDN URL for other components to use
export const getCdnBaseUrl = () => CDN_URL;

// Export function to check if CDN is enabled
export const isCdnEnabled = () => shouldUseCdn();

// Export path exclusion list
export const getCdnPathExclusions = getPathExclusions;
