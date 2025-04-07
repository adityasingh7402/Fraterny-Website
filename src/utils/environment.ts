/**
 * Environment utility functions
 */

/**
 * Check if the application is running on localhost
 */
export const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname === '[::1]'
);

/**
 * Check if the current environment is development
 */
export const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Get the current environment
 */
export const getEnvironment = (): 'development' | 'production' => {
  return process.env.NODE_ENV as 'development' | 'production';
}; 