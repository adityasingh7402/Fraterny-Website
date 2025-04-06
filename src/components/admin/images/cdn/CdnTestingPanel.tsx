
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import UrlTester from './UrlTester';

/**
 * Supabase Storage Testing Panel
 * This component replaces the old CDN testing panel
 */
const StorageTestingPanel = () => {
  const [isTestingUrl, setIsTestingUrl] = React.useState(false);
  
  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <CardTitle className="text-navy text-lg flex items-center">
          <span>Supabase Storage Management</span>
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
                Image Management Information
              </p>
              <p className="text-sm mt-1">
                The site uses Supabase Storage directly for all images, with appropriate caching and optimization.
                Images are automatically served from Supabase's global CDN for optimal performance.
              </p>
            </div>
          </div>
        </div>
        
        <UrlTester isTestingCdn={isTestingUrl} setIsTestingCdn={setIsTestingUrl} />
      </CardContent>
    </Card>
  );
};

export default StorageTestingPanel;
