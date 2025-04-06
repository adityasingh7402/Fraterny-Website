
/**
 * CDN Exclusions Module
 * Handles paths that should be excluded from CDN processing
 */

import { CDN_EXCLUSIONS_KEY, DEFAULT_EXCLUSIONS } from './cdnConfig';

/**
 * Get the list of paths that should be excluded from CDN
 */
export const getPathExclusions = (): string[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_EXCLUSIONS;
  }
  
  try {
    const savedExclusions = localStorage.getItem(CDN_EXCLUSIONS_KEY);
    if (savedExclusions) {
      return JSON.parse(savedExclusions);
    }
  } catch (error) {
    console.error('Failed to parse CDN exclusions from localStorage:', error);
  }
  
  return DEFAULT_EXCLUSIONS;
};

/**
 * Save the list of paths that should be excluded from CDN
 */
export const savePathExclusions = (exclusions: string[]): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(CDN_EXCLUSIONS_KEY, JSON.stringify(exclusions));
  } catch (error) {
    console.error('Failed to save CDN exclusions to localStorage:', error);
  }
};

/**
 * Add a path to the exclusion list
 */
export const addPathExclusion = (path: string): void => {
  const exclusions = getPathExclusions();
  if (!exclusions.includes(path)) {
    exclusions.push(path);
    savePathExclusions(exclusions);
  }
};

/**
 * Remove a path from the exclusion list
 */
export const removePathExclusion = (path: string): void => {
  const exclusions = getPathExclusions();
  const index = exclusions.indexOf(path);
  if (index !== -1) {
    exclusions.splice(index, 1);
    savePathExclusions(exclusions);
  }
};

/**
 * Check if a path should be excluded from CDN
 */
export const shouldExcludePath = (path: string): boolean => {
  // Normalize the path for comparison
  const normalizedPath = path.toLowerCase();
  
  // Get the exclusion list
  const exclusions = getPathExclusions();
  
  // Check if any exclusion pattern matches the path
  return exclusions.some(exclusion => {
    // Simple wildcard support - '*' matches any string
    if (exclusion.includes('*')) {
      const pattern = exclusion.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`, 'i');
      return regex.test(normalizedPath);
    }
    
    // Check if the path starts with the exclusion
    return normalizedPath.startsWith(exclusion.toLowerCase());
  });
};

/**
 * Reset exclusions to defaults
 */
export const resetPathExclusions = (): void => {
  savePathExclusions(DEFAULT_EXCLUSIONS);
};
