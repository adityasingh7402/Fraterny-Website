import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateGlobalCacheVersion, getGlobalCacheVersion } from '@/services/images';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import ServiceWorkerStatus from '@/components/admin/images/cdn/ServiceWorkerStatus';

const CacheVersionControl = () => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [scope, setScope] = useState<'global' | 'prefix' | 'category'>('global');
  const [target, setTarget] = useState<string>('');
  
  useEffect(() => {
    const fetchCacheVersion = async () => {
      const version = await getGlobalCacheVersion();
      setCurrentVersion(version);
    };
    
    fetchCacheVersion();
  }, []);
  
  const handleUpdateCacheVersion = async () => {
    setIsUpdating(true);
    try {
      const success = await updateGlobalCacheVersion({ scope, target });
      if (success) {
        toast({
          title: "Cache version updated",
          description: "The global cache version has been updated. Clients will now refresh their caches.",
        });
        
        // Invalidate the query to refetch the cache version
        queryClient.invalidateQueries({ queryKey: ['cacheVersion'] });
        
        // Update local state
        const newVersion = await getGlobalCacheVersion();
        setCurrentVersion(newVersion);
      } else {
        toast({
          title: "Error updating cache version",
          description: "Failed to update the global cache version. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCacheUpdated = () => {
    // This function will be called when the service worker cache is cleared
    queryClient.invalidateQueries({ queryKey: ['cacheVersion'] });
    toast({
      title: "Cache refreshed",
      description: "Service worker cache has been cleared.",
    });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">
          Cache Version Control
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Manage the global cache version to force clients to refresh their caches.
        </p>
      </div>

      <div className="p-4 grid gap-6">
        {/* Add Service Worker Status Component */}
        <ServiceWorkerStatus onCacheClear={handleCacheUpdated} />
        
        <div>
          <Label htmlFor="current-version">Current Version</Label>
          <Input 
            type="text" 
            id="current-version" 
            className="mt-1" 
            value={currentVersion || 'Loading...'} 
            readOnly 
          />
        </div>
        
        <div>
          <Label htmlFor="scope">Invalidation Scope</Label>
          <select 
            id="scope" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={scope}
            onChange={(e) => setScope(e.target.value as 'global' | 'prefix' | 'category')}
          >
            <option value="global">Global</option>
            <option value="prefix">Prefix</option>
            <option value="category">Category</option>
          </select>
        </div>
        
        {scope !== 'global' && (
          <div>
            <Label htmlFor="target">Target</Label>
            <Input 
              type="text" 
              id="target" 
              className="mt-1" 
              placeholder={`Enter ${scope} to invalidate`}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </div>
        )}
        
        <Button 
          onClick={handleUpdateCacheVersion}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Updating Cache...
            </>
          ) : (
            "Update Cache Version"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CacheVersionControl;
