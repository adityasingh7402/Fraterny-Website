
import React from 'react';
import { Globe, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { getCdnError } from '@/utils/cdn';

interface CdnStatusHeaderProps {
  isCdnAvailable: boolean | null;
}

const CdnStatusHeader: React.FC<CdnStatusHeaderProps> = ({ isCdnAvailable }) => {
  // Get the latest CDN error if any
  const cdnError = getCdnError();
  
  return (
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
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              {cdnError && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-red-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p>{cdnError}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
          <span className={`text-sm font-medium ${isCdnAvailable ? 'text-green-600' : 'text-red-600'}`}>
            {isCdnAvailable ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      )}
    </div>
  );
};

export default CdnStatusHeader;
