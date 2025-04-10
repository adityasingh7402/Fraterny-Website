import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { updateGlobalCacheVersion } from '@/services/images';

export const CacheVersionControl = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateCacheVersion = async () => {
    try {
      setIsUpdating(true);
      await updateGlobalCacheVersion();
      toast({
        title: 'Success',
        description: 'Cache version updated successfully',
      });
    } catch (error) {
      console.error('Error updating cache version:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cache version',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Cache Version Control</h3>
          <p className="text-sm text-muted-foreground">
            Update the global cache version to force clients to refresh their cached images
          </p>
        </div>
        <Button
          onClick={handleUpdateCacheVersion}
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Update Cache Version'}
        </Button>
      </div>
    </div>
  );
};
