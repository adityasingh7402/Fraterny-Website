/**
 * SubjectsCard.tsx
 * 3D card component displaying subjects the user is mentally built to explore
 */
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Brain, Activity, BookOpen, Atom, Microscope } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '../questresultcards/utils/3d-card';

interface SubjectsCardProps {
  subjects: Array<{
    title: string;
    description: string;
    matchPercentage?: number;
  }>;
  title?: string;
  className?: string;
}

/**
 * SubjectsCard component displays academic subjects in a 3D card with scholarly effects
 * 
 * @param subjects - Array of subject objects with title, description, and optional match percentage
 * @param title - Optional custom title (defaults to "SUBJECTS YOU'RE MENTALLY BUILT TO EXPLORE DEEPER")
 * @param className - Optional additional CSS classes
 */
const SubjectsCard: React.FC<SubjectsCardProps> = ({ 
  subjects, 
  title = "SUBJECTS YOU'RE MENTALLY BUILT TO EXPLORE DEEPER",
  className = '' 
}) => {
  if (!subjects || subjects.length === 0) {
    return null;
  }

  // Icon mapping for each subject based on academic themes
  const getSubjectIcon = (index: number, subjectTitle: string) => {
    const lowerTitle = subjectTitle.toLowerCase();
    
    if (lowerTitle.includes('neuro') || lowerTitle.includes('psychology')) {
      return <Brain className="w-6 h-6 text-cyan-400" />;
    }
    if (lowerTitle.includes('sport') || lowerTitle.includes('activity')) {
      return <Activity className="w-6 h-6 text-cyan-400" />;
    }
    if (lowerTitle.includes('philosophy') || lowerTitle.includes('education')) {
      return <BookOpen className="w-6 h-6 text-cyan-400" />;
    }
    if (lowerTitle.includes('science') || lowerTitle.includes('research')) {
      return <Microscope className="w-6 h-6 text-cyan-400" />;
    }
    
    // Default icons by index
    const icons = [
      <Brain className="w-6 h-6 text-cyan-400" />,
      <Activity className="w-6 h-6 text-cyan-400" />,
      <BookOpen className="w-6 h-6 text-cyan-400" />,
      <Atom className="w-6 h-6 text-cyan-400" />
    ];
    return icons[index % icons.length];
  };

  // Card styles following the established pattern
  const cardStyles = {
    wrapper: "relative w-full",
    corner: "absolute w-6 h-6",
    cornerTopLeft: "top-4 left-4 border-l-2 border-t-2 border-cyan-400 opacity-60",
    cornerTopRight: "top-4 right-4 border-r-2 border-t-2 border-cyan-400 opacity-60",
    cornerBottomLeft: "bottom-4 left-4 border-l-2 border-b-2 border-cyan-400 opacity-60",
    cornerBottomRight: "bottom-4 right-4 border-r-2 border-b-2 border-cyan-400 opacity-60",
    headerWrapper: "text-center mb-8",
    headerDot: "w-2 h-2 rounded-full mr-2 animate-pulse bg-cyan-400",
    headerTitle: "text-2xl font-bold text-transparent bg-clip-text tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400",
    headerDivider: "h-[1px] mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-48",
    bottomAccent: "mt-8 flex justify-center",
    accentDot: "w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400",
    outerGlow: "absolute inset-0 rounded-3xl blur-xl -z-10 opacity-60 bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
  };

  return (
    <div className={`${cardStyles.wrapper} ${className}`}>
      <CardContainer containerClassName="w-full py-4">
        <CardBody className="bg-gradient-to-br from-blue-900/90 via-blue-800/90 to-blue-900/90 rounded-3xl p-8 border border-blue-500/30 shadow-2xl overflow-hidden w-full">
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <AcademicParticles />
          </div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 opacity-75">
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-blue-900/95" />
          </div>

          {/* Corner decorations */}
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft}`}>
            <GraduationCap className="w-4 h-4 text-cyan-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight}`}>
            <GraduationCap className="w-4 h-4 text-cyan-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft}`}>
            <GraduationCap className="w-4 h-4 text-cyan-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight}`}>
            <GraduationCap className="w-4 h-4 text-cyan-400 opacity-60" />
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

            {/* Subjects List */}
            <div className="space-y-6 w-full">
              {subjects.map((subject, index) => {
                const matchPercentage = subject.matchPercentage || Math.floor(Math.random() * 20) + 75; // Default 75-95%
                
                return (
                  <CardItem
                    key={index}
                    translateZ={20 + index * 8}
                    className="group relative w-full"
                  >
                    <div className="p-6 rounded-xl bg-blue-800/20 border border-cyan-500/20 hover:bg-blue-800/30 hover:border-cyan-400/40 transition-all duration-300 w-full">
                      <div className="flex items-start space-x-5 mb-4">
                        <CardItem translateZ={35}>
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full flex items-center justify-center border border-cyan-400/30 group-hover:border-cyan-400/60 transition-all duration-300">
                              {getSubjectIcon(index, subject.title)}
                            </div>
                          </div>
                        </CardItem>
                        
                        <CardItem translateZ={25} className="flex-1">
                          <div className="space-y-2">
                            <h4 className="text-cyan-400 font-bold text-xl group-hover:text-cyan-300 transition-colors">
                              {subject.title}
                            </h4>
                            <p className="text-blue-200 text-sm leading-relaxed group-hover:text-blue-100 transition-colors">
                              {subject.description}
                            </p>
                          </div>
                        </CardItem>
                      </div>

                      {/* Progress Bar */}
                      <CardItem translateZ={30} className="w-full">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-cyan-400 font-medium">Mental Compatibility</span>
                            <span className="text-xs text-cyan-400 font-bold">{matchPercentage}% Match</span>
                          </div>
                          <div className="relative">
                            <div className="h-2 bg-blue-700/50 rounded-full overflow-hidden border border-blue-600/30">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${matchPercentage}%` }}
                                transition={{ duration: 2, ease: [0.23, 1, 0.32, 1], delay: 0.5 + index * 0.2 }}
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 relative overflow-hidden"
                              >
                                {/* Progress shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                              </motion.div>
                            </div>
                            
                            {/* Progress segments */}
                            <div className="absolute inset-0 flex">
                              {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex-1 border-r border-blue-900/50 last:border-r-0" />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardItem>
                    </div>
                  </CardItem>
                );
              })}
            </div>

            {/* Bottom accent */}
            <CardItem translateZ="35" className={cardStyles.bottomAccent}>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={cardStyles.accentDot}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                ))}
              </div>
            </CardItem>
          </div>

          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none rounded-3xl" />
        </CardBody>

        {/* Outer glow effect */}
        <div className={cardStyles.outerGlow} />
      </CardContainer>
    </div>
  );
};

/**
 * Academic-themed floating particles component
 */
const AcademicParticles: React.FC = () => {
  const particles = Array.from({ length: 15 });
  
  return (
    <>
      {particles.map((_, i) => {
        const duration = Math.random() * 5 + 4;
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
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 90, 180, 270, 360]
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
              <GraduationCap className="w-3 h-3 text-cyan-400 opacity-20" />
            ) : i % 4 === 1 ? (
              <Brain className="w-2 h-2 text-cyan-400 opacity-20" />
            ) : i % 4 === 2 ? (
              <BookOpen className="w-2 h-2 text-cyan-400 opacity-20" />
            ) : (
              <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-30" />
            )}
          </motion.div>
        );
      })}
    </>
  );
};

export default SubjectsCard;