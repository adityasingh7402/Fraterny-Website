
/**
 * Storage Configuration Module
 * Contains all Supabase storage-related configuration variables
 */

// Supabase URL - Could be an environment variable in production
export const SUPABASE_STORAGE_URL = 'https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public';

// Storage settings key for localStorage
export const STORAGE_SETTINGS_KEY = 'storage_settings';

// Storage Version - Used for cache-busting
export const STORAGE_VERSION = 'v1';

// Maximum time to wait for Supabase availability check (ms)
export const STORAGE_AVAILABILITY_TIMEOUT = 5000;

// Availability cache expiry (ms) - 5 minutes
export const STORAGE_AVAILABILITY_CACHE_EXPIRY = 5 * 60 * 1000;

// Define as CACHE_EXPIRATION for compatibility
export const CACHE_EXPIRATION = STORAGE_AVAILABILITY_CACHE_EXPIRY;

// Health check endpoint
export const HEALTH_CHECK_ENDPOINT = '/status';

// Default path exclusions
export const DEFAULT_EXCLUSIONS = [
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/placeholder.svg',
  '/api/'
];

// Storage key for exclusions
export const STORAGE_EXCLUSIONS_KEY = 'storage_exclusions';

// Legacy aliases for backward compatibility
export const CDN_URL = SUPABASE_STORAGE_URL;
export const CDN_STORAGE_KEY = STORAGE_SETTINGS_KEY;
export const CDN_VERSION = STORAGE_VERSION;
export const CDN_AVAILABILITY_TIMEOUT = STORAGE_AVAILABILITY_TIMEOUT;
export const CDN_AVAILABILITY_CACHE_EXPIRY = STORAGE_AVAILABILITY_CACHE_EXPIRY;
export const CDN_CHECK_ENDPOINT = HEALTH_CHECK_ENDPOINT;
export const CDN_EXCLUSIONS_KEY = STORAGE_EXCLUSIONS_KEY;
