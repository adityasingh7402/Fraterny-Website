// Service Worker for image caching and offline support
// Version: 1.0.0

// Service Worker Configuration
const CACHE_CONFIG = {
  IMAGE_CACHE: 'image-cache-v1',
  PLACEHOLDER_CACHE: 'placeholder-cache-v1',
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_ITEMS: 100,
  CACHE_EXPIRATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  CRITICAL_ASSETS: [
    '/placeholder.svg',
    '/images/loading.gif',
    '/images/hero.jpg',
    '/images/logo.png'
  ]
};

// Cache size tracking
let currentCacheSize = 0;
const cacheSizeMap = new Map();

// Install event - Cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_CONFIG.IMAGE_CACHE),
      caches.open(CACHE_CONFIG.PLACEHOLDER_CACHE)
    ]).then(([imageCache, placeholderCache]) => {
      return Promise.all([
        ...CACHE_CONFIG.CRITICAL_ASSETS.map(url => 
          fetch(url).then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return placeholderCache.put(url, response.clone());
          })
        ),
        // Preload critical images
        preloadCriticalImages(imageCache)
      ]);
    })
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('image-cache-') || name.startsWith('placeholder-cache-'))
          .filter(name => name !== CACHE_CONFIG.IMAGE_CACHE && name !== CACHE_CONFIG.PLACEHOLDER_CACHE)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-failed-requests') {
    event.waitUntil(syncFailedRequests());
  }
});

// Fetch event - Enhanced caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Handle image requests
  if (isImageRequest(event.request)) {
    event.respondWith(
      handleImageRequest(event.request, url)
    );
  }
});

// Helper Functions
async function handleImageRequest(request, url) {
  const cache = await caches.open(CACHE_CONFIG.IMAGE_CACHE);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Check if cache is expired
    const cacheEntry = await cache.match(request, { ignoreSearch: true });
    const cacheData = await cacheEntry.json();
    
    if (Date.now() - cacheData.timestamp < CACHE_CONFIG.CACHE_EXPIRATION) {
      return cachedResponse;
    }
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Check cache size before storing
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const size = parseInt(contentLength);
        if (await canCache(size)) {
          const cacheData = {
            timestamp: Date.now(),
            size: size
          };
          const responseToCache = response.clone();
          await cache.put(request, responseToCache);
          await updateCacheSize(size);
        }
      }
    }
    return response;
  } catch (error) {
    // If network fails and we have a cached version, use it
    if (cachedResponse) {
      return cachedResponse;
    }
    // Store failed request for background sync
    await storeFailedRequest(request);
    throw error;
  }
}

async function canCache(size) {
  if (currentCacheSize + size > CACHE_CONFIG.MAX_CACHE_SIZE) {
    await cleanupCache();
  }
  return currentCacheSize + size <= CACHE_CONFIG.MAX_CACHE_SIZE;
}

async function cleanupCache() {
  const cache = await caches.open(CACHE_CONFIG.IMAGE_CACHE);
  const keys = await cache.keys();
  
  // Sort by timestamp (oldest first)
  const entries = await Promise.all(
    keys.map(async request => {
      const response = await cache.match(request);
      const cacheData = await response.json();
      return { request, timestamp: cacheData.timestamp, size: cacheData.size };
    })
  );
  
  entries.sort((a, b) => a.timestamp - b.timestamp);
  
  // Remove oldest entries until we have enough space
  for (const entry of entries) {
    if (currentCacheSize <= CACHE_CONFIG.MAX_CACHE_SIZE * 0.8) break;
    await cache.delete(entry.request);
    currentCacheSize -= entry.size;
  }
}

async function updateCacheSize(size) {
  currentCacheSize += size;
  if (currentCacheSize > CACHE_CONFIG.MAX_CACHE_SIZE) {
    await cleanupCache();
  }
}

async function preloadCriticalImages(cache) {
  const criticalImages = [
    '/images/hero.jpg',
    '/images/logo.png',
    '/images/banner.webp'
  ];
  
  return Promise.all(
    criticalImages.map(async url => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          await cache.put(url, response.clone());
          const size = parseInt(response.headers.get('content-length') || '0');
          await updateCacheSize(size);
        }
      } catch (error) {
        console.error(`Failed to preload ${url}:`, error);
      }
    })
  );
}

async function storeFailedRequest(request) {
  const failedRequests = await self.registration.sync.getTags();
  if (!failedRequests.includes('sync-failed-requests')) {
    await self.registration.sync.register('sync-failed-requests');
  }
  // Store request details in IndexedDB for retry
}

async function syncFailedRequests() {
  // Retrieve and retry failed requests from IndexedDB
}

function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(request.url);
}

// Message event - handle cache invalidation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INVALIDATE_CACHE') {
    caches.delete(CACHE_CONFIG.IMAGE_CACHE).then(() => {
      caches.open(CACHE_CONFIG.IMAGE_CACHE);
    });
  }
}); 
