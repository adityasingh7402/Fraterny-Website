import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';
import ResponsiveImage from '../ui/ResponsiveImage';
import { link } from 'fs';

// Peer profiles data
const peers = [
  { 
    title: "The Strategists", 
    dynamicKey: "tribe-visionary",
    description: "Think Speed, Structure, Scale",
    imageSrc: {
      mobile: "/images/tribe/visionary-mobile.webp",
      desktop: "/images/tribe/visionary-desktop.webp"
    }
  },
  { 
    title: "The Hidden Thinkers", 
    dynamicKey: "tribe-hustler",
    description: "Move with Evidence",
    imageSrc: {
      mobile: "/images/tribe/hustler-mobile.webp",
      desktop: "/images/tribe/hustler-desktop.webp"
    }
  },
  { 
    title: "The Restless Minds", 
    dynamicKey: "tribe-workaholic",
    description: "Overflowing with Ideas",
    imageSrc: {
      mobile: "/images/tribe/workaholic-mobile.webp",
      desktop: "/images/tribe/workaholic-desktop.webp"
    }
  },
  { 
    title: "The Soul-Aligned", 
    dynamicKey: "tribe-experienced",
    description: "Meaning-driven, Vibe-tuning, Purpose-focused",
    imageSrc: {
      mobile: "/images/tribe/experienced-mobile.webp",
      desktop: "/images/tribe/experienced-desktop.webp"
    }
  },
  { 
    title: "The Healing Hearts", 
    dynamicKey: "tribe-optimist",
    description: "Protect Calm and Safety",
    imageSrc: {
      mobile: "/images/tribe/optimist-mobile.webp",
      desktop: "/images/tribe/optimist-desktop.webp"
    }
  },
  { 
    title: "The Free Spirits", 
    dynamicKey: "tribe-guardian",
    description: "Creative, curious, and nonlinear.",
    imageSrc: {
      mobile: "/images/tribe/guardian-mobile.webp",
      desktop: "/images/tribe/guardian-desktop.webp"
    }
  }
];

const journeySteps = [
    {
      step: "1",
      title: "Start with Quest:",
      description: "Begin your journey by taking the free Quest analysis to gain clarity on your internal reality.",
      isButton: true,
      link: "/quest"
    },
    {
      step: "2",
      title: "Apply for Fratvilla:",
      description: "Use your Quest results to apply for the Fratvilla experience, where you'll be surrounded by a curated group of peers who will challenge and support you.",
      isButton: true,
      link: "/fratvilla"
    },
    {
      step: "3",
      title: "Reshape Yourself",
      description: "Through the combined power of Quest and Fratvilla, you'll gain the tools, mindset, and network to reshape both your internal and external realities, unlocking your full potential and becoming the best version of yourself.",
      isButton: false,
      link: ""
    }
  ];

