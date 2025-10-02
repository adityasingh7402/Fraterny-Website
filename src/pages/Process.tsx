// import { useState, useEffect, useMemo } from 'react';
// import Navigation from '../components/Navigation';
// import Footer from '../components/Footer';
// import { ClipboardList, Phone, UserCheck, Check } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchWebsiteSettings, formatRegistrationCloseDate } from '@/services/websiteSettingsService';
// import ResponsiveImage from '../components/ui/ResponsiveImage';
// const Process = () => {
//   const {
//     data: settings,
//     isLoading
//   } = useQuery({
//     queryKey: ['websiteSettings'],
//     queryFn: fetchWebsiteSettings
//   });

//   // Format the application close date
//   const formattedCloseDate = useMemo(() => {
//     if (isLoading || !settings?.registration_close_date) return 'March 2025';
//     return formatRegistrationCloseDate(settings.registration_close_date);
//   }, [settings?.registration_close_date, isLoading]);
//   return <div className="min-h-screen bg-white">
//       <Navigation />
      
//       {/* Hero Section */}
//       <section className="pt-32 pb-16 bg-navy text-white relative">
//         {/* Background Image */}
//         <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
//           <ResponsiveImage src={{
//           mobile: "/images/hero/process-hero-mobile.webp",
//           desktop: "/images/hero/process-hero-desktop.webp"
//         }} alt="Luxury villa experience setting" className="h-full w-full object-cover" loading="eager" dynamicKey="process-hero" />
//         </div>
      
//         {/* Gradient Overlay */}
//         <div className="absolute inset-0" style={{
//         background: `linear-gradient(to right, 
//               rgba(10, 26, 47, 0.95) 0%,
//               rgba(10, 26, 47, 0.8) 50%,
//               rgba(10, 26, 47, 0.6) 100%
//             )`
//       }} />

//         <div className="container mx-auto px-6 relative z-10">
//           <div className="max-w-3xl ">
//             <h1 className="md:text-5xl font-playfair mb-6 text-5xl lg:text-6xl">
//               It's not special if everyone has it
//             </h1>
//             <p className="text-gray-300 mb-8 max-w-2xl font-extralight text-left text-lg">
//               We make sure you interact with only ambitious, likeminded and interesting people.
//             </p>
            
//             {/* Application Status */}
//             <div className="flex flex-wrap gap-8 items-center">
//               <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4">
//                 <div className="text-sm text-gray-400">Available Seats</div>
//                 <div className="text-2xl font-mono">
//                   {isLoading ? <span className="opacity-50">Loading...</span> : settings?.available_seats || 20}
//                 </div>
//               </div>
//               <div>
//                 <div className="text-sm text-gray-400">Applications Close</div>
//                 <div className="text-xl">
//                   {isLoading ? <span className="opacity-50">Loading...</span> : formattedCloseDate}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Who is this for? Section - MOBILE OPTIMIZED */}
//       <section className="pt-16 md:pt-20 pb-10 md:pb-16 py-[34px] bg-stone-50">
//         <div className="container mx-auto px-4 sm:px-6">
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-3xl font-playfair text-navy mb-6 md:mb-8 text-center md:text-5xl">
//               Who is this for?
//             </h2>
            
//             <div className="mb-12 md:mb-16">
//               <p className="text-xl text-gray-600 italic mb-8 md:mb-12 text-center max-w-2xl mx-auto">
//                 This is not for everyone. But if you are the right fit, you will know.
//               </p>

//               <div className="grid md:grid-cols-2 gap-4 md:gap-8 ">
//                 <div className="space-y-4 md:space-y-8">
//                   <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       <p className="leading-relaxed text-base md:text-lg text-gray-200">You have big ideas and ambitious goals, but you need the right people around you to refine, validate, and discuss them with.</p>
//                     </div>
//                   </div>

//                   <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       <p className="leading-relaxed text-base md:text-lg text-gray-200">You believe in execution over excuses. You are not here for inspiration; you are here to contribute and collaborate with your own unique perspective.</p>
//                     </div>
//                   </div>

//                   <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       <p className="leading-relaxed text-base md:text-lg text-gray-200">You don't follow trends; you create them. Whether you are or aim to be an entrepreneur, investor, or innovator, you want to be in a space where you are encouraged and assisted.</p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-4 md:space-y-8">
//                   <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       <p className="leading-relaxed text-base md:text-lg text-gray-200">You seek deep conversations, meaningful connections, and experiences that shift your perspective and elevate your journey.</p>
//                     </div>
//                   </div>

//                   <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       <p className="leading-relaxed text-base md:text-lg text-gray-200">You understand the power of a strong network. You are here to meet driven individuals who challenge and expand your thinking.</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mb-12 md:mb-20">
//               <h3 className="font-playfair text-navy mb-6 md:mb-8 text-center text-3xl md:text-5xl">Who this is 'not' for?</h3>
              
//               <div className="grid md:grid-cols-2 gap-4 md:gap-8 my-[51px] r px-0 py-0">
//                 <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow my-0 py-[35px] bg-slate-900">
//                   <div className="flex items-start gap-3 md:gap-4">
//                     <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                     <p className="leading-relaxed text-base md:text-lg font-normal text-gray-200">Those looking for a solo experience. </p>
//                   </div>
//                 </div>

//                 <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow py-[35px] bg-slate-900">
//                   <div className="flex items-start gap-3 md:gap-4">
//                     <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                     <p className="leading-relaxed text-base md:text-lg text-gray-200">Anyone with a passive approach.</p>
//                   </div>
//                 </div>

