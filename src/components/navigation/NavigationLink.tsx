
import React from 'react';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
}

const NavigationLink = ({ href, children, isScrolled, onClick }: NavigationLinkProps) => {
  return (
    <a
      href={href}
      className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default NavigationLink;
