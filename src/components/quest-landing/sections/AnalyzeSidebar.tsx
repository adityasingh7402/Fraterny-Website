// AnalyzeSidebar.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, LayoutDashboard, LogOut, User, X, Luggage} from 'lucide-react';
import { NotepadText  } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {useIsMobile} from '../../../components/quest/views/questbouncing/use-mobile';
import { signInWithGoogle } from '@/utils/auth';


interface AnalyzeSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'blue' | 'white';
  className?: string;
}

interface MenuItemConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}
const sidebarVariants = {
  closed: {
    x: '100%',
    opacity: 0
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 25,
      stiffness: 120,
      duration: 0.4
    }
  }
};

const menuContainerVariants = {
  closed: {},
  open: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const menuItemVariants = {
  closed: {
    x: 50,
    opacity: 0
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 100
    }
  }
};

const getMenuItems = (isAuthenticated: boolean, user: any): MenuItemConfig[] => {
  if (isAuthenticated && user) {
    return [
        {
        id: 'home',
        label: 'Home',
        icon: <Home className="w-5 h-5" />,
        action: () => {}, // Will be replaced in component
        variant: 'primary'
      },
      {
        id: 'test',
        label: 'Start the test',
        icon: <NotepadText   className="w-5 h-5" />,
        action: () => {}, // Will be replaced in component
        variant: 'primary'
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        action: () => {}, // Will be replaced in component
        variant: 'primary'
      },
      {
        id: 'book',
        label: 'Book our Villa',
        icon: <Luggage className="w-5 h-5" />,
        action: () => {}, // Will be replaced in component
        variant: 'primary'
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOut className="w-5 h-5" />,
        action: () => {}, // Will be replaced in component
        variant: 'danger'
      }
    ];
  } else {
    return [
      {
        id: 'test',
        label: 'Start the test',
        icon: <NotepadText   className="w-5 h-5" />,
        action: () => {}, // Will be replaced in component
        variant: 'primary'
      },
      {
        id: 'book',
        label: 'Book our Villa',
        icon: <Luggage className="w-5 h-5" />,
        action: () => {}, // Will be replaced in component
        variant: 'primary'
      },
      {
        id: 'signin',
        label: 'Sign in', // Changed label
        icon: <User className="w-5 h-5" />, // Google icon instead of User icon
        action: () => {}, // Changed action
        variant: 'primary'
      }
      
    ];
  }
};

export const AnalyzeSidebar: React.FC<AnalyzeSidebarProps> = ({
  isOpen,
  onClose,
  theme = 'blue',
  className = ''
}) => {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Only render on mobile
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  const isAuthenticated = !!user && !isLoading;
  
  const handleDashboard = () => {
    navigate('/quest-dashboard');
    onClose();
  };
  
  const handleLogout = async () => {
    // Implement logout logic
    try {
      await signOut(); // Your logout function
      navigate('/quest');
    } catch (error) {
      console.error('Logout failed:', error);
    }
    onClose();
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(); // Your existing function
      onClose();
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  const handleHome = () => {
    navigate('https://fraterny.com/');
    onClose();
  };

  const baseMenuItems = getMenuItems(isAuthenticated, user);
    const menuItems = baseMenuItems.map(item => ({
    ...item,
    action: item.id === 'home' ? () => navigate('/quest') :
            item.id === 'test' ? () => navigate('/assessment') :
            item.id === 'book' ? handleHome :
            item.id === 'dashboard' ? handleDashboard :
            item.id === 'logout' ? handleLogout :
            item.id === 'signin' ? handleGoogleSignIn :
            () => {}
    }));
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sidebar Panel */}
          <motion.div
            className={`fixed right-0 top-0 h-full w-60 z-[70] ${
              theme === 'blue' ? 'bg-[#004A7F]' : 'bg-white'
            } shadow-2xl ${className}`}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/20">
              <h3 className={`font-['Gilroy-medium'] font-medium ${
                theme === 'blue' ? 'text-white' : 'text-gray-900'
              }`}>
                Explore Fraterny
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  theme === 'blue' 
                    ? 'hover:bg-white/10 text-white' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Menu Items */}
            <motion.div
              className="py-4"
              variants={menuContainerVariants}
              initial="closed"
              animate="open"
            >
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  variants={menuItemVariants}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-6 py-4 transition-colors ${
                    theme === 'blue'
                      ? 'text-white hover:bg-white/10'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${
                    item.variant === 'danger' 
                      ? 'border-t border-white/10 mt-4' 
                      : ''
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.icon}
                  <span className="font-['Gilroy-Bold']">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>
            
            {/* User Info (if logged in) */}
            {isAuthenticated && user && (
              <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
                theme === 'blue' ? 'border-white/20' : 'border-gray-200'
              }`}>
                <div className={`text-sm font-['Gilroy-semiBold'] ${
                  theme === 'blue' ? 'text-white/80' : 'text-gray-600'
                }`}>
                  Logged in as
                </div>
                <div className={`font-['Gilroy-Bold'] ${
                  theme === 'blue' ? 'text-white' : 'text-gray-900'
                }`}>
                  {user.user_metadata?.first_name 
                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`.trim()
                    : user.email
                  }
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};