//                 <div className="md:col-span-2 shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow py-[35px] bg-slate-900">
//                   <div className="flex items-start gap-3 md:gap-4">
//                     <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                     <p className="leading-relaxed text-base md:text-lg px-0 text-gray-200">Those who are not open to exploring new ideas, values or perspectives.</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Steps Section */}
//       <section className="pt-8 pb-16 bg-white">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl font-playfair text-navy mb-12 text-center md:text-5xl">
//             The Process
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
//             {/* Step 1: Apply */}
//             <div className="bg-white p-8 rounded-lg border border-gray-100">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium">
//                   1
//                 </div>
//                 <h3 className="text-xl font-medium text-navy">Apply</h3>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Fill out the Registration form - The registration form allows us to confirm your identity, and help us assess whether we will be able to add value to your life.
//               </p>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>Personal Details</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>LinkedIn Profile</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>Vision Statement</span>
//                 </div>
//               </div>
//               <p className="mt-4 text-sm text-gray-500">
//                 We encourage group applications with 1-2 friends. Only 1 registration is needed for friend groups.
//               </p>
//             </div>

//             {/* Step 2: Screening Call */}
//             <div className="bg-white p-8 rounded-lg border border-gray-100">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium">
//                   2
//                 </div>
//                 <h3 className="text-xl font-medium text-navy">Screening Call</h3>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Have a brief conversation - A Fraterny counselor will contact you to have a friendly conversation after your form is shortlisted. Only thing that matters the most is authentic responses from your end.
//               </p>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Phone size={16} className="text-terracotta" />
//                 <span>15 Minutes</span>
//               </div>
//             </div>

//             {/* Step 3: Join */}
//             <div className="bg-white p-8 rounded-lg border border-gray-100">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium">
//                   3
//                 </div>
//                 <h3 className="text-xl font-medium text-navy">Join</h3>
//               </div>
//               <p className="text-gray-600 mb-6">
//                 Welcome to the Ecosystem - We will send you a confirmation email for your acceptance in Fraterny.
//               </p>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>Applying with friends?</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>Group applications welcome</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Security Notice */}
//           <div className="mt-12 text-center text-sm text-gray-500">Your data is 100% secure. Not selected? You will get priority access in future bootcamps.</div>
//         </div>
//       </section>

//       <Footer />
//     </div>;
// };
// export default Process;

// -------------------------------------------------------------- //

// import { useState, useEffect, useMemo } from 'react';
// import { motion } from 'framer-motion';
// import Navigation from '../components/Navigation';
// import Footer from '../components/Footer';
// import { ClipboardList, Phone, UserCheck, Check } from 'lucide-react';
// import { useQuery } from '@tanstack/react-query';
// import { fetchWebsiteSettings, formatRegistrationCloseDate } from '@/services/websiteSettingsService';
// import ResponsiveImage from '../components/ui/ResponsiveImage';
// import { useSectionRevealAnimation } from '../components/home/useSectionRevealAnimation';

// const Process = () => {
//   const {
//     data: settings,
//     isLoading
//   } = useQuery({
//     queryKey: ['websiteSettings'],
//     queryFn: fetchWebsiteSettings
//   });

//   // Format the application close date
//   const formattedCloseDate = useMemo(() => {
//     if (isLoading || !settings?.registration_close_date) return 'March 2025';
//     return formatRegistrationCloseDate(settings.registration_close_date);
//   }, [settings?.registration_close_date, isLoading]);

//   // Animation configurations for different sections
  
//   // Hero section animations
//   const heroTitleAnimation = useSectionRevealAnimation({
//     variant: 'fade-up',
//     once: false,
//     threshold: { desktop: 0.3, mobile: 0.2 },
//     duration: 0.8,
//     staggerChildren: 0.3
//   });

//   const heroStatsAnimation = useSectionRevealAnimation({
//     variant: 'fade-right',
//     once: false,
//     threshold: { desktop: 0.4, mobile: 0.3 },
//     duration: 0.6,
//     staggerChildren: 0.2,
//     delayChildren: 0.4
//   });

//   // "Who is this for?" section animations
//   const whoForTitleAnimation = useSectionRevealAnimation({
//     variant: 'fade-up',
//     once: false,
//     threshold: { desktop: 0.3, mobile: 0.2 },
//     duration: 0.7,
//     staggerChildren: 0.2
//   });

//   const whoForCardsAnimation = useSectionRevealAnimation({
//     variant: 'slide-up',
//     once: false,
//     threshold: { desktop: 0.1, mobile: 0.05 },
//     duration: 0.6,
//     staggerChildren: 0.15,
//     delayChildren: 0.2
//   });

//   const whoNotForAnimation = useSectionRevealAnimation({
//     variant: 'fade-up',
//     once: false,
//     threshold: { desktop: 0.1, mobile: 0.05 },
//     duration: 0.6,
//     staggerChildren: 0.15,
//     delayChildren: 0.1
//   });

//   // Process steps animations
//   const processHeaderAnimation = useSectionRevealAnimation({
//     variant: 'fade-up',
//     once: false,
//     threshold: { desktop: 0.3, mobile: 0.2 },
//     duration: 0.7
//   });

//   const processStepsAnimation = useSectionRevealAnimation({
//     variant: 'slide-up',
//     once: false,
//     threshold: { desktop: 0.2, mobile: 0.15 },
//     duration: 0.6,
//     staggerChildren: 0.25,
//     delayChildren: 0.3
//   });

//   const securityNoticeAnimation = useSectionRevealAnimation({
//     variant: 'fade-up',
//     once: false,
//     threshold: { desktop: 0.6, mobile: 0.5 },
//     duration: 0.5
//   });

//   // Card hover animation variants
//   const cardVariants = {
//     hidden: { 
//       y: 40,
//       opacity: 0,
//       scale: 0.95
//     },
//     visible: { 
//       y: 0,
//       opacity: 1,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     },
//     hover: {
//       y: -5,
//       scale: 1.02,
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 25
//       }
//     }
//   };

//   // Step card variants with enhanced animations
//   const stepCardVariants = {
//     hidden: { 
//       y: 60,
//       opacity: 0,
//       scale: 0.9
//     },
//     visible: { 
//       y: 0,
//       opacity: 1,
//       scale: 1,
//       transition: {
//         type: "spring",
//         stiffness: 100,
//         damping: 15
//       }
//     },
//     hover: {
//       y: -8,
//       scale: 1.03,
//       boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
//       transition: {
//         type: "spring",
//         stiffness: 400,
//         damping: 25
//       }
//     }
//   };

