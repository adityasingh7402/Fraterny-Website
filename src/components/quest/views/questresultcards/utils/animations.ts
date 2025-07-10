/**
 * animations.ts
 * Shared animation variants for quest result cards
 */
import { Variants } from 'framer-motion';

// Card animation variants
export const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9, 
    rotateY: -10
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotateY: 0,
    transition: {
      duration: 1,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.1
    }
  }
};

// Mind card specific animation variants
export const mindCardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8, 
    rotateY: -15
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotateY: 0,
    transition: {
      duration: 1.2,
      ease: [0.23, 1, 0.32, 1],
      staggerChildren: 0.2
    }
  }
};

// Item animation variants
export const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
  }
};

// Progress bar animation variants
export const progressVariants: Variants = {
  hidden: { width: 0 },
  visible: (score: string) => ({
    width: `${parseInt(score.split('/')[0])}%`,
    transition: { 
      duration: 1.5, 
      ease: [0.23, 1, 0.32, 1],
      delay: 0.5
    }
  })
};

// Mind card item variants
export const mindItemVariants: Variants = {
  hidden: { opacity: 0, x: -30, scale: 0.9 },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
  }
};

// Section animation variants
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.23, 1, 0.32, 1] 
    }
  }
};

// Header animation variants
export const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.23, 1, 0.32, 1] 
    }
  }
};

// Button animation variants
export const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6, 
      ease: [0.23, 1, 0.32, 1] 
    }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3 }
  }
};

// Common hover animation
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.3 }
};