
// import Navigation from '../components/Navigation';
// import Footer from '../components/Footer';
// import { Check, Users, Hotel, Coffee, Award } from 'lucide-react';
// import { Badge } from "@/components/ui/badge";
// import { lazy, Suspense } from 'react';
// import { formatRegistrationCloseDate } from '@/services/website-settings';
// import { useReactQueryWebsiteSettings } from '@/hooks/useReactQueryWebsiteSettings';
// import ResponsiveImage from '../components/ui/ResponsiveImage';

// const APPLICATION_FORM_URL = "https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit";
// const LEARN_MORE_URL = "https://docs.google.com/forms/d/1lJIJPAbR3BqiLNRdRrUpuulDYPVGdYN34Th840/edit";
// const EXECUTIVE_ESCAPE_MAIL = "mailto:support@fraterny.com?subject=Exclusive%20Escape%20Inquiry";

// const PricingTier = ({ 
//   name, 
//   price,
//   originalPrice,
//   features, 
//   ctaText, 
//   ctaLink, 
//   isPopular = false,
//   applicationsReceived = null,
//   className = ""
// }) => (
//   <div className={`p-6 rounded-xl border ${isPopular ? 'border-terracotta shadow-lg scale-105' : 'border-gray-200'} bg-white ${className}`}>
//     <div className="flex flex-wrap gap-2 mb-4">
//       {isPopular && (
//         <Badge variant="secondary" className="bg-terracotta text-white">
//           Most Popular
//         </Badge>
//       )}
      
//       {applicationsReceived !== null && (
//         <Badge variant="outline" className="border-terracotta text-navy bg-transparent">
//           {applicationsReceived} Applications received
//         </Badge>
//       )}
//     </div>
//     <h3 className="text-xl font-playfair font-bold mb-2">{name}</h3>
//     <div className="mb-6">
//       {originalPrice && (
//         <div className="text-sm text-gray-400 line-through mb-1">{originalPrice}</div>
//       )}
//       <span className="text-2xl font-bold text-navy">{price}</span>
//     </div>
//     <ul className="space-y-3 mb-6">
//       {features.map((feature, index) => (
//         <li key={index} className="flex items-center gap-2">
//           <Check size={18} className="text-terracotta flex-shrink-0" />
//           <span className="text-gray-600">{feature}</span>
//         </li>
//       ))}
//     </ul>
//     <a
//       href={ctaLink}
//       target="_blank"
//       rel="noopener noreferrer"
//       className={`block text-center py-2 px-4 rounded-lg transition-colors ${
//         isPopular 
//           ? 'bg-terracotta text-white hover:bg-opacity-90' 
//           : 'border border-navy text-navy hover:bg-navy hover:text-white'
//       }`}
//     >
//       {ctaText}
//     </a>
//   </div>
// );

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

// const LowerSections = lazy(() => import('../components/pricing/LowerSections'));

// const Pricing = () => {
//   const { settings, isLoading } = useReactQueryWebsiteSettings();
  
//   const prices = {
//     insiderAccess: isLoading ? "₹499/month" : settings?.insider_access_price || "₹499/month",
//     insiderAccessOriginal: isLoading ? "₹699/month" : settings?.insider_access_original_price || "₹699/month",
//     mainExperience: isLoading ? "₹45,000 - ₹60,000" : settings?.main_experience_price || "₹45,000 - ₹60,000",
//     mainExperienceOriginal: isLoading ? "₹65,000 - ₹80,000" : settings?.main_experience_original_price || "₹65,000 - ₹80,000",
//     executiveEscape: isLoading ? "₹1,50,000+" : settings?.executive_escape_price || "₹1,50,000+",
//     executiveEscapeOriginal: isLoading ? "₹1,85,000+" : settings?.executive_escape_original_price || "₹1,85,000+",
//     spotsRemaining: isLoading ? "--" : settings?.available_seats || 5,
//     closeDate: isLoading ? "March 2025" : formatRegistrationCloseDate(settings?.registration_close_date || '2025-03-31'),
//     acceptingApplicationsFor: isLoading ? "February 2026" : settings?.accepting_applications_for_date || "February 2026",
//     applicationsReceived: isLoading ? 42 : parseInt(settings?.applications_received || "42", 10)
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <Navigation />
      
