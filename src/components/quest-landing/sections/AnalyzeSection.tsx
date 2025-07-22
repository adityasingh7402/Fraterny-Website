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
                className="h-[32px] w-auto brightness-0 invert"
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
          <div className='w-1/2 text-left border-b-2 border-white'>
            <motion.p 
              variants={animationVariants} 
              initial="invisible" 
              animate="visible"
              style={{
                fontFamily: 'Gilroy-Medium',
                fontSize: '40px',
                lineHeight: '100%',
              }}
            >
              What I will do?
            </motion.p>
          </div>
          
          {/* Description */}
          <p style={{ fontFamily: 'Gilroy-Regular', fontSize: '20px', fontWeight: 400 }}>
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
          className='absolute z-10 w-[554px] h-[554px] bg-radial from-10% from-[#48B9D8] via-80% to-40% via-[#41D9FF] to-[#0C45F0] flex bottom-0 top-[45px] left-[51px] translate-x-1/2 rounded-full blur-xl'
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