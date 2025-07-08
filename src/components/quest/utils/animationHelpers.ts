// Standard durations
export const DURATIONS = {
  fast: 0.2,
  default: 0.3,
  slow: 0.5,
  verySlow: 0.8
};

// Standard easing functions as strings to avoid type issues
export const EASINGS = {
  default: "easeOut",
  easeIn: "easeIn",
  easeOut: "easeOut",
  easeInOut: "easeInOut"
};

/**
 * Create a staggered animation config
 */
export const createStaggerConfig = (
  staggerDelay: number = 0.1,
  initialDelay: number = 0
) => {
  return {
    staggerChildren: staggerDelay,
    delayChildren: initialDelay
  };
};

/**
 * Fade up animation variants
 */
export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: DURATIONS.default }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: DURATIONS.fast }
  }
};

/**
 * Fade down animation variants
 */
export const fadeDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: DURATIONS.default }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { duration: DURATIONS.fast }
  }
};

/**
 * Scale animation variants
 */
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: DURATIONS.default }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    transition: { duration: DURATIONS.fast }
  }
};

/**
 * Card animation variants
 */
export const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: DURATIONS.slow }
  },
  exit: { 
    opacity: 0, 
    y: -30, 
    scale: 0.98, 
    transition: { duration: DURATIONS.fast }
  }
};

/**
 * Container for staggered children
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: createStaggerConfig()
  },
  exit: { opacity: 0 }
};

/**
 * Button animation variants
 */
export const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: DURATIONS.default }
  },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  exit: { opacity: 0 }
};