// /src/components/quest-landing/animations/screenTransition.ts

import { Variants } from 'framer-motion';
import { duration } from '../styles/animations';

// Gradient morphing animation - transforms between different screen states
export const gradientMorph: Variants = {
  // Hero section: Small positioned gradient at bottom
  heroPositioned: {
    width: '554px',
    height: '554px',
    top: '476px',
    left: '-76px',
    scale: 1,
    borderRadius: '50%',
    opacity: 0.8,
    transition: {
      duration: 1.2, // Match the slower speed
      ease: [0.42, 0, 0.58, 1], // ease-in-out
      type: 'tween',
    },
  },
  // Statistics section: Centered gradient with 80% screen coverage
  statisticsFullScreen: {
    width: '554px',
    height: '554px',
    top: '50%',
    left: '50%',
    scale: 1,
    borderRadius: "50%",
    transform: 'translate(-50%, -50%)',
    opacity: 1,
    transition: {
      duration: 0.8, // 1200ms - slower animation
      ease: [0.42, 0, 0.58, 1], // ease-in-out
      type: 'tween',
    },
  },
  // Intermediate morphing state for smooth transition
  morphing: {
    width: '80vw',
    height: '80vh',
    top: '10vh',
    left: '10vw',
    scale: 1.1,
    borderRadius: '25%',
    opacity: 0.9,
    transition: {
      duration: 0.3,
      ease: [0.42, 0, 0.58, 1],
      type: 'tween',
    },
  },
};

// Screen container animation for snap behavior
export const screenContainer: Variants = {
  screen1: {
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
      type: 'tween',
    },
  },
  screen2: {
    y: '-100vh',
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
      type: 'tween',
    },
  },
};

// Hero text fade out animation - faster than gradient
export const heroTextFadeOut: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4, // Faster fade out - 400ms
      ease: 'easeIn',
    },
  },
  hidden: {
    opacity: 0,
    y: -20, // Slight upward movement
    transition: {
      duration: 0.4, // Faster fade out - 400ms
      ease: 'easeIn',
    },
  },
};

// Logo movement animation
export const logoMove: Variants = {
  heroPosition: {
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.42, 0, 0.58, 1],
      type: 'tween',
    },
  },
  topCenter: {
    scale: 0.7, // Scale down gradually
    x: 0, // Adjust positioning as needed
    y: -100, // Move up to top
    transition: {
      duration: 1.2,
      ease: [0.42, 0, 0.58, 1],
      type: 'tween',
    },
  },
};

// Statistics text fade in animation (screen 2 content)
export const statisticsText: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.8, // Start after gradient animation settles
      ease: 'easeOut',
    },
  },
};

export const heroTextItem: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1], // easeOut
      type: 'tween',
    },
  },
};

// Button entrance animation (appears last)
export const analyzeButton: Variants = {
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
      delay: 0.8, // Appears after most text is visible
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1], // backOut for bouncy effect
      type: 'tween',
    },
  },
};

// Background transition for overall screen change
export const backgroundTransition: Variants = {
  statistics: {
    backgroundColor: 'transparent', // Let gradient show through
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  hero: {
    backgroundColor: '#FFFFFF', // White background for screen 2
    transition: {
      duration: 0.4,
      delay: 0.2, // Slight delay after gradient starts moving
      ease: 'easeInOut',
    },
  },
};

// Combined animation sequence controller
export const screenTransitionSequence: Variants = {
  initial: {
    // Initial state - screen 1 visible
  },
  transitioning: {
    // Mid-transition state
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
  complete: {
    // Final state - screen 2 visible
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

// Export all screen transition animations as a collection
export const screenTransitionAnimations = {
  gradientMorph,
  screenContainer,
  heroTextFadeOut,
  statisticsText,
  heroTextItem,
  analyzeButton,
  backgroundTransition,
  screenTransitionSequence,
  logoMove
};