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

        {/* <div className='flex w-full items-center justify-center pt-4'>
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
        </div> */}

        <div className='flex w-full items-center justify-center pt-4'>
        <motion.div
          className="z-50"
          initial={{ y: -20, opacity: 0 }}
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
            className="h-[36px] w-auto brightness-0"
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