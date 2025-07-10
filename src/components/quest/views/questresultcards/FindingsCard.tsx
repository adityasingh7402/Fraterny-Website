// /**
//  * FindingsCard.tsx
//  * Card component displaying thought-provoking findings about the user
//  */
// import React from 'react';
// import { motion } from 'framer-motion';
// import { cardVariants, itemVariants, hoverScale } from './utils/animations';
// import { cardStyles } from './utils/cardUtils';
// import { FindingsCardParticles } from './utils/particles';

// interface FindingsCardProps {
//   findings: string[];
//   title?: string;
//   className?: string;
// }

// /**
//  * FindingsCard component displays thought-provoking findings in a styled purple-themed card
//  * 
//  * @param findings - Array of findings to display
//  * @param title - Optional custom title (defaults to "THOUGHT PROVOKING FINDINGS")
//  * @param className - Optional additional CSS classes
//  */
// const FindingsCard: React.FC<FindingsCardProps> = ({ 
//   findings, 
//   title = "THOUGHT PROVOKING FINDINGS",
//   className = '' 
// }) => {
//   if (!findings || findings.length === 0) {
//     return null;
//   }

//   return (
//     <div className={`${cardStyles.wrapper} ${className}`}>
//       {/* Floating particles background */}
//       <FindingsCardParticles />

//       <motion.div
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={hoverScale}
//         className="relative"
//       >
//         <div className={`${cardStyles.card} ${cardStyles.findingsCardTheme}`}>
          
//           {/* Animated border glow */}
//           <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-75">
//             <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-900/95" />
//           </div>

//           {/* Corner decorations */}
//           <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft} ${cardStyles.cornerFindings}`} />
//           <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight} ${cardStyles.cornerFindings}`} />
//           <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft} ${cardStyles.cornerFindings}`} />
//           <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight} ${cardStyles.cornerFindings}`} />

//           <div className="relative z-10">
//             {/* Header */}
//             <motion.div variants={itemVariants} className={cardStyles.headerWrapper}>
//               <div className="flex items-center justify-center mb-2">
//                 <div className={`${cardStyles.headerDot} ${cardStyles.headerDotFindings}`} />
//                 <h3 className={`${cardStyles.headerTitle} ${cardStyles.headerTitleFindings}`}>
//                   {title}
//                 </h3>
//                 <div className={`${cardStyles.headerDot} ${cardStyles.headerDotFindings}`} />
//               </div>
//               <div className={`${cardStyles.headerDivider} ${cardStyles.headerDividerFindings}`} />
//             </motion.div>

//             {/* Findings List */}
//             <div className="space-y-4">
//               {findings.map((finding, index) => (
//                 <motion.div
//                   key={index}
//                   variants={itemVariants}
//                   className="group relative"
//                 >
//                   <div className="flex items-start space-x-4 p-4 rounded-xl bg-purple-800/20 border border-purple-500/20 hover:bg-purple-800/30 transition-all duration-300">
//                     <div className="flex-shrink-0 mt-1">
//                       <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
//                         <span className="text-white font-bold text-sm">{index + 1}</span>
//                       </div>
//                     </div>
//                     <p className="text-slate-200 text-sm leading-relaxed group-hover:text-white transition-colors">
//                       {finding}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Bottom accent */}
//             <motion.div variants={itemVariants} className={cardStyles.bottomAccent}>
//               <div className="flex space-x-1">
//                 {[...Array(3)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className={`${cardStyles.accentDot} ${cardStyles.accentDotFindings}`}
//                     animate={{ opacity: [0.3, 1, 0.3] }}
//                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Holographic overlay */}
//           <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none rounded-3xl" />
//         </div>

//         {/* Outer glow effect */}
//         <div className={`${cardStyles.outerGlow} ${cardStyles.outerGlowFindings}`} />
//       </motion.div>
//     </div>
//   );
// };

// export default FindingsCard;


/**
 * FindingsCard3D.tsx
 * 3D version of the findings card component with hover effects
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from '../questresultcards/utils/3d-card';
import { cardStyles } from './utils/cardUtils';
import { FindingsCardParticles } from './utils/particles';

interface FindingsCardProps {
  findings: string[];
  title?: string;
  className?: string;
}

/**
 * FindingsCard3D component displays thought-provoking findings in a 3D card with hover effects
 * 
 * @param findings - Array of findings to display
 * @param title - Optional custom title (defaults to "THOUGHT PROVOKING FINDINGS")
 * @param className - Optional additional CSS classes
 */
const FindingsCard: React.FC<FindingsCardProps> = ({ 
  findings, 
  title = "THOUGHT PROVOKING FINDINGS",
  className = '' 
}) => {
  if (!findings || findings.length === 0) {
    return null;
  }

  return (
    <div className={`${cardStyles.wrapper} ${className}`}>
      <CardContainer containerClassName="w-full py-4">
        <CardBody className="bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-900/90 rounded-3xl p-8 border border-purple-500/30 shadow-2xl overflow-hidden w-full">
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <FindingsCardParticles />
          </div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-75">
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-900/95" />
          </div>

          {/* Corner decorations */}
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft} ${cardStyles.cornerFindings}`} />
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight} ${cardStyles.cornerFindings}`} />
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft} ${cardStyles.cornerFindings}`} />
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight} ${cardStyles.cornerFindings}`} />

          <div className="relative z-10">
            {/* Header */}
            <CardItem 
              translateZ="20" 
              className={cardStyles.headerWrapper}
            >
              <div className="flex items-center justify-center mb-2">
                <div className={`${cardStyles.headerDot} ${cardStyles.headerDotFindings}`} />
                <h3 className={`${cardStyles.headerTitle} ${cardStyles.headerTitleFindings}`}>
                  {title}
                </h3>
                <div className={`${cardStyles.headerDot} ${cardStyles.headerDotFindings}`} />
              </div>
              <div className={`${cardStyles.headerDivider} ${cardStyles.headerDividerFindings}`} />
            </CardItem>

            {/* Findings List */}
            <div className="space-y-4 w-full">
              {findings.map((finding, index) => (
                <CardItem
                  key={index}
                  translateZ={15 + index * 5}
                  className="group relative w-full"
                >
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-purple-800/20 border border-purple-500/20 hover:bg-purple-800/30 transition-all duration-300 w-full">
                    <CardItem translateZ={30}>
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                      </div>
                    </CardItem>
                    <CardItem translateZ={20} className="w-full">
                      <p className="text-slate-200 text-sm leading-relaxed group-hover:text-white transition-colors">
                        {finding}
                      </p>
                    </CardItem>
                  </div>
                </CardItem>
              ))}
            </div>

            {/* Bottom accent */}
            <CardItem translateZ="30" className={cardStyles.bottomAccent}>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`${cardStyles.accentDot} ${cardStyles.accentDotFindings}`}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </CardItem>
          </div>

          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none rounded-3xl" />
        </CardBody>

        {/* Outer glow effect */}
        <div className={`${cardStyles.outerGlow} ${cardStyles.outerGlowFindings}`} />
      </CardContainer>
    </div>
  );
};

export default FindingsCard;