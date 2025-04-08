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

// Add service worker config storage
let serviceWorkerConfig = null;

// Add the preloadCriticalImages function
async function preloadCriticalImages(cache) {
  if (!serviceWorkerConfig?.supabaseUrl) {
    console.warn('Service worker not initialized with Supabase URL');
    return;
  }

  try {
    const criticalAssets = CACHE_CONFIG.CRITICAL_ASSETS.map(path => {
      // If the path is already a full URL, use it as is
      if (path.startsWith('http')) return path;
      // Otherwise, construct the Supabase URL
      return `${serviceWorkerConfig.supabaseUrl}/storage/v1/object/public${path}`;
    });

    return Promise.all(
      criticalAssets.map(async (url) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const responseClone = response.clone();
            await cache.put(url, responseClone);
            return;
          }
          console.warn(`Failed to fetch: ${url}`);
        } catch (error) {
          console.error(`Failed to preload: ${url}`, error);
        }
      })
    );
  } catch (error) {
    console.error('Error in preloadCriticalImages:', error);
  }
}

// Performance Monitoring
const PERFORMANCE_METRICS = {
  cacheHits: 0,
  cacheMisses: 0,
  totalRequests: 0,
  startTime: Date.now()
};

// Cache Warming Strategy
const CACHE_WARMING = {
  prefetchThreshold: 0.7,
  maxPrefetch: 5,
  compressionEnabled: true,
  recentlyAccessed: new Map(),
  accessCounts: new Map()
};

// Loading Strategy
const LOADING_STRATEGY = {
  progressiveLoading: true,
  networkAware: true,
  aboveFoldPriority: true,
  connectionTypes: {
    'slow-2g': { quality: 0.5, maxSize: 100 * 1024 },
    '2g': { quality: 0.7, maxSize: 250 * 1024 },
    '3g': { quality: 0.8, maxSize: 500 * 1024 },
    '4g': { quality: 1.0, maxSize: Infinity }
  }
};

// Offline Strategy
const OFFLINE_STRATEGY = {
  queueSize: 100,
  retryInterval: 5000,
  maxRetries: 3,
  syncStrategy: 'periodic',
  failedRequests: new Map()
};

// Cache size tracking
let currentCacheSize = 0;
const cacheSizeMap = new Map();

// IndexedDB Configuration
const DB_CONFIG = {
  name: 'ImageCacheDB',
  version: 1,
  stores: {
    failedRequests: 'failedRequests',
    syncQueue: 'syncQueue',
    metrics: 'metrics'
  }
};

let db = null;

// URL normalization for Supabase storage
function normalizeImageUrl(url) {
  if (!serviceWorkerConfig?.supabaseUrl) {
    return url;
  }

  const urlObj = new URL(url);
  
  // If it's already a Supabase URL, return as is
  if (urlObj.origin === serviceWorkerConfig.supabaseUrl) {
    return url;
  }

  // If it's a relative path starting with /images, convert to Supabase URL
  if (url.startsWith('/images/')) {
    return `${serviceWorkerConfig.supabaseUrl}/storage/v1/object/public${url}`;
  }

  return url;
}

// Install event - Enhanced caching of critical assets
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
            return compressAndCache(response, url, placeholderCache);
          })
        ),
        preloadCriticalImages(imageCache),
        initializeIndexedDB()
      ]);
    })
  );
});

// Activate event - Enhanced cleanup
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      cleanupOldCaches(),
      cleanupExpiredEntries(),
      initializePerformanceMonitoring()
    ])
  );
});

// Fetch event - Enhanced caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Update access tracking
  updateAccessTracking(url.toString());
  
  if (isImageRequest(event.request)) {
    const normalizedUrl = normalizeImageUrl(url.toString());
    const normalizedRequest = normalizedUrl === url.toString() 
      ? event.request 
      : new Request(normalizedUrl, event.request);
      
    event.respondWith(
      handleImageRequest(normalizedRequest, new URL(normalizedUrl))
    );
  }
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-failed-requests') {
    event.waitUntil(processFailedRequests());
  }
});

// Periodic sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'periodic-sync') {
    event.waitUntil(syncOfflineChanges());
  }
});

// Message event handler for cache operations
self.addEventListener('message', (event) => {
  if (event.data && event.data.type) {
    switch (event.data.type) {
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
    }
  }
});

// Message event - handle cache invalidation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'INVALIDATE_CACHE') {
    caches.delete(CACHE_CONFIG.IMAGE_CACHE).then(() => {
      caches.open(CACHE_CONFIG.IMAGE_CACHE);
    });
  }
});

