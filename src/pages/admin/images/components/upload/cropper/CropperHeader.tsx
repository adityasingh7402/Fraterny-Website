
import { ArrowLeft, Check } from 'lucide-react';

interface CropperHeaderProps {
  onApplyChanges: () => void;
  onCancelCrop: () => void;
  imageKey: string;
}

const CropperHeader = ({ onApplyChanges, onCancelCrop, imageKey }: CropperHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <button
        type="button"
        onClick={onCancelCrop}
        className="text-navy hover:text-navy-dark transition-colors flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Preview</span>
      </button>
      
      <button
        type="button"
        onClick={onApplyChanges}
        className="flex items-center gap-1.5 bg-navy text-white px-3 py-1.5 rounded-md hover:bg-opacity-90"
      >
        <Check className="w-4 h-4" />
        <span>Apply Changes</span>
      </button>
    </div>
  );
};

export default CropperHeader;
