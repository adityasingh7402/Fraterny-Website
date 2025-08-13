
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react'; // Add this import
import { trackPageView } from '@/services/analytics/tracking'; // Add this import
import { useLocation } from 'react-router-dom'; // Add this import
import { trackPageVisit } from '@/services/userJourneyManager';

// Import providers
import ReactQueryProvider from './components/providers/ReactQueryProvider';
import { AuthProvider } from './contexts/AuthContext';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Track page visit for user journey (replaces trackPageView)
    trackPageVisit(location.pathname, document.title);
  }, [location.pathname]);

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
