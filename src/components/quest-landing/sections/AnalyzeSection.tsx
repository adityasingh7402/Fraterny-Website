// /src/components/quest-landing/sections/AnalyzeSection.tsx

import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Change from './Change';
import Testimonials from './Testimonials';
import FAQ from '@/pages/FAQ';
import FaqSection from './FaqSection';
import img from '../../../../public/Vector.svg';
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnalyzeSidebar } from './AnalyzeSidebar';

interface AnalyzeSectionProps {
  animationState: string;
  className?: string;
  onScreenTransition?: () => void;
  onLogoClick?: () => void;
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
  onScreenTransition: _onScreenTransition,
  onLogoClick: _onLogoClick
  
}) => {
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const heroSectionRef = useRef<HTMLDivElement>(null);
const containerRef = useRef<HTMLDivElement>(null);
  // console.log('Current logo state - should be white?', isInHeroSection);
  useEffect(() => {
  const container = containerRef.current;
  if (!container) {
    // console.log('No container found');
    return;
  }

  const handleScroll = () => {
    const scrollTop = container.scrollTop;
    // console.log('Container scroll position:', scrollTop);
    
    // Simple approach - if scrolled more than 300px, logo should be black
    const shouldBeInHero = scrollTop < 100;
    
    if (shouldBeInHero !== isInHeroSection) {
      setIsInHeroSection(shouldBeInHero);
      // console.log('Logo color changed to:', shouldBeInHero ? 'white' : 'black');
    }
  };

  container.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  return () => container.removeEventListener('scroll', handleScroll);
}, [isInHeroSection]);

const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleMenuClick = () => {
    setIsSidebarOpen(true);
  };

  return (


    <section className=''>
    <div ref={containerRef} className='relative h-screen overflow-y-auto'>
      {/* Header */}
      <div className='flex justify-between fixed top-0 w-full z-50 p-2 left-0 text-white items-center'>
          <div className='flex-1 items-center justify-center'>
          <div className='flex w-full items-center justify-center pt-4'>
            <motion.div
            layoutId='logo'
              className="z-50"
              initial={{ y: 0, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.8,
                ease: "easeOut",
                delay: 0.4  // Start after text fades out
              }}
            >
              <img 
                src={img}
                alt="QUEST" 
                className={`h-[36px] w-auto transition-all duration-500 ease-out cursor-pointer ${isInHeroSection ? 'brightness-0 invert' : 'opacity-0'}`}
                onClick={_onLogoClick} // Call the onLogoClick prop when clicked
              />
            </motion.div>
          
          </div>
          </div>
          {/* <motion.span 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          >
          <Menu/>
          </motion.span> */}
          <motion.span 
            variants={animationVariants} 
            initial="invisible" 
            animate="visible"
            onClick={handleMenuClick}
            className="cursor-pointer p-2 rounded-lg hover:bg-white/10 transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-6 h-6" />
          </motion.span>
      </div>   

      {/* Sidebar */}
      <AnalyzeSidebar
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      theme="blue"
      />

      {/* Hero section */}
      <div ref={heroSectionRef} className='max-h-400 relative bg-[#004A7F] overflow-hidden gap-7 text-white w-full p-4 py-20'>
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
          <p className='pt-2' style={{ fontFamily: 'Gilroy-Regular', fontSize: '20px', fontWeight: 400 }}>
            I will decode your hidden
          </p>
          
          {/* Pills */}
          <motion.div 
            variants={animationVariants} 
            initial="invisible" 
            animate="visible"
            className='flex flex-wrap gap-2 mt-[-5px]'
          >
            {['Motivations', 'Ambitions', 'Patterns', 'Triggers', 'Fears'].map((item, i) => (
              <div 
                key={i}
                className="px-4 py-2 font-normal font-['Gilroy-Bold'] rounded-full border-2 border-white bg-white/10 text-white tracking-[-1.5px]"
                style={{ fontSize: '20px', fontWeight: 400 }}
              >
                {item}
              </div>
            ))}
          </motion.div>
          
          {/* Understanding text */}
          <p style={{ fontFamily: 'Gilroy-Regular', fontSize: '20px', fontWeight: 400 }}>
            So you'll finally understand
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
      <div className='flex flex-col gap-4 mb-10 '>
        <Testimonials />
        <FaqSection />
      </div>

    </div>
    </section>
    
  );
};

export default AnalyzeSection;

