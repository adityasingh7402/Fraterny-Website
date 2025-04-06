
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

// Map of image usage contexts to their keys
export const IMAGE_USAGE_MAP = {
  hero: {
    homepage: 'hero/homepage',
    experience: 'hero/experience',
    villa: 'hero/villa'
  },
  testimonials: {
    ceo: 'testimonials/ceo',
    entrepreneur: 'testimonials/entrepreneur',
    investor: 'testimonials/investor'
  },
  logos: {
    primary: 'logos/primary',
    secondary: 'logos/secondary',
    footer: 'logos/footer'
  }
};

// Default images map for fallbacks
export const defaultImagesMap = {
  hero: '/placeholder.svg',
  logo: '/logo.svg',
  profile: '/profile-placeholder.svg',
  thumbnail: '/thumbnail-placeholder.svg'
};
