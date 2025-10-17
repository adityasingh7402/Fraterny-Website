import React, { createContext, useContext, useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ProfileLayout from '@/components/profile/ProfileLayout';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileNavigation from '@/components/profile/ProfileNavigation';

// Define the ProfileContext type
type ProfileContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

// Create context
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Define valid tabs
const VALID_TABS = ['overview', 'history', 'application', 'security'];

export function ProfileRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // Get tab from URL query params
  const params = new URLSearchParams(location.search);
  const tabParam = params.get('tab') || 'overview';
  
  // Validate tab parameter
  const initialTab = VALID_TABS.includes(tabParam) ? tabParam : 'overview';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Update state when URL changes
  useEffect(() => {
    const newTab = params.get('tab') || 'overview';
    if (VALID_TABS.includes(newTab)) {
      setActiveTab(newTab);
    }
  }, [location.search]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
          <p className="text-gray-600 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to auth if not authenticated
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  return (
    <ProfileContext.Provider value={{ activeTab, setActiveTab }}>
      <ProfileLayout>
        <ProfileHeader />
        <ProfileNavigation activeTab={activeTab} />
        <Outlet />
      </ProfileLayout>
    </ProfileContext.Provider>
  );
}

// Create a hook to use the profile context
export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}

export default ProfileRoute;