
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

/**
 * CDN Testing Panel - Now displays a deprecation message
 */
const CdnTestingPanel = () => {
  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <CardTitle className="text-navy text-lg flex items-center">
          <span>Image Management</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">
                CDN functionality has been removed
              </p>
              <p className="text-sm mt-1">
                The site now uses Supabase Storage directly for all images, with appropriate caching and optimization.
                Images are automatically converted to WebP format for better performance where supported.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CdnTestingPanel;
