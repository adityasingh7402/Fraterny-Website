import React from 'react';
import { motion } from 'framer-motion';

interface QuestionFocusLensProps {
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'strong';
  active?: boolean;
  className?: string;
}

/**
 * Focus lens effect for questions
 * Creates a subtle focus effect around the current question
 */
export function QuestionFocusLens({
  children,
  intensity = 'medium',
  active = true,
  className = ''
}: QuestionFocusLensProps) {
  // Get shadow intensity
  const getShadowIntensity = (): string => {
    if (!active) return 'none';
    
    switch (intensity) {
      case 'light': return '0 10px 30px rgba(224, 122, 95, 0.07)';
      case 'strong': return '0 20px 50px rgba(224, 122, 95, 0.15)';
      case 'medium':
      default: return '0 15px 40px rgba(224, 122, 95, 0.1)';
    }
  };
  
  const shadowStyle = getShadowIntensity();
  
  // Get glow opacity
  const getGlowOpacity = (): number => {
    if (!active) return 0;
    
    switch (intensity) {
      case 'light': return 0.03;
      case 'strong': return 0.1;
      case 'medium':
      default: return 0.05;
    }
  };
  
  const glowOpacity = getGlowOpacity();
  
  return (
    <motion.div
      className={`question-focus-lens relative ${className}`}
      animate={{
        boxShadow: shadowStyle,
        transition: { duration: 0.5 }
      }}
      whileHover={active ? {
        scale: 1.01,
        boxShadow: getShadowIntensity().replace('rgba(224, 122, 95,', 'rgba(224, 122, 95,')
      } : undefined}
    >
      {children}
      
      {/* Subtle glow effect on focus */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-terracotta/5 to-navy/5 pointer-events-none"
        animate={{ opacity: glowOpacity }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default QuestionFocusLens;