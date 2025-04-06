
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Import providers
import ReactQueryProvider from './components/providers/ReactQueryProvider';
import { AuthProvider } from './contexts/AuthContext';

// Inline critical CSS to avoid render blocking
import './App.css';

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
