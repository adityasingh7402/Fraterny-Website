
import { RefObject, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Check, Crop, ArrowLeft, Move } from 'lucide-react';
import ReactCrop, { type Crop as CropArea } from 'react-image-crop';
import { Slider } from '@/components/ui/slider';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageSrc: string;
  crop: CropArea;
  setCrop: (crop: CropArea) => void;
  setCompletedCrop: (crop: CropArea) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  imgRef: RefObject<HTMLImageElement>;
  onApplyChanges: () => void;
  onCancelCrop?: () => void;
  imageKey?: string;
}

const ImageCropper = ({
  imageSrc,
  crop,
  setCrop,
  setCompletedCrop,
  zoom,
  setZoom,
  rotation,
  setRotation,
  imgRef,
  onApplyChanges,
  onCancelCrop,
  imageKey
}: ImageCropperProps) => {
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(16 / 9);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const increaseZoom = () => {
    const newZoom = Math.min(zoom + 0.1, 3);
    setZoom(newZoom);
  };
  
  const decreaseZoom = () => {
    const newZoom = Math.max(zoom - 0.1, 0.1);
    setZoom(newZoom);
  };
  
  const rotateImage = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
  };

  const handleZoomSliderChange = (value: number[]) => {
    setZoom(value[0] / 100 * 3);
  };

  const updatePreview = () => {
    if (!imgRef.current || !crop.width || !crop.height) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    // Set canvas size to the cropped area
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Draw the cropped image
    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPreviewUrl(dataUrl);
  };

  // Common aspect ratios for website placeholders
  const aspectRatios = [
    { name: "16:9", value: 16/9, label: "Landscape" },
    { name: "4:3", value: 4/3, label: "Standard" },
    { name: "1:1", value: 1, label: "Square" },
    { name: "9:16", value: 9/16, label: "Portrait" },
    { name: "Free", value: undefined, label: "Free" },
  ];

  // Get recommended aspect ratio based on image key
  const getRecommendedAspectRatio = () => {
    if (!imageKey) return "16:9";
    
    if (imageKey.includes('hero')) return "16:9";
    if (imageKey.includes('profile') || imageKey.includes('avatar')) return "1:1";
    if (imageKey.includes('banner')) return "4:1";
    if (imageKey.includes('gallery')) return "4:3";
    
    return "16:9"; // Default
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4">
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
      
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-2 overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(c) => {
              setCrop(c);
              // Debounce this in a real app
              setTimeout(() => updatePreview(), 100);
            }}
            onComplete={(c) => {
              setCompletedCrop(c);
              updatePreview();
            }}
            aspect={aspectRatio}
            className="max-h-[400px] flex justify-center"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop Preview"
              style={{
                maxHeight: '350px',
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transformOrigin: 'center',
                transition: 'transform 0.2s ease-in-out'
              }}
              onLoad={(e) => {
                // Set initial crop to center of image with recommended aspect ratio
                const { width, height } = e.currentTarget;
                let cropWidth, cropHeight;
                
                if (aspectRatio) {
                  if (aspectRatio > 1) {
                    // Landscape
                    cropWidth = width * 0.8;
                    cropHeight = cropWidth / aspectRatio;
                  } else {
                    // Portrait or square
                    cropHeight = height * 0.8;
                    cropWidth = cropHeight * aspectRatio;
                  }
                } else {
                  // No aspect ratio constraint
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
                
                // Update preview
                setTimeout(() => updatePreview(), 100);
              }}
            />
          </ReactCrop>
        </div>
        
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-navy mb-2">Live Preview</h4>
          <div className="mb-4 bg-gray-100 rounded border border-gray-200">
            {previewUrl ? (
              <AspectRatio ratio={aspectRatio || 16/9} className="overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Crop Preview"
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            ) : (
              <AspectRatio ratio={aspectRatio || 16/9} className="flex items-center justify-center bg-gray-200">
                <p className="text-gray-500 text-sm">Preview will appear here</p>
              </AspectRatio>
            )}
          </div>
          
          <h4 className="font-medium text-navy mb-2">Aspect Ratio</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.name}
                type="button"
                onClick={() => {
                  setAspectRatio(ratio.value);
                  
                  // When changing aspect ratio, recenter the crop
                  if (imgRef.current) {
                    const { width, height } = imgRef.current;
                    let cropWidth, cropHeight;
                    
                    if (ratio.value) {
                      if (ratio.value > 1) {
                        // Landscape
                        cropWidth = width * 0.8;
                        cropHeight = cropWidth / ratio.value;
                      } else {
                        // Portrait or square
                        cropHeight = height * 0.8;
                        cropWidth = cropHeight * ratio.value;
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
                }}
                className={`px-2 py-1 text-xs rounded flex-1 ${
                  aspectRatio === ratio.value
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-navy hover:bg-gray-200'
                } transition-colors`}
                title={ratio.label}
              >
                {ratio.name}
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
        </div>
      </div>
      
      <div className="w-full max-w-full bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-navy">Zoom: {Math.round(zoom * 100)}%</span>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={decreaseZoom}
                  className="p-1.5 bg-gray-100 rounded text-navy hover:bg-gray-200 transition-colors"
                  title="Zoom out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={increaseZoom}
                  className="p-1.5 bg-gray-100 rounded text-navy hover:bg-gray-200 transition-colors"
                  title="Zoom in"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <Slider
              value={[zoom * 100 / 3]}
              min={10}
              max={100}
              step={1}
              onValueChange={handleZoomSliderChange}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-navy">Rotation: {rotation}°</span>
              <button
                type="button"
                onClick={rotateImage}
                className="p-1.5 bg-gray-100 rounded text-navy hover:bg-gray-200 transition-colors"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex justify-between">
              {[0, 90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => setRotation(deg)}
                  className={`px-2 py-1 text-xs rounded ${
                    rotation === deg 
                    ? 'bg-navy text-white' 
                    : 'bg-gray-100 text-navy hover:bg-gray-200'
                  } transition-colors`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full mt-4 flex items-center justify-center text-gray-500 gap-2 text-sm">
        <Move className="w-4 h-4" />
        <p>Drag to reposition the crop area • Use controls to zoom and rotate</p>
      </div>
    </div>
  );
};

export default ImageCropper;