const timelineEvents = [
  { time: "11:30 AM", title: "Brainstorming Breakfasts", description: "Start your day with engaging discussions" },
  { time: "1:00 PM", title: "Team Activity Afternoons", description: "Collaborative sessions and workshops" },
  { time: "6:00 PM", title: "Simulation Sunsets", description: "Apply learnings in practical scenarios" },
  { time: "12:00 AM", title: "Midnight Momentum", description: "Deep conversations and connections" },
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
    <section className="">
      <section className="bg-blue-200">
      <section className="py-4 md:py-8">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto text-center">
            <h2 
              className="section-header mb-6 bg-gradient-to-b from-cyan-900 to-neutral-300 bg-clip-text text-transparent"
            >
              The Integrated Fraterny Journey
            </h2>

            {/* Journey Step Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {journeySteps.map((step, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-cyan-400 to-blue-900 backdrop-blur-md rounded-xl p-6 md:p-8 text-left border border-cyan-700/20 shadow-lg hover:shadow-xl transition-all duration-500"
                >
                  <div className="flex items-center gap-3 mb-4 relative">
                    <h3 
                      className="text-xl md:text-2xl lg:text-3xl font-['Gilroy-Bold'] text-neutral-700"
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p 
                    className="text-lg md:text-xl font-['Gilroy-Regular'] text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400"
                  >
                    {step.description}
                  </p>
                  <div className=' lg:absolute lg:bottom-6 md:absolute md:bottom-6'>
                  {step.isButton && (
                    <button onClick={() => window.location.href = step.link} className="text-2xl mt-4 px-4 py-2 bg-gradient-to-br from-cyan-600 to-blue-900 font-['Gilroy-Bold'] tracking-tighter text-white rounded-md shadow-md cursor-pointer transition-all duration-300">
                      Get Started
                    </button>
                  )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </section>

      <section className="bg-blue-200">
        <section className="py-4 md:py-8">
          <div className="container mx-auto">
            <div className="max-w-full text-center">
              <h2 
                className="section-header mb-6 bg-gradient-to-b from-cyan-900 to-neutral-300 bg-clip-text text-transparent"
              >
                A Day at Fratvilla
              </h2>

              {/* Timeline Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {timelineEvents.map((event, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-cyan-400 to-blue-900 backdrop-blur-md rounded-xl p-6 md:p-8 text-left border border-cyan-700/20 shadow-lg hover:shadow-xl transition-all duration-500 "
                  >
                    <div className="mb-4">
                      <span className="text-3xl md:text-4xl font-['Gilroy-Bold'] text-neutral-100">
                        {event.time}
                      </span>
                    </div>
                    <h3 
                      className="text-xl md:text-2xl font-['Gilroy-Bold'] text-neutral-700 italic h-20 mb-3"
                    >
                      {event.title}
                    </h3>
                    <p 
                      className="text-xl lg:text-2xl md:text-xl font-['Gilroy-Regular'] text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400"
                    >
                      {event.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
      
      {/*  */}
      <section className="py-4 md:py-8 bg-gradient-to-br from-cyan-800 to-blue-900">
        <div className="container mx-auto px-6">
          
          {/* Section Title with scroll animation */}
          <motion.div
            ref={titleAnimation.ref}
            variants={titleAnimation.parentVariants}
            initial="hidden"
            animate={titleAnimation.controls}
          >
            <motion.h2 
              className="section-header mb-8 bg-gradient-to-b from-cyan-400 to-neutral-300 bg-clip-text text-transparent"
              variants={titleAnimation.childVariants}
            >
              Play Your Ideal Archetype
            </motion.h2>
          </motion.div>
          
          {/* Tribe Profiles Grid with enhanced animations */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12"
          >
            {peers.map((peer, index) => (
              <motion.div 
                key={index} 
                className="text-center group cursor-pointer"
              >
                {/* Circular profile image with loading state */}
                <motion.div 
                  className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto mb-4 bg-white/10 rounded-full overflow-hidden relative border-2 border-white/20"
                >
                  {/* Loading State */}
                  {!loadedImages.has(index) && (
                    <motion.div 
                      className="absolute inset-0 bg-cyan-700/30 flex items-center justify-center"
                    >
                      {/* Animated spinner */}
                      <div className="relative">
                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        
                        {/* Subtle background pulse */}
                        <motion.div 
                          className="absolute inset-0 w-8 h-8 border-4 border-cyan-300/20 rounded-full"
                        />
                      </div>
                      
                      {/* Loading dots pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div 
                          className="w-full h-full"
                          style={{
                            backgroundImage: `radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.2) 2px, transparent 2px)`,
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
                  >
                    <ResponsiveImage 
                      dynamicKey={peer.dynamicKey} 
                      alt={peer.title}
                      className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300 group-hover:scale-110"
                      loading={index < 3 ? "eager" : "lazy"}
                    />
                  </motion.div>
                  
                  {/* Subtle overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.1 }}
                  />
                </motion.div>
                
                {/* Title with staggered reveal */}
                <motion.h3 
                  className="text-lg md:text-xl lg:text-2xl text-white mb-2 font-['Gilroy-Bold']"
                >
                  {peer.title}
                </motion.h3>
                
                {/* Description with final reveal */}
                <motion.p 
                  className="text-gray-200 text-xs md:text-sm lg:text-base font-['Gilroy-Regular']"
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
              className="text-center text-lg md:text-xl text-gray-100 font-['Gilroy-Medium']"
            >
              Divided by Masks, United by Fraterny
            </motion.p>
          </motion.div>
        </div>
    </section>
    </section>
  );
};

export default TribeSection;
