
/**
 * Cache system utility functions
 */

import { CacheLayerType, CacheOperationType, CacheOptions, InvalidationOptions } from './types';

// Debug mode for verbose logging
export const DEBUG_CACHE = process.env.NODE_ENV === 'development';

/**
 * Log cache operations in debug mode
 */
export const logCacheOperation = (
  operation: CacheOperationType, 
  key: string, 
  result: any, 
  options?: CacheOptions | InvalidationOptions
) => {
  if (DEBUG_CACHE) {
    console.log(`[CacheCoordinator] ${operation.toUpperCase()} ${key}`, { result, options });
  }
};

/**
 * Check if a cache layer should be included in the operation
 */
export const shouldIncludeLayer = (
  layer: CacheLayerType, 
  options?: CacheOptions | InvalidationOptions
): boolean => {
  if (!options) return true;
  
  const layers = (options as any).layers || ['all'];
  const skipLayers = (options as any).skipLayers || [];
  
  return (layers.includes('all') || layers.includes(layer)) && !skipLayers.includes(layer);
};

/**
 * Communicate with the service worker
 */
export const communicateWithServiceWorker = async (
  action: string, 
  payload: Record<string, any> = {}
): Promise<boolean> => {
  try {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return false;
    }
    
    navigator.serviceWorker.controller.postMessage({
      action,
      ...payload,
      timestamp: Date.now()
    });
    
    return true;
  } catch (error) {
    console.error(`[CacheCoordinator] Error communicating with service worker:`, error);
    return false;
  }
};
