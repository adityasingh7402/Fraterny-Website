
import { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/use-network-status';

interface CachedImageInfo {
  url: string;
  aspectRatio?: number;
  tinyPlaceholder: string | null;
  colorPlaceholder: string | null;
  contentHash: string | null;
  timestamp: number;
  lastUpdated: string;
  globalVersion?: string;
  networkType?: string;
}

/**
 * Hook for managing the image caching functionality
 */
export const useImageCache = (dynamicKey?: string, size?: string) => {
  const network = useNetworkStatus();
  
  // Determine cache expiry based on network conditions
  const getCacheExpiryTime = (): number => {
    return ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType) 
      ? 15 * 60 * 1000  // 15 minutes for slower connections
      : 5 * 60 * 1000;  // 5 minutes for faster connections
  };
  
  // Check if we should use cache based on environment
  const shouldClearCacheInDevelopment = (): boolean => {
    return process.env.NODE_ENV === 'development';
  };
  
  // Get cached image data if available and valid
  const getCachedImageData = (cacheKey: string): CachedImageInfo | null => {
    if (!navigator.onLine) return null;
    
    const cachedData = sessionStorage.getItem(cacheKey);
    if (!cachedData) return null;
    
    try {
      const parsed = JSON.parse(cachedData);
      const cacheAge = Date.now() - parsed.timestamp;
      
      // Use cache if it's less than the expiry time
      if (cacheAge < getCacheExpiryTime()) {
        return parsed;
      }
    } catch (e) {
      console.error('Error parsing cached image data:', e);
    }
    
    return null;
  };
  
  // Save image data to cache
  const saveImageToCache = (cacheKey: string, imageInfo: CachedImageInfo): void => {
    try {
      // Only cache if we're online
      if (navigator.onLine) {
        sessionStorage.setItem(cacheKey, JSON.stringify(imageInfo));
      }
    } catch (e) {
      console.warn('Failed to cache image data in sessionStorage:', e);
    }
  };
  
  return {
    getCachedImageData,
    saveImageToCache,
    shouldClearCacheInDevelopment,
    getCacheExpiryTime
  };
};
