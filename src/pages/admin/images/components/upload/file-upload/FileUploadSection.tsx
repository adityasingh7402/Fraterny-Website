
import { useState } from 'react';
import FileInput from './FileInput';
import ImagePreview from './ImagePreview';
import { Card } from '@/components/ui/card';

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
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hasFile = event.target.files && event.target.files.length > 0;
    setIsFileSelected(hasFile);
    onFileChange(event);
  };

  return (
    <Card className="p-5 bg-white border border-gray-200 rounded-lg">
      <h3 className="font-medium text-navy mb-3">Upload Image</h3>
      
      {!previewUrl ? (
        <FileInput 
          onFileChange={handleFileChange} 
          isFileSelected={isFileSelected} 
        />
      ) : file && (
        <ImagePreview 
          file={file} 
          previewUrl={previewUrl}
          onCroppedFile={onCroppedFile}
          imageKey={imageKey}
        />
      )}
    </Card>
  );
};

export default FileUploadSection;
