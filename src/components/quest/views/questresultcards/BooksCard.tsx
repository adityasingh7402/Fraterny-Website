/**
 * BooksCard.tsx
 * 3D card component displaying recommended books with vintage library styling
 */
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Book, FileText, PenTool, Bookmark } from 'lucide-react';
import { CardContainer, CardBody, CardItem } from '../questresultcards/utils/3d-card';

interface BooksCardProps {
  books: Array<{
    title: string;
    author: string;
    description?: string;
  }>;
  title?: string;
  className?: string;
}

/**
 * BooksCard component displays book recommendations in a 3D card with vintage library effects
 * 
 * @param books - Array of book objects with title, author, and optional description
 * @param title - Optional custom title (defaults to "BOOKS YOU'D LOVE IF YOU GAVE THEM A CHANCE")
 * @param className - Optional additional CSS classes
 */
const BooksCard: React.FC<BooksCardProps> = ({ 
  books, 
  title = "BOOKS YOU'D LOVE IF YOU GAVE THEM A CHANCE",
  className = '' 
}) => {
  if (!books || books.length === 0) {
    return null;
  }

  // Book spine colors for variety
  const getBookSpineColor = (index: number) => {
    const colors = [
      'from-amber-700 to-amber-800', // Atomic Habits - warm amber
      'from-blue-700 to-blue-800',   // Mindset - deep blue
      'from-green-700 to-green-800', // Flow - forest green
      'from-red-700 to-red-800',     // Additional book colors
      'from-purple-700 to-purple-800'
    ];
    return colors[index % colors.length];
  };

  // Book thickness variation
  const getBookThickness = (index: number) => {
    const thicknesses = ['w-16', 'w-20', 'w-18', 'w-22', 'w-16'];
    return thicknesses[index % thicknesses.length];
  };

  // Icon mapping for books
  const getBookIcon = (index: number) => {
    const icons = [
      <Book className="w-4 h-4 text-orange-200" />,
      <BookOpen className="w-4 h-4 text-orange-200" />,
      <FileText className="w-4 h-4 text-orange-200" />,
      <PenTool className="w-4 h-4 text-orange-200" />,
      <Bookmark className="w-4 h-4 text-orange-200" />
    ];
    return icons[index % icons.length];
  };

  // Default descriptions if not provided
  const getDefaultDescription = (title: string) => {
    const descriptions: { [key: string]: string } = {
      'Atomic Habits': 'Perfect for your systematic approach to improvement and your rapid learning abilities.',
      'Mindset': 'Aligns with your growth-oriented thinking and your ability to bridge different domains.',
      'Flow': 'Matches your focus on peak performance in both research and cricket pursuits.'
    };
    return descriptions[title] || 'A book that resonates with your unique perspective and goals.';
  };

  // Card styles following the established pattern
  const cardStyles = {
    wrapper: "relative w-full",
    corner: "absolute w-6 h-6",
    cornerTopLeft: "top-4 left-4 border-l-2 border-t-2 border-orange-400 opacity-60",
    cornerTopRight: "top-4 right-4 border-r-2 border-t-2 border-orange-400 opacity-60",
    cornerBottomLeft: "bottom-4 left-4 border-l-2 border-b-2 border-orange-400 opacity-60",
    cornerBottomRight: "bottom-4 right-4 border-r-2 border-b-2 border-orange-400 opacity-60",
    headerWrapper: "text-center mb-8",
    headerDot: "w-2 h-2 rounded-full mr-2 animate-pulse bg-orange-400",
    headerTitle: "text-2xl font-bold text-transparent bg-clip-text tracking-wider bg-gradient-to-r from-orange-400 via-amber-400 to-orange-400",
    headerDivider: "h-[1px] mx-auto bg-gradient-to-r from-transparent via-orange-400 to-transparent w-44",
    bottomAccent: "mt-8 flex justify-center",
    accentDot: "w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400",
    outerGlow: "absolute inset-0 rounded-3xl blur-xl -z-10 opacity-60 bg-gradient-to-r from-amber-500/20 to-orange-500/20"
  };

  return (
    <div className={`${cardStyles.wrapper} ${className}`}>
      <CardContainer containerClassName="w-full py-4">
        <CardBody className="bg-gradient-to-br from-amber-900/90 via-orange-900/90 to-amber-900/90 rounded-3xl p-8 border border-amber-500/30 shadow-2xl overflow-hidden w-full">
          {/* Floating particles background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <LibraryParticles />
          </div>
          
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 opacity-75">
            <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-amber-900/95 via-orange-900/95 to-amber-900/95" />
          </div>

          {/* Corner decorations */}
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopLeft}`}>
            <BookOpen className="w-4 h-4 text-orange-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerTopRight}`}>
            <BookOpen className="w-4 h-4 text-orange-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomLeft}`}>
            <BookOpen className="w-4 h-4 text-orange-400 opacity-60" />
          </div>
          <div className={`${cardStyles.corner} ${cardStyles.cornerBottomRight}`}>
            <BookOpen className="w-4 h-4 text-orange-400 opacity-60" />
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

            {/* Books Shelf */}
            <div className="space-y-6 w-full">
              {books.map((book, index) => {
                const description = book.description || getDefaultDescription(book.title);
                
                return (
                  <CardItem
                    key={index}
                    translateZ={20 + index * 8}
                    className="group relative w-full"
                  >
                    <div className="p-6 rounded-xl bg-amber-800/20 border border-orange-500/20 hover:bg-amber-800/30 hover:border-orange-400/40 transition-all duration-300 w-full">
                      <div className="flex items-start space-x-6">
                        {/* Book Spine */}
                        
                        
                        {/* Book Details */}
                        <CardItem translateZ={25} className="flex-1">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-orange-300 font-bold text-xl group-hover:text-orange-200 transition-colors">
                                {book.title}
                              </h4>
                              <p className="text-amber-400 text-sm font-medium">
                                by {book.author}
                              </p>
                            </div>
                            
                            {/* Book Description */}
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ 
                                opacity: 1, 
                                height: 'auto'
                              }}
                              transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                              className="overflow-hidden"
                            >
                              <p className="text-amber-200 text-sm leading-relaxed group-hover:text-amber-100 transition-colors">
                                {description}
                              </p>
                            </motion.div>
                          </div>
                        </CardItem>
                      </div>
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
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 via-transparent to-amber-500/5 pointer-events-none rounded-3xl" />
        </CardBody>

        {/* Outer glow effect */}
        <div className={cardStyles.outerGlow} />
      </CardContainer>
    </div>
  );
};