//   // Icon animation variants
//   const iconVariants = {
//     hidden: { 
//       scale: 0,
//       rotate: -180
//     },
//     visible: { 
//       scale: 1,
//       rotate: 0,
//       transition: {
//         type: "spring",
//         stiffness: 200,
//         damping: 15,
//         delay: 0.2
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <Navigation />
      
//       {/* Hero Section */}
//       <section className="pt-32 pb-16 bg-navy text-white relative">
//         {/* Background Image */}
//         <motion.div 
//           className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//           initial={{ scale: 1.1, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           transition={{ duration: 2, ease: "easeOut" }}
//         >
//           <ResponsiveImage 
//             // src={{
//             //   mobile: "/images/hero/process-hero-mobile.webp",
//             //   desktop: "/images/hero/process-hero-desktop.webp"
//             // }} 
//             alt="Luxury villa experience setting" 
//             className="h-full w-full object-cover" 
//             loading="eager" 
//             dynamicKey="process-hero" 
//           />
//         </motion.div>
      
//         {/* Gradient Overlay */}
//         <motion.div 
//           className="absolute inset-0" 
//           style={{
//             background: `linear-gradient(to right, 
//               rgba(10, 26, 47, 0.95) 0%,
//               rgba(10, 26, 47, 0.8) 50%,
//               rgba(10, 26, 47, 0.6) 100%
//             )`
//           }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 1.5, delay: 0.5 }}
//         />

//         <div className="container mx-auto px-6 relative z-10">
//           <div className="max-w-3xl">
            
//             {/* Hero Title with scroll animation */}
//             <motion.div
//               ref={heroTitleAnimation.ref}
//               variants={heroTitleAnimation.parentVariants}
//               initial="hidden"
//               animate={heroTitleAnimation.controls}
//             >
//               <motion.h1 
//                 className="md:text-5xl font-playfair mb-6 text-5xl lg:text-6xl"
//                 variants={heroTitleAnimation.childVariants}
//               >
//                 It's not special if everyone has it
//               </motion.h1>
              
//               <motion.p 
//                 className="text-gray-300 mb-8 max-w-2xl font-extralight text-left text-lg"
//                 variants={heroTitleAnimation.childVariants}
//               >
//                 We make sure you interact with only ambitious, likeminded and interesting people.
//               </motion.p>
//             </motion.div>
            
//             {/* Application Status with enhanced animations */}
//             <motion.div
//               className="flex flex-wrap gap-8 items-center"
//               ref={heroStatsAnimation.ref}
//               variants={heroStatsAnimation.parentVariants}
//               initial="hidden"
//               animate={heroStatsAnimation.controls}
//             >
//               <motion.div 
//                 className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 group cursor-pointer"
//                 variants={heroStatsAnimation.childVariants}
//                 whileHover={{ 
//                   scale: 1.05,
//                   backgroundColor: "rgba(0, 0, 0, 0.4)"
//                 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 25 }}
//               >
//                 <div className="text-sm text-gray-400">Available Seats</div>
//                 <motion.div 
//                   className="text-2xl font-mono"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 1, duration: 0.5 }}
//                 >
//                   {isLoading ? (
//                     <motion.span 
//                       className="opacity-50"
//                       animate={{ opacity: [0.5, 1, 0.5] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                     >
//                       Loading...
//                     </motion.span>
//                   ) : (
//                     settings?.available_seats || 20
//                   )}
//                 </motion.div>
//               </motion.div>
              
//               <motion.div
//                 variants={heroStatsAnimation.childVariants}
//               >
//                 <div className="text-sm text-gray-400">Applications Close</div>
//                 <motion.div 
//                   className="text-xl"
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: 1.2, duration: 0.5 }}
//                 >
//                   {isLoading ? (
//                     <motion.span 
//                       className="opacity-50"
//                       animate={{ opacity: [0.5, 1, 0.5] }}
//                       transition={{ duration: 1.5, repeat: Infinity }}
//                     >
//                       Loading...
//                     </motion.span>
//                   ) : (
//                     formattedCloseDate
//                   )}
//                 </motion.div>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Who is this for? Section */}
//       <section className="pt-16 md:pt-20 pb-10 md:pb-16 py-[34px] bg-stone-50">
//         <div className="container mx-auto px-4 sm:px-6">
//           <div className="max-w-4xl mx-auto">
            
//             {/* Section Header */}
//             <motion.div
//               ref={whoForTitleAnimation.ref}
//               variants={whoForTitleAnimation.parentVariants}
//               initial="hidden"
//               animate={whoForTitleAnimation.controls}
//             >
//               <motion.h2 
//                 className="text-3xl font-playfair text-navy mb-6 md:mb-8 text-center md:text-5xl"
//                 variants={whoForTitleAnimation.childVariants}
//               >
//                 Who is this for?
//               </motion.h2>
              
//               <motion.p 
//                 className="text-xl text-gray-600 italic mb-8 md:mb-12 text-center max-w-2xl mx-auto"
//                 variants={whoForTitleAnimation.childVariants}
//               >
//                 This is not for everyone. But if you are the right fit, you will know.
//               </motion.p>
//             </motion.div>

//             {/* "For" Cards Grid */}
//             <motion.div 
//               className="mb-12 md:mb-16"
//               ref={whoForCardsAnimation.ref}
//               variants={whoForCardsAnimation.parentVariants}
//               initial="hidden"
//               animate={whoForCardsAnimation.controls}
//             >
//               <div className="grid md:grid-cols-2 gap-4 md:gap-8">
//                 <div className="space-y-4 md:space-y-8">
//                   <motion.div 
//                     className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
//                     variants={cardVariants}
//                     whileHover="hover"
//                   >
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <motion.div
//                         variants={iconVariants}
//                         initial="hidden"
//                         animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
//                       >
//                         <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       </motion.div>
//                       <p className="leading-relaxed text-base md:text-lg text-gray-200">
//                         You have big ideas and ambitious goals, but you need the right people around you to refine, validate, and discuss them with.
//                       </p>
//                     </div>
//                   </motion.div>

