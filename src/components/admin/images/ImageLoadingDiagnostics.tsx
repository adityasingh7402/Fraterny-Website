
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { logImagePerformanceReport, resetImagePerformanceCounters } from '@/utils/imagePerformanceMonitor';
import { useToast } from '@/hooks/use-toast';
import { Thermometer, RefreshCw, Clock, CheckCircle, XCircle, Database, Image } from 'lucide-react';

const ImageLoadingDiagnostics = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<{ name: string; status: 'pending' | 'success' | 'error'; time?: number }[]>([]);
  
  // Get image keys
  const testImageKeys = [
    'hero-background',
    'logo-main',
    'villa-thumbnail',
    'experience-villa-retreat',
    'experience-workshop'
  ];
  
  const runDiagnostics = () => {
    setIsRunning(true);
    resetImagePerformanceCounters();
    
    // Initialize results
    const initialResults = testImageKeys.map(key => ({
      name: key,
      status: 'pending' as const
    }));
    setResults(initialResults);
    
    // Run tests sequentially
    let completedTests = 0;
    
    const updateResult = (index: number, status: 'success' | 'error', time?: number) => {
      setResults(prev => {
        const newResults = [...prev];
        newResults[index] = { ...newResults[index], status, time };
        return newResults;
      });
      
      completedTests++;
      if (completedTests === testImageKeys.length) {
        setIsRunning(false);
        logImagePerformanceReport();
        toast({
          title: 'Diagnostics completed',
          description: 'Check console for detailed results'
        });
      }
    };
    
    // Test each image
    testImageKeys.forEach((key, index) => {
      testImageLoading(key, (success, time) => {
        updateResult(index, success ? 'success' : 'error', time);
      });
    });
  };
  
  const testImageLoading = (key: string, callback: (success: boolean, time?: number) => void) => {
    const startTime = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      console.log(`[Diagnostics] Successfully loaded image: ${key} in ${loadTime.toFixed(2)}ms`);
      callback(true, loadTime);
    };
    
    img.onerror = () => {
      console.error(`[Diagnostics] Failed to load image: ${key}`);
      callback(false);
    };
    
    // Construct URL based on key structure
    // This is intentionally duplicating the logic to bypass caching issues
    img.src = `/images/${key}.webp`;
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-navy" />
          Image Loading Diagnostics
        </h3>
        <Button 
          onClick={runDiagnostics} 
          disabled={isRunning}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Running...' : 'Run Diagnostics'}
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        {results.length === 0 ? (
          <p className="text-gray-500 text-sm py-2">Click "Run Diagnostics" to test image loading performance</p>
        ) : (
          results.map((result, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4 text-navy" />
                <span>{result.name}</span>
              </div>
              <div className="flex items-center gap-4">
                {result.time && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {result.time.toFixed(0)}ms
                  </span>
                )}
                <span>
                  {result.status === 'pending' && (
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-navy animate-spin" />
                  )}
                  {result.status === 'success' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {result.status === 'error' && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <Separator className="my-4" />
      
      <div className="text-sm text-gray-500 flex items-center gap-2">
        <Database className="h-4 w-4" />
        <span>Check console logs for detailed report</span>
      </div>
    </div>
  );
};

export default ImageLoadingDiagnostics;
