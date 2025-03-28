
import { ArrowLeft, Check, Crop } from 'lucide-react';

interface CropperHeaderProps {
  onApplyChanges: () => void;
  onCancelCrop?: () => void;
  imageKey?: string;
}

const CropperHeader = ({ onApplyChanges, onCancelCrop, imageKey }: CropperHeaderProps) => {
  return (
    <div className="w-full flex justify-between items-center mb-4">
      <div className="flex items-center">
        {onCancelCrop && (
          <button
            type="button"
            onClick={onCancelCrop}
            className="p-2 mr-2 bg-white border border-gray-200 rounded-full text-navy hover:bg-gray-100 transition-colors"
            title="Back to preview"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <h3 className="font-medium text-navy flex items-center">
          <Crop className="w-4 h-4 mr-2" />
          Image Cropper
          {imageKey && <span className="ml-2 text-sm text-gray-500">({imageKey})</span>}
        </h3>
      </div>
      <button
        type="button"
        onClick={onApplyChanges}
        className="px-3 py-1.5 bg-terracotta text-white rounded-md flex items-center hover:bg-opacity-90 transition-colors"
        title="Apply changes"
      >
        <Check className="w-4 h-4 mr-1" />
        Apply Crop
      </button>
    </div>
  );
};

export default CropperHeader;
