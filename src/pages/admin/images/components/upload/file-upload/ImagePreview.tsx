
import { useState } from 'react';
import { Crop as CropIcon, Trash2 } from 'lucide-react';
import { ImageCropHandler } from '../../upload/crop-handler';

interface ImagePreviewProps {
  file: File;
  previewUrl: string;
  onCroppedFile: (file: File) => void;
  imageKey: string;
}

const ImagePreview = ({ file, previewUrl, onCroppedFile, imageKey }: ImagePreviewProps) => {
  const [isCropping, setIsCropping] = useState(false);
  
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

  return (
    <div className="space-y-4">
      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="w-full h-64 object-contain bg-gray-50"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-sm truncate max-w-[180px]">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {formatFileSize(file.size)}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleStartCrop}
            className="p-2 bg-navy text-white rounded hover:bg-opacity-90"
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
