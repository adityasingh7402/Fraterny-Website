
import React, { useState, useEffect } from 'react';
import CdnToggle from './CdnToggle';
import PathExclusions from './PathExclusions';
import CdnInfoBanner from './CdnInfoBanner';
import CdnStatusHeader from './CdnStatusHeader';
import UrlTester from './UrlTester';
import CdnTestButton from './CdnTestButton';
import WarningBanner from './WarningBanner';
import AdvancedSettingsToggle from './AdvancedSettingsToggle';
import { testCdnConnection, getCdnAvailability } from '@/utils/cdn';

/**
 * Component for testing and configuring CDN settings
 */
const CdnTestingPanel: React.FC = () => {
  const [isTestingCdn, setIsTestingCdn] = useState(false);
  const [cdnAvailable, setCdnAvailable] = useState<boolean | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Check CDN availability on first render
  useEffect(() => {
    checkCdnAvailability();
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
  
  // Toggle advanced settings
  const toggleAdvancedSettings = () => {
    setShowAdvanced(!showAdvanced);
  };
  
  return (
    <div className="space-y-4">
      <CdnStatusHeader isAvailable={cdnAvailable} />
      
      <CdnInfoBanner />
      
      <div className="grid gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <CdnToggle cdnAvailable={cdnAvailable} />
            
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
          
          <UrlTester />
        </div>
        
        <div className="pt-2">
          <AdvancedSettingsToggle 
            showAdvanced={showAdvanced}
            toggleAdvanced={toggleAdvancedSettings}
          />
          
          {showAdvanced && (
            <div className="mt-3 border rounded-md p-3">
              <PathExclusions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CdnTestingPanel;
