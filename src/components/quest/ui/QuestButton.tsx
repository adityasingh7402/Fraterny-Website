import React from 'react';
import { motion } from 'framer-motion';

interface QuestButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'success';
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/**
 * Quest-specific button component
 * Styled consistently with the assessment design system
 */
export function QuestButton({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  className = ''
}: QuestButtonProps) {
  // Get variant-specific styles
  const getVariantStyles = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-terracotta text-white hover:bg-terracotta/90';
      case 'secondary':
        return 'bg-navy text-white hover:bg-navy/90';
      case 'outline':
        return 'bg-transparent text-navy border border-navy hover:bg-navy/5';
      case 'text':
        return 'bg-transparent text-navy hover:bg-gray-100';
      case 'success':
        return 'bg-green-500 text-white hover:bg-green-600';
      default:
        return 'bg-terracotta text-white hover:bg-terracotta/90';
    }
  };
  
  // Get size-specific styles
  const getSizeStyles = (): string => {
    switch (size) {
      case 'small':
        return 'text-xs py-1.5 px-3';
      case 'large':
        return 'text-lg py-3 px-6';
      case 'medium':
      default:
        return 'text-sm py-2 px-4';
    }
  };
  
  // Get width style
  const getWidthStyle = (): string => {
    return fullWidth ? 'w-full' : '';
  };
  
  // Get disabled style
  const getDisabledStyle = (): string => {
    return disabled 
      ? 'opacity-50 cursor-not-allowed pointer-events-none' 
      : 'transition-all';
  };
  
  // Get hover animation variants
  const getHoverAnimation = () => {
    if (disabled) return {};
    
    return {
      scale: 1.03,
      transition: { duration: 0.2 }
    };
  };
  
  // Get tap animation variants
  const getTapAnimation = () => {
    if (disabled) return {};
    
    return {
      scale: 0.97,
      transition: { duration: 0.1 }
    };
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={getHoverAnimation()}
      whileTap={getTapAnimation()}
      className={`
        rounded-lg font-medium flex items-center justify-center
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${getWidthStyle()}
        ${getDisabledStyle()}
        ${className}
      `}
    >
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </motion.button>
  );
}

export default QuestButton;