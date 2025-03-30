
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
    <div className="md:hidden py-4 space-y-4 backdrop-blur-md bg-black bg-opacity-20 rounded-lg mt-2 px-4">
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
          {isAdmin && adminLinks.map(link => (
            <MobileNavigationLink
              key={link.name}
              href={link.href}
              isScrolled={isScrolled}
              onClick={toggleMenu}
            >
              {link.name}
            </MobileNavigationLink>
          ))}
          <button
            onClick={() => {
              onSignOut();
              toggleMenu();
            }}
            className="block w-full text-left text-sm font-medium text-red-400 hover:text-red-300 transition-colors duration-200"
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
      
      <MobileNavigationLink
        href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
        isScrolled={isScrolled}
        onClick={toggleMenu}
        external={true}
      >
        Apply Now
      </MobileNavigationLink>
    </div>
  );
};

export default MobileMenu;
