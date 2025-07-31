
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Import providers
import ReactQueryProvider from './components/providers/ReactQueryProvider';
import { AuthProvider } from './contexts/AuthContext';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
         <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Outlet />
          <Toaster />
        </LocalizationProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;
