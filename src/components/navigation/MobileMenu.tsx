import React from 'react';
import { User } from '@supabase/supabase-js';
import MobileNavigationLink from './MobileNavigationLink';
import { useAuth } from '@/contexts/AuthContext';

interface MobileMenuProps {
  isOpen: boolean;
  isScrolled: boolean;
  toggleMenu: () => void;
  navLinks: { name: string; href: string }[];
  user: User | null;
  onSignOut: () => Promise<void>;
}

const MobileMenu = ({ isOpen, isScrolled, toggleMenu, navLinks, user, onSignOut }: MobileMenuProps) => {
  const { isAdmin } = useAuth();
  
  const adminLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Blog Management', href: '/admin/blog' },
    { name: 'Image Management', href: '/admin/images' },
    { name: 'Newsletter', href: '/admin/newsletter' },
  ];

  if (!isOpen) return null;

  return (
    <div className="lg:hidden py-4 space-y-2 backdrop-blur-md bg-black bg-opacity-20 rounded-lg mt-2 px-4">
      {navLinks.map(link => (
        <MobileNavigationLink
          key={link.name}
          href={link.href}
          isScrolled={isScrolled}
          onClick={toggleMenu}
        >
          {link.name}
        </MobileNavigationLink>
      ))}
      
      {user ? (
        <>
          {isAdmin && (
            <div className="pt-2 border-t border-white/10">
              {adminLinks.map(link => (
                <MobileNavigationLink
                  key={link.name}
                  href={link.href}
                  isScrolled={isScrolled}
                  onClick={toggleMenu}
                >
                  {link.name}
                </MobileNavigationLink>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              onSignOut();
              toggleMenu();
            }}
            className="block w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg"
          >
            Sign Out
          </button>
        </>
      ) : (
        <MobileNavigationLink
          href="/auth"
          isScrolled={isScrolled}
          onClick={toggleMenu}
        >
          Sign In
        </MobileNavigationLink>
      )}
      
      <div className="pt-2 border-t border-white/10">
        <MobileNavigationLink
          href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
          isScrolled={isScrolled}
          onClick={toggleMenu}
          external={true}
        >
          Apply Now
        </MobileNavigationLink>
      </div>
    </div>
  );
};

export default MobileMenu;
