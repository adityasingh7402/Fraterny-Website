import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Psychological facts to display during processing
const psychologicalFacts = [
  "Most people aren’t avoiding the truth. They’re avoiding what the truth might change..",
  "The mind would rather stay in a familiar struggle than enter an unfamiliar peace.",
  "Sometimes the pain you avoid turns into the life you repeat.",
  "The brain is a prediction machine. Not a truth machine.",
  "People don't respond to what you say. They respond to how safe they feel when you say it.",
  "Thers is a high chance you overestimate how much others notice about you.",
  "People don’t change from advice. They change from being understood.",
  "Rejection hurts because your brain processes it like physical pain.",
  "Labeling your emotions out loud (this is anxiety) helps calm your brain.",
  "Your brain activity is as unique as your fingerprint, creating patterns that are distinctly yours.",
  "It’s easy to feel behind when you’re scrolling through everyone else’s best moments.",
  "Expressing gratitude increases happiness and reduces depression.",
  "Your triggers aren’t your fault. But healing from them? That’s your responsibility.",
  "The brain loves closure. So when it doesn’t get answers, it writes stories.",
  "Your nervous system doesn’t care about your goals. It cares about your survival.",
  "Emotional triggers show you where your healing is unfinished.",
  "People don’t resist change. They resist being changed.",
  "You are one decision away from a completely different life.",
];

const PsychologicalFactsCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000); // 4 seconds like testimonials

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentIndex === psychologicalFacts.length) {
      // Reset to 0 after the transition completes
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
      }, 1000); // Wait for the 1s transition to complete
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex]);

  return (
    <div className="relative overflow-hidden w-full">
      <div 
        className="flex transition-transform duration-1000 ease-in-out"
        style={{
          transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 16}px))`
        }}
      >
        {[...psychologicalFacts, ...psychologicalFacts].map((fact, index) => (
          <div
            key={index}
            className="w-full h-auto relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-xl border-2 border-blue-400 overflow-hidden flex-shrink-0 mr-4"
          >
            <div className="flex items-center justify-center h-full p-1">
              <p className="text-white text-2xl font-normal font-['Gilroy-Regular'] text-center leading-snug">
                "{fact}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export interface QuestProcessingProps {
  className?: string;
  gifSrc?: string; // Optional prop to customize the GIF source
}

export function QuestProcessing({ className = '', gifSrc = '/analysis1.gif' }: QuestProcessingProps) {
  const [factIndex, setFactIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  // New states for result polling
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [resultStatus, setResultStatus] = useState<'processing' | 'ready' | 'error'>('processing');

  // Mock session data for demo
  const sessionId = 'demo-session';
  const userId = 'demo-user';
  const testid = 'demo-test';

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex(prevIndex => (prevIndex + 1) % psychologicalFacts.length);
    }, 8000);

    return () => clearInterval(factInterval);
  }, []);

  return (
    <div className='h-screen max-h-screen relative overflow-hidden'>
      {/* GIF Background */}
      <div>
        <img 
          src={gifSrc}
          className="absolute -top-36 w-full h-full object-cover z-0"
          alt="Processing animation background"
        />
      </div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0" />
      {/* Card-by-Card Sliding Facts */}
      <div className="absolute bottom-36 w-full px-4">
        <PsychologicalFactsCards />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-20 flex justify-center items-center w-full"
      >
        {/* Processing Message */}
        <p 
          className="text-black text-2xl font-['Gilroy-Bold'] tracking-tighter px-2 mt-80 pb-4"

        >
          Analyzing..
        </p>
      </motion.div>
    </div> 
  );
}

export default QuestProcessing;
