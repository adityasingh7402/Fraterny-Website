// // src/components/quest/views/QuestProcessing.tsx

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import QuestLayout from '../layout/QuestLayout';
// import { useQuest } from '../core/useQuest';

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
//   sessionId?: string;
// }

// export function QuestProcessing({ className = '' }: QuestProcessingProps) {
//   const navigate = useNavigate();
//   const params = useParams<{ sessionId?: string }>();
//   const { session } = useQuest();
//   const [factIndex, setFactIndex] = useState(0);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [isTimedOut, setIsTimedOut] = useState(false);
//   const [hasFixedUrl, setHasFixedUrl] = useState(false);
//   const { sessionId } = useParams<{ sessionId?: string }>();

// useEffect(() => {
//   if (sessionId && sessionId !== 'undefined') {
//     // Store in localStorage for consistency
//     localStorage.setItem('questSessionId', sessionId);
    
//     // Set timer for auto-navigation to results
//     const redirectTimer = setTimeout(() => {
//       navigate(`/quest-result/result/${sessionId}`);
//     }, 15000);
    
//     return () => clearTimeout(redirectTimer);
//   }
// }, [sessionId, navigate]);

//   // useEffect(() => {
//   //   if (params.sessionId && !localStorage.getItem('questSessionId')) {
//   //     console.log('Setting sessionId from URL params to localStorage:', params.sessionId);
//   //     localStorage.setItem('questSessionId', params.sessionId);
//   //   }
//   // }, [params.sessionId]);

//   // Use the provided sessionId, URL param, or localStorage
//   const currentSessionId = 
//     sessionId || 
//     params.sessionId || 
//     session?.id || 
//     localStorage.getItem('questSessionId');

//   // Rotate through facts every 8 seconds
//   useEffect(() => {
//     const factInterval = setInterval(() => {
//       setFactIndex(prevIndex => (prevIndex + 1) % psychologicalFacts.length);
//     }, 8000);

//     return () => clearInterval(factInterval);
//   }, []);

//   // Track elapsed time
//   useEffect(() => {
//     const timeInterval = setInterval(() => {
//       setElapsedTime(prev => {
//         const newTime = prev + 1;
//         // If processing takes too long (60 seconds), show timeout message
//         if (newTime >= 60) {
//           setIsTimedOut(true);
//         }
//         return newTime;
//       });
//     }, 1000);

//     return () => clearInterval(timeInterval);
//   }, []);

//   useEffect(() => {
//     const redirectTimer = setTimeout(() => {
//       if (currentSessionId) {
//         localStorage.setItem('questSessionId', currentSessionId);
//         navigate(`/quest-result/processing/${sessionId}`);
//       } else {
//         console.error('No session ID available for results');
//       }
//     }, 1000);

//     return () => clearTimeout(redirectTimer);
//   }, [currentSessionId, navigate]);

//   // Handle manual continue button
//   const handleManualContinue = () => {
//     if (sessionId && sessionId !== 'undefined') {
//       navigate(`/quest-result/result/${sessionId}`);
//     }
//   };

//   return (
//     <QuestLayout showHeader={false} showNavigation={false} className={className}>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         className="flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto text-center"
//       >
//         <h2 className="text-2xl font-playfair text-navy mb-8">
//           Analyzing Your Responses
//         </h2>

//         {/* Loading animation */}
//         <div className="mb-10">
//           <motion.div
//             animate={{
//               scale: [1, 1.2, 1],
//               rotate: [0, 180, 360],
//             }}
//             transition={{
//               duration: 3,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//             className="w-16 h-16 rounded-full border-4 border-terracotta border-t-transparent mb-4"
//           />
//           <p className="text-gray-600">
//             {!isTimedOut ? (
//               `Processing your assessment... (${elapsedTime}s)`
//             ) : (
//               "This is taking longer than expected."
//             )}
//           </p>
//         </div>

//         {/* Rotating facts */}
//         <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg p-6 mb-8">
//           <AnimatePresence mode="wait">
//             <motion.p
//               key={factIndex}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5 }}
//               className="text-lg text-navy font-light italic"
//             >
//               "{psychologicalFacts[factIndex]}"
//             </motion.p>
//           </AnimatePresence>
//         </div>

//         {/* Manual continue button (shows after timeout) */}
//         {isTimedOut && (
//           <motion.button
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleManualContinue}
//             className="px-6 py-3 bg-navy text-white rounded-lg shadow-md hover:bg-navy/90 transition-colors mt-4"
//           >
//             Continue to Results
//           </motion.button>
//         )}

