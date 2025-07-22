// /src/components/quest-landing/animations/index.ts

// Export main components
export { default as MotionProvider, useMotionConfig, withMotion, MotionWrapper } from './MotionProvider';

// Export custom hooks
export { 
  useAnimations, 
  useStaggeredAnimations, 
  useScrollAnimation, 
  useButtonAnimation, 
  useBackgroundAnimation 
} from './useAnimations';

// Export fade animations explicitly
export { 
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
  fadeAnimations
} from './fadeIn';

// Export slide animations explicitly  
export { 
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
  slideAnimations
} from './slideIn';

// Re-export animations from styles for convenience
export { 
  animations, 
  duration, 
  timing, 
  springs
} from '../styles/animations';

// Export screen transition animations explicitly
export { 
  gradientMorph,
  screenContainer,
  statisticsText,
  heroTextFadeOut,
  heroTextItem,
  analyzeButton,
  backgroundTransition,
  screenTransitionSequence,
  screenTransitionAnimations,
  logoMove
} from './screenTransition';

// Export screen transition hook
export { 
  useScreenTransition,
  type ScreenState,
  type TransitionDirection 
} from './useScreenTransition';
