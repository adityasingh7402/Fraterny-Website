// src/pages/profile/UserProfile.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileContext } from '@/components/ProfileRoute';

// Import profile components
import ProfileStatsCard from '../../components/profile/cards/ProfileStatsCard';
// import { EngagementCard } from '@/components/profile/cards/EngagementCard';
// import { AchievementsCard } from '@/components/profile/cards/AchievementsCard';
// import  SubscriptionCard  from '../../components/profile/cards/SubscriptionCard';
import  ProfileEditForm  from '@/components/profile/forms/ProfileEditForm';
// import { PreferencesForm } from '@/components/profile/forms/PreferencesForm';
// import { PasswordChangeForm } from '@/components/profile/forms/PasswordChangeForm';
import AccountSettings from '@/components/profile/sections/AccountSettings';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import QuestHistory from '@/components/profile/sections/QuestHistory';

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab } = useProfileContext();
  
  // Handle tab change and update URL
  const handleTabChange = (tab: string) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('tab', tab);
    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };
  
  // This is a helper function to render the appropriate content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="">
            <ProfileStatsCard />
            {/* <EngagementCard />
            <AchievementsCard /> */}
            {/* <SubscriptionCard /> */}
          </div>
        );
      case 'history':
        return <QuestHistory />;
      // case 'preferences':
      //   return <PreferencesForm />;
      case 'security':
        return <AccountSettings />;
      default:
        return <div>Select a tab to view content</div>;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container p-6">
        <Navigation />
        {renderTabContent()}
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;