// Add initialization message handler
self.addEventListener('message', (event) => {
  if (event.data?.type === 'INITIALIZE') {
    serviceWorkerConfig = event.data.config;
    console.log('Service worker initialized with config:', serviceWorkerConfig);
  }
});

// Helper Functions
async function handleImageRequest(request, url) {
  const cache = await caches.open(CACHE_CONFIG.IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  PERFORMANCE_METRICS.totalRequests++;

  if (cachedResponse) {
    // Check if the cached response is still valid
    const cacheControl = cachedResponse.headers.get('Cache-Control');
    const maxAge = cacheControl ? parseInt(cacheControl.match(/max-age=(\d+)/)?.[1] || '0') : 0;
    const dateCreated = parseInt(cachedResponse.headers.get('X-Cache-Date') || '0');
    
    if (Date.now() - dateCreated < (maxAge * 1000 || CACHE_CONFIG.CACHE_EXPIRATION)) {
      PERFORMANCE_METRICS.cacheHits++;
      return cachedResponse;
    }
  }

  PERFORMANCE_METRICS.cacheMisses++;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const clonedResponse = response.clone();
      
      // Add cache date header
      const headers = new Headers(clonedResponse.headers);
      headers.set('X-Cache-Date', Date.now().toString());
      
      const cachedResponse = new Response(await clonedResponse.blob(), {
        status: clonedResponse.status,
        statusText: clonedResponse.statusText,
        headers: headers
      });
      
      await cache.put(request, cachedResponse.clone());
      return response;
    }
    throw new Error('Network response was not ok');
  } catch (error) {
    console.error('Error fetching image:', error);
    if (cachedResponse) {
      return cachedResponse;
    }
    await queueFailedRequest(request);
    return getPlaceholderResponse(request);
  }
}

async function optimizeAndCacheResponse(response, request, cache) {
  const contentLength = response.headers.get('content-length');
  if (contentLength) {
    const size = parseInt(contentLength);
    if (await canCache(size)) {
      const optimizedResponse = await optimizeResponseForNetwork(response.clone());
      const cacheData = {
        timestamp: Date.now(),
        size: size,
        accessCount: 1
      };
      await cache.put(request, optimizedResponse);
      await updateCacheSize(size);
      return optimizedResponse;
    }
  }
  return response;
}

async function optimizeResponseForNetwork(response) {
  const connection = navigator.connection;
  if (connection && LOADING_STRATEGY.networkAware) {
    const { quality, maxSize } = LOADING_STRATEGY.connectionTypes[connection.effectiveType] || 
                                LOADING_STRATEGY.connectionTypes['4g'];
    
    if (LOADING_STRATEGY.progressiveLoading) {
      return applyProgressiveLoading(response, quality, maxSize);
    }
  }
  return response;
}

async function applyProgressiveLoading(response, quality, maxSize) {
  try {
    const blob = await response.blob();
    const originalSize = blob.size;
    
    if (originalSize <= maxSize) {
      return response;
    }
    
    // Create a canvas for resizing
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(
      Math.floor(bitmap.width * quality),
      Math.floor(bitmap.height * quality)
    );
    const ctx = canvas.getContext('2d');
    
    // Draw the resized image
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    
    // Get compressed data
    const compressedBlob = await canvas.convertToBlob({
      type: 'image/webp',
      quality: 0.8
    });
    
    // Create new response with compressed data
    return new Response(compressedBlob, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers({
        'Content-Type': 'image/webp',
        'Content-Length': compressedBlob.size.toString()
      })
    });
  } catch (error) {
    console.error('Progressive loading failed:', error);
    return response;
  }
}

async function compressAndCache(response, url, cache) {
  if (!CACHE_WARMING.compressionEnabled) {
    return cache.put(url, response);
  }

  try {
    // Create a canvas to compress the image
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    
    // Draw the image
    ctx.drawImage(bitmap, 0, 0);
    
    // Get compressed data
    const compressedBlob = await canvas.convertToBlob({
      type: 'image/webp',
      quality: 0.8
    });
    
    // Create new response with compressed data
    const compressedResponse = new Response(compressedBlob, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers({
        'Content-Type': 'image/webp',
        'Content-Length': compressedBlob.size.toString()
      })
    });
    
    return cache.put(url, compressedResponse);
  } catch (error) {
    console.error('Compression failed:', error);
    return cache.put(url, response);
  }
}

