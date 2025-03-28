
import { CropIcon, Info } from 'lucide-react';

interface ImagePreviewProps {
  imageSrc: string;
  isCropping: boolean;
  children: React.ReactNode;
  onToggleCrop: () => void;
}

const ImagePreview = ({ 
  imageSrc, 
  isCropping, 
  children, 
  onToggleCrop 
}: ImagePreviewProps) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-navy">Image Preview</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onToggleCrop}
            className={`p-2 rounded-full ${isCropping ? 'bg-terracotta text-white' : 'bg-gray-100 text-navy hover:bg-gray-200'} transition-colors`}
            title={isCropping ? "Exit crop mode" : "Enter crop mode"}
          >
            <CropIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-center">
        {children || (
          <div className="border border-gray-200 rounded-lg p-2 bg-white">
            <img
              src={imageSrc}
              alt="Preview"
              className="max-h-[400px] object-contain"
            />
          </div>
        )}
      </div>
      
      {!isCropping && (
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-start gap-2 p-3 bg-navy bg-opacity-5 rounded-md border border-navy border-opacity-20 max-w-md">
            <Info className="h-4 w-4 text-navy flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-navy">Crop your image before uploading</p>
              <p className="text-gray-700 text-xs">
                Click the crop icon above to select which portion of your image will be displayed on the website.
                For best results, use the recommended aspect ratio for your image type.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
