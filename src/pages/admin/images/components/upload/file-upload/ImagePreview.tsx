
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
  return (
    <ImageCropHandler 
      imageSrc={previewUrl} 
      uploadFile={file}
      onCroppedFile={onCroppedFile}
      imageKey={imageKey}
    />
  );
};

export default ImagePreview;
