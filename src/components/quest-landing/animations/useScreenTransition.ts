// /src/components/quest-landing/animations/useScreenTransition.ts

import { useState, useCallback, useEffect, useRef } from 'react';
import { useMotionConfig } from './MotionProvider';
import { 
  gradientMorph, 
  screenContainer, 
  statisticsText, 
  heroTextFadeOut, 
  analyzeButton,
  backgroundTransition,
  logoMove
} from './screenTransition';

// Screen states
export type ScreenState = 'screen1' | 'transitioning' | 'screen2';

// Transition direction
export type TransitionDirection = 'forward' | 'backward';

// Hook options
interface UseScreenTransitionOptions {
  onTransitionStart?: (direction: TransitionDirection) => void;
  onTransitionComplete?: (screen: ScreenState) => void;
}

// Hook return type
interface UseScreenTransitionReturn {
  // Current state
  currentScreen: ScreenState;
  isTransitioning: boolean;
  
  // Animation variants for different elements
  gradientVariants: typeof gradientMorph;
  containerVariants: typeof screenContainer;
  statisticsVariants: typeof statisticsText;
  heroTextVariants: typeof heroTextFadeOut;
  buttonVariants: typeof analyzeButton;
  backgroundVariants: typeof backgroundTransition;

  // logo animation
  logoVariants: typeof logoMove;
  
  // Control functions
  transitionToScreen: (screen: Exclude<ScreenState, 'transitioning'>) => void;
  transitionForward: () => void;
  transitionBackward: () => void;
  
  // Animation state getters
  getGradientState: () => string;
  getContainerState: () => string;
  getStatisticsState: () => string;
  getHeroTextState: () => string;
  getButtonState: () => string;
  getBackgroundState: () => string;
  getLogoState: () => string;
}

export const useScreenTransition = (
  options: UseScreenTransitionOptions = {}
): UseScreenTransitionReturn => {
  const { config } = useMotionConfig();
  const {
    onTransitionStart,
    onTransitionComplete
  } = options;

  // State management
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('screen1');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Transition timeout ref
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Transition function
  const transitionToScreen = useCallback((targetScreen: Exclude<ScreenState, 'transitioning'>) => {
    if (isTransitioning || currentScreen === targetScreen) return;
    
    const direction: TransitionDirection = targetScreen === 'screen2' ? 'forward' : 'backward';
    
    // Start transition
    setIsTransitioning(true);
    setCurrentScreen('transitioning');
    onTransitionStart?.(direction);

    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    // Complete transition after animation duration (1200ms + buffer)
    transitionTimeoutRef.current = setTimeout(() => {
      setCurrentScreen(targetScreen);
      setIsTransitioning(false);
      onTransitionComplete?.(targetScreen);
    }, 1400); // Longer timeout to match slower 1200ms animation
    
  }, [currentScreen, isTransitioning, onTransitionStart, onTransitionComplete]);

  // Navigation functions
  const transitionForward = useCallback(() => {
    if (currentScreen === 'screen1') {
      transitionToScreen('screen2');
    }
  }, [currentScreen, transitionToScreen]);

  const transitionBackward = useCallback(() => {
    if (currentScreen === 'screen2') {
      transitionToScreen('screen1');
    }
  }, [currentScreen, transitionToScreen]);

  // Animation state getters
  const getGradientState = useCallback((): string => {
    if (!config.enableAnimations) return 'statisticsFullScreen';
    
    switch (currentScreen) {
      case 'screen1':
        return 'heroPositioned';
      case 'transitioning':
        return 'statisticsFullScreen'; // Animate to full screen for statistics
      case 'screen2':
        return 'statisticsFullScreen';
      default:
        return 'heroPositioned';
    }
  }, [currentScreen, config.enableAnimations]);

  // logo
  const getLogoState = useCallback((): string => {
  if (!config.enableAnimations) return 'topCenter';
  
  switch (currentScreen) {
    case 'screen1':
      return 'heroPosition';
    case 'transitioning':
      return 'topCenter'; // Move to top during transition
    case 'screen2':
      return 'topCenter';
    default:
      return 'heroPosition';
  }
}, [currentScreen, config.enableAnimations]);

  const getContainerState = useCallback((): string => {
    if (!config.enableAnimations) return 'screen2';
    
    switch (currentScreen) {
      case 'screen1':
        return 'screen1';
      case 'transitioning':
        return 'screen2'; // Animate to screen2 position
      case 'screen2':
        return 'screen2';
      default:
        return 'screen1';
    }
  }, [currentScreen, config.enableAnimations]);

  const getStatisticsState = useCallback((): string => {
    if (!config.enableAnimations) return currentScreen === 'screen2' ? 'visible' : 'hidden';
    
    return currentScreen === 'screen1' ? 'visible' : 'hidden';
  }, [currentScreen, config.enableAnimations]);

  const getHeroTextState = useCallback((): string => {
    if (!config.enableAnimations) return currentScreen === 'screen2' ? 'visible' : 'hidden';
    
    // Show hero text after transition completes or during screen2
    return (currentScreen === 'screen2' || currentScreen === 'transitioning') ? 'visible' : 'hidden';
  }, [currentScreen, config.enableAnimations]);

  const getButtonState = useCallback((): string => {
    if (!config.enableAnimations) return currentScreen === 'screen2' ? 'visible' : 'hidden';
    
    return currentScreen === 'screen2' ? 'visible' : 'hidden';
  }, [currentScreen, config.enableAnimations]);

  const getBackgroundState = useCallback((): string => {
    if (!config.enableAnimations) return currentScreen === 'screen1' ? 'statistics' : 'hero';
    
    return currentScreen === 'screen1' ? 'statistics' : 'hero';
  }, [currentScreen, config.enableAnimations]);

  // Scroll detection for auto-transition
  

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    currentScreen,
    isTransitioning,

    // logo
    logoVariants: logoMove,
    getLogoState,
    
    // Animation variants
    gradientVariants: gradientMorph,
    containerVariants: screenContainer,
    statisticsVariants: statisticsText,
    heroTextVariants: heroTextFadeOut,
    buttonVariants: analyzeButton,
    backgroundVariants: backgroundTransition,
    
    // Control functions
    transitionToScreen,
    transitionForward,
    transitionBackward,
    
    // Animation state getters
    getGradientState,
    getContainerState,
    getStatisticsState,
    getHeroTextState,
    getButtonState,
    getBackgroundState,
  };
};