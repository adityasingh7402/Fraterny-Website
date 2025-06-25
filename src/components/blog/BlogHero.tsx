
// import React from 'react';

// interface BlogHeroProps {
//   totalPosts?: number;
// }

// const BlogHero: React.FC<BlogHeroProps> = ({ totalPosts }) => {
//   return (
//     <section className="pt-32 pb-16 bg-navy text-white relative">
//       {/* Background with gradient overlay */}
//       <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
//            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560177112-fbfd5fde9566?auto=format&fit=crop&w=1920&q=80')" }}>
//       </div>
      
//       {/* Gradient overlay */}
//       <div className="absolute inset-0" 
//            style={{
//              background: `linear-gradient(to right, 
//                rgba(10, 26, 47, 0.95) 0%,
//                rgba(10, 26, 47, 0.8) 50%,
//                rgba(10, 26, 47, 0.6) 100%
//              )`
//            }}>
//       </div>
      
//       <div className="container mx-auto px-6 relative z-10">
//         <div className="max-w-3xl">
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
//             Our Blog
//           </h1>
//           <p className="text-xl md:text-2xl text-gray-300">
//             Insights, stories, and perspectives from our community
//             {totalPosts !== undefined && (
//               <span className="ml-2 text-lg text-terracotta">({totalPosts} posts)</span>
//             )}
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BlogHero;


import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';

interface BlogHeroProps {
  totalPosts?: number;
}

const BlogHero: React.FC<BlogHeroProps> = ({ totalPosts }) => {
  // Scroll-based parallax effects (same as homepage/experience)
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.95, 0.7]);

  // Main title animation
  const titleAnimation = useSectionRevealAnimation({
    variant: 'slide-right',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.8,
    mobile: { variant: 'fade-up', duration: 0.6 }
  });

  // Subtitle animation
  const subtitleAnimation = useSectionRevealAnimation({
    variant: 'fade-right',
    once: false,
    threshold: { desktop: 0.4, mobile: 0.3 },
    delayChildren: 0.2,
    duration: 0.6
  });

  // Post counter animation
  const counterAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.5, mobile: 0.4 },
    delayChildren: 0.4,
    duration: 0.6
  });

  // Animated counter for total posts
  const renderPostCount = () => {
    if (totalPosts === undefined) {
      return (
        <motion.div 
          className="animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="h-6 w-24 bg-terracotta/30 rounded"></div>
        </motion.div>
      );
    }

    return (
      <motion.span 
        className="text-lg text-terracotta font-medium"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 200, 
          damping: 10,
          delay: 0.2 
        }}
      >
        ({totalPosts} {totalPosts === 1 ? 'post' : 'posts'})
      </motion.span>
    );
  };

  return (
    <section className="pt-32 pb-16 bg-navy text-white relative overflow-hidden">
      {/* Background with parallax effect */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ 
          y: backgroundY,
          backgroundImage: "url('https://images.unsplash.com/photo-1560177112-fbfd5fde9566?auto=format&fit=crop&w=1920&q=80')"
        }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.3, ease: "easeOut" }}
      />
      
      {/* Enhanced gradient overlay with scroll opacity */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          opacity: overlayOpacity,
          background: `linear-gradient(to right, 
            rgba(10, 26, 47, 0.95) 0%,
            rgba(10, 26, 47, 0.8) 50%,
            rgba(10, 26, 47, 0.6) 100%
          )`
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl">
          
          {/* Title with scroll-triggered animation */}
          <motion.div
            ref={titleAnimation.ref}
            variants={titleAnimation.parentVariants}
            initial="hidden"
            animate={titleAnimation.controls}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-6"
              variants={titleAnimation.childVariants}
            >
              Our Blog
            </motion.h1>
          </motion.div>

          {/* Subtitle with separate scroll trigger */}
          <motion.div
            ref={subtitleAnimation.ref}
            variants={subtitleAnimation.parentVariants}
            initial="hidden"
            animate={subtitleAnimation.controls}
          >
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-4"
              variants={subtitleAnimation.childVariants}
            >
              Insights, stories, and perspectives from our community
            </motion.p>
          </motion.div>
          
          {/* Post counter with fade-up animation */}
          {/* <motion.div
            ref={counterAnimation.ref}
            variants={counterAnimation.parentVariants}
            initial="hidden"
            animate={counterAnimation.controls}
          >
            <motion.div 
              className="inline-flex items-center"
              variants={counterAnimation.childVariants}
            >
              {renderPostCount()}
            </motion.div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
};

export default BlogHero;