
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
const CDN_ORIGIN = 'https://assets.villalab.io';
export const getCdnUrl = (url: string | undefined, forceCdn?: boolean): string | undefined => {
  if (!url) return url;
  
  // Skip CDN for data URLs, blob URLs, and placeholders
  if (url.startsWith('data:') || url.startsWith('blob:') || url.includes('placeholder')) {
    return url;
  }
  
  // If CDN is disabled and not forced, return the original URL
  if (!useCdn && !forceCdn) {
    return url;
  }
  
  try {
    // Parse the URL to determine if it needs to be modified
    let parsedUrl: URL;
    
    try {
      parsedUrl = new URL(url);
    } catch (error) {
      // If URL parsing fails, it's likely a relative path
      // Just return the original URL for now
      return url;
    }
    
    // If URL is already a CDN URL, don't modify it
    if (parsedUrl.hostname === new URL(CDN_ORIGIN).hostname) {
      return url;
    }
    
    // For Supabase URLs, rewrite them to use the CDN
    if (parsedUrl.hostname.includes('supabase')) {
      // Extract the bucket and path
      const pathParts = parsedUrl.pathname.split('/');
      const isStorageUrl = pathParts.includes('storage') && pathParts.includes('object');
      
      if (isStorageUrl) {
        // Get index of 'public' in the path
        const publicIndex = pathParts.indexOf('public');
        if (publicIndex !== -1 && publicIndex < pathParts.length - 1) {
          // Extract everything after 'public'
          const storagePath = pathParts.slice(publicIndex + 1).join('/');
          
          // Create a properly formatted CDN path
          const cdnPath = normalizeStoragePath(storagePath);
          
          // Construct CDN URL
          return `${CDN_ORIGIN}/${cdnPath}${parsedUrl.search}`;
        }
      }
    }
    
    // For relative paths
    if (url.startsWith('/')) {
      // Remove leading slash for CDN path
      const path = url.slice(1);
      return `${CDN_ORIGIN}/${path}${parsedUrl.search || ''}`;
    }
    
    // For other URLs, return as is
    return url;
  } catch (error) {
    console.warn(`Error processing URL for CDN: ${url}`, error);
    return url;
  }
};

/**
 * Check if CDN is enabled based on environment and localStorage setting
 */
export const isCdnEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return useCdn;
  }
  
  try {
    const savedSetting = localStorage.getItem('cdn_enabled');
    if (savedSetting !== null) {
      return savedSetting === 'true';
    }
  } catch (error) {
    console.warn('Failed to read CDN setting from localStorage', error);
  }
  
  return useCdn;
};

/**
 * Set CDN enabled state in localStorage
 */
export const setCdnEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem('cdn_enabled', enabled.toString());
  } catch (error) {
    console.error('Failed to save CDN setting to localStorage', error);
  }
};

/**
 * Transform a Supabase storage URL into the correct format for our CDN
 */
export const parseSupabaseUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    
    if (parsedUrl.hostname.includes('supabase')) {
      const pathParts = parsedUrl.pathname.split('/');
      const publicIndex = pathParts.indexOf('public');
      
      if (publicIndex !== -1 && publicIndex < pathParts.length - 1) {
        return pathParts.slice(publicIndex + 1).join('/');
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
};
