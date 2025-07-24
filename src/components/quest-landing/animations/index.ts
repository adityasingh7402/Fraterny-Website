
export { default as MotionProvider, useMotionConfig, withMotion, MotionWrapper } from './MotionProvider';

// Export basic fade animations only
export { 
  fadeIn,
  fadeAnimations
} from './fadeIn';

// Re-export basic animations from styles
export { 
  animations, 
  duration, 
  timing
} from '../styles/animations';

// Note: We've removed complex screen transition exports since we're using simple layoutId approach
// Commented out complex exports:
// export { useScreenTransition } from './useScreenTransition';
// export { screenTransitionAnimations } from './screenTransition';
// export { slideAnimations } from './slideIn';