//       <section className="pt-32 pb-16 bg-navy text-white relative overflow-hidden">
//         <div className="absolute inset-0 opacity-20">
//         <ResponsiveImage 
//             src={{
//               mobile: "/images/hero/pricing-hero-mobile.webp",
//               desktop: "/images/hero/pricing-hero-desktop.webp"
//             }}
//             alt="Luxury villa experience setting"
//             className="h-full w-full object-cover"
//             loading="eager"
//             dynamicKey="pricing-hero"
//           />
//         </div>
//         <div className="container mx-auto px-4 sm:px-6 relative z-10">
//           <div className="max-w-3xl">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair mb-4 sm:mb-6">
//               Choose Your Experience
//             </h1>
//             <p className="text-lg sm:text-xl text-gray-300">
//               Each offering is designed for a different kind of individual. Find the one that fits you best.
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="py-16 sm:py-20">
//         <div className="container mx-auto px-4 sm:px-6">
//           <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
//             <PricingTier
//               name="Insider Access"
//               price={prices.insiderAccess}
//               originalPrice={prices.insiderAccessOriginal}
//               features={[
//                 "Digital Content Only",
//                 "Digital Resources",
//                 "No Community Access",
//                 "No Accommodation",
//                 "No Dining & Activities"
//               ]}
//               ctaText="Learn More"
//               ctaLink={LEARN_MORE_URL}
//             />
//             <PricingTier
//               name="The Main Experience"
//               price={prices.mainExperience}
//               originalPrice={prices.mainExperienceOriginal}
//               features={[
//                 "In-Person Retreat",
//                 "Exclusive Cohort (20 People)",
//                 "Interactive & Hands-on Workshops",
//                 "Shared 10+BHK Luxury Villa",
//                 "Gourmet Meals and Group Activities",
//                 "Lifetime access to the exclusive Fraterny Community"
//               ]}
//               ctaText="Apply Now"
//               ctaLink={APPLICATION_FORM_URL}
//               isPopular={true}
//               applicationsReceived={prices.applicationsReceived}
//             />
//             <PricingTier
//               name="Executive Escape"
//               price={prices.executiveEscape}
//               originalPrice={prices.executiveEscapeOriginal}
//               features={[
//                 "Private Luxury Experience",
//                 "8-10 People Only",
//                 "Complete Flexibility",
//                 "Private Master Bedrooms",
//                 "Exclusive Networking",
//                 "Personalized Gourmet Meals"
//               ]}
//               ctaText="Apply for Consideration"
//               ctaLink={EXECUTIVE_ESCAPE_MAIL}
//             />
//           </div>
//         </div>
//       </section>

//       <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
//         <LowerSections 
//           APPLICATION_FORM_URL={APPLICATION_FORM_URL}
//           EXECUTIVE_ESCAPE_MAIL={EXECUTIVE_ESCAPE_MAIL}
//           prices={prices}
//         />
//       </Suspense>

//       <Footer />
//     </div>
//   );
// };

// export default Pricing;


import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Check, Users, Hotel, Coffee, Award } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { lazy, Suspense } from 'react';
import { formatRegistrationCloseDate } from '@/services/website-settings';
import { useReactQueryWebsiteSettings } from '@/hooks/useReactQueryWebsiteSettings';
import ResponsiveImage from '../components/ui/ResponsiveImage';
import { useSectionRevealAnimation } from '../components/home/useSectionRevealAnimation';

const APPLICATION_FORM_URL = "https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit";
const LEARN_MORE_URL = "https://docs.google.com/forms/d/1lJIJPAbR3BqiLNRdRrUpuulDYPVGdYN34Th840/edit";
const EXECUTIVE_ESCAPE_MAIL = "mailto:support@fraterny.com?subject=Exclusive%20Escape%20Inquiry";

interface PricingTierProps {
  name: string;
  price: string;
  originalPrice?: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  isPopular?: boolean;
  applicationsReceived?: number | null;
  className?: string;
  animationDelay?: number;
}

