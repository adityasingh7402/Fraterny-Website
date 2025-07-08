import React from 'react';
import { motion } from 'framer-motion';

interface CalmingBackgroundProps {
  intensity?: 'light' | 'medium' | 'strong';
  animated?: boolean;
  className?: string;
}

/**
 * Subtle animated background effect for psychological comfort
 * Creates a calming visual environment with gentle gradients
 */
export function CalmingBackground({
  intensity = 'light',
  animated = true,
  className = ''
}: CalmingBackgroundProps) {
  // Opacity based on intensity
  const getOpacity = (): string => {
    switch (intensity) {
      case 'light': return '0.03';
      case 'medium': return '0.05';
      case 'strong': return '0.08';
      default: return '0.03';
    }
  };
  
  const opacity = getOpacity();
  
  // Animation duration based on intensity
  const getDuration = (): number => {
    switch (intensity) {
      case 'light': return 30;
      case 'medium': return 25;
      case 'strong': return 20;
      default: return 30;
    }
  };
  
  const duration = getDuration();
  
  // Background patterns
  const backgroundPatterns = [
    `radial-gradient(circle at 25% 25%, rgba(224, 122, 95, ${opacity}) 0%, transparent 50%)`,
    `radial-gradient(circle at 75% 75%, rgba(10, 26, 47, ${opacity}) 0%, transparent 50%)`,
    `radial-gradient(circle at 25% 75%, rgba(224, 122, 95, ${opacity}) 0%, transparent 50%)`,
    `radial-gradient(circle at 75% 25%, rgba(10, 26, 47, ${opacity}) 0%, transparent 50%)`
  ];
  
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
      {animated ? (
        <motion.div
          className="absolute inset-0"
          animate={{
            background: backgroundPatterns
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ) : (
        <div 
          className="absolute inset-0"
          style={{ 
            background: backgroundPatterns[0] 
          }}
        />
      )}
    </div>
  );
}

export default CalmingBackground;


