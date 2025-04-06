
/**
 * Global constants for image service
 */

// The official name of the Supabase Storage bucket, with correct capitalization and spacing
export const STORAGE_BUCKET_NAME = 'Website Images';

// Cache durations
export const CACHE_DURATIONS = {
  SHORT: 2 * 60 * 1000,   // 2 minutes
  MEDIUM: 5 * 60 * 1000,  // 5 minutes
  LONG: 30 * 60 * 1000,   // 30 minutes
  EXTENDED: 60 * 60 * 1000 // 1 hour
};

// Cache priorities for eviction policies
export const CACHE_PRIORITIES = {
  CRITICAL: 1,  // Most important assets (logo, hero)
  HIGH: 2,      // Important assets
  NORMAL: 3,    // Regular content
  LOW: 4        // Least important, evicted first
};

// Default cache settings
export const DEFAULT_CACHE_CONFIG = {
  ttl: CACHE_DURATIONS.MEDIUM,
  priority: CACHE_PRIORITIES.NORMAL,
  staleWhileRevalidate: true
};

// Image categories (for reference and filtering)
export const IMAGE_CATEGORIES = [
  'hero',
  'logos',
  'backgrounds',
  'content',
  'experience',
  'team',
  'testimonials'
];

// Re-export existing image constants as needed
export { IMAGE_USAGE_MAP, defaultImagesMap } from './oldConstants';
