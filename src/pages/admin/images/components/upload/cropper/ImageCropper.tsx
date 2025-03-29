
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
  const [isDragging, setIsDragging] = useState(false);

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
    
    // Apply rotation and zoom if needed
    ctx.save();
    if (rotation !== 0 || zoom !== 1) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
    
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
    
    ctx.restore();
    
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
    <div className="flex flex-col">
      <div className="relative">
        <ReactCrop
          crop={crop}
          onChange={(c) => {
            setCrop(c);
            setIsDragging(true);
          }}
          onComplete={(c) => {
            setCompletedCrop(c);
            setIsDragging(false);
          }}
          aspect={aspectRatio}
          className="max-h-[400px] flex justify-center react-crop-container"
        >
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Crop Preview"
            style={{
              maxHeight: '400px',
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
        
        {isDragging && (
          <div className="absolute top-0 left-0 right-0 bg-navy text-white text-center py-1 text-sm">
            Dragging selection...
          </div>
        )}
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
      
      <style>
        {`
        .react-crop-container .ReactCrop__crop-selection {
          border: 2px solid #0A1A2F;
          box-shadow: 0 0 0 9999em rgba(0, 0, 0, 0.5);
        }
        .ReactCrop__drag-handle {
          background-color: #0A1A2F;
          width: 10px;
          height: 10px;
        }
        .ReactCrop__drag-handle:after {
          width: 10px;
          height: 10px;
          background-color: rgba(10, 26, 47, 0.5);
        }
        .ReactCrop__drag-handle.ord-nw, 
        .ReactCrop__drag-handle.ord-ne,
        .ReactCrop__drag-handle.ord-sw,
        .ReactCrop__drag-handle.ord-se {
          width: 12px;
          height: 12px;
        }
        `}
      </style>
    </div>
  );
};

export default ImageCropper;
