import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as AuthUser } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  isScrolled: boolean;
  toggleMenu: () => void;
  navLinks: { name: string; href: string }[];
  user: AuthUser | null;
  onSignOut: () => Promise<void>;
}

const MobileMenu = ({
  isOpen,
  isScrolled,
  toggleMenu,
  navLinks,
  user,
  onSignOut,
}: MobileMenuProps) => {
  const { isAdmin } = useAuth();
  const location = useLocation();
  
  // Admin links - following Navigation 1 structure
  const adminLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Blog Management', href: '/admin/blog' },
    { name: 'Image Management', href: '/admin/images' },
    { name: 'Newsletter', href: '/admin/newsletter' },
    { name: 'Admin Dashboard', href: '/admin/dashboard' }, // Added this line
  ];

  // Animation variants - keeping from Navigation 2
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      className={`lg:hidden fixed top-16 left-0 right-0 z-40 ${
        isScrolled ? 'bg-white text-navy' : 'bg-navy text-white'
      }`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
      style={{
        background: isScrolled 
          ? 'rgba(255, 255, 255, 0.95)'
          : 'rgba(10, 26, 47, 0.95)',
        boxShadow: isScrolled
          ? '0 4px 20px 0 rgba(0, 0, 0, 0.1)'
          : '0 4px 20px 0 rgba(0, 0, 0, 0.2)',
      }}
    >
      <div className="flex flex-col p-4 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Main navigation links */}
        {navLinks.map((link) => (
          <motion.div key={link.name} variants={itemVariants}>
            <Link
              to={link.href}
              className={`block py-4 px-4 rounded-2xl text-lg font-medium tracking-wide ${
                isScrolled
                  ? 'text-navy hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-transparent active:scale-98`}
              onClick={toggleMenu}
            >
              {link.name}
            </Link>
          </motion.div>
        ))}

        <motion.div
          className="border-t border-white/10 my-4"
          variants={itemVariants}
        />

        {/* Profile and Auth section */}
        {user ? (
          <>
            {/* Profile Link */}
            <motion.div variants={itemVariants}>
              <Link
                to="/profile"
                className={`flex items-center py-4 px-4 rounded-2xl text-lg font-medium tracking-wide ${
                  isScrolled
                    ? 'text-navy hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-transparent active:scale-98`}
                onClick={toggleMenu}
              >
                <User className="mr-3" size={20} />
                <span>Your Profile</span>
              </Link>
            </motion.div>
            
            {/* Admin Links - Conditionally rendered */}
            {isAdmin && (
              <div className="space-y-1">
                {adminLinks.map((link) => (
                  <motion.div key={link.name} variants={itemVariants}>
                    <Link
                      to={link.href}
                      className={`flex items-center py-4 px-4 rounded-2xl text-lg font-medium tracking-wide ${
                        isScrolled
                          ? 'text-navy hover:bg-gray-100'
                          : 'text-white hover:bg-white/10'
                      } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-transparent active:scale-98`}
                      onClick={toggleMenu}
                    >
                      <span>{link.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Sign Out Button */}
            <motion.button
              className={`flex items-center w-full text-left py-4 px-4 rounded-2xl text-lg font-medium tracking-wide ${
                isScrolled
                  ? ' hover:bg-gray-100'
                  : ' hover:bg-white/10'
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent active:scale-98`}
              onClick={() => {
                onSignOut();
                toggleMenu();
              }}
              variants={itemVariants}
            >
              <LogOut className="mr-3" size={20} />
              <span>Sign Out</span>
            </motion.button>
          </>
        ) : (
          <motion.div variants={itemVariants} className="pt-2">
            <Link to="/auth" state={{ from: location }} onClick={toggleMenu}>
              <Button
                className={`w-full py-4 text-lg font-medium tracking-wide rounded-2xl ${
                  isScrolled ? 'bg-navy text-white' : 'bg-white text-navy'
                } hover:opacity-90 transition-opacity focus:ring-2 focus:ring-terracotta focus:ring-offset-2`}
              >
                Sign In / Register
              </Button>
            </Link>
          </motion.div>
        )}
        
        {/* CTA Section - Apply Now */}
        <motion.div
          className="border-t border-white/10 my-4"
          variants={itemVariants}
        />
        
        {/* <motion.div variants={itemVariants}>
          <a
            href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
            className={`block w-full text-center py-4 px-4 rounded-2xl text-lg font-bold tracking-wide ${
              isScrolled 
                ? 'bg-terracotta text-white' 
                : 'bg-terracotta text-white'
            } hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2 focus:ring-offset-transparent active:scale-98`}
            onClick={toggleMenu}
            target="_blank"
            rel="noopener noreferrer"
          >
            Apply Now
          </a>
        </motion.div> */}
      </div>
    </motion.div>
  );
};

export default MobileMenu;