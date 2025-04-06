
/**
 * Hook for checking and fixing image storage path consistency
 */
import { useState } from 'react';
import { fixInconsistentBucketNames } from '@/services/images/utils/fixBucketNameConsistency';
import { clearImageCache, clearImageUrlCache } from '@/services/images';

export const useImageConsistencyCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckResult, setLastCheckResult] = useState<{
    scanned: number;
    fixed: number;
    errors: number;
    timestamp: string;
  } | null>(null);

  const checkAndFixConsistency = async () => {
    setIsChecking(true);
    
    try {
      // Run the consistency check
      const result = await fixInconsistentBucketNames();
      
      // Clear caches to ensure we use the updated paths
      clearImageCache();
      clearImageUrlCache();
      
      // Update the result state
      setLastCheckResult({
        ...result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error during image consistency check:', error);
      
      setLastCheckResult({
        scanned: 0,
        fixed: 0,
        errors: 1,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    lastCheckResult,
    checkAndFixConsistency
  };
};
