import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Import providers
import ReactQueryProvider from './components/providers/ReactQueryProvider';
import { AuthProvider } from './contexts/AuthContext';

// Import the initializeImageStorage function
import { initializeImageStorage } from './services/images';
import { useEffect } from 'react';

function App() {
  // Initialize the image storage when the app loads
  useEffect(() => {
    initializeImageStorage().catch(console.error);
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
