// /src/components/quest-landing/sections/StatisticsSection.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { statisticsText } from '../animations';
import { colors, spacing, responsiveClasses } from '../styles';

interface StatisticsSectionProps {
  animationState: string;
  className?: string;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ 
  animationState,
  className = '' 
}) => {
  // Scroll indicator animation
  const scrollIndicatorVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.8, // Appear after text animation completes
        duration: 0.4,
        ease: [0, 0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section 
      className={`z-50 relative w-full min-h-screen flex flex-col justify-center items-center text-center px-0 md:px-6 lg:px-8 ${className}`}
    >

      <motion.div
        variants={statisticsText}
        initial="hidden"
        animate="visible"
        className="relative max-w-md mx-auto"
      >
        {/* Introduction Text: "You'd be shocked to know," */}
        <div className="">
          <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
            You'd be shocked to know,
          </p>
        </div>

        {/* Harvard Reference */}
        <div className="mb-8">
          <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
            Harvard researchers suggest that
          </p>
        </div>

        {/* Main Statistic: "95%" */}
        <div className="">
          <h1 className="text-white text-[48px] md:text-[100px] lg:text-[120px] font-bold leading-none tracking-tight font-gilroy">
            95%
          </h1>
        </div>

        {/* Supporting Text: "of people believe" */}
        <div className="">
          <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
            of people believe
          </p>
        </div>

        {/* Key Point: "they are self-aware" */}
        <div className="">
          <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-bold leading-relaxed font-gilroy">
            they are self-aware
          </p>
        </div>

        {/* Transition Text: "but only" */}
        <div className="mb-8">
          <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
            but only
          </p>
        </div>

        {/* Counter Statistic: "10-15%" */}
        <div className="">
          <h2 className="text-white text-[48px] md:text-[80px] lg:text-[90px] font-bold leading-none tracking-tight font-gilroy">
            10-15%
          </h2>
        </div>

        {/* Final Text: "actually are" */}
        <div className="mb-0">
          <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
            actually are
          </p>
        </div>
      </motion.div>

      {/* Scroll Indicator - Circular indicator at bottom */}
      <motion.div 
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-16"
      >
        <div className="relative">
          {/* Circular border */}
          <div 
            className="w-12 h-12 border-2 border-white/40 rounded-full flex items-center justify-center"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.4)',
            }}
          >
            {/* Down arrow */}
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              className="text-white/60"
            >
              <path 
                d="M12 16L8 12H16L12 16Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          
          {/* Surrounding text "SCROLL DOWN TO CONTINUE" */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 120 120"
              className="absolute"
              style={{ animationDuration: '10s' }}
            >
              <defs>
                <path
                  id="circle-path"
                  d="M 60, 60 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                />
              </defs>
              <text 
                fontSize="8" 
                fill="rgba(255, 255, 255, 0.5)"
                fontFamily="Gilroy-Regular"
              >
                <textPath 
                  href="#circle-path"
                  startOffset="0%"
                >
                  SCROLL DOWN TO CONTINUE • SCROLL DOWN TO CONTINUE • 
                </textPath>
              </text>
            </svg>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default StatisticsSection;