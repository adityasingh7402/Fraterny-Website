/**
 * ActionCard.tsx
 * 3D card component displaying urgent action items with focus and motivation
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Megaphone, CheckCircle, Circle, ArrowRight } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '../questresultcards/utils/3d-card';

interface ActionCardProps {
  actionText: string;
  explanation?: string;
  daysToTrack?: number;
  title?: string;
  className?: string;
}

/**
 * ActionCard component displays urgent action items in a 3D card with motivational effects
 * 
 * @param actionText - The main action item text
 * @param explanation - Optional explanation of why this matters
 * @param daysToTrack - Number of days to track (defaults to 7)
 * @param title - Optional custom title (defaults to "ONE THING YOU SHOULD WORK ON (RIGHT NOW)")
 * @param className - Optional additional CSS classes
 */
const ActionCard: React.FC<ActionCardProps> = ({ 
  actionText,
  explanation = "Taking consistent action builds momentum and creates lasting positive change in your life.",
  daysToTrack = 7,
  title = "ONE THING YOU SHOULD WORK ON",
  className = '' 
}) => {
  const [completedDays, setCompletedDays] = useState<boolean[]>(
    new Array(daysToTrack).fill(false)
  );

  const toggleDay = (dayIndex: number) => {
    setCompletedDays(prev => {
      const updated = [...prev];
      updated[dayIndex] = !updated[dayIndex];
      return updated;
    });
  };

  const completedCount = completedDays.filter(Boolean).length;
  const progressPercentage = (completedCount / daysToTrack) * 100;

  // Card styles following the established pattern
  const cardStyles = {
    wrapper: "relative w-full",
    corner: "absolute w-6 h-6",
    cornerTopLeft: "top-4 left-4 border-l-2 border-t-2 border-yellow-400 opacity-60",
    cornerTopRight: "top-4 right-4 border-r-2 border-t-2 border-yellow-400 opacity-60", 
    cornerBottomLeft: "bottom-4 left-4 border-l-2 border-b-2 border-yellow-400 opacity-60",
    cornerBottomRight: "bottom-4 right-4 border-r-2 border-b-2 border-yellow-400 opacity-60",
    headerWrapper: "text-center mb-6",
    headerDot: "w-2 h-2 rounded-full mr-2 animate-pulse bg-yellow-400",
    headerTitle: "text-2xl font-bold text-transparent bg-clip-text tracking-wider bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400",
    headerDivider: "h-[1px] mx-auto bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-36",
    bottomAccent: "mt-8 flex justify-center",
    accentDot: "w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400",
    outerGlow: "absolute inset-0 rounded-3xl blur-xl -z-10 opacity-60 bg-gradient-to-r from-orange-500/20 to-red-500/20"
  };

  return (
    <div className={`${cardStyles.wrapper} ${className}`}>
      <CardContainer containerClassName="w-full py-4">
        <CardBody className="bg-gradient-to-br from-orange-900/90 via-red-900/90 to-orange-900/90 rounded-3xl p-8 border border-orange-500/30 shadow-2xl overflow-hidden w-full">
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <ActionParticles />
          </div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 opacity-75">
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-orange-900/95 via-red-900/95 to-orange-900/95" />
          </div>

          {/* Corner decorations */}
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft}`}>
            <Target className="w-4 h-4 text-yellow-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight}`}>
            <Target className="w-4 h-4 text-yellow-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft}`}>
            <Target className="w-4 h-4 text-yellow-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight}`}>
            <Target className="w-4 h-4 text-yellow-400 opacity-60" />
          </div>

          <div className="relative z-10">
            {/* Header */}
            <CardItem 
              translateZ="20" 
              className={cardStyles.headerWrapper}
            >
              <div className="flex items-center justify-center mb-2">
                <div className={cardStyles.headerDot} />
                <h3 className={cardStyles.headerTitle}>
                  {title}
                </h3>
                <div className={cardStyles.headerDot} />
              </div>
              <div className={cardStyles.headerDivider} />
            </CardItem>

            {/* RIGHT NOW Badge */}
            <CardItem translateZ="30" className="flex justify-center mb-8">
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 0 20px rgba(234, 179, 8, 0.3)',
                    '0 0 30px rgba(234, 179, 8, 0.6)',
                    '0 0 20px rgba(234, 179, 8, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full border-2 border-yellow-400 shadow-lg"
              >
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
                <span className="text-white font-bold text-lg tracking-wider">RIGHT NOW</span>
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </motion.div>
            </CardItem>

            {/* Main Action Statement */}
            <CardItem translateZ="35" className="mb-8">
              <div className="p-6 rounded-xl bg-orange-800/20 border border-yellow-500/30 hover:bg-orange-800/30 hover:border-yellow-400/50 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full flex items-center justify-center border-2 border-yellow-400/40">
                      <Megaphone className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-yellow-200 text-lg leading-relaxed font-medium">
                      {actionText}
                    </p>
                  </div>
                </div>
              </div>
            </CardItem>

            {/* Why This Matters Section */}
            <CardItem translateZ="25" className="mb-6">
              <div className="p-5 rounded-xl bg-red-800/20 border border-orange-500/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">💪</span>
                  </div>
                  <h4 className="text-orange-400 font-bold text-lg">WHY THIS MATTERS</h4>
                </div>
                <p className="text-orange-200 text-sm leading-relaxed pl-11">
                  {explanation}
                </p>
              </div>
            </CardItem>

            

            {/* Call to Action */}
            <CardItem translateZ="25">
              <div className="text-center">
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center space-x-2 text-yellow-400 font-semibold"
                >
                  <span>Start today</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>Build momentum</span>
                  <ArrowRight className="w-4 h-4" />
                  <span>Transform your life</span>
                </motion.div>
              </div>
            </CardItem>

            {/* Bottom accent */}
            <CardItem translateZ="35" className={cardStyles.bottomAccent}>
              <div className="flex space-x-1">
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={cardStyles.accentDot}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </CardItem>
          </div>

          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 via-transparent to-orange-500/5 pointer-events-none rounded-3xl" />
        </CardBody>

        {/* Outer glow effect */}
        <div className={cardStyles.outerGlow} />
      </CardContainer>
    </div>
  );
};

/**
 * Action-themed floating particles component
 */
const ActionParticles: React.FC = () => {
  const particles = Array.from({ length: 16 });
  
  return (
    <>
      {particles.map((_, i) => {
        const duration = Math.random() * 3 + 2;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const moveX = Math.random() * 40;
        const moveY = Math.random() * 40;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              x: [0, moveX, -moveX, 0],
              y: [0, -moveY, moveY, 0],
              opacity: [0.2, 0.6, 0.2],
              rotate: [0, 180, 360]
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
          >
            {i % 4 === 0 ? (
              <Target className="w-3 h-3 text-yellow-400 opacity-40" />
            ) : i % 4 === 1 ? (
              <Zap className="w-2 h-2 text-orange-400 opacity-50" fill="currentColor" />
            ) : i % 4 === 2 ? (
              <div className="w-1 h-4 bg-yellow-400 opacity-30 rounded-full transform rotate-45" />
            ) : (
              <div className="w-1 h-1 bg-orange-400 rounded-full opacity-60" />
            )}
          </motion.div>
        );
      })}
    </>
  );
};

export default ActionCard;