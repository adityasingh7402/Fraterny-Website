
import React, { useState, useEffect } from 'react';
import CdnToggle from './CdnToggle';
import PathExclusions from './PathExclusions';
import CdnInfoBanner from './CdnInfoBanner';
import CdnStatusHeader from './CdnStatusHeader';
import UrlTester from './UrlTester';
import CdnTestButton from './CdnTestButton';
import WarningBanner from './WarningBanner';
import AdvancedSettingsToggle from './AdvancedSettingsToggle';
import { testCdnConnection, getCdnAvailability, getCdnBaseUrl, getPathExclusions } from '@/utils/cdn';

/**
 * Component for testing and configuring CDN settings
 */
const CdnTestingPanel: React.FC = () => {
  const [isTestingCdn, setIsTestingCdn] = useState(false);
  const [cdnAvailable, setCdnAvailable] = useState<boolean | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isCdnEnabled, setIsCdnEnabled] = useState(false);
  const [pathExclusions, setPathExclusions] = useState<string[]>([]);
  const cdnUrl = getCdnBaseUrl();
  
  // Check CDN availability on first render
  useEffect(() => {
    checkCdnAvailability();
    refreshPathExclusions();
  }, []);
  
  // Test CDN availability
  const testCdnAvailability = async () => {
    setIsTestingCdn(true);
    try {
      const isAvailable = await testCdnConnection();
      setCdnAvailable(isAvailable);
    } catch (error) {
      console.error('Error testing CDN:', error);
      setCdnAvailable(false);
    } finally {
      setIsTestingCdn(false);
    }
  };
  
  // Check CDN availability without UI indicators
  const checkCdnAvailability = async () => {
    try {
      const isAvailable = await getCdnAvailability();
      setCdnAvailable(isAvailable);
    } catch (error) {
      console.error('Error checking CDN availability:', error);
    }
  };
  
  // Toggle CDN enabled state
  const toggleCdnEnabled = () => {
    setIsCdnEnabled(!isCdnEnabled);
  };
  
  // Refresh path exclusions list
  const refreshPathExclusions = () => {
    const currentExclusions = getPathExclusions();
    setPathExclusions(currentExclusions);
  };
  
  return (
    <div className="space-y-4">
      <CdnStatusHeader isCdnAvailable={cdnAvailable} />
      
      <CdnInfoBanner cdnUrl={cdnUrl} />
      
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <CdnToggle 
              isCdnEnabled={isCdnEnabled} 
              toggleCdnEnabled={toggleCdnEnabled} 
            />
            
            <div className="pt-1">
              <CdnTestButton 
                testCdnAvailability={testCdnAvailability}
                isTestingCdn={isTestingCdn}
              />
            </div>
            
            {cdnAvailable === false && (
              <WarningBanner />
            )}
          </div>
          
          <UrlTester 
            isTestingCdn={isTestingCdn} 
            setIsTestingCdn={setIsTestingCdn} 
          />
        </div>
        
        <div className="pt-2">
          <AdvancedSettingsToggle 
            showAdvancedSettings={showAdvancedSettings}
            setShowAdvancedSettings={setShowAdvancedSettings}
          />
          
          {showAdvancedSettings && (
            <div className="mt-3 border rounded-md p-3">
              <PathExclusions 
                refreshPathExclusions={refreshPathExclusions}
                pathExclusions={pathExclusions}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CdnTestingPanel;
