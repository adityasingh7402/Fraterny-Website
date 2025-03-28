
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface LivePreviewProps {
  previewUrl: string | null;
  aspectRatio: number | undefined;
}

const LivePreview = ({ previewUrl, aspectRatio }: LivePreviewProps) => {
  return (
    <>
      <h4 className="font-medium text-navy mb-2">Live Preview</h4>
      <div className="mb-4 bg-gray-100 rounded border border-gray-200">
        {previewUrl ? (
          <AspectRatio ratio={aspectRatio || 16/9} className="overflow-hidden">
            <img
              src={previewUrl}
              alt="Crop Preview"
              className="w-full h-full object-cover"
            />
          </AspectRatio>
        ) : (
          <AspectRatio ratio={aspectRatio || 16/9} className="flex items-center justify-center bg-gray-200">
            <p className="text-gray-500 text-sm">Preview will appear here</p>
          </AspectRatio>
        )}
      </div>
    </>
  );
};

export default LivePreview;
