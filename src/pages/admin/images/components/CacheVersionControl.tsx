
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Info, Settings, FolderTree } from "lucide-react";
import { updateGlobalCacheVersion, getGlobalCacheVersion } from '@/services/images/services/cacheVersionService';
import { clearImageCache, clearImageUrlCache } from '@/services/images';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CdnTestingPanel from '@/components/admin/images/CdnTestingPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Admin panel component for managing cache versions with enhanced selective invalidation
 */
const CacheVersionControl = () => {
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [showCdnPanel, setShowCdnPanel] = useState(false);
  const [invalidationScope, setInvalidationScope] = useState<'global' | 'category' | 'prefix'>('global');
  const [invalidationTarget, setInvalidationTarget] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Fetch the current cache version and categories when the component mounts
  useEffect(() => {
    fetchCurrentVersion();
    fetchCategories();
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
  
  // Fetch available image categories for the dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/images/categories');
      const data = await response.json();
      
      if (data.categories && Array.isArray(data.categories)) {
        setAvailableCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching image categories:', error);
      // Use some defaults if we can't fetch categories
      setAvailableCategories(['hero', 'blog', 'product', 'gallery']);
    }
  };

  // Update the cache version based on selected scope and target
  const handleUpdateVersion = async () => {
    setIsLoading(true);
    try {
      // Validate target if scope is not global
      if (invalidationScope !== 'global' && !invalidationTarget) {
        toast.error('Target required', {
          description: `Please specify a ${invalidationScope} target for selective cache invalidation.`,
        });
        setIsLoading(false);
        return;
      }
      
      const options = invalidationScope === 'global' 
        ? undefined 
        : { scope: invalidationScope, target: invalidationTarget };
      
      const success = await updateGlobalCacheVersion(options);
      
      if (success) {
        const scopeMessage = invalidationScope === 'global' 
          ? 'All cached images' 
          : `Images in ${invalidationScope} "${invalidationTarget}"`;
          
        toast.success('Cache version updated', {
          description: `${scopeMessage} will be refreshed on next load.`,
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

          <Tabs defaultValue="selective" className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="selective">Selective Invalidation</TabsTrigger>
              <TabsTrigger value="global">Global Invalidation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="selective" className="space-y-3">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Invalidation Scope</label>
                <Select 
                  value={invalidationScope} 
                  onValueChange={(value) => setInvalidationScope(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (All Images)</SelectItem>
                    <SelectItem value="category">By Category</SelectItem>
                    <SelectItem value="prefix">By Path Prefix</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {invalidationScope !== 'global' && (
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">
                    {invalidationScope === 'category' ? 'Category' : 'Path Prefix'}
                  </label>
                  
                  {invalidationScope === 'category' ? (
                    <Select 
                      value={invalidationTarget} 
                      onValueChange={setInvalidationTarget}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <FolderTree className="h-4 w-4 text-gray-500" />
                      <Input
                        value={invalidationTarget}
                        onChange={(e) => setInvalidationTarget(e.target.value)}
                        placeholder="e.g., hero/, blog/"
                        className="flex-1"
                      />
                    </div>
                  )}
                </div>
              )}
              
              <div className="pt-2">
                <Button 
                  variant="default" 
                  className="bg-navy text-white hover:bg-navy hover:bg-opacity-90 w-full"
                  onClick={handleUpdateVersion} 
                  disabled={isLoading || (invalidationScope !== 'global' && !invalidationTarget)}
                >
                  {isLoading ? 'Updating...' : `Update ${invalidationScope === 'global' ? 'All' : 'Selected'} Cache`}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="global">
              <div className="flex items-center p-3 border border-amber-200 bg-amber-50 rounded-md mb-3">
                <Info className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
                <p className="text-xs text-amber-700">
                  Updating the global cache version will force browsers to download fresh copies of all images, 
                  even if they were previously cached. Use this when you've updated images but users are still seeing old versions.
                </p>
              </div>
              
              <Button 
                variant="default" 
                className="bg-navy text-white hover:bg-navy hover:bg-opacity-90 w-full"
                onClick={() => {
                  setInvalidationScope('global');
                  setInvalidationTarget('');
                  handleUpdateVersion();
                }} 
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update All Cache Versions'}
              </Button>
              
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  onClick={handleClearCache} 
                  disabled={isLoading}
                  className="w-full"
                >
                  Clear All Caches
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
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
    </Card>
  );
};

export default CacheVersionControl;
