
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  testCdnConnection, 
  getCdnBaseUrl, 
  getPathExclusions,
} from '@/utils/cdn';

// Import our refactored components
import CdnStatusHeader from './CdnStatusHeader';
import CdnInfoBanner from './CdnInfoBanner';
import CdnToggle from './CdnToggle';
import UrlTester from './UrlTester';
import CdnTestButton from './CdnTestButton';
import WarningBanner from './WarningBanner';
import AdvancedSettingsToggle from './AdvancedSettingsToggle';
import PathExclusions from './PathExclusions';

const CDN_STORAGE_KEY = 'use_cdn_development';

/**
 * Component for testing and controlling CDN functionality
 */
const CdnTestingPanel: React.FC = () => {
  const [isCdnEnabled, setIsCdnEnabled] = useState<boolean>(() => {
    // Check local storage for saved preference
    const savedPreference = localStorage.getItem(CDN_STORAGE_KEY);
    return savedPreference === 'true';
  });
  
  const [isCdnAvailable, setIsCdnAvailable] = useState<boolean | null>(null);
  const [isTestingCdn, setIsTestingCdn] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
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
    setPathExclusions(getPathExclusions());
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

  return (
    <div className="space-y-4">
      <CdnStatusHeader isCdnAvailable={isCdnAvailable} />
      <CdnInfoBanner cdnUrl={cdnUrl} />
      <CdnToggle isCdnEnabled={isCdnEnabled} toggleCdnEnabled={toggleCdnEnabled} />
      <UrlTester isTestingCdn={isTestingCdn} setIsTestingCdn={setIsTestingCdn} />
      <CdnTestButton testCdnAvailability={testCdnAvailability} isTestingCdn={isTestingCdn} />
      <WarningBanner />
      <AdvancedSettingsToggle 
        showAdvancedSettings={showAdvancedSettings} 
        setShowAdvancedSettings={setShowAdvancedSettings} 
      />
      
      {showAdvancedSettings && (
        <div className="border rounded-md p-3 space-y-4 bg-gray-50">
          <PathExclusions 
            pathExclusions={pathExclusions}
            refreshPathExclusions={refreshPathExclusions}
          />
        </div>
      )}
    </div>
  );
};

export default CdnTestingPanel;
