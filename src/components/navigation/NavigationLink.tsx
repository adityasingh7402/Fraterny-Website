import React, { forwardRef } from 'react';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
  className?: string;
  onMouseEnter?: (event: React.MouseEvent<HTMLAnchorElement>, index: number) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLAnchorElement>, index: number) => void;
  index?: number;
}

const NavigationLink = forwardRef<HTMLAnchorElement, NavigationLinkProps>(
  ({
    href,
    children,
    isScrolled,
    onClick,
    className = '',
    onMouseEnter,
    onMouseLeave,
    index = 0,
  }, ref) => {
    return (
      <a
        href={href}
        ref={ref}
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
        onMouseEnter={e => onMouseEnter && onMouseEnter(e, index)}
        onMouseLeave={e => onMouseLeave && onMouseLeave(e, index)}
        data-nav-index={index}
      >
        {children}
      </a>
    );
  }
);

export default NavigationLink;
