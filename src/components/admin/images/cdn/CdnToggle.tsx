
import React from 'react';
import { Info } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CdnToggleProps {
  isCdnEnabled: boolean;
  toggleCdnEnabled: (newState: boolean) => void;
}

const CdnToggle: React.FC<CdnToggleProps> = ({ isCdnEnabled, toggleCdnEnabled }) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
      <div>
        <div className="flex items-center space-x-2">
          <span className="font-medium">Enable CDN in Development</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Toggle CDN usage in development environment for testing.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {isCdnEnabled ? 'Currently using CDN for images' : 'Currently using direct image paths'}
        </p>
      </div>
      <Switch checked={isCdnEnabled} onCheckedChange={toggleCdnEnabled} />
    </div>
  );
};

export default CdnToggle;
