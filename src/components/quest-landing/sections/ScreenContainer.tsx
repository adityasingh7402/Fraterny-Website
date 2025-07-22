// /src/components/quest-landing/sections/ScreenContainer.tsx

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Hero, StatisticsSection } from './index';
import { GradientBackground } from '../common';
import { MotionWrapper } from '../animations';
import { useScreenTransition } from '../animations';

interface ScreenContainerProps {
  onAnalyzeClick?: () => void;
  className?: string;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  onAnalyzeClick,
  className = ''
}) => {
  // Initialize screen transition hook
  const {
    currentScreen,
    isTransitioning,
    gradientVariants,
    containerVariants,
    backgroundVariants,
    getGradientState,
    getContainerState,
    getStatisticsState,
    getHeroTextState,
    getBackgroundState,
    transitionForward,
    logoVariants,
  getLogoState,
  } = useScreenTransition({
    onTransitionStart: (direction) => {
      console.log(`Transition started: ${direction}`);
    },
    onTransitionComplete: (screen) => {
      console.log(`Transition complete: ${screen}`);
    }
  });

  // Handle screen 1 click to trigger animation
  const handleScreen1Click = useCallback(() => {
    if (currentScreen === 'screen1' && !isTransitioning) {
      transitionForward();
    }
  }, [currentScreen, isTransitioning, transitionForward]);

  // Handle analyze button click
  const handleAnalyzeClick = useCallback(() => {
    if (onAnalyzeClick) {
      onAnalyzeClick();
    }
    // Also trigger transition if on screen 1
    if (currentScreen === 'screen1' && !isTransitioning) {
      transitionForward();
    }
  }, [onAnalyzeClick, currentScreen, isTransitioning, transitionForward]);

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden ${className}`}
      style={{
        height: '100vh', // Fixed viewport height
      }}
    >
      {/* Background that transitions between states */}
      <motion.div
        variants={backgroundVariants}
        initial="statistics"
        animate={getBackgroundState()}
        className="fixed inset-0 z-0"
      />

      {/* Morphing Gradient Background */}
      <motion.div
        variants={gradientVariants}
        initial="fullScreen"
        animate={getGradientState()}
        className="fixed z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
          filter: 'blur(60px)',
        }}
        layoutId="main-gradient" // Enable shared layout animation
      />

      {/* Screen Content - shows either screen 1 or screen 2 */}
      <div className="relative z-20 w-full h-full">
        {(currentScreen === 'screen1' || currentScreen === 'transitioning') && (
          <div 
            className="relative w-full h-full cursor-pointer"
            onClick={handleScreen1Click}
          >
            <Hero
              onAnalyzeClick={handleAnalyzeClick}
              className="relative z-30 pointer-events-none"
              animationState={currentScreen === 'screen1' ? 'visible' : 'hidden'}
              isTransitioning={isTransitioning}
              logoState={getLogoState()}
            />
            <div className="absolute bottom-20 left-6 z-40 pointer-events-auto">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnalyzeClick();
                }}
                className="opacity-0"
              >
              </button>
            </div>
          </div>
        )}
        {currentScreen === 'screen2' && (
          <div className="relative w-full h-full">
            <StatisticsSection
              animationState={getStatisticsState()}
              className="relative z-30"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenContainer;