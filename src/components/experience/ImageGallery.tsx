// 'use client';

// import { FC } from 'react';
// import ResponsiveImage from '../ui/ResponsiveImage';

// // Updated to use dynamic keys where possible and add sizes
// const experienceImages = [
//   {
//     dynamicKey: "experience-villa-retreat",
//     fallback: {
//       mobile: "/images/experience/villa-retreat-mobile.webp",
//       tablet: "/images/experience/villa-retreat-tablet.webp",
//       desktop: "/images/experience/villa-retreat-desktop.webp"
//     },
//     alt: "Luxury villa retreat where entrepreneurs gather for deep connections",
//   },
//   {
//     dynamicKey: "experience-workshop",
//     fallback: {
//       mobile: "/images/experience/workshop-mobile.webp",
//       tablet: "/images/experience/workshop-tablet.webp",
//       desktop: "/images/experience/workshop-desktop.webp"
//     },
//     alt: "Interactive workshop session with driven professionals",
//   },
//   {
//     dynamicKey: "experience-networking",
//     fallback: {
//       mobile: "/images/experience/networking-mobile.webp",
//       tablet: "/images/experience/networking-tablet.webp",
//       desktop: "/images/experience/networking-desktop.webp"
//     },
//     alt: "Meaningful networking among ambitious individuals",
//   },
//   {
//     dynamicKey: "experience-collaboration",
//     fallback: {
//       mobile: "/images/experience/collaboration-mobile.webp",
//       tablet: "/images/experience/collaboration-tablet.webp",
//       desktop: "/images/experience/collaboration-desktop.webp"
//     },
//     alt: "Collaborative problem-solving in a premium environment",
//   },
//   {
//     dynamicKey: "experience-evening-session",
//     fallback: {
//       mobile: "/images/experience/evening-session-mobile.webp",
//       tablet: "/images/experience/evening-session-tablet.webp",
//       desktop: "/images/experience/evening-session-desktop.webp"
//     },
//     alt: "Evening mastermind session with panoramic views",
//   },
//   {
//     dynamicKey: "experience-gourmet-dining",
//     fallback: {
//       mobile: "/images/experience/gourmet-dining-mobile.webp",
//       tablet: "/images/experience/gourmet-dining-tablet.webp",
//       desktop: "/images/experience/gourmet-dining-desktop.webp"
//     },
//     alt: "Gourmet dining experience bringing people together",
//   }
// ];

// const ImageGallery = () => {
//   return (
//     <section className="w-full">
//       <div className="grid grid-cols-2 md:grid-cols-2">
//         {experienceImages.map((image, index) => (
//           <div key={index} className="aspect-[4/3] w-full">
//             <ResponsiveImage 
//               alt={image.alt}
//               loading={index < 2 ? "eager" : "lazy"}
//               dynamicKey={image.dynamicKey}
//               className="w-full h-full object-cover"
//             />
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default ImageGallery;


'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';
import ResponsiveImage from '../ui/ResponsiveImage';

// Updated gallery images with dynamic keys
const experienceImages = [
  {
    dynamicKey: "experience-villa-retreat",
    fallback: {
      mobile: "/images/experience/villa-retreat-mobile.webp",
      tablet: "/images/experience/villa-retreat-tablet.webp",
      desktop: "/images/experience/villa-retreat-desktop.webp"
    },
    alt: "Luxury villa retreat where entrepreneurs gather for deep connections",
  },
  {
    dynamicKey: "experience-workshop",
    fallback: {
      mobile: "/images/experience/workshop-mobile.webp",
      tablet: "/images/experience/workshop-tablet.webp",
      desktop: "/images/experience/workshop-desktop.webp"
    },
    alt: "Interactive workshop session with driven professionals",
  },
  {
    dynamicKey: "experience-networking",
    fallback: {
      mobile: "/images/experience/networking-mobile.webp",
      tablet: "/images/experience/networking-tablet.webp",
      desktop: "/images/experience/networking-desktop.webp"
    },
    alt: "Meaningful networking among ambitious individuals",
  },
  {
    dynamicKey: "experience-collaboration",
    fallback: {
      mobile: "/images/experience/collaboration-mobile.webp",
      tablet: "/images/experience/collaboration-tablet.webp",
      desktop: "/images/experience/collaboration-desktop.webp"
    },
    alt: "Collaborative problem-solving in a premium environment",
  },
  {
    dynamicKey: "experience-evening-session",
    fallback: {
      mobile: "/images/experience/evening-session-mobile.webp",
      tablet: "/images/experience/evening-session-tablet.webp",
      desktop: "/images/experience/evening-session-desktop.webp"
    },
    alt: "Evening mastermind session with panoramic views",
  },
  {
    dynamicKey: "experience-gourmet-dining",
    fallback: {
      mobile: "/images/experience/gourmet-dining-mobile.webp",
      tablet: "/images/experience/gourmet-dining-tablet.webp",
      desktop: "/images/experience/gourmet-dining-desktop.webp"
    },
    alt: "Gourmet dining experience bringing people together",
  }
];

const ImageGallery = () => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Simple progressive image loading
  useEffect(() => {
    const loadImage = (index: number) => {
      setTimeout(() => {
        setLoadedImages(prev => new Set(prev).add(index));
      }, 500 + (index * 300)); // First at 500ms, then every 300ms
    };

    experienceImages.forEach((_, index) => {
      loadImage(index);
    });
  }, []);

  // Gallery grid animation
  const galleryAnimation = useSectionRevealAnimation({
    variant: 'scale-in',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.6,
    staggerChildren: 0.15,
    delayChildren: 0.1
  });

  // Simple image container variants
  const imageContainerVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full">
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-2"
        ref={galleryAnimation.ref}
        variants={galleryAnimation.parentVariants}
        initial="hidden"
        animate={galleryAnimation.controls}
      >
        {experienceImages.map((image, index) => (
          <motion.div 
            key={index} 
            className="aspect-[4/3] w-full relative overflow-hidden"
            variants={imageContainerVariants}
          >
            {/* Simple loading state */}
            {!loadedImages.has(index) && (
              <motion.div 
                className="absolute inset-0 bg-gray-200 flex items-center justify-center"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-8 h-8 border-4 border-gray-300 border-t-terracotta rounded-full animate-spin"></div>
              </motion.div>
            )}
            
            {/* Image with simple fade-in */}
            <motion.div
              className={`w-full h-full transition-opacity duration-500 ${
                loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <ResponsiveImage 
                alt={image.alt}
                loading={index < 2 ? "eager" : "lazy"}
                dynamicKey={image.dynamicKey}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ImageGallery;