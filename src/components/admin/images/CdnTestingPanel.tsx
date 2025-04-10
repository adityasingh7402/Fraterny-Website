import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Info, Globe, CheckCircle2, XCircle, RefreshCw, 
  Settings2, Ban, AlertTriangle, Trash2, FileWarning
} from "lucide-react";
import { 
  testCdnConnection, 
  getCdnBaseUrl, 
  getCdnPathExclusions,
  addCdnPathExclusion,
  removeCdnPathExclusion,
  clearCdnPathExclusions
} from '@/utils/cdnUtils';
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
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [newExclusion, setNewExclusion] = useState('');
  const [pathExclusions, setPathExclusions] = useState<string[]>([]);
  const [cdnUrl, setCdnUrl] = useState<string>('');

  // Test CDN connection on mount
  useEffect(() => {
    testCdnAvailability();
    setCdnUrl(getCdnBaseUrl());
    refreshPathExclusions();
  }, []);

  // Load path exclusions from storage
  const refreshPathExclusions = () => {
    setPathExclusions(getCdnPathExclusions());
  };

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
      // Test with both an image and placeholder
      const cdnBase = getCdnBaseUrl();
      const testImageUrl = `${cdnBase}/images/hero/luxury-villa-mobile.webp`;
      const testPlaceholderUrl = `${cdnBase}/placeholder.svg`;
      
      console.log(`[CDN] Testing regular image URL: ${testImageUrl}`);
      console.log(`[CDN] Testing placeholder URL: ${testPlaceholderUrl}`);
      
      // Test both URLs
      const [imageResponse, placeholderResponse] = await Promise.all([
        fetch(testImageUrl, { 
          method: 'HEAD',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }),
        fetch(testPlaceholderUrl, { 
          method: 'HEAD',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
      ]);
      
      console.log(`[CDN] Image test result: ${imageResponse.status} ${imageResponse.ok}`);
      console.log(`[CDN] Placeholder test result: ${placeholderResponse.status} ${placeholderResponse.ok}`);
      
      // Check if both tests passed
      const isImageAvailable = imageResponse.ok;
      const isPlaceholderAvailable = placeholderResponse.ok;
      const isFullyAvailable = isImageAvailable && isPlaceholderAvailable;
      
      setIsCdnAvailable(isFullyAvailable);
      
      if (isFullyAvailable) {
        toast.success('CDN connection successful', {
          description: 'Your CDN is correctly configured for both images and placeholders.',
        });
      } else if (isImageAvailable) {
        toast.warning('CDN partially working', {
          description: 'Regular images work but placeholder images are not being served correctly.',
        });
      } else if (isPlaceholderAvailable) {
        toast.warning('CDN partially working', {
          description: 'Placeholder images work but regular images are not being served correctly.',
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

  const handleAddExclusion = () => {
    if (!newExclusion) return;
    
    addCdnPathExclusion(newExclusion);
    setNewExclusion('');
    refreshPathExclusions();
    
    toast.success('Path exclusion added', {
      description: `${newExclusion} will now bypass the CDN.`,
    });
  };

  const handleRemoveExclusion = (path: string) => {
    removeCdnPathExclusion(path);
    refreshPathExclusions();
    
    toast.success('Path exclusion removed', {
      description: `${path} will now use the CDN.`,
    });
  };

  const handleClearExclusions = () => {
    clearCdnPathExclusions();
    refreshPathExclusions();
    
    toast.success('All path exclusions cleared', {
      description: 'All paths will now use the CDN based on your settings.',
    });
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

      <div className="rounded-md bg-sky-50 border border-sky-200 p-3">
        <div className="flex items-start">
          <Info className="h-4 w-4 text-sky-600 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-sky-800">
              Current CDN URL: <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">{cdnUrl}</span>
            </p>
            <p className="mt-1 text-xs text-sky-700">
              Update this URL in <span className="font-mono bg-white/70 px-1 py-0.5 rounded">src/utils/cdnUtils.ts</span> once your Cloudflare worker is set up
            </p>
          </div>
        </div>
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
            <RefreshCw className="h-4 w-4 mr-1.5 animate-spin" />
            <span>Testing CDN...</span>
          </>
        ) : (
          <>
            <RefreshCw className="h-4 w-4 mr-1.5" />
            <span>Test CDN Connection</span>
          </>
        )}
      </Button>

      <div className="border rounded-md p-3 bg-amber-50 border-amber-200">
        <div className="flex items-start">
          <FileWarning className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p>If you're seeing 404 errors for placeholder.svg, make sure your CDN worker is configured to handle placeholder images.</p>
            <p className="mt-1">Consider adding '/placeholder.svg' to your CDN exclusions below if the issue persists.</p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-navy w-full flex items-center justify-center"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
        >
          <Settings2 className="h-4 w-4 mr-1.5" />
          {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
        </Button>
      </div>

      {showAdvancedSettings && (
        <div className="border rounded-md p-3 space-y-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Ban className="h-4 w-4 text-amber-600" />
              <span className="font-medium">CDN Path Exclusions</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Define paths that should bypass the CDN. Useful for images that don't work properly with the CDN.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              className="text-red-500 h-7"
              onClick={handleClearExclusions}
              disabled={pathExclusions.length === 0}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              <span className="text-xs">Clear All</span>
            </Button>
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder="/images/hero/* or /specific-path.jpg"
              value={newExclusion}
              onChange={(e) => setNewExclusion(e.target.value)}
              className="flex-grow"
            />
            <Button 
              size="sm"
              onClick={handleAddExclusion}
              disabled={!newExclusion}
            >
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {pathExclusions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {pathExclusions.map(path => (
                  <Badge 
                    key={path} 
                    variant="outline" 
                    className="bg-white flex items-center gap-1 py-1.5"
                  >
                    <span className="text-xs font-mono">{path}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 rounded-full hover:bg-gray-100"
                      onClick={() => handleRemoveExclusion(path)}
                    >
                      <XCircle className="h-3 w-3 text-gray-500" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 text-sm py-2">
                <AlertTriangle className="h-4 w-4 inline-block mr-1.5" />
                No path exclusions defined
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CdnTestingPanel;