/**
 * Library-themed floating particles component
 */
const LibraryParticles: React.FC = () => {
  const particles = Array.from({ length: 18 });
  
  return (
    <>
      {particles.map((_, i) => {
        const duration = Math.random() * 5 + 4;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const moveX = Math.random() * 25;
        const moveY = Math.random() * 25;
        
        return (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              x: [0, moveX, -moveX, 0],
              y: [0, -moveY, moveY, 0],
              opacity: [0.1, 0.4, 0.1],
              rotate: [0, 360]
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
            {i % 6 === 0 ? (
              <BookOpen className="w-2 h-2 text-orange-400 opacity-30" />
            ) : i % 6 === 1 ? (
              <Book className="w-2 h-2 text-amber-400 opacity-25" />
            ) : i % 6 === 2 ? (
              <PenTool className="w-1 h-1 text-orange-400 opacity-40" />
            ) : i % 6 === 3 ? (
              <Bookmark className="w-1 h-1 text-amber-400 opacity-35" />
            ) : i % 6 === 4 ? (
              <div className="w-1 h-3 bg-amber-400 opacity-20 rounded-full" />
            ) : (
              <div className="w-px h-px bg-orange-400 rounded-full opacity-50" />
            )}
          </motion.div>
        );
      })}
    </>
  );
};

export default BooksCard;