//                   <motion.div 
//                     className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
//                     variants={cardVariants}
//                     whileHover="hover"
//                   >
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <motion.div
//                         variants={iconVariants}
//                         initial="hidden"
//                         animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
//                         transition={{ delay: 0.1 }}
//                       >
//                         <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       </motion.div>
//                       <p className="leading-relaxed text-base md:text-lg text-gray-200">
//                         You believe in execution over excuses. You are not here for inspiration; you are here to contribute and collaborate with your own unique perspective.
//                       </p>
//                     </div>
//                   </motion.div>

//                   <motion.div 
//                     className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
//                     variants={cardVariants}
//                     whileHover="hover"
//                   >
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <motion.div
//                         variants={iconVariants}
//                         initial="hidden"
//                         animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
//                         transition={{ delay: 0.2 }}
//                       >
//                         <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       </motion.div>
//                       <p className="leading-relaxed text-base md:text-lg text-gray-200">
//                         You don't follow trends; you create them. Whether you are or aim to be an entrepreneur, investor, or innovator, you want to be in a space where you are encouraged and assisted.
//                       </p>
//                     </div>
//                   </motion.div>
//                 </div>

//                 <div className="space-y-4 md:space-y-8">
//                   <motion.div 
//                     className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
//                     variants={cardVariants}
//                     whileHover="hover"
//                   >
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <motion.div
//                         variants={iconVariants}
//                         initial="hidden"
//                         animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
//                         transition={{ delay: 0.3 }}
//                       >
//                         <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       </motion.div>
//                       <p className="leading-relaxed text-base md:text-lg text-gray-200">
//                         You seek deep conversations, meaningful connections, and experiences that shift your perspective and elevate your journey.
//                       </p>
//                     </div>
//                   </motion.div>

//                   <motion.div 
//                     className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
//                     variants={cardVariants}
//                     whileHover="hover"
//                   >
//                     <div className="flex items-start gap-3 md:gap-4">
//                       <motion.div
//                         variants={iconVariants}
//                         initial="hidden"
//                         animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
//                         transition={{ delay: 0.4 }}
//                       >
//                         <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                       </motion.div>
//                       <motion.p 
//                         className="leading-relaxed text-base md:text-lg text-gray-200"
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ 
//                           opacity: whoForCardsAnimation.isInView ? 1 : 0,
//                           x: whoForCardsAnimation.isInView ? 0 : -10
//                         }}
//                         transition={{ delay: 0.7, duration: 0.5 }}
//                       >
//                         You understand the power of a strong network. You are here to meet driven individuals who challenge and expand your thinking.
//                       </motion.p>
//                     </div>
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>

//             {/* "Not For" Section */}
//             <motion.div 
//               className="mb-12 md:mb-20"
//               ref={whoNotForAnimation.ref}
//               variants={whoNotForAnimation.parentVariants}
//               initial="hidden"
//               animate={whoNotForAnimation.controls}
//             >
//               <motion.h3 
//                 className="font-playfair text-navy mb-6 md:mb-8 text-center text-3xl md:text-5xl"
//                 variants={whoNotForAnimation.childVariants}
//               >
//                 Who this is 'not' for?
//               </motion.h3>
              
//               <div className="grid md:grid-cols-2 gap-4 md:gap-8 my-[51px] px-0 py-0">
//                 <motion.div 
//                   className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow my-0 py-[35px] bg-slate-900 group cursor-pointer"
//                   variants={cardVariants}
//                   whileHover="hover"
//                 >
//                   <div className="flex items-start gap-3 md:gap-4">
//                     <motion.div
//                       variants={iconVariants}
//                       initial="hidden"
//                       animate={whoNotForAnimation.isInView ? "visible" : "hidden"}
//                     >
//                       <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                     </motion.div>
//                     <p className="leading-relaxed text-base md:text-lg font-normal text-gray-200">
//                       Those looking for a solo experience.
//                     </p>
//                   </div>
//                 </motion.div>

//                 <motion.div 
//                   className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow py-[35px] bg-slate-900 group cursor-pointer"
//                   variants={cardVariants}
//                   whileHover="hover"
//                 >
//                   <div className="flex items-start gap-3 md:gap-4">
//                     <motion.div
//                       variants={iconVariants}
//                       initial="hidden"
//                       animate={whoNotForAnimation.isInView ? "visible" : "hidden"}
//                       transition={{ delay: 0.1 }}
//                     >
//                       <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                     </motion.div>
//                     <p className="leading-relaxed text-base md:text-lg text-gray-200">
//                       Anyone with a passive approach.
//                     </p>
//                   </div>
//                 </motion.div>

//                 <motion.div 
//                   className="md:col-span-2 shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow py-[35px] bg-slate-900 group cursor-pointer"
//                   variants={cardVariants}
//                   whileHover="hover"
//                 >
//                   <div className="flex items-start gap-3 md:gap-4">
//                     <motion.div
//                       variants={iconVariants}
//                       initial="hidden"
//                       animate={whoNotForAnimation.isInView ? "visible" : "hidden"}
//                       transition={{ delay: 0.2 }}
//                     >
//                       <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
//                     </motion.div>
//                     <motion.p 
//                       className="leading-relaxed text-base md:text-lg px-0 text-gray-200"
//                       initial={{ opacity: 0, x: -10 }}
//                       animate={{ 
//                         opacity: whoNotForAnimation.isInView ? 1 : 0,
//                         x: whoNotForAnimation.isInView ? 0 : -10
//                       }}
//                       transition={{ delay: 0.5, duration: 0.5 }}
//                     >
//                       Those who are not open to exploring new ideas, values or perspectives.
//                     </motion.p>
//                   </div>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Steps Section */}
//       <section className="pt-8 pb-16 bg-white">
//         <div className="container mx-auto px-6">
          
