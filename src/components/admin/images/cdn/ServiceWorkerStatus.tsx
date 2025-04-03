
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { isServiceWorkerSupported, isServiceWorkerActive, clearServiceWorkerCache } from "@/utils/serviceWorkerRegistration";

interface ServiceWorkerStatusProps {
  onCacheClear?: () => void;
}

export const ServiceWorkerStatus = ({ onCacheClear }: ServiceWorkerStatusProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [lastCleared, setLastCleared] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported(isServiceWorkerSupported());
    setIsActive(isServiceWorkerActive());

    // Check status every 2 seconds in case service worker activates later
    const interval = setInterval(() => {
      setIsActive(isServiceWorkerActive());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleClearCache = async () => {
    setIsClearing(true);
    try {
      const success = await clearServiceWorkerCache();
      if (success) {
        setLastCleared(new Date().toLocaleTimeString());
        if (onCacheClear) {
          onCacheClear();
        }
      }
    } catch (error) {
      console.error("Error clearing service worker cache:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Service Worker Status</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <div className="flex items-center mb-2">
            <span className="mr-2 font-medium">Support:</span>
            {isSupported ? (
              <span className="text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                Available
              </span>
            ) : (
              <span className="text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
                Not supported
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="mr-2 font-medium">Status:</span>
            {isActive ? (
              <span className="text-green-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                Active
              </span>
            ) : (
              <span className="text-orange-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                </svg>
                Inactive
              </span>
            )}
          </div>
          
          {lastCleared && (
            <div className="mt-2 text-sm text-gray-500">
              Last cache clear: {lastCleared}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <Button
            onClick={handleClearCache}
            disabled={!isActive || isClearing}
            variant="outline"
            className="w-full"
          >
            {isClearing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Clearing Cache...
              </>
            ) : (
              "Clear Service Worker Cache"
            )}
          </Button>
        </div>
      </div>
      
      {!isSupported && (
        <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded">
          <p className="font-medium">Service Workers not supported</p>
          <p className="mt-1">Advanced caching features are unavailable in this browser. Consider using Chrome, Firefox, or Edge for optimal performance.</p>
        </div>
      )}
      
      {isSupported && !isActive && (
        <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded">
          <p className="font-medium">Service Worker not yet active</p>
          <p className="mt-1">The service worker is installed but not yet activated. Try refreshing the page to activate enhanced caching.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceWorkerStatus;
