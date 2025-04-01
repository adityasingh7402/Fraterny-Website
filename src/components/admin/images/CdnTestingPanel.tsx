
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Globe, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import { testCdnConnection } from '@/utils/cdnUtils';
import { toast } from 'sonner';

const CDN_STORAGE_KEY = 'use_cdn_development';

/**
 * Component for testing and controlling CDN functionality
 */
const CdnTestingPanel = () => {
  const [isCdnEnabled, setIsCdnEnabled] = useState<boolean>(() => {
    // Check local storage for saved preference
    const savedPreference = localStorage.getItem(CDN_STORAGE_KEY);
    return savedPreference === 'true';
  });
  
  const [isCdnAvailable, setIsCdnAvailable] = useState<boolean | null>(null);
  const [isTestingCdn, setIsTestingCdn] = useState(false);

  // Test CDN connection on mount
  useEffect(() => {
    testCdnAvailability();
  }, []);

  // Save preference to local storage when changed
  useEffect(() => {
    localStorage.setItem(CDN_STORAGE_KEY, isCdnEnabled.toString());
    // Force reload to apply CDN preference
    if (isCdnEnabled !== (localStorage.getItem(CDN_STORAGE_KEY) === 'true')) {
      window.location.reload();
    }
  }, [isCdnEnabled]);

  const testCdnAvailability = async () => {
    setIsTestingCdn(true);
    try {
      const isAvailable = await testCdnConnection();
      setIsCdnAvailable(isAvailable);
      
      if (isAvailable) {
        toast.success('CDN connection successful', {
          description: 'Your CDN is correctly configured.',
        });
      } else {
        toast.error('CDN connection failed', {
          description: 'Could not connect to your CDN. Check your configuration.',
        });
      }
    } catch (error) {
      console.error('Error testing CDN:', error);
      setIsCdnAvailable(false);
      toast.error('CDN test error', {
        description: 'An error occurred while testing the CDN connection.',
      });
    } finally {
      setIsTestingCdn(false);
    }
  };

  const toggleCdnEnabled = () => {
    setIsCdnEnabled(!isCdnEnabled);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Globe className="h-5 w-5 text-navy" />
          <span className="font-medium text-navy">CDN Status</span>
        </div>
        
        {isCdnAvailable === null ? (
          <Skeleton className="h-6 w-24" />
        ) : (
          <div className="flex items-center space-x-2">
            {isCdnAvailable ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isCdnAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {isCdnAvailable ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Enable CDN in Development</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>Toggle CDN usage in development environment for testing.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {isCdnEnabled ? 'Currently using CDN for images' : 'Currently using direct image paths'}
          </p>
        </div>
        <Switch checked={isCdnEnabled} onCheckedChange={toggleCdnEnabled} />
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full" 
        onClick={testCdnAvailability} 
        disabled={isTestingCdn}
      >
        {isTestingCdn ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Testing CDN...</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4" />
            <span>Test CDN Connection</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default CdnTestingPanel;
