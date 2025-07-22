// // /src/components/quest-landing/sections/Hero.tsx

// import React from 'react';
// import { motion } from 'framer-motion';
// import { 
//   Logo, 
//   Button, 
//   GradientBackground, 
//   Heading, 
//   Paragraph 
// } from '../common';
// import { 
//   MotionWrapper,
//   heroTextFadeOut,
//   logoMove
// } from '../animations';
// import { colors, spacing, responsiveClasses } from '../styles';


// interface HeroProps {
//   onAnalyzeClick?: () => void;
//   className?: string;
//   animationState?: string;
//   isTransitioning?: boolean;
//   logoState?: string;
// }

// const Hero: React.FC<HeroProps> = ({ 
//   onAnalyzeClick, 
//   className = '',
//   animationState = 'visible',
//   isTransitioning = false,
//   logoState = 'heroPosition'
// }) => {
//   // Local animation variants to avoid TypeScript issues
//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         duration: 0.8,
//         staggerChildren: 0.15,
//         delayChildren: 0.2,
//       },
//     },
//   };

//     console.log('Hero Debug:', {
//     animationState,
//     isTransitioning,
//     logoState,
//     textAnimationState: isTransitioning ? 'hidden' : 'visible'
//   });

//   const itemVariants = {
//     hidden: { 
//       opacity: 0,
//       y: 30,
//     },
//     visible: { 
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//         ease: [0, 0, 0.2, 1] as [number, number, number, number], // easeOut cubic-bezier
//       },
//     },
//   };

//   const buttonVariants = {
//     hidden: {
//       opacity: 0,
//       y: 20,
//       scale: 0.9,
//     },
//     visible: {
//       opacity: 1,
//       y: 0,
//       scale: 1,
//       transition: {
//         delay: 1.2,
//         duration: 0.8,
//         ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number], // backOut easing
//       },
//     },
//   };

//   // Handle button click
//   const handleAnalyzeClick = () => {
//     if (onAnalyzeClick) {
//       onAnalyzeClick();
//     } else {
//       console.log('Analyze Me clicked');
//     }
//   };

//   const textAnimationState = isTransitioning ? 'hidden' : 'visible';

//   return (
//     <section 
//       className={`relative w-full min-h-screen overflow-hidden flex flex-col justify-start bg-[#FFFFFF] pt-10 md:pt-16 lg:pt-20 px-4 md:px-6 lg:px-8 pb-6 ${className}`}
//     >
//       {/* Background Gradient Ellipse - Exact Figma positioning */}
//       <GradientBackground 
//         variant="hero" 
//         animated={true} 
//         intensity="strong"
//       />

//       {/* Hero Content Container */}
//       <MotionWrapper
//         variants={containerVariants}
//         initial="hidden"
//         animate="visible"
//         className="relative max-w-xl"
//       >
//         {/* Greeting Text: "hi there," */}
//         <motion.div variants={itemVariants}>
//           <Heading
//             variant="hero-greeting"
//             className={`${responsiveClasses.typography.heroGreeting}`}
//             animated={false} // Disable internal animation to avoid conflicts
//             animationIndex={0}
//           >
//             hi there,
//           </Heading>
//         </motion.div>

//         {/* <motion.div variants={itemVariants}>
//           <div className="flex items-center gap-2 mb-4">
//             <span className={`text-[#7D7D7D] ${responsiveClasses.typography.heroTitle} font-bold leading-none tracking-tight`}>
//               I'm 
//             </span>
//             <motion.div
//               variants={logoMove}
//               initial="heroPosition"
//               animate={logoState}
//               className="flex items-center"
//             >
//               <img 
//                 src="/Vector.svg" 
//                 alt="QUEST" 
//                 className="h-[72px] md:h-[60px] lg:h-[72px] w-auto" // Match text height
//               />
//             </motion.div>
//           </div>
//         </motion.div> */}

//         {/* Main Title: "I'm QUEST" - Split animations */}
//         <div className="flex items-center gap-2 mb-4">
//           {/* "I'm" text that fades out */}
//           <motion.div 
//             variants={itemVariants}
//             initial="hidden"
//             animate="visible"
//           >
//             <motion.div
//               variants={heroTextFadeOut}
//               initial="visible"
//               animate={textAnimationState}
//             >
//               <span className={`text-[#7D7D7D] ${responsiveClasses.typography.heroTitle} font-bold leading-none tracking-tight`}>
//                 I'm 
//               </span>
//             </motion.div>
//           </motion.div>
          
//           {/* QUEST SVG that moves (no fade) */}
//           <motion.div
//             variants={logoMove}
//             initial="heroPosition"
//             animate={logoState}
//             className="flex items-center"
//             onAnimationStart={() => console.log('SVG animation started:', logoState)}
//             onAnimationComplete={() => console.log('SVG animation completed:', logoState)}
//           >
//             <img 
//               src="/Vector.svg" 
//               alt="QUEST" 
//               className="h-[72px] md:h-[60px] lg:h-[72px] w-auto"
//             />
//           </motion.div>
//         </div>

//         {/* Subtitle: "i can" */}
//         <motion.div variants={itemVariants} className='mt-10'>
//           <Paragraph
//             variant="hero-subtitle"
//             color="secondary"
//             className={`${responsiveClasses.typography.heroSubtitle}`}
//             animated={false}
//             animationIndex={3}
//           >
//             i can
//           </Paragraph>
//         </motion.div>

