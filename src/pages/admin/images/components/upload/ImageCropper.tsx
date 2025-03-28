
import { useRef } from 'react';
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
  onApplyChanges
}: ImageCropperProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  
  const increaseZoom = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };
  
  const decreaseZoom = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.1));
  };
  
  const rotateImage = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  return (
    <>
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
      
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => setCompletedCrop(c)}
        aspect={undefined}
        className="max-h-[400px] object-contain"
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Crop Preview"
          style={{
            maxHeight: '400px',
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: 'transform 0.2s ease-in-out'
          }}
        />
      </ReactCrop>
    </>
  );
};

export default ImageCropper;
