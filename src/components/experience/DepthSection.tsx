
// import React from 'react';
// import { Code, Brain, BookOpen, FileCheck, Users, Heart, ChefHat, Users2 } from 'lucide-react';
// import { useIsMobile } from '../../hooks/use-mobile';
// import ResponsiveImage from '../ui/ResponsiveImage';

// const depthFeatures = [
//   { 
//     icon: <Code className="w-6 h-6" />, 
//     title: "Ingrained House Code", 
//     description: "Crafted house rules to boost engagement, clarity of thought and productivity",
//     dynamicKey: "depth-house-code",
//     imageSrc: {
//       mobile: "/images/depth/house-code-mobile.webp",
//       desktop: "/images/depth/house-code-desktop.webp"
//     },
//     imageAlt: "Entrepreneurs discussing house rules in a premium workspace"
//   },
//   { 
//     icon: <Brain className="w-6 h-6" />, 
//     title: "Startup Simulations", 
//     description: "Building a startup from ground up in a team environment",
//     dynamicKey: "depth-startup",
//     imageSrc: {
//       mobile: "/images/depth/startup-mobile.webp", 
//       desktop: "/images/depth/startup-desktop.webp"
//     },
//     imageAlt: "Team engaging in startup simulation exercises"
//   },
//   { 
//     icon: <BookOpen className="w-6 h-6" />, 
//     title: "Learning Experience", 
//     description: "Business Knowledge is not even a unique proposition, its a given",
//     dynamicKey: "depth-learning",
//     imageSrc: {
//       mobile: "/images/depth/learning-mobile.webp",
//       desktop: "/images/depth/learning-desktop.webp"
//     },
//     imageAlt: "Knowledge sharing session among entrepreneurs"
//   },
//   { 
//     icon: <FileCheck className="w-6 h-6" />, 
//     title: "Curated frameworks & templates", 
//     description: "Carefully crafted Frameworks for personal and career growth",
//     dynamicKey: "depth-frameworks",
//     imageSrc: {
//       mobile: "/images/depth/frameworks-mobile.webp",
//       desktop: "/images/depth/frameworks-desktop.webp"
//     },
//     imageAlt: "Organized workspace with growth framework materials"
//   },
//   { 
//     icon: <Users className="w-6 h-6" />, 
//     title: "Group Think", 
//     description: "Collaborative thinking and team activities to broaden your perspective",
//     dynamicKey: "depth-group-think",
//     imageSrc: {
//       mobile: "/images/depth/group-think-mobile.webp",
//       desktop: "/images/depth/group-think-desktop.webp"
//     },
//     imageAlt: "Collaborative brainstorming session in progress"
//   },
//   { 
//     icon: <Heart className="w-6 h-6" />, 
//     title: "Lifelong memories", 
//     description: "Feel amazing while on the grind",
//     dynamicKey: "depth-memories",
//     imageSrc: {
//       mobile: "/images/depth/memories-mobile.webp",
//       desktop: "/images/depth/memories-desktop.webp"
//     },
//     imageAlt: "Participants sharing meaningful moments together"
//   },
//   { 
//     icon: <ChefHat className="w-6 h-6" />, 
//     title: "Great Food, Good Coffee and more", 
//     description: "Caffeine is the secret of my energy",
//     dynamicKey: "depth-food",
//     imageSrc: {
//       mobile: "/images/depth/food-mobile.webp",
//       desktop: "/images/depth/food-desktop.webp"
//     },
//     imageAlt: "Premium dining experience with gourmet food"
//   },
//   { 
//     icon: <Users2 className="w-6 h-6" />, 
//     title: "Post Program Community", 
//     description: "Fraterny is not a one week experience, it is a constantly growing ecosystem.",
//     dynamicKey: "depth-community",
//     imageSrc: {
//       mobile: "/images/depth/community-mobile.webp",
//       desktop: "/images/depth/community-desktop.webp"
//     },
//     imageAlt: "Alumni networking and continued community building"
//   },
//   { 
//     icon: <Brain className="w-6 h-6" />, 
//     title: "Soft Skills", 
//     description: "Critical Thinking, Effective Communication and Empathy. Everyone has principles, no one offers practice",
//     dynamicKey: "depth-soft-skills",
//     imageSrc: {
//       mobile: "/images/depth/soft-skills-mobile.webp",
//       desktop: "/images/depth/soft-skills-desktop.webp"
//     },
//     imageAlt: "Soft skills workshop in an elegant setting"
//   },
// ];

