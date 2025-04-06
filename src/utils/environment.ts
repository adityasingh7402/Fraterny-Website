
/**
 * Utility functions for detecting the runtime environment
 */

// Check if code is running in a browser environment
export const isBrowser = typeof window !== 'undefined';

// Check if code is running in a server environment
export const isServer = !isBrowser;

// Check if we're in development mode
export const isDevelopment = process.env.NODE_ENV === 'development';

// Check if we're in production mode
export const isProduction = process.env.NODE_ENV === 'production';

// Get approximate network information safely
export const getNetworkInfo = () => {
  if (!isBrowser) {
    return {
      online: true,
      saveData: false,
      effectiveType: '4g',
      rtt: 50
    };
  }
  
  const connection = 
    (navigator as any).connection || 
    (navigator as any).mozConnection || 
    (navigator as any).webkitConnection;
    
  return {
    online: navigator.onLine,
    saveData: connection?.saveData || false,
    effectiveType: connection?.effectiveType || '4g',
    rtt: connection?.rtt || 50
  };
};
