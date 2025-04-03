
import { useEffect } from 'react';
import { toast } from 'sonner';
import { CDN_STORAGE_KEY } from '@/utils/cdn';
import { testCdnConnection } from '@/utils/cdn';

/**
 * Silent component that initializes the CDN settings
 * - Ensures localStorage has the CDN setting
 * - Tests the CDN connection on first load
 * - Shows a toast notification if CDN fails
 */
const CdnInitializer = () => {
  useEffect(() => {
    // Initialize CDN setting if not already set
    if (typeof window !== 'undefined') {
      if (localStorage.getItem(CDN_STORAGE_KEY) === null) {
        console.log('[CDN Initializer] Setting CDN to enabled by default');
        localStorage.setItem(CDN_STORAGE_KEY, 'true');
      }
      
      const isCdnEnabled = localStorage.getItem(CDN_STORAGE_KEY) === 'true';
      console.log(`[CDN Initializer] CDN is currently ${isCdnEnabled ? 'enabled' : 'disabled'}`);
      
      // Test CDN on first load only if enabled
      if (isCdnEnabled) {
        testCdnConnection()
          .then(isAvailable => {
            if (!isAvailable) {
              console.error('[CDN Initializer] CDN test failed, but using anyway');
              toast.warning('Image CDN warning', {
                description: 'CDN test failed, images may load slower. Try refreshing the page.',
              });
            } else {
              console.log('[CDN Initializer] CDN test successful');
            }
          })
          .catch(error => {
            console.error('[CDN Initializer] Error testing CDN:', error);
          });
      }
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default CdnInitializer;
