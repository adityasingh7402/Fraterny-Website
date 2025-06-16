import React from 'react';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
  className?: string;
}

const NavigationLink = ({ 
  href, 
  children, 
  isScrolled, 
  onClick,
  className = ''
}: NavigationLinkProps) => {
  return (
    <a
      href={href}
      className={`
        ${isScrolled ? 'text-navy' : 'text-white'} 
        hover:text-terracotta 
        transition-colors duration-200
        px-3 py-2
        inline-flex
        items-center
        min-h-[44px]
        min-w-[44px]
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default NavigationLink;
