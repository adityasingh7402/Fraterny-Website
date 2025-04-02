
import React, { useState, useEffect } from 'react';
import { ImageIcon, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCdnUrl } from '@/utils/cdn';
import { toast } from 'sonner';

interface UrlTesterProps {
  isTestingCdn: boolean;
  setIsTestingCdn: React.Dispatch<React.SetStateAction<boolean>>;
}

const UrlTester: React.FC<UrlTesterProps> = ({ isTestingCdn, setIsTestingCdn }) => {
  const [testImageUrl, setTestImageUrl] = useState<string>('/website-images/placeholder.svg');
  const [cdnTransformedUrl, setCdnTransformedUrl] = useState<string | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState<boolean>(false);

  // Update CDN transformed URL when test URL changes
  useEffect(() => {
    if (testImageUrl) {
      try {
        const transformed = getCdnUrl(testImageUrl, true);
        setCdnTransformedUrl(transformed);
        setTestError(null); // Clear any previous errors
        setTestSuccess(false); // Reset success state
      } catch (e) {
        console.error('Error transforming URL:', e);
        setCdnTransformedUrl(null);
        setTestError('Error transforming URL. Please check your URL format.');
        setTestSuccess(false);
      }
    }
  }, [testImageUrl]);

  // Test a specific URL
  const testSpecificUrl = async () => {
    if (!testImageUrl) return;
    
    setIsTestingCdn(true);
    setTestError(null); // Clear any previous errors
    setTestSuccess(false); // Reset success state
    
    try {
      const transformedUrl = getCdnUrl(testImageUrl, true);
      
      if (!transformedUrl) {
        setTestError('URL transformation failed. Check your URL syntax.');
        toast.error('URL transformation failed', {
          description: 'Could not transform the URL for CDN. Check your URL syntax.',
        });
        setIsTestingCdn(false);
        return;
      }
      
      console.log(`[CDN] Testing specific URL: ${transformedUrl}`);
      
      // Create an AbortController to handle timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        // Test the URL with a timeout - using actual image fetch 
        // instead of HEAD to ensure proper testing
        const response = await fetch(transformedUrl, { 
          method: 'GET',
          signal: controller.signal,
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        clearTimeout(timeoutId);
        
        console.log(`[CDN] Test result: ${response.status} ${response.ok}`);
        
        if (response.ok) {
          setTestSuccess(true);
          toast.success('URL test successful', {
            description: `The image was successfully fetched through your CDN.`,
          });
        } else {
          setTestError(`HTTP Error: ${response.status} ${response.statusText}`);
          toast.error('URL test failed', {
            description: `Could not fetch the image through your CDN. Status: ${response.status}.`,
          });
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
        setTestError(errorMessage);
        
        if (fetchError.name === 'AbortError') {
          toast.error('URL test timed out', {
            description: 'The request took too long to complete. Your CDN might be slow or unreachable.',
          });
        } else {
          toast.error('URL test error', {
            description: errorMessage || 'An unknown error occurred while testing the URL.',
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error testing specific URL:', error);
      setTestError(errorMessage);
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
        <div className="text-xs text-gray-500 mb-1">
          Enter a storage path (e.g., /website-images/your-image.png) or Supabase URL
        </div>
        <Input 
          value={testImageUrl}
          onChange={(e) => setTestImageUrl(e.target.value)}
          placeholder="/website-images/your-image-path.jpg"
          className="w-full font-mono text-sm"
        />
        
        {cdnTransformedUrl && (
          <div className={`${testSuccess ? 'bg-green-50' : 'bg-gray-50'} p-2 rounded-md`}>
            <p className="text-xs text-gray-500">Transformed URL:</p>
            <p className="text-xs font-mono break-all">{cdnTransformedUrl}</p>
            {testSuccess && (
              <div className="mt-2">
                <a 
                  href={cdnTransformedUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs flex items-center text-blue-600 hover:underline"
                >
                  Open image in new tab
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        )}
        
        {testError && (
          <div className="bg-red-50 p-2 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-red-700">URL test error</p>
              <p className="text-xs text-red-600 break-words">{testError}</p>
            </div>
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
