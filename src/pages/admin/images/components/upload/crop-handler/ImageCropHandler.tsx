
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { type Crop as CropArea } from 'react-image-crop';
import { getRecommendedAspectRatio } from '../constants';
import { ImageCropHandlerProps } from './types';
import CropControls from './CropControls';
import CropCanvas from './CropCanvas';
import LivePreview from './LivePreview';
import { createCroppedImage } from './utils';

const ImageCropHandler = ({ 
  imageSrc, 
  uploadFile, 
  onCroppedFile,
  imageKey
}: ImageCropHandlerProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<CropArea>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<CropArea | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Initialize crop area based on image key once the image is loaded
  useEffect(() => {
    if (imageKey && imgRef.current && imgRef.current.complete && imageLoaded) {
      // Get recommended aspect ratio for this image key
      const recommendedAspect = getRecommendedAspectRatio(imageKey);
      
      const img = imgRef.current;
      const { width, height } = img;
      
      let cropWidth, cropHeight;
      
      if (recommendedAspect.ratio > 1) {
        // Landscape
        cropWidth = width * 0.8;
        cropHeight = cropWidth / recommendedAspect.ratio;
      } else {
        // Portrait or square
        cropHeight = height * 0.8;
        cropWidth = cropHeight * recommendedAspect.ratio;
      }
      
      const x = (width - cropWidth) / 2;
      const y = (height - cropHeight) / 2;
      
      setCrop({
        unit: 'px',
        x,
        y,
        width: cropWidth,
        height: cropHeight
      });
    }
  }, [imageKey, imageLoaded]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const applyChanges = async () => {
    if (!completedCrop || !imgRef.current) {
      toast.error('Please make a crop selection first');
      return;
    }

    try {
      const croppedFile = await createCroppedImage(
        uploadFile.name,
        uploadFile.type,
        imgRef.current,
        completedCrop,
        zoom,
        rotation
      );
      
      if (croppedFile) {
        onCroppedFile(croppedFile);
        toast.success('Crop applied successfully');
      } else {
        toast.error('Failed to create cropped image');
      }
    } catch (error) {
      console.error('Error creating cropped image:', error);
      toast.error('An error occurred while processing the image');
    }
  };

  return (
    <div className="space-y-6">
      <CropControls
        zoom={zoom}
        setZoom={setZoom}
        rotation={rotation}
        setRotation={setRotation}
        onApplyChanges={applyChanges}
        onCancel={() => onCroppedFile(uploadFile)}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CropCanvas
            imageSrc={imageSrc}
            imgRef={imgRef}
            crop={crop}
            setCrop={setCrop}
            setCompletedCrop={setCompletedCrop}
            zoom={zoom}
            rotation={rotation}
            imageKey={imageKey}
            onImageLoad={handleImageLoad}
          />
        </div>
        
        <div>
          <LivePreview
            imgRef={imgRef}
            crop={crop}
            completedCrop={completedCrop}
            zoom={zoom}
            rotation={rotation}
            imageKey={imageKey}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageCropHandler;
