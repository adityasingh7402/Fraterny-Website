
import React, { useEffect } from 'react';
import { CDN_STORAGE_KEY } from '@/utils/cdn';
import { testCdnConnection } from '@/utils/cdn';

/**
 * Silent component that initializes the CDN settings
 * - Ensures localStorage has the CDN setting
 * - Tests the CDN connection on first load
 * - Handles CDN failures silently without user-visible notifications
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
      
      // Test CDN on first load only if enabled, but handle failures silently
      if (isCdnEnabled) {
        testCdnConnection()
          .then(isAvailable => {
            if (!isAvailable) {
              console.warn('[CDN Initializer] CDN test failed, silently falling back to direct URLs');
              // No toast notification - just log to console for debugging
            } else {
              console.log('[CDN Initializer] CDN test successful');
            }
          })
          .catch(error => {
            // Log error but don't show any user-facing notification
            console.error('[CDN Initializer] Error testing CDN:', error);
          });
      }
    }
  }, []); 
  
  // This component doesn't render anything
  return null;
};

export default CdnInitializer;
