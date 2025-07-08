import { useAnimation, AnimationControls } from 'framer-motion';
import { transitions } from './transitions';

export interface ChoiceAnimationOptions {
  selectedColor?: string;
  hoverColor?: string;
  tapScale?: number;
  hoverScale?: number;
  selectedScale?: number;
  duration?: number;
}

export interface ChoiceAnimationResult {
  controls: AnimationControls;
  handleHover: () => void;
  handleHoverEnd: () => void;
  handleTap: () => void;
  handleSelect: () => void;
  handleDeselect: () => void;
}

/**
 * Hook for animating choice selections with haptic-like feedback
 */
export function useChoiceAnimation(
  isSelected: boolean = false,
  options: ChoiceAnimationOptions = {}
): ChoiceAnimationResult {
  const {
    selectedColor = 'rgba(224, 122, 95, 0.1)',
    hoverColor = 'rgba(224, 122, 95, 0.05)',
    tapScale = 0.98,
    hoverScale = 1.02,
    selectedScale = 1,
    duration = 0.2
  } = options;
  
  // Animation controls
  const controls = useAnimation();
  
  // Initial state based on selection status
  if (isSelected) {
    controls.set({
      backgroundColor: selectedColor,
      scale: selectedScale,
      borderColor: 'rgba(224, 122, 95, 0.5)'
    });
  }
  
  // Handle hover
  const handleHover = () => {
    controls.start({
      scale: hoverScale,
      backgroundColor: isSelected ? selectedColor : hoverColor,
      borderColor: 'rgba(224, 122, 95, 0.3)',
      transition: {
        duration,
        ease: 'easeOut'
      }
    });
  };
  
  // Handle hover end
  const handleHoverEnd = () => {
    controls.start({
      scale: isSelected ? selectedScale : 1,
      backgroundColor: isSelected ? selectedColor : 'transparent',
      borderColor: isSelected ? 'rgba(224, 122, 95, 0.5)' : 'rgba(209, 213, 219, 1)',
      transition: {
        duration,
        ease: 'easeOut'
      }
    });
  };
  
  // Handle tap
  const handleTap = () => {
    controls.start({
      scale: tapScale,
      transition: {
        duration: duration / 2,
        ease: 'easeInOut'
      }
    }).then(() => {
      controls.start({
        scale: isSelected ? selectedScale : 1,
        transition: {
          duration: duration / 2,
          ease: 'easeOut'
        }
      });
    });
  };
  
  // Handle selection
  const handleSelect = () => {
    controls.start({
      backgroundColor: selectedColor,
      scale: [tapScale, selectedScale],
      borderColor: 'rgba(224, 122, 95, 0.5)',
      transition: {
        duration: duration * 1.5,
        ease: 'easeOut',
        scale: {
          times: [0, 1],
          duration: duration * 2
        }
      }
    });
  };
  
  // Handle deselection
  const handleDeselect = () => {
    controls.start({
      backgroundColor: 'transparent',
      scale: 1,
      borderColor: 'rgba(209, 213, 219, 1)',
      transition: {
        duration,
        ease: 'easeOut'
      }
    });
  };
  
  return {
    controls,
    handleHover,
    handleHoverEnd,
    handleTap,
    handleSelect,
    handleDeselect
  };
}

export default useChoiceAnimation;