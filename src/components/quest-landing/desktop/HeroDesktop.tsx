
import React from 'react';  
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MaskCard } from './MaskCard';

// interface HeroDesktopProps {
//   title: string;
//   subtitle: string;
//   className?: string;
//   backgroundImage: string;
// }

const HeroDesktop: React.FC = ({  }) => {
  return (
    <>
    <div className="h-full overflow-y-auto w-full relative">
      {/* Gradient Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #7c3aed 100%)",
        }}
      />

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-start  mt-12 h-screen">
        <div className=' flex flex-col'>
          <motion.div 
            className='justify-start text-neutral-950 text-5xl font-normal font-["Gilroy-Regular"]'
          >
            hi there,
          </motion.div>

          <div className='flex gap-2'>
            <motion.div 
            className=""
            >
              <div className='justify-start text-neutral-500 text-9xl font-bold font-["Gilroy-Bold"]'>
                I'm
              </div>
            </motion.div>
            <motion.div
              layoutId='logo'
              transition={{ duration: 1.2 }}
              className="flex items-center"
            >
              {/* <img src={img} alt="Logo" className="mt-3" /> */}
              <div>
                <div className='text-9xl font-normal font-["Gilroy-Bold"] tracking-[-0.5rem]'>
                  QUEST
                </div>
                <div className='text-5xl font-normal font-["Gilroy-Regular"] tracking-[0.1rem] pl-5 mt-[-8px]'>
                  BY FRATERNY
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        <div className=' flex flex-col gap-0 w-full max-w-4xl text-center'>
          <motion.div 
            className='justify-start text-neutral-950 text-4xl pt-10 font-normal font-["Gilroy-Regular"]'
          >
            I can <span className='justify-start text-neutral-950 text-4xl font-normal font-["Gilroy-Bold"]'>
              Analyse Your Brain {' '}
            </span>
            in 15 minutes
          </motion.div>

          {/* <Link to="/assessment">
            <div className=" mt-12 h-14 mix-blend-luminosity bg-gradient-to-br from-white/20 to-white/20 rounded-[30px] border-2 border-black/75 flex items-center justify-center" >
              <div className="justify-center text-black text-2xl font-['Gilroy-Bold']">Start Test</div>
            </div>
          </Link> */}

          <motion.div className='flex justify-center items-center flex-col mt-24'>
            <p className='text-neutral-950 text-7xl font-normal font-["Gilroy-semiBold"] tracking-tighter'>Unmask Where you Belong</p>
            <p className='text-3xl'>6 {" "}<span className='font-["Gilroy-Bold"] italic'> Clusters,</span> 32 <span className='font-["Gilroy-Bold"] italic'> Archeotypes,</span></p>
            <div className='h-full w-full'>
              <MaskCard />
            </div>
          </motion.div>
        </div>


        <div className='absolute top-[700px] w-full flex flex-col items-center justify-center mt-96'>
           <p className='text-neutral-950 text-7xl font-normal font-["Gilroy-semiBold"] tracking-tighter mt-12 mb-10'>Why You Should Try</p>
          <motion.div className='flex flex-col gap-2'>
                  <div className=''>
                    <motion.div 
                      className="text-center justify-start text-black text-4xl font-normal font-['Gilroy-Regular']">You’d be shocked to know, Harvard researchers suggest that
                    </motion.div>
                  </div>
            
                  <div className=''>
                    <motion.div 
                      className="text-center justify-start text-black text-5xl font-normal font-['Gilroy-SemiBold']">95%
                    </motion.div>
                    <motion.div 
                    className="text-center justify-start"><span className="text-black text-4xl font-normal font-['Gilroy-Regular']">of people believe they are </span><span className="text-black text-4xl font-['Gilroy-Bold'] font-bold">self-aware </span><span className="text-black text-4xl font-normal font-['Gilroy-Regular']">but only</span>
                    </motion.div>
                  </div>
            
                  <div className=''>
                    <div className='flex flex-col gap-1'>
                    <motion.div 
                    className="text-center justify-start text-black text-5xl font-normal font-['Gilroy-SemiBold']">10-15%</motion.div>
            
                    <motion.div
                      className="text-center justify-start text-black text-4xl font-normal font-['Gilroy-Regular']">
                        actually are
                    </motion.div>
            
                  </div>
                  </div>
            
            </motion.div>
        </div>


        <div className='absolute top-[1100px] w-full flex flex-col items-center justify-center mt-96'>
           <p className='text-neutral-950 text-7xl font-normal font-["Gilroy-semiBold"] tracking-tighter mt-12 mb-10'>What I will do?</p>
          <div className='gap-8 flex flex-col z-20'>
  
          {/* Description */}
          <p className='pt-2 font-["Gilroy-Regular"] text-4xl font-normal text-black'>
            I'll guide you to reflect on your
          </p>
          
          {/* Pills */}
          <div className='flex flex-wrap mt-[-10px] w-full gap-12'>
            {['Motivations', 'Desires', 'Patterns', 'Triggers', 'Fears'].map((item, i) => (
              <div 
                key={i}
                className="px-8 py-3 font-['Gilroy-Bold'] text-[22px] font-normal rounded-full border-2 border-black bg-black/10 text-black tracking-[-1.5px]"
              >
                {item}
              </div>
            ))}
          </div>
          
          {/* Understanding text */}
          <p className='font-["Gilroy-Regular"] text-4xl font-normal text-black'>
            So together, we can understand
          </p>
          
          {/* Questions list */}
          <div className='flex flex-col gap-6'>
            {[
              'What makes you unique',
              "How to use your strengths", 
              'How others truly see you',
              'How to reach your ideal self'
            ].map((question, i) => (
              <div key={i} className="relative flex items-center justify-between">
                <p className="text-black font-['Gilroy-Bold'] text-3xl leading-[100%] font-normal pb-3">
                  {question}
                </p>
                <span className="font-['Gilroy-Regular'] text-[14px] font-normal ml-4 mb-3 text-black">
                  {i + 1}
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HeroDesktop;
