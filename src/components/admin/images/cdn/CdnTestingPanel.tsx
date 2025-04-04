
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CdnStatusHeader from './CdnStatusHeader';
import CdnToggle from './CdnToggle';
import CdnTestButton from './CdnTestButton';
import UrlTester from './UrlTester';
import PathExclusions from './PathExclusions';
import AdvancedSettingsToggle from './AdvancedSettingsToggle';
import ServiceWorkerStatus from './ServiceWorkerStatus';
import CdnInfoBanner from './CdnInfoBanner';
import WarningBanner from './WarningBanner';
import { 
  isCdnEnabled, 
  setCdnEnabled, 
  getCdnAvailability, 
  testCdnAvailability,
  getPathExclusions,
  getCdnUrl
} from '@/utils/cdn';

/**
 * CDN Testing Panel Component
 * Provides controls and information for the CDN system
 */
const CdnTestingPanel = () => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);
  const [isCdnAvailable, setIsCdnAvailable] = useState<boolean | null>(null);
  const [cdnEnabled, setCdnEnabledState] = useState(isCdnEnabled());
  const [isTestingCdn, setIsTestingCdn] = useState(false);
  const [pathExclusions, setPathExclusions] = useState<string[]>([]);
  const [cdnUrl, setCdnUrl] = useState('');
  
  // Initialize states
  useEffect(() => {
    // Initialize CDN availability
    checkCdnAvailability();
    
    // Load path exclusions
    refreshPathExclusions();
    
    // Get CDN URL from config
    const defaultUrl = getCdnUrl('/test', true) || '';
    setCdnUrl(defaultUrl.split('/test')[0] || 'https://cdn.example.com');
  }, []);
  
  // Check CDN availability
  const checkCdnAvailability = async () => {
    try {
      const isAvailable = await getCdnAvailability();
      setIsCdnAvailable(isAvailable);
    } catch (error) {
      console.error('Error checking CDN availability:', error);
      setIsCdnAvailable(false);
    }
  };
  
  // Toggle CDN enabled state
  const toggleCdnEnabled = (newState: boolean) => {
    setCdnEnabled(newState);
    setCdnEnabledState(newState);
  };
  
  // Test CDN availability
  const handleTestCdnAvailability = async () => {
    setIsTestingCdn(true);
    try {
      await testCdnAvailability();
      await checkCdnAvailability();
    } catch (error) {
      console.error('Error testing CDN:', error);
    } finally {
      setIsTestingCdn(false);
    }
  };
  
  // Refresh path exclusions
  const refreshPathExclusions = () => {
    const exclusions = getPathExclusions();
    setPathExclusions(exclusions);
  };
  
  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <CardTitle className="text-navy text-lg flex items-center">
          <span>CDN Configuration</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        {!isWarningDismissed && (
          <WarningBanner onDismiss={() => setIsWarningDismissed(true)} />
        )}
        
        <CdnStatusHeader isCdnAvailable={isCdnAvailable} />
        
        <div className="space-y-4 mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CdnToggle 
              isCdnEnabled={cdnEnabled} 
              toggleCdnEnabled={toggleCdnEnabled} 
            />
            <CdnTestButton 
              testCdnAvailability={handleTestCdnAvailability} 
              isTestingCdn={isTestingCdn} 
            />
          </div>
          
          <CdnInfoBanner cdnUrl={cdnUrl} />
          
          <UrlTester 
            isTestingCdn={isTestingCdn} 
            setIsTestingCdn={setIsTestingCdn} 
          />
          
          <AdvancedSettingsToggle
            showAdvancedSettings={showAdvancedSettings}
            setShowAdvancedSettings={setShowAdvancedSettings}
          />
          
          {showAdvancedSettings && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <ServiceWorkerStatus />
              <PathExclusions 
                refreshPathExclusions={refreshPathExclusions}
                pathExclusions={pathExclusions}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CdnTestingPanel;