// const DepthSection = () => {
//   const isMobile = useIsMobile();
  
//   return (
//     <section className={`${isMobile ? 'pt-6 pb-16' : 'py-16'} bg-white`}>
//       <div className="container mx-auto px-6">
//         <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">
//           Designed for Depth
//         </h2>
        
//         {isMobile ? (
//           <div className="space-y-6">
//             {depthFeatures.map((feature, index) => (
//               <React.Fragment key={index}>
//                 <div 
//                   className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
//                 >
//                   <div className="bg-terracotta bg-opacity-10 p-4 rounded-full mb-4">
//                     <div className="text-terracotta">{feature.icon}</div>
//                   </div>
//                   <h3 className="font-medium text-navy text-lg mb-3">{feature.title}</h3>
//                   <p className="text-gray-600">{feature.description}</p>
//                 </div>
                
//                 <div className="aspect-[16/9] w-full overflow-hidden rounded-xl shadow-md">
//                   <ResponsiveImage 
//                     dynamicKey={feature.dynamicKey}
//                     alt={feature.imageAlt}
//                     className="w-full h-full object-cover"
//                     loading="lazy"
//                   />
//                 </div>
//               </React.Fragment>
//             ))}
//           </div>
//         ) : (
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {depthFeatures.map((feature, index) => (
//               <div 
//                 key={index} 
//                 className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
//               >
//                 <div className="bg-terracotta bg-opacity-10 p-4 rounded-full mb-4">
//                   <div className="text-terracotta">{feature.icon}</div>
//                 </div>
//                 <h3 className="font-medium text-navy text-lg mb-3">{feature.title}</h3>
//                 <p className="text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default DepthSection;


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Brain, BookOpen, FileCheck, Users, Heart, ChefHat, Users2 } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';
import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';
import ResponsiveImage from '../ui/ResponsiveImage';

const depthFeatures = [
  { 
    icon: <Code className="w-6 h-6" />, 
    title: "Quest Entry", 
    description: "Begin with Quest by Fraterny. Your profile casts you into a tailored archetype for the week.",
    dynamicKey: "depth-house-code",
    imageSrc: {
      mobile: "/images/depth/house-code-mobile.webp",
      desktop: "/images/depth/house-code-desktop.webp"
    },
    imageAlt: "Entrepreneurs discussing house rules in a premium workspace"
  },
  { 
    icon: <Brain className="w-6 h-6" />, 
    title: "Ingrained House Code", 
    description: "Psychology-backed house rules to boost engagement, clarity of thought and productivity",
    dynamicKey: "depth-startup",
    imageSrc: {
      mobile: "/images/depth/startup-mobile.webp", 
      desktop: "/images/depth/startup-desktop.webp"
    },
    imageAlt: "Team engaging in startup simulation exercises"
  },
  { 
    icon: <BookOpen className="w-6 h-6" />, 
    title: "Archetype Role-Play", 
    description: "Embody your assigned character in real situations, improv activities, debates, poker, parties and live it fully.",
    dynamicKey: "depth-learning",
    imageSrc: {
      mobile: "/images/depth/learning-mobile.webp",
      desktop: "/images/depth/learning-desktop.webp"
    },
    imageAlt: "Knowledge sharing session among entrepreneurs"
  },
  { 
    icon: <FileCheck className="w-6 h-6" />, 
    title: "Signature Nights", 
    description: "Sunsets, deep talks, challenges and parties - making memories that doubles social-skill practice.",
    dynamicKey: "depth-frameworks",
    imageSrc: {
      mobile: "/images/depth/frameworks-mobile.webp",
      desktop: "/images/depth/frameworks-desktop.webp"
    },
    imageAlt: "Organized workspace with growth framework materials"
  },
  { 
    icon: <Users className="w-6 h-6" />, 
    title: "Group Think", 
    description: "Collaborative thinking and team activities to broaden your mindset",
    dynamicKey: "depth-group-think",
    imageSrc: {
      mobile: "/images/depth/group-think-mobile.webp",
      desktop: "/images/depth/group-think-desktop.webp"
    },
    imageAlt: "Collaborative brainstorming session in progress"
  },
  { 
    icon: <Heart className="w-6 h-6" />, 
    title: "Squad Dynamics", 
    description: "Groups engineered from Quest results to maximize bonding, chemistry and perspective shifts.",
    dynamicKey: "depth-memories",
    imageSrc: {
      mobile: "/images/depth/memories-mobile.webp",
      desktop: "/images/depth/memories-desktop.webp"
    },
    imageAlt: "Participants sharing meaningful moments together"
  },
  { 
    icon: <ChefHat className="w-6 h-6" />, 
    title: "Great Food, Good Coffee and more", 
    description: "Caffeine is my fuel for clear thinking.",
    dynamicKey: "depth-food",
    imageSrc: {
      mobile: "/images/depth/food-mobile.webp",
      desktop: "/images/depth/food-desktop.webp"
    },
    imageAlt: "Premium dining experience with gourmet food"
  },
  { 
    icon: <Users2 className="w-6 h-6" />, 
    title: "Post Program Community", 
    description: "The villa ends; the tribe continues—alumni circles, challenges and collabs by matching archetypes.",
    dynamicKey: "depth-community",
    imageSrc: {
      mobile: "/images/depth/community-mobile.webp",
      desktop: "/images/depth/community-desktop.webp"
    },
    imageAlt: "Alumni networking and continued community building"
  },
  { 
    icon: <Brain className="w-6 h-6" />, 
    title: "Life Skills", 
    description: "Critical Thinking, Effective Communication and Empathy. Everyone has principles, no one offers practice",
    dynamicKey: "depth-soft-skills",
    imageSrc: {
      mobile: "/images/depth/soft-skills-mobile.webp",
      desktop: "/images/depth/soft-skills-desktop.webp"
    },
    imageAlt: "Soft skills workshop in an elegant setting"
  },
];

const DepthSection = () => {
  const isMobile = useIsMobile();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Progressive image loading for mobile view
  useEffect(() => {
    if (isMobile) {
      const loadImage = (index: number) => {
        setTimeout(() => {
          setLoadedImages(prev => new Set(prev).add(index));
        }, 600 + (index * 300)); // Start at 600ms, then every 300ms
      };

      depthFeatures.forEach((_, index) => {
        loadImage(index);
      });
    }
  }, [isMobile]);

  // Section title animation
  const titleAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.7
  });

  // Desktop grid animation
  const desktopGridAnimation = useSectionRevealAnimation({
    variant: 'slide-up',
    once: false,
    threshold: { desktop: 0.2, mobile: 0.15 },
    duration: 0.6,
    staggerChildren: 0.12,
    delayChildren: 0.2
  });

  // Mobile cards animation (for feature cards)
  const mobileCardsAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.2, mobile: 0.1 },
    duration: 0.5,
    staggerChildren: 0.2
  });

  // Mobile images animation (separate from cards)
  const mobileImagesAnimation = useSectionRevealAnimation({
    variant: 'slide-left',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.15 },
    duration: 0.6
  });

  // Feature card variants
  const featureCardVariants = {
    hidden: { 
      y: 40,
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Icon animation variants
  const iconVariants = {
    hidden: { 
      scale: 0,
      rotate: -90,
      opacity: 0
    },
    visible: { 
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  return (
    <section className={`${isMobile ? 'pt-6 pb-16' : 'py-16'} bg-white`}>
      <div className="container mx-auto px-6">
        
        {/* Section Title */}
        <motion.div
          ref={titleAnimation.ref}
          variants={titleAnimation.parentVariants}
          initial="hidden"
          animate={titleAnimation.controls}
        >
          <motion.h2 
            className="text-3xl md:text-4xl text-navy mb-12 text-center"
            variants={titleAnimation.childVariants}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          >
            Designed for Depth
          </motion.h2>
        </motion.div>
        
        {isMobile ? (
          /* MOBILE LAYOUT: Alternating cards and images */
          <motion.div 
            className="space-y-6"
            ref={mobileCardsAnimation.ref}
            variants={mobileCardsAnimation.parentVariants}
            initial="hidden"
            animate={mobileCardsAnimation.controls}
          >
            {depthFeatures.map((feature, index) => (
              <React.Fragment key={index}>
                {/* Feature Card */}
                <motion.div 
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer"
                  variants={featureCardVariants}
                  whileHover="hover"
                >
                  {/* Icon with animation */}
                  <motion.div 
                    className=" bg-opacity-10 p-4 rounded-full mb-4 group-hover:bg-opacity-20 transition-colors"
                    variants={iconVariants}
                    initial="hidden"
                    animate={mobileCardsAnimation.isInView ? "visible" : "hidden"}
                  >
                    <div className="">{feature.icon}</div>
                  </motion.div>
                  
                  {/* Text content */}
                  <motion.h3 
                    className="font-medium text-navy text-lg mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: mobileCardsAnimation.isInView ? 1 : 0,
                      y: mobileCardsAnimation.isInView ? 0 : 20
                    }}
                    transition={{ 
                      delay: 0.3 + (index * 0.1),
                      duration: 0.5
                    }}
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: mobileCardsAnimation.isInView ? 1 : 0,
                      y: mobileCardsAnimation.isInView ? 0 : 20
                    }}
                    transition={{ 
                      delay: 0.4 + (index * 0.1),
                      duration: 0.5
                    }}
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
                  >
                    {feature.description}
                  </motion.p>
                </motion.div>
                
                {/* Feature Image with loading state */}
                <motion.div 
                  className="aspect-[16/9] w-full overflow-hidden rounded-xl shadow-md relative"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ 
                    opacity: mobileCardsAnimation.isInView ? 1 : 0,
                    x: mobileCardsAnimation.isInView ? 0 : -30
                  }}
                  transition={{ 
                    delay: 0.5 + (index * 0.1),
                    duration: 0.6
                  }}
                >
                  {/* Loading state for mobile images */}
                  {!loadedImages.has(index) && (
                    <motion.div 
                      className="absolute inset-0 bg-gray-100 flex items-center justify-center"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 border-4 border-gray-300 rounded-full animate-spin"></div>
                        <motion.div 
                          className="absolute inset-0 w-8 h-8 border-4 border-terracotta/20 rounded-full"
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.3, 0.1, 0.3]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Image */}
                  <motion.div
                    className={`transition-opacity duration-500 ${
                      loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                    }`}
                    initial={{ scale: 1.05 }}
                    animate={{ scale: loadedImages.has(index) ? 1 : 1.05 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <ResponsiveImage 
                      dynamicKey={feature.dynamicKey}
                      alt={feature.imageAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </motion.div>
              </React.Fragment>
            ))}
          </motion.div>
        ) : (
          /* DESKTOP LAYOUT: 3-column grid */
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            ref={desktopGridAnimation.ref}
            variants={desktopGridAnimation.parentVariants}
            initial="hidden"
            animate={desktopGridAnimation.controls}
          >
            {depthFeatures.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer"
                variants={featureCardVariants}
                whileHover="hover"
              >
                {/* Icon with animation */}
                <motion.div 
                  className=" bg-opacity-10 p-4 rounded-full mb-4 group-hover:bg-opacity-20 transition-colors"
                  variants={iconVariants}
                  initial="hidden"
                  animate={desktopGridAnimation.isInView ? "visible" : "hidden"}
                >
                  <div className="text-black">{feature.icon}</div>
                </motion.div>
                
                {/* Text content */}
                <motion.h3 
                  className="font-medium text-navy text-lg mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: desktopGridAnimation.isInView ? 1 : 0,
                    y: desktopGridAnimation.isInView ? 0 : 20
                  }}
                  transition={{ 
                    delay: 0.3 + (index * 0.05),
                    duration: 0.5
                  }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: desktopGridAnimation.isInView ? 1 : 0,
                    y: desktopGridAnimation.isInView ? 0 : 20
                  }}
                  transition={{ 
                    delay: 0.4 + (index * 0.05),
                    duration: 0.5
                  }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default DepthSection;
