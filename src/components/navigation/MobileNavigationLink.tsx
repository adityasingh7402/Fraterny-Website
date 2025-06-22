import React from 'react';
import { motion } from 'framer-motion';

interface MobileNavigationLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick?: () => void;
  external?: boolean;
  isCTA?: boolean;
  custom?: any; // for framer-motion stagger
  variants?: any; // for framer-motion stagger
}

const MobileNavigationLink = ({ 
  href, 
  children, 
  isScrolled, 
  onClick,
  external = false,
  isCTA = false,
  custom,
  variants
}: MobileNavigationLinkProps) => {
  // CTA button special styling
  if (isCTA) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={
          `block w-full text-center mt-2
          bg-terracotta text-white text-lg font-semibold tracking-wide
          rounded-xl py-4 min-h-[44px] px-4 shadow-lg shadow-terracotta/25
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-terracotta
          hover:bg-terracotta/90
          active:scale-98
          `
        }
        style={{
          boxShadow: '0 0 16px 2px rgba(201, 90, 58, 0.25), 0 4px 32px 0 rgba(0,0,0,0.10)'
        }}
        whileTap={{ scale: 0.98 }}
        whileHover={{ filter: 'brightness(1.05)' }}
        {...(variants ? { variants, custom } : {})}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.a
      href={href}
      className={`
        block w-full text-left
        text-lg font-medium tracking-wide
        py-4 min-h-[44px] px-4
        ${isScrolled ? 'text-white' : 'text-white'}
        rounded-2xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-terracotta
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ 
        backgroundColor: 'rgba(255,255,255,0.1)',     // ✅ Slightly more visible hover
        color: '#E07A5F'                              // ✅ Terracotta on hover
      }}
      whileTap={{ scale: 0.98 }}
      {...(variants ? { variants, custom } : {})}
    >
      {children}
    </motion.a>
  );
};

export default MobileNavigationLink;
