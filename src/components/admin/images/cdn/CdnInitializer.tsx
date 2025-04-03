
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { CDN_STORAGE_KEY } from '@/utils/cdn';
import { testCdnConnection } from '@/utils/cdn';

/**
 * Silent component that initializes the CDN settings
 * - Ensures localStorage has the CDN setting
 * - Tests the CDN connection on first load
 * - Shows a toast notification if CDN fails
 * - Prevents duplicate toasts
 */
const CdnInitializer = () => {
  // Add state to track if we've already shown a toast
  const [hasShownToast, setHasShownToast] = useState(false);

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
            if (!isAvailable && !hasShownToast) {
              console.warn('[CDN Initializer] CDN test failed, falling back to direct URLs');
              toast.warning('Image CDN warning', {
                description: 'CDN test failed, images may load slower. Try refreshing the page.',
                duration: 10000, // Longer duration so user can read it
                id: 'cdn-warning', // Unique ID prevents duplicate toasts
              });
              setHasShownToast(true);
            } else if (isAvailable) {
              console.log('[CDN Initializer] CDN test successful');
            }
          })
          .catch(error => {
            console.error('[CDN Initializer] Error testing CDN:', error);
            
            // Show toast only once
            if (!hasShownToast) {
              toast.error('Image CDN error', {
                description: 'Unable to connect to image CDN. Using direct image loading.',
                duration: 7000,
                id: 'cdn-error', // Unique ID prevents duplicate toasts
              });
              setHasShownToast(true);
            }
          });
      }
    }
  }, [hasShownToast]); // Only run again if toast state changes
  
  // This component doesn't render anything
  return null;
};

export default CdnInitializer;
