// // // /src/components/quest-landing/sections/ScreenContainer.tsx

// // import React, { useCallback } from 'react';
// // import { motion } from 'framer-motion';
// // import { Hero, StatisticsSection } from './index';
// // import { GradientBackground } from '../common';
// // import { MotionWrapper } from '../animations';
// // import { useScreenTransition } from '../animations';

// // interface ScreenContainerProps {
// //   onAnalyzeClick?: () => void;
// //   className?: string;
// // }

// // const ScreenContainer: React.FC<ScreenContainerProps> = ({
// //   onAnalyzeClick,
// //   className = ''
// // }) => {
// //   // Initialize screen transition hook
// //   const {
// //     currentScreen,
// //     isTransitioning,
// //     gradientVariants,
// //     containerVariants,
// //     backgroundVariants,
// //     getGradientState,
// //     getContainerState,
// //     getStatisticsState,
// //     getHeroTextState,
// //     getBackgroundState,
// //     transitionForward,
// //     logoVariants,
// //   getLogoState,
// //   } = useScreenTransition({
// //     onTransitionStart: (direction) => {
// //       console.log(`Transition started: ${direction}`);
// //     },
// //     onTransitionComplete: (screen) => {
// //       console.log(`Transition complete: ${screen}`);
// //     }
// //   });

// //   // Handle screen 1 click to trigger animation
// //   const handleScreen1Click = useCallback(() => {
// //     if (currentScreen === 'screen1' && !isTransitioning) {
// //       transitionForward();
// //     }
// //   }, [currentScreen, isTransitioning, transitionForward]);

// //   // Handle analyze button click
// //   const handleAnalyzeClick = useCallback(() => {
// //     if (onAnalyzeClick) {
// //       onAnalyzeClick();
// //     }
// //     // Also trigger transition if on screen 1
// //     if (currentScreen === 'screen1' && !isTransitioning) {
// //       transitionForward();
// //     }
// //   }, [onAnalyzeClick, currentScreen, isTransitioning, transitionForward]);

// //   return (
// //     <div 
// //       className={`relative w-full h-screen overflow-hidden ${className}`}
// //       style={{
// //         height: '100vh', // Fixed viewport height
// //       }}
// //     >
// //       {/* Background that transitions between states */}
// //       <motion.div
// //         variants={backgroundVariants}
// //         initial="statistics"
// //         animate={getBackgroundState()}
// //         className="fixed inset-0 z-0"
// //       />

// //       {/* Morphing Gradient Background */}
// //       <motion.div
// //         variants={gradientVariants}
// //         initial="fullScreen"
// //         animate={getGradientState()}
// //         className="fixed z-0 pointer-events-none"
// //         style={{
// //           background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
// //           filter: 'blur(60px)',
// //         }}
// //         layoutId="main-gradient" // Enable shared layout animation
// //       />

// //       {/* Screen Content - shows either screen 1 or screen 2 */}
// //       <div className="relative z-20 w-full h-full">
// //         {(currentScreen === 'screen1' || currentScreen === 'transitioning') && (
// //           <div 
// //             className="relative w-full h-full cursor-pointer"
// //             onClick={handleScreen1Click}
// //           >
// //             <Hero
// //               onAnalyzeClick={handleAnalyzeClick}
// //               className="relative z-30 pointer-events-none"
// //               animationState={currentScreen === 'screen1' ? 'visible' : 'hidden'}
// //               isTransitioning={isTransitioning}
// //               logoState={getLogoState()}
// //             />
// //             <div className="absolute bottom-20 left-6 z-40 pointer-events-auto">
// //               <button 
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   handleAnalyzeClick();
// //                 }}
// //                 className="opacity-0"
// //               >
// //               </button>
// //             </div>
// //           </div>
// //         )}
// //         {currentScreen === 'screen2' && (
// //           <div className="relative w-full h-full">
// //             <StatisticsSection
// //               animationState={getStatisticsState()}
// //               className="relative z-30"
// //             />
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ScreenContainer;



// // /src/components/quest-landing/sections/ScreenContainer.tsx

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Hero, StatisticsSection, BenefitsSection, AnalyzeSection } from './index';

// interface ScreenContainerProps {
//   onAnalyzeClick?: () => void;
//   className?: string;
// }

// // Simple animation variants like Code 1
// const animationVariants = {
//   invisible: {
//     opacity: 0,
//   },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 0.6
//     }
//   }
// };

// const ScreenContainer: React.FC<ScreenContainerProps> = ({
//   onAnalyzeClick,
//   className = ''
// }) => {
//   // Simple state management like Code 1
//   const [current, setCurrent] = useState(0);

//   const handleAnalyzeClick = () => {
//     if (onAnalyzeClick) {
//       onAnalyzeClick();
//     }
//   };
//   const handleScreenTransition = () => {
//     setCurrent(current + 1);
//   };

