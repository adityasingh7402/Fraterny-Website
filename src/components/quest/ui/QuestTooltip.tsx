import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  showOnHover?: boolean;
  showOnClick?: boolean;
  className?: string;
}

/**
 * Quest-specific tooltip component
 * Provides additional information on hover or click
 */
export function QuestTooltip({
  children,
  content,
  position = 'top',
  showOnHover = true,
  showOnClick = false,
  className = ''
}: QuestTooltipProps) {
  // State for tooltip visibility
  const [isVisible, setIsVisible] = useState(false);
  
  // Position-specific classes
  const getPositionClasses = (): string => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 transform -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 transform -translate-x-1/2';
    }
  };
  
  // Position-specific animation variants
  const getAnimationVariants = () => {
    switch (position) {
      case 'bottom':
        return {
          hidden: { opacity: 0, y: -5 },
          visible: { opacity: 1, y: 0 }
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: 5 },
          visible: { opacity: 1, x: 0 }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: -5 },
          visible: { opacity: 1, x: 0 }
        };
      case 'top':
      default:
        return {
          hidden: { opacity: 0, y: 5 },
          visible: { opacity: 1, y: 0 }
        };
    }
  };
  
  // Event handlers
  const handleMouseEnter = () => {
    if (showOnHover) setIsVisible(true);
  };
  
  const handleMouseLeave = () => {
    if (showOnHover) setIsVisible(false);
  };
  
  const handleClick = () => {
    if (showOnClick) setIsVisible(!isVisible);
  };
  
  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Trigger element */}
      {children}
      
      {/* Tooltip content */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              absolute z-10 bg-gray-900 text-white text-sm rounded p-2 max-w-xs shadow-lg
              ${getPositionClasses()}
            `}
            variants={getAnimationVariants()}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
          >
            {content}
            
            {/* Arrow */}
            <div 
              className={`
                absolute w-2 h-2 bg-gray-900 transform rotate-45
                ${position === 'top' ? 'bottom-0 left-1/2 -mb-1 -ml-1' : ''}
                ${position === 'bottom' ? 'top-0 left-1/2 -mt-1 -ml-1' : ''}
                ${position === 'left' ? 'right-0 top-1/2 -mr-1 -mt-1' : ''}
                ${position === 'right' ? 'left-0 top-1/2 -ml-1 -mt-1' : ''}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default QuestTooltip;