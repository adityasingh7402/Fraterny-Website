
import { useState } from 'react';
import { Crop as CropIcon, Info, Trash2 } from 'lucide-react';
import { ImageCropHandler } from '../../upload/crop-handler';
import { useIsMobile } from '@/hooks/use-mobile';
import { IMAGE_USAGE_MAP } from '@/services/images';

interface ImagePreviewProps {
  file: File;
  previewUrl: string;
  onCroppedFile: (file: File) => void;
  imageKey: string;
}

const ImagePreview = ({ file, previewUrl, onCroppedFile, imageKey }: ImagePreviewProps) => {
  const [isCropping, setIsCropping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const isMobile = useIsMobile();
  
  // Determine if image is used as cover or contain based on usage key
  const getObjectFit = (): 'cover' | 'contain' => {
    if (
      imageKey.includes('hero') || 
      imageKey.includes('background') || 
      imageKey.includes('banner') ||
      imageKey.includes('villalab') ||
      imageKey.includes('experience')
    ) {
      return 'cover';
    }
    return 'contain';
  };
  
  const objectFit = getObjectFit();
  
  const handleStartCrop = () => {
    setIsCropping(true);
  };
  
  const handleCroppedFile = (croppedFile: File) => {
    setIsCropping(false);
    onCroppedFile(croppedFile);
  };
  
  if (isCropping) {
    return (
      <ImageCropHandler 
        imageSrc={previewUrl}
        uploadFile={file}
        onCroppedFile={handleCroppedFile}
        imageKey={imageKey}
      />
    );
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  
  // Get usage information if it exists
  const usageInfo = IMAGE_USAGE_MAP[imageKey] || '';

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
        {imageKey && (
          <div className="bg-navy bg-opacity-10 rounded-t-lg px-2 py-1 text-xs text-center">
            {objectFit === 'cover' ? 'Image will fill the entire container' : 'Image will be fully visible'}
            {usageInfo && ` • ${usageInfo}`}
          </div>
        )}
        
        {/* Preview showing exactly how the image will display on the website */}
        <div className={`relative w-full ${isMobile ? 'h-48' : 'h-64'} bg-gray-50`}>
          <img 
            src={previewUrl} 
            alt="Preview" 
            className={`w-full h-full object-${objectFit}`}
          />
          
          {/* Info overlay that shows when hovering on the info icon */}
          {showInfo && (
            <div className="absolute inset-0 bg-navy bg-opacity-90 text-white p-3 text-xs overflow-y-auto">
              <h4 className="font-bold mb-1">About Image Display</h4>
              <p className="mb-2">The image above shows exactly how it will appear on the website.</p>
              
              <h5 className="font-semibold mb-1">Tips:</h5>
              <ul className="list-disc pl-4 space-y-1">
                <li>{objectFit === 'cover' ? 
                  "This image uses 'cover' mode - it will fill the entire container but may crop edges" : 
                  "This image uses 'contain' mode - the entire image will be visible"}</li>
                <li>Use the crop tool to adjust which parts of the image are visible</li>
                <li>Cropping is preserved across all devices and screen sizes</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} truncate max-w-[140px] md:max-w-[180px]`}>
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(file.size)}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            className={`${isMobile ? 'p-1.5' : 'p-2'} bg-gray-100 text-gray-700 rounded hover:bg-gray-200`}
            onClick={() => setShowInfo(!showInfo)}
            title="Display information"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleStartCrop}
            className={`${isMobile ? 'p-1.5' : 'p-2'} bg-navy text-white rounded hover:bg-opacity-90`}
            title="Crop Image"
          >
            <CropIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
