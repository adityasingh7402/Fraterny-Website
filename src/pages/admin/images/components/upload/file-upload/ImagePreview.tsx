
import { useState } from 'react';
import { CropIcon, Smartphone, Monitor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageCropHandler from '../ImageCropHandler';

interface ImagePreviewProps {
  file: File;
  previewUrl: string;
  onCroppedFile: (file: File) => void;
  imageKey: string;
}

const ImagePreview = ({ 
  file, 
  previewUrl, 
  onCroppedFile,
  imageKey 
}: ImagePreviewProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isCropping, setIsCropping] = useState(false);
  
  return (
    <div className="space-y-4">
      {!isCropping ? (
        <div className="space-y-4">
          <Tabs defaultValue="desktop" className="w-full" onValueChange={(v) => setViewMode(v as 'desktop' | 'mobile')}>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-navy">Image Preview</h4>
              <TabsList className="grid grid-cols-2 w-auto">
                <TabsTrigger value="desktop" className="flex items-center gap-1 px-3">
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex items-center gap-1 px-3">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="desktop" className="mt-2">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-4">
                <div className="w-full mx-auto bg-white shadow rounded overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Desktop preview" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="mt-2 text-center text-sm text-navy">
                  Desktop view
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="mobile" className="mt-2">
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-4">
                <div className="bg-gray-100 px-6 pt-6 pb-2 rounded-lg">
                  <div className="max-w-[375px] w-full mx-auto relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-200 rounded-b-lg"></div>
                    <div className="border-4 border-gray-300 rounded-2xl overflow-hidden">
                      <img 
                        src={previewUrl} 
                        alt="Mobile preview" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
                <div className="mt-2 text-center text-sm text-navy">
                  Mobile view
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setIsCropping(true)}
              className="px-4 py-2 bg-navy text-white rounded-md flex items-center hover:bg-opacity-90 transition-colors"
            >
              <CropIcon className="w-4 h-4 mr-2" /> 
              Edit & Crop Image
            </button>
          </div>
        </div>
      ) : (
        <ImageCropHandler 
          imageSrc={previewUrl} 
          uploadFile={file}
          onCroppedFile={(croppedFile) => {
            onCroppedFile(croppedFile);
            setIsCropping(false);
          }}
          imageKey={imageKey}
        />
      )}
    </div>
  );
};

export default ImagePreview;
