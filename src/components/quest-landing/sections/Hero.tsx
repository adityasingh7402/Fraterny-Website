// /src/components/quest-landing/sections/Hero.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Logo, 
  Button, 
  GradientBackground, 
  Heading, 
  Paragraph 
} from '../common';
import { 
  MotionWrapper,
  heroTextFadeOut,
  logoMove
} from '../animations';
import { colors, spacing, responsiveClasses } from '../styles';


interface HeroProps {
  onAnalyzeClick?: () => void;
  className?: string;
  animationState?: string;
  isTransitioning?: boolean;
  logoState?: string;
}

const Hero: React.FC<HeroProps> = ({ 
  onAnalyzeClick, 
  className = '',
  animationState = 'visible',
  isTransitioning = false,
  logoState = 'heroPosition'
}) => {
  // Local animation variants to avoid TypeScript issues
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

    console.log('Hero Debug:', {
    animationState,
    isTransitioning,
    logoState,
    textAnimationState: isTransitioning ? 'hidden' : 'visible'
  });

  const itemVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0, 0, 0.2, 1] as [number, number, number, number], // easeOut cubic-bezier
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 1.2,
        duration: 0.8,
        ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number], // backOut easing
      },
    },
  };

  // Handle button click
  const handleAnalyzeClick = () => {
    if (onAnalyzeClick) {
      onAnalyzeClick();
    } else {
      console.log('Analyze Me clicked');
    }
  };

  const textAnimationState = isTransitioning ? 'hidden' : 'visible';

  return (
    <section 
      className={`relative w-full min-h-screen overflow-hidden flex flex-col justify-start bg-[#FFFFFF] pt-10 md:pt-16 lg:pt-20 px-4 md:px-6 lg:px-8 pb-6 ${className}`}
    >
      {/* Background Gradient Ellipse - Exact Figma positioning */}
      <GradientBackground 
        variant="hero" 
        animated={true} 
        intensity="strong"
      />

      {/* Hero Content Container */}
      <MotionWrapper
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-xl"
      >
        {/* Greeting Text: "hi there," */}
        <motion.div variants={itemVariants}>
          <Heading
            variant="hero-greeting"
            className={`${responsiveClasses.typography.heroGreeting}`}
            animated={false} // Disable internal animation to avoid conflicts
            animationIndex={0}
          >
            hi there,
          </Heading>
        </motion.div>

        {/* <motion.div variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[#7D7D7D] ${responsiveClasses.typography.heroTitle} font-bold leading-none tracking-tight`}>
              I'm 
            </span>
            <motion.div
              variants={logoMove}
              initial="heroPosition"
              animate={logoState}
              className="flex items-center"
            >
              <img 
                src="/Vector.svg" 
                alt="QUEST" 
                className="h-[72px] md:h-[60px] lg:h-[72px] w-auto" // Match text height
              />
            </motion.div>
          </div>
        </motion.div> */}

        {/* Main Title: "I'm QUEST" - Split animations */}
        <div className="flex items-center gap-2 mb-4">
          {/* "I'm" text that fades out */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={heroTextFadeOut}
              initial="visible"
              animate={textAnimationState}
            >
              <span className={`text-[#7D7D7D] ${responsiveClasses.typography.heroTitle} font-bold leading-none tracking-tight`}>
                I'm 
              </span>
            </motion.div>
          </motion.div>
          
          {/* QUEST SVG that moves (no fade) */}
          <motion.div
            variants={logoMove}
            initial="heroPosition"
            animate={logoState}
            className="flex items-center"
            onAnimationStart={() => console.log('SVG animation started:', logoState)}
            onAnimationComplete={() => console.log('SVG animation completed:', logoState)}
          >
            <img 
              src="/Vector.svg" 
              alt="QUEST" 
              className="h-[72px] md:h-[60px] lg:h-[72px] w-auto"
            />
          </motion.div>
        </div>

        {/* Subtitle: "i can" */}
        <motion.div variants={itemVariants} className='mt-10'>
          <Paragraph
            variant="hero-subtitle"
            color="secondary"
            className={`${responsiveClasses.typography.heroSubtitle}`}
            animated={false}
            animationIndex={3}
          >
            i can
          </Paragraph>
        </motion.div>

        {/* Highlight: "Hack Your Brain" */}
        <motion.div variants={itemVariants}>
          <Heading
            level={2}
            variant="hero-highlight"
            color="primary"
            className={`${responsiveClasses.typography.heroHighlight}`}
            animated={false}
            animationIndex={4}
          >
            Hack Your Brain
          </Heading>
        </motion.div>

        {/* Closing: "in 15 minutes." */}
        <motion.div variants={itemVariants}>
          <Paragraph
            variant="hero-closing"
            color="secondary"
            className={`${responsiveClasses.typography.heroClosing} mb-8 text-white font-normal leading-none`}
            animated={false}
            animationIndex={5}
          >
            in 15 minutes.
          </Paragraph>
        </motion.div>

        {/* Call-to-Action Button */}
        <motion.div 
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          className="relative mt-32"
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
      </MotionWrapper>
    </section>
  );
};

export default Hero;