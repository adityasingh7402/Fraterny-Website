// /**
//  * MindCard.tsx
//  * Card component displaying the user's mind attributes with scores and insights
//  */
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Eye, Users, Shield, Zap, Sparkles } from 'lucide-react';
// import { mindCardVariants, mindItemVariants, progressVariants, hoverScale } from './utils/animations';
// import { getAttributeIcon, getScoreColor, cardStyles } from './utils/cardUtils';
// import { MindCardParticles } from './utils/particles';

// export interface MindCardAttribute {
//   name: string;
//   score: string;
//   insight: string;
// }

// export interface MindCardData {
//   personality?: string;
//   attribute: string[];
//   score: string[];
//   insight: string[];
// }

// interface MindCardProps {
//   data: MindCardData;
//   className?: string;
// }

// /**
//  * MindCard component displays a game-styled card with user's psychological attributes
//  * 
//  * @param data - Object containing personality attributes, scores and insights
//  * @param className - Optional additional CSS classes
//  */
// const MindCard: React.FC<MindCardProps> = ({ data, className = '' }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   // Prepare data in a more structured format
//   const attributes: MindCardAttribute[] = data.attribute.map((attr, index) => ({
//     name: attr,
//     score: data.score[index],
//     insight: data.insight[index]
//   }));

//   // Set visibility for animation after initial render
//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   // Icon mapping for attributes
//   const getIconComponent = (attribute: string) => {
//     const iconName = getAttributeIcon(attribute);
//     const iconMap: { [key: string]: React.ReactNode } = {
//       'Eye': <Eye className="w-5 h-5 text-cyan-400" />,
//       'Users': <Users className="w-5 h-5 text-cyan-400" />,
//       'Shield': <Shield className="w-5 h-5 text-cyan-400" />,
//       'Zap': <Zap className="w-5 h-5 text-cyan-400" />,
//       'Sparkles': <Sparkles className="w-5 h-5 text-cyan-400" />
//     };
    
//     return iconMap[iconName] || <Sparkles className="w-5 h-5 text-cyan-400" />;
//   };

//   return (
//     <div className={`relative w-full max-w-2xl mx-auto my-12 ${className}`}>
//       {/* Floating particles background */}
//       <MindCardParticles />

//       <motion.div
//         variants={mindCardVariants}
//         initial="hidden"
//         animate={isVisible ? "visible" : "hidden"}
//         whileHover={hoverScale}
//         className="relative"
//         style={{ perspective: '1000px' }}
//       >
//         {/* Main card container */}
//         <div className={`${cardStyles.card} ${cardStyles.mindCardTheme}`}>
          
//           {/* Animated border glow */}
//           <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-75">
//             <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95" />
//           </div>

//           {/* Corner decorations */}
//           <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft} ${cardStyles.cornerMind}`} />
//           <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight} ${cardStyles.cornerMind}`} />
//           <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft} ${cardStyles.cornerMind}`} />
//           <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight} ${cardStyles.cornerMind}`} />

//           {/* Content */}
//           <div className="relative z-10">
//             {/* Header */}
//             <motion.div 
//               variants={mindItemVariants}
//               className={cardStyles.headerWrapper}
//             >
//               <div className="flex items-center justify-center mb-2">
//                 <div className={`${cardStyles.headerDot} ${cardStyles.headerDotMind}`} />
//                 <h2 className={`${cardStyles.headerTitle} ${cardStyles.headerTitleMind}`}>
//                   MIND CARD
//                 </h2>
//                 <div className={`${cardStyles.headerDot} ${cardStyles.headerDotMind}`} />
//               </div>
//               <div className={`${cardStyles.headerDivider} ${cardStyles.headerDividerMind}`} />
//             </motion.div>

//             {/* Attributes Grid */}
//             <div className="space-y-6">
//               {attributes.map((attr, index) => {
//                 const IconComponent = getIconComponent(attr.name);
//                 const scorePercentage = parseInt(attr.score.split('/')[0]);
                
//                 return (
//                   <motion.div
//                     key={index}
//                     variants={mindItemVariants}
//                     className="group"
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center space-x-3">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity" />
//                           <div className="relative bg-slate-800/80 p-2 rounded-lg border border-cyan-500/30">
//                             {IconComponent}
//                           </div>
//                         </div>
//                         <span className="text-lg font-semibold text-white uppercase tracking-wider">
//                           {attr.name}
//                         </span>
//                       </div>
                      
//                       <div className="text-right">
//                         <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
//                           {scorePercentage}
//                         </span>
//                         <span className="text-slate-400 text-sm ml-1">/100</span>
//                       </div>
//                     </div>

//                     {/* Progress Bar */}
//                     <div className="relative">
//                       <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30">
//                         <motion.div
//                           custom={attr.score}
//                           variants={progressVariants}
//                           className={`h-full bg-gradient-to-r ${getScoreColor(attr.score)} relative overflow-hidden`}
//                         >
//                           {/* Shimmer effect using Tailwind */}
//                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
//                         </motion.div>
//                       </div>
                      
//                       {/* Progress segments */}
//                       <div className="absolute inset-0 flex">
//                         {[...Array(10)].map((_, i) => (
//                           <div key={i} className="flex-1 border-r border-slate-900/50 last:border-r-0" />
//                         ))}
//                       </div>
//                     </div>

//                     {/* Insight */}
//                     <motion.p 
//                       className="text-slate-300 text-sm mt-2 pl-11 opacity-80 group-hover:opacity-100 transition-opacity"
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 0.8, y: 0 }}
//                       transition={{ delay: index * 0.1 + 1 }}
//                     >
//                       {attr.insight}
//                     </motion.p>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             {/* Bottom accent */}
//             <motion.div 
//               variants={mindItemVariants}
//               className={cardStyles.bottomAccent}
//             >
//               <div className="flex space-x-1">
//                 {[...Array(5)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className={`${cardStyles.accentDot} ${cardStyles.accentDotMind}`}
//                     animate={{ opacity: [0.3, 1, 0.3] }}
//                     transition={{ 
//                       duration: 2, 
//                       repeat: Infinity, 
//                       delay: i * 0.2 
//                     }}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Holographic overlay */}
//           <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-3xl" />
//         </div>

