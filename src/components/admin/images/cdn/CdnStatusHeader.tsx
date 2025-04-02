
import React from 'react';
import { Globe, CheckCircle2, XCircle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface CdnStatusHeaderProps {
  isCdnAvailable: boolean | null;
}

const CdnStatusHeader: React.FC<CdnStatusHeaderProps> = ({ isCdnAvailable }) => {
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
            <XCircle className="h-5 w-5 text-red-500" />
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
