import { useRef, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const OurValuesSection = () => {
  // Animation variants
  const parentVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // In-view animation control using framer-motion's useInView
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.25 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <section className="py-12 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        {/* FIXED: Added text-center sm:text-left for consistent section title alignment */}
        <h2 className="text-center text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-10">
          What's so Special?
        </h2>
        <p className="text-center sm:text-xl text-gray-600 text-base pb-8 max-w-4xl mx-auto leading-relaxed">
          Fraterny is built on the belief that <span className="font-extrabold text-terracotta">success</span> and <span className="font-extrabold text-terracotta">self discovery</span> can be accelerated exponentially in the right environment, with the right tools and the right people.
        </p>
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={parentVariants}
            initial="hidden"
            animate={controls}
          >
            {/* Card content remains centered - this is correct for card layouts */}
            <motion.div
              className="group flex flex-col items-center p-5 hover:bg-gray-50 rounded-lg transition-all duration-300"
              variants={cardVariants}
            >
              <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center mb-6 group-hover:bg-navy/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A1A2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                  <path d="M12 7V3"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-navy mb-4 text-center">Edu-Vacation</h3>
              <p className="text-navy/70 leading-relaxed text-center text-lg">
                Looks like a vacation. Feels like a level-up. Ever felt like going on a vacation but not compromise on productivity?
              </p>
            </motion.div>
            <motion.div
              className="group flex flex-col items-center p-5 hover:bg-gray-50 rounded-lg transition-all duration-300"
              variants={cardVariants}
            >
              <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mb-6 group-hover:bg-terracotta/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E07A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
                  <path d="M12 13v8"></path>
                  <path d="M12 3v3"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-navy mb-4 text-center">Brain Hacking</h3>
              <p className="text-navy/70 leading-relaxed text-center text-lg">
                We curate experiences and activities which ensure critical thinking, insightful interactions and openness  
              </p>
            </motion.div>
            <motion.div
              className="group flex flex-col items-center p-5 hover:bg-gray-50 rounded-lg transition-all duration-300"
              variants={cardVariants}
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-navy mb-4 text-center">Collaboration</h3>
              <p className="text-navy/70 leading-relaxed text-center text-lg">
                Legends don't compete. They collaborate. Imagine being stranded on a 10BHK exclusive villa with 19 other ambitious souls like yourself.
              </p>
            </motion.div>
          </motion.div>
        </div>
        <div className="flex justify-center mb-5 mt-10">
          <a
            href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-terracotta text-white rounded-lg px-6 py-3 font-semibold shadow-lg hover:bg-terracotta/90 active:scale-95 transition-all text-lg group"
            style={{ minWidth: 160 }}
          >
            Apply Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default OurValuesSection;