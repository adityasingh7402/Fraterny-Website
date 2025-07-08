// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';

// interface CompletionEffectsProps {
//   trigger?: boolean;
//   duration?: number;
//   density?: 'low' | 'medium' | 'high';
//   colors?: string[];
//   className?: string;
// }

// /**
//  * Celebration effects for completion
//  * Visual celebration with confetti and animations
//  */
// export function CompletionEffects({
//   trigger = true,
//   duration = 3,
//   density = 'medium',
//   colors = [
//     '#E07A5F', // terracotta
//     '#0A1A2F', // navy
//     '#D4AF37', // gold
//     '#4CAF50', // green
//     '#3498db'  // blue
//   ],
//   className = ''
// }: CompletionEffectsProps) {
//   // Confetti count based on density
//   const getConfettiCount = (): number => {
//     switch (density) {
//       case 'low': return 30;
//       case 'high': return 100;
//       case 'medium':
//       default: return 60;
//     }
//   };
  
//   const confettiCount = getConfettiCount();
  
//   // State to track if confetti should be visible
//   const [isVisible, setIsVisible] = useState<boolean>(false);
  
//   // Trigger the confetti effect
//   useEffect(() => {
//     if (trigger) {
//       setIsVisible(true);
      
//       // Hide confetti after duration
//       const timer = setTimeout(() => {
//         setIsVisible(false);
//       }, duration * 1000);
      
//       return () => clearTimeout(timer);
//     }
//   }, [trigger, duration]);
  
//   // Don't render if not visible
//   if (!isVisible) return null;
  
//   return (
//     <div className={`completion-effects fixed inset-0 pointer-events-none z-50 ${className}`}>
//       {/* Confetti particles */}
//       {Array.from({ length: confettiCount }).map((_, i) => {
//         const color = colors[i % colors.length];
//         const size = Math.random() * 10 + 5;
//         const delay = Math.random() * 0.5;
//         const duration = Math.random() * 1 + 2;
//         const x = Math.random() * window.innerWidth;
//         const y = -100;
//         const finalY = window.innerHeight + 100;
//         const rotation = Math.random() * 360;
//         const finalRotation = rotation + Math.random() * 720 - 360;
        
//         return (
//           <motion.div
//             key={i}
//             className="absolute rounded-sm"
//             style={{ 
//               width: size, 
//               height: size / 2, 
//               backgroundColor: color,
//               top: y,
//               left: x,
//               zIndex: 50
//             }}
//             initial={{ 
//               y,
//               x,
//               rotate: rotation,
//               opacity: 1
//             }}
//             animate={{ 
//               y: finalY,
//               x: x + (Math.random() * 200 - 100),
//               rotate: finalRotation,
//               opacity: [1, 1, 0]
//             }}
//             transition={{
//               duration,
//               delay,
//               ease: "easeOut"
//             }}
//           />
//         );
//       })}
      
//       {/* Central burst effect */}
//       <motion.div
//         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
//         initial={{ 
//           width: 0, 
//           height: 0,
//           opacity: 0.8
//         }}
//         animate={{ 
//           width: window.innerWidth * 2,
//           height: window.innerWidth * 2,
//           opacity: 0
//         }}
//         transition={{
//           duration: 1.5,
//           ease: "easeOut"
//         }}
//       />
//     </div>
//   );
// }

// export default CompletionEffects;


import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface CompletionEffectsProps {
  className?: string;
}

/**
 * Visual effects for the completion screen
 * Creates celebratory particle animations
 */
export function CompletionEffects({
  className = ''
}: CompletionEffectsProps) {
  useEffect(() => {
    // Create confetti effect on mount
    const createConfetti = () => {
      const confettiColors = [
        '#E07A5F', // terracotta
        '#3D405B', // navy
        '#81B29A', // green
        '#F2CC8F'  // gold
      ];
      
      // Create confetti elements
      for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random positioning
        const left = Math.random() * 100;
        const top = Math.random() * -10;
        
        // Random size
        const size = Math.random() * 10 + 5;
        
        // Random color
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        // Random rotation
        const rotation = Math.random() * 360;
        
        // Apply styles
        Object.assign(confetti.style, {
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          borderRadius: `${Math.random() > 0.5 ? '50%' : '0'}`,
          transform: `rotate(${rotation}deg)`,
          opacity: '0',
          animation: `fall ${Math.random() * 2 + 3}s ease-in-out forwards`,
          zIndex: '10',
        });
        
        // Append to the container
        document.querySelector('.confetti-container')?.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
          confetti.remove();
        }, 5000);
      }
    };
    
    // Add keyframes for the fall animation
    const addKeyframes = () => {
      const styleSheet = document.createElement('style');
      styleSheet.innerHTML = `
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styleSheet);
      
      return () => {
        document.head.removeChild(styleSheet);
      };
    };
    
    // Run effects
    const cleanup = addKeyframes();
    createConfetti();
    
    return () => {
      cleanup();
      // Clean up any remaining confetti
      document.querySelectorAll('.confetti').forEach(el => el.remove());
    };
  }, []);
  
  return (
    <div className={`confetti-container absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Confetti will be added here dynamically */}
      
      {/* Decorative circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-terracotta/20"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full bg-gold/20"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
        className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-navy/20"
      />
    </div>
  );
}

export default CompletionEffects;