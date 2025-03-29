
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { type Crop as CropArea } from 'react-image-crop';
import { CropIcon, ArrowLeft } from 'lucide-react';
import { getRecommendedAspectRatio } from './constants';
import { ImageCropper } from './cropper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Monitor } from 'lucide-react';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (imageKey && imgRef.current) {
      const recommended = getRecommendedAspectRatio(imageKey);
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        let cropWidth, cropHeight;
        
        if (recommended.ratio > 1) {
          cropWidth = width * 0.8;
          cropHeight = cropWidth / recommended.ratio;
        } else {
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

  // Update preview when crop, zoom or rotation changes
  useEffect(() => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      updatePreview();
    }
  }, [completedCrop, zoom, rotation]);

  const updatePreview = () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.save();
    
    // Apply rotation and zoom if needed
    if (rotation !== 0 || zoom !== 1) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
    
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
    
    ctx.restore();
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    setPreviewUrl(dataUrl);
  };

  const applyChanges = async () => {
    if (!completedCrop || !imgRef.current) {
      toast.error('Please make a crop selection first');
      return;
    }

    const croppedFile = await getCroppedImg(uploadFile.name, uploadFile.type);
    if (croppedFile) {
      onCroppedFile(croppedFile);
      toast.success('Crop applied successfully');
    } else {
      toast.error('Failed to create cropped image');
    }
  };

  const getCroppedImg = async (fileName: string, fileType: string): Promise<File | null> => {
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
    
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    
    ctx.save();
    
    if (rotation !== 0 || zoom !== 1) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
    
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
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => onCroppedFile(uploadFile)}
          className="flex items-center text-navy hover:text-navy-dark transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> 
          Back to Preview
        </button>
        
        <button
          type="button"
          onClick={applyChanges}
          className="px-3 py-1.5 bg-navy text-white rounded-md flex items-center hover:bg-opacity-90 transition-colors"
        >
          <CropIcon className="w-4 h-4 mr-1.5" /> Apply Crop
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 border rounded-lg overflow-hidden bg-white p-4">
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
            onCancelCrop={() => onCroppedFile(uploadFile)}
            imageKey={imageKey}
          />
        </div>
        
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-navy mb-3">Live Preview</h4>
          
          <Tabs defaultValue="desktop" className="w-full" onValueChange={(v) => setViewMode(v as 'desktop' | 'mobile')}>
            <TabsList className="grid grid-cols-2 w-full mb-3">
              <TabsTrigger value="desktop" className="flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="desktop" className="mt-0">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                {previewUrl ? (
                  <div className="w-full">
                    <img 
                      src={previewUrl} 
                      alt="Desktop preview" 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-500 text-sm p-4 text-center">
                    Make a selection to see preview
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="mobile" className="mt-0">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="mx-auto w-full max-w-[375px]">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Mobile preview" 
                      className="w-full h-auto object-contain"
                    />
                  ) : (
                    <div className="h-48 flex items-center justify-center bg-gray-100 text-gray-500 text-sm p-4 text-center">
                      Make a selection to see preview
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-4 text-xs text-gray-600">
            <p>This is how your image will appear on the website.</p>
            <p className="mt-1">Adjust the crop area to customize how the image is displayed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropHandler;
