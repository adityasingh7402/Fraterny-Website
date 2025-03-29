
import { Smartphone, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface LivePreviewProps {
  previewUrl: string | null;
  aspectRatio?: number;
  placeholderLabel: string;
  objectFit?: 'cover' | 'contain';
  viewMode?: 'desktop' | 'mobile';
  setViewMode?: (mode: 'desktop' | 'mobile') => void;
}

const LivePreview = ({ 
  previewUrl, 
  aspectRatio, 
  placeholderLabel,
  objectFit = 'cover',
  viewMode: externalViewMode,
  setViewMode: externalSetViewMode
}: LivePreviewProps) => {
  const [internalViewMode, setInternalViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const isMobile = useIsMobile();
  
  // Use either external or internal state management for view mode
  const viewMode = externalViewMode || internalViewMode;
  const setViewMode = externalSetViewMode || setInternalViewMode;
  
  if (!previewUrl) {
    return (
      <div className="h-40 md:h-64 bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-400">Preview not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-xs md:text-sm font-medium text-navy">Website Preview</h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`p-1 md:p-1.5 rounded ${
              viewMode === 'desktop' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'
            }`}
            aria-label="Desktop Preview"
          >
            <Monitor className="w-3 h-3 md:w-4 md:h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`p-1 md:p-1.5 rounded ${
              viewMode === 'mobile' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'
            }`}
            aria-label="Mobile Preview"
          >
            <Smartphone className="w-3 h-3 md:w-4 md:h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'desktop' ? (
        <div 
          className="border border-gray-200 rounded-lg bg-white overflow-hidden" 
          style={{
            aspectRatio: aspectRatio || 16/9,
            maxHeight: isMobile ? '180px' : '250px'
          }}
        >
          <img 
            src={previewUrl} 
            alt="Preview" 
            className={`w-full h-full object-${objectFit}`}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className={`border-4 md:border-8 border-gray-800 rounded-2xl md:rounded-3xl overflow-hidden ${
            isMobile ? 'w-[120px] h-[210px]' : 'w-[140px] h-[250px]'
          } relative`}>
            <div className="absolute inset-x-0 top-0 h-4 bg-gray-800 z-10"></div>
            <div className={`${isMobile ? 'w-10 h-1' : 'w-16 h-1.5'} bg-gray-700 absolute top-2 rounded-full left-1/2 transform -translate-x-1/2 z-20`}></div>
            <div className={`absolute inset-x-0 bottom-0 ${isMobile ? 'h-6' : 'h-10'} bg-gray-800 z-10 flex items-center justify-center`}>
              <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full border border-gray-700`}></div>
            </div>
            <div className="w-full h-full overflow-hidden bg-gray-100">
              <img 
                src={previewUrl} 
                alt="Mobile Preview" 
                className={`w-full h-full object-${objectFit}`} 
              />
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            {placeholderLabel || 'Custom Size'}
          </p>
          <p className="text-xs text-center text-gray-600 mt-2">
            This preview accurately represents how your image will appear on the website.
          </p>
        </div>
      )}
    </div>
  );
};

export default LivePreview;
