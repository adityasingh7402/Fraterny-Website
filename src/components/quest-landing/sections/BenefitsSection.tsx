// // /src/components/quest-landing/sections/BenefitsSection.tsx

// import React from 'react';
// import { motion } from 'framer-motion';
// import { Menu } from 'lucide-react';
// import { ChevronDown } from 'lucide-react';

// interface BenefitsSectionProps {
//   animationState: string;
//   className?: string;
//   onScreenTransition?: () => void;
// }

// // Simple animation variants
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


// const BenefitsSection: React.FC<BenefitsSectionProps> = ({ 
//   animationState,
//   className = '' ,
//   onScreenTransition
// }) => {
//   return (
//     <section 
//       className={`relative w-screen min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 lg:px-8 ${className}`}
//     >
//       {/* Background Gradient with same layoutId for morphing */}
//       <motion.div 
//         layoutId='bg'
//         transition={{ duration: 1.2 }}
//         className='absolute z-0 w-[1000px] h-[800px] bg-[#004A7F] flex top-[1/2] left-[1/2] translateY-[-50%] rounded-full blur-xl'
//         style={{
//           background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
//           backdropFilter: 'blur(180px)',
//         }}
//       />

//       {/* Header with Logo */}
//       <div className='flex justify-between fixed top-0 w-full z-50 p-2 left-0 text-white items-center'>
//         <div className='flex-1 items-center justify-center'>
//           <motion.div 
//             layoutId='logo'
//             transition={{ duration: 1.2 }}
//             className='flex text-white mx-auto flex-col gap-0 items-center justify-center w-fit'
//           >
//             <img 
//               src="/Vector.svg" 
//               alt="QUEST" 
//               className="h-[32px] w-auto brightness-0 invert"
//             />
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

//       {/* Benefits Content */}
//       <div className="flex flex-col items-start justify-center w-full h-full">
//         <motion.div
//         variants={animationVariants}
//         initial="invisible"
//         animate="visible"
//         className="relative z-20 flex-col gap-16 flex text-white pt-2"
//         >
//         {/* Benefit 1 */}
//         <div className="relative">
//         <div className="text-left font-bold text-[36px] leading-none mb-4"
//             style={{ 
//             fontFamily: 'Gilroy-Bold',
//             fontWeight: 400,
//             fontSize: '36px',
//             lineHeight: '100%',
//             letterSpacing: '0%',
//             color: '#FEFEFE'
//             }}
//         >
//             <p>Are more</p>
//             <p>effective leaders.</p>
//         </div>
        
//         <div 
//             className="absolute bottom-5 left-72 text-white font-bold text-[48px] leading-none"
//             style={{ 
//             fontFamily: 'Gilroy-Regular',
//             fontWeight: 400,
//             fontSize: '24px',
//             color: '#FEFEFE'
//             }}
//         >
//             1
//         </div>
        
//         <div 
//             className="w-full h-[2px] bg-white mt-4"
//             style={{ backgroundColor: '#FEFEFE' }}
//         />
//         </div>

//         {/* Benefit 2 */}
//         <div className="relative">
//         <div className="text-left font-bold text-[36px] leading-none mb-4"
//             style={{ 
//             fontFamily: 'Gilroy-Bold',
//             fontWeight: 400,
//             fontSize: '36px',
//             lineHeight: '100%',
//             letterSpacing: '0%',
//             color: '#FEFEFE'
//             }}
//         >
//             <p>Perform better</p>
//             <p>at work.</p>
//         </div>
        
//         <div 
//             className="absolute bottom-5 left-72 text-white font-bold text-[48px] leading-none"
//             style={{ 
//             fontFamily: 'Gilroy-Regular',
//             fontWeight: 400,
//             fontSize: '24px',
//             color: '#FEFEFE'
//             }}
//         >
//             2
//         </div>
        
//         <div 
//             className="w-full h-[2px] bg-white mt-4"
//             style={{ backgroundColor: '#FEFEFE' }}
//         />
//         </div>

