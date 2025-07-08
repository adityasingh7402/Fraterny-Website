import { useEffect } from 'react';
import { useAnimation, AnimationControls } from 'framer-motion';
import { transitions } from './transitions';

export interface ProgressAnimationOptions {
  animated?: boolean;
  celebrateAtMilestones?: boolean;
  milestones?: number[];
  duration?: number;
}

export interface ProgressAnimationResult {
  progressControls: AnimationControls;
  celebrationControls: AnimationControls;
  isAtMilestone: boolean;
  currentMilestone: number | null;
}

/**
 * Hook for animating progress bars and celebrating milestones
 */
export function useProgressAnimation(
  currentValue: number,
  totalValue: number,
  options: ProgressAnimationOptions = {}
): ProgressAnimationResult {
  const {
    animated = true,
    celebrateAtMilestones = true,
    milestones = [25, 50, 75, 100],
    duration = 0.8
  } = options;
  
  // Calculate progress percentage
  const progressPercentage = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
  
  // Animation controls
  const progressControls = useAnimation();
  const celebrationControls = useAnimation();
  
  // Check if we're at a milestone
  const isAtMilestone = milestones.some(milestone => 
    Math.round(progressPercentage) === milestone
  );
  
  // Get the current milestone (if any)
  const currentMilestone = isAtMilestone 
    ? milestones.find(milestone => Math.round(progressPercentage) === milestone) || null
    : null;
  
  // Animate progress bar
  useEffect(() => {
    if (animated) {
      progressControls.start({
        width: `${progressPercentage}%`,
        transition: {
          duration,
          ease: [0.25, 0.46, 0.45, 0.94],
          type: 'spring',
          stiffness: 100,
          damping: 20
        }
      });
    } else {
      // Instant update without animation
      progressControls.set({
        width: `${progressPercentage}%`
      });
    }
    
    // Celebration animation at milestones
    if (celebrateAtMilestones && isAtMilestone) {
      celebrationControls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, ease: 'easeInOut' }
      });
    }
  }, [
    progressControls, 
    celebrationControls, 
    progressPercentage, 
    animated, 
    celebrateAtMilestones, 
    isAtMilestone, 
    duration
  ]);
  
  return {
    progressControls,
    celebrationControls,
    isAtMilestone,
    currentMilestone
  };
}

export default useProgressAnimation;