//         {/* Processing info */}
//         <motion.p 
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//           className="text-sm text-gray-500 mt-8 max-w-md"
//         >
//           Our AI is analyzing your responses to provide personalized insights.
//           This typically takes less than a minute.
//         </motion.p>
//       </motion.div>
//     </QuestLayout>
//   );
// }

// export default QuestProcessing;

// src/components/quest/views/QuestProcessing.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import QuestLayout from '../layout/QuestLayout';
import { useQuest } from '../core/useQuest';
import { useAuth } from '../../../contexts/AuthContext';

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
}

export function QuestProcessing({ className = '' }: QuestProcessingProps) {
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

  // Get sessionId, userId, and testid from various sources
  const sessionId = params.sessionId || session?.id || localStorage.getItem('questSessionId');
  const userId = params.userId || user?.id;
  const testid = params.testid || localStorage.getItem('testid');

  console.log('🎯 QuestProcessing params:', params);
  console.log('📊 Current sessionId:', sessionId);
  console.log('👤 Current userId:', userId);
  console.log('🔑 Current testid:', testid);

  // Store parameters in localStorage for consistency
  useEffect(() => {
    if (sessionId) localStorage.setItem('questSessionId', sessionId);
    if (testid) localStorage.setItem('testid', testid);
  }, [sessionId, testid]);

  // Main redirect timer - navigate to results after processing
  useEffect(() => {
    if (sessionId && userId && testid) {
      console.log('⏰ Setting redirect timer for results page');
      
      const redirectTimer = setTimeout(() => {
        const resultUrl = `/quest-result/result/${sessionId}/${userId}/${testid}`;
        console.log('🚀 Redirecting to results:', resultUrl);
        navigate(resultUrl);
      }, 15000); // 15 seconds processing time
      
      return () => clearTimeout(redirectTimer);
    } else {
      console.warn('⚠️ Missing parameters for redirect:', { sessionId, userId, testid });
    }
  }, [sessionId, userId, testid, navigate]);

  // Rotate through facts every 8 seconds
  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex(prevIndex => (prevIndex + 1) % psychologicalFacts.length);
    }, 8000);

    return () => clearInterval(factInterval);
  }, []);

  // Track elapsed time
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        // If processing takes too long (60 seconds), show timeout message
        if (newTime >= 60) {
          setIsTimedOut(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  // Handle manual continue button
  const handleManualContinue = () => {
    if (sessionId && userId && testid) {
      const resultUrl = `/quest-result/result/${sessionId}/${userId}/${testid}`;
      console.log('👆 Manual continue to:', resultUrl);
      navigate(resultUrl);
    } else {
      console.error('❌ Cannot continue: missing parameters', { sessionId, userId, testid });
      // Fallback to basic result page if parameters are missing
      navigate('/quest-result/result');
    }
  };

  return (
    <QuestLayout showHeader={false} showNavigation={false} className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center px-4 py-12 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-2xl font-playfair text-navy mb-8">
          Analyzing Your Responses
        </h2>

        {/* Loading animation */}
        <div className="mb-10">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-16 h-16 rounded-full border-4 border-terracotta border-t-transparent mb-4"
          />
          <p className="text-gray-600">
            {!isTimedOut ? (
              `Processing your assessment... (${elapsedTime}s)`
            ) : (
              "This is taking longer than expected."
            )}
          </p>
        </div>

        {/* Rotating facts */}
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg p-6 mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-navy font-light italic"
            >
              "{psychologicalFacts[factIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Manual continue button (shows after timeout or if missing params) */}
        {(isTimedOut || !sessionId || !userId || !testid) && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleManualContinue}
            className="px-6 py-3 bg-navy text-white rounded-lg shadow-md hover:bg-navy/90 transition-colors mt-4"
          >
            Continue to Results
          </motion.button>
        )}

        {/* Processing info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-gray-500 mt-8 max-w-md"
        >
          Our AI is analyzing your responses to provide personalized insights.
          This typically takes less than a minute.
        </motion.p>

        {/* Debug info (remove in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded text-xs text-left">
            <p><strong>Debug Info:</strong></p>
            <p>SessionId: {sessionId || 'Missing'}</p>
            <p>UserId: {userId || 'Missing'}</p>
            <p>TestId: {testid || 'Missing'}</p>
            <p>URL Params: {JSON.stringify(params)}</p>
          </div>
        )}
      </motion.div>
    </QuestLayout>
  );
}

export default QuestProcessing;