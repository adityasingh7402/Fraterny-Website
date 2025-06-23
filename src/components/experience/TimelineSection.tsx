
// import React from 'react';

// // CUSTOMIZATION: Timeline Events
// // Modify the array below to change the timeline events
// // Each event has: time, title, and description
// const timelineEvents = [
//   { time: "11:30 AM", title: "Brainstorming Breakfasts", description: "Start your day with engaging discussions" },
//   { time: "1:00 PM", title: "Team Activity Afternoons", description: "Collaborative sessions and workshops" },
//   { time: "6:00 PM", title: "Simulation Sunsets", description: "Apply learnings in practical scenarios" },
//   { time: "12:00 AM", title: "Midnight Momentum", description: "Deep conversations and connections" },
// ];

// const TimelineSection = () => {
//   return (
//     <section className="py-16 bg-white">
//       <div className="container mx-auto px-6">
//         {/* CUSTOMIZATION: Timeline Section Title */}
//         <h2 className="text-center text-3xl md:text-4xl font-playfair text-navy mb-4">A Day in the Villa</h2>
        
//         {/* CUSTOMIZATION: Timeline Section Description */}
//         <p className="text-center sm:text-xl text-gray-600 text-base mb-8">
//           We create the perfect conditions for you to have the most insightful conversations, amazing memories and take action towards your goals
//         </p>
        
//         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {timelineEvents.map((event, index) => (
//             <div key={index} className="bg-gray-50 p-6 rounded-lg">
//               <div className="text-terracotta font-mono mb-2">{event.time}</div>
//               <h3 className="font-medium text-navy mb-2">{event.title}</h3>
//               <p className="text-gray-600 text-sm">{event.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TimelineSection;


import React from 'react';
import { motion } from 'framer-motion';
import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';

// Timeline events data
const timelineEvents = [
  { time: "11:30 AM", title: "Brainstorming Breakfasts", description: "Start your day with engaging discussions" },
  { time: "1:00 PM", title: "Team Activity Afternoons", description: "Collaborative sessions and workshops" },
  { time: "6:00 PM", title: "Simulation Sunsets", description: "Apply learnings in practical scenarios" },
  { time: "12:00 AM", title: "Midnight Momentum", description: "Deep conversations and connections" },
];

const TimelineSection = () => {
  // Section title animation
  const titleAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.7,
    staggerChildren: 0.3
  });

  // Timeline cards animation with sophisticated reveals (similar to HowItWorks steps)
  const cardsAnimation = useSectionRevealAnimation({
    variant: 'slide-up',
    once: false,
    threshold: { desktop: 0.2, mobile: 0.15 },
    duration: 0.6,
    staggerChildren: 0.2,
    delayChildren: 0.3
  });

  // Card hover animation variants
  const cardVariants = {
    hidden: { 
      y: 60,
      opacity: 0,
      scale: 0.9
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

  // Time badge animation variants - REMOVED

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        
        {/* Section Header with scroll animations */}
        <motion.div
          ref={titleAnimation.ref}
          variants={titleAnimation.parentVariants}
          initial="hidden"
          animate={titleAnimation.controls}
          className="text-center mb-8"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-playfair text-navy mb-4"
            variants={titleAnimation.childVariants}
          >
            A Day in the Villa
          </motion.h2>
          
          <motion.p 
            className="text-center sm:text-xl text-gray-600 text-base"
            variants={titleAnimation.childVariants}
          >
            We create the perfect conditions for you to have the most insightful conversations, amazing memories and take action towards your goals
          </motion.p>
        </motion.div>
        
        {/* Timeline Cards Grid with enhanced animations */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          ref={cardsAnimation.ref}
          variants={cardsAnimation.parentVariants}
          initial="hidden"
          animate={cardsAnimation.controls}
        >
          {timelineEvents.map((event, index) => (
            <motion.div 
              key={index} 
              className="bg-gray-50 p-6 rounded-lg group cursor-pointer"
              variants={cardVariants}
              whileHover="hover"
            >
              
              {/* Time with simple reveal */}
              <motion.div 
                className="text-terracotta font-mono mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: cardsAnimation.isInView ? 1 : 0,
                  y: cardsAnimation.isInView ? 0 : 20
                }}
                transition={{ 
                  delay: 0.3 + (index * 0.15),
                  duration: 0.5
                }}
              >
                {event.time}
              </motion.div>
              
              {/* Title with staggered reveal */}
              <motion.h3 
                className="font-medium text-navy mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: cardsAnimation.isInView ? 1 : 0,
                  y: cardsAnimation.isInView ? 0 : 20
                }}
                transition={{ 
                  delay: 0.4 + (index * 0.15),
                  duration: 0.5
                }}
              >
                {event.title}
              </motion.h3>
              
              {/* Description with final reveal */}
              <motion.p 
                className="text-gray-600 text-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: cardsAnimation.isInView ? 1 : 0,
                  y: cardsAnimation.isInView ? 0 : 20
                }}
                transition={{ 
                  delay: 0.5 + (index * 0.15),
                  duration: 0.5
                }}
              >
                {event.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TimelineSection;