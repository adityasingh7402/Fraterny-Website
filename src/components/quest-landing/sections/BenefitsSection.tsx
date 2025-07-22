// /src/components/quest-landing/sections/BenefitsSection.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

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
  className = '' ,
  onScreenTransition
}) => {
  return (
    <section 
      className={`relative w-screen min-h-screen flex flex-col justify-center items-center text-center px-4 md:px-6 lg:px-8 ${className}`}
    >
      {/* Background Gradient with same layoutId for morphing */}
      <motion.div 
        layoutId='bg'
        transition={{ duration: 1.2 }}
        className='absolute z-0 w-[1000px] h-[800px] bg-[#004A7F] flex top-[1/2] left-[1/2] translateY-[-50%] rounded-full blur-xl'
        style={{
          background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
          backdropFilter: 'blur(180px)',
        }}
      />

      {/* Header with Logo */}
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

      {/* Benefits Content */}
      <div className="flex flex-col items-start justify-center w-full h-full">
        <motion.div
        variants={animationVariants}
        initial="invisible"
        animate="visible"
        className="relative z-20 flex-col gap-16 flex text-white pt-2"
        >
        {/* Benefit 1 */}
        <div className="relative">
        <div className="text-left font-bold text-[36px] leading-none mb-4"
            style={{ 
            fontFamily: 'Gilroy-Bold',
            fontWeight: 400,
            fontSize: '36px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#FEFEFE'
            }}
        >
            <p>Are more</p>
            <p>effective leaders.</p>
        </div>
        
        <div 
            className="absolute bottom-5 left-72 text-white font-bold text-[48px] leading-none"
            style={{ 
            fontFamily: 'Gilroy-Regular',
            fontWeight: 400,
            fontSize: '24px',
            color: '#FEFEFE'
            }}
        >
            1
        </div>
        
        <div 
            className="w-full h-[2px] bg-white mt-4"
            style={{ backgroundColor: '#FEFEFE' }}
        />
        </div>

        {/* Benefit 2 */}
        <div className="relative">
        <div className="text-left font-bold text-[36px] leading-none mb-4"
            style={{ 
            fontFamily: 'Gilroy-Bold',
            fontWeight: 400,
            fontSize: '36px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#FEFEFE'
            }}
        >
            <p>Perform better</p>
            <p>at work.</p>
        </div>
        
        <div 
            className="absolute bottom-5 left-72 text-white font-bold text-[48px] leading-none"
            style={{ 
            fontFamily: 'Gilroy-Regular',
            fontWeight: 400,
            fontSize: '24px',
            color: '#FEFEFE'
            }}
        >
            2
        </div>
        
        <div 
            className="w-full h-[2px] bg-white mt-4"
            style={{ backgroundColor: '#FEFEFE' }}
        />
        </div>

        {/* Benefit 3 */}
        <div className="relative">
        <div className="text-left font-bold text-[36px] leading-none mb-4"
            style={{ 
            fontFamily: 'Gilroy-Bold',
            fontWeight: 400,
            fontSize: '36px',
            lineHeight: '100%',
            letterSpacing: '0%',
            color: '#FEFEFE'
            }}
        >
            <p>Are more</p>
            <p>confident.</p>
        </div>
        
        <div 
            className="absolute bottom-5 left-72 text-white font-bold text-[48px] leading-none"
            style={{ 
            fontFamily: 'Gilroy-Regular',
            fontWeight: 400,
            fontSize: '24px',
            color: '#FEFEFE'
            }}
        >
            3
        </div>
        
        <div 
            className="w-full h-[2px] bg-white mt-4"
            style={{ backgroundColor: '#FEFEFE' }}
        />
        </div>
        </motion.div>
      </div>

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