const PricingTier = ({ 
  name, 
  price,
  originalPrice,
  features, 
  ctaText, 
  ctaLink, 
  isPopular = false,
  applicationsReceived = null,
  className = "",
  animationDelay = 0
}: PricingTierProps) => {
  // Individual card animation variants
  const cardVariants = {
    hidden: { 
      y: 60,
      opacity: 0,
      scale: 0.9
    },
    visible: { 
      y: 0,
      opacity: 1,
      scale: isPopular ? 1.05 : 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: animationDelay
      }
    },
    hover: {
      y: -12,
      scale: isPopular ? 1.08 : 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Badge animation variants
  const badgeVariants = {
    hidden: { 
      scale: 0,
      opacity: 0
    },
    visible: { 
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: animationDelay + 0.2
      }
    }
  };

  // Feature list animation variants
  const featureVariants = {
    hidden: { 
      opacity: 0,
      x: -20
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Price animation variants
  const priceVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: animationDelay + 0.3
      }
    }
  };

  return (
    <motion.div 
      className={`p-6 rounded-xl border ${isPopular ? 'border-black shadow-lg' : 'border-gray-200'} bg-white ${className} group cursor-pointer`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: false, margin: "-50px" }}
    >
      {/* Badges with scale animation */}
      <div className="flex flex-wrap gap-2 mb-4">
        {isPopular && (
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
          >
            <Badge variant="secondary" className="bg-black text-white">
              Most Popular
            </Badge>
          </motion.div>
        )}
        
        {applicationsReceived !== null && (
          <motion.div
            variants={badgeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            transition={{ delay: animationDelay + 0.25 }}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          >
            <Badge variant="outline" className="border-black text-navy bg-transparent">
              {applicationsReceived} Applications received
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Title with fade up */}
      <motion.h3 
        className="text-xl font-playfair font-bold mb-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: animationDelay + 0.1, duration: 0.5 }}
        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
      >
        {name}
      </motion.h3>

      {/* Price section with slide up */}
      <motion.div 
        className="mb-6"
        variants={priceVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false }}
      >
        {originalPrice && (
          <motion.div 
            className="text-sm text-gray-400 line-through mb-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: animationDelay + 0.4, duration: 0.3 }}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
          >
            {originalPrice}
          </motion.div>
        )}
        <motion.span 
          className="text-2xl font-bold text-navy"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15, 
            delay: animationDelay + 0.5 
          }}
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
        >
          {price}
        </motion.span>
      </motion.div>

      {/* Features list with staggered animation */}
      <ul className="space-y-3 mb-6">
        {features.map((feature: string, index: number) => (
          <motion.li 
            key={index} 
            className="flex items-center gap-2"
            variants={featureVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            transition={{ delay: animationDelay + 0.6 + (index * 0.1) }}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 15, 
                delay: animationDelay + 0.7 + (index * 0.1) 
              }}
            >
              <Check size={18} className="text-black flex-shrink-0" />
            </motion.div>
            <span className="text-gray-600" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{feature}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button with enhanced hover */}
      <motion.a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`block text-center py-2 px-4 rounded-lg transition-colors ${
          isPopular 
            ? ' bg-black text-white hover:bg-opacity-90' 
            : 'border border-navy text-navy hover:bg-navy hover:text-white'
        }`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: animationDelay + 0.8, duration: 0.5 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: isPopular 
            ? "0 8px 25px rgba(224, 122, 95, 0.3)" 
            : "0 8px 25px rgba(10, 26, 47, 0.2)"
        }}
        whileTap={{ scale: 0.98 }}
        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
      >
        {ctaText}
      </motion.a>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ComponentType<{ size: number; className: string }>;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="flex gap-4 items-start">
    <div className="p-2 rounded-full bg-navy/5">
      <Icon size={24} className="text-navy" />
    </div>
    <div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const LowerSections = lazy(() => import('../components/pricing/LowerSections'));

