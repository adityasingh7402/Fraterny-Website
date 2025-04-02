
import React from 'react';
import { RotateCw, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CdnTestButtonProps {
  testCdnAvailability: () => Promise<void>;
  isTestingCdn: boolean;
}

const CdnTestButton: React.FC<CdnTestButtonProps> = ({ 
  testCdnAvailability, 
  isTestingCdn 
}) => {
  return (
    <Button 
      onClick={testCdnAvailability} 
      disabled={isTestingCdn}
      className="w-full"
    >
      {isTestingCdn ? (
        <>
          <RotateCw className="h-4 w-4 mr-2 animate-spin" />
          Testing CDN Connection...
        </>
      ) : (
        <>
          Test CDN Connection
        </>
      )}
    </Button>
  );
};

export default CdnTestButton;
