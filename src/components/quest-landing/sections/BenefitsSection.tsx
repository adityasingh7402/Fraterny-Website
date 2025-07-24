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
  // animationState,
  // className = '',
  // onScreenTransition
}) => {
  return (
    // <section 
    //   className="w-full min-h-screen relative bg-white"
    // >
    //   {/* Background Gradient - Exact Figma positioning */}
      // <motion.div 
      //   layoutId='bg'
      //   transition={{ duration: 1.2 }}
      //   className='absolute z-0 rounded-full'
      //   style={{
      //     width: '952px',
      //     height: '952px',
      //     background: 'radial-gradient(ellipse 50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 51%, #48B9D8 100%)',
      //     filter: 'blur(30px)',
      //     left: '-269px',
      //     top: '-39px'
      //   }}
      // />

    //   {/* Logo - Header positioning */}
      // <motion.div
      //   layoutId='logo'
      //   transition={{ duration: 1.2 }}
      //   className="absolute z-50"
      //   style={{ 
      //     left: '157px',
      //     top: '30px',
      //     transform: 'translateX(-50%)'
      //   }}
      // >
      //   <img 
      //     src={img}
      //     alt="QUEST" 
      //     className="h-[36px] w-auto brightness-0 invert"
      //   />
      // </motion.div>

    //   {/* Menu Icon - top right */}
    //   <motion.div 
    //     variants={animationVariants} 
    //     initial="invisible" 
    //     animate="visible"
    //     className="absolute z-50"
    //     style={{ right: '20px', top: '30px' }}
    //   >
    //     <Menu size={36} color="#FFFFFF" />
    //   </motion.div>

    //   {/* Benefit 1: "Are more effective leaders." */}
    //   <motion.div
        // variants={animationVariants}
        // initial="invisible"
        // animate="visible"
        // className="absolute z-20"
    //     style={{ left: '25px', top: '152px' }}
    //   >
    //     <div 
    //       style={{ 
    //         width: '288px',  // w-72 = 288px
    //         height: '80px',  // h-20 = 80px
    //         color: '#FFFFFF', 
    //         fontSize: '36px',  // text-4xl = 36px
    //         fontFamily: 'Gilroy-Bold', 
    //         fontWeight: '400',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'flex-start',
    //         lineHeight: '1',
    //       }}
    //     >
    //       Are more effective leaders.
    //     </div>
    //   </motion.div>

    //   {/* Number 1 */}
    //   <motion.div
    //     variants={animationVariants}
    //     initial="invisible"
    //     animate="visible"
    //     className="absolute z-20"
    //     style={{ right: '25px', top: '198px' }}
    //   >
    //     <div 
    //       style={{ 
    //         width: '28px',   // w-7 = 28px
    //         height: '32px',  // h-8 = 32px
    //         color: '#FFFFFF', 
    //         fontSize: '24px',  // text-2xl = 24px
    //         fontFamily: 'Gilroy-Regular', 
    //         fontWeight: '400',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'flex-start'
    //       }}
    //     >
    //       1
    //     </div>
    //   </motion.div>

    //   {/* Separator Line 1 */}
    //   <div 
    //     className="absolute z-20"
    //     style={{ 
    //       left: '25px', 
    //       right: '25px', 
    //       top: '235px',
    //       height: '1px',
    //       backgroundColor: '#FFFFFF' 
    //     }} 
    //   />

    //   {/* Benefit 2: "Perform better at work." */}
    //   <motion.div
    //     variants={animationVariants}
    //     initial="invisible"
    //     animate="visible"
    //     className="absolute z-20"
    //     style={{ left: '25px', top: '310px' }}
    //   >
    //     <div 
    //       style={{ 
    //         width: '240px',  // w-60 = 240px
    //         height: '80px',  // h-20 = 80px
    //         color: '#FFFFFF', 
    //         fontSize: '36px',  // text-4xl = 36px
    //         fontFamily: 'Gilroy-Bold', 
    //         fontWeight: '400',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'flex-start',
    //         lineHeight: '1',
    //       }}
    //     >
    //       Perform better at work.
    //     </div>
    //   </motion.div>

    //   {/* Number 2 */}
    //   <motion.div
    //     variants={animationVariants}
    //     initial="invisible"
    //     animate="visible"
    //     className="absolute z-20"
    //     style={{ right: '25px', top: '358px' }}
    //   >
    //     <div 
    //       style={{ 
    //         width: '28px',   // w-7 = 28px
    //         height: '32px',  // h-8 = 32px
    //         color: '#FFFFFF', 
    //         fontSize: '24px',  // text-2xl = 24px
    //         fontFamily: 'Gilroy-Regular', 
    //         fontWeight: '400',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'flex-start'
    //       }}
    //     >
    //       2
    //     </div>
    //   </motion.div>

    //   {/* Separator Line 2 */}
    //   <div 
    //     className="absolute z-20"
    //     style={{ 
    //       left: '25px', 
    //       right: '25px', 
    //       top: '395px',
    //       height: '1px',
    //       backgroundColor: '#FFFFFF' 
    //     }} 
    //   />

    //   {/* Benefit 3: "Are more confident." */}
    //   <motion.div
    //     variants={animationVariants}
    //     initial="invisible"
    //     animate="visible"
    //     className="absolute z-20"
    //     style={{ left: '25px', top: '470px' }}
    //   >
    //     <div 
    //       style={{ 
    //         width: '240px',  // w-60 = 240px
    //         height: '80px',  // h-20 = 80px
    //         color: '#FFFFFF', 
    //         fontSize: '36px',  // text-4xl = 36px
    //         fontFamily: 'Gilroy-Bold', 
    //         fontWeight: '400',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'flex-start',
    //         lineHeight: '1',
    //       }}
    //     >
    //       Are more confident.
    //     </div>
    //   </motion.div>

    //   {/* Number 3 */}
    //   <motion.div
    //     variants={animationVariants}
    //     initial="invisible"
    //     animate="visible"
    //     className="absolute z-20"
    //     style={{ right: '25px', top: '520px' }}
    //   >
    //     <div 
    //       style={{ 
    //         width: '28px',   // w-7 = 28px
    //         height: '32px',  // h-8 = 32px
    //         color: '#FFFFFF', 
    //         fontSize: '24px',  // text-2xl = 24px
    //         fontFamily: 'Gilroy-Regular', 
    //         fontWeight: '400',
    //         display: 'flex',
    //         alignItems: 'center',
    //         justifyContent: 'flex-start'
    //       }}
    //     >
    //       3
    //     </div>
    //   </motion.div>

    //   {/* Final Separator Line */}
    //   <div 
    //     className="absolute z-20"
    //     style={{ 
    //       left: '25px', 
    //       right: '25px', 
    //       top: '555px',
    //       height: '1px',
    //       backgroundColor: '#FFFFFF' 
    //     }} 
    //   />

    //   {/* Down Arrow for Screen Transition */}
    //   <div className="absolute bottom-6 right-6 z-30">
    //     <motion.button
    //       onClick={onScreenTransition}
    //       variants={animationVariants}
    //       initial="invisible"
    //       animate="visible"
    //       whileHover={{ scale: 1.1 }}
    //       whileTap={{ scale: 0.9 }}
    //       className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:text-white/80 transition-colors"
    //     >
    //       <ChevronDown size={16} />
    //     </motion.button>
    //   </div>
    // </section>

    <section className='w-screen h-full relative'>
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

        <div className='flex w-full items-center justify-center pt-4'>
          <motion.div
            layoutId='logo'
            transition={{ duration: 1.2 }}
            className="z-50"
          >
            <img 
              src={img}
              alt="QUEST" 
              className="h-[36px] w-auto brightness-0 invert"
            />
          </motion.div>
        </div>

        <div className='z-50 pl-5 flex flex-col gap-10 absolute w-full top-[25%]'>

          <motion.div 
          variants={animationVariants}
          initial="invisible"
          animate="visible"
          className='flex flex-col gap-4 z-50 w-[96%]'>

          <div className='flex justify-between items-center'>
           <div className="justify-start text-white text-4xl font-normal font-['Gilroy-Bold']">Are more<br /> effective leaders.</div>
           <div className="justify-start text-white text-2xl font-normal font-['Gilroy-Regular'] mt-10">1</div>
          </div>
          <div className="h-0 outline outline-2 outline-white w-[99%]"></div>

          </motion.div>

          <motion.div 
          variants={animationVariants}
          initial="invisible"
          animate="visible"
          className='flex flex-col gap-4 z-50 w-[96%]'>

          <div className='flex justify-between items-center'>
           <div className="justify-start text-white text-4xl font-normal font-['Gilroy-Bold']">Perform better <br /> at work.</div>
           <div className="justify-start text-white text-2xl font-normal font-['Gilroy-Regular'] mt-10">2</div>
          </div>
          <div className="h-0 outline outline-2 outline-white w-[99%]"></div>

          </motion.div>


          <motion.div 
          variants={animationVariants}
          initial="invisible"
          animate="visible"
          className='flex flex-col gap-4 z-50 w-[96%]'>

          <div className='flex justify-between items-center'>
           <div className="justify-start text-white text-4xl font-normal font-['Gilroy-Bold']">Are more <br /> confident</div>
           <div className="justify-start text-white text-2xl font-normal font-['Gilroy-Regular'] mt-10">3</div>
          </div>
          <div className="h-0 outline outline-2 outline-white w-[99%]"></div>

          </motion.div>

        </div>

    </section>
  );
};

export default BenefitsSection;