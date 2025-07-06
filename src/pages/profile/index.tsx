import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UserProfile from './UserProfile';
import Navigation from '@/components/Navigation';

/**
 * Profile route entry point - handles initial routing and deep linking
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Check for direct URL navigation without tab parameter
    if (!location.search.includes('tab=')) {
      // Default to overview tab
      navigate('?tab=overview', { replace: true });
    }
  }, [location, navigate]);
  
  return (
    <div className="min-h-screen bg-white">
      <UserProfile />
    </div>  
  );
};

export default ProfilePage;