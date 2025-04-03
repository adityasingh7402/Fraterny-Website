/**
 * Image Caching Service Worker
 * 
 * This service worker provides:
 * - Advanced caching for images
 * - Version-based cache invalidation
 * - Offline image support
 * - Debug capabilities for testing
 */

const CACHE_NAME_PREFIX = 'fraterny-image-cache-';
const IMAGE_CACHE_VERSION = '1.0.0';
const DEBUG_MODE = false; // Set to true to enable debug logging
const EXCLUDED_URLS = ['/placeholder.svg']; // URLs to not cache

// Cache name with version for proper invalidation
let currentCacheName = `${CACHE_NAME_PREFIX}${IMAGE_CACHE_VERSION}`;

// URLs that should always be fetched from network
const NETWORK_ONLY_PATHS = ['/health', '/_health', '/api/'];

// Log helper - only logs in debug mode
const log = (...args) => {
  if (DEBUG_MODE) {
    console.log('[ServiceWorker]', ...args);
  }
};

// Install event - precache essential assets
self.addEventListener('install', event => {
  log('Installing Service Worker');
  
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
});

// Activate event - clean up old caches when version changes
self.addEventListener('activate', event => {
  log('Activating Service Worker');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Delete any old image caches that don't match our current version
          if (cacheName.startsWith(CACHE_NAME_PREFIX) && cacheName !== currentCacheName) {
            log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
          return Promise.resolve();
        })
      );
    }).then(() => {
      // Claim clients so the service worker is in control immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - handle all requests
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip excluded URLs and network-only paths
  if (EXCLUDED_URLS.some(excluded => url.pathname.includes(excluded)) ||
      NETWORK_ONLY_PATHS.some(path => url.pathname.startsWith(path))) {
    log(`Skipping cache for excluded URL: ${url.pathname}`);
    return;
  }
  
  // Check if this is an image request by path pattern or content-type
  const isImageRequest = 
    url.pathname.match(/\.(jpe?g|png|gif|webp|svg|avif)$/i) ||
    url.pathname.includes('/images/') ||
    url.pathname.includes('/website-images/') ||
    url.pathname.includes('/storage/v1/object/public') ||
    url.pathname.includes('/lovable-uploads/');
  
  // Handle image requests with cache-first strategy
  if (isImageRequest) {
    event.respondWith(handleImageRequest(event.request, url));
    return;
  }
});

/**
 * Image-specific request handler with cache-first strategy
 * Respects cache versioning parameters
 */
async function handleImageRequest(request, url) {
  // Extract versioning info from URL to enable proper cache invalidation
  const version = url.searchParams.get('v');
  
  // Create a cache key that includes the version if present
  const cacheKey = version 
    ? `${request.url}#v=${version}` 
    : request.url;
  
  try {
    // Check cache first
    const cache = await caches.open(currentCacheName);
    const cachedResponse = await cache.match(cacheKey);
    
    if (cachedResponse) {
      log(`Cache HIT for: ${url.pathname}`);
      return cachedResponse;
    }
    
    log(`Cache MISS for: ${url.pathname}`);
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Only cache successful responses
    if (networkResponse && networkResponse.ok && networkResponse.status === 200) {
      // Clone the response since it can only be consumed once
      const clonedResponse = networkResponse.clone();
      
      // Check for cache control headers that prohibit caching
      const cacheControl = networkResponse.headers.get('Cache-Control');
      if (!cacheControl || !cacheControl.includes('no-store')) {
        // Asynchronously add to cache without delaying response to user
        cache.put(cacheKey, clonedResponse).catch(err => {
          console.error('Error caching response:', err);
        });
        
        log(`Cached: ${url.pathname}`);
      }
    }
    
    return networkResponse;
  } catch (error) {
    log(`Fetch error for ${url.pathname}:`, error);
    
    // Try to return from cache even if it's an expired entry as fallback
    const cache = await caches.open(currentCacheName);
    const cachedResponse = await cache.match(request.url);
    if (cachedResponse) {
      log(`Returned stale cache for: ${url.pathname}`);
      return cachedResponse;
    }
    
    // If no cache at all, handle the error gracefully
    return new Response(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#0A1A2F"/>
        <text x="50%" y="50%" font-family="Arial" font-size="20" 
              text-anchor="middle" fill="#fff">Image Load Error</text>
        <text x="50%" y="70%" font-family="Arial" font-size="14" 
              text-anchor="middle" fill="#E07A5F">Network issue - please try again</text>
      </svg>`,
      {
        status: 503,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}

// Listen for messages from the main application
self.addEventListener('message', event => {
  if (!event.data) {
    return;
  }
  
  // Handle cache invalidation requests
  if (event.data.action === 'clearCache') {
    log('Clearing image cache by request');
    
    // If specific cache key or pattern is provided
    if (event.data.key) {
      clearSpecificCache(event.data.key);
    } else {
      // Otherwise clear all image caches
      clearAllImageCaches();
    }
    
    // Respond back to client
    if (event.source && event.source.postMessage) {
      event.source.postMessage({ 
        action: 'clearCache', 
        status: 'success',
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Handle cache version update
  if (event.data.action === 'updateCacheVersion') {
    if (event.data.version) {
      updateCacheVersion(event.data.version);
      
      // Respond back to client
      if (event.source && event.source.postMessage) {
        event.source.postMessage({ 
          action: 'updateCacheVersion', 
          status: 'success',
          version: event.data.version,
          timestamp: new Date().toISOString()
        });
      }
    }
  }
});

/**
 * Clear caches that match a specific key pattern
 */
async function clearSpecificCache(keyPattern) {
  try {
    const cache = await caches.open(currentCacheName);
    const keys = await cache.keys();
    
    let count = 0;
    for (const request of keys) {
      if (request.url.includes(keyPattern)) {
        await cache.delete(request);
        count++;
      }
    }
    
    log(`Cleared ${count} cached items matching pattern: ${keyPattern}`);
  } catch (err) {
    console.error('Error clearing specific cache:', err);
  }
}

/**
 * Clear all image caches
 */
async function clearAllImageCaches() {
  try {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      if (cacheName.startsWith(CACHE_NAME_PREFIX)) {
        await caches.delete(cacheName);
        log(`Deleted cache: ${cacheName}`);
      }
    }
  } catch (err) {
    console.error('Error clearing all image caches:', err);
  }
}

/**
 * Update the cache version
 */
async function updateCacheVersion(version) {
  // Create a new cache name with the new version
  const newCacheName = `${CACHE_NAME_PREFIX}${version}`;
  
  if (newCacheName !== currentCacheName) {
    currentCacheName = newCacheName;
    log(`Updated cache version to: ${version}`);
    
    // Clear old caches
    const cacheNames = await caches.keys();
    for (const cacheName of cacheNames) {
      if (cacheName.startsWith(CACHE_NAME_PREFIX) && cacheName !== currentCacheName) {
        await caches.delete(cacheName);
        log(`Deleted old cache: ${cacheName}`);
      }
    }
  }
}
