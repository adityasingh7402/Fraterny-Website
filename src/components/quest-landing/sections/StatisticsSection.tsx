// // // /src/components/quest-landing/sections/StatisticsSection.tsx

// // import React from 'react';
// // import { motion } from 'framer-motion';
// // import { statisticsText } from '../animations';
// // import { colors, spacing, responsiveClasses } from '../styles';

// // interface StatisticsSectionProps {
// //   animationState: string;
// //   className?: string;
// // }

// // const StatisticsSection: React.FC<StatisticsSectionProps> = ({ 
// //   animationState,
// //   className = '' 
// // }) => {
// //   // Scroll indicator animation
// //   const scrollIndicatorVariants = {
// //     hidden: { 
// //       opacity: 0,
// //       scale: 0.8,
// //     },
// //     visible: { 
// //       opacity: 1,
// //       scale: 1,
// //       transition: {
// //         delay: 0.8, // Appear after text animation completes
// //         duration: 0.4,
// //         ease: [0, 0, 0.2, 1] as [number, number, number, number],
// //       },
// //     },
// //   };

// //   return (
// //     <section 
// //       className={`z-50 relative w-full min-h-screen flex flex-col justify-center items-center text-center px-0 md:px-6 lg:px-8 ${className}`}
// //     >

// //       <motion.div
// //         variants={statisticsText}
// //         initial="hidden"
// //         animate="visible"
// //         className="relative max-w-md mx-auto"
// //       >
// //         {/* Introduction Text: "You'd be shocked to know," */}
//         // <div className="">
//         //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//         //     You'd be shocked to know,
//         //   </p>
//         // </div>

//         // {/* Harvard Reference */}
//         // <div className="mb-8">
//         //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//         //     Harvard researchers suggest that
//         //   </p>
//         // </div>

//         // {/* Main Statistic: "95%" */}
//         // <div className="">
//         //   <h1 className="text-white text-[48px] md:text-[100px] lg:text-[120px] font-bold leading-none tracking-tight font-gilroy">
//         //     95%
//         //   </h1>
//         // </div>

//         // {/* Supporting Text: "of people believe" */}
//         // <div className="">
//         //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//         //     of people believe
//         //   </p>
//         // </div>

//         // {/* Key Point: "they are self-aware" */}
//         // <div className="">
//         //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-bold leading-relaxed font-gilroy">
//         //     they are self-aware
//         //   </p>
//         // </div>

//         // {/* Transition Text: "but only" */}
//         // <div className="mb-8">
//         //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//         //     but only
//         //   </p>
//         // </div>

//         // {/* Counter Statistic: "10-15%" */}
//         // <div className="">
//         //   <h2 className="text-white text-[48px] md:text-[80px] lg:text-[90px] font-bold leading-none tracking-tight font-gilroy">
//         //     10-15%
//         //   </h2>
//         // </div>

//         // {/* Final Text: "actually are" */}
//         // <div className="mb-0">
//         //   <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//         //     actually are
//         //   </p>
//         // </div>
// //       </motion.div>

// //       {/* Scroll Indicator - Circular indicator at bottom */}
// //       <motion.div 
// //         variants={scrollIndicatorVariants}
// //         initial="hidden"
// //         animate="visible"
// //         className="absolute bottom-16"
// //       >
// //         <div className="relative">
// //           {/* Circular border */}
// //           <div 
// //             className="w-12 h-12 border-2 border-white/40 rounded-full flex items-center justify-center"
// //             style={{
// //               borderColor: 'rgba(255, 255, 255, 0.4)',
// //             }}
// //           >
// //             {/* Down arrow */}
// //             <svg 
// //               width="16" 
// //               height="16" 
// //               viewBox="0 0 24 24" 
// //               fill="none" 
// //               className="text-white/60"
// //             >
// //               <path 
// //                 d="M12 16L8 12H16L12 16Z" 
// //                 fill="currentColor"
// //               />
// //             </svg>
// //           </div>
          