//   const handleContinueClick = () => {
//   setCurrent(current + 1);
// };

// const handleBenefitsTransition = () => {
//   setCurrent(current + 1);
// };


//   return (
//     <div className={`relative h-[874px] overflow-hidden `}>
      
//       {/* Screen 1 - Hero */}
//       {current === 0 && (
//         <motion.div
//           key="screen1"
//           className=''
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           exit="invisible"
//         >
//           <Hero
//             onAnalyzeClick={handleAnalyzeClick}
//             onScreenTransition={handleScreenTransition}
//             className="relative z-30"
//           />
//         </motion.div>
//       )}

//       {/* Screen 2 - Statistics */}
//       {current === 1 && (
//         <AnimatePresence>
//           <motion.div
//             key="screen2"
//             className=''
//             variants={animationVariants}
            
//             initial="invisible"
//             animate="visible"
//             exit="invisible"
//           >
//             <StatisticsSection
//               animationState="visible"
//               className=" relative z-30"
//               onContinueClick={handleContinueClick}
//             />
//           </motion.div>
//         </AnimatePresence>
//       )}

//       {/* Screen 3 - Benefits */}
//       {current === 2 && (
//         <motion.div
//           key="screen3"
//           className=''
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           exit="invisible"
//         >
//           <BenefitsSection
//             animationState="visible"
//             className="relative z-30"
//             onScreenTransition={handleBenefitsTransition}
//           />
//         </motion.div>
//       )}
//         {current === 3 && (
//           <motion.div
//             key="screen4"
//             className='h-screen relative'
//             variants={animationVariants}
//             initial="invisible"
//             animate="visible"
//             exit="invisible"
//           >
//             <AnalyzeSection
//               animationState="visible"
//               className="relative z-30"
//             />
//           </motion.div>
//         )}
      
//     </div>
//   );
// };

// export default ScreenContainer;


// /src/components/quest-landing/sections/ScreenContainer.tsx

// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Hero, StatisticsSection, BenefitsSection, AnalyzeSection } from './index';

// interface ScreenContainerProps {
//   onAnalyzeClick?: () => void;
//   className?: string;
// }

// // Simple animation variants like Code 1
// const animationVariants = {
//   invisible: {
//     opacity: 0,
//   },
//   visible: {
//     opacity: 1,
//     transition: {
//       duration: 0.6
//     }
//   }
// };

// const ScreenContainer: React.FC<ScreenContainerProps> = ({
//   onAnalyzeClick,
//   className = ''
// }) => {
//   // Simple state management like Code 1
//   const [current, setCurrent] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);

//   // Handle scroll-based navigation
//   useEffect(() => {
//     const handleWheel = (event: WheelEvent) => {
//       event.preventDefault();
      
//       // Don't trigger during transitions
//       if (isTransitioning) return;

//       const scrollDown = event.deltaY > 0;
//       const scrollUp = event.deltaY < 0;

//       // Add minimum scroll threshold to prevent accidental triggers
//       const scrollThreshold = 50;
//       if (Math.abs(event.deltaY) < scrollThreshold) return;

//       if (scrollDown && current < 3) {
//         // Scroll down - go to next screen
//         setIsTransitioning(true);
//         setCurrent(current + 1);
//       } else if (scrollUp && current > 0) {
//         // Scroll up - go to previous screen
//         setIsTransitioning(true);
//         setCurrent(current - 1);
//       }
//     };

//     const container = containerRef.current;
//     if (container) {
//       container.addEventListener('wheel', handleWheel, { passive: false });
//     }

//     return () => {
//       if (container) {
//         container.removeEventListener('wheel', handleWheel);
//       }
//     };
//   }, [current, isTransitioning]);

//   // Reset transition state after animation completes
//   useEffect(() => {
//     if (isTransitioning) {
//       const timer = setTimeout(() => {
//         setIsTransitioning(false);
//       }, 1000); // Increased cooldown time

//       return () => clearTimeout(timer);
//     }
//   }, [isTransitioning]);

//   const handleAnalyzeClick = () => {
//     if (onAnalyzeClick) {
//       onAnalyzeClick();
//     }
//   };

//   return (
//     <div 
//       ref={containerRef}
//       className={`relative h-screen overflow-hidden`}
//       style={{ touchAction: 'none' }} // Prevent default touch scrolling
//     >
      
//       {/* Screen 1 - Hero */}
//       {current === 0 && (
//         <motion.div
//           key="screen1"
//           className=''
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           exit="invisible"
//         >
//           <Hero
//             onAnalyzeClick={handleAnalyzeClick}
//             className="relative z-30"
//           />
//         </motion.div>
//       )}

