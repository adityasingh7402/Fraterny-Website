
/**
 * Central location for cache instances
 * This file prevents circular dependencies by being the single source of truth for cache instances
 */
import { GenericCache } from './genericCache';
import { WebsiteImage } from '../types';

// Image Cache instance for use in image service - set to less verbose logging
export const imageCache = new GenericCache<WebsiteImage | null>(
  'imageCache',        // Cache name for localStorage identification
  5 * 60 * 1000,       // 5 minutes TTL 
  100,                 // Max cache size
  false,               // Disable verbose logging
  true                 // Enable localStorage persistence
);

// URL Cache instance with a shorter TTL for faster updates - set to less verbose logging
export const urlCache = new GenericCache<string>(
  'urlCache',          // Cache name for localStorage identification
  2 * 60 * 1000,       // 2 minutes TTL
  100,                 // Max cache size
  false,               // Disable verbose logging
  true                 // Enable localStorage persistence
);
