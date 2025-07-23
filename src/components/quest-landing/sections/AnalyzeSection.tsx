// /src/components/quest-landing/sections/AnalyzeSection.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Change from './Change';
import Testimonials from './Testimonials';
import FAQ from '@/pages/FAQ';
import FaqSection from './FaqSection';

interface AnalyzeSectionProps {
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

const AnalyzeSection: React.FC<AnalyzeSectionProps> = ({ 
   animationState: _animationState,
    className = '',
  onScreenTransition: _onScreenTransition
}) => {
  return (
    <div className='relative h-full overflow-y-scroll'>
      {/* Header */}
        <div className='flex justify-between fixed top-0 w-full z-50 p-2 left-0 text-white items-center'>
            <div className='flex-1 items-center justify-center'>
            <motion.div 
                layoutId='logo'
                transition={{ duration: 1.2 }}
                className='flex text-white mx-auto flex-col gap-0 items-center justify-center w-fit'
            >
                <img 
                src="/Vector.svg" 
                alt="QUEST" 
                className="h-[36px] w-[89px] brightness-0 invert ml-8"
                />
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

      {/* Hero section */}
      <div className='max-h-400 relative bg-[#004A7F] overflow-hidden gap-7 text-white w-full p-4 py-20'>
        <div className='gap-8 flex relative flex-col z-20'>
          {/* Main Title */}
          <div className='w-[140px] text-left'>
            <motion.p 
              variants={animationVariants} 
              initial="invisible" 
              animate="visible"
              className='pb-[10px]'
              style={{
                fontFamily: 'Gilroy-medium',
                fontSize: '40px',
                fontWeight: 100,
                lineHeight: '49px',
              }}
            >
              What I will do?
            </motion.p>
            <div className='border-b-2 border-white ml-1' />
          </div>
          
          {/* Description */}
          <p className='pt-8' style={{ fontFamily: 'Gilroy-Regular', fontSize: '20px', fontWeight: 400 }}>
            I will decode your hidden...
          </p>
          
          {/* Pills */}
          <motion.div 
            variants={animationVariants} 
            initial="invisible" 
            animate="visible"
            className='flex flex-wrap gap-2'
          >
            {['Motivations', 'Ambitions', 'Patterns', 'Triggers', 'Fears'].map((item, i) => (
              <div 
                key={i}
                className="px-4 py-2 rounded-full border-2 border-white bg-white/10 text-white"
                style={{ fontFamily: 'Gilroy-Bold', fontSize: '20px', fontWeight: 400 }}
              >
                {item}
              </div>
            ))}
          </motion.div>
          
          {/* Understanding text */}
          <p style={{ fontFamily: 'Gilroy-Regular', fontSize: '20px', fontWeight: 400 }}>
            So you'll finally understand:
          </p>
          
          {/* Questions list */}
          <motion.div 
            variants={animationVariants} 
            initial="invisible" 
            animate="visible"
            className='flex flex-col gap-6'
          >
            {[
              'How you really think?',
              "What's standing in your way?", 
              'How the world actually sees you?',
              'What could truly change your life?'
            ].map((question, i) => (
              <div key={i} className="relative flex items-center justify-between">
                <p 
                  className="text-white font-bold pb-5"
                  style={{
                    fontFamily: 'Gilroy-Bold',
                    fontSize: '20px',
                    lineHeight: '100%',
                    fontWeight: 400
                  }}
                >
                  {question}
                </p>
                <span 
                  className="font-normal ml-4"
                  style={{ fontFamily: 'Gilroy-Regular', fontSize: '14px', fontWeight: 400 }}
                >
                  {i + 1}
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white mt-2" />
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Background Gradient */}
        <motion.div 
          layoutId='bg'
          transition={{ duration: 0.8 }}
          className='absolute z-10 w-[554px] h-[554px] bg-radial from-10% from-[#48B9D8] via-80% to-40% via-[#41D9FF] to-[#0C45F0] flex bottom-0 top-[45px] left-[51px] translate-x-1/2 rounded-full blur-[80px]'
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
            backdropFilter: 'blur(180px)',
          }}
        />
      </div>
       <Change />
       <Testimonials />
       <FaqSection />   
    </div>
    
  );
};

export default AnalyzeSection;

// import React from 'react';
// import { motion } from 'framer-motion';
// import { Menu } from 'lucide-react';
// import Change from './Change';
// import Testimonials from './Testimonials';
// import FaqSection from './FaqSection';

// interface AnalyzeSectionProps {
//   animationState: string;
//   className?: string;
//   onScreenTransition?: () => void;
// }

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

// const AnalyzeSection: React.FC<AnalyzeSectionProps> = ({ 
//   animationState: _animationState,
//   className = '',
//   onScreenTransition: _onScreenTransition
// }) => {
//   return (
//     <div className={`w-96 h-[3688px] relative bg-white ${className}`}>
//       {/* Blue background sections */}
//       <div className="w-96 h-[1017px] absolute left-0 top-[2141px] bg-sky-800" />
//       <div className="w-96 h-[824px] absolute left-0 top-0 bg-sky-800" />
      
//       {/* Background gradient blur */}
//       <motion.div 
//         layoutId='bg'
//         transition={{ duration: 1.2 }}
//         className="w-[554px] h-[554px] absolute left-[51px] top-[45px] rounded-full blur-[90px]"
//         style={{
//           background: 'radial-gradient(ellipse 50.00% 50.00% at 50.00% 50.00%, #0C45F0 0%, #41D9FF 51%, #48B9D8 100%)'
//         }}
//       />
      
//       {/* Logo placeholder */}
//       <motion.div 
//         layoutId='logo'
//         transition={{ duration: 1.2 }}
//         className="w-24 h-9 absolute left-[157.23px] top-[30px]"
//       >
//         <img 
//           src="/Vector.svg" 
//           alt="QUEST" 
//           className="w-full h-auto brightness-0 invert"
//         />
//       </motion.div>

//       <motion.div 
//         variants={animationVariants} 
//         initial="invisible" 
//         animate="visible"
//         className="absolute z-50"
//         style={{ right: '20px', top: '30px' }}
//       >
//         <Menu size={24} color="#FFFFFF" />
//       </motion.div>
      
//       {/* Main title "What I will do?" */}
//       <div 
//         className="w-36 h-24 absolute left-[20px] top-[144px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Medium',
//           fontSize: '40px',
//           fontWeight: '400',
//           lineHeight: '100%'
//         }}
//       >
//         What I<br/>will do?
//       </div>
      
//       {/* Title underline */}
//       <div className="w-36 h-0 absolute left-[20px] top-[250px] border-t-2 border-white"></div>
      
//       {/* "I will decode your hidden..." text */}
//       <div 
//         className="w-96 h-7 absolute left-[20px] top-[281px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Regular',
//           fontSize: '20px',
//           fontWeight: '400',
//           lineHeight: '100%'
//         }}
//       >
//         I will decode your hidden...
//       </div>
      
//       {/* Pills/Tags */}
//       {/* Motivations */}
//       <div className="w-32 h-10 absolute left-[20px] top-[323px] bg-white/20 rounded-[30px] border border-white mix-blend-luminosity" />
//       <div 
//         className="absolute left-[37px] top-[331px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Bold',
//           fontSize: '20px',
//           fontWeight: '400',
//           lineHeight: '100%'
//         }}
//       >
//         Motivations
//       </div>
      
//       {/* Patterns */}
//       <div className="w-24 h-10 absolute left-[20px] top-[372px] bg-white/20 rounded-[30px] border border-white mix-blend-luminosity" />
//       <div 
//         className="absolute left-[37px] top-[380px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Bold',
//           fontSize: '20px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         Patterns
//       </div>
      
//       {/* Ambitions */}
//       <div className="w-28 h-10 absolute left-[154px] top-[323px] bg-white/20 rounded-[30px] border border-white mix-blend-luminosity" />
//       <div 
//         className="absolute left-[171px] top-[331px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Bold',
//           fontSize: '20px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         Ambitions
//       </div>
      
//       {/* Triggers */}
//       <div className="w-24 h-10 absolute left-[128px] top-[372px] bg-white/20 rounded-[30px] border border-white mix-blend-luminosity" />
//       <div 
//         className="absolute left-[145px] top-[380px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Bold',
//           fontSize: '20px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         Triggers
//       </div>
      
//       {/* Fears */}
//       <div className="w-20 h-10 absolute left-[234px] top-[372px] bg-white/20 rounded-[30px] border border-white mix-blend-luminosity" />
//       <div 
//         className="absolute left-[252px] top-[380px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Bold',
//           fontSize: '20px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         Fears
//       </div>
      
//       {/* "So you'll finally understand:" text */}
//       <div 
//         className="w-96 h-7 absolute left-[20px] top-[457px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Regular',
//           fontSize: '20px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         So you'll finally understand:
//       </div>
      
//       {/* Questions section */}
//       {/* Question 1 */}
//       <div className="w-96 h-0 absolute left-[20px] top-[539px] border-t border-white"></div>
//       <div 
//         className="absolute left-[20px] top-[512px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Bold',
//           fontSize: '20px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         How you really think?
//       </div>
//       <div 
//         className="w-3 h-4 absolute left-[372px] top-[518px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Regular',
//           fontSize: '14px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         1
//       </div>
      
//       {/* Question 2 */}
//       <div className="w-96 h-0 absolute left-[20px] top-[594px] border-t border-white"></div>
//       <div 
//         className="absolute left-[20px] top-[567px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Bold',
//           fontSize: '20px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         What's standing in your way?
//       </div>
//       <div 
//         className="w-3 h-4 absolute left-[371px] top-[573px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Regular',
//           fontSize: '14px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         2
//       </div>
      
//       {/* Question 3 */}
//       <div className="w-96 h-0 absolute left-[20px] top-[649px] border-t border-white"></div>
//       <div 
//         className="absolute left-[20px] top-[622px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Bold',
//           fontSize: '20px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         How the world actually sees you?
//       </div>
//       <div 
//         className="w-3 h-4 absolute left-[371px] top-[628px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Regular',
//           fontSize: '14px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         3
//       </div>
      
//       {/* Question 4 */}
//       <div className="w-96 h-0 absolute left-[20px] top-[704px] border-t border-white"></div>
//       <div 
//         className="absolute left-[20px] top-[677px] text-white"
//         style={{
//           fontFamily: 'Gilroy-Bold',
//           fontSize: '20px',
//           fontWeight: 400,
//           lineHeight: '100%'
//         }}
//       >
//         What could truly change your life?
//       </div>
//       <Change />
//       <Testimonials />
//       <FaqSection />
//      </div>
//   );
// };

// export default AnalyzeSection;