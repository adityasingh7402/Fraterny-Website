
import React, { useState } from 'react';
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

/**
 * CDN Testing Panel Component
 * Provides controls and information for the CDN system
 */
const CdnTestingPanel = () => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);
  
  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <CardTitle className="text-navy text-lg flex items-center">
          <span>CDN Configuration</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        {!isWarningDismissed && (
          <WarningBanner 
            onDismiss={() => setIsWarningDismissed(true)} 
          />
        )}
        
        <CdnStatusHeader />
        
        <div className="space-y-4 mt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CdnToggle />
            <CdnTestButton />
          </div>
          
          <CdnInfoBanner />
          
          <UrlTester />
          
          <AdvancedSettingsToggle
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
          />
          
          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t border-gray-100">
              <ServiceWorkerStatus />
              <PathExclusions />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CdnTestingPanel;
