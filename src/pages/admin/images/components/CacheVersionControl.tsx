
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import CdnTestingPanel from '@/components/admin/images/cdn/CdnTestingPanel';
import { cacheCoordinator } from '@/services/cache/cacheCoordinator';
import { dispatchCacheEvent } from '@/hooks/useCacheEvents';

const CacheVersionControl = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClearCache = async () => {
    setIsUpdating(true);
    try {
      // Use the cache coordinator to clear all caches
      await cacheCoordinator.invalidateAll({
        cascade: true,
        notifyComponents: true
      });
      
      // Dispatch a cache event for any listeners
      dispatchCacheEvent({
        type: 'clear',
        scope: 'global',
        timestamp: Date.now()
      });
      
      toast.success('Image cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('Failed to clear image cache');
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="grid gap-6">
      <CdnTestingPanel />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-navy">Cache Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700">Clear the image cache to fetch the latest images from the server.</p>
            </div>
            <Button 
              onClick={handleClearCache} 
              disabled={isUpdating} 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <RefreshCw className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheVersionControl;
