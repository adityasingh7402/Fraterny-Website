// /src/components/quest-landing/animations/slideIn.ts

import { Variants } from 'framer-motion';
import { duration, springs } from '../styles/animations';

// Basic slide animations from different directions
export const slideInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: "easeOut",
    },
  },
};

export const slideInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: "easeOut",
    },
  },
};

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: "easeOut",
    },
  },
};

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: "easeOut",
    },
  },
};

// Spring-based slide animations for bouncy effects
export const slideInUpSpring: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: springs.bouncy,
  },
};

export const slideInLeftSpring: Variants = {
  hidden: {
    opacity: 0,
    x: -100,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: springs.bouncy,
  },
};

// Slide with scale for dynamic entrances
export const slideInUpScale: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: duration.slow,
      ease: "backOut",
    },
  },
};

export const slideInRightScale: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: duration.slow,
      ease: "backOut",
    },
  },
};

// Staggered slide animations for lists
export const slideInStagger: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const slideInStaggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    x: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: "easeOut",
    },
  },
};

// Hero section specific slide animations
export const heroSlideIn: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: duration.slow,
      ease: "easeOut",
    },
  }),
};

// Button slide animations
export const buttonSlideIn: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.8,
      duration: duration.slow,
      ease: "backOut",
    },
  },
};

// Diagonal slide animations
export const slideInDiagonalUp: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
    y: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: "easeOut",
    },
  },
};

export const slideInDiagonalDown: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
    y: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: "easeOut",
    },
  },
};

// Slide with rotation
export const slideInRotate: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
    rotate: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: {
      duration: duration.slow,
      ease: "easeOut",
    },
  },
};

// Page transition slides
export const slidePageLeft: Variants = {
  initial: {
    opacity: 0,
    x: 100,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.normal,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    x: -100,
    transition: {
      duration: duration.normal,
      ease: "easeInOut",
    },
  },
};

export const slidePageUp: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      duration: duration.normal,
      ease: "easeInOut",
    },
  },
};

// Container slide for wrapping multiple elements
export const containerSlide: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

// Fast slide for micro-interactions
export const slideInFast: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.fast,
      ease: "easeOut",
    },
  },
};

// Export all slide animations as a collection
export const slideAnimations = {
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  slideInUpSpring,
  slideInLeftSpring,
  slideInUpScale,
  slideInRightScale,
  slideInStagger,
  slideInStaggerItem,
  heroSlideIn,
  buttonSlideIn,
  slideInDiagonalUp,
  slideInDiagonalDown,
  slideInRotate,
  slidePageLeft,
  slidePageUp,
  containerSlide,
  slideInFast,
};