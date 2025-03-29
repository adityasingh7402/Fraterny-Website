
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';

interface LivePreviewProps {
  previewUrl: string | null;
  aspectRatio: number | undefined;
  placeholderLabel?: string;
}

const LivePreview = ({ previewUrl, aspectRatio, placeholderLabel }: LivePreviewProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-navy">Preview in Placeholder</h4>
        {placeholderLabel && <span className="text-sm text-gray-500">{placeholderLabel}</span>}
      </div>
      <Card className="overflow-hidden border border-gray-200">
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
    </>
  );
};

export default LivePreview;
