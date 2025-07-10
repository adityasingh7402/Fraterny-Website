// /**
//  * QuotesCard.tsx
//  * Card component displaying philosophical quotes that mirror the user's psyche
//  */
// import React from 'react';
// import { motion } from 'framer-motion';
// import { cardVariants, itemVariants, hoverScale } from './utils/animations';
// import { cardStyles } from './utils/cardUtils';
// import { QuotesCardParticles } from './utils/particles';

// interface QuotesCardProps {
//   quotes: string[];
//   title?: string;
//   className?: string;
// }

// /**
//  * QuotesCard component displays philosophical quotes in a styled green-themed card
//  * 
//  * @param quotes - Array of philosophical quotes to display
//  * @param title - Optional custom title (defaults to "PHILOSOPHICAL MIRRORS")
//  * @param className - Optional additional CSS classes
//  */
// const QuotesCard: React.FC<QuotesCardProps> = ({ 
//   quotes, 
//   title = "PHILOSOPHICAL MIRRORS",
//   className = '' 
// }) => {
//   if (!quotes || quotes.length === 0) {
//     return null;
//   }

//   return (
//     <div className={`${cardStyles.wrapper} ${className}`}>
//       {/* Floating particles background */}
//       <QuotesCardParticles />

//       <motion.div
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={hoverScale}
//         className="relative"
//       >
//         <div className={`${cardStyles.card} ${cardStyles.quotesCardTheme}`}>
          
//           {/* Animated border glow */}
//           <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 opacity-75">
//             <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-emerald-900/95 via-teal-900/95 to-emerald-900/95" />
//           </div>

//           {/* Corner decorations */}
//           <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft} ${cardStyles.cornerQuotes}`} />
//           <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight} ${cardStyles.cornerQuotes}`} />
//           <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft} ${cardStyles.cornerQuotes}`} />
//           <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight} ${cardStyles.cornerQuotes}`} />

//           <div className="relative z-10">
//             {/* Header */}
//             <motion.div variants={itemVariants} className={cardStyles.headerWrapper}>
//               <div className="flex items-center justify-center mb-2">
//                 <div className={`${cardStyles.headerDot} ${cardStyles.headerDotQuotes}`} />
//                 <h3 className={`${cardStyles.headerTitle} ${cardStyles.headerTitleQuotes}`}>
//                   {title}
//                 </h3>
//                 <div className={`${cardStyles.headerDot} ${cardStyles.headerDotQuotes}`} />
//               </div>
//               <div className={`${cardStyles.headerDivider} ${cardStyles.headerDividerQuotes}`} />
//             </motion.div>

//             {/* Quotes List */}
//             <div className="space-y-4">
//               {quotes.map((quote, index) => (
//                 <motion.div
//                   key={index}
//                   variants={itemVariants}
//                   className="group relative"
//                 >
//                   <div className="p-4 rounded-xl bg-emerald-800/20 border border-emerald-500/20 hover:bg-emerald-800/30 transition-all duration-300">
//                     <div className="relative">
//                       <div className="absolute -left-1 -top-1 text-2xl text-emerald-400/40 font-serif">"</div>
//                       <p className="text-slate-200 text-sm leading-relaxed pl-4 group-hover:text-white transition-colors italic">
//                         {quote}
//                       </p>
//                       <div className="absolute -right-1 -bottom-2 text-2xl text-emerald-400/40 font-serif">"</div>
//                     </div>
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
//                     className={`${cardStyles.accentDot} ${cardStyles.accentDotQuotes}`}
//                     animate={{ opacity: [0.3, 1, 0.3] }}
//                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Holographic overlay */}
//           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none rounded-3xl" />
//         </div>

//         {/* Outer glow effect */}
//         <div className={`${cardStyles.outerGlow} ${cardStyles.outerGlowQuotes}`} />
//       </motion.div>
//     </div>
//   );
// };

// export default QuotesCard;

/**
 * FindingsCard3D.tsx
 * 3D version of the findings card component with hover effects
 */
import React from 'react';
import { motion } from 'framer-motion';
import { CardContainer, CardBody, CardItem } from '../questresultcards/utils/3d-card';
import { cardStyles } from './utils/cardUtils';
import { QuotesCardParticles } from './utils/particles';

interface FindingsCardProps {
  quotes: string[];
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
  quotes, 
  title = "PHILOSOPHICAL MIRRORS",
  className = '' 
}) => {
  if (!quotes || quotes.length === 0) {
    return null;
  }

  return (
    <div className={`${cardStyles.wrapper} ${className}`}>
      <CardContainer containerClassName="w-full py-4">
  <CardBody className="bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-emerald-900/90 rounded-3xl p-8 border border-emerald-500/30 shadow-2xl overflow-hidden w-full">
    {/* Floating particles background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <QuotesCardParticles />
    </div>
    
    {/* Animated border glow */}
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 opacity-75">
      <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-emerald-900/95 via-teal-900/95 to-emerald-900/95" />
    </div>

    {/* Corner decorations */}
    <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft} ${cardStyles.cornerQuotes}`} />
    <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight} ${cardStyles.cornerQuotes}`} />
    <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft} ${cardStyles.cornerQuotes}`} />
    <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight} ${cardStyles.cornerQuotes}`} />

    <div className="relative z-10">
      {/* Header */}
      <CardItem 
        translateZ="20" 
        className={cardStyles.headerWrapper}
      >
        <div className="flex items-center justify-center mb-2">
          <div className={`${cardStyles.headerDot} ${cardStyles.headerDotQuotes}`} />
          <h3 className={`${cardStyles.headerTitle} ${cardStyles.headerTitleQuotes}`}>
            {title}
          </h3>
          <div className={`${cardStyles.headerDot} ${cardStyles.headerDotQuotes}`} />
        </div>
        <div className={`${cardStyles.headerDivider} ${cardStyles.headerDividerQuotes}`} />
      </CardItem>

      {/* Quotes List */}
      <div className="space-y-4 w-full">
        {quotes.map((quote, index) => (
          <CardItem
            key={index}
            translateZ={15 + index * 5}
            className="group relative w-full"
          >
            <div className="p-4 rounded-xl bg-emerald-800/20 border border-emerald-500/20 hover:bg-emerald-800/30 transition-all duration-300 w-full">
              <div className="relative">
                <CardItem translateZ={25}>
                  <div className="absolute -left-1 -top-1 text-2xl text-emerald-400/40 font-serif">"</div>
                </CardItem>
                <CardItem translateZ={20} className="w-full">
                  <p className="text-slate-200 text-sm leading-relaxed pl-4 group-hover:text-white transition-colors italic">
                    {quote}
                  </p>
                </CardItem>
                <CardItem translateZ={25}>
                  <div className="absolute -right-1 -bottom-2 text-2xl text-emerald-400/40 font-serif">"</div>
                </CardItem>
              </div>
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
              className={`${cardStyles.accentDot} ${cardStyles.accentDotQuotes}`}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}
        </div>
      </CardItem>
    </div>

    {/* Holographic overlay */}
    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none rounded-3xl" />
  </CardBody>

  {/* Outer glow effect */}
  <div className={`${cardStyles.outerGlow} ${cardStyles.outerGlowQuotes}`} />
</CardContainer>
    </div>
  );
};

export default FindingsCard;