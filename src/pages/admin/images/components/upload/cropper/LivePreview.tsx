
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { Smartphone, Monitor } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface LivePreviewProps {
  previewUrl: string | null;
  aspectRatio: number | undefined;
  placeholderLabel?: string;
}

const LivePreview = ({ previewUrl, aspectRatio, placeholderLabel }: LivePreviewProps) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-navy">Preview</h4>
        {placeholderLabel && <span className="text-sm text-gray-500">{placeholderLabel}</span>}
      </div>
      
      <Tabs defaultValue="desktop" className="w-full" onValueChange={(v) => setViewMode(v as 'desktop' | 'mobile')}>
        <TabsList className="grid grid-cols-2 w-full mb-3">
          <TabsTrigger value="desktop" className="flex items-center gap-1">
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="desktop" className="mt-0">
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
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
        </TabsContent>
        
        <TabsContent value="mobile" className="mt-0">
          <Card className="overflow-hidden border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              {previewUrl ? (
                <div className="max-w-[375px] mx-auto">
                  <AspectRatio ratio={aspectRatio || 16/9} className="overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Crop Preview"
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <AspectRatio ratio={aspectRatio || 16/9} className="flex items-center justify-center bg-gray-200">
                  <p className="text-gray-500 text-sm">Preview will appear here</p>
                </AspectRatio>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <p className="mt-2 text-xs text-gray-600">
        This is how your image will appear on the website.
      </p>
    </>
  );
};

export default LivePreview;
