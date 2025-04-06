
/**
 * Re-exports for backward compatibility
 * This file is maintained for compatibility with existing code but should be 
 * considered deprecated. Use direct Supabase methods instead.
 */
export * from './cdnConfig';
export * from './cdnUrlService';

/**
 * Test Supabase connectivity by making a network request
 * Returns true if Supabase is available, false otherwise
 */
export const testSupabaseConnection = (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const testImage = new Image();
      const timestamp = Date.now();
      
      // Use Supabase URL
      const SUPABASE_URL = 'https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/website-images/test-connection.png';
      testImage.src = `${SUPABASE_URL}?t=${timestamp}`;
      
      // Set a timeout in case the image takes too long to load
      const timeoutId = setTimeout(() => {
        console.warn('[Storage] Connection test timeout');
        resolve(false);
      }, 5000);
      
      testImage.onload = () => {
        clearTimeout(timeoutId);
        console.log('[Storage] Connection test successful');
        resolve(true);
      };
      
      testImage.onerror = () => {
        clearTimeout(timeoutId);
        console.warn('[Storage] Connection test failed');
        resolve(false);
      };
    } catch (error) {
      console.error('[Storage] Error testing connection:', error);
      resolve(false);
    }
  });
};

// Alias for backward compatibility
export const testCdnConnection = testSupabaseConnection;
