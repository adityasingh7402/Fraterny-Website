
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Import providers
import ReactQueryProvider from './components/providers/ReactQueryProvider';
import { AuthProvider } from './contexts/AuthContext';

function App() {
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
