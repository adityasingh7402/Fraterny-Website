
import { useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import ImageCropHandler from './ImageCropHandler';

interface FileUploadSectionProps {
  file: File | null;
  previewUrl: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCroppedFile: (file: File) => void;
  imageKey: string;
}

const FileUploadSection = ({ 
  file, 
  previewUrl, 
  onFileChange, 
  onCroppedFile,
  imageKey
}: FileUploadSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="relative">
        <FormLabel className="block mb-1 font-medium">Image</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="cursor-pointer"
        />
      </div>
      
      {file && previewUrl && (
        <ImageCropHandler 
          imageSrc={previewUrl} 
          uploadFile={file}
          onCroppedFile={onCroppedFile}
          imageKey={imageKey}
        />
      )}
    </div>
  );
};

export default FileUploadSection;
