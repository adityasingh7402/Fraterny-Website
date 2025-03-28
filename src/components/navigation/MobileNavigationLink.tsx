
import React from 'react';

interface MobileNavigationLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
}

const MobileNavigationLink = ({ href, children, isScrolled, onClick }: MobileNavigationLinkProps) => {
  return (
    <a
      href={href}
      className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default MobileNavigationLink;
