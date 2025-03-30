
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
  const { user, isLoading, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth', { replace: true });
    }
    
    // Handle verification redirects from email
    const handleVerificationRedirect = () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');
      
      if (accessToken && type === 'signup') {
        console.log('Detected verification redirect in ProtectedRoute');
        // Clear the hash to avoid repeated processing
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    
    handleVerificationRedirect();
  }, [user, isLoading, navigate, location]);

  // Show loading state if still checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user || !session) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export const AdminRoute = () => {
  const { user, isAdmin, isLoading, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!user || !session) {
        navigate('/auth', { replace: true });
      } else if (!isAdmin) {
        navigate('/', { replace: true });
      }
    }
    
    // Handle verification redirects similar to ProtectedRoute
    const handleVerificationRedirect = () => {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (accessToken) {
        console.log('Detected verification redirect in AdminRoute');
        // Clear the hash
        window.history.replaceState(null, '', window.location.pathname);
      }
    };
    
    handleVerificationRedirect();
  }, [user, isAdmin, isLoading, navigate, session, location]);

  // Show loading state if still checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
      </div>
    );
  }

  // If not authenticated, redirect to auth page
  if (!user || !session) {
    return <Navigate to="/auth" replace />;
  }

  // If not admin, redirect to home page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If admin, render the child routes
  return <Outlet />;
};
