import { motion, useScroll, useTransform } from 'framer-motion';
import Orb from './Orb/Orb';

export default function HeroArchetype() {
  // Scroll-based parallax effects
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.1]);

  return (
    <section className="min-h-screen bg-navy relative overflow-hidden flex items-center justify-center">
      {/* Animated Orb Background - Centered */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ y: backgroundY }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.3, ease: "easeOut" }}
      >
        <div className="w-[90vw] h-[90vw] sm:w-[80vw] sm:h-[80vw] md:w-[70vw] md:h-[70vw] lg:w-[60vw] lg:h-[60vw] xl:w-[50vw] xl:h-[50vw] max-w-[800px] max-h-[800px]">
          <Orb
            hoverIntensity={0.5}
            rotateOnHover={true}
            hue={0}
            forceHoverState={false}
          />
        </div>
      </motion.div>
      
      {/* Subtle gradient overlay */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          opacity: overlayOpacity,
          background: `radial-gradient(circle at center, 
            transparent 0%,
            rgba(10, 26, 47, 0.4) 50%,
            rgba(10, 26, 47, 0.8) 100%
          )`
        }}
      />

      {/* Hero Content - Centered over Orb */}
      <div className="relative z-10 flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl flex flex-col items-center justify-center text-center">
          
          {/* Title with animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-4"
          >
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight"
            >
              <span 
                className="block mb-2 font-['Gilroy-Bold'] tracking-tighter text-white"
              >
                Discover Your
              </span>
              <span 
                className="block bg-gradient-to-r from-white via-terracotta to-white bg-clip-text text-transparent"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
              >
                Archetype
              </span>
              <span 
                className="block mt-2 font-['Gilroy-Bold'] tracking-tighter text-white"
              >
                Find Your Path
              </span>
            </h1>
          </motion.div>

          {/* Subtitle with animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mb-8"
          >
            <p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl font-['Gilroy-Bold'] tracking-tighter"
            >
              Understand how you think, work, and connect
            </p>
          </motion.div>

          {/* CTA Link with animation */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <a 
              href="#explore"
              className="inline-flex items-center gap-2 text-sm sm:text-base md:text-lg italic underline hover:text-terracotta transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
            >
              Explore the clusters 
              <span className="text-whitw">→</span>
            </a>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}