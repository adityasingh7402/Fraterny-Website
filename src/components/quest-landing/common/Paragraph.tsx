// /src/components/quest-landing/common/Paragraph.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { typography, colors } from '../styles';
import { heroText, fadeIn } from '../styles/animations';
import { getTypographyStyles } from '../styles/typography';

interface ParagraphProps {
  children: React.ReactNode;
  variant?: 'hero-subtitle' | 'hero-closing' | 'body-large' | 'body-medium' | 'body-small' | 'byline';
  color?: 'primary' | 'secondary' | 'accent' | 'dark';
  className?: string;
  animated?: boolean;
  animationIndex?: number;
  as?: 'p' | 'span' | 'div';
}

const Paragraph: React.FC<ParagraphProps> = ({
  children,
  variant = 'body-medium',
  color = 'primary',
  className = '',
  animated = false,
  animationIndex = 0,
  as = 'p'
}) => {
  // Get typography styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero-subtitle':
        return {
          ...getTypographyStyles(typography.hero.subtitle),
          className: 'text-[24px] md:text-[30px] lg:text-[36px]'
        };
      case 'hero-closing':
        return {
          ...getTypographyStyles(typography.hero.closing),
          className: 'text-[24px] md:text-[30px] lg:text-[36px]'
        };
      case 'byline':
        return {
          ...getTypographyStyles(typography.hero.byline),
          className: 'text-[14px] tracking-[0.5px]'
        };
      case 'body-large':
        return {
          ...getTypographyStyles(typography.body.large),
          className: 'text-lg'
        };
      case 'body-medium':
        return {
          ...getTypographyStyles(typography.body.medium),
          className: 'text-base'
        };
      case 'body-small':
        return {
          ...getTypographyStyles(typography.body.small),
          className: 'text-sm'
        };
      default:
        return {
          ...getTypographyStyles(typography.body.medium),
          className: 'text-base'
        };
    }
  };

  // Get color styles
  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return { color: colors.text.primary };
      case 'secondary':
        return { color: colors.text.secondary };
      case 'accent':
        return { color: colors.text.accent };
      case 'dark':
        return { color: colors.text.dark };
      default:
        return { color: colors.text.primary };
    }
  };

  const variantStyles = getVariantStyles();
  const colorStyles = getColorStyles();
  const Tag = as;

  const combinedStyles = {
    ...variantStyles,
    ...colorStyles,
    margin: 0,
    padding: 0,
  };

  const combinedClassName = `${variantStyles.className} ${className} font-gilroy leading-none`;

  const ParagraphContent = () => (
    <Tag
      className={combinedClassName}
      style={combinedStyles}
    >
      {children}
    </Tag>
  );

  if (animated) {
    return (
      <motion.div
        variants={heroText}
        initial="hidden"
        animate="visible"
        custom={animationIndex}
      >
        <ParagraphContent />
      </motion.div>
    );
  }

  return <ParagraphContent />;
};

export default Paragraph;