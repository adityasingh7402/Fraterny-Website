
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import ImagePreview from './ImagePreview';
import ImageCropper from './ImageCropper';

interface ImageCropHandlerProps {
  imageSrc: string | null;
  uploadFile: File | null;
  onCroppedFile: (file: File) => void;
}

const ImageCropHandler = ({ imageSrc, uploadFile, onCroppedFile }: ImageCropHandlerProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({
    unit: 'px' as const,
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<any>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Function to apply crop
  const getCroppedImg = useCallback(async (): Promise<File | null> => {
    if (!completedCrop || !uploadFile || !imgRef.current) {
      toast.error('Unable to crop image, try again');
      return null;
    }

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    // Account for zoom and rotation
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast.error('Unable to create canvas context');
      return null;
    }
    
    const pixelRatio = window.devicePixelRatio;
    
    // Set canvas size to the cropped area
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    // Clear the canvas
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw cropped image
    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    
    // Create a blob from the canvas
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob || !uploadFile) {
          resolve(null);
          return;
        }
        
        // Create a new file with the cropped image
        const croppedFile = new File([blob], uploadFile.name, {
          type: uploadFile.type,
          lastModified: Date.now(),
        });
        
        resolve(croppedFile);
      }, uploadFile.type, 0.95);
    });
  }, [completedCrop, uploadFile]);

  const handleApplyCrop = async () => {
    if (completedCrop) {
      const croppedFile = await getCroppedImg();
      if (croppedFile) {
        onCroppedFile(croppedFile);
        setIsCropping(false);
        toast.success('Crop applied successfully');
      }
    }
  };

  if (!imageSrc) return null;

  return (
    <ImagePreview
      imageSrc={imageSrc}
      isCropping={isCropping}
      onToggleCrop={() => setIsCropping(!isCropping)}
    >
      {isCropping ? (
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
          onApplyChanges={handleApplyCrop}
          onCancelCrop={() => setIsCropping(false)}
        />
      ) : null}
    </ImagePreview>
  );
};

export default ImageCropHandler;
