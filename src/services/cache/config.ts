
/**
 * Default configuration for cache operations
 */

import { CacheOptions, InvalidationOptions } from './types';

/**
 * Default cache options
 */
export const defaultCacheOptions: CacheOptions = {
  layers: ['all'],
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
  layers: ['all'],
  cascade: true,
  notifyComponents: true,
  skipLayers: []
};
