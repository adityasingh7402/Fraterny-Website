
import React, { useState } from 'react';
import { Ban, Info, XCircle, AlertTriangle, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from 'sonner';
import { 
  getPathExclusions,
  addCdnPathExclusion,
  removeCdnPathExclusion,
  clearCdnPathExclusions
} from '@/utils/cdn';

interface PathExclusionsProps {
  refreshPathExclusions: () => void;
  pathExclusions: string[];
}

const PathExclusions: React.FC<PathExclusionsProps> = ({ refreshPathExclusions, pathExclusions }) => {
  const [newExclusion, setNewExclusion] = useState('');

  const handleAddExclusion = () => {
    if (!newExclusion) return;
    
    addCdnPathExclusion(newExclusion);
    setNewExclusion('');
    refreshPathExclusions();
    
    toast.success('Path exclusion added', {
      description: `${newExclusion} will now bypass the CDN.`,
    });
  };

  const handleRemoveExclusion = (path: string) => {
    removeCdnPathExclusion(path);
    refreshPathExclusions();
    
    toast.success('Path exclusion removed', {
      description: `${path} will now use the CDN.`,
    });
  };

  const handleClearExclusions = () => {
    clearCdnPathExclusions();
    refreshPathExclusions();
    
    toast.success('All path exclusions cleared', {
      description: 'All paths will now use the CDN based on your settings.',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Ban className="h-4 w-4 text-amber-600" />
          <span className="font-medium">CDN Path Exclusions</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Define paths that should bypass the CDN. Useful for images that don't work properly with the CDN.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          className="text-red-500 h-7"
          onClick={handleClearExclusions}
          disabled={pathExclusions.length === 0}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          <span className="text-xs">Clear All</span>
        </Button>
      </div>

      <div className="flex space-x-2">
        <Input
          placeholder="/images/hero/* or /specific-path.jpg"
          value={newExclusion}
          onChange={(e) => setNewExclusion(e.target.value)}
          className="flex-grow"
        />
        <Button 
          size="sm"
          onClick={handleAddExclusion}
          disabled={!newExclusion}
        >
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {pathExclusions.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {pathExclusions.map(path => (
              <Badge 
                key={path} 
                variant="outline" 
                className="bg-white flex items-center gap-1 py-1.5"
              >
                <span className="text-xs font-mono">{path}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 rounded-full hover:bg-gray-100"
                  onClick={() => handleRemoveExclusion(path)}
                >
                  <XCircle className="h-3 w-3 text-gray-500" />
                </Button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm py-2">
            <AlertTriangle className="h-4 w-4 inline-block mr-1.5" />
            No path exclusions defined
          </div>
        )}
      </div>
    </div>
  );
};

export default PathExclusions;
