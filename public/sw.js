
// Service Worker for image caching and offline support
// Version: 1.1.0

// Service Worker Configuration
const CACHE_CONFIG = {
  IMAGE_CACHE: 'image-cache-v2', // Updated cache version
  PLACEHOLDER_CACHE: 'placeholder-cache-v2', // Updated cache version
  MAX_CACHE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_ITEMS: 100,
  CACHE_EXPIRATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  CRITICAL_ASSETS: [
    '/placeholder.svg'
    // Removed problematic assets that were causing errors
  ],
  INITIALIZATION_TIMEOUT: 3000 // 3 second timeout for initialization (reduced from 5s)
};

// Add service worker config storage
let serviceWorkerConfig = null;

// Add initialization promise with timeout
let initializationPromise = new Promise((resolve, reject) => {
  const timeout = setTimeout(() => {
    console.warn('Service worker initialization timed out, proceeding with default config');
    // Use a simple default config instead of null
    serviceWorkerConfig = {
      supabaseUrl: "https://eukenximajiuhrtljnpw.supabase.co",
      imageConfig: {
        maxSize: 50 * 1024 * 1024,
        supportedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
      }
    };
    resolve(serviceWorkerConfig);
  }, CACHE_CONFIG.INITIALIZATION_TIMEOUT);

  // Single message event listener for all operations
  self.addEventListener('message', (event) => {
    if (!event.data?.type) return;
    
    console.log('Service worker received message:', event.data.type);

    switch (event.data.type) {
      case 'INITIALIZE':
        clearTimeout(timeout);
        serviceWorkerConfig = event.data.config;
        console.log('Service worker initialized with config:', serviceWorkerConfig);
        resolve(serviceWorkerConfig);
        break;

      case 'GET_CACHE_STATUS':
        event.ports[0].postMessage({
          size: currentCacheSize,
          itemCount: cacheSizeMap.size,
          lastUpdated: Date.now(),
          metrics: PERFORMANCE_METRICS
        });
        break;

      case 'CLEAR_CACHE':
        clearCache(event.data.cacheType);
        break;

      case 'GET_PERFORMANCE_METRICS':
        event.ports[0].postMessage(PERFORMANCE_METRICS);
        break;

      case 'INVALIDATE_CACHE':
        caches.delete(CACHE_CONFIG.IMAGE_CACHE).then(() => {
          caches.open(CACHE_CONFIG.IMAGE_CACHE);
        });
        break;
    }
  });
});

// Performance Monitoring
const PERFORMANCE_METRICS = {
  cacheHits: 0,
  cacheMisses: 0,
  totalRequests: 0,
  startTime: Date.now()
};

// Cache size tracking
let currentCacheSize = 0;
const cacheSizeMap = new Map();

// URL normalization for Supabase storage
function normalizeImageUrl(url) {
  if (!url) return url;
  
  try {
    // Handle non-URL strings gracefully
    if (!url.startsWith('http') && !url.startsWith('/')) {
      return url;
    }

    // If config is not available, return the original URL
    if (!serviceWorkerConfig?.supabaseUrl) {
      return url;
    }

    let urlObj;
    try {
      urlObj = new URL(url);
    } catch (e) {
      // If it's not a valid URL, it might be a relative path
      if (url.startsWith('/')) {
        // It's a relative path, leave as is - we'll handle it below
      } else {
        return url; // Return the original if not a valid URL or relative path
      }
    }
    
    // If it's already a Supabase URL, return as is
    if (urlObj && urlObj.origin === serviceWorkerConfig.supabaseUrl) {
      return url;
    }

    // If it's a relative path starting with /images, convert to Supabase URL
    if (url.startsWith('/images/')) {
      return `${serviceWorkerConfig.supabaseUrl}/storage/v1/object/public${url}`;
    }

    return url;
  } catch (error) {
    console.error('Error in normalizeImageUrl:', error);
    return url; // Return the original URL in case of any error
  }
}