//         {/* Outer glow effect */}
//         <div className={`${cardStyles.outerGlow} ${cardStyles.outerGlowMind}`} />
//       </motion.div>
//     </div>
//   );
// };

// export default MindCard;

/**
 * MindCard3D.tsx
 * 3D version of the mind card component with hover effects
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Users, Shield, Zap, Sparkles } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '../questresultcards/utils/3d-card';
import { mindCardVariants, mindItemVariants, progressVariants } from './utils/animations';
import { getAttributeIcon, getScoreColor, cardStyles } from './utils/cardUtils';
import { MindCardParticles } from './utils/particles';

export interface MindCardAttribute {
  name: string;
  score: string;
  insight: string;
}

export interface MindCardData {
  personality?: string;
  attribute: string[];
  score: string[];
  insight: string[];
}

interface MindCard3DProps {
  data: MindCardData;
  className?: string;
}

/**
 * MindCard3D component displays a 3D interactive card with user's psychological attributes
 * 
 * @param data - Object containing personality attributes, scores and insights
 * @param className - Optional additional CSS classes
 */
const MindCard3D: React.FC<MindCard3DProps> = ({ data, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Prepare data in a more structured format
  const attributes: MindCardAttribute[] = data.attribute.map((attr, index) => ({
    name: attr,
    score: data.score[index],
    insight: data.insight[index]
  }));

  // Set visibility for animation after initial render
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Icon mapping for attributes
  const getIconComponent = (attribute: string) => {
    const iconName = getAttributeIcon(attribute);
    const iconMap: { [key: string]: React.ReactNode } = {
      'Eye': <Eye className="w-5 h-5 text-cyan-400" />,
      'Users': <Users className="w-5 h-5 text-cyan-400" />,
      'Shield': <Shield className="w-5 h-5 text-cyan-400" />,
      'Zap': <Zap className="w-5 h-5 text-cyan-400" />,
      'Sparkles': <Sparkles className="w-5 h-5 text-cyan-400" />
    };
    
    return iconMap[iconName] || <Sparkles className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto my-12 ${className}`}>
      <CardContainer containerClassName="w-full py-4">
        <CardBody className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 rounded-3xl p-8 border border-cyan-500/30 shadow-2xl overflow-hidden w-full">
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <MindCardParticles />
          </div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-75">
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95" />
          </div>

          {/* Corner decorations */}
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft} ${cardStyles.cornerMind}`} />
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight} ${cardStyles.cornerMind}`} />
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft} ${cardStyles.cornerMind}`} />
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight} ${cardStyles.cornerMind}`} />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <CardItem
              translateZ="20"
              className={cardStyles.headerWrapper}
            >
              <div className="flex items-center justify-center mb-2">
                <div className={`${cardStyles.headerDot} ${cardStyles.headerDotMind}`} />
                <h2 className={`${cardStyles.headerTitle} ${cardStyles.headerTitleMind}`}>
                  MIND CARD
                </h2>
                <div className={`${cardStyles.headerDot} ${cardStyles.headerDotMind}`} />
              </div>
              <div className={`${cardStyles.headerDivider} ${cardStyles.headerDividerMind}`} />
            </CardItem>

            {/* Attributes Grid */}
            <div className="space-y-6 w-full">
              {attributes.map((attr, index) => {
                const IconComponent = getIconComponent(attr.name);
                const scorePercentage = parseInt(attr.score.split('/')[0]);
                
                return (
                  <CardItem
                    key={index}
                    translateZ={10 + index * 5}
                    className="group w-full"
                  >
                    <div className="flex items-center justify-between mb-3 w-full">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity" />
                          <div className="relative bg-slate-800/80 p-2 rounded-lg border border-cyan-500/30">
                            {IconComponent}
                          </div>
                        </div>
                        <span className="text-lg font-semibold text-white uppercase tracking-wider">
                          {attr.name}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                          {scorePercentage}
                        </span>
                        <span className="text-slate-400 text-sm ml-1">/100</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative w-full">
                      <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30 w-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${scorePercentage}%` }}
                          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
                          className={`h-full bg-gradient-to-r ${getScoreColor(attr.score)} relative overflow-hidden`}
                        >
                          {/* Shimmer effect using Tailwind */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                        </motion.div>
                      </div>
                      
                      {/* Progress segments */}
                      <div className="absolute inset-0 flex">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex-1 border-r border-slate-900/50 last:border-r-0" />
                        ))}
                      </div>
                    </div>

                    {/* Insight */}
                    <CardItem
                      translateZ={15 + index * 3}
                      className="text-slate-300 text-sm mt-2 pl-11 opacity-80 group-hover:opacity-100 transition-opacity w-full"
                    >
                      {attr.insight}
                    </CardItem>
                  </CardItem>
                );
              })}
            </div>

            {/* Bottom accent */}
            <CardItem
              translateZ="30"
              className={cardStyles.bottomAccent}
            >
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`${cardStyles.accentDot} ${cardStyles.accentDotMind}`}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.2 
                    }}
                  />
                ))}
              </div>
            </CardItem>
          </div>

          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-3xl" />
        </CardBody>

        {/* Outer glow effect */}
        <div className={`${cardStyles.outerGlow} ${cardStyles.outerGlowMind}`} />
      </CardContainer>
    </div>
  );
};

export default MindCard3D;