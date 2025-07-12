/**
 * AstrologyCard.tsx
 * 3D card component displaying astrological insights and predictions
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Moon, Zap, Heart, Gift, RotateCcw, Users, Sparkles } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '../questresultcards/utils/3d-card';

interface AstrologyData {
  actualSign: string;
  behavioralSign: string;
  description: string;
  predictions: Array<{
    title: string;
    likelihood: number;
    reason: string;
  }>;
}

interface AstrologyCardProps {
  astrologyData: AstrologyData;
  title?: string;
  className?: string;
}

/**
 * AstrologyCard component displays astrological analysis in a 3D card with cosmic effects
 * 
 * @param astrologyData - Object containing astrology analysis and predictions
 * @param title - Optional custom title (defaults to "OUR TAKE ON ASTROLOGY (WE APOLOGIZE TO THE COSMOS)")
 * @param className - Optional additional CSS classes
 */
const AstrologyCard: React.FC<AstrologyCardProps> = ({ 
  astrologyData, 
  title = "OUR TAKE ON ASTROLOGY (WE APOLOGIZE TO THE COSMOS)",
  className = '' 
}) => {
  if (!astrologyData) {
    return null;
  }

  // Icon mapping for predictions based on content themes
  const getPredictionIcon = (predictionTitle: string, index: number) => {
    const lowerTitle = predictionTitle.toLowerCase();
    
    if (lowerTitle.includes('excel') || lowerTitle.includes('multidisciplinary')) {
      return <Zap className="w-5 h-5 text-pink-400" />;
    }
    if (lowerTitle.includes('anger') || lowerTitle.includes('struggle') || lowerTitle.includes('express')) {
      return <Heart className="w-5 h-5 text-pink-400" />;
    }
    if (lowerTitle.includes('philanthropic') || lowerTitle.includes('milestone')) {
      return <Gift className="w-5 h-5 text-pink-400" />;
    }
    if (lowerTitle.includes('pivot') || lowerTitle.includes('career') || lowerTitle.includes('change')) {
      return <RotateCcw className="w-5 h-5 text-pink-400" />;
    }
    if (lowerTitle.includes('mentorship') || lowerTitle.includes('bonds')) {
      return <Users className="w-5 h-5 text-pink-400" />;
    }
    
    // Default icons by index
    const icons = [
      <Zap className="w-5 h-5 text-pink-400" />,
      <Heart className="w-5 h-5 text-pink-400" />,
      <Gift className="w-5 h-5 text-pink-400" />,
      <RotateCcw className="w-5 h-5 text-pink-400" />,
      <Users className="w-5 h-5 text-pink-400" />
    ];
    return icons[index % icons.length];
  };

  // Get zodiac emoji
  const getZodiacEmoji = (sign: string) => {
    const zodiacMap: { [key: string]: string } = {
      'aries': '♈',
      'taurus': '♉',
      'gemini': '♊',
      'cancer': '♋',
      'leo': '♌',
      'virgo': '♍',
      'libra': '♎',
      'scorpio': '♏',
      'sagittarius': '♐',
      'capricorn': '♑',
      'aquarius': '♒',
      'pisces': '♓'
    };
    return zodiacMap[sign.toLowerCase()] || '⭐';
  };

  // Card styles following the established pattern
  const cardStyles = {
    wrapper: "relative w-full",
    corner: "absolute w-6 h-6",
    cornerTopLeft: "top-4 left-4 border-l-2 border-t-2 border-yellow-400 opacity-60",
    cornerTopRight: "top-4 right-4 border-r-2 border-t-2 border-yellow-400 opacity-60",
    cornerBottomLeft: "bottom-4 left-4 border-l-2 border-b-2 border-yellow-400 opacity-60",
    cornerBottomRight: "bottom-4 right-4 border-r-2 border-b-2 border-yellow-400 opacity-60",
    headerWrapper: "text-center mb-8",
    headerDot: "w-2 h-2 rounded-full mr-2 animate-pulse bg-yellow-400",
    headerTitle: "text-2xl font-bold text-transparent bg-clip-text tracking-wider bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400",
    headerDivider: "h-[1px] mx-auto bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-52",
    bottomAccent: "mt-8 flex justify-center",
    accentDot: "w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400",
    outerGlow: "absolute inset-0 rounded-3xl blur-xl -z-10 opacity-60 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
  };

  return (
    <div className={`${cardStyles.wrapper} ${className}`}>
      <CardContainer containerClassName="w-full py-4">
        <CardBody className="bg-gradient-to-br from-purple-900/90 via-violet-900/90 to-purple-900/90 rounded-3xl p-8 border border-purple-500/30 shadow-2xl overflow-hidden w-full">
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <CosmicParticles />
          </div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-yellow-500/20 opacity-75">
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-purple-900/95 via-violet-900/95 to-purple-900/95" />
          </div>

          {/* Corner decorations */}
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft}`}>
            <Star className="w-4 h-4 text-yellow-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight}`}>
            <Moon className="w-4 h-4 text-yellow-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft}`}>
            <Moon className="w-4 h-4 text-yellow-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight}`}>
            <Star className="w-4 h-4 text-yellow-400 opacity-60" />
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

            {/* Zodiac Comparison Section */}
            <CardItem translateZ="25" className="mb-8">
              <div className="p-6 rounded-xl bg-purple-800/20 border border-pink-500/20 hover:bg-purple-800/30 transition-all duration-300">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{getZodiacEmoji(astrologyData.actualSign)}</div>
                    <div className="text-yellow-400 font-semibold text-sm">Actual: {astrologyData.actualSign}</div>
                  </div>
                  <div className="text-purple-300 text-2xl">vs</div>
                  <div className="text-center">
                    <div className="text-3xl mb-2">{getZodiacEmoji(astrologyData.behavioralSign)}</div>
                    <div className="text-pink-400 font-semibold text-sm">Behavioral: {astrologyData.behavioralSign}</div>
                  </div>
                </div>
                <p className="text-purple-200 text-sm text-center leading-relaxed">
                  {astrologyData.description}
                </p>
              </div>
            </CardItem>

            {/* Predictions Section Header */}
            <CardItem translateZ="20" className="mb-6">
              <div className="text-center">
                <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 tracking-wider">
                  🎯 COSMIC PREDICTIONS
                </h4>
                <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-pink-400 to-transparent mt-2" />
              </div>
            </CardItem>

            {/* Predictions List */}
            <div className="space-y-4 w-full">
              {astrologyData.predictions.map((prediction, index) => (
                <CardItem
                  key={index}
                  translateZ={15 + index * 6}
                  className="group relative w-full"
                >
                  <div className="flex items-start space-x-4 p-5 rounded-xl bg-purple-800/20 border border-pink-500/20 hover:bg-purple-800/30 hover:border-pink-400/40 transition-all duration-300 w-full">
                    <CardItem translateZ={35}>
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-400/20 to-yellow-400/20 rounded-full flex items-center justify-center border border-pink-400/30 group-hover:border-pink-400/60 transition-all duration-300">
                          {getPredictionIcon(prediction.title, index)}
                        </div>
                      </div>
                    </CardItem>
                    
                    <CardItem translateZ={25} className="flex-1">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h5 className="text-pink-400 font-semibold text-lg group-hover:text-pink-300 transition-colors flex-1 mr-4">
                            {prediction.title}
                          </h5>
                          <div className="text-right flex-shrink-0">
                            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                              {prediction.likelihood}%
                            </div>
                            <div className="text-xs text-purple-300">likelihood</div>
                          </div>
                        </div>
                        
                        {/* Cosmic Progress Bar */}
                        <div className="relative">
                          <div className="h-2 bg-purple-700/50 rounded-full overflow-hidden border border-purple-600/30">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${prediction.likelihood}%` }}
                              transition={{ duration: 2, ease: [0.23, 1, 0.32, 1], delay: 0.5 + index * 0.2 }}
                              className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 relative overflow-hidden"
                            >
                              {/* Cosmic shimmer effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                            </motion.div>
                          </div>
                          
                          {/* Star markers */}
                          <div className="absolute inset-0 flex justify-between items-center px-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-2 h-2 ${prediction.likelihood > (i + 1) * 20 ? 'text-yellow-400' : 'text-purple-600'} opacity-60`}
                                fill="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-purple-200 text-sm leading-relaxed group-hover:text-purple-100 transition-colors">
                          <span className="text-pink-400 font-medium">Why:</span> {prediction.reason}
                        </p>
                      </div>
                    </CardItem>
                  </div>
                </CardItem>
              ))}
            </div>

            {/* Bottom accent */}
            <CardItem translateZ="40" className={cardStyles.bottomAccent}>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={cardStyles.accentDot}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </CardItem>
          </div>

          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none rounded-3xl" />
        </CardBody>

        {/* Outer glow effect */}
        <div className={cardStyles.outerGlow} />
      </CardContainer>
    </div>
  );
};

/**
 * Cosmic-themed floating particles component
 */
const CosmicParticles: React.FC = () => {
  const particles = Array.from({ length: 20 });
  
  return (
    <>
      {particles.map((_, i) => {
        const duration = Math.random() * 6 + 5;
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
              opacity: [0.1, 0.6, 0.1],
              scale: [0.5, 1.2, 0.5],
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
            {i % 5 === 0 ? (
              <Star className="w-2 h-2 text-yellow-400 opacity-40" fill="currentColor" />
            ) : i % 5 === 1 ? (
              <Moon className="w-2 h-2 text-purple-400 opacity-30" />
            ) : i % 5 === 2 ? (
              <Sparkles className="w-1 h-1 text-pink-400 opacity-50" />
            ) : i % 5 === 3 ? (
              <div className="w-1 h-1 bg-yellow-400 rounded-full opacity-40" />
            ) : (
              <div className="w-px h-px bg-purple-400 rounded-full opacity-60" />
            )}
          </motion.div>
        );
      })}
    </>
  );
};

export default AstrologyCard;