// //           {/* Surrounding text "SCROLL DOWN TO CONTINUE" */}
// //           <div className="absolute inset-0 flex items-center justify-center">
// //             <svg 
// //               width="120" 
// //               height="120" 
// //               viewBox="0 0 120 120"
// //               className="absolute"
// //               style={{ animationDuration: '10s' }}
// //             >
// //               <defs>
// //                 <path
// //                   id="circle-path"
// //                   d="M 60, 60 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
// //                 />
// //               </defs>
// //               <text 
// //                 fontSize="8" 
// //                 fill="rgba(255, 255, 255, 0.5)"
// //                 fontFamily="Gilroy-Regular"
// //               >
// //                 <textPath 
// //                   href="#circle-path"
// //                   startOffset="0%"
// //                 >
// //                   SCROLL DOWN TO CONTINUE • SCROLL DOWN TO CONTINUE • 
// //                 </textPath>
// //               </text>
// //             </svg>
// //           </div>
// //         </div>
// //       </motion.div>
// //     </section>
// //   );
// // };

// // export default StatisticsSection;


// // /src/components/quest-landing/sections/StatisticsSection.tsx

// import React from 'react';
// import { motion } from 'framer-motion';
// import { Menu } from 'lucide-react';

// interface StatisticsSectionProps {
//   animationState: string;
//   className?: string;
//   onContinueClick?: () => void;
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

// const StatisticsSection: React.FC<StatisticsSectionProps> = ({ 
//   animationState,
//   className = '' ,
//   onContinueClick
// }) => {
//   return (
//     <section 
//       className={`relative w-screen min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 lg:px-8 ${className}`}
//     >
//       {/* Background Gradient with same layoutId for morphing */}
//       {/* <motion.div 
//         layoutId='bg'
//         transition={{ duration: 0.5 }}
//         className='absolute z-10 w-[554px] h-[600px] rounded-full blur-xl'
//         style={{
//           background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
//           top: '10%',
//           left: '-76px',
//           transform: 'translateY(-50%)',
//         }}
//       /> */}
//       <motion.div 
//         layoutId='bg'
//         transition={{ duration: 1.2 }}
//         className='absolute z-0 w-[554px] h-[554px] bg-radial from-40% from-blue-500 to-20% to-blue-300 flex bottom-0 top-[100px] left-[-76px] translateY-[-50%] rounded-full blur-xl'
//         style={{
//           background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
//         }}
//       />

//       {/* Header with Logo */}
//       <div className='flex justify-between fixed top-0 w-full z-50 p-2 left-0 text-black items-center'>
//         <div className='flex-1 items-center justify-center'>
//           <motion.div 
//             layoutId='logo'
//             transition={{ duration: 1.2 }}
//             className='flex text-black mx-auto flex-col gap-0 items-center justify-center w-fit'
//           >
//             <h1 className='font-bold text-[32px] m-0 leading-none'>QUEST</h1>
//             <p className='text-[10px] leading-none'>BY FRATERNTY</p>
//           </motion.div>
//         </div>
//         <motion.span 
//           variants={animationVariants} 
//           initial="invisible" 
//           animate="visible"
//         >
//           <Menu/>
//         </motion.span>
//       </div>

//       {/* Statistics Content */}
//       <motion.div
//         variants={animationVariants}
//         initial="invisible"
//         animate="visible"
//         className="relative z-20 max-w-md mx-auto text-white"
//       >
//                 <div className="">
//           <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//             You'd be shocked to know,
//           </p>
//         </div>

//         {/* Harvard Reference */}
//         <div className="mb-8">
//           <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//             Harvard researchers suggest that
//           </p>
//         </div>

//         {/* Main Statistic: "95%" */}
//         <div className="">
//           <h1 className="text-white text-[48px] md:text-[100px] lg:text-[120px] font-bold leading-none tracking-tight font-gilroy">
//             95%
//           </h1>
//         </div>

//         {/* Supporting Text: "of people believe" */}
//         <div className="">
//           <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//             of people believe
//           </p>
//         </div>

