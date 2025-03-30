
import React from 'react';
import NavigationLink from './NavigationLink';
import UserMenu from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';

interface DesktopNavigationProps {
  isScrolled: boolean;
  navLinks: { name: string; href: string }[];
}

const DesktopNavigation = ({ isScrolled, navLinks }: DesktopNavigationProps) => {
  const { user } = useAuth();
  
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navLinks.map(link => (
        <NavigationLink key={link.name} href={link.href} isScrolled={isScrolled}>
          {link.name}
        </NavigationLink>
      ))}
      
      {user ? (
        <UserMenu />
      ) : (
        <a
          href="/auth"
          className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
        >
          Sign In
        </a>
      )}
      
      <a
        href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
      >
        Apply Now
      </a>
    </div>
  );
};

export default DesktopNavigation;
