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
            wordWrap: 'break-word',
            lineHeight: '1.3',
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
            fontSize: '52px',  // text-5xl = 48px
            fontFamily: 'Gilroy-semiBold', 
            fontWeight: '400', 
            wordWrap: 'break-word' 
          }}
        >
          95%
        </div>
      </motion.div>

      {/* Middle Text: "of people believe they are self-aware but only" */}
      {/* <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="absolute tracking-normal"
        style={{ 
          width: '224px',  // w-56 = 224px
          height: '80px',  // h-20 = 80px
          left: '90px', 
          top: '300px' 
        }}
      >
        <div className="text-center">
          <span 
          className='tracking-normal'
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
      </motion.div> */}
      <motion.div 
        variants={animationVariants} 
        initial="invisible" 
        animate="visible"
        className="absolute pt-3"
        style={{ 
          width: '224px',
          height: '80px',
          left: '90px', 
          top: '300px',
          lineHeight: '1',  // Set once on container
          textAlign: 'center'
        }}
      >
        <span style={{ 
          color: '#FFFFFF', 
          fontSize: '24px',
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
            fontSize: '49px',  // text-5xl = 48px
            fontFamily: 'Gilroy-Bold', 
            fontWeight: '400', 
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