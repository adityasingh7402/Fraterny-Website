
/**
 * Service Worker Registration Utility
 * 
 * This module handles:
 * - Registration of the service worker
 * - Communication with the service worker
 * - Cache invalidation
 * - Version synchronization with server
 */

import { getGlobalCacheVersion } from "@/services/images/services/cacheVersionService";

// Check if service workers are supported
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

// Register the service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.log('Service workers are not supported in this browser');
    return null;
  }
  
  try {
    // Register the service worker with scope set to root
    const registration = await navigator.serviceWorker.register('/serviceWorker.js', {
      scope: '/'
    });
    
    console.log('Service Worker registered successfully:', registration.scope);
    
    // Sync cache version with server
    syncCacheVersionWithServer();
    
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

// Sync cache version with server
export const syncCacheVersionWithServer = async (): Promise<void> => {
  if (!isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
    return;
  }
  
  try {
    // Get the global cache version from server
    const cacheVersion = await getGlobalCacheVersion();
    
    if (cacheVersion) {
      // Send message to service worker to update cache version
      navigator.serviceWorker.controller.postMessage({
        action: 'updateCacheVersion',
        version: cacheVersion
      });
    }
  } catch (error) {
    console.error('Failed to sync cache version with server:', error);
  }
};

// Send message to clear the service worker cache
export const clearServiceWorkerCache = async (key?: string): Promise<boolean> => {
  if (!isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
    return false;
  }
  
  return new Promise((resolve) => {
    // Create a one-time message handler to get response
    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.action === 'clearCache') {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
        resolve(event.data.status === 'success');
      }
    };
    
    // Add the message listener
    navigator.serviceWorker.addEventListener('message', messageHandler);
    
    // Send message to clear cache
    navigator.serviceWorker.controller.postMessage({
      action: 'clearCache',
      key: key // Optional specific key/pattern to clear
    });
    
    // Set timeout in case we don't get a response
    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
      resolve(false);
    }, 3000);
  });
};

// Update the service worker cache version
export const updateServiceWorkerCacheVersion = async (version: string): Promise<boolean> => {
  if (!isServiceWorkerSupported() || !navigator.serviceWorker.controller) {
    return false;
  }
  
  return new Promise((resolve) => {
    // Create a one-time message handler to get response
    const messageHandler = (event: MessageEvent) => {
      if (event.data && event.data.action === 'updateCacheVersion') {
        navigator.serviceWorker.removeEventListener('message', messageHandler);
        resolve(event.data.status === 'success');
      }
    };
    
    // Add the message listener
    navigator.serviceWorker.addEventListener('message', messageHandler);
    
    // Send message to update cache version
    navigator.serviceWorker.controller.postMessage({
      action: 'updateCacheVersion',
      version: version
    });
    
    // Set timeout in case we don't get a response
    setTimeout(() => {
      navigator.serviceWorker.removeEventListener('message', messageHandler);
      resolve(false);
    }, 3000);
  });
};

// Check if the service worker is active
export const isServiceWorkerActive = (): boolean => {
  return isServiceWorkerSupported() && Boolean(navigator.serviceWorker.controller);
};
