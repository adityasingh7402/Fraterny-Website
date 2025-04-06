
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface WarningBannerProps {
  onDismiss: () => void;
}

const WarningBanner: React.FC<WarningBannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-4 relative">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">
            CDN Configuration Warning
          </p>
          <p className="text-sm mt-1">
            These settings are for advanced users only. Incorrect configuration can break image loading.
          </p>
        </div>
      </div>
      <button 
        onClick={onDismiss}
        className="absolute top-2 right-2 text-amber-500 hover:text-amber-700"
        aria-label="Dismiss warning"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default WarningBanner;
