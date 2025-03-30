
import { User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  isScrolled: boolean;
}

const UserMenu = ({ isScrolled }: UserMenuProps) => {
  const { user, signOut, isAdmin } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const adminLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Blog Management', href: '/admin/blog' },
    { name: 'Image Management', href: '/admin/images' },
    { name: 'Newsletter', href: '/admin/newsletter' },
  ];

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Get user display information
  const getUserInitial = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name.charAt(0);
    } else if (user?.phone) {
      return user.phone.slice(-2, -1);
    }
    return null;
  };

  const getUserDisplayName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name;
    } else if (user?.phone) {
      return user.phone;
    }
    return "User";
  };

  return (
    <div className="relative">
      <button 
        onClick={toggleUserMenu}
        className="flex items-center space-x-2 focus:outline-none"
        aria-expanded={isUserMenuOpen}
        aria-haspopup="true"
      >
        <div className={`w-10 h-10 rounded-full bg-terracotta flex items-center justify-center ${isScrolled ? 'text-white' : 'text-navy'}`}>
          {getUserInitial() ? (
            <span className="text-white font-medium">
              {getUserInitial()}
            </span>
          ) : (
            <User size={18} />
          )}
        </div>
      </button>
      
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {getUserDisplayName()}
            </p>
            <p className="text-xs text-gray-500">
              {isAdmin ? 'Administrator' : 'User'}
            </p>
          </div>
          
          {isAdmin && adminLinks.map(link => (
            <a 
              key={link.name} 
              href={link.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsUserMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
