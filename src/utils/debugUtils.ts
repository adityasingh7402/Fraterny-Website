
/**
 * Utility functions for debugging
 */

/**
 * Check if a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Log a debug message with timestamp
 */
export const logDebug = (message: string, data?: any): void => {
  if (process.env.NODE_ENV !== 'production') {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`, data || '');
  }
};

/**
 * Format bytes as human-readable string
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
