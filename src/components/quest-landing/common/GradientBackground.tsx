// /src/components/quest-landing/common/GradientBackground.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { colors, spacing, responsiveSpacing } from '../styles';
import { gradientFloat } from '../styles/animations';

interface GradientBackgroundProps {
  variant?: 'hero' | 'section' | 'full' | 'screen-transition';
  animated?: boolean;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  animationState?: string;
  layoutId?: string;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  variant = 'hero',
  animated = true,
  className = '',
  intensity = 'medium'
}) => {
  // Get gradient positioning based on variant
  const getGradientStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          // Exact Figma positioning: width: 554, height: 554, top: 476px, left: -76px
          width: spacing.gradient.ellipse.width,
          height: spacing.gradient.ellipse.height,
          top: spacing.gradient.ellipse.top,
          left: spacing.gradient.ellipse.left,
          background: colors.gradient.radial,
          zIndex: 0,
        };
      case 'section':
        return {
          width: '400px',
          height: '400px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: colors.gradient.radial,
          zIndex: 0,
        };
      case 'full':
        return {
          width: '100%',
          height: '100%',
          top: '0',
          left: '0',
          background: colors.gradient.radial,
          zIndex: 0,
        };
      default:
        return {
          width: spacing.gradient.ellipse.width,
          height: spacing.gradient.ellipse.height,
          top: spacing.gradient.ellipse.top,
          left: spacing.gradient.ellipse.left,
          background: colors.gradient.radial,
          zIndex: 0,
        };
    }
  };

  // Get intensity opacity
  const getIntensityOpacity = () => {
    switch (intensity) {
      case 'light':
        return 0.6;
      case 'medium':
        return 0.8;
      case 'strong':
        return 1;
      default:
        return 0.8;
    }
  };

  const gradientStyles = getGradientStyles();
  const opacity = getIntensityOpacity();

  const baseStyle = {
    position: 'absolute' as const,
    borderRadius: '50%',
    opacity,
    filter: 'blur(60px)', 
    ...gradientStyles,
  };

  // Responsive styles for mobile
  const responsiveStyle = `
    @media (max-width: 768px) {
      width: ${responsiveSpacing.gradient.ellipse.mobile.width} !important;
      height: ${responsiveSpacing.gradient.ellipse.mobile.height} !important;
      top: ${responsiveSpacing.gradient.ellipse.mobile.top} !important;
      left: ${responsiveSpacing.gradient.ellipse.mobile.left} !important;
    }
    
    @media (min-width: 769px) and (max-width: 1024px) {
      width: ${responsiveSpacing.gradient.ellipse.tablet.width} !important;
      height: ${responsiveSpacing.gradient.ellipse.tablet.height} !important;
      top: ${responsiveSpacing.gradient.ellipse.tablet.top} !important;
      left: ${responsiveSpacing.gradient.ellipse.tablet.left} !important;
    }
  `;

  const GradientContent = () => (
    <>
      <div
        className={`gradient-background ${className}`}
        style={baseStyle}
      />
      <style>{responsiveStyle}</style>
    </>
  );

  if (animated) {
    return (
      <motion.div
        
        animate="animate"
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: gradientStyles.zIndex }}
      >
        <GradientContent />
      </motion.div>
    );
  }

  return (
    <div 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: gradientStyles.zIndex }}
    >
      <GradientContent />
    </div>
  );
};

export default GradientBackground;