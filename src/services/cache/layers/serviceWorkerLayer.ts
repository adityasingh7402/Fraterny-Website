
/**
 * Service Worker cache layer implementation
 */

import { communicateWithServiceWorker } from '../utils';

/**
 * Invalidate an image in Service Worker cache
 */
export const invalidateImageInServiceWorker = async (key: string): Promise<boolean> => {
  return await communicateWithServiceWorker('clearCache', { key });
};

/**
 * Clear all caches in Service Worker
 */
export const clearServiceWorkerCache = async (): Promise<boolean> => {
  return await communicateWithServiceWorker('clearCache');
};

/**
 * Update cache version in Service Worker
 */
export const updateCacheVersionInServiceWorker = async (version: string): Promise<boolean> => {
  return await communicateWithServiceWorker('updateCacheVersion', { version });
};
