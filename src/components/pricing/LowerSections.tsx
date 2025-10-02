
// import { Users, Hotel, Coffee, Award } from 'lucide-react';

// const FeatureCard = ({ icon: Icon, title, description }) => (
//   <div className="flex gap-4 items-start">
//     <div className="p-2 rounded-full bg-navy/5">
//       <Icon size={24} className="text-navy" />
//     </div>
//     <div>
//       <h3 className="font-medium mb-1">{title}</h3>
//       <p className="text-gray-600 text-sm">{description}</p>
//     </div>
//   </div>
// );

// const LowerSections = ({ APPLICATION_FORM_URL, EXECUTIVE_ESCAPE_MAIL, prices }) => {
//   return (
//     <>
//       <section className="py-16 sm:py-20 bg-gray-50">
//         <div className="container mx-auto px-4 sm:px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-3 sm:mb-4">The Ultimate 7-Day Retreat</h2>
//             <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12">
//               Curated experiences, deep conversations, and a high-value network that will stay with you for life.
//             </p>
            
//             <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
//               <FeatureCard
//                 icon={Users}
//                 title="Curated Group"
//                 description="Small, highly curated group of 20 individuals"
//               />
//               <FeatureCard
//                 icon={Hotel}
//                 title="Luxury Stay"
//                 description="Luxury villa stay with gourmet meals"
//               />
//               <FeatureCard
//                 icon={Coffee}
//                 title="High-Impact Sessions"
//                 description="Workshops, simulations, and strategy sessions"
//               />
//               <FeatureCard
//                 icon={Award}
//                 title="Premium Access"
//                 description="Direct access to frameworks and templates"
//               />
//             </div>

//             <div className="text-center">
//               <a
//                 href={APPLICATION_FORM_URL}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-block px-5 sm:px-6 py-2 sm:py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
//               >
//                 Apply Now
//               </a>
//               <p className="text-sm text-gray-600 mt-4">
//                 Currently accepting applications for {prices.acceptingApplicationsFor || 'February 2026'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 sm:py-20">
//         <div className="container mx-auto px-4 sm:px-6">
//           <div className="max-w-3xl mx-auto">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-3 sm:mb-4">
//               Private, High-Level Conversations
//             </h2>
//             <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12">
//               No structured sessions, no group activities – just a space for networking and deep discussions.
//             </p>
            
//             <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
//               <FeatureCard
//                 icon={Users}
//                 title="Exclusive Group"
//                 description="Limited to 8-10 high-level individuals per villa"
//               />
//               <FeatureCard
//                 icon={Hotel}
//                 title="Private Rooms"
//                 description="Private rooms in a luxury villa"
//               />
//               <FeatureCard
//                 icon={Coffee}
//                 title="Flexible Schedule"
//                 description="No structured workshops - pure networking"
//               />
//               <FeatureCard
//                 icon={Award}
//                 title="Elite Access"
//                 description="Invitation-only experience"
//               />
//             </div>

//             <div className="text-center">
//               <a
//                 href={EXECUTIVE_ESCAPE_MAIL}
//                 className="inline-block px-6 sm:px-8 py-2 sm:py-3 border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-lg transition-colors"
//               >
//                 Apply for Consideration
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 sm:py-20 bg-navy text-white">
//         <div className="container mx-auto px-4 sm:px-6 text-center">
//           <div className="max-w-2xl mx-auto">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-3 sm:mb-4">
//               Limited Spots, Lifetime Impact
//             </h2>
//             <p className="text-lg sm:text-xl mb-6 sm:mb-8">
//               We keep the group small and highly curated. If you're ready to experience a network that will change your trajectory, apply now.
//             </p>
//             <a
//               href={APPLICATION_FORM_URL}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-colors mb-4"
//             >
//               Apply Now
//             </a>
//             <p className="text-sm text-gray-300">
//               Only {prices.spotsRemaining} spots remaining
//             </p>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default LowerSections;


import { motion } from 'framer-motion';
import { Users, Hotel, Coffee, Award } from 'lucide-react';
import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';
import { LucideIcon } from 'lucide-react';

// TypeScript interfaces
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PricesType {
  acceptingApplicationsFor?: string;
  spotsRemaining?: string | number;
}

