
import { CropIcon } from 'lucide-react';

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
            className={`p-2 rounded-full ${isCropping ? 'bg-navy text-white' : 'bg-gray-100 text-navy'}`}
            title={isCropping ? "Exit crop mode" : "Enter crop mode"}
          >
            <CropIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex justify-center">
        {children || (
          <img
            src={imageSrc}
            alt="Preview"
            className="max-h-[400px] object-contain"
          />
        )}
      </div>
      
      {isCropping && (
        <p className="text-sm text-gray-500 text-center mt-2">
          Drag to crop the image. Use the controls above to zoom and rotate.
        </p>
      )}
    </div>
  );
};

export default ImagePreview;
