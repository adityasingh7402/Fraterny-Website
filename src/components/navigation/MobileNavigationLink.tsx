
import React from 'react';

interface MobileNavigationLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
  external?: boolean;
}

const MobileNavigationLink = ({ 
  href, 
  children, 
  isScrolled, 
  onClick,
  external = false
}: MobileNavigationLinkProps) => {
  return (
    <a
      href={href}
      className={`block w-full text-left text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

export default MobileNavigationLink;