//         {/* Benefit 3 */}
//         <div className="relative">
//         <div className="text-left font-bold text-[36px] leading-none mb-4"
//             style={{ 
//             fontFamily: 'Gilroy-Bold',
//             fontWeight: 400,
//             fontSize: '36px',
//             lineHeight: '100%',
//             letterSpacing: '0%',
//             color: '#FEFEFE'
//             }}
//         >
//             <p>Are more</p>
//             <p>confident.</p>
//         </div>
        
//         <div 
//             className="absolute bottom-5 left-72 text-white font-bold text-[48px] leading-none"
//             style={{ 
//             fontFamily: 'Gilroy-Regular',
//             fontWeight: 400,
//             fontSize: '24px',
//             color: '#FEFEFE'
//             }}
//         >
//             3
//         </div>
        
//         <div 
//             className="w-full h-[2px] bg-white mt-4"
//             style={{ backgroundColor: '#FEFEFE' }}
//         />
//         </div>
//         </motion.div>
//       </div>

//       {/* Down Arrow for Screen Transition */}
//         <div className="absolute bottom-6 right-6 z-30">
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
//     </section>
//   );
// };

// export default BenefitsSection;



// /src/components/quest-landing/sections/BenefitsSection.tsx

// import React from 'react';
// import { motion } from 'framer-motion';
// import { Menu } from 'lucide-react';
// import { ChevronDown } from 'lucide-react';
// import img from '../../../../public/Vector.svg';

// interface BenefitsSectionProps {
//   animationState: string;
//   className?: string;
//   onScreenTransition?: () => void;
// }

// // Simple animation variants
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

// const BenefitsSection: React.FC<BenefitsSectionProps> = ({ 
//   animationState,
//   className = '',
//   onScreenTransition
// }) => {
//   return (
//     <section 
//       className="w-full min-h-screen relative bg-white"
//     >
//       {/* Background Gradient - Figma specifications */}
//       <motion.div 
//         layoutId='bg'
//         transition={{ duration: 1.2 }}
//         className='absolute z-0 rounded-full'
//         style={{
//           width: '952px',
//           height: '952px',
//           background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 51%, #48B9D8 100%)',
//           filter: 'blur(30px)',
//           left: '-269px',
//           top: '-39px',
//           transform: 'translate(-50%, -50%)'
//         }}
//       />

//       {/* Logo - Header positioning */}
//       <motion.div
//         layoutId='logo'
//         transition={{ duration: 1.2 }}
//         className="absolute z-50"
//         style={{ 
//           left: '157px',
//           top: '30px',
//           transform: 'translateX(-50%)'
//         }}
//       >
//         <img 
//           src={img}
//           alt="QUEST" 
//           className="h-8 w-auto brightness-0 invert"
//         />
//       </motion.div>

//       {/* Menu Icon - top right */}
//       <motion.div 
//         variants={animationVariants} 
//         initial="invisible" 
//         animate="visible"
//         className="absolute z-50"
//         style={{ right: '20px', top: '30px' }}
//       >
//         <Menu size={24} color="#FFFFFF" />
//       </motion.div>

//       {/* Benefits Content Container */}
//       <div className="absolute inset-0 z-20 flex flex-col justify-center items-start px-6" style={{ paddingTop: '120px' }}>
        
//         {/* Benefit 1: "Are more effective leaders." */}
//         <motion.div
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           className="w-full flex items-center justify-between mb-16"
//         >
//           <div className="flex items-center">
//             <div 
//               style={{ 
//                 width: '288px',  // w-72 = 288px
//                 height: '80px',  // h-20 = 80px
//                 color: '#FFFFFF', 
//                 fontSize: '36px',  // text-4xl = 36px
//                 fontFamily: 'Gilroy-Bold', 
//                 fontWeight: '400',
//                 top: '202px',
//                 left: '25px'
//               }}
//             >
//               Are more <br /> effective leaders.
//             </div>
//           </div>
//           <div 
//             style={{ 
//               width: '28px',   // w-7 = 28px
//               height: '32px',  // h-8 = 32px
//               color: '#FFFFFF', 
//               fontSize: '24px',  // text-2xl = 24px
//               fontFamily: 'Gilroy-Regular', 
//               fontWeight: 400,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               top: '202px',
//               left: '25px'
//             }}
//           >
//             1
//           </div>
//         </motion.div>

