// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
// import QuestLayout from '../layout/QuestLayout';
// import { useQuest } from '../core/useQuest';
// import { useAuth } from '../../../contexts/AuthContext';

// // Psychological facts to display during processing
// const psychologicalFacts = [
//   "The average person has 12,000 to 60,000 thoughts per day, and many of them are repetitive.",
//   "Your brain uses about 20% of your body's total energy, despite being only 2% of your body weight.",
//   "The brain continues to create new neural connections throughout your life, a property known as neuroplasticity.",
//   "The 'Dunning-Kruger effect' describes how people with limited knowledge in a field overestimate their expertise.",
//   "Smell is the sense most closely linked to memory, which is why certain scents can trigger vivid recollections.",
//   "The 'spotlight effect' is the tendency to overestimate how much others notice about you.",
//   "Decision fatigue describes how the quality of decisions tends to deteriorate after making many decisions.",
//   "Social connection is as important to physical health as exercise and good nutrition.",
//   "Most people can recognize about 5,000 faces, a skill that develops from early childhood.",
//   "Your brain activity is as unique as your fingerprint, creating patterns that are distinctly yours.",
//   "Altruism activates pleasure centers in the brain, which is why helping others feels good.",
//   "Studies show that expressing gratitude increases happiness and reduces depression.",
//   "The 'confirmation bias' leads us to favor information that confirms our existing beliefs.",
//   "The 'halo effect' causes one positive trait to influence our perception of other traits.",
//   "The brain can't actually multitask—it switches rapidly between tasks, reducing efficiency.",
//   "Eye contact activates the same brain regions as falling in love and feeling connected.",
//   "Your emotional state affects your perception—happiness broadens your visual field.",
//   "The 'psychological immune system' helps you rationalize and recover from negative events.",
// ];

// export interface QuestProcessingProps {
//   className?: string;
// }

// export function QuestProcessing({ className = '' }: QuestProcessingProps) {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { session } = useQuest();
  
//   // Get all parameters from URL
//   const params = useParams<{ 
//     sessionId?: string; 
//     userId?: string; 
//     testid?: string; 
//   }>();
  
//   const [factIndex, setFactIndex] = useState(0);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [isTimedOut, setIsTimedOut] = useState(false);
  
//   // New states for result polling
//   const [isPolling, setIsPolling] = useState(false);
//   const [pollCount, setPollCount] = useState(0);
//   const [resultStatus, setResultStatus] = useState<'processing' | 'ready' | 'error'>('processing');

//   // Get sessionId, userId, and testid from various sources
//   const sessionId = params.sessionId || session?.id || localStorage.getItem('questSessionId');
//   const userId = params.userId || user?.id || 'anonymous';
//   const testid = params.testid || localStorage.getItem('testid');

//   useEffect(() => {
//       const factInterval = setInterval(() => {
//         setFactIndex(prevIndex => (prevIndex + 1) % psychologicalFacts.length);
//       }, 8000);
  
//       return () => clearInterval(factInterval);
//     }, []);

//   return (
//     <div className='h-screen bg-[#004A7F] max-w-screen overflow-hidden'>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="flex flex-col items-center justify-center text-center h-screen relative z-20"
//       >
//         <div className='absolute flex flex-col items-center justify-center w-full top-14'>
//           <div className='text-7xl font-normal font-["Gilroy-Bold"] tracking-[-0.5rem]'>
//             QUEST
//           </div>
//           <div className='text-lg font-normal font-["Gilroy-Regular"] tracking-[0.1rem] pl-5 mt-[-8px]'>
//             BY FRATERNY
//           </div>
//         </div>

//         <div className="h-44 flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg m-2 p-6 mb-8 border border-gray-100">
//         <AnimatePresence mode="wait">
//           <motion.p
//             key={factIndex}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.5 }}
//             className="text-2xl text-navy font-light italic font-['Gilroy-Light']"
//           >
//             "{psychologicalFacts[factIndex]}"
//           </motion.p>
//         </AnimatePresence>
//         </div>
        
//         <p className="text-white text-3xl font-['Gilroy-Bold'] tracking-tighter">
//           Please wait while we process your responses...
//         </p>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8 }}
//         className='absolute z-10 w-screen h-[554px] bg-radial from-10% from-[#48B9D8] via-80% to-40% via-[#41D9FF] to-[#0C45F0] flex top-5 rounded-full blur-[80px]'
//         style={{
//           background: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)',
//           backdropFilter: 'blur(180px)',
//         }}
//       />
//     </div> 
//   );
// }

