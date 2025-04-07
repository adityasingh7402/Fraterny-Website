// Service Worker Registration Utility
// Handles registration, updates, and development mode bypass

import { isLocalhost } from './environment';

// Cache invalidation types
export type CacheInvalidationType = 'all' | 'image' | 'placeholder';

// Service worker registration options
const SW_CONFIG = {
  scope: '/',
  updateInterval: 24 * 60 * 60 * 1000, // 24 hours
  retryCount: 3,
  retryDelay: 1000 // 1 second
};

// Track registration state
let registration: ServiceWorkerRegistration | null = null;
let lastUpdateCheck = 0;

/**
 * Register the service worker with enhanced error handling and retry logic
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (isLocalhost) {
    console.log('Service worker bypassed in development mode');
    return Promise.reject(new Error('Service worker disabled in development'));
  }

  if (registration) {
    return registration;
  }

  let retries = 0;
  while (retries < SW_CONFIG.retryCount) {
    try {
      registration = await navigator.serviceWorker.register('/sw.js', {
        scope: SW_CONFIG.scope
      });

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration!.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              console.log('New content is available; please refresh.');
              // You could show a refresh prompt to the user here
            }
          });
        }
      });

      // Handle errors
      registration.addEventListener('error', (event) => {
        console.error('Service worker error:', event);
        // Implement error reporting here
      });

      // Check for updates periodically
      setInterval(checkForUpdates, SW_CONFIG.updateInterval);

      return registration;
    } catch (error) {
      console.error(`Service worker registration failed (attempt ${retries + 1}):`, error);
      retries++;
      if (retries < SW_CONFIG.retryCount) {
        await new Promise(resolve => setTimeout(resolve, SW_CONFIG.retryDelay));
      }
    }
  }

  throw new Error('Service worker registration failed after multiple attempts');
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!registration) {
    return false;
  }

  try {
    const unregistered = await registration.unregister();
    registration = null;
    return unregistered;
  } catch (error) {
    console.error('Service worker unregistration failed:', error);
    return false;
  }
}

/**
 * Invalidate specific cache types
 */
export async function invalidateCache(type: CacheInvalidationType = 'all'): Promise<void> {
  if (!registration?.active) {
    throw new Error('Service worker not active');
  }

  try {
    await registration.active.postMessage({
      type: 'INVALIDATE_CACHE',
      cacheType: type
    });
  } catch (error) {
    console.error('Cache invalidation failed:', error);
    throw error;
  }
}

/**
 * Check for service worker updates
 */
async function checkForUpdates(): Promise<void> {
  if (!registration || Date.now() - lastUpdateCheck < SW_CONFIG.updateInterval) {
    return;
  }

  try {
    await registration.update();
    lastUpdateCheck = Date.now();
  } catch (error) {
    console.error('Service worker update check failed:', error);
  }
}

/**
 * Get cache status and statistics
 */
export async function getCacheStatus(): Promise<{
  size: number;
  itemCount: number;
  lastUpdated: number;
}> {
  if (!registration?.active) {
    throw new Error('Service worker not active');
  }

  return new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      if (event.data.error) {
        reject(new Error(event.data.error));
      } else {
        resolve(event.data);
      }
    };

    try {
      registration.active.postMessage(
        { type: 'GET_CACHE_STATUS' },
        [messageChannel.port2]
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Clear specific cache types
 */
export async function clearCache(type: CacheInvalidationType = 'all'): Promise<void> {
  if (!registration?.active) {
    throw new Error('Service worker not active');
  }

  try {
    await registration.active.postMessage({
      type: 'CLEAR_CACHE',
      cacheType: type
    });
  } catch (error) {
    console.error('Cache clearing failed:', error);
    throw error;
  }
} 