//         {/* Highlight: "Hack Your Brain" */}
//         <motion.div variants={itemVariants}>
//           <Heading
//             level={2}
//             variant="hero-highlight"
//             color="primary"
//             className={`${responsiveClasses.typography.heroHighlight}`}
//             animated={false}
//             animationIndex={4}
//           >
//             Hack Your Brain
//           </Heading>
//         </motion.div>

//         {/* Closing: "in 15 minutes." */}
//         <motion.div variants={itemVariants}>
//           <Paragraph
//             variant="hero-closing"
//             color="secondary"
//             className={`${responsiveClasses.typography.heroClosing} mb-8 text-white font-normal leading-none`}
//             animated={false}
//             animationIndex={5}
//           >
//             in 15 minutes.
//           </Paragraph>
//         </motion.div>

//         {/* Call-to-Action Button */}
//         <motion.div 
//           variants={buttonVariants}
//           initial="hidden"
//           animate="visible"
//           className="relative mt-32"
//         >
//           <Button
//             variant="primary"
//             size="hero"
//             onClick={handleAnalyzeClick}
//             animated={true}
//             className="font-bold text-xl"
//           >
//             Analyse Me
//           </Button>
//         </motion.div>
//       </MotionWrapper>
//     </section>
//   );
// };

// export default Hero;



// /src/components/quest-landing/sections/Hero.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common';
import { colors, spacing, responsiveClasses } from '../styles';

interface HeroProps {
  onAnalyzeClick?: () => void;
  onScreenTransition?: () => void;  // Add this line
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

const Hero: React.FC<HeroProps> = ({ 
  onAnalyzeClick, 
  onScreenTransition,
  className = ''
}) => {
  const handleAnalyzeClick = () => {
    if (onAnalyzeClick) {
      onAnalyzeClick();
    }
  };

  return (
    <section 
      className={`relative w-screen min-h-screen overflow-hidden flex flex-col justify-start bg-[#FFFFFF] pt-10 md:pt-16 lg:pt-20 px-4 md:px-6 lg:px-8 pb-6 ${className}`}
    >
      {/* Background Gradient with layoutId for morphing */}
      {/* <motion.div 
        layoutId='bg'
        transition={{ duration: 0.5 }}
        className='absolute z-10 w-[554px] h-[554px] rounded-full blur-xl'
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
          top: '400px',
          left: '-76px',
        }}
      /> */}
      {/* Down Arrow for Screen Transition */}
      <div className="absolute bottom-6 right-6 z-30">
        <motion.button
          onClick={onScreenTransition}
          variants={animationVariants}
          initial="invisible"
          animate="visible"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l3 3 3-3M7 6l3 3 3-3"/>
          </svg>
        </motion.button>
      </div>

      <motion.div 
        layoutId='bg'
        transition={{ duration: 1.2 }}
        className='absolute z-0 w-[554px] h-[554px] bg-radial from-40% from-blue-500 to-30% to-blue-300 flex top-[300px] left-[-76px] rounded-full blur-xl'
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
        }}
      />

      {/* Hero Content Container */}
      <div className="relative z-20 max-w-xl">
        
        {/* Greeting Text: "hi there," */}
        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
        >
          <h1 className={`font-gilroy-regular text-[54px] md:text-[42px] lg:text-[54px] leading-none text-gray-900 m-0 mb-2`}>
            hi there,
          </h1>
        </motion.div>

        {/* Main Title: "I'm QUEST" with layoutId for logo morphing */}
        <div className="flex items-center gap-2 mb-4">
          <motion.span 
            variants={animationVariants} 
            initial="invisible" 
            animate="visible"
            className={`text-[#7D7D7D] text-[72px] md:text-[60px] lg:text-[72px] font-bold leading-none tracking-tight`}
          >
            I'm 
          </motion.span>
          
          <motion.div
            layoutId='logo'
            transition={{ duration: 1.2 }}
            className="flex items-center"
          >
            <img 
              src="/Vector.svg" 
              alt="QUEST" 
              className="h-[72px] md:h-[60px] lg:h-[72px] w-auto"
            />
          </motion.div>
        </div>

        {/* Subtitle: "i can" */}
        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className='mt-10'
        >
          <p className={`text-[#7D7D7D] text-[36px] md:text-[30px] lg:text-[36px] font-normal leading-none m-0`}>
            i can
          </p>
        </motion.div>

        {/* Highlight: "Hack Your Brain" */}
        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
        >
          <h2 className={`font-bold text-[40px] md:text-[34px] lg:text-[40px] leading-none text-black m-0 mb-2`}>
            Hack Your Brain
          </h2>
        </motion.div>

        {/* Closing: "in 15 minutes." */}
        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
        >
          <p className={`text-[#7D7D7D] text-[36px] md:text-[30px] lg:text-[36px] font-normal leading-none m-0 mb-8`}>
            in 15 minutes.
          </p>
        </motion.div>

        {/* Call-to-Action Button */}
        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="relative mt-10"
        >
          <Button
            variant="primary"
            size="hero"
            onClick={handleAnalyzeClick}
            animated={true}
            className="font-bold text-xl"
          >
            Analyse Me
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;