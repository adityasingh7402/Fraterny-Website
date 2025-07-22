// /src/components/quest-landing/common/Heading.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { typography, colors, responsiveClasses } from '../styles';
import { heroText, fadeIn } from '../styles/animations';
import { getTypographyStyles } from '../styles/typography';

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: 'hero-greeting' | 'hero-title' | 'hero-subtitle' | 'hero-highlight' | 'hero-closing' | 'section' | 'card';
  color?: 'primary' | 'secondary' | 'accent' | 'dark';
  className?: string;
  animated?: boolean;
  animationIndex?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
}

const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  variant = 'section',
  color = 'primary',
  className = '',
  animated = false,
  animationIndex = 0,
  as
}) => {
  // Determine the HTML tag to use
  const getTag = () => {
    if (as) return as;
    return `h${level}` as keyof JSX.IntrinsicElements;
  };

  // Get typography styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero-greeting':
        return {
          ...getTypographyStyles(typography.hero.greeting),
          className: responsiveClasses.typography.heroGreeting
        };
      case 'hero-title':
        return {
          ...getTypographyStyles(typography.hero.title),
          className: responsiveClasses.typography.heroTitle
        };
      case 'hero-subtitle':
        return {
          ...getTypographyStyles(typography.hero.subtitle),
          className: responsiveClasses.typography.heroSubtitle
        };
      case 'hero-highlight':
        return {
          ...getTypographyStyles(typography.hero.highlight),
          className: responsiveClasses.typography.heroHighlight
        };
      case 'hero-closing':
        return {
          ...getTypographyStyles(typography.hero.closing),
          className: responsiveClasses.typography.heroClosing
        };
      case 'section':
        return {
          ...getTypographyStyles(typography.heading.h1),
          className: 'text-2xl md:text-3xl lg:text-4xl'
        };
      case 'card':
        return {
          ...getTypographyStyles(typography.heading.h3),
          className: 'text-lg md:text-xl lg:text-2xl'
        };
      default:
        return {
          ...getTypographyStyles(typography.heading.h1),
          className: 'text-2xl md:text-3xl lg:text-4xl'
        };
    }
  };

  // Get color styles
  const getColorStyles = () => {
    switch (color) {
      case 'primary':
        return { color: colors.text.dark };
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
  const Tag = getTag();

  const combinedStyles = {
    ...variantStyles,
    ...colorStyles,
    margin: 0,
    padding: 0,
  };

  const combinedClassName = `${variantStyles.className} ${className} font-gilroy leading-none`;

  const HeadingContent = () => (
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
        <HeadingContent />
      </motion.div>
    );
  }

  return <HeadingContent />;
};

export default Heading;