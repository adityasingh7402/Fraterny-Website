import { Variants } from 'framer-motion';

// Profile-specific motion variants that work with your existing animation system

export const profileMotionVariants = {
  // Page-level animations
  pageContainer: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  } as Variants,

  // Header animations
  profileHeader: {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  } as Variants,

  // Navigation tabs
  tabNavigation: {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.08
      }
    }
  } as Variants,

  tabItem: {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  } as Variants,

  // Card animations - works with your existing variants
  profileCard: {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  } as Variants,

  // Staggered card container
  cardContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  } as Variants,

  // Modal animations
  modalOverlay: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  } as Variants,

  modalContent: {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 }
    }
  } as Variants,

  // Form animations
  formContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1
      }
    }
  } as Variants,

  formField: {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  } as Variants,

  // Chart animations
  chartContainer: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut'
      }
    }
  } as Variants,

  // Stats counter animation
  statsCounter: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15
      }
    }
  } as Variants,

  // List item animations
  listContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  } as Variants,

  listItem: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    hover: {
      x: 4,
      transition: { duration: 0.2 }
    }
  } as Variants,

  // Floating elements (for Aceternity UI effects)
  floatingElement: {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    },
    float: {
      y: [-2, 2, -2],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  } as Variants,

  // Loading states
  loadingPulse: {
    pulse: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  } as Variants,

  // Success/Error states
  statusIndicator: {
    hidden: { opacity: 0, scale: 0 },
    success: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15
      }
    },
    error: { 
      opacity: 1, 
      scale: 1,
      x: [0, -5, 5, -5, 5, 0],
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15
      }
    }
  } as Variants
};

// Mobile-optimized variants (reduced motion)
export const mobileMotionVariants = {
  // Page-level animations (reduced)
  pageContainer: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  } as Variants,

  // Modal animations (mobile optimized)
  modalOverlay: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.15 }
    }
  } as Variants,

  modalContent: {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 10
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 10,
      transition: { duration: 0.15 }
    }
  } as Variants,

  // Form animations (mobile)
  formContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.08
      }
    }
  } as Variants,

  // Card animations (mobile)
  profileCard: {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    hover: {
      y: -2,
      transition: { duration: 0.2 }
    }
  } as Variants,

  // Tab animations (mobile)
  tabItem: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  } as Variants,

  // All other variants with mobile optimization
  profileHeader: {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  } as Variants,

  tabNavigation: {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
        staggerChildren: 0.05
      }
    }
  } as Variants,

  cardContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  } as Variants,

  formField: {
    hidden: { opacity: 0, x: -5 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  } as Variants,

  chartContainer: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  } as Variants,

  statsCounter: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  } as Variants,

  listContainer: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  } as Variants,

  listItem: {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    hover: {
      x: 2,
      transition: { duration: 0.15 }
    }
  } as Variants,

  floatingElement: {
    hidden: { opacity: 0, y: 5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    float: {
      y: [-1, 1, -1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  } as Variants,

  loadingPulse: {
    pulse: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  } as Variants,

  statusIndicator: {
    hidden: { opacity: 0, scale: 0 },
    success: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    error: { 
      opacity: 1, 
      scale: 1,
      x: [0, -3, 3, -3, 3, 0],
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    }
  } as Variants
};

// Utility function to get appropriate variants based on device
export const getMotionVariants = (isMobile: boolean = false) => {
  return isMobile ? mobileMotionVariants : profileMotionVariants;
};

// Common easing functions for custom animations
export const customEasing = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  bounce: [0.68, -0.55, 0.265, 1.55],
  gentle: [0.25, 0.1, 0.25, 1],
  sharp: [0.4, 0, 0.2, 1]
} as const;