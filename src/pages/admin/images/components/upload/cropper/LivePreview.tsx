
import { Smartphone, Monitor } from 'lucide-react';
import { useState } from 'react';

interface LivePreviewProps {
  previewUrl: string | null;
  aspectRatio?: number;
  placeholderLabel: string;
}

const LivePreview = ({ previewUrl, aspectRatio, placeholderLabel }: LivePreviewProps) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  if (!previewUrl) {
    return (
      <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
        <p className="text-gray-400">Preview not available</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-navy">Live Preview</h3>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setPreviewMode('desktop')}
            className={`p-1.5 rounded ${
              previewMode === 'desktop' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="sr-only">Desktop Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('mobile')}
            className={`p-1.5 rounded ${
              previewMode === 'mobile' ? 'bg-navy text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="sr-only">Mobile Preview</span>
          </button>
        </div>
      </div>

      {previewMode === 'desktop' ? (
        <div 
          className="border border-gray-200 rounded bg-white overflow-hidden" 
          style={{
            aspectRatio: aspectRatio || 16/9
          }}
        >
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="border-8 border-gray-800 rounded-3xl overflow-hidden w-[180px] h-[320px] relative">
            <div className="absolute inset-x-0 top-0 h-6 bg-gray-800 z-10"></div>
            <div className="w-16 h-1.5 bg-gray-700 absolute top-2 rounded-full left-1/2 transform -translate-x-1/2 z-20"></div>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gray-800 z-10 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-gray-700"></div>
            </div>
            <div className="w-full h-full overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Mobile Preview" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-center text-gray-500">
        Preview for: {placeholderLabel || 'Custom Size'}
      </p>
    </div>
  );
};

export default LivePreview;
