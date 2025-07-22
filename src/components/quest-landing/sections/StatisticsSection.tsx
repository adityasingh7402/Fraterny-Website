// // /src/components/quest-landing/sections/StatisticsSection.tsx

// import React from 'react';
// import { motion } from 'framer-motion';
// import { statisticsText } from '../animations';
// import { colors, spacing, responsiveClasses } from '../styles';

// interface StatisticsSectionProps {
//   animationState: string;
//   className?: string;
// }

// const StatisticsSection: React.FC<StatisticsSectionProps> = ({ 
//   animationState,
//   className = '' 
// }) => {
//   // Scroll indicator animation
//   const scrollIndicatorVariants = {
//     hidden: { 
//       opacity: 0,
//       scale: 0.8,
//     },
//     visible: { 
//       opacity: 1,
//       scale: 1,
//       transition: {
//         delay: 0.8, // Appear after text animation completes
//         duration: 0.4,
//         ease: [0, 0, 0.2, 1] as [number, number, number, number],
//       },
//     },
//   };

//   return (
//     <section 
//       className={`z-50 relative w-full min-h-screen flex flex-col justify-center items-center text-center px-0 md:px-6 lg:px-8 ${className}`}
//     >

//       <motion.div
//         variants={statisticsText}
//         initial="hidden"
//         animate="visible"
//         className="relative max-w-md mx-auto"
//       >
//         {/* Introduction Text: "You'd be shocked to know," */}
        // <div className="">
        //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
        //     You'd be shocked to know,
        //   </p>
        // </div>

        // {/* Harvard Reference */}
        // <div className="mb-8">
        //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
        //     Harvard researchers suggest that
        //   </p>
        // </div>

        // {/* Main Statistic: "95%" */}
        // <div className="">
        //   <h1 className="text-white text-[48px] md:text-[100px] lg:text-[120px] font-bold leading-none tracking-tight font-gilroy">
        //     95%
        //   </h1>
        // </div>

        // {/* Supporting Text: "of people believe" */}
        // <div className="">
        //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
        //     of people believe
        //   </p>
        // </div>

        // {/* Key Point: "they are self-aware" */}
        // <div className="">
        //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-bold leading-relaxed font-gilroy">
        //     they are self-aware
        //   </p>
        // </div>

        // {/* Transition Text: "but only" */}
        // <div className="mb-8">
        //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
        //     but only
        //   </p>
        // </div>

        // {/* Counter Statistic: "10-15%" */}
        // <div className="">
        //   <h2 className="text-white text-[48px] md:text-[80px] lg:text-[90px] font-bold leading-none tracking-tight font-gilroy">
        //     10-15%
        //   </h2>
        // </div>

        // {/* Final Text: "actually are" */}
        // <div className="mb-0">
        //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
        //     actually are
        //   </p>
        // </div>
//       </motion.div>

//       {/* Scroll Indicator - Circular indicator at bottom */}
//       <motion.div 
//         variants={scrollIndicatorVariants}
//         initial="hidden"
//         animate="visible"
//         className="absolute bottom-16"
//       >
//         <div className="relative">
//           {/* Circular border */}
//           <div 
//             className="w-12 h-12 border-2 border-white/40 rounded-full flex items-center justify-center"
//             style={{
//               borderColor: 'rgba(255, 255, 255, 0.4)',
//             }}
//           >
//             {/* Down arrow */}
//             <svg 
//               width="16" 
//               height="16" 
//               viewBox="0 0 24 24" 
//               fill="none" 
//               className="text-white/60"
//             >
//               <path 
//                 d="M12 16L8 12H16L12 16Z" 
//                 fill="currentColor"
//               />
//             </svg>
//           </div>
          
//           {/* Surrounding text "SCROLL DOWN TO CONTINUE" */}
//           <div className="absolute inset-0 flex items-center justify-center">
//             <svg 
//               width="120" 
//               height="120" 
//               viewBox="0 0 120 120"
//               className="absolute"
//               style={{ animationDuration: '10s' }}
//             >
//               <defs>
//                 <path
//                   id="circle-path"
//                   d="M 60, 60 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
//                 />
//               </defs>
//               <text 
//                 fontSize="8" 
//                 fill="rgba(255, 255, 255, 0.5)"
//                 fontFamily="Gilroy-Regular"
//               >
//                 <textPath 
//                   href="#circle-path"
//                   startOffset="0%"
//                 >
//                   SCROLL DOWN TO CONTINUE • SCROLL DOWN TO CONTINUE • 
//                 </textPath>
//               </text>
//             </svg>
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   );
// };

// export default StatisticsSection;


// /src/components/quest-landing/sections/StatisticsSection.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

interface StatisticsSectionProps {
  animationState: string;
  className?: string;
  onContinueClick?: () => void;
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

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ 
  animationState,
  className = '' ,
  onContinueClick
}) => {
  return (
    <section 
      className={`relative w-screen min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 lg:px-8 ${className}`}
    >
      {/* Background Gradient with same layoutId for morphing */}
      {/* <motion.div 
        layoutId='bg'
        transition={{ duration: 0.5 }}
        className='absolute z-10 w-[554px] h-[600px] rounded-full blur-xl'
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
          top: '10%',
          left: '-76px',
          transform: 'translateY(-50%)',
        }}
      /> */}
      <motion.div 
        layoutId='bg'
        transition={{ duration: 1.2 }}
        className='absolute z-0 w-[554px] h-[554px] bg-radial from-40% from-blue-500 to-20% to-blue-300 flex bottom-0 top-[100px] left-[-76px] translateY-[-50%] rounded-full blur-xl'
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
        }}
      />

      {/* Header with Logo */}
      <div className='flex justify-between fixed top-0 w-full z-50 p-2 left-0 text-black items-center'>
        <div className='flex-1 items-center justify-center'>
          <motion.div 
            layoutId='logo'
            transition={{ duration: 1.2 }}
            className='flex text-black mx-auto flex-col gap-0 items-center justify-center w-fit'
          >
            <h1 className='font-bold text-[32px] m-0 leading-none'>QUEST</h1>
            <p className='text-[10px] leading-none'>BY FRATERNTY</p>
          </motion.div>
        </div>
        <motion.span 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
        >
          <Menu/>
        </motion.span>
      </div>

      {/* Statistics Content */}
      <motion.div
        variants={animationVariants}
        initial="invisible"
        animate="visible"
        className="relative z-20 max-w-md mx-auto text-white"
      >
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

      {/* Scroll Indicator */}
      <motion.div 
        variants={animationVariants}
        initial="invisible"
        animate="visible"
        className="absolute bottom-16"
        onClick={onContinueClick}
      >
        <div className="relative">
          <div 
            className="w-12 h-12 border-2 border-white/40 rounded-full flex items-center justify-center"
          >
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
          
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              width="120" 
              height="120" 
              viewBox="0 0 120 120"
              className="absolute"
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
                  TAP TO CONTINUE • TAP TO CONTINUE • 
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