const Pricing = () => {
  const { settings, isLoading } = useReactQueryWebsiteSettings();
  
  // Animation configurations for different sections
  
  // Hero section animations
  const heroTitleAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.8,
    staggerChildren: 0.3
  });

  // Pricing cards animation
  const pricingCardsAnimation = useSectionRevealAnimation({
    variant: 'slide-up',
    once: false,
    threshold: { desktop: 0.1, mobile: 0.05 },
    duration: 0.6,
    staggerChildren: 0.2,
    delayChildren: 0.2
  });

  const prices = {
    insiderAccess: isLoading ? "₹499/month" : settings?.insider_access_price || "₹499/month",
    insiderAccessOriginal: isLoading ? "₹699/month" : settings?.insider_access_original_price || "₹699/month",
    mainExperience: isLoading ? "₹45,000 - ₹60,000" : settings?.main_experience_price || "₹45,000 - ₹60,000",
    mainExperienceOriginal: isLoading ? "₹65,000 - ₹80,000" : settings?.main_experience_original_price || "₹65,000 - ₹80,000",
    executiveEscape: isLoading ? "₹1,50,000+" : settings?.executive_escape_price || "₹1,50,000+",
    executiveEscapeOriginal: isLoading ? "₹1,85,000+" : settings?.executive_escape_original_price || "₹1,85,000+",
    spotsRemaining: isLoading ? "--" : settings?.available_seats || 5,
    closeDate: isLoading ? "March 2025" : formatRegistrationCloseDate(settings?.registration_close_date || '2025-03-31'),
    acceptingApplicationsFor: isLoading ? "February 2026" : settings?.accepting_applications_for_date || "February 2026",
    applicationsReceived: isLoading ? 42 : parseInt(settings?.applications_received || "42", 10)
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy text-white relative overflow-hidden">
        {/* Background Image with subtle animation */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <ResponsiveImage 
            // src={{
            //   mobile: "/images/hero/pricing-hero-mobile.webp",
            //   desktop: "/images/hero/pricing-hero-desktop.webp"
            // }}
            alt="Luxury villa experience setting"
            className="h-full w-full object-cover"
            loading="eager"
            dynamicKey="pricing-hero"
          />
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            
            {/* Hero Title with scroll animation */}
            <motion.div
              ref={heroTitleAnimation.ref}
              variants={heroTitleAnimation.parentVariants}
              initial="hidden"
              animate={heroTitleAnimation.controls}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair mb-4 sm:mb-6"
                variants={heroTitleAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}  
              >
                Choose Your <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Experience</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl text-gray-300"
                variants={heroTitleAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
              >
                Each offering is designed for a different kind of individual. Find the one that fits you best.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          
          {/* Pricing Cards Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto"
            ref={pricingCardsAnimation.ref}
            variants={pricingCardsAnimation.parentVariants}
            initial="hidden"
            animate={pricingCardsAnimation.controls}
          >
            <motion.div variants={pricingCardsAnimation.childVariants}>
              <PricingTier
                name="Insider Access"
                price={prices.insiderAccess}
                originalPrice={prices.insiderAccessOriginal}
                features={[
                  "Digital Content Only",
                  "Digital Resources",
                  "No Community Access",
                  "No Accommodation",
                  "No Dining & Activities"
                ]}
                ctaText="Learn More"
                ctaLink={LEARN_MORE_URL}
                animationDelay={0}
              />
            </motion.div>

            <motion.div variants={pricingCardsAnimation.childVariants}>
              <PricingTier
                name="The Main Experience"
                price={prices.mainExperience}
                originalPrice={prices.mainExperienceOriginal}
                features={[
                  "In-Person Retreat",
                  "Exclusive Cohort (20 People)",
                  "Interactive & Hands-on Workshops",
                  "Shared 10+BHK Luxury Villa",
                  "Gourmet Meals and Group Activities",
                  "Lifetime access to the exclusive Fraterny Community"
                ]}
                ctaText="Apply Now"
                ctaLink={APPLICATION_FORM_URL}
                isPopular={true}
                applicationsReceived={prices.applicationsReceived}
                animationDelay={0.1}
              />
            </motion.div>

            <motion.div variants={pricingCardsAnimation.childVariants}>
              <PricingTier
                name="Executive Escape"
                price={prices.executiveEscape}
                originalPrice={prices.executiveEscapeOriginal}
                features={[
                  "Private Luxury Experience",
                  "8-10 People Only",
                  "Complete Flexibility",
                  "Private Master Bedrooms",
                  "Exclusive Networking",
                  "Personalized Gourmet Meals"
                ]}
                ctaText="Apply for Consideration"
                ctaLink={EXECUTIVE_ESCAPE_MAIL}
                animationDelay={0.2}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Lower Sections with Suspense Animation */}
      <Suspense 
        fallback={
          <motion.div 
            className="h-64 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-gray-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading...
            </motion.div>
          </motion.div>
        }
      >
        <LowerSections 
          APPLICATION_FORM_URL={APPLICATION_FORM_URL}
          EXECUTIVE_ESCAPE_MAIL={EXECUTIVE_ESCAPE_MAIL}
          prices={prices}
        />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Pricing;