//         {/* Key Point: "they are self-aware" */}
//         <div className="">
//           <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-bold leading-relaxed font-gilroy">
//             they are self-aware
//           </p>
//         </div>

//         {/* Transition Text: "but only" */}
//         <div className="mb-8">
//           <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//             but only
//           </p>
//         </div>

//         {/* Counter Statistic: "10-15%" */}
//         <div className="">
//           <h2 className="text-white text-[48px] md:text-[80px] lg:text-[90px] font-bold leading-none tracking-tight font-gilroy">
//             10-15%
//           </h2>
//         </div>

//         {/* Final Text: "actually are" */}
//         <div className="mb-0">
//           <p className="text-white text-[18px] md:text-[20px] lg:text-[22px] font-normal leading-relaxed font-gilroy">
//             actually are
//           </p>
//         </div>
//       </motion.div>

//       {/* Scroll Indicator */}
//       <motion.div 
//         variants={animationVariants}
//         initial="invisible"
//         animate="visible"
//         className="absolute bottom-32"
//         onClick={onContinueClick}
//       >
//         <div className="relative">
//           <div 
//             className="w-12 h-12 border-2 border-white/40 rounded-full flex items-center justify-center"
//           >
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
          
//           <div className="absolute inset-0 flex items-center justify-center">
//             <svg 
//               width="120" 
//               height="120" 
//               viewBox="0 0 120 120"
//               className="absolute"
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
//                   TAP TO CONTINUE • TAP TO CONTINUE • 
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

import React,{useState} from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import img from '../../../../public/Vector.svg';

interface StatisticsSectionProps {
  animationState: string;
  className?: string;
  onContinueClick?: () => void;
}

