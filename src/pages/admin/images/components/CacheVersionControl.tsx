
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Info, Settings } from "lucide-react";
import { updateGlobalCacheVersion, getGlobalCacheVersion } from '@/services/images/services/cacheVersionService';
import { clearImageCache, clearImageUrlCache } from '@/services/images';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CdnTestingPanel from '@/components/admin/images/CdnTestingPanel';

/**
 * Admin panel component for managing cache versions
 */
const CacheVersionControl = () => {
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showCdnPanel, setShowCdnPanel] = useState(false);

  // Fetch the current cache version when the component mounts
  React.useEffect(() => {
    fetchCurrentVersion();
  }, []);

  // Get the current cache version
  const fetchCurrentVersion = async () => {
    const version = await getGlobalCacheVersion();
    setCurrentVersion(version);
    
    if (version && version.startsWith('v')) {
      const timestamp = parseInt(version.substring(1));
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp);
        setLastUpdated(date.toLocaleString());
      }
    }
  };

  // Update the global cache version to invalidate all caches
  const handleUpdateVersion = async () => {
    setIsLoading(true);
    try {
      const success = await updateGlobalCacheVersion();
      if (success) {
        toast.success('Cache version updated', {
          description: 'All cached images will be refreshed on next load.',
        });
        await fetchCurrentVersion();
      } else {
        toast.error('Failed to update cache version', {
          description: 'Please try again or check the console for errors.',
        });
      }
    } catch (error) {
      console.error('Error updating cache version:', error);
      toast.error('An error occurred', {
        description: 'Could not update cache version.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all caches
  const handleClearCache = async () => {
    setIsLoading(true);
    try {
      // Clear both in-memory and URL caches
      clearImageCache();
      clearImageUrlCache();
      
      toast.success('All caches cleared', {
        description: 'The application will fetch fresh data on next load.',
      });
    } catch (error) {
      console.error('Error clearing caches:', error);
      toast.error('An error occurred', {
        description: 'Could not clear caches.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle CDN panel visibility
  const toggleCdnPanel = () => {
    setShowCdnPanel(!showCdnPanel);
  };

  return (
    <Card className="bg-white shadow-sm border">
      <CardHeader className="bg-navy bg-opacity-5 pb-2">
        <CardTitle className="text-navy text-lg flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Cache Version Control
        </CardTitle>
        <CardDescription>
          Manage image caching and versioning
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4 px-4">
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-navy">Current Cache Version</span>
            <span className="bg-navy bg-opacity-5 px-3 py-2 rounded text-sm font-mono">
              {currentVersion || 'No version set'}
            </span>
            {lastUpdated && (
              <span className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdated}
              </span>
            )}
          </div>

          <div className="flex items-center p-3 border border-amber-200 bg-amber-50 rounded-md">
            <Info className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Updating the cache version will force browsers to download fresh copies of all images, 
              even if they were previously cached. Use this when you've updated images but users are still seeing old versions.
            </p>
          </div>
          
          {/* CDN Settings Section */}
          <div className="border-t pt-4">
            <Button 
              variant="outline" 
              className="flex items-center space-x-2 mb-4 text-sm"
              onClick={toggleCdnPanel}
              size="sm"
            >
              <Settings className="h-4 w-4" />
              <span>{showCdnPanel ? 'Hide CDN Settings' : 'Show CDN Settings'}</span>
            </Button>
            
            {showCdnPanel && <CdnTestingPanel />}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 pt-2 border-t px-4">
        <Button 
          variant="default" 
          className="bg-navy text-white hover:bg-navy hover:bg-opacity-90"
          onClick={handleUpdateVersion} 
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Cache Version'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleClearCache} 
          disabled={isLoading}
        >
          Clear All Caches
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CacheVersionControl;
