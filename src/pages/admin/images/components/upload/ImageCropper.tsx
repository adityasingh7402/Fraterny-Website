
import { RefObject } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Check, Crop, ArrowLeft } from 'lucide-react';
import ReactCrop, { type Crop as CropArea } from 'react-image-crop';
import { Slider } from '@/components/ui/slider';
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
  onCancelCrop
}: ImageCropperProps) => {
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
      
      <div className="max-w-full overflow-hidden bg-white border border-gray-200 rounded-lg p-2 mb-4">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={undefined}
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
              // Set initial crop to center of image
              const { width, height } = e.currentTarget;
              const cropWidth = width * 0.8;
              const cropHeight = height * 0.8;
              const x = (width - cropWidth) / 2;
              const y = (height - cropHeight) / 2;
              
              setCrop({
                unit: 'px',
                x,
                y,
                width: cropWidth,
                height: cropHeight
              } as CropArea);
            }}
          />
        </ReactCrop>
      </div>
      
      <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 p-4">
        <div className="mb-4">
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
      
      <p className="text-sm text-gray-500 text-center mt-4">
        Drag to adjust crop area, use controls to zoom and rotate.
      </p>
    </div>
  );
};

export default ImageCropper;
