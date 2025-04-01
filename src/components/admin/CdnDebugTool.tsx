
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, XCircle2, RefreshCw, AlertTriangle, ArrowRight } from "lucide-react";
import { getCdnBaseUrl, testCdnConnection, isCdnEnabled } from '@/utils/cdnUtils';
import { getCdnUrl } from '@/utils/cdnUtils';

/**
 * Component for testing CDN configuration and providing diagnostics
 */
const CdnDebugTool = () => {
  const [isCdnAvailable, setIsCdnAvailable] = useState<boolean | null>(null);
  const [isTestingCdn, setIsTestingCdn] = useState(false);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [testImageUrl, setTestImageUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [actualUrl, setActualUrl] = useState<string>('');
  const [cdnBaseUrl, setCdnBaseUrl] = useState<string>('');

  // Load initial state
  useEffect(() => {
    setIsEnabled(isCdnEnabled());
    setCdnBaseUrl(getCdnBaseUrl());
    
    // Create a test URL
    const testPath = '/images/hero/luxury-villa-mobile.webp';
    setTestImageUrl(testPath);
    setProcessedUrl(getCdnUrl(testPath) || 'Error processing URL');
    
    // Test connection on load
    testCdn();
    
    // Set up a listener for network requests to catch actual URLs being used
    if (typeof window !== 'undefined') {
      const originalFetch = window.fetch;
      window.fetch = function(input, init) {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input instanceof Request ? input.url : '';
        
        // If this is an image request, store the URL for debugging
        if (url && (url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.webp') || url.endsWith('.svg') || url.includes('/images/'))) {
          setActualUrl(url);
        }
        
        return originalFetch.apply(this, [input, init]);
      };
    }
  }, []);

  const testCdn = async () => {
    setIsTestingCdn(true);
    try {
      const isAvailable = await testCdnConnection();
      setIsCdnAvailable(isAvailable);
    } catch (error) {
      console.error('Error testing CDN:', error);
      setIsCdnAvailable(false);
    } finally {
      setIsTestingCdn(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          CDN Diagnostic Tool
          <Badge variant={isEnabled ? "default" : "outline"}>
            {isEnabled ? "CDN Enabled" : "CDN Disabled"}
          </Badge>
        </CardTitle>
        <CardDescription>
          Diagnose and test your CDN configuration
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* CDN Status */}
        <div className="rounded-lg bg-gray-50 p-4 border">
          <h3 className="font-medium mb-2">CDN Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between bg-white p-3 rounded-md border">
              <span className="text-sm text-gray-600">Connection Status</span>
              {isCdnAvailable === null ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <div className="flex items-center gap-1.5">
                  {isCdnAvailable ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle2 className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${isCdnAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {isCdnAvailable ? 'Connected' : 'Failed'}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-md border">
              <span className="text-sm text-gray-600">CDN Base URL</span>
              <span className="text-sm font-mono bg-gray-50 px-2 py-1 rounded">{cdnBaseUrl}</span>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="mt-3" 
            onClick={testCdn} 
            disabled={isTestingCdn}
          >
            {isTestingCdn ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Testing CDN
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Test CDN Connection
              </>
            )}
          </Button>
        </div>
        
        {/* URL Testing */}
        <div className="rounded-lg bg-gray-50 p-4 border">
          <h3 className="font-medium mb-2">Test URL Resolution</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-md border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Original Path</span>
              </div>
              <div className="font-mono text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                {testImageUrl}
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="bg-white p-3 rounded-md border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Processed by getCdnUrl()</span>
              </div>
              <div className="font-mono text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                {processedUrl}
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
            
            <div className="bg-white p-3 rounded-md border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Actual Network Request URL</span>
              </div>
              <div className="font-mono text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                {actualUrl || "No image requests detected yet"}
              </div>
            </div>
          </div>
        </div>
        
        {/* Diagnostic Alerts */}
        {processedUrl && actualUrl && processedUrl !== actualUrl && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>URL Mismatch Detected</AlertTitle>
            <AlertDescription>
              The URL processed by getCdnUrl() doesn't match the actual network request.
              This suggests there might be hardcoded CDN URLs or bypass logic in your code.
            </AlertDescription>
          </Alert>
        )}
        
        {processedUrl && !processedUrl.includes(cdnBaseUrl) && isEnabled && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>CDN URL Not Applied</AlertTitle>
            <AlertDescription>
              The CDN URL is not being correctly applied to your image paths.
              Check the getCdnUrl implementation in your cdnUtils.ts file.
            </AlertDescription>
          </Alert>
        )}
        
        {cdnBaseUrl && processedUrl?.includes('image-handler.pages.dev') && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Old CDN URL Detected</AlertTitle>
            <AlertDescription>
              Your code is still using the old CDN URL (image-handler.pages.dev) instead of the 
              new worker URL. Check for hardcoded URLs in your codebase.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default CdnDebugTool;
