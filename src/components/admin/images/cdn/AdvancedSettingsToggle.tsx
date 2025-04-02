
import React from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AdvancedSettingsToggleProps {
  showAdvancedSettings: boolean;
  setShowAdvancedSettings: (show: boolean) => void;
}

const AdvancedSettingsToggle: React.FC<AdvancedSettingsToggleProps> = ({ 
  showAdvancedSettings, 
  setShowAdvancedSettings 
}) => {
  return (
    <div className="pt-2">
      <Button
        variant="ghost"
        size="sm"
        className="text-navy w-full flex items-center justify-center"
        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
      >
        <Settings2 className="h-4 w-4 mr-1.5" />
        {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
      </Button>
    </div>
  );
};

export default AdvancedSettingsToggle;
