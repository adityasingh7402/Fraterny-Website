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
    // <div className='relative h-full overflow-y-scroll'>
    //   {/* Header */}
    //     <div className='flex justify-between fixed top-0 w-full z-50 p-2 left-0 text-white items-center'>
    //         <div className='flex-1 items-center justify-center'>
    //         <motion.div 
    //             layoutId='logo'
    //             transition={{ duration: 1.2 }}
    //             className='flex text-white mx-auto flex-col gap-0 items-center justify-center w-fit'
    //         >
    //             <img 
    //             src="/Vector.svg" 
    //             alt="QUEST" 
    //             className="h-[36px] w-[89px] brightness-0 invert ml-8"
    //             />
    //         </motion.div>
    //         </div>
    //         <motion.span 
    //         variants={animationVariants} 
    //         initial="invisible" 
    //         animate="visible"
    //         >
    //         <Menu/>
    //         </motion.span>
    //     </div>   

    //   {/* Hero section */}
    //   <div className='max-h-400 relative bg-[#004A7F] overflow-hidden gap-7 text-white w-full p-4 py-20'>
    //     <div className='gap-8 flex relative flex-col z-20'>
    //       {/* Main Title */}
    //       <div className='w-[140px] text-left'>
    //         <motion.p 
    //           variants={animationVariants} 
    //           initial="invisible" 
    //           animate="visible"
    //           className='pb-[10px]'
    //           style={{
    //             fontFamily: 'Gilroy-medium',
    //             fontSize: '40px',
    //             fontWeight: 100,
    //             lineHeight: '49px',
    //           }}
    //         >
    //           What I will do?
    //         </motion.p>
    //         <div className='border-b-2 border-white ml-1' />
    //       </div>
          
    //       {/* Description */}
    //       <p className='pt-8' style={{ fontFamily: 'Gilroy-Regular', fontSize: '20px', fontWeight: 400 }}>
    //         I will decode your hidden...
    //       </p>
          
    //       {/* Pills */}
    //       <motion.div 
    //         variants={animationVariants} 
    //         initial="invisible" 
    //         animate="visible"
    //         className='flex flex-wrap gap-2'
    //       >
    //         {['Motivations', 'Ambitions', 'Patterns', 'Triggers', 'Fears'].map((item, i) => (
    //           <div 
    //             key={i}
    //             className="px-4 py-2 rounded-full border-2 border-white bg-white/10 text-white"
    //             style={{ fontFamily: 'Gilroy-Bold', fontSize: '20px', fontWeight: 400 }}
    //           >
    //             {item}
    //           </div>
    //         ))}
    //       </motion.div>
          
    //       {/* Understanding text */}
    //       <p style={{ fontFamily: 'Gilroy-Regular', fontSize: '20px', fontWeight: 400 }}>
    //         So you'll finally understand:
    //       </p>
          
    //       {/* Questions list */}
    //       <motion.div 
    //         variants={animationVariants} 
    //         initial="invisible" 
    //         animate="visible"
    //         className='flex flex-col gap-6'
    //       >
    //         {[
    //           'How you really think?',
    //           "What's standing in your way?", 
    //           'How the world actually sees you?',
    //           'What could truly change your life?'
    //         ].map((question, i) => (
    //           <div key={i} className="relative flex items-center justify-between">
    //             <p 
    //               className="text-white font-bold pb-5"
    //               style={{
    //                 fontFamily: 'Gilroy-Bold',
    //                 fontSize: '20px',
    //                 lineHeight: '100%',
    //                 fontWeight: 400
    //               }}
    //             >
    //               {question}
    //             </p>
    //             <span 
    //               className="font-normal ml-4"
    //               style={{ fontFamily: 'Gilroy-Regular', fontSize: '14px', fontWeight: 400 }}
    //             >
    //               {i + 1}
    //             </span>
    //             <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white mt-2" />
    //           </div>
    //         ))}
    //       </motion.div>
    //     </div>
        
    //     {/* Background Gradient */}
    //     <motion.div 
    //       layoutId='bg'
    //       transition={{ duration: 0.8 }}
    //       className='absolute z-10 w-[554px] h-[554px] bg-radial from-10% from-[#48B9D8] via-80% to-40% via-[#41D9FF] to-[#0C45F0] flex bottom-0 top-[45px] left-[51px] translate-x-1/2 rounded-full blur-[80px]'
    //       style={{
    //         background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
    //         backdropFilter: 'blur(180px)',
    //       }}
    //     />
    //   </div>
    //    <Change />
    //    <Testimonials />
    //    <FaqSection />   
    // </div>

    <section className='relative h-full overflow-y-scroll'>

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
                  className="text-white font-bold pb-3"
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
                  className="font-normal ml-4 mb-3"
                  style={{ fontFamily: 'Gilroy-Regular', fontSize: '14px', fontWeight: 400 }}
                >
                  {i + 1}
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white" />
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




      

    </div>
    </section>
    
  );
};

export default AnalyzeSection;




{/* <div className='flex flex-col h-auto relative bg-[#004A7F] overflow-hidden gap-7 text-white w-full p-4 py-20'>
        <div>
          <div className='text-left'>
            <motion.div 
              variants={animationVariants} 
              initial="invisible" 
              animate="visible"
              className="justify-start text-white text-4xl font-normal font-['Gilroy-Medium']">What I<br/>will do?</motion.div>
            <motion.div 
            variants={animationVariants} 
              initial="invisible" 
              animate="visible"
            className='border-b-2 border-white ml-1 mt-3' ></motion.div>

          </div>
        </div>

        <div>
          <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="w-96 h-7 justify-start text-white text-xl font-normal font-['Gilroy-Regular']">I will decode your hidden...</motion.div>
        </div>

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

        <div>

        </div>


      </div> */}