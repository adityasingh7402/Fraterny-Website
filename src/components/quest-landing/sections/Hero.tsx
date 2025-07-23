// // /src/components/quest-landing/sections/Hero.tsx

// import React from 'react';
// import { motion } from 'framer-motion';
// import { Button } from '../common';
// import { colors, spacing, responsiveClasses } from '../styles';
// import { ChevronDown } from 'lucide-react';

// interface HeroProps {
//   onAnalyzeClick?: () => void;
//   onScreenTransition?: () => void;  // Add this line
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

// const Hero: React.FC<HeroProps> = ({ 
//   onAnalyzeClick, 
//   onScreenTransition,
//   className = ''
// }) => {
//   const handleAnalyzeClick = () => {
//     if (onAnalyzeClick) {
//       onAnalyzeClick();
//     }
//   };

//   return (
//     <section 
//       className={`relative w-screen min-h-screen overflow-hidden flex flex-col justify-start bg-[#FFFFFF] pt-10 md:pt-16 lg:pt-20 md:px-6 lg:px-8 pb-6 pl-4 ${className}`}
//     >
//       {/* Background Gradient with layoutId for morphing */}
//       {/* <motion.div 
//         layoutId='bg'
//         transition={{ duration: 0.5 }}
//         className='absolute z-10 w-[554px] h-[554px] rounded-full blur-xl'
//         style={{
//           background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
//           top: '400px',
//           left: '-76px',
//         }}
//       /> */}
//       {/* Down Arrow for Screen Transition */}
//       {/* <div className="absolute bottom-6 right-6 z-30">
//         <motion.button
//           onClick={onScreenTransition}
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
//         >
//           <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//             <path d="M7 13l3 3 3-3M7 6l3 3 3-3"/>
//           </svg>
//         </motion.button>
//       </div> */}
//       <div className="absolute bottom-6 right-6 z-30">
//         <motion.button
//             onClick={onScreenTransition}
//             variants={animationVariants}
//             initial="invisible"
//             animate="visible"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white/80 transition-colors"
//         >
//             <ChevronDown size={16} />
//         </motion.button>
//         </div>

//       <motion.div 
//         layoutId='bg'
//         transition={{ duration: 1.2 }}
//         className='absolute z-0 w-[554px] h-[554px] bg-radial from-40% from-blue-500 to-30% to-blue-300 flex top-[300px] left-[-76px] rounded-full blur-xl'
//         style={{
//           background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
//         }}
//       />

//       {/* Hero Content Container */}
//       <div className="relative z-20 max-w-xl">
        
//         {/* Greeting Text: "hi there," */}
//         <motion.div 
//           variants={animationVariants} 
//           initial="invisible" 
//           animate="visible"
//         >
//           <h1 className={`font-gilroy-regular text-[48px] md:text-[42px] lg:text-[54px] leading-none text-gray-900 m-0 mb-2`}>
//             hi there,
//           </h1>
//         </motion.div>

//         {/* Main Title: "I'm QUEST" with layoutId for logo morphing */}
        // <div className="flex items-center gap-2 mb-4">
        //   <motion.span 
        //     variants={animationVariants} 
        //     initial="invisible" 
        //     animate="visible"
        //     className={`text-[#7D7D7D] text-[72px] md:text-[60px] lg:text-[72px] leading-none tracking-tight`}
        //   >
        //     I'm 
        //   </motion.span>
          
        //   <motion.div
        //     layoutId='logo'
        //     transition={{ duration: 1.2 }}
        //     className="flex items-center"
        //   >
        //     <img 
        //       src="/Vector.svg" 
        //       alt="QUEST" 
        //       className="h-[72px] md:h-[60px] lg:h-[72px] w-auto"
        //     />
        //   </motion.div>
        // </div>

//         {/* Subtitle: "i can" */}
//         <motion.div 
//           variants={animationVariants} 
//           initial="invisible" 
//           animate="visible"
//           className='mt-10'
//         >
//           <p className={`text-[#7D7D7D] text-[36px] md:text-[30px] lg:text-[36px] font-normal leading-none m-0`}>
//             i can
//           </p>
//         </motion.div>

//         {/* Highlight: "Hack Your Brain" */}
//         <motion.div 
//           variants={animationVariants} 
//           initial="invisible" 
//           animate="visible"
//         >
//           <h2 className={`font-bold text-[40px] md:text-[34px] lg:text-[40px] leading-none text-black m-0 mb-2`}>
//             Hack Your Brain
//           </h2>
//         </motion.div>

//         {/* Closing: "in 15 minutes." */}
//         <motion.div 
//           variants={animationVariants} 
//           initial="invisible" 
//           animate="visible"
//         >
//           <p className={`text-[#7D7D7D] text-[36px] md:text-[30px] lg:text-[36px] font-normal leading-none m-0 mb-8`}>
//             in 15 minutes.
//           </p>
//         </motion.div>

