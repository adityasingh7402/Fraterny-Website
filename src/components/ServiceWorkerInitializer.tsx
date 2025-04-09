
import { useEffect } from 'react';
import { registerServiceWorker, invalidateCache } from '@/utils/serviceWorker';

const ServiceWorkerInitializer = () => {
  useEffect(() => {
    const initServiceWorker = async () => {
      try {
        await registerServiceWorker();
        console.log('Service worker registration completed from component');
        
        // Clear image cache to ensure fresh assets
        await invalidateCache('image');
      } catch (error) {
        console.error('Failed to initialize service worker:', error);
      }
    };

    initServiceWorker();
  }, []);

  // This is a utility component that doesn't render anything
  return null;
};

export default ServiceWorkerInitializer;
