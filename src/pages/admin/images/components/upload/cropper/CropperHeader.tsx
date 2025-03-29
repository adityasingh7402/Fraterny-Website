
import { ArrowLeft, Check } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CropperHeaderProps {
  onApplyChanges: () => void;
  onCancelCrop: () => void;
  imageKey: string;
}

const CropperHeader = ({ onApplyChanges, onCancelCrop, imageKey }: CropperHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-between items-center mb-4">
      <button
        type="button"
        onClick={onCancelCrop}
        className="text-navy hover:text-navy-dark transition-colors flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className={isMobile ? "text-sm" : ""}>Back</span>
      </button>
      
      <button
        type="button"
        onClick={onApplyChanges}
        className="flex items-center gap-1.5 bg-navy text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 text-sm md:text-base"
      >
        <Check className="w-4 h-4" />
        <span>Apply</span>
      </button>
    </div>
  );
};

export default CropperHeader;
