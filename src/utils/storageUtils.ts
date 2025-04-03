
import LZString from 'lz-string';

/**
 * Utility functions for handling compressed storage
 */
export const storageUtils = {
  /**
   * Store data in localStorage with compression
   */
  setWithCompression: (key: string, value: any): boolean => {
    try {
      const compressedValue = LZString.compress(JSON.stringify(value));
      localStorage.setItem(key, compressedValue);
      return true;
    } catch (error) {
      console.error('Error storing compressed data in localStorage:', error);
      return false;
    }
  },

  /**
   * Retrieve and decompress data from localStorage
   */
  getWithDecompression: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const compressedValue = localStorage.getItem(key);
      if (!compressedValue) return defaultValue || null;
      
      const decompressedValue = LZString.decompress(compressedValue);
      if (!decompressedValue) return defaultValue || null;
      
      return JSON.parse(decompressedValue) as T;
    } catch (error) {
      console.error('Error retrieving compressed data from localStorage:', error);
      return defaultValue || null;
    }
  },

  /**
   * Check if localStorage is available
   */
  isStorageAvailable: (): boolean => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Get approximate size of localStorage usage
   */
  getStorageSize: (): number => {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i) || '';
      const value = localStorage.getItem(key) || '';
      totalSize += key.length + value.length;
    }
    return totalSize;
  },
  
  /**
   * Check if we're approaching storage limits (80% of typical 5MB limit)
   */
  isApproachingStorageLimit: (): boolean => {
    const approxSize = storageUtils.getStorageSize();
    const limitThreshold = 4 * 1024 * 1024; // 4MB (~80% of typical 5MB limit)
    return approxSize > limitThreshold;
  }
};