//         {/* Call-to-Action Button */}
//         <motion.div 
//           variants={animationVariants} 
//           initial="invisible" 
//           animate="visible"
//           className="relative mt-10"
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
//       </div>
//     </section>
//   );
// };

// export default Hero;


// /src/components/quest-landing/sections/Hero.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../common';
import { colors, spacing, responsiveClasses } from '../styles';
import { ChevronDown } from 'lucide-react';
import img from '../../../../public/Vector.svg';

interface HeroProps {
  onAnalyzeClick?: () => void;
  onScreenTransition?: () => void;
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
      className={`w-full min-h-screen relative bg-white z-50`}
    >

      <motion.div 
        layoutId='bg'
        transition={{ duration: 1.2 }}
        className='absolute z-0 w-[554px] h-[554px] rounded-full'
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 51%, #48B9D8 100%)',
          left: '-70px',    // Changed from -70px to -20px (only 20px cut off)
          top: '54.46%',
          filter: 'blur(30px)',
          boxShadow: '60px 60px 60px rgba(0, 0, 0, 0.1)',
        }}
      />

      <div className="absolute bottom-6 right-6 z-30">
        <motion.button
            onClick={onScreenTransition}
            variants={animationVariants}
            initial="invisible"
            animate="visible"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white/80 transition-colors"
        >
            <ChevronDown size={16} />
        </motion.button>
      </div>

   
      
        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="absolute"
          style={{ left: '21px', top: '13.39%' }}
        >
          <div style={{ color: '#0A0A0A', fontSize: '48px', fontFamily: 'Gilroy-Regular', fontWeight: '400', wordWrap: 'break-word' }}>
            hi there,
          </div>
        </motion.div>


        {/* "I'm" text - absolute positioning */}
        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="absolute"
          style={{ 
            left: '5.21%',    // 20px / 384px = 5.21%
            top: '19.68%'     // 172px / 874px = 19.68%
          }}
        >
          <span style={{ 
            
            color: '#7C7C7C', 
            fontSize: '72px', 
            fontFamily: 'Gilroy-Bold', 
            fontWeight: 400, 
            wordWrap: 'break-word' 
          }}>
            I'm
          </span>
        </motion.div>

        {/* QUEST Logo - absolute positioning */}
        <motion.div
          layoutId='logo'
          transition={{ duration: 1.2 }}
          className="absolute"
          style={{ 
            width: '176px',   // w-44 = 176px
            height: '115px',   // h-20 = 80px
            left: '33.59%',   // 129px / 384px = 33.59%
            top: '23.5%',    // 186px / 874px = 21.28% 
          }}
        >
          <img 
            src={img} 
            alt="QUEST" 
            className="w-[190px] h-[85px] object-contain"
          />
        </motion.div>

        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="absolute"
          style={{ left: '22px', top: '323px' }}
        >
          <span style={{ color: '#0A0A0A', fontSize: '36px', fontFamily: 'Gilroy-Regular', fontWeight: 400, wordWrap: 'break-word' }}>
            i can
          </span>
        </motion.div>


        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="absolute"
          style={{ left: '21px', top: '364px' }}
        >
          <div style={{ color: '#0A0A0A', fontSize: '40px', fontFamily: 'Gilroy-Bold', fontWeight: '400', wordWrap: 'break-word' }}>
            Hack Your Brain
          </div>
        </motion.div>

        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="absolute"
          style={{ left: '22px', top: '414px' }}
        >
          <div style={{ color: '#0A0A0A', fontSize: '36px', fontFamily: 'Gilroy-Regular', fontWeight: 400, wordWrap: 'break-word' }}>
            in 15 minutes.
          </div>
        </motion.div>


        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="absolute"
          style={{ 
            width: '160px', 
            height: '60px', 
            left: '25px', 
            top: '576px', 
            mixBlendMode: 'luminosity', 
            background: 'linear-gradient(133deg, rgba(254, 254, 254, 0.15) 0%, rgba(254, 254, 254, 0.15) 100%)', 
            borderRadius: '30px', 
            border: '2px #FEFEFE solid' 
          }}
        >
          <motion.button
            onClick={handleAnalyzeClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              width: '100%', 
              height: '100%', 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="tracking-tighter" style={{ left: '50px', top: '591px', color: '#FEFEFE', fontSize: '24px', fontFamily: 'Gilroy-Bold', fontWeight: '400', wordWrap: 'break-word', }}>
              <span style={{ letterSpacing: '-1.92%' }}>
                Analyse Me
              </span>
            </div>
          </motion.button>
        </motion.div>

    </section>
   
  );
};

export default Hero;