// Simple animation variants
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
  className = '',
  onContinueClick
}) => {
  const [hasRippled, setHasRippled] = useState(false);

  const handleRipple = () => {
    if (!hasRippled) {
      setHasRippled(true);
    }
  }


  return (
    <section 
      className="w-full min-h-screen relative bg-white"
    >
      {/* Background Gradient - exact Figma positioning */}
      <motion.div 
        layoutId='bg'
        transition={{ duration: 1.2 }}
        className='absolute z-0 w-[554px] h-[554px] rounded-full'
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 51%, #48B9D8 100%)',
          left: '-70px',
          top: '100px',
          filter: 'blur(30px)',
        }}
      />

      {/* <motion.div 
        layoutId='bg'
        className='absolute z-0 w-[554px] h-[554px] rounded-full cursor-pointer'
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 51%, #48B9D8 100%)',
          left: '-70px',
          top: '155px',
          filter: 'blur(30px)',
        }}
        whileHover={{
          scale: [1, 1.1, 1, 1.05, 1],
          filter: [
            'blur(30px) brightness(1)',
            'blur(25px) brightness(1.3)',
            'blur(30px) brightness(1)',
            'blur(28px) brightness(1.2)',
            'blur(30px) brightness(1)'
          ]
        }}
        transition={{
          layout: { duration: 1.2 },
          default: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >

        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(65,217,255,0.6) 30%, transparent 70%)',
          }}
          whileHover={{
            scale: [1, 1.3, 1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3, 0.6, 0.3],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, transparent 0%, rgba(255,255,255,0.5) 20%, transparent 60%)',
          }}
          whileHover={{
            scale: [1, 1.4, 1, 1.25, 1],
            opacity: [0.2, 0.7, 0.2, 0.5, 0.2],
            transition: {
              duration: 2.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3
            }
          }}
        />
      </motion.div> */}

      {/* Logo - exact Figma positioning */}
      <motion.div
        layoutId='logo'
        transition={{ duration: 1.2 }}
        className="absolute z-50"
        style={{ 
          width: '96px',   // w-24 = 96px
          height: '36px',  // h-9 = 36px
          left: '157px', 
          top: '20px'
        }}
      >
        <img 
          src='/Vector.svg'
          alt="QUEST" 
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Header Text: "You'd be shocked to know, Harvard researchers suggest that" */}
      <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="absolute"
        style={{ 
          width: '384px',  // w-96 = 384px
          height: '48px',  // h-12 = 48px
          left: '15px', 
          top: '150px' 
        }}
      >
        <div 
          className="text-center"
          style={{ 
            color: '#FFFFFF', 
            fontSize: '20px',  // text-xl = 20px
            fontFamily: 'Gilroy-Regular', 
            fontWeight: 400, 
            wordWrap: 'break-word' 
          }}
        >
          You'd be shocked to know,<br/>Harvard researchers suggest that
        </div>
      </motion.div>

      {/* "95%" - exact Figma positioning */}
      <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="absolute"
        style={{ 
          width: '96px',   // w-24 = 96px
          height: '48px',  // h-12 = 48px
          left: '156px', 
          top: '250px' 
        }}
      >
        <div 
          className="text-center"
          style={{ 
            color: '#FFFFFF', 
            fontSize: '48px',  // text-5xl = 48px
            fontFamily: 'Gilroy-SemiBold', 
            fontWeight: '600', 
            wordWrap: 'break-word' 
          }}
        >
          95%
        </div>
      </motion.div>

      {/* Middle Text: "of people believe they are self-aware but only" */}
      <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="absolute"
        style={{ 
          width: '224px',  // w-56 = 224px
          height: '80px',  // h-20 = 80px
          left: '90px', 
          top: '300px' 
        }}
      >
        <div className="text-center">
          <span 
          style={{ 
            color: '#FFFFFF', 
            fontSize: '24px',  // text-2xl = 24px
            fontFamily: 'Gilroy-Regular', 
            fontWeight: 400 
          }}>
            of people believe<br/>they are 
          </span>
          <span style={{ 
            color: '#FFFFFF', 
            fontSize: '24px', 
            fontFamily: 'Gilroy-Bold', 
            fontWeight: 700,
            padding: '0 5px'
          }}>
            self-aware<br/>
          </span>
          <span style={{ 
            color: '#FFFFFF', 
            fontSize: '24px', 
            fontFamily: 'Gilroy-Regular', 
            fontWeight: 400 
          }}>
            but only
          </span>
        </div>
      </motion.div>

      {/* "10-15%" - exact Figma positioning */}
      <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="absolute"
        style={{ 
          width: '160px',  // w-40 = 160px
          height: '48px',  // h-12 = 48px
          left: '122px', 
          top: '430px' 
        }}
      >
        <div 
          className="text-center"
          style={{ 
            color: '#FFFFFF', 
            fontSize: '48px',  // text-5xl = 48px
            fontFamily: 'Gilroy-SemiBold', 
            fontWeight: '600', 
            wordWrap: 'break-word' 
          }}
        >
          10-15%
        </div>
      </motion.div>

      {/* "actually are" - exact Figma positioning */}
      <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="absolute"
        style={{ 
          width: '144px',  // w-36 = 144px
          height: '28px',  // h-7 = 28px
          left: '129px', 
          top: '480px' 
        }}
      >
        <div 
          className="text-center"
          style={{ 
            color: '#FFFFFF', 
            fontSize: '24px',  // text-2xl = 24px
            fontFamily: 'Gilroy-Regular', 
            fontWeight: 400, 
            wordWrap: 'break-word' 
          }}
        >
          actually are
        </div>
      </motion.div>

      {/* Down Arrow Icon - exact Figma positioning */}
      <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="absolute"
        style={{ 
          width: '80px',   // Increased for circular text
          height: '80px',  // Increased for circular text
          left: '160px',    // Adjusted to center the larger element
          top: '550px'      // Adjusted to center the larger element
        }}
      >
        <motion.button
          onClick={onContinueClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-full h-full relative"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          {/* Circular spinning text */}
          <motion.div 
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <img 
              src="/text.svg" 
              alt="Those who are" 
              className="w-full h-full"
            />
          </motion.div>
          
          {/* Central arrow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/arrow-down.svg" 
              alt="arrow down" 
              className="w-6 h-6"
            />
          </div>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default StatisticsSection;