//           {/* Process Header */}
//           <motion.div
//             ref={processHeaderAnimation.ref}
//             variants={processHeaderAnimation.parentVariants}
//             initial="hidden"
//             animate={processHeaderAnimation.controls}
//           >
//             <motion.h2 
//               className="text-3xl font-playfair text-navy mb-12 text-center md:text-5xl"
//               variants={processHeaderAnimation.childVariants}
//             >
//               The Process
//             </motion.h2>
//           </motion.div>
          
//           {/* Process Steps Grid */}
//           <motion.div 
//             className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
//             ref={processStepsAnimation.ref}
//             variants={processStepsAnimation.parentVariants}
//             initial="hidden"
//             animate={processStepsAnimation.controls}
//           >
//             {/* Step 1: Apply */}
//             <motion.div 
//               className="bg-white p-8 rounded-lg border border-gray-100 group cursor-pointer"
//               variants={stepCardVariants}
//               whileHover="hover"
//             >
//               <motion.div 
//                 className="flex items-center gap-4 mb-6"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ 
//                   opacity: processStepsAnimation.isInView ? 1 : 0,
//                   x: processStepsAnimation.isInView ? 0 : -20
//                 }}
//                 transition={{ delay: 0.2, duration: 0.5 }}
//               >
//                 <motion.div 
//                   className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium"
//                   whileHover={{ 
//                     scale: 1.1,
//                     backgroundColor: "#E07A5F" // terracotta
//                   }}
//                   transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                 >
//                   1
//                 </motion.div>
//                 <h3 className="text-xl font-medium text-navy">Apply</h3>
//               </motion.div>
              
//               <motion.p 
//                 className="text-gray-600 mb-6"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ 
//                   opacity: processStepsAnimation.isInView ? 1 : 0,
//                   y: processStepsAnimation.isInView ? 0 : 10
//                 }}
//                 transition={{ delay: 0.3, duration: 0.5 }}
//               >
//                 Fill out the Registration form - The registration form allows us to confirm your identity, and help us assess whether we will be able to add value to your life.
//               </motion.p>
              
//               <motion.div 
//                 className="space-y-3"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: processStepsAnimation.isInView ? 1 : 0 }}
//                 transition={{ delay: 0.4, duration: 0.5 }}
//               >
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>Personal Details</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>LinkedIn Profile</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>Vision Statement</span>
//                 </div>
//               </motion.div>
              
//               <motion.p 
//                 className="mt-4 text-sm text-gray-500"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ 
//                   opacity: processStepsAnimation.isInView ? 1 : 0,
//                   y: processStepsAnimation.isInView ? 0 : 10
//                 }}
//                 transition={{ delay: 0.5, duration: 0.5 }}
//               >
//                 We encourage group applications with 1-2 friends. Only 1 registration is needed for friend groups.
//               </motion.p>
//             </motion.div>

//             {/* Step 2: Screening Call */}
//             <motion.div 
//               className="bg-white p-8 rounded-lg border border-gray-100 group cursor-pointer"
//               variants={stepCardVariants}
//               whileHover="hover"
//             >
//               <motion.div 
//                 className="flex items-center gap-4 mb-6"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ 
//                   opacity: processStepsAnimation.isInView ? 1 : 0,
//                   x: processStepsAnimation.isInView ? 0 : -20
//                 }}
//                 transition={{ delay: 0.4, duration: 0.5 }}
//               >
//                 <motion.div 
//                   className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium"
//                   whileHover={{ 
//                     scale: 1.1,
//                     backgroundColor: "#E07A5F" // terracotta
//                   }}
//                   transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                 >
//                   2
//                 </motion.div>
//                 <h3 className="text-xl font-medium text-navy">Screening Call</h3>
//               </motion.div>
              
//               <motion.p 
//                 className="text-gray-600 mb-6"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ 
//                   opacity: processStepsAnimation.isInView ? 1 : 0,
//                   y: processStepsAnimation.isInView ? 0 : 10
//                 }}
//                 transition={{ delay: 0.5, duration: 0.5 }}
//               >
//                 Have a brief conversation - A Fraterny counselor will contact you to have a friendly conversation after your form is shortlisted. Only thing that matters the most is authentic responses from your end.
//               </motion.p>
              
//               <motion.div 
//                 className="flex items-center gap-2 text-sm text-gray-600"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ 
//                   opacity: processStepsAnimation.isInView ? 1 : 0,
//                   scale: processStepsAnimation.isInView ? 1 : 0.8
//                 }}
//                 transition={{ delay: 0.6, duration: 0.5 }}
//               >
//                 <Phone size={16} className="text-terracotta" />
//                 <span>15 Minutes</span>
//               </motion.div>
//             </motion.div>

//             {/* Step 3: Join */}
//             <motion.div 
//               className="bg-white p-8 rounded-lg border border-gray-100 group cursor-pointer"
//               variants={stepCardVariants}
//               whileHover="hover"
//             >
//               <motion.div 
//                 className="flex items-center gap-4 mb-6"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ 
//                   opacity: processStepsAnimation.isInView ? 1 : 0,
//                   x: processStepsAnimation.isInView ? 0 : -20
//                 }}
//                 transition={{ delay: 0.6, duration: 0.5 }}
//               >
//                 <motion.div 
//                   className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium"
//                   whileHover={{ 
//                     scale: 1.1,
//                     backgroundColor: "#E07A5F" // terracotta
//                   }}
//                   transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                 >
//                   3
//                 </motion.div>
//                 <h3 className="text-xl font-medium text-navy">Join</h3>
//               </motion.div>
              
//               <motion.p 
//                 className="text-gray-600 mb-6"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ 
//                   opacity: processStepsAnimation.isInView ? 1 : 0,
//                   y: processStepsAnimation.isInView ? 0 : 10
//                 }}
//                 transition={{ delay: 0.7, duration: 0.5 }}
//               >
//                 Welcome to the Ecosystem - We will send you a confirmation email for your acceptance in Fraterny.
//               </motion.p>
              