//       {/* Screen 2 - Statistics */}
//       {current === 1 && (
//         <AnimatePresence>
//           <motion.div
//             key="screen2"
//             className=''
//             variants={animationVariants}
//             initial="invisible"
//             animate="visible"
//             exit="invisible"
//           >
//             <StatisticsSection
//               animationState="visible"
//               className="relative z-30"
//             />
//           </motion.div>
//         </AnimatePresence>
//       )}

//       {/* Screen 3 - Benefits */}
//       {current === 2 && (
//         <motion.div
//           key="screen3"
//           className=''
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           exit="invisible"
//         >
//           <BenefitsSection
//             animationState="visible"
//             className="relative z-30"
//           />
//         </motion.div>
//       )}

//       {/* Screen 4 - Analyze */}
//       {current === 3 && (
//         <motion.div
//           key="screen4"
//           className='relative'
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           exit="invisible"
//         >
//           <AnalyzeSection
//             animationState="visible"
//             className="relative z-30"
//           />
//         </motion.div>
//       )}
      
//     </div>
//   );
// };

// export default ScreenContainer;


// /src/components/quest-landing/sections/ScreenContainer.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero, StatisticsSection, BenefitsSection, AnalyzeSection } from './index';

interface ScreenContainerProps {
  onAnalyzeClick?: () => void;
  className?: string;
}

// Simple animation variants like Code 1
const animationVariants = {
  invisible: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6
    }
  }
};

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  onAnalyzeClick,
  className = ''
}) => {
  // Simple state management like Code 1
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll-based navigation - but not for AnalyzeSection
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      // Don't prevent default scrolling on AnalyzeSection (screen 3)
      if (current === 3) {
        return; // Allow natural scrolling
      }
      
      event.preventDefault();
      
      // Don't trigger during transitions
      if (isTransitioning) return;

      const scrollDown = event.deltaY > 0;
      const scrollUp = event.deltaY < 0;

      // Add minimum scroll threshold to prevent accidental triggers
      const scrollThreshold = 50;
      if (Math.abs(event.deltaY) < scrollThreshold) return;

      if (scrollDown && current < 3) {
        // Scroll down - go to next screen
        setIsTransitioning(true);
        setCurrent(current + 1);
      } else if (scrollUp && current > 0) {
        // Scroll up - go to previous screen
        setIsTransitioning(true);
        setCurrent(current - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [current, isTransitioning]);

  // Reset transition state after animation completes
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 1000); // Increased cooldown time

      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handleAnalyzeClick = () => {
    if (onAnalyzeClick) {
      onAnalyzeClick();
    }
  };

  // Get dynamic container classes based on current screen
  const getContainerClasses = () => {
    if (current === 3) {
      // AnalyzeSection needs full height and scrollable
      return `relative min-h-screen overflow-y-auto overflow-x-hidden`;
    }
    // Other screens use fixed viewport height
    return `relative h-screen overflow-hidden`;
  };

  return (
    <div 
      ref={containerRef}
      className={getContainerClasses()}
      style={{ touchAction: current === 3 ? 'auto' : 'none' }} // Allow touch scrolling on AnalyzeSection
    >
      
      {/* Screen 1 - Hero */}
      {current === 0 && (
        <motion.div
          key="screen1"
          className='h-screen'
          variants={animationVariants}
          initial="invisible"
          animate="visible"
          exit="invisible"
        >
          <Hero
            onAnalyzeClick={handleAnalyzeClick}
            className="relative z-30"
          />
        </motion.div>
      )}

      {/* Screen 2 - Statistics */}
      {current === 1 && (
        <AnimatePresence>
          <motion.div
            key="screen2"
            className='h-screen'
            variants={animationVariants}
            initial="invisible"
            animate="visible"
            exit="invisible"
          >
            <StatisticsSection
              animationState="visible"
              className="relative z-30"
            />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Screen 3 - Benefits */}
      {current === 2 && (
        <motion.div
          key="screen3"
          className='h-screen'
          variants={animationVariants}
          initial="invisible"
          animate="visible"
          exit="invisible"
        >
          <BenefitsSection
            animationState="visible"
            className="relative z-30"
          />
        </motion.div>
      )}

      {/* Screen 4 - Analyze (Scrollable) */}
      {current === 3 && (
        <motion.div
          key="screen4"
          className='relative w-full' // Remove height constraint
          variants={animationVariants}
          initial="invisible"
          animate="visible"
          exit="invisible"
        >
          <AnalyzeSection
            animationState="visible"
            className="relative z-30"
          />
        </motion.div>
      )}

      {/* Navigation indicator (optional) */}
      {/* <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrent(index);
              }
            }}
            className={`w-3 h-3 rounded-full transition-colors ${
              current === index ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div> */}
      
    </div>
  );
};

export default ScreenContainer;