// /src/components/quest-landing/animations/useAnimations.ts

import React, { useCallback, useMemo } from 'react';
import { useInView } from 'framer-motion';
import { useMotionConfig } from './MotionProvider';
import { animations, duration } from '../styles/animations';

interface UseAnimationsOptions {
  threshold?: number;
  triggerOnce?: boolean;
  margin?: string;
  delay?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
}

interface AnimationControls {
  isInView: boolean;
  animationProps: {
    initial: string | boolean;
    animate: string | boolean;
    transition: any;
    variants?: any;
  };
  customVariants: typeof animations;
}

// Custom hook for consistent animation behaviors
export const useAnimations = (
  animationType: keyof typeof animations = 'fadeIn',
  options: UseAnimationsOptions = {}
): AnimationControls => {
  const { config } = useMotionConfig();
  const {
    threshold = 0.1,
    triggerOnce = true,
    margin = '0px 0px -100px 0px',
    delay = 0,
    staggerChildren = false,
    staggerDelay = config.staggerDelay,
  } = options;

  // Create a ref for the InView hook
  const ref = React.useRef(null);
  const isInView = useInView(ref, {
    amount: threshold,
    once: triggerOnce,
    margin: margin as any,
  });

  // Get base animation variants
  const baseVariants = useMemo(() => {
    return animations[animationType] || animations.fadeIn;
  }, [animationType]);

  // Create custom variants with configuration
  const customVariants = useMemo(() => {
    if (!config.enableAnimations) {
      return {
        hidden: {},
        visible: {},
      };
    }

    const variants = { ...baseVariants } as any;
    
    // Apply global duration and easing if specified
    if (variants.visible && typeof variants.visible === 'object' && !variants.visible.scale) {
      variants.visible = {
        ...variants.visible,
        transition: {
          duration: config.globalDuration,
          ease: "easeOut",
          delay: delay,
          ...(staggerChildren && {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          }),
          ...(variants.visible.transition || {}),
        },
      };
    }

    return variants;
  }, [baseVariants, config, delay, staggerChildren, staggerDelay]);

  // Animation props to spread on motion components
  const animationProps = useMemo(() => ({
    ref,
    initial: config.enableAnimations ? 'hidden' : false,
    animate: config.enableAnimations ? (isInView ? 'visible' : 'hidden') : false,
    variants: customVariants,
    transition: {
      duration: config.globalDuration,
      ease: "easeOut", // Changed from config.globalEasing
    },
  }), [isInView, customVariants, config]);

  return {
    isInView,
    animationProps,
    customVariants: animations,
  };
};

// Hook for staggered list animations
export const useStaggeredAnimations = (
  itemCount: number,
  options: UseAnimationsOptions = {}
) => {
  const { config } = useMotionConfig();
  const { staggerDelay = config.staggerDelay, delay = 0 } = options;

  const containerVariants = useMemo(() => ({
    hidden: { opacity: config.enableAnimations ? 0 : 1 },
    visible: {
      opacity: 1,
      transition: {
        duration: config.enableAnimations ? config.globalDuration : 0,
        staggerChildren: config.enableAnimations ? staggerDelay : 0,
        delayChildren: config.enableAnimations ? delay : 0,
      },
    },
  }), [config, staggerDelay, delay]);

  const itemVariants = useMemo(() => ({
    hidden: { 
      opacity: config.enableAnimations ? 0 : 1,
      y: config.enableAnimations ? 20 : 0,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: config.enableAnimations ? config.globalDuration : 0,
        ease: "easeOut", // Changed from "easeInOut"
      },
    },
  }), [config]);

  return {
    containerVariants,
    itemVariants,
    isEnabled: config.enableAnimations,
  };
};

// Hook for scroll-triggered animations
export const useScrollAnimation = (
  animationType: keyof typeof animations = 'slideUp',
  options: UseAnimationsOptions = {}
) => {
  const ref = React.useRef(null);
  const { config } = useMotionConfig();
  const isInView = useInView(ref, {
    amount: options.threshold || 0.1,
    once: options.triggerOnce !== false,
    margin: (options.margin || '0px 0px -50px 0px') as any,
  });

  const controls = useCallback(() => {
    if (!config.enableAnimations) return {};
    
    const variants = animations[animationType];
    return {
      ref,
      initial: 'hidden',
      animate: isInView ? 'visible' : 'hidden',
      variants,
      transition: {
        duration: config.globalDuration,
        ease: "easeOut", // Changed from config.globalEasing
        delay: options.delay || 0,
      },
    };
  }, [isInView, animationType, config, options.delay]);

  return {
    ref,
    isInView,
    controls: controls(),
    isEnabled: config.enableAnimations,
  };
};

// Hook for button animations
export const useButtonAnimation = () => {
  const { config } = useMotionConfig();

  return {
    whileHover: config.enableAnimations ? animations.buttonHover : {},
    whileTap: config.enableAnimations ? animations.buttonTap : {},
    transition: {
      duration: duration.fast,
      ease: "easeOut", // Changed from easing.easeOut
    },
  };
};

// Hook for background animations  
export const useBackgroundAnimation = () => {
  const { config } = useMotionConfig();

  return {
    variants: config.enableAnimations ? animations.gradientFloat : {},
    animate: config.enableAnimations ? 'animate' : false,
  };
};