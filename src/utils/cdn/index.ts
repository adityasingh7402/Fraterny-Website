
/**
 * CDN utilities index file
 * Re-exports all CDN-related functions
 */
export * from './cdnConfig';
export * from './cdnExclusions';
export * from './cdnNetwork';
export * from './cdnUrlService';

/**
 * Test the CDN connection by attempting to load a test image
 * Returns true if the CDN is available, false otherwise
 */
export const testCdnConnection = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const testImage = new Image();
      const timestamp = Date.now();
      
      // Use a known path with timestamp to avoid caching
      const { CDN_URL } = await import('./cdnConfig');
      testImage.src = `${CDN_URL}/test-connection.png?t=${timestamp}`;
      
      // Set a timeout in case the image takes too long to load
      const timeoutId = setTimeout(() => {
        console.warn('[CDN] Connection test timeout');
        resolve(false);
      }, 5000);
      
      testImage.onload = () => {
        clearTimeout(timeoutId);
        console.log('[CDN] Connection test successful');
        resolve(true);
      };
      
      testImage.onerror = () => {
        clearTimeout(timeoutId);
        console.warn('[CDN] Connection test failed');
        resolve(false);
      };
    } catch (error) {
      console.error('[CDN] Error testing connection:', error);
      resolve(false);
    }
  });
};
