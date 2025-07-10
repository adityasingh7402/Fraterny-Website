/**
 * particles.tsx
 * Reusable floating particles background component
 */
import React from 'react';
import { motion } from 'framer-motion';

interface ParticlesProps {
  count?: number;
  color?: string;
  className?: string;
}

/**
 * Creates animated floating particles background
 * 
 * @param count - Number of particles to display (default: 15)
 * @param color - CSS color class for particles (default: 'bg-cyan-400')
 * @param className - Additional CSS classes
 */
const Particles: React.FC<ParticlesProps> = ({ 
  count = 15, 
  color = 'bg-cyan-400', 
  className = 'opacity-30' 
}) => {
  // Create an array of the specified count
  const particles = Array.from({ length: count });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        // Randomize animation properties for each particle
        const duration = Math.random() * 4 + 3; // Between 3-7 seconds
        const startX = Math.random() * 100; // Random X position
        const startY = Math.random() * 100; // Random Y position
        const moveX = Math.random() * 50; // Random X movement
        const moveY = Math.random() * 50; // Random Y movement
        
        return (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 ${color} rounded-full ${className}`}
            animate={{
              x: [Math.random() * moveX, Math.random() * moveX],
              y: [Math.random() * moveY, Math.random() * moveY],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{
              duration,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Preset particle configurations for different card types
 */
export const MindCardParticles: React.FC = () => (
  <Particles count={20} color="bg-cyan-400" className="opacity-30" />
);

export const FindingsCardParticles: React.FC = () => (
  <Particles count={15} color="bg-purple-400" className="opacity-20" />
);

export const QuotesCardParticles: React.FC = () => (
  <Particles count={15} color="bg-emerald-400" className="opacity-20" />
);

export default Particles;