import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

//Entire Process to display during processing
const psychologicalFacts = [
  "Processing your answers securely...",
  "Cleaning and organising your responses...",
  "Calibrating weights so no single answer dominates...",
  "Balancing literal text with implied meaning...",
  "Reviewing the quality and depth of your responses...",
  "Quantifying uncertainty where answers are ambiguous...",
  "Searching the knowldege database for in-depth analysis...",
  "Analysing the emotional tone of the answers...",
  "Mapping shifts in mood across topics...",
  "Measuring emphasis vs understatement in phrasing...",
  "Detecting recurring themes and motifs...",
  "Looking for quiet signals you might underplay...",
  "Understanding your thought patterns based on answer combinations...",
  "Estimating confidence vs hesitation in wording...",
  "Measuring intensity behind key statements...",
  "Testing multiple interpretations for each signal...",
  "Weighing contradictions vs consistencies...",
  "Connecting answers to reveal pattern clusters...",
  "Creating a detailed summary of your personality and internal drivers...",
  "Locating edge cases that make you unique...",
  "Compressing complex patterns into takeaways...",
  "Generating your share-ready summary tiles...",
  
];

const PsychologicalFactsCards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 5000); // 5 seconds for less percieved time

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
          Generating in 2 minutes
        </p>
      </motion.div>
    </div> 
  );
}

export default QuestProcessing;
