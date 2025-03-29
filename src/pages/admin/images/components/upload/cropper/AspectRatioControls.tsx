
import { type Crop as CropArea } from 'react-image-crop';
import { AspectRatioOption } from './types';

interface AspectRatioControlsProps {
  aspectRatio: number | undefined;
  setAspectRatio: (ratio: number | undefined) => void;
  imgRef: React.RefObject<HTMLImageElement>;
  setCrop: (crop: CropArea) => void;
}

const AspectRatioControls = ({ 
  aspectRatio, 
  setAspectRatio, 
  imgRef, 
  setCrop 
}: AspectRatioControlsProps) => {
  // Common aspect ratios for website placeholders
  const aspectRatios: AspectRatioOption[] = [
    { value: 16/9, label: "Landscape (16:9)" },
    { value: 4/3, label: "Standard (4:3)" },
    { value: 1, label: "Square (1:1)" },
    { value: 9/16, label: "Portrait (9:16)" },
    { value: undefined, label: "Free" },
  ];

  const handleAspectRatioChange = (ratio: number | undefined) => {
    setAspectRatio(ratio);
    
    // When changing aspect ratio, recenter the crop
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      let cropWidth, cropHeight;
      
      if (ratio) {
        if (ratio > 1) {
          // Landscape
          cropWidth = width * 0.8;
          cropHeight = cropWidth / ratio;
        } else {
          // Portrait or square
          cropHeight = height * 0.8;
          cropWidth = cropHeight * ratio;
        }
      } else {
        // Free
        cropWidth = width * 0.8;
        cropHeight = height * 0.8;
      }
      
      const x = (width - cropWidth) / 2;
      const y = (height - cropHeight) / 2;
      
      setCrop({
        unit: 'px',
        x,
        y,
        width: cropWidth,
        height: cropHeight
      } as CropArea);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-medium text-navy mb-2">Aspect Ratio</h4>
      <div className="flex flex-wrap gap-2">
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.label}
            type="button"
            onClick={() => handleAspectRatioChange(ratio.value)}
            className={`px-2 py-1 text-xs rounded flex-1 ${
              aspectRatio === ratio.value
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-navy hover:bg-gray-200'
            } transition-colors`}
            title={ratio.label}
          >
            {ratio.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AspectRatioControls;
