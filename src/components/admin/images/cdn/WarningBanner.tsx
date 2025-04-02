
import React from 'react';
import { FileWarning } from 'lucide-react';

const WarningBanner: React.FC = () => {
  return (
    <div className="border rounded-md p-3 bg-amber-50 border-amber-200">
      <div className="flex items-start">
        <FileWarning className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
        <div className="text-sm text-amber-800">
          <p>If you're seeing 404 errors for placeholder.svg, make sure your CDN worker is configured to handle placeholder images.</p>
          <p className="mt-1">Consider adding '/placeholder.svg' to your CDN exclusions below if the issue persists.</p>
        </div>
      </div>
    </div>
  );
};

export default WarningBanner;
