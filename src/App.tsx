
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Import providers
import ReactQueryProvider from './components/providers/ReactQueryProvider';

function App() {
  return (
    <ReactQueryProvider>
      <Outlet />
      <Toaster />
    </ReactQueryProvider>
  );
}

export default App;
