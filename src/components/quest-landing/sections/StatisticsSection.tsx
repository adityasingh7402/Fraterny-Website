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

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ 
  animationState,
  className = '',
  onContinueClick,
  onLogoClick
}) => {
  const [hasRippled, setHasRippled] = useState(false);

  const handleRipple = () => {
    if (!hasRippled) {
      setHasRippled(true);
    }
  }


  return (
    // <section 
    //   className="w-full min-h-screen relative bg-white"
    // >
    //   {/* Background Gradient - exact Figma positioning */}
      // <motion.div 
      //   layoutId='bg'
      //   transition={{ duration: 1.2 }}
      //   className='absolute z-0 w-[554px] h-[554px] rounded-full'
      //   style={{
      //     background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 51%, #48B9D8 100%)',
      //     left: '-70px',
      //     top: '100px',
      //     filter: 'blur(30px)',
      //   }}
      // />

    //   {/* Logo - exact Figma positioning */}
      // <motion.div
      //   layoutId='logo'
      //   transition={{ duration: 1.2 }}
      //   className="absolute z-50"
      //   style={{ 
      //     width: '96px',   // w-24 = 96px
      //     height: '36px',  // h-9 = 36px
      //     left: '157px', 
      //     top: '20px'
      //   }}
      // >
      //   <img 
      //     src='/Vector.svg'
      //     alt="QUEST" 
      //     className="w-full h-full object-contain"
      //   />
      // </motion.div>

    //   {/* Header Text: "You'd be shocked to know, Harvard researchers suggest that" */}
    //   <motion.div 
        // variants={animationVariants} 
        // initial="invisible" 
        // animate="visible"
    //     className="absolute"
    //     style={{ 
    //       width: '384px',  // w-96 = 384px
    //       height: '48px',  // h-12 = 48px
    //       left: '15px', 
    //       top: '150px' 
    //     }}
    //   >
    //     <div 
    //       className="text-center"
    //       style={{ 
    //         color: '#FFFFFF', 
    //         fontSize: '20px',  // text-xl = 20px
    //         fontFamily: 'Gilroy-Regular', 
    //         fontWeight: 400, 
    //         wordWrap: 'break-word',
    //         lineHeight: '1.3',
    //       }}
    //     >
    //       You'd be shocked to know,<br/>Harvard researchers suggest that
    //     </div>
    //   </motion.div>

    //   {/* "95%" - exact Figma positioning */}
    //   <motion.div 
    //     variants={animationVariants} 
    //     initial="invisible" 
    //     animate="visible"
    //     className="absolute"
    //     style={{ 
    //       width: '96px',   // w-24 = 96px
    //       height: '48px',  // h-12 = 48px
    //       left: '156px', 
    //       top: '250px' 
    //     }}
    //   >
    //     <div 
    //       className="text-center"
    //       style={{ 
    //         color: '#FFFFFF', 
    //         fontSize: '52px',  // text-5xl = 48px
    //         fontFamily: 'Gilroy-semiBold', 
    //         fontWeight: '400', 
    //         wordWrap: 'break-word' 
    //       }}
    //     >
    //       95%
    //     </div>
    //   </motion.div>

    //   <motion.div 
    //     variants={animationVariants} 
    //     initial="invisible" 
    //     animate="visible"
    //     className="absolute pt-3"
    //     style={{ 
    //       width: '224px',
    //       height: '80px',
    //       left: '90px', 
    //       top: '300px',
    //       lineHeight: '1',  // Set once on container
    //       textAlign: 'center'
    //     }}
    //   >
    //     <span style={{ 
    //       color: '#FFFFFF', 
    //       fontSize: '24px',
    //       fontFamily: 'Gilroy-Regular', 
    //       fontWeight: 400
    //     }}>
    //       of people believe<br/>they are 
    //     </span>
    //     <span style={{ 
    //       color: '#FFFFFF', 
    //       fontSize: '24px', 
    //       fontFamily: 'Gilroy-Bold', 
    //       fontWeight: 700,
    //       padding: '0 5px'
    //     }}>
    //       self-aware<br/>
    //     </span>
    //     <span style={{ 
    //       color: '#FFFFFF', 
    //       fontSize: '24px', 
    //       fontFamily: 'Gilroy-Regular', 
    //       fontWeight: 400
    //     }}>
    //       but only
    //     </span>
    //   </motion.div>

    //   {/* "10-15%" - exact Figma positioning */}
    //   <motion.div 
    //     variants={animationVariants} 
    //     initial="invisible" 
    //     animate="visible"
    //     className="absolute"
    //     style={{ 
    //       width: '160px',  // w-40 = 160px
    //       height: '48px',  // h-12 = 48px
    //       left: '122px', 
    //       top: '430px' 
    //     }}
    //   >
    //     <div 
    //       className="text-center"
    //       style={{ 
    //         color: '#FFFFFF', 
    //         fontSize: '49px',  // text-5xl = 48px
    //         fontFamily: 'Gilroy-Bold', 
    //         fontWeight: '400', 
    //         wordWrap: 'break-word' 
    //       }}
    //     >
    //       10-15%
    //     </div>
    //   </motion.div>

    //   {/* "actually are" - exact Figma positioning */}
    //   <motion.div 
    //     variants={animationVariants} 
    //     initial="invisible" 
    //     animate="visible"
    //     className="absolute"
    //     style={{ 
    //       width: '144px',  // w-36 = 144px
    //       height: '28px',  // h-7 = 28px
    //       left: '129px', 
    //       top: '480px' 
    //     }}
    //   >
    //     <div 
    //       className="text-center"
    //       style={{ 
    //         color: '#FFFFFF', 
    //         fontSize: '24px',  // text-2xl = 24px
    //         fontFamily: 'Gilroy-Regular', 
    //         fontWeight: 400, 
    //         wordWrap: 'break-word' 
    //       }}
    //     >
    //       actually are
    //     </div>
    //   </motion.div>

      // {/* Down Arrow Icon - exact Figma positioning */}
      // <motion.div 
      //   variants={animationVariants} 
      //   initial="invisible" 
      //   animate="visible"
      //   className="absolute"
      //   style={{ 
      //     width: '80px',   // Increased for circular text
      //     height: '80px',  // Increased for circular text
      //     left: '160px',    // Adjusted to center the larger element
      //     top: '550px'      // Adjusted to center the larger element
      //   }}
      // >
      //   <motion.button
      //     onClick={onContinueClick}
      //     whileHover={{ scale: 1.1 }}
      //     whileTap={{ scale: 0.9 }}
      //     className="w-full h-full relative"
      //     style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
      //   >
      //     {/* Circular spinning text */}
      //     <motion.div 
      //       className="absolute inset-0"
      //       animate={{ rotate: 360 }}
      //       transition={{
      //         duration: 10,
      //         repeat: Infinity,
      //         ease: "linear"
      //       }}
      //     >
      //       <img 
      //         src="/text.svg" 
      //         alt="Those who are" 
      //         className="w-full h-full"
      //       />
      //     </motion.div>
          
      //     {/* Central arrow */}
      //     <div className="absolute inset-0 flex items-center justify-center">
      //       <img 
      //         src="/arrow-down.svg" 
      //         alt="arrow down" 
      //         className="w-6 h-6"
      //       />
      //     </div>
      //   </motion.button>
      // </motion.div>
    // </section>
    <section className={`w-screen h-full relative  ${className}`}>
      <motion.div 
        layoutId='bg'
        transition={{ duration: 1.2 }}
        className='absolute z-0 w-[554px] h-[554px] rounded-full'
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 51%, #48B9D8 100%)',
          left: '-70px',
          top: '15%',
          filter: 'blur(30px)',
        }}
      />

      {/* <motion.div
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
      </motion.div> */}

      {/* <div className='flex w-full items-center justify-center pt-4'>
          <motion.div
            layoutId='logo'
            transition={{ duration: 1.2 }}
            className="z-50"
          >
            <img 
              src={img}
              alt="QUEST" 
              className="h-[36px] w-auto brightness-0"
            />
          </motion.div>
      </div> */}
      <div className='flex w-full items-center justify-center pt-4'>
        <motion.div
          className="z-50"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            delay: 0.4  
          }}
        >
          <img 
            src={img}
            alt="QUEST" 
            className="h-[36px] w-auto brightness-0 cursor-pointer"
            onClick={onLogoClick}
          />
        </motion.div>
      </div>

    <div className='relative flex flex-col gap-10 top-[18%] h-screen'>
      <div className=''>
        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="text-center justify-start text-white text-xl font-normal font-['Gilroy-Regular']">You’d be shocked to know,<br/>Harvard researchers suggest that
        </motion.div>
      </div>

      <div className=''>
        <motion.div 
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="text-center justify-start text-white text-5xl font-normal font-['Gilroy-SemiBold']">95%
        </motion.div>
        <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="text-center justify-start"><span className="text-white text-2xl font-normal font-['Gilroy-Regular']">of people believe<br/>they are </span><span className="text-white text-2xl font-normal font-['Gilroy-Bold']">self-aware<br/></span><span className="text-white text-2xl font-normal font-['Gilroy-Regular']">but only</span>
        </motion.div>
      </div>

      <div className=''>
        <div className='flex flex-col gap-1'>
        <motion.div 
        variants={animationVariants} 
          initial="invisible" 
          animate="visible"
        className="text-center justify-start text-white text-5xl font-normal font-['Gilroy-SemiBold']">10-15%</motion.div>

        <motion.div
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className="text-center justify-start text-white text-2xl font-normal font-['Gilroy-Regular']">
            actually are
        </motion.div>

      </div>
      </div>

      <div className='w-full flex justify-center mt-[-5px]'>
        <motion.div
          variants={animationVariants} 
          initial="invisible" 
          animate="visible"
          className='w-20'
        >
          <motion.button
          onClick={onContinueClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-full h-full relative"
          style={{}}
        >
          {/* Circular spinning text */}
          <motion.div 
            className=""
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

      </div>

    </div>


    </section>
  );
};

export default StatisticsSection;