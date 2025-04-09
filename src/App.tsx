
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Import providers
import ReactQueryProvider from './components/providers/ReactQueryProvider';
import { AuthProvider } from './contexts/AuthContext';

// Import the initializeImageStorage function
import { initializeImageStorage } from './services/images';
import { useEffect } from 'react';
import { supabase } from './integrations/supabase/client';

function App() {
  // Initialize the image storage when the app loads, but only after auth is checked
  useEffect(() => {
    // First check for an existing session to ensure auth is initialized
    const checkAuthAndInitialize = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        // Only initialize storage after we've checked auth status
        // This way we have the proper auth context even if user is not logged in
        console.log("Auth checked, initializing image storage");
        initializeImageStorage().catch(console.error);
      } catch (error) {
        console.error("Error checking auth before storage initialization:", error);
      }
    };
    
    checkAuthAndInitialize();
  }, []);

  return (
    <ReactQueryProvider>
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;
