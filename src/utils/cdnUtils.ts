
/**
 * Unified CDN utilities for image loading - deprecated
 * All images now load directly from Supabase
 */

// Always return false to disable CDN
const useCdn = false;

/**
 * Convert a regular URL to use the CDN if enabled
 * Now always returns the original URL as CDN is disabled
 */
export const getCdnUrl = (url: string | undefined): string | undefined => {
  return url; // Simply pass through the URL
};

/**
 * Check if CDN is enabled - always returns false
 */
export const isCdnEnabled = (): boolean => {
  return false;
};

/**
 * Set CDN enabled state - now a no-op function
 */
export const setCdnEnabled = (enabled: boolean): void => {
  console.log('[Image System] CDN functionality has been removed. Ignoring setCdnEnabled call.');
};

/**
 * Transform a Supabase storage URL - now simply returns null
 */
export const parseSupabaseUrl = (url: string): string | null => {
  return null;
};
