import { storageUtils } from "@/utils/storageUtils";

class LocalStorageCacheService {
  private readonly storageKeyPrefix = 'fraterny_image_cache_';

  /**
   * Initialize the localStorage cache service
   */
  initialize(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      console.log('LocalStorage cache service is available');
    } else {
      console.warn('LocalStorage is not available in this environment');
    }
  }

  /**
   * Check if localStorage is valid and available
   */
  isValid(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  /**
   * Get a value from localStorage
   * @param key
   */
  get(key: string): any | null {
    try {
      if (!this.isValid()) return null;
      
      const stored = localStorage.getItem(`${this.storageKeyPrefix}${key}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  /**
   * Set a value in localStorage
   * @param key
   * @param value
   */
  set(key: string, value: any): boolean {
    try {
      if (!this.isValid()) return false;
      
      localStorage.setItem(`${this.storageKeyPrefix}${key}`, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      return false;
    }
  }

  /**
   * Remove a value from localStorage
   * @param key
   */
  remove(key: string): boolean {
    try {
      if (!this.isValid()) return false;
      
      localStorage.removeItem(`${this.storageKeyPrefix}${key}`);
      return true;
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
      return false;
    }
  }

  /**
   * Clear all keys with the storageKeyPrefix
   */
  clear(): boolean {
    try {
      if (!this.isValid()) return false;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storageKeyPrefix)) {
          localStorage.removeItem(key);
        }
      }
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Set a value with compression in localStorage
   * @param key
   * @param value
   */
  setWithCompression(key: string, value: any): boolean {
    try {
      if (!this.isValid()) return false;
      
      storageUtils.setWithCompression(`${this.storageKeyPrefix}${key}`, value);
      return true;
    } catch (error) {
      console.error('Error setting item with compression in localStorage:', error);
      return false;
    }
  }

  /**
   * Get a value with decompression from localStorage
   * @param key
   */
  getWithDecompression(key: string): any | null {
    try {
      if (!this.isValid()) return null;
      
      return storageUtils.getWithDecompression(`${this.storageKeyPrefix}${key}`);
    } catch (error) {
      console.error('Error getting item with decompression from localStorage:', error);
      return null;
    }
  }

  /**
   * Clean expired entries from localStorage
   */
  cleanExpired(): boolean {
    try {
      if (!this.isValid()) return false;
      
      let count = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storageKeyPrefix) && key.endsWith('_expiry')) {
          const baseKey = key.replace('_expiry', '');
          const expiry = this.get(key);
          if (expiry && expiry < Date.now()) {
            localStorage.removeItem(key);
            localStorage.removeItem(baseKey);
            count++;
          }
        }
      }
      
      console.log(`Cleaned ${count} expired entries from localStorage`);
      return true;
    } catch (error) {
      console.error('Error cleaning expired entries from localStorage:', error);
      return false;
    }
  }

  /**
   * Get the global version from localStorage
   */
  getGlobalVersion(): string | null {
    try {
      if (!this.isValid()) return null;

      const stored = this.getWithDecompression(`${this.storageKeyPrefix}global_version`);
      return stored ? stored.value : null;
    } catch (error) {
      console.error('Error getting global version from localStorage:', error);
      return null;
    }
  }

  /**
   * Update the global version in both localStorage and service worker
   */
  updateGlobalVersion(version: string): boolean {
    try {
      // Store in localStorage
      storageUtils.setWithCompression(`${this.storageKeyPrefix}global_version`, {
        value: version,
        timestamp: Date.now()
      });

      // Try to propagate to service worker if available
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          action: 'updateCacheVersion',
          version: version
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to update global version:', error);
      return false;
    }
  }
}

export const localStorageCacheService = new LocalStorageCacheService();
