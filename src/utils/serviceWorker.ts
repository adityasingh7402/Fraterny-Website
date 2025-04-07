// Service Worker Registration Utility
// Handles registration, updates, and development mode bypass

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function registerServiceWorker() {
  if (process.env.NODE_ENV === 'development' && isLocalhost) {
    // Bypass service worker in development
    return Promise.resolve();
  }

  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful');
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  }
  
  return Promise.resolve();
}

export function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

// Cache invalidation utility
export function invalidateImageCache() {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'INVALIDATE_CACHE'
    });
  }
} 