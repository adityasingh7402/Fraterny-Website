
/**
 * Utility functions for the cache coordinator
 */

import { CacheLayerType, CacheOperationType, CacheOptions, CacheOptions as CacheOpts } from './types';

/**
 * Log a cache operation
 */
export function logCacheOperation(
  operation: CacheOperationType,
  key: string,
  details: Record<string, any> = {},
  options?: CacheOptions
): void {
  // Only log in development or if verbose option is set
  if (process.env.NODE_ENV === 'development' || options?.verbose) {
    console.log(`[CacheCoordinator] ${operation.toUpperCase()} ${key}:`, details);
  }
}

/**
 * Check if a specific layer should be included in an operation
 */
export function shouldIncludeLayer(
  layer: CacheLayerType,
  options?: CacheOpts
): boolean {
  if (!options) return true;
  if (options.layers && !options.layers.includes(layer)) return false;
  if (options.skipLayers && options.skipLayers.includes(layer)) return false;
  return true;
}

/**
 * Communicate with the service worker
 */
export async function communicateWithServiceWorker(
  action: string,
  data: Record<string, any> = {}
): Promise<boolean> {
  try {
    // Check if the service worker is active
    if (typeof navigator === 'undefined' || 
        !('serviceWorker' in navigator) || 
        !navigator.serviceWorker.controller) {
      console.log('Service worker not active or not supported, skipping message:', action);
      return false;
    }
    
    return new Promise((resolve) => {
      // Create a one-time message handler to get response
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.action === action) {
          navigator.serviceWorker.removeEventListener('message', messageHandler);
          resolve(event.data.status === 'success');
        }
      };
      
      // Add the message listener
      navigator.serviceWorker.addEventListener('message', messageHandler);
      
      // Send message to service worker
      navigator.serviceWorker.controller.postMessage({
        action,
        ...data
      });
      
      // Set timeout in case we don't get a response
      setTimeout(() => {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
        console.warn(`Timeout waiting for service worker response to ${action}`);
        resolve(false);
      }, 3000);
    });
  } catch (error) {
    console.error(`Error communicating with service worker for action ${action}:`, error);
    return false;
  }
}
