
import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ResponsiveImage from '../ui/ResponsiveImage';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSectionRevealAnimation } from './useSectionRevealAnimation';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Beautiful spinner loading component for gallery images
const ImageSpinner = ({ index }: { index: number }) => (
  <div className="absolute inset-0 bg-navy/90 flex items-center justify-center">
    {/* Animated spinner */}
    <div className="relative">
      <div className="w-8 h-8 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin"></div>
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 w-8 h-8 border-4 border-terracotta/10 rounded-full blur-sm"></div>
    </div>
    
    {/* Optional: Loading text for slower connections */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="text-xs text-gray-300 opacity-60 text-center">
        Loading...
      </div>
    </div>
    
    {/* Subtle animated background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          animation: `float ${2 + (index % 3) * 0.5}s ease-in-out infinite alternate`
        }}
      />
    </div>
  </div>
);

const VillaLabSection = () => {
  const network = useNetworkStatus();
  const isMobile = useIsMobile();
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Section header animations
  const headerAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.7,
    staggerChildren: 0.2
  });

  // Gallery animations with simple reveals
  const galleryAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.2, mobile: 0.15 },
    duration: 0.5,
    staggerChildren: 0.15,
    delayChildren: 0.2
  });

  // CTA button animation
  const ctaAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.6, mobile: 0.5 },
    duration: 0.6
  });

  // Determine how many images to initially show based on network conditions & device
  useEffect(() => {
    // Start with a small number on slow connections, more on fast connections
    const baseCount = ['slow-2g', '2g'].includes(network.effectiveConnectionType) 
      ? 2 
      : network.effectiveConnectionType === '3g' 
        ? 4 
        : 6;

    // Show fewer on mobile
    const count = isMobile ? Math.min(baseCount, 4) : baseCount;
    setVisibleCount(count);

    // Gradually increase the visible count for a staggered load
    const interval = setInterval(() => {
      setVisibleCount(current => {
        const maxDisplay = isMobile ? 6 : 9;
        return current < maxDisplay ? current + 1 : current;
      });
    }, isMobile ? 400 : 300); // Slower on mobile

    return () => clearInterval(interval);
  }, [network.effectiveConnectionType, isMobile]);

  // Auto-hide spinners after a reasonable time (progressive enhancement)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mark first few images as "loaded" after 1.5 seconds
      const initialLoaded = new Set<number>();
      for (let i = 0; i < Math.min(visibleCount, 4); i++) {
        initialLoaded.add(i);
      }
      setLoadedImages(initialLoaded);
      
      // Gradually mark more as loaded
      const interval = setInterval(() => {
        setLoadedImages(current => {
          const newSet = new Set(current);
          const nextIndex = current.size;
          if (nextIndex < visibleCount) {
            newSet.add(nextIndex);
          }
          return newSet;
        });
      }, 300);

      return () => clearInterval(interval);
    }, 1500); // Initial delay before starting to hide spinners

    return () => clearTimeout(timer);
  }, [visibleCount]);

  // Updated to use dynamic image keys and include width/height for CLS optimization
  const activities = useMemo(() => [
    {
      title: "Workshops",
      dynamicKey: "villalab-workshop",
      fallbackSrc: {
        mobile: "/images/villalab/workshop-mobile.webp",
        desktop: "/images/villalab/workshop-desktop.webp"
      },
      alt: "Interactive workshop session"
    },
    {
      title: "Gourmet Meals",
      dynamicKey: "villalab-gourmet",
      fallbackSrc: {
        mobile: "/images/villalab/gourmet-mobile.webp",
        desktop: "/images/villalab/gourmet-desktop.webp"
      },
      alt: "Premium dining experience"
    },
    {
      title: "Group Activities",
      dynamicKey: "villalab-group",
      fallbackSrc: {
        mobile: "/images/villalab/group-mobile.webp",
        desktop: "/images/villalab/group-desktop.webp"
      },
      alt: "Team-building activity in progress"
    },
    {
      title: "Candid Interactions",
      dynamicKey: "villalab-candid",
      fallbackSrc: {
        mobile: "/images/villalab/candid-mobile.webp",
        desktop: "/images/villalab/candid-desktop.webp"
      },
      alt: "Natural conversation between participants"
    },
    {
      title: "Networking",
      dynamicKey: "villalab-networking",
      fallbackSrc: {
        mobile: "/images/villalab/networking-mobile.webp",
        desktop: "/images/villalab/networking-desktop.webp"
      },
      alt: "Professional connections being formed"
    },
    {
      title: "Evening Sessions",
      dynamicKey: "villalab-evening",
      fallbackSrc: {
        mobile: "/images/villalab/evening-mobile.webp",
        desktop: "/images/villalab/evening-desktop.webp"
      },
      alt: "Deep discussions in evening setting"
    },
    {
      title: "Brainstorming",
      dynamicKey: "villalab-brainstorm",
      fallbackSrc: {
        mobile: "/images/villalab/brainstorm-mobile.webp",
        desktop: "/images/villalab/brainstorm-desktop.webp"
      },
      alt: "Collaborative ideation session"
    },
    {
      title: "Mentorship",
      dynamicKey: "villalab-mentorship",
      fallbackSrc: {
        mobile: "/images/villalab/mentorship-mobile.webp",
        desktop: "/images/villalab/mentorship-desktop.webp"
      },
      alt: "One-on-one guidance session"
    },
    {
      title: "Social Events",
      dynamicKey: "villalab-social",
      fallbackSrc: {
        mobile: "/images/villalab/social-mobile.webp",
        desktop: "/images/villalab/social-desktop.webp"
      },
      alt: "Relaxed social gathering"
    }
  ], []);

  // Calculate how many images to display based on viewport and network conditions
  const displayCount = Math.min(activities.length, visibleCount);

  return (
    <section className="bg-white sm:py-[49px] py-[31px]">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* Section Header with scroll animations */}
        <motion.div 
          className="mb-8 sm:mb-12"
          ref={headerAnimation.ref}
          variants={headerAnimation.parentVariants}
          initial="hidden"
          animate={headerAnimation.controls}
        >
          <motion.h2 
            className="text-center sm:text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-3 sm:mb-4 text-4xl"
            variants={headerAnimation.childVariants}
          >
            The Villa Lab
          </motion.h2>

          <motion.p 
            className="text-center sm:text-xl text-gray-600 text-base"
            variants={headerAnimation.childVariants}
          >
            <span className="font-extrabold text-terracotta">Think</span> hard.{' '}
            <span className="font-extrabold text-terracotta">Vibe</span> harder.
          </motion.p>
        </motion.div>

        {/* Gallery Grid with sophisticated scroll reveals */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4"
          // ref={galleryAnimation.ref}
          // variants={galleryAnimation.parentVariants}
          // initial="hidden"
          // animate={galleryAnimation.controls}
        >
          {activities.slice(0, displayCount).map((activity, index) => {
            // Determine loading strategy:
            // - First images load eagerly
            // - On good connections, load more eagerly
            // - On poor connections, lazy load most images
            const loadingStrategy = index < 2 
              ? "eager" 
              : index < 4 && network.effectiveConnectionType === '4g' 
                ? "eager" 
                : "lazy";

            // Apply visual appearance based on loading status
            // This creates a progressive reveal effect
            const isVisible = index < visibleCount;
            const isImageLoaded = loadedImages.has(index);
            
            return (
              <motion.div 
                key={index} 
                className={`aspect-square bg-navy rounded-lg overflow-hidden relative group transition-opacity duration-500 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                variants={galleryAnimation.childVariants}
                style={{
                  transitionDelay: `${index * 50}ms` // Staggered visibility
                }}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                {/* LOADING STATE: Beautiful spinner while image loads */}
                {!isImageLoaded && (
                  <ImageSpinner index={index} />
                )}
                
                {/* IMAGE: Fades in when loaded with enhanced animations */}
                <motion.div 
                  className={`transition-opacity duration-500 ${
                    isImageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: isImageLoaded ? 1 : 1.1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <ResponsiveImage 
                    alt={activity.alt} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    loading={loadingStrategy} 
                    dynamicKey={isMobile ? `${activity.dynamicKey}-mobile` : activity.dynamicKey}
                    priority={index < 2} // Prioritize loading for first two images
                  />
                </motion.div>
                
                {/* HOVER OVERLAY: Enhanced with better animations */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end ${
                    !isImageLoaded ? 'pointer-events-none' : ''
                  }`}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className="p-3 sm:p-4"
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <h3 className="text-white font-medium text-sm sm:text-base">
                      {activity.title}
                    </h3>
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-8 sm:mt-12 text-center sm:text-right">
          <a 
            href="https://www.instagram.com/join.fraterny/?hl=en" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-navy hover:text-terracotta transition-colors group"
          >
            <span className="mr-2">see more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        {/* CTA Button with scroll trigger */}
        {/* <motion.div 
          className="mt-8 sm:mt-12 flex justify-center"
          ref={ctaAnimation.ref}
          variants={ctaAnimation.parentVariants}
          initial="hidden"
          animate={ctaAnimation.controls}
        >
          <motion.a
            href="https://www.instagram.com/join.fraterny/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-terracotta text-white rounded-lg px-6 py-3 font-semibold shadow-lg hover:bg-terracotta/90 active:scale-95 transition-all text-lg group"
            style={{ minWidth: 160 }}
            variants={ctaAnimation.childVariants}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 12px 30px rgba(224, 122, 95, 0.3)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">See More</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </motion.div> */}
        <motion.div 
          className="flex justify-center mt-16"
          ref={ctaAnimation.ref}
          variants={ctaAnimation.parentVariants}
          initial="hidden"
          animate={ctaAnimation.controls}
        >
          <motion.div
            variants={ctaAnimation.childVariants}
          >
            <Link 
              to="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" 
              className="px-6 py-3 bg-terracotta text-white rounded-lg transition-all duration-300 hover:bg-terracotta hover:scale-105 hover:shadow-lg inline-block group"
            >
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Apply Now
                <motion.svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:translate-x-1 transition-transform"
                >
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </motion.svg>
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default VillaLabSection;