// Install event - Enhanced caching of critical assets
self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  
  event.waitUntil(
    (async () => {
      try {
        // Wait for initialization first
        await initializationPromise;
        console.log('Service worker initialization complete, proceeding with install');
        
        const [imageCache, placeholderCache] = await Promise.all([
          caches.open(CACHE_CONFIG.IMAGE_CACHE),
          caches.open(CACHE_CONFIG.PLACEHOLDER_CACHE)
        ]);

        // Cache the placeholder only - don't try to cache problematic files
        const placeholderResponse = await fetch('/placeholder.svg').catch(err => {
          console.warn('Could not fetch placeholder:', err);
          return null;
        });
        
        if (placeholderResponse && placeholderResponse.ok) {
          await placeholderCache.put('/placeholder.svg', placeholderResponse);
          console.log('Placeholder cached successfully');
        }
        
        console.log('Service worker installed successfully');
      } catch (error) {
        console.error('Service worker installation failed:', error);
      }
    })()
  );
});

// Activate event - Enhanced cleanup
self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches to ensure we're using the latest version
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
          name !== CACHE_CONFIG.IMAGE_CACHE && 
          name !== CACHE_CONFIG.PLACEHOLDER_CACHE &&
          (name.startsWith('image-cache') || name.startsWith('placeholder-cache'))
        );
        
        await Promise.all(oldCaches.map(cacheName => caches.delete(cacheName)));
        console.log('Old caches cleaned up successfully');
        
        // Take control immediately
        await self.clients.claim();
        console.log('Service worker activated and claimed clients');
      } catch (error) {
        console.error('Service worker activation failed:', error);
      }
    })()
  );
});

// Fetch event - Simplified caching strategy to avoid errors
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Only handle image requests to avoid errors with other types
  if (isImageRequest(event.request)) {
    event.respondWith(handleImageRequest(event.request, url));
  }
});

// Helper Functions
async function handleImageRequest(request, url) {
  try {
    PERFORMANCE_METRICS.totalRequests++;
    
    // First try network
    try {
      const networkResponse = await fetch(request.clone());
      if (networkResponse.ok) {
        // Cache the successful response but don't block the response
        const cache = await caches.open(CACHE_CONFIG.IMAGE_CACHE);
        cache.put(request, networkResponse.clone()).catch(err => {
          console.warn('Failed to cache image response:', err);
        });
        return networkResponse;
      }
    } catch (networkError) {
      console.log('Network fetch failed, trying cache:', networkError);
    }

    // Try cache if network fails
    const cache = await caches.open(CACHE_CONFIG.IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      PERFORMANCE_METRICS.cacheHits++;
      return cachedResponse;
    }
    
    PERFORMANCE_METRICS.cacheMisses++;
    
    // If neither network nor cache worked, return the placeholder
    return getPlaceholderResponse();
  } catch (error) {
    console.error('Error in handleImageRequest:', error);
    return getPlaceholderResponse();
  }
}

function isImageRequest(request) {
  if (!request || !request.url) return false;
  
  const url = request.url.toLowerCase();
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url);
}

async function getPlaceholderResponse() {
  try {
    // Try to get a placeholder from cache
    const placeholderCache = await caches.open(CACHE_CONFIG.PLACEHOLDER_CACHE);
    const placeholder = await placeholderCache.match('/placeholder.svg');
    
    if (placeholder) {
      return placeholder;
    }
    
    // If no placeholder in cache, create a simple data URL
    return new Response(
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="#999" text-anchor="middle">Image</text></svg>', 
      { 
        headers: new Headers({
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'max-age=31536000'
        })
      }
    );
  } catch (error) {
    console.error('Placeholder generation failed:', error);
    return new Response('', { status: 404 });
  }
}

// Removing the problematic compressAndCache function that was causing errors
// Also removing other complex functions that were causing issues

// Simple function to clear cache
async function clearCache(type = 'all') {
  try {
    if (type === 'all' || type === 'image') {
      await caches.delete(CACHE_CONFIG.IMAGE_CACHE);
      await caches.open(CACHE_CONFIG.IMAGE_CACHE);
    }
    
    if (type === 'all' || type === 'placeholder') {
      await caches.delete(CACHE_CONFIG.PLACEHOLDER_CACHE);
      await caches.open(CACHE_CONFIG.PLACEHOLDER_CACHE);
    }
    console.log(`Cache ${type} cleared successfully`);
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}

// Log when the service worker is loaded
console.log('Service worker v1.1.0 loaded');