//               <motion.div 
//                 className="space-y-3"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: processStepsAnimation.isInView ? 1 : 0 }}
//                 transition={{ delay: 0.8, duration: 0.5 }}
//               >
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>Applying with friends?</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Check size={16} className="text-terracotta" />
//                   <span>Group applications welcome</span>
//                 </div>
//               </motion.div>
//             </motion.div>
//           </motion.div>

//           {/* Security Notice */}
//           <motion.div 
//             className="mt-12 text-center text-sm text-gray-500"
//             ref={securityNoticeAnimation.ref}
//             variants={securityNoticeAnimation.parentVariants}
//             initial="hidden"
//             animate={securityNoticeAnimation.controls}
//           >
//             <motion.div
//               variants={securityNoticeAnimation.childVariants}
//             >
//               Your data is 100% secure. Not selected? You will get priority access in future bootcamps.
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default Process;


// --------------------------------------------------------- //

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ClipboardList, Phone, UserCheck, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchWebsiteSettings, formatRegistrationCloseDate } from '@/services/websiteSettingsService';
import ResponsiveImage from '../components/ui/ResponsiveImage';
import { useSectionRevealAnimation } from '../components/home/useSectionRevealAnimation';

const Process = () => {
  const {
    data: settings,
    isLoading
  } = useQuery({
    queryKey: ['websiteSettings'],
    queryFn: fetchWebsiteSettings
  });

  // Format the application close date
  const formattedCloseDate = useMemo(() => {
    if (isLoading || !settings?.registration_close_date) return 'March 2025';
    return formatRegistrationCloseDate(settings.registration_close_date);
  }, [settings?.registration_close_date, isLoading]);

  // Animation configurations for different sections
  
  // Hero section animations
  const heroTitleAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.8,
    staggerChildren: 0.3
  });

  const heroStatsAnimation = useSectionRevealAnimation({
    variant: 'fade-right',
    once: false,
    threshold: { desktop: 0.4, mobile: 0.3 },
    duration: 0.6,
    staggerChildren: 0.2,
    delayChildren: 0.4
  });

  // "Who is this for?" section animations
  const whoForTitleAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.7,
    staggerChildren: 0.2
  });

  const whoForCardsAnimation = useSectionRevealAnimation({
    variant: 'slide-up',
    once: false,
    threshold: { desktop: 0.1, mobile: 0.05 },
    duration: 0.6,
    staggerChildren: 0.15,
    delayChildren: 0.2
  });

  const whoNotForAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.1, mobile: 0.05 },
    duration: 0.6,
    staggerChildren: 0.15,
    delayChildren: 0.1
  });

  // Process steps animations
  const processHeaderAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.7
  });

  const processStepsAnimation = useSectionRevealAnimation({
    variant: 'slide-up',
    once: false,
    threshold: { desktop: 0.2, mobile: 0.15 },
    duration: 0.6,
    staggerChildren: 0.25,
    delayChildren: 0.3
  });

  const securityNoticeAnimation = useSectionRevealAnimation({
    variant: 'fade-up',
    once: false,
    threshold: { desktop: 0.6, mobile: 0.5 },
    duration: 0.5
  });

  // Card hover animation variants
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
      y: -5,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  // Step card variants with enhanced animations
  const stepCardVariants = {
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
      scale: 1.03,
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
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

  // Text animation variants
  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy text-white relative">
        {/* Background Image */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <ResponsiveImage 
            // src={{
            //   mobile: "/images/hero/process-hero-mobile.webp",
            //   desktop: "/images/hero/process-hero-desktop.webp"
            // }} 
            alt="Luxury villa experience setting" 
            className="h-full w-full object-cover" 
            loading="eager" 
            dynamicKey="process-hero" 
          />
        </motion.div>
      
        {/* Gradient Overlay */}
        <motion.div 
          className="absolute inset-0" 
          style={{
            background: `linear-gradient(to right, 
              rgba(10, 26, 47, 0.95) 0%,
              rgba(10, 26, 47, 0.8) 50%,
              rgba(10, 26, 47, 0.6) 100%
            )`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            
            {/* Hero Title with scroll animation */}
            <motion.div
              ref={heroTitleAnimation.ref}
              variants={heroTitleAnimation.parentVariants}
              initial="hidden"
              animate={heroTitleAnimation.controls}
            >
              <motion.h1 
                className="md:text-5xl font-playfair mb-6 text-5xl lg:text-6xl"
                variants={heroTitleAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                It's not <span className='' style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>special</span> if everyone has it
              </motion.h1>
              
              <motion.p 
                className="text-gray-300 mb-8 max-w-2xl font-extralight text-left text-lg"
                variants={heroTitleAnimation.childVariants}
              >
                We make sure you interact with only <span className="" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>ambitious, likeminded </span> and <span className="" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>interesting </span> people.
              </motion.p>
            </motion.div>
            
            {/* Application Status with enhanced animations */}
            <motion.div
              className="flex flex-wrap gap-8 items-center"
              ref={heroStatsAnimation.ref}
              variants={heroStatsAnimation.parentVariants}
              initial="hidden"
              animate={heroStatsAnimation.controls}
            >
              <motion.div 
                className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4 group cursor-pointer"
                variants={heroStatsAnimation.childVariants}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(0, 0, 0, 0.4)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <div className="text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>Available Seats</div>
                <motion.div 
                  className="text-2xl font-mono"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  {isLoading ? (
                    <motion.span 
                      className="opacity-50 text-black"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Loading...
                    </motion.span>
                  ) : (
                    <motion.span 
                      className="text-white" 
                    >
                    {settings?.available_seats || 20}
                    </motion.span>
                  )}
                </motion.div>
              </motion.div>
              
              <motion.div
                variants={heroStatsAnimation.childVariants}
              >
                <div className="text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>Applications Close</div>
                <motion.div 
                  className="text-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  {isLoading ? (
                    <motion.span 
                      className="opacity-50"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Loading...
                    </motion.span>
                  ) : (
                    <motion.span 
                      className="text-white" 
                    >
                    {formattedCloseDate}
                    </motion.span>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

       {/* Steps Section */}
      <section className="pt-8 pb-16 bg-white">
        <div className="container mx-auto px-6">
          
          {/* Process Header */}
          <motion.div
            ref={processHeaderAnimation.ref}
            variants={processHeaderAnimation.parentVariants}
            initial="hidden"
            animate={processHeaderAnimation.controls}

          >
            <motion.h2 
              className="text-3xl text-navy mb-12 text-center md:text-5xl"
              variants={processHeaderAnimation.childVariants}
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              The Process
            </motion.h2>
          </motion.div>
          
          {/* Process Steps Grid */}
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            ref={processStepsAnimation.ref}
            variants={processStepsAnimation.parentVariants}
            initial="hidden"
            animate={processStepsAnimation.controls}
          >
            {/* Step 1: Apply */}
            <motion.div 
              className="bg-white p-8 rounded-lg border border-gray-100 group cursor-pointer"
              variants={stepCardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: processStepsAnimation.isInView ? 1 : 0,
                  x: processStepsAnimation.isInView ? 0 : -20
                }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <motion.div 
                  className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "#E07A5F" // terracotta
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  1
                </motion.div>
                <h3 className="text-xl font-medium text-navy" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Apply</h3>
              </motion.div>
              
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: processStepsAnimation.isInView ? 1 : 0,
                  y: processStepsAnimation.isInView ? 0 : 10
                }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                Fill out the Registration form - The registration form allows us to confirm your identity, and help us assess whether we will be able to add value to your life.
              </motion.p>
              
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: processStepsAnimation.isInView ? 1 : 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-black" />
                  <span>Personal Details</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-black" />
                  <span>LinkedIn Profile</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-black" />
                  <span>Vision Statement</span>
                </div>
              </motion.div>
              
              <motion.p 
                className="mt-4 text-sm text-gray-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: processStepsAnimation.isInView ? 1 : 0,
                  y: processStepsAnimation.isInView ? 0 : 10
                }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                We encourage group applications with 1-2 friends. Only 1 registration is needed for friend groups.
              </motion.p>
            </motion.div>

            {/* Step 2: Screening Call */}
            <motion.div 
              className="bg-white p-8 rounded-lg border border-gray-100 group cursor-pointer"
              variants={stepCardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: processStepsAnimation.isInView ? 1 : 0,
                  x: processStepsAnimation.isInView ? 0 : -20
                }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <motion.div 
                  className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium"
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: "#E07A5F" // terracotta
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  2
                </motion.div>
                <h3 className="text-xl font-medium text-navy" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Screening Call</h3>
              </motion.div>
              
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: processStepsAnimation.isInView ? 1 : 0,
                  y: processStepsAnimation.isInView ? 0 : 10
                }}
                transition={{ delay: 0.5, duration: 0.5 }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                Have a brief conversation - A Fraterny counselor will contact you to have a friendly conversation after your form is shortlisted. Only thing that matters the most is authentic responses from your end.
              </motion.p>
              
              <motion.div 
                className="flex items-center gap-2 text-sm text-gray-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: processStepsAnimation.isInView ? 1 : 0,
                  scale: processStepsAnimation.isInView ? 1 : 0.8
                }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Phone size={16} className="text-black" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>15 Minutes</span>
              </motion.div>
            </motion.div>

            {/* Step 3: Join */}
            <motion.div 
              className="bg-white p-8 rounded-lg border border-gray-100 group cursor-pointer"
              variants={stepCardVariants}
              whileHover="hover"
            >
              <motion.div 
                className="flex items-center gap-4 mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: processStepsAnimation.isInView ? 1 : 0,
                  x: processStepsAnimation.isInView ? 0 : -20
                }}
                transition={{ delay: 0.6, duration: 0.5 }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                <motion.div 
                  className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium"
                  whileHover={{ 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  3
                </motion.div>
                <h3 className="text-xl font-medium text-navy" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Join</h3>
              </motion.div>
              
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: processStepsAnimation.isInView ? 1 : 0,
                  y: processStepsAnimation.isInView ? 0 : 10
                }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}
              >
                Welcome to the Ecosystem - We will send you a confirmation email for your acceptance in Fraterny.
              </motion.p>
              
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: processStepsAnimation.isInView ? 1 : 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-black" />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Applying with friends?</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-black" />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Group applications welcome</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Security Notice */}
          <motion.div 
            className="mt-12 text-center text-sm text-gray-500"
            ref={securityNoticeAnimation.ref}
            variants={securityNoticeAnimation.parentVariants}
            initial="hidden"
            animate={securityNoticeAnimation.controls}
          >
            <motion.div
              variants={securityNoticeAnimation.childVariants}
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 200 }}
            >
              Your data is 100% secure. Not selected? You will get priority access in future bootcamps.
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who is this for? Section */}
      <section className="pt-16 md:pt-20 pb-10 md:pb-16 py-[34px] bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Section Header */}
            <motion.div
              ref={whoForTitleAnimation.ref}
              variants={whoForTitleAnimation.parentVariants}
              initial="hidden"
              animate={whoForTitleAnimation.controls}
            >
              <motion.h2 
                className="text-3xl font-playfair text-navy mb-6 md:mb-8 text-center md:text-5xl"
                variants={whoForTitleAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                Who is this for?
              </motion.h2>
              
              <motion.p 
                className="text-xl text-gray-600 italic mb-8 md:mb-12 text-center max-w-2xl mx-auto"
                variants={whoForTitleAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                This is not for everyone. But if you are the right fit, you will know.
              </motion.p>
            </motion.div>

            {/* "For" Cards Grid */}
            <motion.div 
              className="mb-12 md:mb-16"
              ref={whoForCardsAnimation.ref}
              variants={whoForCardsAnimation.parentVariants}
              initial="hidden"
              animate={whoForCardsAnimation.controls}
            >
              <div className="grid md:grid-cols-2 gap-4 md:gap-8">
                <div className="space-y-4 md:space-y-8">
                  <motion.div 
                    className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <motion.div
                        variants={iconVariants}
                        initial="hidden"
                        animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
                      >
                        <Check className="text-white mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      </motion.div>
                      <motion.p 
                        className="leading-relaxed text-base md:text-lg text-gray-200"
                        variants={textVariants}
                        initial="hidden"
                        animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
                        transition={{ delay: 0.2 }}
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                      >
                        You have big ideas and ambitious goals, but you need the right people around you to refine, validate, and discuss them with.
                      </motion.p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <motion.div
                        variants={iconVariants}
                        initial="hidden"
                        animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
                        transition={{ delay: 0.1 }}
                      >
                        <Check className="text-white mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      </motion.div>
                      <motion.p 
                        className="leading-relaxed text-base md:text-lg text-gray-200"
                        variants={textVariants}
                        initial="hidden"
                        animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
                        transition={{ delay: 0.25 }}
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                      >
                        You believe in execution over excuses. You are not here for inspiration; you are here to contribute and collaborate with your own unique perspective.
                      </motion.p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <motion.div
                        variants={iconVariants}
                        initial="hidden"
                        animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
                        transition={{ delay: 0.2 }}
                      >
                        <Check className="text-white mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      </motion.div>
                      <motion.p 
                        className="leading-relaxed text-base md:text-lg text-gray-200"
                        variants={textVariants}
                        initial="hidden"
                        animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
                        transition={{ delay: 0.3 }}
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                      >
                        You don't follow trends; you create them. Whether you are or aim to be an entrepreneur, investor, or innovator, you want to be in a space where you are encouraged and assisted.
                      </motion.p>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-4 md:space-y-8">
                  <motion.div 
                    className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <motion.div
                        variants={iconVariants}
                        initial="hidden"
                        animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
                        transition={{ delay: 0.3 }}
                      >
                        <Check className="text-white mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      </motion.div>
                      <motion.p 
                        className="leading-relaxed text-base md:text-lg text-gray-200"
                        variants={textVariants}
                        initial="hidden"
                        animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
                        transition={{ delay: 0.35 }}
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                      >
                        You seek deep conversations, meaningful connections, and experiences that shift your perspective and elevate your journey.
                      </motion.p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px] group cursor-pointer"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <motion.div
                        variants={iconVariants}
                        initial="hidden"
                        animate={whoForCardsAnimation.isInView ? "visible" : "hidden"}
                        transition={{ delay: 0.4 }}
                      >
                        <Check className="text-white mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      </motion.div>
                      <motion.p 
                        className="leading-relaxed text-base md:text-lg text-gray-200"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ 
                          opacity: whoForCardsAnimation.isInView ? 1 : 0,
                          x: whoForCardsAnimation.isInView ? 0 : -10
                        }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                      >
                        You understand the power of a strong network. You are here to meet driven individuals who challenge and expand your thinking.
                      </motion.p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* "Not For" Section */}
            <motion.div 
              className="mb-12 md:mb-20"
              ref={whoNotForAnimation.ref}
              variants={whoNotForAnimation.parentVariants}
              initial="hidden"
              animate={whoNotForAnimation.controls}
            >
              <motion.h3 
                className="font-playfair text-navy mb-6 md:mb-8 text-center text-3xl md:text-5xl"
                variants={whoNotForAnimation.childVariants}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                Who this is 'not' for?
              </motion.h3>
              
              <div className="grid md:grid-cols-2 gap-4 md:gap-8 my-[51px] px-0 py-0">
                <motion.div 
                  className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow my-0 py-[35px] bg-slate-900 group cursor-pointer"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <motion.div
                      variants={iconVariants}
                      initial="hidden"
                      animate={whoNotForAnimation.isInView ? "visible" : "hidden"}
                    >
                      <Check className="text-white mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                    </motion.div>
                    <motion.p 
                      className="leading-relaxed text-base md:text-lg font-normal text-gray-200"
                      variants={textVariants}
                      initial="hidden"
                      animate={whoNotForAnimation.isInView ? "visible" : "hidden"}
                      transition={{ delay: 0.2 }}
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                    >
                      Those looking for a solo experience.
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div 
                  className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow py-[35px] bg-slate-900 group cursor-pointer"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <motion.div
                      variants={iconVariants}
                      initial="hidden"
                      animate={whoNotForAnimation.isInView ? "visible" : "hidden"}
                      transition={{ delay: 0.1 }}
                    >
                      <Check className="text-white mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                    </motion.div>
                    <motion.p 
                      className="leading-relaxed text-base md:text-lg text-gray-200"
                      variants={textVariants}
                      initial="hidden"
                      animate={whoNotForAnimation.isInView ? "visible" : "hidden"}
                      transition={{ delay: 0.25 }}
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                    >
                      Anyone with a passive approach.
                    </motion.p>
                  </div>
                </motion.div>

                <motion.div 
                  className="md:col-span-2 shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow py-[35px] bg-slate-900 group cursor-pointer"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <motion.div
                      variants={iconVariants}
                      initial="hidden"
                      animate={whoNotForAnimation.isInView ? "visible" : "hidden"}
                      transition={{ delay: 0.2 }}
                    >
                      <Check className="text-white mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                    </motion.div>
                    <motion.p 
                      className="leading-relaxed text-base md:text-lg px-0 text-gray-200"
                      variants={textVariants}
                      initial="hidden"
                      animate={whoNotForAnimation.isInView ? "visible" : "hidden"}
                      transition={{ delay: 0.3 }}
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
                    >
                      Those who are not open to exploring new ideas, values or perspectives.
                    </motion.p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Process;