
import { FileInput } from './';
import { ImagePreview } from './';

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
      <FileInput onFileChange={onFileChange} />
      
      {file && previewUrl && (
        <ImagePreview 
          file={file}
          previewUrl={previewUrl}
          onCroppedFile={onCroppedFile}
          imageKey={imageKey}
        />
      )}
    </div>
  );
};

export default FileUploadSection;
