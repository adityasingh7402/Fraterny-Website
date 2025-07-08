import React from 'react';
import { motion } from 'framer-motion';

interface QuestLogoProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'full' | 'icon';
  className?: string;
}

/**
 * Quest-specific logo component
 * Displays the assessment platform logo
 */
export function QuestLogo({
  size = 'medium',
  variant = 'full',
  className = ''
}: QuestLogoProps) {
  // Size classes
  const getSizeClass = (): string => {
    switch (size) {
      case 'small':
        return variant === 'icon' ? 'h-6 w-6' : 'h-6';
      case 'large':
        return variant === 'icon' ? 'h-12 w-12' : 'h-10';
      case 'medium':
      default:
        return variant === 'icon' ? 'h-8 w-8' : 'h-8';
    }
  };
  
  // Icon-only version
  if (variant === 'icon') {
    return (
      <div className={`${getSizeClass()} ${className}`}>
        <motion.svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          whileHover={{ rotate: 5, scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <circle cx="20" cy="20" r="18" fill="#0A1A2F" />
          <path d="M15 16C15 14.3431 16.3431 13 18 13H22C23.6569 13 25 14.3431 25 16V24C25 25.6569 23.6569 27 22 27H18C16.3431 27 15 25.6569 15 24V16Z" fill="#E07A5F" />
          <path d="M13 20L25 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="18" cy="16" r="1.5" fill="white" />
          <circle cx="22" cy="24" r="1.5" fill="white" />
        </motion.svg>
      </div>
    );
  }
  
  // Full logo version
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.svg 
        className={getSizeClass()}
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <circle cx="20" cy="20" r="18" fill="#0A1A2F" />
        <path d="M15 16C15 14.3431 16.3431 13 18 13H22C23.6569 13 25 14.3431 25 16V24C25 25.6569 23.6569 27 22 27H18C16.3431 27 15 25.6569 15 24V16Z" fill="#E07A5F" />
        <path d="M13 20L25 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="18" cy="16" r="1.5" fill="white" />
        <circle cx="22" cy="24" r="1.5" fill="white" />
      </motion.svg>
      
      <motion.span 
        className="font-playfair font-medium text-navy"
        style={{ fontSize: size === 'small' ? '1rem' : size === 'large' ? '1.5rem' : '1.25rem' }}
      >
        Fraterny
      </motion.span>
    </div>
  );
}

export default QuestLogo;