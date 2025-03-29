
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { type Crop as CropArea } from 'react-image-crop';
import { CropIcon } from 'lucide-react';
import { getRecommendedAspectRatio } from './constants';
import ImageCropper from './cropper/ImageCropper';

interface ImageCropHandlerProps {
  imageSrc: string;
  uploadFile: File;
  onCroppedFile: (file: File) => void;
  imageKey: string;
}

const ImageCropHandler = ({ 
  imageSrc, 
  uploadFile, 
  onCroppedFile,
  imageKey
}: ImageCropHandlerProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCropping, setIsCropping] = useState(false);
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

  // Initialize with recommended aspect ratio
  useEffect(() => {
    if (imageKey) {
      const recommended = getRecommendedAspectRatio(imageKey);
      // Set initial crop based on recommended aspect ratio
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        let cropWidth, cropHeight;
        
        if (recommended.ratio > 1) {
          // Landscape
          cropWidth = width * 0.8;
          cropHeight = cropWidth / recommended.ratio;
        } else {
          // Portrait or square
          cropHeight = height * 0.8;
          cropWidth = cropHeight * recommended.ratio;
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
    }
  }, [imageKey, imgRef.current]);

  const applyChanges = () => {
    if (!completedCrop || !imgRef.current) {
      toast.error('Please make a crop selection first');
      return;
    }

    const croppedFile = getCroppedImg(uploadFile.name, uploadFile.type);
    if (croppedFile) {
      onCroppedFile(croppedFile);
      setIsCropping(false);
      toast.success('Crop applied successfully');
    }
  };

  const getCroppedImg = (fileName: string, fileType: string): File | null => {
    if (!imgRef.current || !completedCrop) {
      return null;
    }
    
    const canvas = document.createElement('canvas');
    const image = imgRef.current;
    const crop = completedCrop;
    
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return null;
    }
    
    // Set canvas size to the dimensions of the crop
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    // Apply rotation and crop
    ctx.save();
    
    // Move the crop origin to the canvas center
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Apply zoom
    ctx.scale(zoom, zoom);
    
    // Move back to the top left corner
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    
    // Draw the image with the crop applied
    ctx.drawImage(
      image,
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
    
    // Convert canvas to file
    return new Promise<File | null>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          
          const file = new File([blob], fileName, {
            type: fileType,
            lastModified: Date.now(),
          });
          
          resolve(file);
        },
        fileType,
        0.95
      );
    }) as unknown as File | null;
  };

  const toggleCropping = () => {
    setIsCropping(!isCropping);
  };

  return (
    <div className="mt-4">
      {!isCropping ? (
        <div className="flex flex-col items-center">
          <img 
            src={imageSrc} 
            alt="Preview" 
            className="max-h-[300px] object-contain mb-3" 
          />
          <button
            type="button"
            onClick={toggleCropping}
            className="px-3 py-1.5 bg-gray-200 text-navy rounded-md flex items-center hover:bg-gray-300 transition-colors"
          >
            <CropIcon className="w-4 h-4 mr-1.5" /> Crop Image
          </button>
        </div>
      ) : (
        <ImageCropper
          imageSrc={imageSrc}
          crop={crop}
          setCrop={setCrop}
          setCompletedCrop={setCompletedCrop}
          zoom={zoom}
          setZoom={setZoom}
          rotation={rotation}
          setRotation={setRotation}
          imgRef={imgRef}
          onApplyChanges={applyChanges}
          onCancelCrop={() => setIsCropping(false)}
          imageKey={imageKey}
        />
      )}
    </div>
  );
};

export default ImageCropHandler;
