
import React, { useEffect } from 'react';

/**
 * Silent component that initializes the Supabase Storage settings
 * - Ensures localStorage has storage settings
 * - Tests the Supabase connection on first load
 * - Handles failures silently without user-visible notifications
 */
const StorageInitializer = () => {
  useEffect(() => {
    // Initialize storage settings if not already set
    if (typeof window !== 'undefined') {
      // Nothing to do - Supabase is always enabled
      console.log('[Storage Initializer] Supabase Storage is always enabled');
      
      // Test connection silently on first load
      const testConnection = async () => {
        try {
          // Simple test to check if Supabase is available
          const response = await fetch('https://eukenximajiuhrtljnpw.supabase.co/storage/v1/object/public/website-images/test-connection.png');
          const isAvailable = response.ok;
          
          if (!isAvailable) {
            console.warn('[Storage Initializer] Supabase test failed, check connection');
          } else {
            console.log('[Storage Initializer] Supabase test successful');
          }
        } catch (error) {
          // Log error but don't show any user-facing notification
          console.error('[Storage Initializer] Error testing Supabase:', error);
        }
      };
      
      testConnection();
    }
  }, []); 
  
  // This component doesn't render anything
  return null;
};

export default StorageInitializer;
