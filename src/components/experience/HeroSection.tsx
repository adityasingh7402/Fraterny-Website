import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';

const HeroSection = () => {
  // Scroll-based parallax effects (same as homepage)
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.9, 0.6]);

  // Main title animation - dramatic slide from right
  const titleAnimation = useSectionRevealAnimation({
    variant: 'slide-right',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.8,
    mobile: { variant: 'fade-up', duration: 0.6 }
  });

  // Subtitle animation - gentle fade from right
  const subtitleAnimation = useSectionRevealAnimation({
    variant: 'fade-right',
    once: false,
    threshold: { desktop: 0.4, mobile: 0.3 },
    delayChildren: 0.2,
    duration: 0.6
  });

  // CTA animation - subtle fade up
  const ctaAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.6, mobile: 0.5 },
    delayChildren: 0.3,
    duration: 0.8
  });

  return (
    <section className="pt-32 pb-16 bg-navy text-white relative overflow-hidden">
      {/* Enhanced parallax background with scroll effects - STATIC IMAGES */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ y: backgroundY }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.3, ease: "easeOut" }}
      >
        <picture>
          {/* Mobile static image */}
          <source
            media="(max-width: 640px)"
            srcSet="/exp-mobile.webp"
            type="image/webp"
          />
          {/* Desktop static image */}
          <img 
            src="/exp-desktop.webp" 
            alt="Luxury villa experience setting"
            className="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </motion.div>
      
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

      {/* Hero Content with advanced scroll triggers */}
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
              className="text-left text-4xl md:text-5xl lg:text-6xl font-playfair mb-6"
              variants={titleAnimation.childVariants}
            >
              <motion.span
                variants={titleAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                Condensing lifelong <span className='' style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>memories</span>, <span className='' style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>lessons</span>, and <span className='' style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>friendships</span> in a week.
              </motion.span>
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
              className="text-left text-xl md:text-2xl mb-8 text-gray-300"
              variants={subtitleAnimation.childVariants}
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
            >
              20 people. 7 days. 1 life-changing experience
            </motion.p>
          </motion.div>
          
          {/* CTA Link with fade-up animation */}
          <motion.div
            ref={ctaAnimation.ref}
            variants={ctaAnimation.parentVariants}
            initial="hidden"
            animate={ctaAnimation.controls}
            className="text-center sm:text-left"
          >
            <motion.div
              variants={ctaAnimation.childVariants}
            >
              <a 
                href="/quest"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm italic underline hover:text-opacity-80 transition-colors"
              >
                See if you fit →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;