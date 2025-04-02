
import React, { useState, useEffect } from 'react';
import { ImageIcon, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCdnUrl } from '@/utils/cdn';
import { toast } from 'sonner';

interface UrlTesterProps {
  isTestingCdn: boolean;
  setIsTestingCdn: React.Dispatch<React.SetStateAction<boolean>>;
}

const UrlTester: React.FC<UrlTesterProps> = ({ isTestingCdn, setIsTestingCdn }) => {
  const [testImageUrl, setTestImageUrl] = useState<string>('/images/hero/luxury-villa-mobile.webp');
  const [cdnTransformedUrl, setCdnTransformedUrl] = useState<string | null>(null);

  // Update CDN transformed URL when test URL changes
  useEffect(() => {
    if (testImageUrl) {
      try {
        const transformed = getCdnUrl(testImageUrl, true);
        setCdnTransformedUrl(transformed);
      } catch (e) {
        console.error('Error transforming URL:', e);
        setCdnTransformedUrl(null);
      }
    }
  }, [testImageUrl]);

  // Test a specific URL
  const testSpecificUrl = async () => {
    if (!testImageUrl) return;
    
    setIsTestingCdn(true);
    try {
      const transformedUrl = getCdnUrl(testImageUrl, true);
      
      if (!transformedUrl) {
        toast.error('URL transformation failed', {
          description: 'Could not transform the URL for CDN. Check your URL syntax.',
        });
        return;
      }
      
      console.log(`[CDN] Testing specific URL: ${transformedUrl}`);
      
      // Test the URL
      const response = await fetch(transformedUrl, { 
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      console.log(`[CDN] Test result: ${response.status} ${response.ok}`);
      
      if (response.ok) {
        toast.success('URL test successful', {
          description: `The URL was successfully fetched through your CDN.`,
        });
      } else {
        toast.error('URL test failed', {
          description: `Could not fetch the URL through your CDN. Status: ${response.status}.`,
        });
      }
    } catch (error) {
      console.error('Error testing specific URL:', error);
      toast.error('URL test error', {
        description: 'An error occurred while testing the URL.',
      });
    } finally {
      setIsTestingCdn(false);
    }
  };

  return (
    <div className="border rounded-md p-3 space-y-3">
      <div className="flex items-center space-x-2">
        <ImageIcon className="h-4 w-4 text-navy" />
        <span className="font-medium">Test Specific URL</span>
      </div>
      
      <div className="space-y-2">
        <Input 
          value={testImageUrl}
          onChange={(e) => setTestImageUrl(e.target.value)}
          placeholder="/images/your-image-path.jpg or https://your-domain.com/images/image.jpg"
          className="w-full font-mono text-sm"
        />
        
        {cdnTransformedUrl && (
          <div className="bg-gray-50 p-2 rounded-md">
            <p className="text-xs text-gray-500">Transformed URL:</p>
            <p className="text-xs font-mono break-all">{cdnTransformedUrl}</p>
          </div>
        )}
        
        <Button onClick={testSpecificUrl} disabled={isTestingCdn || !testImageUrl}>
          {isTestingCdn ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test URL'
          )}
        </Button>
      </div>
    </div>
  );
};

export default UrlTester;
