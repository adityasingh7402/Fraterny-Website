
import { RefObject } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Check } from 'lucide-react';
import ReactCrop, { type Crop as CropArea } from 'react-image-crop';
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
  onApplyChanges
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
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-2 justify-center">
        <button
          type="button"
          onClick={increaseZoom}
          className="p-2 bg-gray-100 rounded-full text-navy"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={decreaseZoom}
          className="p-2 bg-gray-100 rounded-full text-navy"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={rotateImage}
          className="p-2 bg-gray-100 rounded-full text-navy"
          title="Rotate"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onApplyChanges}
          className="p-2 bg-navy rounded-full text-white"
          title="Apply changes"
        >
          <Check className="w-4 h-4" />
        </button>
      </div>
      
      <div className="max-w-full overflow-hidden">
        <ReactCrop
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={undefined}
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
              });
            }}
          />
        </ReactCrop>
      </div>
      
      <p className="text-sm text-gray-500 text-center mt-2">
        Drag to adjust crop area, use controls to zoom and rotate.
      </p>
    </div>
  );
};

export default ImageCropper;
