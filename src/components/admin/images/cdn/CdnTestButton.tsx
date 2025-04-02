
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from 'lucide-react';

interface CdnTestButtonProps {
  testCdnAvailability: () => Promise<void>;
  isTestingCdn: boolean;
}

const CdnTestButton: React.FC<CdnTestButtonProps> = ({ testCdnAvailability, isTestingCdn }) => {
  return (
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
  );
};

export default CdnTestButton;