interface LowerSectionsProps {
  APPLICATION_FORM_URL: string;
  EXECUTIVE_ESCAPE_MAIL: string;
  prices: PricesType;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  // Feature card animation variants
  const cardVariants = {
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
      rotate: -180
    },
    visible: { 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    }
  };

  return (
    <motion.div 
      className="flex gap-4 items-start group cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: false, margin: "-20px" }}
    >
      <motion.div 
        className="p-2 rounded-full bg-navy/5 group-hover:bg-navy/10 transition-colors"
        variants={iconVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        <Icon size={24} className="text-navy" />
      </motion.div>
      <div>
        <motion.h3 
          className="font-medium mb-1"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.1, duration: 0.4 }}
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-gray-600 text-sm"
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
};

const LowerSections = ({ APPLICATION_FORM_URL, EXECUTIVE_ESCAPE_MAIL, prices }: LowerSectionsProps) => {
  // Animation configurations for different sections
  
  // First section animations
  const firstSectionHeaderAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.7,
    staggerChildren: 0.2
  });

  const firstSectionFeaturesAnimation = useSectionRevealAnimation({
    variant: 'slide-up',
    once: false,
    threshold: { desktop: 0.1, mobile: 0.05 },
    duration: 0.6,
    staggerChildren: 0.15,
    delayChildren: 0.2
  });

  const firstSectionCtaAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.6, mobile: 0.5 },
    duration: 0.6
  });

  // Second section animations
  const secondSectionHeaderAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.7,
    staggerChildren: 0.2
  });

  const secondSectionFeaturesAnimation = useSectionRevealAnimation({
    variant: 'slide-up',
    once: false,
    threshold: { desktop: 0.1, mobile: 0.05 },
    duration: 0.6,
    staggerChildren: 0.15,
    delayChildren: 0.2
  });

  const secondSectionCtaAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.6, mobile: 0.5 },
    duration: 0.6
  });

  // Final section animations
  const finalSectionAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.8,
    staggerChildren: 0.3
  });

  return (
    <>
      {/* First Section - Ultimate 7-Day Retreat */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            
            {/* Section Header */}
            <motion.div
              ref={firstSectionHeaderAnimation.ref}
              variants={firstSectionHeaderAnimation.parentVariants}
              initial="hidden"
              animate={firstSectionHeaderAnimation.controls}
            >
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-3 sm:mb-4"
                variants={firstSectionHeaderAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                The Ultimate 7-Day Retreat
              </motion.h2>
              
              <motion.p 
                className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12"
                variants={firstSectionHeaderAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                Curated experiences, deep conversations, and a high-value network that will stay with you for life.
              </motion.p>
            </motion.div>
            
            {/* Features Grid */}
            <motion.div 
              className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12"
              ref={firstSectionFeaturesAnimation.ref}
              variants={firstSectionFeaturesAnimation.parentVariants}
              initial="hidden"
              animate={firstSectionFeaturesAnimation.controls}
            >
              <motion.div variants={firstSectionFeaturesAnimation.childVariants}>
                <FeatureCard
                  icon={Users}
                  title="Curated Group"
                  description="Small, highly curated group of 20 individuals"
                />
              </motion.div>
              
              <motion.div variants={firstSectionFeaturesAnimation.childVariants}>
                <FeatureCard
                  icon={Hotel}
                  title="Luxury Stay"
                  description="Luxury villa stay with gourmet meals"
                />
              </motion.div>
              
              <motion.div variants={firstSectionFeaturesAnimation.childVariants}>
                <FeatureCard
                  icon={Coffee}
                  title="High-Impact Sessions"
                  description="Workshops, simulations, and strategy sessions"
                />
              </motion.div>
              
              <motion.div variants={firstSectionFeaturesAnimation.childVariants}>
                <FeatureCard
                  icon={Award}
                  title="Premium Access"
                  description="Direct access to frameworks and templates"
                />
              </motion.div>
            </motion.div>

            {/* CTA Section */}
            {/* <motion.div 
              className="text-center"
              ref={firstSectionCtaAnimation.ref}
              variants={firstSectionCtaAnimation.parentVariants}
              initial="hidden"
              animate={firstSectionCtaAnimation.controls}
            >
              <motion.a
                href={APPLICATION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 sm:px-6 py-2 sm:py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
                variants={firstSectionCtaAnimation.childVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(224, 122, 95, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Now
              </motion.a>
              
              <motion.p 
                className="text-sm text-gray-600 mt-4"
                variants={firstSectionCtaAnimation.childVariants}
              >
                Currently accepting applications for {prices.acceptingApplicationsFor || 'February 2026'}
              </motion.p>
            </motion.div> */}
          </div>
        </div>
      </section>

      {/* Second Section - Private High-Level Conversations */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            
            {/* Section Header */}
            <motion.div
              ref={secondSectionHeaderAnimation.ref}
              variants={secondSectionHeaderAnimation.parentVariants}
              initial="hidden"
              animate={secondSectionHeaderAnimation.controls}
            >
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-3 sm:mb-4"
                variants={secondSectionHeaderAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                Private, High-Level Conversations
              </motion.h2>
              
              <motion.p 
                className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12"
                variants={secondSectionHeaderAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                No structured sessions, no group activities – just a space for networking and deep discussions.
              </motion.p>
            </motion.div>
            
            {/* Features Grid */}
            <motion.div 
              className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12"
              ref={secondSectionFeaturesAnimation.ref}
              variants={secondSectionFeaturesAnimation.parentVariants}
              initial="hidden"
              animate={secondSectionFeaturesAnimation.controls}
            >
              <motion.div variants={secondSectionFeaturesAnimation.childVariants}>
                <FeatureCard
                  icon={Users}
                  title="Exclusive Group"
                  description="Limited to 8-10 high-level individuals per villa"
                />
              </motion.div>
              
              <motion.div variants={secondSectionFeaturesAnimation.childVariants}>
                <FeatureCard
                  icon={Hotel}
                  title="Private Rooms"
                  description="Private rooms in a luxury villa"
                />
              </motion.div>
              
              <motion.div variants={secondSectionFeaturesAnimation.childVariants}>
                <FeatureCard
                  icon={Coffee}
                  title="Flexible Schedule"
                  description="No structured workshops - pure networking"
                />
              </motion.div>
              
              <motion.div variants={secondSectionFeaturesAnimation.childVariants}>
                <FeatureCard
                  icon={Award}
                  title="Elite Access"
                  description="Invitation-only experience"
                />
              </motion.div>
            </motion.div>

            {/* CTA Section */}
            {/* <motion.div 
              className="text-center"
              ref={secondSectionCtaAnimation.ref}
              variants={secondSectionCtaAnimation.parentVariants}
              initial="hidden"
              animate={secondSectionCtaAnimation.controls}
            >
              <motion.a
                href={EXECUTIVE_ESCAPE_MAIL}
                className="inline-block px-6 sm:px-8 py-2 sm:py-3 border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-lg transition-colors"
                variants={secondSectionCtaAnimation.childVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(10, 26, 47, 0.2)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Apply for Consideration
              </motion.a>
            </motion.div> */}
          </div>
        </div>
      </section>

      {/* Final Section - Limited Spots */}
      <section className="py-16 sm:py-20 bg-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            
            {/* Final Section Content */}
            <motion.div
              ref={finalSectionAnimation.ref}
              variants={finalSectionAnimation.parentVariants}
              initial="hidden"
              animate={finalSectionAnimation.controls}
            >
              <motion.h2 
                className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-3 sm:mb-4"
                variants={finalSectionAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                Limited Spots, Lifetime Impact
              </motion.h2>
              
              <motion.p 
                className="text-lg sm:text-xl mb-6 sm:mb-8"
                variants={finalSectionAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                We keep the group small and highly curated. If you're ready to experience a network that will change your trajectory, apply now.
              </motion.p>
              
              {/* <motion.a
                href={APPLICATION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-colors mb-4"
                variants={finalSectionAnimation.childVariants}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 8px 25px rgba(224, 122, 95, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Apply Now
              </motion.a> */}
              
              <motion.p 
                className="text-sm text-gray-300"
                variants={finalSectionAnimation.childVariants}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15, 
                  delay: 0.8 
                }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }}
              >
                Only {prices.spotsRemaining} spots remaining
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LowerSections;