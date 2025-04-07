// Service Worker for image caching and offline support
// Version: 1.0.0

const CACHE_NAME = 'image-cache-v1';
const PLACEHOLDER_CACHE = 'placeholder-cache-v1';

// Critical assets to cache immediately
const CRITICAL_ASSETS = [
  '/placeholder.svg',
  '/images/loading.gif'
];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME),
      caches.open(PLACEHOLDER_CACHE)
    ]).then(([imageCache, placeholderCache]) => {
      return Promise.all([
        imageCache.addAll(CRITICAL_ASSETS),
        placeholderCache.addAll(['/placeholder.svg'])
      ]);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('image-cache-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch event - implement cache-first strategy for images
self.addEventListener('fetch', (event) => {
  // Only handle image requests
  if (!event.request.url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found
      if (response) {
        return response;
      }

      // Fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache if not successful
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Cache the new response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // If fetch fails, return placeholder
        return caches.match('/placeholder.svg');
      });
    })
  );
});

// Message event - handle cache invalidation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INVALIDATE_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      caches.open(CACHE_NAME);
    });
  }
}); 