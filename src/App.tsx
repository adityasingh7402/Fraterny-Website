
import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react'; // Add this import
import { trackPageView } from '@/services/analytics/tracking'; // Add this import
import { useLocation } from 'react-router-dom'; // Add this import
import { trackPageVisit } from '@/services/userJourneyManager';
import { googleAnalytics } from './services/analytics/googleAnalytics';

// Import providers
import ReactQueryProvider from './components/providers/ReactQueryProvider';
import { AuthProvider } from './contexts/AuthContext';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

function App() {
  const location = useLocation();

  useEffect(() => {
  // Track page visit for user journey
  trackPageVisit(location.pathname, document.title);
  
  // Track normalized page view for GA4
  googleAnalytics.trackPageView();
}, [location.pathname]);

// Track initial page load
useEffect(() => {
  googleAnalytics.trackPageView();
}, []); // Empty dependency array = runs once on mount

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
