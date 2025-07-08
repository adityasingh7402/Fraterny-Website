import React from 'react';
import { motion } from 'framer-motion';

interface GradientCardProps {
  children: React.ReactNode;
  difficulty?: 'easy' | 'medium' | 'hard' | 'neutral';
  interactive?: boolean;
  className?: string;
}

/**
 * Gradient card component
 * Styled card with gradient based on difficulty level
 */
export function GradientCard({
  children,
  difficulty = 'neutral',
  interactive = true,
  className = ''
}: GradientCardProps) {
  // Get gradient styles based on difficulty
  const getGradientStyles = (): { border: string; background: string } => {
    switch (difficulty) {
      case 'easy':
        return {
          border: 'border-l-4 border-l-terracotta',
          background: 'bg-gradient-to-r from-terracotta/5 to-transparent'
        };
      case 'medium':
        return {
          border: 'border-l-4 border-l-navy',
          background: 'bg-gradient-to-r from-navy/5 to-transparent'
        };
      case 'hard':
        return {
          border: 'border-l-4 border-l-gold',
          background: 'bg-gradient-to-r from-gold/5 to-transparent'
        };
      case 'neutral':
      default:
        return {
          border: 'border',
          background: 'bg-white'
        };
    }
  };
  
  const { border, background } = getGradientStyles();
  
  // Interactive hover animation
  const hoverAnimation = interactive ? {
    scale: 1.01,
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.07)',
    transition: { duration: 0.3 }
  } : undefined;
  
  return (
    <motion.div
      className={`
        gradient-card 
        ${border} 
        ${background} 
        rounded-lg shadow-sm p-4 
        ${className}
      `}
      whileHover={hoverAnimation}
    >
      {children}
    </motion.div>
  );
}

export default GradientCard;