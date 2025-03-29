
import { useState, useEffect } from 'react';
import { Move } from 'lucide-react';
import ReactCrop, { type Crop as CropArea } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { ImageCropperProps } from './types';
import CropperHeader from './CropperHeader';
import LivePreview from './LivePreview';
import ZoomRotateControls from './ZoomRotateControls';
import { getRecommendedAspectRatio } from '../constants';

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
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [placeholderLabel, setPlaceholderLabel] = useState<string>('');

  // Set aspect ratio based on image key
  useEffect(() => {
    if (imageKey) {
      const recommended = getRecommendedAspectRatio(imageKey);
      setAspectRatio(recommended.ratio);
      setPlaceholderLabel(recommended.label);
    }
  }, [imageKey]);

  const updatePreview = () => {
    if (!imgRef.current || !crop.width || !crop.height) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    // Set canvas size to the dimensions of the crop
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

  // Update preview when crop, zoom or rotation changes
  useEffect(() => {
    if (imgRef.current && crop.width && crop.height) {
      updatePreview();
    }
  }, [crop, zoom, rotation]);

  return (
    <div className="flex flex-col items-center bg-gray-50 rounded-lg p-4">
      <CropperHeader 
        onApplyChanges={onApplyChanges} 
        onCancelCrop={onCancelCrop} 
        imageKey={imageKey} 
      />
      
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg p-2 overflow-hidden">
          <ReactCrop
            crop={crop}
            onChange={(c) => {
              setCrop(c);
            }}
            onComplete={(c) => {
              setCompletedCrop(c);
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
              }}
            />
          </ReactCrop>
        </div>
        
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg p-4">
          <LivePreview 
            previewUrl={previewUrl} 
            aspectRatio={aspectRatio}
            placeholderLabel={placeholderLabel}
          />
          
          {imageKey && (
            <div className="mt-4 bg-navy bg-opacity-10 p-3 rounded">
              <h5 className="font-medium text-sm text-navy mb-1">Recommended for "{imageKey}"</h5>
              <p className="text-xs text-gray-700">
                Position your image so the important elements are clearly visible in the preview above.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <ZoomRotateControls 
        zoom={zoom}
        setZoom={setZoom}
        rotation={rotation}
        setRotation={setRotation}
      />
      
      <div className="w-full mt-4 flex items-center justify-center text-gray-500 gap-2 text-sm">
        <Move className="w-4 h-4" />
        <p>Drag to position the image in the placeholder • Use controls to zoom and rotate</p>
      </div>
    </div>
  );
};

export default ImageCropper;
