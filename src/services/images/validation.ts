
import { IMAGE_KEYS } from "@/pages/admin/images/components/upload/constants";

// Create a set of valid keys for fast lookup
const VALID_KEYS = new Set(IMAGE_KEYS.map(item => item.key));

/**
 * Central validation function for image keys
 * All image key validation should use this function
 */
export const isValidImageKey = (key: string | null | undefined): boolean => {
  // Basic validation - reject empty/null values
  if (!key || typeof key !== 'string' || key.trim() === '') {
    console.warn(`Invalid image key (empty or null): "${key}"`);
    return false;
  }
  
  const normalizedKey = key.trim();
  
  // Check against predefined list
  const isPredefined = VALID_KEYS.has(normalizedKey);
  if (!isPredefined) {
    console.warn(`Image key not in predefined list: "${normalizedKey}"`);
    
    // In production, be more lenient to avoid breaking the site
    if (process.env.NODE_ENV === 'production') {
      return true;
    }
  }
  
  return isPredefined;
};

/**
 * Check if a URL is valid and doesn't contain undefined
 */
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // Check for common error patterns
  if (url.includes('/undefined') || url === 'undefined' || url.includes('null')) {
    console.error(`Invalid URL contains problematic value: ${url}`);
    return false;
  }
  
  return true;
};
