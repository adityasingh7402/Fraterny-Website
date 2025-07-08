import { useEffect } from 'react';
import { useAnimation, AnimationControls } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { transitions } from './transitions';
import { variantPresets } from './variants';

export type AnimationVariant = 
  | 'fade'
  | 'fadeUp'
  | 'fadeDown'
  | 'scale'
  | 'questionCard'
  | 'responseOption'
  | 'staggerContainer'
  | 'button'
  | 'progressBar'
  | 'privacyPulse'
  | 'tag'
  | 'celebration';

export interface QuestAnimationOptions {
  variant?: AnimationVariant;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  initialInView?: boolean;
  delay?: number;
}

export interface QuestAnimationResult {
  ref: (node?: Element | null) => void;
  controls: AnimationControls;
  inView: boolean;
  variants: any;
}

/**
 * Core animation hook for quest components
 * Provides animation controls and variants based on the specified preset
 */
export function useQuestAnimation(options: QuestAnimationOptions = {}): QuestAnimationResult {
  const {
    variant = 'fade',
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
    initialInView = false,
    delay = 0
  } = options;
  
  // Animation controls
  const controls = useAnimation();
  
  // Intersection observer
  const [ref, inView] = useInView({
    threshold,
    rootMargin,
    triggerOnce,
    initialInView
  });
  
  // Trigger animation when element comes into view
  useEffect(() => {
    if (inView) {
      controls.start('visible', {
        delay: delay
      });
    } else {
      // Only reset if not triggerOnce
      if (!triggerOnce) {
        controls.start('hidden');
      }
    }
  }, [controls, inView, delay, triggerOnce]);
  
  // Get the variants for the specified preset
  const variants = variantPresets[variant];
  
  return {
    ref,
    controls,
    inView,
    variants
  };
}

export default useQuestAnimation;