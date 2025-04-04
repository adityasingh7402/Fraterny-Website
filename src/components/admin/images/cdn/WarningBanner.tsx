
import React from 'react';
import { FileWarning, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface WarningBannerProps {
  onDismiss?: () => void;
}

const WarningBanner: React.FC<WarningBannerProps> = ({ onDismiss }) => {
  return (
    <div className="border rounded-md p-3 bg-amber-50 border-amber-200 mb-4">
      <div className="flex items-start">
        <FileWarning className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
        <div className="text-sm text-amber-800 flex-grow">
          <p>If you're seeing 404 errors for placeholder.svg, make sure your CDN worker is configured to handle placeholder images.</p>
          <p className="mt-1">Consider adding '/placeholder.svg' to your CDN exclusions below if the issue persists.</p>
        </div>
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={onDismiss}
          >
            <X className="h-4 w-4 text-amber-600" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default WarningBanner;
