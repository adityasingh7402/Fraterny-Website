
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import ResponsiveImage from '@/components/ui/image/ResponsiveImage';
import { getCdnUrl } from '@/utils/cdnUtils';

const CdnTestPage = () => {
  const [isCdnEnabled, setIsCdnEnabled] = useState<boolean>(false);
  const [directUrl, setDirectUrl] = useState<string>('');
  const [cdnUrl, setCdnUrl] = useState<string>('');
  
  useEffect(() => {
    // Check if CDN is enabled from localStorage
    const cdnEnabled = localStorage.getItem('use_cdn_development') === 'true';
    setIsCdnEnabled(cdnEnabled);
    
    // Set up example URLs
    const imagePath = '/images/hero/luxury-villa-desktop.webp';
    setDirectUrl(imagePath);
    setCdnUrl(getCdnUrl(imagePath) || 'Error processing URL');
  }, []);
  
  const toggleCdn = () => {
    const newValue = !isCdnEnabled;
    localStorage.setItem('use_cdn_development', String(newValue));
    setIsCdnEnabled(newValue);
    window.location.reload();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CDN Testing Page</h1>
        <Button 
          onClick={toggleCdn}
          variant={isCdnEnabled ? "default" : "outline"}
        >
          CDN is {isCdnEnabled ? "ON" : "OFF"}
        </Button>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-medium mb-2">URL Transformation</h2>
        <div className="space-y-2">
          <div>
            <p className="text-sm text-gray-500">Original URL:</p>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{directUrl}</code>
          </div>
          <div>
            <p className="text-sm text-gray-500">Processed with getCdnUrl():</p>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{cdnUrl}</code>
          </div>
        </div>
      </div>

      <Tabs defaultValue="original" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="original">Original Image</TabsTrigger>
          <TabsTrigger value="cdn">CDN Image</TabsTrigger>
          <TabsTrigger value="comparison">Side-by-Side</TabsTrigger>
          <TabsTrigger value="responsive">Responsive Component</TabsTrigger>
        </TabsList>
        
        <TabsContent value="original">
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2 text-gray-500">Direct image without CDN processing:</p>
              <img 
                src={directUrl} 
                alt="Original image without CDN"
                className="max-w-full h-auto rounded-md"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cdn">
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2 text-gray-500">Image processed through CDN:</p>
              <img 
                src={cdnUrl} 
                alt="Image through CDN"
                className="max-w-full h-auto rounded-md"
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2 text-gray-500">Original:</p>
                  <img 
                    src={directUrl} 
                    alt="Original" 
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
                <div>
                  <p className="mb-2 text-gray-500">Through CDN:</p>
                  <img 
                    src={cdnUrl} 
                    alt="Through CDN" 
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="responsive">
          <Card>
            <CardContent className="pt-6">
              <p className="mb-2 text-gray-500">Using ResponsiveImage component:</p>
              <div className="max-w-lg mx-auto">
                <ResponsiveImage 
                  src={{
                    mobile: '/images/hero/luxury-villa-mobile.webp',
                    desktop: '/images/hero/luxury-villa-desktop.webp'
                  }}
                  alt="Villa image using ResponsiveImage"
                  className="w-full h-auto rounded-md"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Check your browser's Network tab to see which URLs are actually being requested
        </p>
      </div>
    </div>
  );
};

export default CdnTestPage;
