/**
 * FilmsCard.tsx
 * 3D card component displaying films that resonate with the user's psyche
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Film, Brain, Target, Zap, Trophy, Monitor } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '../questresultcards/utils/3d-card';

interface FilmsCardProps {
  films: Array<{
    title: string;
    description: string;
  }>;
  title?: string;
  className?: string;
}

/**
 * FilmsCard component displays cinema recommendations in a 3D card with cinematic effects
 * 
 * @param films - Array of film objects with title and description
 * @param title - Optional custom title (defaults to "FILMS THAT HIT CLOSER THAN EXPECTED")
 * @param className - Optional additional CSS classes
 */
const FilmsCard: React.FC<FilmsCardProps> = ({ 
  films, 
  title = "FILMS THAT HIT CLOSER THAN EXPECTED",
  className = '' 
}) => {
  if (!films || films.length === 0) {
    return null;
  }

  // Icon mapping for each film based on common themes
  const getFilmIcon = (index: number) => {
    const icons = [
      <Brain className="w-5 h-5 text-amber-400" />,
      <Target className="w-5 h-5 text-amber-400" />,
      <Zap className="w-5 h-5 text-amber-400" />,
      <Trophy className="w-5 h-5 text-amber-400" />,
      <Monitor className="w-5 h-5 text-amber-400" />
    ];
    return icons[index % icons.length];
  };

  // Card styles following the established pattern
  const cardStyles = {
    wrapper: "relative w-full",
    corner: "absolute w-6 h-6",
    cornerTopLeft: "top-4 left-4 border-l-2 border-t-2 border-amber-400 opacity-60",
    cornerTopRight: "top-4 right-4 border-r-2 border-t-2 border-amber-400 opacity-60",
    cornerBottomLeft: "bottom-4 left-4 border-l-2 border-b-2 border-amber-400 opacity-60",
    cornerBottomRight: "bottom-4 right-4 border-r-2 border-b-2 border-amber-400 opacity-60",
    headerWrapper: "text-center mb-8",
    headerDot: "w-2 h-2 rounded-full mr-2 animate-pulse bg-amber-400",
    headerTitle: "text-2xl font-bold text-transparent bg-clip-text tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400",
    headerDivider: "h-[1px] mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent w-40",
    bottomAccent: "mt-8 flex justify-center",
    accentDot: "w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400",
    outerGlow: "absolute inset-0 rounded-3xl blur-xl -z-10 opacity-60 bg-gradient-to-r from-red-500/20 to-amber-500/20"
  };

  return (
    <div className={`${cardStyles.wrapper} ${className}`}>
      <CardContainer containerClassName="w-full py-4">
        <CardBody className="bg-gradient-to-br from-red-900/90 via-red-800/90 to-red-900/90 rounded-3xl p-8 border border-red-500/30 shadow-2xl overflow-hidden w-full">
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FilmParticles />
          </div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500/20 via-amber-500/20 to-red-500/20 opacity-75">
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-red-900/95 via-red-800/95 to-red-900/95" />
          </div>

          {/* Corner decorations */}
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft}`}>
            <Film className="w-4 h-4 text-amber-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight}`}>
            <Film className="w-4 h-4 text-amber-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft}`}>
            <Film className="w-4 h-4 text-amber-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight}`}>
            <Film className="w-4 h-4 text-amber-400 opacity-60" />
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

            {/* Films List */}
            <div className="space-y-4 w-full">
              {films.map((film, index) => (
                <CardItem
                  key={index}
                  translateZ={15 + index * 5}
                  className="group relative w-full"
                >
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-red-800/20 border border-amber-500/20 hover:bg-red-800/30 hover:border-amber-400/40 transition-all duration-300 w-full">
                    <CardItem translateZ={30}>
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full flex items-center justify-center border border-amber-400/30 group-hover:border-amber-400/60 transition-all duration-300">
                          {getFilmIcon(index)}
                        </div>
                      </div>
                    </CardItem>
                    <CardItem translateZ={20} className="w-full">
                      <div className="space-y-1">
                        <h4 className="text-amber-400 font-semibold text-lg group-hover:text-amber-300 transition-colors">
                          {film.title}
                        </h4>
                        <p className="text-red-200 text-sm leading-relaxed italic group-hover:text-red-100 transition-colors">
                          {film.description}
                        </p>
                      </div>
                    </CardItem>
                  </div>
                </CardItem>
              ))}
            </div>

            {/* Bottom accent */}
            <CardItem translateZ="30" className={cardStyles.bottomAccent}>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={cardStyles.accentDot}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </CardItem>
          </div>

          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-red-500/5 pointer-events-none rounded-3xl" />
        </CardBody>

        {/* Outer glow effect */}
        <div className={cardStyles.outerGlow} />
      </CardContainer>
    </div>
  );
};

/**
 * Film-themed floating particles component
 */
const FilmParticles: React.FC = () => {
  const particles = Array.from({ length: 12 });
  
  return (
    <>
      {particles.map((_, i) => {
        const duration = Math.random() * 4 + 4;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const moveX = Math.random() * 30;
        const moveY = Math.random() * 30;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              x: [0, moveX, -moveX, 0],
              y: [0, -moveY, moveY, 0],
              opacity: [0.1, 0.4, 0.1],
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
            {i % 3 === 0 ? (
              <Film className="w-3 h-3 text-amber-400 opacity-20" />
            ) : i % 3 === 1 ? (
              <div className="w-2 h-2 bg-amber-400 rounded-full opacity-20" />
            ) : (
              <div className="w-1 h-4 bg-gradient-to-b from-amber-400 to-transparent opacity-20 rounded-full" />
            )}
          </motion.div>
        );
      })}
    </>
  );
};

// Example usage component for testing
const FilmsCardExample: React.FC = () => {
  const sampleFilms = [
    {
      title: "The Theory of Everything",
      description: "brilliance meets heartache"
    },
    {
      title: "Lagaan",
      description: "ambition and teamwork under pressure"
    },
    {
      title: "Good Will Hunting",
      description: "hidden genius, quiet resilience"
    },
    {
      title: "Chak De! India",
      description: "passion for sport and pride"
    },
    {
      title: "The Social Network",
      description: "innovation driven by obsession"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <FilmsCard films={sampleFilms} />
    </div>
  );
};

export default FilmsCard;
export { FilmsCardExample };