//         {/* Separator Line 1 */}
//         <div className="w-full h-[1px] bg-white mb-16" style={{ backgroundColor: '#FFFFFF' }} />

//         {/* Benefit 2: "Perform better at work." */}
//         <motion.div
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           className="w-full flex items-center justify-between mb-16"
//         >
//           <div className="flex items-center">
//             <div 
//               style={{ 
//                 width: '240px',  // w-60 = 240px
//                 height: '80px',  // h-20 = 80px
//                 color: '#FFFFFF', 
//                 fontSize: '36px',  // text-4xl = 36px
//                 fontFamily: 'Gilroy-Bold', 
//                 fontWeight: 400,
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               Perform better at work.
//             </div>
//           </div>
//           <div 
//             style={{ 
//               width: '28px',   // w-7 = 28px
//               height: '32px',  // h-8 = 32px
//               color: '#FFFFFF', 
//               fontSize: '24px',  // text-2xl = 24px
//               fontFamily: 'Gilroy-Regular', 
//               fontWeight: 400,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}
//           >
//             2
//           </div>
//         </motion.div>

//         {/* Separator Line 2 */}
//         <div className="w-full h-[1px] bg-white mb-16" style={{ backgroundColor: '#FFFFFF' }} />

//         {/* Benefit 3: "Are more confident." */}
//         <motion.div
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           className="w-full flex items-center justify-between mb-16"
//         >
//           <div className="flex items-center">
//             <div 
//               style={{ 
//                 width: '240px',  // w-60 = 240px
//                 height: '80px',  // h-20 = 80px
//                 color: '#FFFFFF', 
//                 fontSize: '36px',  // text-4xl = 36px
//                 fontFamily: 'Gilroy-Bold', 
//                 fontWeight: 400,
//                 display: 'flex',
//                 alignItems: 'center'
//               }}
//             >
//               Are more confident.
//             </div>
//           </div>
//           <div 
//             style={{ 
//               width: '28px',   // w-7 = 28px
//               height: '32px',  // h-8 = 32px
//               color: '#FFFFFF', 
//               fontSize: '24px',  // text-2xl = 24px
//               fontFamily: 'Gilroy-Regular', 
//               fontWeight: 400,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center'
//             }}
//           >
//             3
//           </div>
//         </motion.div>

//         {/* Final Separator Line */}
//         <div className="w-full h-[1px] bg-white" style={{ backgroundColor: '#FFFFFF' }} />

//       </div>

//       {/* Down Arrow for Screen Transition */}
//       <div className="absolute bottom-6 right-6 z-30">
//         <motion.button
//           onClick={onScreenTransition}
//           variants={animationVariants}
//           initial="invisible"
//           animate="visible"
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.9 }}
//           className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white/80 transition-colors"
//         >
//           <ChevronDown size={16} />
//         </motion.button>
//       </div>
//     </section>
//   );
// };

// export default BenefitsSection;



// /src/components/quest-landing/sections/BenefitsSection.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import img from '../../../../public/Vector.svg';

