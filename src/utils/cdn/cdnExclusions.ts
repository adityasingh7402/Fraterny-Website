
/**
 * CDN Path Exclusions Module
 * Handles the management of paths that should bypass the CDN
 */

import { CDN_EXCLUSIONS_KEY, DEFAULT_EXCLUSIONS } from './cdnConfig';

/**
 * Get path exclusions - paths that should bypass the CDN
 * This is useful for images that might not work well with the CDN
 */
export const getPathExclusions = (): string[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_EXCLUSIONS;
  }
  
  try {
    const exclusions = localStorage.getItem(CDN_EXCLUSIONS_KEY);
    if (!exclusions) return DEFAULT_EXCLUSIONS;
    
    const parsed = JSON.parse(exclusions);
    // Ensure default exclusions are always included
    return Array.from(new Set([...parsed, ...DEFAULT_EXCLUSIONS]));
  } catch (error) {
    console.error('Error parsing CDN path exclusions:', error);
    return DEFAULT_EXCLUSIONS;
  }
};

/**
 * Check if a path should be excluded from CDN
 */
export const shouldExcludePath = (path: string): boolean => {
  if (!path) return false;
  
  const exclusions = getPathExclusions();
  return exclusions.some(exclusion => 
    path.includes(exclusion) || 
    (exclusion.endsWith('*') && path.startsWith(exclusion.slice(0, -1)))
  );
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

// Export default exclusions
export const getDefaultExclusions = () => DEFAULT_EXCLUSIONS;
