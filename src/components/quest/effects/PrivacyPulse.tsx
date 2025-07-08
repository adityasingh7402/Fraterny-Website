import React from 'react';
import { motion } from 'framer-motion';

interface PrivacyPulseProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'green' | 'terracotta' | 'navy' | 'gold';
  showIcon?: boolean;
  className?: string;
}

/**
 * Pulsing privacy indicator
 * Visual cue for data security and privacy
 */
export function PrivacyPulse({
  size = 'small',
  color = 'green',
  showIcon = true,
  className = ''
}: PrivacyPulseProps) {
  // Size dimensions
  const getSizeClass = (): string => {
    switch (size) {
      case 'small': return 'w-2 h-2';
      case 'large': return 'w-4 h-4';
      case 'medium':
      default: return 'w-3 h-3';
    }
  };
  
  // Color class
  const getColorClass = (): string => {
    switch (color) {
      case 'terracotta': return 'bg-terracotta';
      case 'navy': return 'bg-navy';
      case 'gold': return 'bg-gold';
      case 'green':
      default: return 'bg-green-400';
    }
  };
  
  // Pulse animation
  const pulseVariants = {
    initial: { 
      scale: 0.8,
      opacity: 0.5
    },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <div className={`privacy-pulse flex items-center gap-1 ${className}`}>
      <motion.div
        variants={pulseVariants}
        initial="initial"
        animate="animate"
        className={`rounded-full ${getSizeClass()} ${getColorClass()}`}
      />
      
      {showIcon && (
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-gray-400"
        >
          🔒
        </motion.div>
      )}
    </div>
  );
}

export default PrivacyPulse;