interface BenefitsSectionProps {
  animationState: string;
  className?: string;
  onScreenTransition?: () => void;
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

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ 
  animationState,
  className = '',
  onScreenTransition
}) => {
  return (
    <section 
      className="w-full min-h-screen relative bg-white"
    >
      {/* Background Gradient - Exact Figma positioning */}
      <motion.div 
        layoutId='bg'
        transition={{ duration: 1.2 }}
        className='absolute z-0 rounded-full'
        style={{
          width: '952px',
          height: '952px',
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 51%, #48B9D8 100%)',
          filter: 'blur(30px)',
          left: '-269px',
          top: '-39px'
        }}
      />

      {/* Logo - Header positioning */}
      <motion.div
        layoutId='logo'
        transition={{ duration: 1.2 }}
        className="absolute z-50"
        style={{ 
          left: '157px',
          top: '30px',
          transform: 'translateX(-50%)'
        }}
      >
        <img 
          src={img}
          alt="QUEST" 
          className="h-[36px] w-auto brightness-0 invert"
        />
      </motion.div>

      {/* Menu Icon - top right */}
      <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="absolute z-50"
        style={{ right: '20px', top: '30px' }}
      >
        <Menu size={36} color="#FFFFFF" />
      </motion.div>

      {/* Benefit 1: "Are more effective leaders." */}
      <motion.div
        variants={animationVariants}
        initial="invisible"
        animate="visible"
        className="absolute z-20"
        style={{ left: '25px', top: '152px' }}
      >
        <div 
          style={{ 
            width: '288px',  // w-72 = 288px
            height: '80px',  // h-20 = 80px
            color: '#FFFFFF', 
            fontSize: '36px',  // text-4xl = 36px
            fontFamily: 'Gilroy-Bold', 
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            lineHeight: '1',
          }}
        >
          Are more effective leaders.
        </div>
      </motion.div>

      {/* Number 1 */}
      <motion.div
        variants={animationVariants}
        initial="invisible"
        animate="visible"
        className="absolute z-20"
        style={{ right: '25px', top: '198px' }}
      >
        <div 
          style={{ 
            width: '28px',   // w-7 = 28px
            height: '32px',  // h-8 = 32px
            color: '#FFFFFF', 
            fontSize: '24px',  // text-2xl = 24px
            fontFamily: 'Gilroy-Regular', 
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          1
        </div>
      </motion.div>

      {/* Separator Line 1 */}
      <div 
        className="absolute z-20"
        style={{ 
          left: '25px', 
          right: '25px', 
          top: '235px',
          height: '1px',
          backgroundColor: '#FFFFFF' 
        }} 
      />

      {/* Benefit 2: "Perform better at work." */}
      <motion.div
        variants={animationVariants}
        initial="invisible"
        animate="visible"
        className="absolute z-20"
        style={{ left: '25px', top: '310px' }}
      >
        <div 
          style={{ 
            width: '240px',  // w-60 = 240px
            height: '80px',  // h-20 = 80px
            color: '#FFFFFF', 
            fontSize: '36px',  // text-4xl = 36px
            fontFamily: 'Gilroy-Bold', 
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            lineHeight: '1',
          }}
        >
          Perform better at work.
        </div>
      </motion.div>

      {/* Number 2 */}
      <motion.div
        variants={animationVariants}
        initial="invisible"
        animate="visible"
        className="absolute z-20"
        style={{ right: '25px', top: '358px' }}
      >
        <div 
          style={{ 
            width: '28px',   // w-7 = 28px
            height: '32px',  // h-8 = 32px
            color: '#FFFFFF', 
            fontSize: '24px',  // text-2xl = 24px
            fontFamily: 'Gilroy-Regular', 
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          2
        </div>
      </motion.div>

      {/* Separator Line 2 */}
      <div 
        className="absolute z-20"
        style={{ 
          left: '25px', 
          right: '25px', 
          top: '395px',
          height: '1px',
          backgroundColor: '#FFFFFF' 
        }} 
      />

      {/* Benefit 3: "Are more confident." */}
      <motion.div
        variants={animationVariants}
        initial="invisible"
        animate="visible"
        className="absolute z-20"
        style={{ left: '25px', top: '470px' }}
      >
        <div 
          style={{ 
            width: '240px',  // w-60 = 240px
            height: '80px',  // h-20 = 80px
            color: '#FFFFFF', 
            fontSize: '36px',  // text-4xl = 36px
            fontFamily: 'Gilroy-Bold', 
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            lineHeight: '1',
          }}
        >
          Are more confident.
        </div>
      </motion.div>

      {/* Number 3 */}
      <motion.div
        variants={animationVariants}
        initial="invisible"
        animate="visible"
        className="absolute z-20"
        style={{ right: '25px', top: '520px' }}
      >
        <div 
          style={{ 
            width: '28px',   // w-7 = 28px
            height: '32px',  // h-8 = 32px
            color: '#FFFFFF', 
            fontSize: '24px',  // text-2xl = 24px
            fontFamily: 'Gilroy-Regular', 
            fontWeight: '400',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          3
        </div>
      </motion.div>

      {/* Final Separator Line */}
      <div 
        className="absolute z-20"
        style={{ 
          left: '25px', 
          right: '25px', 
          top: '555px',
          height: '1px',
          backgroundColor: '#FFFFFF' 
        }} 
      />

      {/* Down Arrow for Screen Transition */}
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
    </section>
  );
};

export default BenefitsSection;