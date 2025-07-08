import React from 'react';
import { motion } from 'framer-motion';

interface CompletionCelebrationProps {
  className?: string;
}

/**
 * Animation component for the completion screen
 * Shows a success check mark with animated effects
 */
export function CompletionCelebration({
  className = ''
}: CompletionCelebrationProps) {
  // Variants for check mark animation
  const circleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6 }
    }
  };
  
  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 0.8,
        delay: 0.6,
        ease: "easeInOut" 
      }
    }
  };
  
  return (
    <div className={`completion-celebration flex justify-center ${className}`}>
      <motion.div
        className="relative"
        initial="hidden"
        animate="visible"
      >
        {/* Circle background */}
        <motion.div
          variants={circleVariants}
          className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center"
        >
          {/* Check mark SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600"
          >
            <motion.path
              variants={checkVariants}
              d="M20 6L9 17l-5-5"
            />
          </svg>
        </motion.div>
        
        {/* Decorative rings */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1.2 }}
          transition={{ 
            duration: 1,
            delay: 0.8,
            ease: "easeOut"
          }}
          className="absolute inset-0 rounded-full border-4 border-green-200"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1.4 }}
          transition={{ 
            duration: 1.2,
            delay: 1,
            ease: "easeOut"
          }}
          className="absolute inset-0 rounded-full border-4 border-green-200"
        />
      </motion.div>
    </div>
  );
}

export default CompletionCelebration;