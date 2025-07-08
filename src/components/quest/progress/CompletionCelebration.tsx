import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CompletionCelebrationProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

/**
 * Celebration animation for quest completion
 * Visual feedback for successfully completing the assessment
 */
export function CompletionCelebration({
  size = 'medium',
  className = ''
}: CompletionCelebrationProps) {
  // Size dimensions
  const getSizeClass = (): string => {
    switch (size) {
      case 'small': return 'w-16 h-16';
      case 'large': return 'w-32 h-32';
      case 'medium':
      default: return 'w-24 h-24';
    }
  };
  
  const sizeClass = getSizeClass();
  
  // Confetti colors
  const colors = [
    '#E07A5F', // terracotta
    '#0A1A2F', // navy
    '#D4AF37', // gold
    '#4CAF50', // green
    '#3498db'  // blue
  ];
  
  // Checkmark animation
  const checkmarkVariants = {
    hidden: { 
      pathLength: 0,
      opacity: 0
    },
    visible: { 
      pathLength: 1,
      opacity: 1,
      transition: { 
        pathLength: { duration: 0.8, ease: "easeInOut" },
        opacity: { duration: 0.3 }
      }
    }
  };
  
  // Circle animation
  const circleVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <div className={`completion-celebration flex items-center justify-center ${className}`}>
      <div className={`relative ${sizeClass}`}>
        <motion.svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          initial="hidden"
          animate="visible"
        >
          {/* Background circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="48"
            fill="#E07A5F10"
            stroke="#E07A5F"
            strokeWidth="2"
            variants={circleVariants}
          />
          
          {/* Checkmark */}
          <motion.path
            d="M30,55 L45,70 L70,35"
            fill="none"
            stroke="#E07A5F"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={checkmarkVariants}
          />
        </motion.svg>
        
        {/* Confetti effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => {
            const color = colors[i % colors.length];
            const size = Math.random() * 8 + 5;
            const delay = Math.random() * 0.5;
            const duration = Math.random() * 1 + 1;
            const x = Math.random() * 200 - 100;
            const y = Math.random() * 200 - 100;
            const rotation = Math.random() * 360;
            
            return (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{ 
                  width: size, 
                  height: size, 
                  backgroundColor: color,
                  zIndex: -1
                }}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  rotate: 0,
                  opacity: 0
                }}
                animate={{ 
                  x, 
                  y, 
                  scale: 1,
                  rotate: rotation,
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration,
                  delay,
                  ease: "easeOut"
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CompletionCelebration;