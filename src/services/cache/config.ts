
/**
 * Default configuration for cache operations
 */

import { CacheOptions, InvalidationOptions } from './types';

/**
 * Default cache options
 */
export const defaultCacheOptions: CacheOptions = {
  layers: ['memory', 'localStorage', 'reactQuery', 'serviceWorker'],
  priority: 3,
  ttl: 15 * 60 * 1000, // 15 minutes default
  skipLayers: [],
  force: false,
  metadata: {}
};

/**
 * Default invalidation options
 */
export const defaultInvalidationOptions: InvalidationOptions = {
  layers: ['memory', 'localStorage', 'reactQuery', 'serviceWorker'],
  cascade: true,
  notifyComponents: true,
  skipLayers: []
};
