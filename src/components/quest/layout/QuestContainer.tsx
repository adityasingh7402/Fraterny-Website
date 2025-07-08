import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useSectionRevealAnimation } from '../animations/useSectionRevealAnimation';

interface QuestContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'card' | 'transparent';
  animate?: boolean;
  className?: string;
}

/**
 * Content container for quest components
 * Provides consistent styling and optional animations
 */
export function QuestContainer({
  children,
  variant = 'default',
  animate = true,
  className = ''
}: QuestContainerProps) {
  // Animation setup
  const { ref, controls, parentVariants } = useSectionRevealAnimation({
    variant: 'fade-in',
    once: true,
    duration: 0.5
  });
  
  // Container variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  // Get container styles based on variant
  const getContainerStyles = (): string => {
    switch (variant) {
      case 'card':
        return 'bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8';
      case 'transparent':
        return 'bg-transparent';
      case 'default':
      default:
        return 'bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-100 p-4 md:p-6';
    }
  };
  
  const containerStyles = getContainerStyles();
  
  return (
    <motion.div
      ref={animate ? ref : undefined}
      variants={animate ? containerVariants : undefined}
      initial={animate ? 'hidden' : undefined}
      animate={animate ? controls : undefined}
      className={`quest-container w-full max-w-3xl mx-auto ${containerStyles} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default QuestContainer;