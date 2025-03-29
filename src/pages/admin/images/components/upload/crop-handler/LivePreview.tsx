
import { useEffect, useState, RefObject } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type Crop as CropArea } from 'react-image-crop';
import { getRecommendedAspectRatio } from '../constants';

interface LivePreviewProps {
  imgRef: RefObject<HTMLImageElement>;
  crop: CropArea;
  completedCrop: CropArea | null;
  zoom: number;
  rotation: number;
  imageKey: string;
}

const LivePreview = ({
  imgRef,
  crop,
  completedCrop,
  zoom,
  rotation,
  imageKey
}: LivePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  const [placeholderLabel, setPlaceholderLabel] = useState<string>('');
  
  // Set aspect ratio based on image key
  useEffect(() => {
    if (imageKey) {
      const recommended = getRecommendedAspectRatio(imageKey);
      setAspectRatio(recommended.ratio);
      setPlaceholderLabel(recommended.label);
    }
  }, [imageKey]);
  
  // Generate preview whenever crop, zoom or rotation changes
  useEffect(() => {
    if (!imgRef.current || !crop.width || !crop.height) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
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
  }, [crop, zoom, rotation, imgRef.current]);
  
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-navy">Live Website Preview</h4>
        {placeholderLabel && <span className="text-sm text-gray-500">{placeholderLabel}</span>}
      </div>
      
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
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Desktop Preview" 
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Preview will appear here</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-0">
          <div className="bg-gray-100 px-6 pt-6 pb-2 rounded-lg">
            <div className="max-w-[375px] w-full mx-auto relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-200 rounded-b-lg"></div>
              <div className="border-4 border-gray-300 rounded-2xl overflow-hidden">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Mobile Preview" 
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Mobile preview</p>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <p className="mt-3 text-sm text-gray-600">
        This is a realistic preview of how your image will appear on the website.
      </p>
    </div>
  );
};

export default LivePreview;
