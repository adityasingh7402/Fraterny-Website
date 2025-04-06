
/**
 * CDN Configuration Module
 * Contains all CDN-related configuration variables
 */

// CDN URL - Could be an environment variable in production
export const CDN_URL = 'https://assets.villalab.io';

// CDN Storage Key for localStorage
export const CDN_STORAGE_KEY = 'cdn_enabled';

// CDN Version - Used for cache-busting
export const CDN_VERSION = 'v1';

// Maximum time to wait for CDN availability check (ms)
export const CDN_AVAILABILITY_TIMEOUT = 5000;

// CDN availability cache expiry (ms) - 5 minutes
export const CDN_AVAILABILITY_CACHE_EXPIRY = 5 * 60 * 1000;

// Define as CACHE_EXPIRATION for cdnNetwork.ts
export const CACHE_EXPIRATION = CDN_AVAILABILITY_CACHE_EXPIRY;

// CDN URL check endpoint
export const CDN_CHECK_ENDPOINT = '/status';

// Default path exclusions
export const DEFAULT_EXCLUSIONS = [
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/placeholder.svg',
  '/api/'
];

// Storage key for exclusions
export const CDN_EXCLUSIONS_KEY = 'cdn_exclusions';
