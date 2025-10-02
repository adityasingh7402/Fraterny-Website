import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';
import ResponsiveImage from '../ui/ResponsiveImage';

// Peer profiles data
const peers = [
  { 
    title: "The Visionary", 
    dynamicKey: "tribe-visionary",
    description: "Sees possibilities others don't",
    imageSrc: {
      mobile: "/images/tribe/visionary-mobile.webp",
      desktop: "/images/tribe/visionary-desktop.webp"
    }
  },
  { 
    title: "The Hustler", 
    dynamicKey: "tribe-hustler",
    description: "Gets things done, period",
    imageSrc: {
      mobile: "/images/tribe/hustler-mobile.webp",
      desktop: "/images/tribe/hustler-desktop.webp"
    }
  },
  { 
    title: "The Workaholic", 
    dynamicKey: "tribe-workaholic",
    description: "Lives and breathes excellence",
    imageSrc: {
      mobile: "/images/tribe/workaholic-mobile.webp",
      desktop: "/images/tribe/workaholic-desktop.webp"
    }
  },
  { 
    title: "The Experienced", 
    dynamicKey: "tribe-experienced",
    description: "Been there, done that",
    imageSrc: {
      mobile: "/images/tribe/experienced-mobile.webp",
      desktop: "/images/tribe/experienced-desktop.webp"
    }
  },
  { 
    title: "The Optimist", 
    dynamicKey: "tribe-optimist",
    description: "Finds silver linings",
    imageSrc: {
      mobile: "/images/tribe/optimist-mobile.webp",
      desktop: "/images/tribe/optimist-desktop.webp"
    }
  },
  { 
    title: "The Guardian", 
    dynamicKey: "tribe-guardian",
    description: "Keeps the ship steady",
    imageSrc: {
      mobile: "/images/tribe/guardian-mobile.webp",
      desktop: "/images/tribe/guardian-desktop.webp"
    }
  }
];

const TribeSection = () => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Simulate progressive image loading
  useEffect(() => {
    // Start loading images progressively after component mounts
    const loadImage = (index: number) => {
      setTimeout(() => {
        setLoadedImages(prev => new Set(prev).add(index));
      }, 800 + (index * 400)); // First image at 800ms, then every 400ms
    };

    // Load all images progressively
    peers.forEach((_, index) => {
      loadImage(index);
    });
  }, []);
  // Section title animation
  const titleAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.7
  });

  // Tribe profiles animation with scale-in effect
  const profilesAnimation = useSectionRevealAnimation({
    variant: 'scale-in',
    once: false,
    threshold: { desktop: 0.2, mobile: 0.15 },
    duration: 0.6,
    staggerChildren: 0.15,
    delayChildren: 0.2
  });

  // Tagline animation
  const taglineAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.6, mobile: 0.5 },
    duration: 0.8
  });

  // Profile card hover variants
  const profileCardVariants = {
    hidden: { 
      scale: 0.8,
      opacity: 0,
      y: 30
    },
    visible: { 
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15
      }
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        
        {/* Section Title with scroll animation */}
        <motion.div
          ref={titleAnimation.ref}
          variants={titleAnimation.parentVariants}
          initial="hidden"
          animate={titleAnimation.controls}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center"
            variants={titleAnimation.childVariants}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            Your Tribe Awaits
          </motion.h2>
        </motion.div>
        
        {/* Tribe Profiles Grid with enhanced animations */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-12"
          ref={profilesAnimation.ref}
          variants={profilesAnimation.parentVariants}
          initial="hidden"
          animate={profilesAnimation.controls}
        >
          {peers.map((peer, index) => (
            <motion.div 
              key={index} 
              className="text-center group cursor-pointer"
              variants={profileCardVariants}
              whileHover="hover"
            >
              {/* Circular profile image with loading state */}
              <motion.div 
                className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden relative"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ 
                  scale: profilesAnimation.isInView ? 1 : 0.5,
                  opacity: profilesAnimation.isInView ? 1 : 0
                }}
                transition={{ 
                  delay: 0.2 + (index * 0.1),
                  type: "spring",
                  stiffness: 150,
                  damping: 20
                }}
                whileHover={{
                  scale: 1.1,
                  transition: { duration: 0.3 }
                }}
              >
                {/* Loading State - Beautiful spinner */}
                {!loadedImages.has(index) && (
                  <motion.div 
                    className="absolute inset-0 bg-gray-100 flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Animated spinner */}
                    <div className="relative">
                      <div className="w-8 h-8 border-4 border-gray-300 rounded-full animate-spin"></div>
                      
                      {/* Subtle background pulse */}
                      <motion.div 
                        className="absolute inset-0 w-8 h-8 border-4 border-terracotta/20 rounded-full"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    
                    {/* Loading dots pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div 
                        className="w-full h-full"
                        style={{
                          backgroundImage: `radial-gradient(circle at 30% 70%, rgba(224, 122, 95, 0.2) 2px, transparent 2px)`,
                          backgroundSize: '20px 20px',
                          animation: `float ${1.5 + (index % 3) * 0.3}s ease-in-out infinite alternate`
                        }}
                      />
                    </div>
                  </motion.div>
                )}
                
                {/* Image - fades in when loaded */}
                <motion.div
                  className={`transition-opacity duration-500 ${
                    loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                  }`}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: loadedImages.has(index) ? 1 : 1.1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <ResponsiveImage 
                    dynamicKey={peer.dynamicKey} 
                    alt={peer.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                </motion.div>
                
                {/* Subtle overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />
              </motion.div>
              
              {/* Title with staggered reveal */}
              <motion.h3 
                className="font-medium text-navy mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: profilesAnimation.isInView ? 1 : 0,
                  y: profilesAnimation.isInView ? 0 : 20
                }}
                transition={{ 
                  delay: 0.4 + (index * 0.1),
                  duration: 0.5
                }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                {peer.title}
              </motion.h3>
              
              {/* Description with final reveal */}
              <motion.p 
                className="text-gray-600 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: profilesAnimation.isInView ? 1 : 0,
                  y: profilesAnimation.isInView ? 0 : 20
                }}
                transition={{ 
                  delay: 0.5 + (index * 0.1),
                  duration: 0.5
                }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                {peer.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Tagline with scroll animation */}
        <motion.div
          ref={taglineAnimation.ref}
          variants={taglineAnimation.parentVariants}
          initial="hidden"
          animate={taglineAnimation.controls}
        >
          <motion.p 
            className="text-center text-lg text-gray-600"
            variants={taglineAnimation.childVariants}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
          >
            Divided by Circumstance, United by Fraterny
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default TribeSection;