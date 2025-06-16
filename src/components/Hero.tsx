import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateDaysLeft as utilsCalculateDaysLeft } from '@/utils/dateUtils';
import { useReactQueryWebsiteSettings } from '@/hooks/useReactQueryWebsiteSettings';

// Beautiful brand-themed loading skeleton
// const HeroBrandSkeleton = () => (
//   <div className="absolute inset-0 bg-gradient-to-br from-navy via-terracotta/20 to-navy overflow-hidden flex items-center justify-center">
//     <h2 className="text-white text-4xl font-bold animate-pulse">Loading...</h2>
//   </div>
// );

const Hero = () => {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  // const [imageLoaded, setImageLoaded] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const ctaVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    }
  };

  const daysLeftVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Use our React Query powered hook for settings
  const {
    settings,
    isLoading
  } = useReactQueryWebsiteSettings();

  // Auto-hide skeleton after 2 seconds to ensure smooth UX
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setImageLoaded(true);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);
  
  useEffect(() => {
    if (settings?.registration_close_date) {
      const days = utilsCalculateDaysLeft(settings.registration_close_date);
      setDaysLeft(days);
    }
  }, [settings?.registration_close_date]);

  // Render days left text
  const renderDaysLeft = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
      );
    }

    if (!settings?.registration_close_date) {
      return null;
    }

    if (daysLeft === 0) {
      return <span className="text-red-600 font-semibold">Registration Closed</span>;
    }

    if (daysLeft === null) {
      return null;
    }

    return (
      <span className="text-terracotta font-semibold">
        {daysLeft} {daysLeft === 1 ? 'day' : 'days'}
      </span>
    );
  };

  return (
    <section className="min-h-screen bg-navy text-white relative overflow-hidden flex flex-col items-start justify-center">
      {/* Optimized background image loading */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.3, ease: "easeOut" }}
      >
        {/* !imageLoaded && <HeroBrandSkeleton /> */}
        <img 
          src="/hero-mobile.webp" 
          alt="Luxury villa experience setting" 
          className="h-full w-full object-cover sm:hidden"
        />
        <img 
          src="/hero-desktop.webp" 
          alt="Luxury villa experience setting" 
          className="h-full w-full object-cover hidden sm:block"
        />
      </motion.div>
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, 
      rgba(10, 26, 47, 0.9) 0%,
      rgba(10, 26, 47, 0.7) 50%,
      rgba(10, 26, 47, 0.4) 100%
    )`
        }}
      />

      {/* Hero Content - Optimized for LCP */}
      <motion.div 
        className="mx-6 py-24 sm:py-32 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-2xl flex flex-col items-start justify-start gap-6 sm:gap-8">
          {/* Critical content - Load first */}
          <div>
            <motion.h1 
              className="text-left sm:text-center md:text-center lg:text-center xl:text-left sm:text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-3 sm:mb-4 text-4xl"
              variants={titleVariants}
            >
              Where Ambition
              <br />
              Finds Its Tribe
            </motion.h1>

            <motion.p 
              className="text-left sm:text-center md:text-center lg:text-center xl:text-left sm:text-lg md:text-xl text-gray-200 text-base"
              variants={subtitleVariants}
            >
              Surround yourself with the right people
            </motion.p>
          </div>

          {/* Secondary content - Load after critical content */}
          <div className="flex flex-col gap-6 sm:gap-8">
            <motion.div 
              className="flex justify-start sm:justify-center md:justify-center lg:justify-center xl:justify-start"
              variants={ctaVariants}
            >
              <a 
                href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 sm:px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base sm:text-lg font-medium w-fit flex items-center gap-2"
              >
                The Frat Villa Entry <ArrowRight size={20} />
              </a>
            </motion.div>
            
            <motion.div 
              className="text-center sm:text-center md:text-center lg:text-center xl:text-left"
              variants={daysLeftVariants}
            >
              {/* <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 sm:py-4 inline-block w-fit">
                <p className="text-sm md:text-base text-gray-300 mb-1">Villa Registrations close in</p>
                <div className="text-xl font-mono">
                  {renderDaysLeft()}
                </div>
              </div> */}
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 sm:py-4 inline-block w-fit">
              <p className="text-sm md:text-base text-gray-300 mb-1">Villa Registrations close in:</p>
              <div className="text-xl font-mono">
                {renderDaysLeft()}
              </div>
            </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;