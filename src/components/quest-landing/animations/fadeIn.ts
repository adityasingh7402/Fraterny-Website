// /src/components/quest-landing/animations/fadeIn.ts

import { Variants } from 'framer-motion';
import { duration } from '../styles/animations';

// Local easing functions using Framer Motion strings
const easeOut = "easeOut";
const backOut = "backOut";

// Basic fade in animation
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      ease: easeOut,
    },
  },
};

// Fade in from different directions
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easeOut,
    },
  },
};

export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.slow,
      ease: easeOut,
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: easeOut,
    },
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: duration.slow,
      ease: easeOut,
    },
  },
};

// Fade with scale animation
export const fadeInScale: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: duration.slow,
      ease: backOut,
    },
  },
};

// Staggered fade in for lists
export const fadeInStagger: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.normal,
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const fadeInStaggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easeOut,
    },
  },
};

// Hero text specific fade animations
export const heroTextFade: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: duration.slow,
      ease: easeOut,
    },
  }),
};

// Fade with blur effect
export const fadeInBlur: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: duration.slow,
      ease: easeOut,
    },
  },
};

// Delayed fade in
export const fadeInDelayed: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: duration.normal,
      ease: easeOut,
    },
  },
};

// Fast fade in for quick interactions
export const fadeInFast: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.fast,
      ease: easeOut,
    },
  },
};

// Slow fade in for dramatic effect
export const fadeInSlow: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: duration.slowest,
      ease: easeOut,
    },
  },
};

// Container fade for wrapping multiple elements
export const containerFade: Variants = {
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

// Export all fade animations as a collection
export const fadeAnimations = {
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  fadeInScale,
  fadeInStagger,
  fadeInStaggerItem,
  heroTextFade,
  fadeInBlur,
  fadeInDelayed,
  fadeInFast,
  fadeInSlow,
  containerFade,
};