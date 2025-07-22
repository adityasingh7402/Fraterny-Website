// /src/components/quest-landing/common/Logo.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { typography, colors } from '../styles';
import { fadeIn } from '../styles/animations';

interface LogoProps {
  variant?: 'hero' | 'header' | 'footer';
  showByline?: boolean;
  className?: string;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'hero', 
  showByline = true,
  className = '',
  animated = true
}) => {
  // Different sizes based on variant
  const getLogoStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          title: 'text-[72px] leading-none tracking-[-0.05em] font-bold',
          byline: 'text-[14px] leading-none tracking-[0.5px] font-normal mt-1'
        };
      case 'header':
        return {
          title: 'text-[32px] leading-none tracking-[-0.02em] font-bold',
          byline: 'text-[10px] leading-none tracking-[0.3px] font-normal mt-0.5'
        };
      case 'footer':
        return {
          title: 'text-[24px] leading-none tracking-[-0.02em] font-bold',
          byline: 'text-[8px] leading-none tracking-[0.3px] font-normal mt-0.5'
        };
      default:
        return {
          title: 'text-[72px] leading-none tracking-[-0.05em] font-bold',
          byline: 'text-[14px] leading-none tracking-[0.5px] font-normal mt-1'
        };
    }
  };

  const styles = getLogoStyles();
  
  const LogoContent = () => (
    <div className={`flex flex-col ${className}`}>
      <h1 
        className={`${styles.title} text-white font-gilroy`}
        style={{
          fontFamily: typography.fontFamily.bold,
          color: colors.text.primary
        }}
      >
        QUEST
      </h1>
      {showByline && (
        <p 
          className={`${styles.byline} text-white/80 font-gilroy`}
          style={{
            fontFamily: typography.fontFamily.primary,
            color: colors.text.secondary,
            opacity: 0.8
          }}
        >
          BY FRATERNTY
        </p>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <LogoContent />
      </motion.div>
    );
  }

  return <LogoContent />;
};

export default Logo;