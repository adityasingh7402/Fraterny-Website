import { Variants } from 'framer-motion';
import { transitions } from './transitions';

// Animation variants for different psychological comfort levels and interactions

// Fade variants
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.default
  },
  exit: { 
    opacity: 0,
    transition: transitions.fast
  }
};

// Fade with Y movement (upward/downward)
export const fadeUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.gentleSpring
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: transitions.fast
  }
};

export const fadeDownVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.gentleSpring
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: transitions.fast
  }
};

// Scale variants
export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.spring
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: transitions.fast
  }
};

// Question card variants - psychologically comforting
export const questionCardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40, 
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      ...transitions.gentleSpring,
      opacity: { duration: 0.4 }
    }
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    scale: 0.98,
    transition: transitions.fast
  }
};

// Response option variants with staggered timing
export const responseOptionVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -10
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: transitions.gentleSpring
  },
  hover: {
    scale: 1.02,
    backgroundColor: 'rgba(224, 122, 95, 0.05)',
    transition: transitions.fast
  },
  tap: {
    scale: 0.98,
    transition: transitions.fast
  },
  selected: {
    backgroundColor: 'rgba(224, 122, 95, 0.1)',
    borderColor: 'rgba(224, 122, 95, 0.5)',
    transition: transitions.default
  },
  exit: { 
    opacity: 0, 
    x: 10,
    transition: transitions.fast
  }
};

// Parent container for staggered children
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      ...transitions.default,
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      ...transitions.fast,
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

// Button variants
export const buttonVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 10
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.gentleSpring
  },
  hover: {
    scale: 1.05,
    transition: transitions.fast
  },
  tap: {
    scale: 0.95,
    transition: transitions.fast
  },
  exit: { 
    opacity: 0,
    transition: transitions.fast
  }
};

// Progress bar variants
export const progressBarVariants: Variants = {
  hidden: { 
    opacity: 0,
    scaleX: 0,
    originX: 0
  },
  visible: { 
    opacity: 1,
    scaleX: 1,
    transition: transitions.default
  },
  exit: { 
    opacity: 0,
    transition: transitions.fast
  }
};

// Privacy indicator pulse
export const privacyPulseVariants: Variants = {
  hidden: { 
    opacity: 0.5,
    scale: 0.8
  },
  visible: { 
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.1, 1],
    transition: {
      repeat: Infinity,
      duration: 2,
      ease: 'easeInOut'
    }
  }
};

// Tags for self-awareness
export const tagVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.gentleSpring
  },
  hover: {
    scale: 1.05,
    transition: transitions.fast
  },
  tap: {
    scale: 0.95,
    transition: transitions.fast
  },
  selected: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: transitions.fast
  }
};

// Celebration animation
export const celebrationVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: [1, 1.1, 1],
    y: 0,
    transition: {
      duration: 0.8,
      times: [0, 0.6, 1],
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: transitions.fast
  }
};

// Export a map for easy access
export const variantPresets = {
  fade: fadeVariants,
  fadeUp: fadeUpVariants,
  fadeDown: fadeDownVariants,
  scale: scaleVariants,
  questionCard: questionCardVariants,
  responseOption: responseOptionVariants,
  staggerContainer: staggerContainerVariants,
  button: buttonVariants,
  progressBar: progressBarVariants,
  privacyPulse: privacyPulseVariants,
  tag: tagVariants,
  celebration: celebrationVariants
};

export default variantPresets;