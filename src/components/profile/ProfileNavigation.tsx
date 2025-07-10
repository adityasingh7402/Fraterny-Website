import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProfileNavigationProps {
  activeTab: string;
}

/**
 * Navigation tabs for the profile page
 */
const ProfileNavigation = ({ activeTab }: ProfileNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'history', label: 'Quest History' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'security', label: 'Manage Your Account' },
  ];
  
  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(location.search);
    params.set('tab', tabId);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };
  
  return (
    <div className="border-b border-gray-200 overflow-x-auto sm:px-20">
      <nav className="container mx-auto px-6" aria-label="Profile navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "py-4 px-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "border-navy text-navy"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            )}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileNavigation;