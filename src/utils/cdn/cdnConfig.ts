
/**
 * CDN Configuration Module
 * Contains all configuration options for the CDN
 */

// Your Cloudflare Worker URL - update this with your actual deployed worker URL
export const CDN_URL = 'https://image-handler.yashmalhotra.workers.dev';

// Storage key for CDN toggle in development
export const CDN_STORAGE_KEY = 'use_cdn_development';

// Storage key for path exclusions (paths that should bypass the CDN)
export const CDN_EXCLUSIONS_KEY = 'cdn_path_exclusions';

// Default exclusions that should always bypass CDN
export const DEFAULT_EXCLUSIONS = [
  '/favicon.ico',
  '/og-image.png'
];

// Cache expiration time in milliseconds (5 minutes)
export const CACHE_EXPIRATION = 5 * 60 * 1000;
