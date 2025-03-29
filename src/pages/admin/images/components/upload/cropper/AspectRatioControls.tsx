
import { RefObject, useEffect } from 'react';
import { type Crop as CropArea } from 'react-image-crop';
import { AspectRatioControlsProps, AspectRatioOption } from './types';

// Common aspect ratios for website placeholders
const aspectRatios: AspectRatioOption[] = [
  { value: 16/9, label: "Landscape" },
  { value: 4/3, label: "Standard" },
  { value: 1, label: "Square" },
  { value: 9/16, label: "Portrait" },
  { value: undefined, label: "Free" },
];

const AspectRatioControls = ({ 
  aspectRatio, 
  setAspectRatio, 
  imgRef, 
  setCrop, 
  imageKey 
}: AspectRatioControlsProps) => {
  // Get recommended aspect ratio based on image key
  const getRecommendedAspectRatio = () => {
    if (!imageKey) return "16:9";
    
    if (imageKey.includes('hero')) return "16:9";
    if (imageKey.includes('profile') || imageKey.includes('avatar')) return "1:1";
    if (imageKey.includes('banner')) return "4:1";
    if (imageKey.includes('gallery')) return "4:3";
    
    return "16:9"; // Default
  };

  const updateCropWithAspectRatio = (ratio: number | undefined) => {
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
    <>
      <h4 className="font-medium text-navy mb-2">Aspect Ratio</h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {aspectRatios.map((ratio) => (
          <button
            key={ratio.label}
            type="button"
            onClick={() => updateCropWithAspectRatio(ratio.value)}
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
      
      <div className="mt-auto">
        <p className="text-xs text-navy mb-1 font-medium">Recommended: {getRecommendedAspectRatio()}</p>
        <p className="text-xs text-gray-500 mb-3">
          {imageKey ? 
            `Use ${getRecommendedAspectRatio()} for "${imageKey}" images for best results.` : 
            'Choose an aspect ratio that matches your image placeholder.'
          }
        </p>
      </div>
    </>
  );
};

export default AspectRatioControls;