async function updateAccessTracking(url) {
  const count = (CACHE_WARMING.accessCounts.get(url) || 0) + 1;
  CACHE_WARMING.accessCounts.set(url, count);
  CACHE_WARMING.recentlyAccessed.set(url, Date.now());
  
  // Trigger prefetch if threshold is met
  if (count / PERFORMANCE_METRICS.totalRequests > CACHE_WARMING.prefetchThreshold) {
    await prefetchRelatedContent(url);
  }
}

async function prefetchRelatedContent(url) {
  // Implement prefetching logic based on access patterns
  // This would involve analyzing the URL and prefetching
  // related content that's likely to be accessed next
}

async function initializeIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.failedRequests)) {
        const store = db.createObjectStore(DB_CONFIG.stores.failedRequests, {
          keyPath: 'url'
        });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.syncQueue)) {
        const store = db.createObjectStore(DB_CONFIG.stores.syncQueue, {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('status', 'status', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(DB_CONFIG.stores.metrics)) {
        db.createObjectStore(DB_CONFIG.stores.metrics, {
          keyPath: 'timestamp'
        });
      }
    };
  });
}

async function queueFailedRequest(request) {
  if (!db) {
    await initializeIndexedDB();
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_CONFIG.stores.failedRequests, 'readwrite');
    const store = transaction.objectStore(DB_CONFIG.stores.failedRequests);
    
    const entry = {
      url: request.url,
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      timestamp: Date.now(),
      retryCount: 0
    };
    
    const request = store.put(entry);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function processFailedRequests() {
  if (!db) {
    await initializeIndexedDB();
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_CONFIG.stores.failedRequests, 'readwrite');
    const store = transaction.objectStore(DB_CONFIG.stores.failedRequests);
    const index = store.index('timestamp');
    
    const request = index.openCursor();
    const results = [];
    
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(cursor.value);
        cursor.continue();
      } else {
        processResults(results).then(resolve).catch(reject);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function processResults(requests) {
  for (const request of requests) {
    if (request.retryCount >= OFFLINE_STRATEGY.maxRetries) {
      await removeFailedRequest(request.url);
      continue;
    }
    
    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: new Headers(request.headers)
      });
      
      if (response.ok) {
        await cacheResponse(response, new Request(request.url));
        await removeFailedRequest(request.url);
      } else {
        await updateRetryCount(request.url);
      }
    } catch (error) {
      await updateRetryCount(request.url);
    }
  }
}

async function removeFailedRequest(url) {
  if (!db) return;
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_CONFIG.stores.failedRequests, 'readwrite');
    const store = transaction.objectStore(DB_CONFIG.stores.failedRequests);
    
    const request = store.delete(url);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function updateRetryCount(url) {
  if (!db) return;
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_CONFIG.stores.failedRequests, 'readwrite');
    const store = transaction.objectStore(DB_CONFIG.stores.failedRequests);
    
    const request = store.get(url);
    
    request.onsuccess = () => {
      const data = request.result;
      if (data) {
        data.retryCount++;
        store.put(data).onsuccess = () => resolve(data);
      }
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function syncOfflineChanges() {
  if (!db) {
    await initializeIndexedDB();
  }
  
  // Process failed requests
  await processFailedRequests();
  
  // Update metrics
  await updateMetrics();
}

async function updateMetrics() {
  if (!db) return;
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(DB_CONFIG.stores.metrics, 'readwrite');
    const store = transaction.objectStore(DB_CONFIG.stores.metrics);
    
    const metrics = {
      timestamp: Date.now(),
      cacheHitRate: PERFORMANCE_METRICS.cacheHits / PERFORMANCE_METRICS.totalRequests,
      totalRequests: PERFORMANCE_METRICS.totalRequests,
      averageLoadTime: (Date.now() - PERFORMANCE_METRICS.startTime) / PERFORMANCE_METRICS.totalRequests
    };
    
    const request = store.put(metrics);
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(request.url);
}

async function getPlaceholderResponse(request) {
  try {
    // Try to get a placeholder from cache
    const placeholderCache = await caches.open(CACHE_CONFIG.PLACEHOLDER_CACHE);
    const placeholder = await placeholderCache.match('/placeholder.svg');
    
    if (placeholder) {
      return placeholder;
    }
    
    // If no placeholder in cache, create a data URL
    const canvas = new OffscreenCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    
    // Create a simple placeholder
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, 100, 100);
    ctx.fillStyle = '#999';
    ctx.font = '12px Arial';
    ctx.fillText('Loading...', 20, 50);
    
    const blob = await canvas.convertToBlob({ type: 'image/png' });
    return new Response(blob, {
      headers: new Headers({
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000'
      })
    });
  } catch (error) {
    console.error('Placeholder generation failed:', error);
    return new Response('', { status: 404 });
  }
} 