// export default QuestProcessing;




import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import QuestLayout from '../layout/QuestLayout';
import { useQuest } from '../core/useQuest';
import { useAuth } from '../../../contexts/AuthContext';
import gif from '../../../../public/analysis.gif'

// Psychological facts to display during processing
const psychologicalFacts = [
  "The average person has 12,000 to 60,000 thoughts per day, and many of them are repetitive.",
  "Your brain uses about 20% of your body's total energy, despite being only 2% of your body weight.",
  "The brain continues to create new neural connections throughout your life, a property known as neuroplasticity.",
  "The 'Dunning-Kruger effect' describes how people with limited knowledge in a field overestimate their expertise.",
  "Smell is the sense most closely linked to memory, which is why certain scents can trigger vivid recollections.",
  "The 'spotlight effect' is the tendency to overestimate how much others notice about you.",
  "Decision fatigue describes how the quality of decisions tends to deteriorate after making many decisions.",
  "Social connection is as important to physical health as exercise and good nutrition.",
  "Most people can recognize about 5,000 faces, a skill that develops from early childhood.",
  "Your brain activity is as unique as your fingerprint, creating patterns that are distinctly yours.",
  "Altruism activates pleasure centers in the brain, which is why helping others feels good.",
  "Studies show that expressing gratitude increases happiness and reduces depression.",
  "The 'confirmation bias' leads us to favor information that confirms our existing beliefs.",
  "The 'halo effect' causes one positive trait to influence our perception of other traits.",
  "The brain can't actually multitask—it switches rapidly between tasks, reducing efficiency.",
  "Eye contact activates the same brain regions as falling in love and feeling connected.",
  "Your emotional state affects your perception—happiness broadens your visual field.",
  "The 'psychological immune system' helps you rationalize and recover from negative events.",
];

export interface QuestProcessingProps {
  className?: string;
  gifSrc?: string; // Optional prop to customize the GIF source
}

export function QuestProcessing({ className = '', gifSrc = '/analysis.gif' }: QuestProcessingProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { session } = useQuest();
  
  // Get all parameters from URL
  const params = useParams<{ 
    sessionId?: string; 
    userId?: string; 
    testid?: string; 
  }>();
  
  const [factIndex, setFactIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  // New states for result polling
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [resultStatus, setResultStatus] = useState<'processing' | 'ready' | 'error'>('processing');

  // Get sessionId, userId, and testid from various sources
  const sessionId = params.sessionId || session?.id || localStorage.getItem('questSessionId');
  const userId = params.userId || user?.id || 'anonymous';
  const testid = params.testid || localStorage.getItem('testid');

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex(prevIndex => (prevIndex + 1) % psychologicalFacts.length);
    }, 8000);

    return () => clearInterval(factInterval);
  }, []);

  return (
    <div className='h-screen relative overflow-hidden'>
      {/* GIF Background */}
      <img 
        src={gifSrc}
        className="absolute inset-0 w-full h-full object-cover z-0"
        alt="Processing animation background"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Main Content Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center text-center h-screen relative z-20"
      >
        {/* QUEST Logo Section */}
        {/* <div className='absolute flex flex-col items-center justify-center w-full top-14'>
          <div 
            className='text-7xl font-normal font-["Gilroy-Bold"] tracking-[-0.5rem] text-white'
            style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}
          >
            QUEST
          </div>
          <div 
            className='text-lg font-normal font-["Gilroy-Regular"] tracking-[0.1rem] pl-5 mt-[-8px] text-white'
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.7)' }}
          >
            BY FRATERNY
          </div>
        </div> */}

        {/* Psychological Facts Box */}
        {/* <div className="mt-96 h-44 flex items-center justify-center backdrop-blur-md bg-black/40 rounded-lg m-2 p-6 mb-8 border border-white/20 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-2xl text-white font-light italic font-['Gilroy-Light']"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              "{psychologicalFacts[factIndex]}"
            </motion.p>
          </AnimatePresence>
        </div> */}
        
        {/* Processing Message */}
        <p 
          className="text-white text-3xl font-['Gilroy-Bold'] tracking-tighter px-2 mt-80 pb-4"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}
        >
          Please wait while we process your responses...
        </p>
        <div className=" h-40 flex items-center justify-center backdrop-blur-md bg-[#0ea5e9] rounded-lg m-2 p-6 mb-8 border border-white/20 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-2xl text-white font-light italic font-['Gilroy-Light']"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              "{psychologicalFacts[factIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>
    </div> 
  );
}

export default QuestProcessing;