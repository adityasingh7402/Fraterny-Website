
import { WebsiteImage, IMAGE_USAGE_MAP } from '@/services/images';
import { Info } from 'lucide-react';

interface ImagePreviewProps {
  previewUrl: string | null;
  image: WebsiteImage;
}

const ImagePreview = ({ previewUrl, image }: ImagePreviewProps) => {
  const usageLocation = IMAGE_USAGE_MAP[image.key] || 'Custom image (not tied to a specific website section)';
  
  return (
    <>
      {previewUrl && (
        <div className="border rounded-lg overflow-hidden">
          <img 
            src={previewUrl} 
            alt={image.alt_text} 
            className="w-full h-auto object-contain"
          />
        </div>
      )}
      
      <div className="bg-navy bg-opacity-10 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-navy">Usage Location:</h3>
          <p className="text-sm text-gray-700">{usageLocation}</p>
          <p className="text-xs text-gray-500 mt-1">
            Images with fixed keys replace placeholder images throughout the website.
          </p>
        </div>
      </div>
    </>
  );
};

export default ImagePreview;
