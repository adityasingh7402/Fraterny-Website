// src/components/quest/views/QuestResult.tsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import ReactMarkdown from 'react-markdown';
// import { Eye, Users, Shield, Zap, Sparkles, Download, Share2, Home, AlertTriangle } from 'lucide-react';
// import QuestLayout from '../layout/QuestLayout';
// import { useAuth } from '../../../contexts/AuthContext';
// import { supabase } from '../../../integrations/supabase/client';

// // Premium Mind Card Component
// const PremiumMindCard = ({ data }: { data: any }) => {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   // Icon mapping for attributes
//   const getAttributeIcon = (attribute: string) => {
//     const iconMap: { [key: string]: any } = {
//       'self awareness': Eye,
//       'collaboration': Users,
//       'conflict navigation': Shield,
//       'risk appetite': Zap
//     };
//     return iconMap[attribute.toLowerCase()] || Sparkles;
//   };

//   // Color mapping for scores
//   const getScoreColor = (score: string) => {
//     const numScore = parseInt(score.split('/')[0]);
//     if (numScore >= 80) return 'from-cyan-400 to-blue-500';
//     if (numScore >= 60) return 'from-purple-400 to-pink-500';
//     if (numScore >= 40) return 'from-orange-400 to-red-500';
//     return 'from-red-400 to-rose-500';
//   };

//   // Animation variants
//   const cardVariants = {
//     hidden: { 
//       opacity: 0, 
//       scale: 0.8, 
//       rotateY: -15
//     },
//     visible: { 
//       opacity: 1, 
//       scale: 1, 
//       rotateY: 0,
//       transition: {
//         duration: 1.2,
//         ease: [0.23, 1, 0.32, 1],
//         staggerChildren: 0.2
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: -30, scale: 0.9 },
//     visible: { 
//       opacity: 1, 
//       x: 0, 
//       scale: 1,
//       transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
//     }
//   };

//   const progressVariants = {
//     hidden: { width: 0 },
//     visible: (score: string) => ({
//       width: `${parseInt(score.split('/')[0])}%`,
//       transition: { 
//         duration: 1.5, 
//         ease: [0.23, 1, 0.32, 1],
//         delay: 0.5
//       }
//     })
//   };

//   return (
//     <div className="relative w-full max-w-2xl mx-auto my-12">
//       {/* Floating particles background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(20)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
//             animate={{
//               x: [Math.random() * 100, Math.random() * 100],
//               y: [Math.random() * 100, Math.random() * 100],
//               opacity: [0.3, 0.8, 0.3]
//             }}
//             transition={{
//               duration: Math.random() * 3 + 2,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//           />
//         ))}
//       </div>

//       <motion.div
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={{ 
//           scale: 1.02, 
//           rotateY: 2,
//           transition: { duration: 0.3 }
//         }}
//         className="relative"
//         style={{ perspective: '1000px' }}
//       >
//         {/* Main card container */}
//         <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 shadow-2xl overflow-hidden">
          
//           {/* Animated border glow */}
//           <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 opacity-75">
//             <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95" />
//           </div>

//           {/* Corner decorations */}
//           <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-cyan-400 opacity-60" />
//           <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-cyan-400 opacity-60" />
//           <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-cyan-400 opacity-60" />
//           <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-cyan-400 opacity-60" />

//           {/* Content */}
//           <div className="relative z-10">
//             {/* Header */}
//             <motion.div 
//               variants={itemVariants}
//               className="text-center mb-8"
//             >
//               <div className="flex items-center justify-center mb-2">
//                 <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse" />
//                 <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-wider">
//                   MIND CARD
//                 </h2>
//                 <div className="w-2 h-2 bg-cyan-400 rounded-full ml-2 animate-pulse" />
//               </div>
//               <div className="h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
//             </motion.div>

//             {/* Attributes Grid */}
//             <div className="space-y-6">
//               {data.attribute.map((attr: string, index: number) => {
//                 const IconComponent = getAttributeIcon(attr);
//                 const score = data.score[index];
//                 const scorePercentage = parseInt(score.split('/')[0]);
                
//                 return (
//                   <motion.div
//                     key={index}
//                     variants={itemVariants}
//                     className="group"
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center space-x-3">
//                         <div className="relative">
//                           <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity" />
//                           <div className="relative bg-slate-800/80 p-2 rounded-lg border border-cyan-500/30">
//                             <IconComponent className="w-5 h-5 text-cyan-400" />
//                           </div>
//                         </div>
//                         <span className="text-lg font-semibold text-white uppercase tracking-wider">
//                           {attr}
//                         </span>
//                       </div>
                      
//                       <div className="text-right">
//                         <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
//                           {scorePercentage}
//                         </span>
//                         <span className="text-slate-400 text-sm ml-1">/100</span>
//                       </div>
//                     </div>

//                     {/* Progress Bar */}
//                     <div className="relative">
//                       <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30">
//                         <motion.div
//                           custom={score}
//                           variants={progressVariants}
//                           className={`h-full bg-gradient-to-r ${getScoreColor(score)} relative overflow-hidden`}
//                         >
//                           {/* Shimmer effect using Tailwind */}
//                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
//                         </motion.div>
//                       </div>
                      
//                       {/* Progress segments */}
//                       <div className="absolute inset-0 flex">
//                         {[...Array(10)].map((_, i) => (
//                           <div key={i} className="flex-1 border-r border-slate-900/50 last:border-r-0" />
//                         ))}
//                       </div>
//                     </div>

//                     {/* Insight */}
//                     <motion.p 
//                       className="text-slate-300 text-sm mt-2 pl-11 opacity-80 group-hover:opacity-100 transition-opacity"
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 0.8, y: 0 }}
//                       transition={{ delay: index * 0.1 + 1 }}
//                     >
//                       {data.insight[index]}
//                     </motion.p>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             {/* Bottom accent */}
//             <motion.div 
//               variants={itemVariants}
//               className="mt-8 flex justify-center"
//             >
//               <div className="flex space-x-1">
//                 {[...Array(5)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
//                     animate={{ opacity: [0.3, 1, 0.3] }}
//                     transition={{ 
//                       duration: 2, 
//                       repeat: Infinity, 
//                       delay: i * 0.2 
//                     }}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Holographic overlay */}
//           <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none rounded-3xl" />
//         </div>

//         {/* Outer glow effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl -z-10 opacity-60" />
//       </motion.div>
//     </div>
//   );
// };

// // Premium Findings Card Component (Purple Theme)
// const PremiumFindingsCard = ({ findings }: { findings: string[] }) => {
//   const cardVariants = {
//     hidden: { opacity: 0, scale: 0.9, rotateY: -10 },
//     visible: { 
//       opacity: 1, 
//       scale: 1, 
//       rotateY: 0,
//       transition: { duration: 1, ease: [0.23, 1, 0.32, 1], staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
//   };

//   return (
//     <div className="relative w-full">
//       {/* Floating particles background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
//             animate={{
//               x: [Math.random() * 50, Math.random() * 50],
//               y: [Math.random() * 50, Math.random() * 50],
//               opacity: [0.2, 0.6, 0.2]
//             }}
//             transition={{
//               duration: Math.random() * 4 + 3,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//           />
//         ))}
//       </div>

//       <motion.div
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
//         className="relative"
//       >
//         <div className="relative bg-gradient-to-br from-purple-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-2xl overflow-hidden">
          
//           {/* Animated border glow */}
//           <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-75">
//             <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-900/95" />
//           </div>

//           {/* Corner decorations */}
//           <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-purple-400 opacity-60" />
//           <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-purple-400 opacity-60" />
//           <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-purple-400 opacity-60" />
//           <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-purple-400 opacity-60" />

//           <div className="relative z-10">
//             {/* Header */}
//             <motion.div variants={itemVariants} className="text-center mb-8">
//               <div className="flex items-center justify-center mb-2">
//                 <div className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse" />
//                 <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-wider">
//                   THOUGHT PROVOKING FINDINGS
//                 </h3>
//                 <div className="w-2 h-2 bg-purple-400 rounded-full ml-2 animate-pulse" />
//               </div>
//               <div className="h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
//             </motion.div>

//             {/* Findings List */}
//             <div className="space-y-4">
//               {findings.map((finding, index) => (
//                 <motion.div
//                   key={index}
//                   variants={itemVariants}
//                   className="group relative"
//                 >
//                   <div className="flex items-start space-x-4 p-4 rounded-xl bg-purple-800/20 border border-purple-500/20 hover:bg-purple-800/30 transition-all duration-300">
//                     <div className="flex-shrink-0 mt-1">
//                       <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
//                         <span className="text-white font-bold text-sm">{index + 1}</span>
//                       </div>
//                     </div>
//                     <p className="text-slate-200 text-sm leading-relaxed group-hover:text-white transition-colors">
//                       {finding}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Bottom accent */}
//             <motion.div variants={itemVariants} className="mt-8 flex justify-center">
//               <div className="flex space-x-1">
//                 {[...Array(3)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
//                     animate={{ opacity: [0.3, 1, 0.3] }}
//                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Holographic overlay */}
//           <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none rounded-3xl" />
//         </div>

//         {/* Outer glow effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl -z-10 opacity-60" />
//       </motion.div>
//     </div>
//   );
// };

// // Premium Quotes Card Component (Green Theme)
// const PremiumQuotesCard = ({ quotes }: { quotes: string[] }) => {
//   const cardVariants = {
//     hidden: { opacity: 0, scale: 0.9, rotateY: 10 },
//     visible: { 
//       opacity: 1, 
//       scale: 1, 
//       rotateY: 0,
//       transition: { duration: 1, ease: [0.23, 1, 0.32, 1], staggerChildren: 0.1 }
//     }
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, x: 20 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
//   };

//   return (
//     <div className="relative w-full">
//       {/* Floating particles background */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-1 h-1 bg-emerald-400 rounded-full opacity-20"
//             animate={{
//               x: [Math.random() * 50, Math.random() * 50],
//               y: [Math.random() * 50, Math.random() * 50],
//               opacity: [0.2, 0.6, 0.2]
//             }}
//             transition={{
//               duration: Math.random() * 4 + 3,
//               repeat: Infinity,
//               ease: "easeInOut"
//             }}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//           />
//         ))}
//       </div>

//       <motion.div
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
//         className="relative"
//       >
//         <div className="relative bg-gradient-to-br from-emerald-900/90 via-teal-900/90 to-emerald-900/90 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/30 shadow-2xl overflow-hidden">
          
//           {/* Animated border glow */}
//           <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 opacity-75">
//             <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-br from-emerald-900/95 via-teal-900/95 to-emerald-900/95" />
//           </div>

//           {/* Corner decorations */}
//           <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-emerald-400 opacity-60" />
//           <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-emerald-400 opacity-60" />
//           <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-emerald-400 opacity-60" />
//           <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-emerald-400 opacity-60" />

//           <div className="relative z-10">
//             {/* Header */}
//             <motion.div variants={itemVariants} className="text-center mb-8">
//               <div className="flex items-center justify-center mb-2">
//                 <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
//                 <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 tracking-wider">
//                   PHILOSOPHICAL MIRRORS
//                 </h3>
//                 <div className="w-2 h-2 bg-emerald-400 rounded-full ml-2 animate-pulse" />
//               </div>
//               <div className="h-[1px] w-40 mx-auto bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
//             </motion.div>

//             {/* Quotes List */}
//             <div className="space-y-4">
//               {quotes.map((quote, index) => (
//                 <motion.div
//                   key={index}
//                   variants={itemVariants}
//                   className="group relative"
//                 >
//                   <div className="p-4 rounded-xl bg-emerald-800/20 border border-emerald-500/20 hover:bg-emerald-800/30 transition-all duration-300">
//                     <div className="relative">
//                       <div className="absolute -left-1 -top-1 text-2xl text-emerald-400/40 font-serif">"</div>
//                       <p className="text-slate-200 text-sm leading-relaxed pl-4 group-hover:text-white transition-colors italic">
//                         {quote}
//                       </p>
//                       <div className="absolute -right-1 -bottom-2 text-2xl text-emerald-400/40 font-serif">"</div>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Bottom accent */}
//             <motion.div variants={itemVariants} className="mt-8 flex justify-center">
//               <div className="flex space-x-1">
//                 {[...Array(3)].map((_, i) => (
//                   <motion.div
//                     key={i}
//                     className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
//                     animate={{ opacity: [0.3, 1, 0.3] }}
//                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           </div>

//           {/* Holographic overlay */}
//           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none rounded-3xl" />
//         </div>

//         {/* Outer glow effect */}
//         <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-xl -z-10 opacity-60" />
//       </motion.div>
//     </div>
//   );
// };

// // Enhanced Section 1 Component
// const SectionOne = ({ content }: { content: string }) => (
//   <motion.div 
//     initial={{ opacity: 0, y: 30 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
//     className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 mb-8 border border-slate-200/50"
//   >
//     <div className="flex items-center mb-6">
//       <div className="w-1 h-8 bg-gradient-to-b from-navy to-terracotta rounded-full mr-4" />
//       <h3 className="text-2xl font-bold text-navy">Your Core Essence</h3>
//     </div>
//     <div className="relative">
//       <div className="absolute -left-2 -top-2 text-6xl text-terracotta/20 font-serif">"</div>
//       <p className="text-gray-700 text-xl italic font-light leading-relaxed pl-8">
//         {content}
//       </p>
//       <div className="absolute -right-2 -bottom-6 text-6xl text-terracotta/20 font-serif">"</div>
//     </div>
//   </motion.div>
// );

// // Enhanced Section 3 Component with Premium Cards
// const SectionThree = ({ content }: { content: string }) => {
//   // Simple content parsing without problematic regex
//   const parseContent = (content: string) => {
//     let findings: string[] = [];
//     let quotes: string[] = [];
//     let remainingContent = content;

//     // Extract findings using simple string operations
//     const findingsStart = content.indexOf('**5 Most Thought Provoking Findings about You**');
//     if (findingsStart !== -1) {
//       const afterFindings = content.substring(findingsStart);
//       const nextSection = afterFindings.indexOf('\n**', 10); // Look for next section after the title
//       const findingsSection = nextSection !== -1 ? afterFindings.substring(0, nextSection) : afterFindings;
      
//       // Split by numbered items and clean up
//       const findingMatches = findingsSection.split(/\n\d+\./);
//       findings = findingMatches.slice(1).map(item => item.trim().replace(/\n/g, ' ')).filter(item => item.length > 0);
      
//       // Remove this section from remaining content
//       remainingContent = remainingContent.replace(findingsSection, '');
//     }

//     // Extract quotes using simple string operations
//     const quotesStart = content.indexOf('**5 Philosophical Quotes That Mirror Your Psyche**');
//     if (quotesStart !== -1) {
//       const afterQuotes = content.substring(quotesStart);
//       const nextSection = afterQuotes.indexOf('\n**', 10); // Look for next section after the title
//       const quotesSection = nextSection !== -1 ? afterQuotes.substring(0, nextSection) : afterQuotes;
      
//       // Split by bullet points and clean up
//       const quoteMatches = quotesSection.split(/\n-\s*[""]/);
//       quotes = quoteMatches.slice(1).map(item => {
//         return item.trim()
//           .replace(/[""]/g, '') // Remove quotes
//           .replace(/\n/g, ' ') // Remove line breaks
//           .replace(/–.*$/, '') // Remove everything after the dash (explanation)
//           .trim();
//       }).filter(item => item.length > 0);
      
//       // Remove this section from remaining content
//       remainingContent = remainingContent.replace(quotesSection, '');
//     }

//     return { findings, quotes, remainingContent: remainingContent.trim() };
//   };

//   const { findings, quotes, remainingContent } = parseContent(content);

//   return (
//     <div className="space-y-8">
//       {/* Premium Cards Grid */}
//       {(findings.length > 0 || quotes.length > 0) && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Findings Card */}
//           {findings.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8, delay: 0.2 }}
//             >
//               <PremiumFindingsCard findings={findings} />
//             </motion.div>
//           )}

//           {/* Quotes Card */}
//           {quotes.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.8, delay: 0.4 }}
//             >
//               <PremiumQuotesCard quotes={quotes} />
//             </motion.div>
//           )}
//         </div>
//       )}

//       {/* Remaining content */}
//       {remainingContent && (
//         <motion.div 
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.6 }}
//           className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 border border-slate-200/50"
//         >
//           <div className="flex items-center mb-6">
//             <div className="w-1 h-8 bg-gradient-to-b from-navy to-terracotta rounded-full mr-4" />
//             <h3 className="text-2xl font-bold text-navy">Additional Insights</h3>
//           </div>
//           <div className="prose prose-lg max-w-none prose-headings:text-navy prose-strong:text-terracotta prose-p:text-gray-700 prose-li:text-gray-700">
//             <ReactMarkdown>
//               {remainingContent}
//             </ReactMarkdown>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export interface QuestResultProps {
//   className?: string;
// }

// export function QuestResult({ className = '' }: QuestResultProps) {
//   const { sessionId } = useParams<{ sessionId: string }>();
//   const navigate = useNavigate();
//   const auth = useAuth();
  
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [resultData, setResultData] = useState<any>(null);
  
//   // Get session ID from URL params or localStorage
//   const currentSessionId = sessionId || localStorage.getItem('questSessionId');
  
//   useEffect(() => {
//     // If no session ID is available, redirect to homepage or error page
//     if (!currentSessionId) {
//       setError('No session ID found. Please complete an assessment first.');
//       return;
//     }
    
//     // Fetch result data from the backend
//     const fetchResultData = async () => {
//       try {
//         setIsLoading(true);
        
//         // For now, use mock data
//         setTimeout(() => {
//           // Mock result data structure
//           const mockResultData = {
//             session_id: currentSessionId,
//             user_id: auth?.user?.id,
//             completion_date: new Date().toISOString(),
//             results: {
//               "section 1": "You carry ambition quietly, working tirelessly but yearning for the playful freedom you missed as a child.",
//               "Mind Card": {
//                 "personlity": "#Game-Styled Mindcard",
//                 "attribute": ["self awareness","collaboration","conflict navigation","risk appetite"],
//                 "score": ["65/100","75/100","90/100","85/100"],
//                 "insight": [
//                   "Your self-awareness is growing; you know strengths but underplay emotional needs.",
//                   "You collaborate respectfully, valuing others' input while driving your own projects.",
//                   "You resolve conflicts playfully and quickly, maintaining strong familial bonds.",
//                   "You embrace ambitious risks, juggling research, business, and sporting dreams fearlessly."
//                 ]
//               },
//               "section 3": "**5 Most Thought Provoking Findings about You** 😲\n\n1. Your childhood's disciplined push shaped an unquenchable ambition that fuels both research and entrepreneurship.\n2. You harbor a silent altruism: you dream of wealth not for yourself but to uplift underprivileged students.\n3. Your emotional reserve around anger reveals a gentle core, cautious of hurting others even when constrained.\n4. Balancing PhD rigor and cricket aspirations, you forge a unique identity bridging science and sport.\n5. Your rapid learning skill acts as a secret superpower, accelerating your growth in any domain.\n\n**5 Philosophical Quotes That Mirror Your Psyche** 🤔\n\n- \"Ambition is the path, but satisfaction is the journey.\" – reminds you balance drive and joy.\n- \"The mind, once stretched by new ideas, never returns to its original dimensions.\" – reflects your love of learning.\n- \"True generosity is giving without remembering; self-care without hesitation.\" – mirrors your altruistic vision.\n- \"Strength lies in gentleness; power in self-awareness.\" – echoes your quiet but determined nature.\n- \"To dare is to lose one's footing momentarily; not to dare is to lose oneself.\" – captures your bold risk-taking."
//             }
//           };
          
//           // Check if the result belongs to the current user
//           if (auth?.user?.id && mockResultData.user_id !== auth?.user?.id) {
//             setError('You are not authorized to view these results.');
//             setIsLoading(false);
//             return;
//           }
          
//           setResultData(mockResultData);
//           setIsLoading(false);
//         }, 1500);
        
//         // COMMENTED OUT: Real implementation for fetching data from backend
//         /*
//         // 1. First verify this session belongs to the current user
//         const { data: sessionHistory, error: sessionError } = await supabase
//           .from('user_session_history')
//           .select('*')
//           .eq('session_id', currentSessionId)
//           .eq('user_id', auth?.user?.id)
//           .single();
        
//         if (sessionError || !sessionHistory) {
//           throw new Error('Session not found or not authorized');
//         }
        
//         // 2. Fetch the analysis result from your AI backend
//         // This could be a separate API endpoint that generates or retrieves the analysis
//         const response = await fetch(`${process.env.REACT_APP_API_URL}/quest-analysis/${currentSessionId}`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${auth.session?.access_token || ''}`
//           },
//         });
        
//         if (!response.ok) {
//           throw new Error(`Error fetching results: ${response.status}`);
//         }
        
//         const analysisData = await response.json();
        
//         // 3. Format the data to match your frontend structure
//         const formattedData = {
//           session_id: currentSessionId,
//           user_id: auth?.user?.id,
//           completion_date: sessionHistory.created_at,
//           results: {
//             "section 1": analysisData.core_essence || "Analysis still processing...",
//             "Mind Card": analysisData.mind_card || {
//               "personlity": "#Game-Styled Mindcard",
//               "attribute": ["self awareness","collaboration","conflict navigation","risk appetite"],
//               "score": ["50/100","50/100","50/100","50/100"],
//               "insight": [
//                 "Still analyzing...",
//                 "Still analyzing...",
//                 "Still analyzing...",
//                 "Still analyzing..."
//               ]
//             },
//             "section 3": analysisData.deep_insights || "Analysis still processing..."
//           }
//         };
        
//         setResultData(formattedData);
//         setIsLoading(false);
        
//         // 4. Update the session history to mark as viewed
//         await supabase
//           .from('user_session_history')
//           .update({ is_viewed: true })
//           .eq('session_id', currentSessionId)
//           .eq('user_id', auth?.user?.id);
//         */
        
//       } catch (err) {
//         console.error('Error fetching result data:', err);
//         setError('Failed to fetch your assessment results. Please try again later.');
//         setIsLoading(false);
//       }
//     };
    
//     fetchResultData();
//   }, [currentSessionId, auth?.user?.id]);
  
//   // Handle downloading results as PDF (placeholder)
//   const handleDownloadResults = () => {
//     alert('Download functionality will be implemented based on requirements.');
//   };
  
//   // Handle sharing results (placeholder)
//   const handleShareResults = () => {
//     alert('Share functionality will be implemented based on requirements.');
//   };
  
//   // Handle retry if loading failed
//   const handleRetry = () => {
//     setIsLoading(true);
//     setError(null);
//     window.location.reload();
//   };
  
//   // Return to dashboard/homepage
//   const handleReturnHome = () => {
//     navigate('/');
//   };
  
//   // Loading state
//   if (isLoading) {
//     return (
//       <QuestLayout showHeader={true} showNavigation={false} className={className}>
//         <div className="flex flex-col items-center justify-center py-12 min-h-[60vh]">
//           <motion.div
//             animate={{
//               rotate: 360,
//               scale: [1, 1.1, 1],
//             }}
//             transition={{
//               rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
//               scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
//             }}
//             className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full mb-6"
//           />
//           <p className="text-gray-600 text-lg">Loading your assessment results...</p>
//           <p className="text-gray-400 text-sm mt-2">Analyzing your psychological profile...</p>
//         </div>
//       </QuestLayout>
//     );
//   }
  
//   // Error state
//   if (error) {
//     return (
//       <QuestLayout showHeader={true} showNavigation={false} className={className}>
//         <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[60vh]">
//           <motion.div
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 inline-flex items-center"
//           >
//             <AlertTriangle className="h-6 w-6 mr-2" />
//             Error
//           </motion.div>
//           <h2 className="text-xl font-semibold text-navy mb-4">Unable to Load Results</h2>
//           <p className="text-gray-600 mb-6 max-w-md">{error}</p>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <button
//               onClick={handleRetry}
//               className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
//             >
//               Try Again
//             </button>
//             <button
//               onClick={handleReturnHome}
//               className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               Return Home
//             </button>
//           </div>
//         </div>
//       </QuestLayout>
//     );
//   }
  
//   // Success state - display results
//   return (
//     <QuestLayout showHeader={true} showNavigation={false} className={className}>
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
//         <div className="max-w-4xl mx-auto py-8 px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//           >
//             {/* Header section */}
//             <div className="mb-12 text-center">
//               <motion.h1 
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.1 }}
//                 className="text-4xl font-playfair text-navy mb-4"
//               >
//                 Your Assessment Results
//               </motion.h1>
//               <motion.p 
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="text-gray-600 text-lg"
//               >
//                 Completed on {new Date(resultData.completion_date).toLocaleDateString('en-US', {
//                   weekday: 'long',
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 })}
//               </motion.p>
              
//               {/* Action buttons */}
//               <motion.div 
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.3 }}
//                 className="flex flex-wrap gap-3 mt-8 justify-center"
//               >
//                 <button
//                   onClick={handleDownloadResults}
//                   className="px-6 py-3 bg-navy text-white rounded-xl hover:bg-navy/90 transition-all duration-300 text-sm flex items-center shadow-lg hover:shadow-xl hover:scale-105"
//                 >
//                   <Download className="h-4 w-4 mr-2" />
//                   Download PDF
//                 </button>
//                 <button
//                   onClick={handleShareResults}
//                   className="px-6 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-all duration-300 text-sm flex items-center shadow-lg hover:shadow-xl hover:scale-105"
//                 >
//                   <Share2 className="h-4 w-4 mr-2" />
//                   Share Results
//                 </button>
//               </motion.div>
//             </div>
            
//             {/* Result components */}
//             <div className="space-y-8">
//               {/* Section 1 */}
//               {resultData.results["section 1"] && (
//                 <SectionOne content={resultData.results["section 1"]} />
//               )}
              
//               {/* Premium Mind Card */}
//               {resultData.results["Mind Card"] && (
//                 <PremiumMindCard data={resultData.results["Mind Card"]} />
//               )}
              
//               {/* Section 3 - Premium Cards and Markdown Content */}
//               {resultData.results["section 3"] && (
//                 <SectionThree content={resultData.results["section 3"]} />
//               )}
//             </div>
            
//             {/* Return home button */}
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.8 }}
//               className="mt-16 text-center"
//             >
//               <button
//                 onClick={handleReturnHome}
//                 className="px-8 py-4 bg-gradient-to-r from-navy to-terracotta text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center mx-auto hover:scale-105"
//               >
//                 <Home className="h-5 w-5 mr-2" />
//                 Return to Homepage
//               </button>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </QuestLayout>
//   );
// }

// export default QuestResult;



/**
 * QuestResult.tsx
 * Component for displaying psychology assessment results
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Download, Share2, Home, AlertTriangle } from 'lucide-react';

// Import card components
import { MindCard, FindingsCard, QuotesCard, parseContent } from './questresultcards';

// Import animation utilities
import { headerVariants, sectionVariants, buttonVariants } from './questresultcards/utils/animations';

// Import layout components
import QuestLayout from '../layout/QuestLayout';

// Import context
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../integrations/supabase/client';

export interface QuestResultProps {
  className?: string;
}

export function QuestResult({ className = '' }: QuestResultProps) {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);
  
  // Get session ID from URL params or localStorage
  const currentSessionId = sessionId || localStorage.getItem('questSessionId');
  
  useEffect(() => {
    // If no session ID is available, redirect to homepage or error page
    if (!currentSessionId) {
      setError('No session ID found. Please complete an assessment first.');
      return;
    }
    
    // Fetch result data from the backend
    const fetchResultData = async () => {
      try {
        setIsLoading(true);
        
        // For now, use mock data
        setTimeout(() => {
          // Mock result data structure
          const mockResultData = {
            session_id: currentSessionId,
            user_id: auth?.user?.id,
            completion_date: new Date().toISOString(),
            results: {
              "section 1": "You carry ambition quietly, working tirelessly but yearning for the playful freedom you missed as a child.",
              "Mind Card": {
                "personlity": "#Game-Styled Mindcard",
                "attribute": ["self awareness","collaboration","conflict navigation","risk appetite"],
                "score": ["65/100","75/100","90/100","85/100"],
                "insight": [
                  "Your self-awareness is growing; you know strengths but underplay emotional needs.",
                  "You collaborate respectfully, valuing others' input while driving your own projects.",
                  "You resolve conflicts playfully and quickly, maintaining strong familial bonds.",
                  "You embrace ambitious risks, juggling research, business, and sporting dreams fearlessly."
                ]
              },
              "section 3": "**5 Most Thought Provoking Findings about You** 😲\n\n1. Your childhood's disciplined push shaped an unquenchable ambition that fuels both research and entrepreneurship.\n2. You harbor a silent altruism: you dream of wealth not for yourself but to uplift underprivileged students.\n3. Your emotional reserve around anger reveals a gentle core, cautious of hurting others even when constrained.\n4. Balancing PhD rigor and cricket aspirations, you forge a unique identity bridging science and sport.\n5. Your rapid learning skill acts as a secret superpower, accelerating your growth in any domain.\n\n**5 Philosophical Quotes That Mirror Your Psyche** 🤔\n\n- \"Ambition is the path, but satisfaction is the journey.\" – reminds you balance drive and joy.\n- \"The mind, once stretched by new ideas, never returns to its original dimensions.\" – reflects your love of learning.\n- \"True generosity is giving without remembering; self-care without hesitation.\" – mirrors your altruistic vision.\n- \"Strength lies in gentleness; power in self-awareness.\" – echoes your quiet but determined nature.\n- \"To dare is to lose one's footing momentarily; not to dare is to lose oneself.\" – captures your bold risk-taking."
            }
          };
          
          // Check if the result belongs to the current user
          if (auth?.user?.id && mockResultData.user_id !== auth?.user?.id) {
            setError('You are not authorized to view these results.');
            setIsLoading(false);
            return;
          }
          
          setResultData(mockResultData);
          setIsLoading(false);
        }, 1500);
        
        // COMMENTED OUT: Real implementation for fetching data from backend
        /*
        // 1. First verify this session belongs to the current user
        const { data: sessionHistory, error: sessionError } = await supabase
          .from('user_session_history')
          .select('*')
          .eq('session_id', currentSessionId)
          .eq('user_id', auth?.user?.id)
          .single();
        
        if (sessionError || !sessionHistory) {
          throw new Error('Session not found or not authorized');
        }
        
        // 2. Fetch the analysis result from your AI backend
        const response = await fetch(`${process.env.REACT_APP_API_URL}/quest-analysis/${currentSessionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.session?.access_token || ''}`
          },
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching results: ${response.status}`);
        }
        
        const analysisData = await response.json();
        
        // 3. Format the data to match your frontend structure
        const formattedData = {
          session_id: currentSessionId,
          user_id: auth?.user?.id,
          completion_date: sessionHistory.created_at,
          results: {
            "section 1": analysisData.core_essence || "Analysis still processing...",
            "Mind Card": analysisData.mind_card || {
              "personlity": "#Game-Styled Mindcard",
              "attribute": ["self awareness","collaboration","conflict navigation","risk appetite"],
              "score": ["50/100","50/100","50/100","50/100"],
              "insight": [
                "Still analyzing...",
                "Still analyzing...",
                "Still analyzing...",
                "Still analyzing..."
              ]
            },
            "section 3": analysisData.deep_insights || "Analysis still processing..."
          }
        };
        
        setResultData(formattedData);
        setIsLoading(false);
        
        // 4. Update the session history to mark as viewed
        await supabase
          .from('user_session_history')
          .update({ is_viewed: true })
          .eq('session_id', currentSessionId)
          .eq('user_id', auth?.user?.id);
        */
        
      } catch (err) {
        console.error('Error fetching result data:', err);
        setError('Failed to fetch your assessment results. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchResultData();
  }, [currentSessionId, auth?.user?.id]);
  
  // Handle downloading results as PDF (placeholder)
  const handleDownloadResults = () => {
    alert('Download functionality will be implemented based on requirements.');
  };
  
  // Handle sharing results (placeholder)
  const handleShareResults = () => {
    alert('Share functionality will be implemented based on requirements.');
  };
  
  // Handle retry if loading failed
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    window.location.reload();
  };
  
  // Return to dashboard/homepage
  const handleReturnHome = () => {
    navigate('/');
  };
  
  // Loading state
  if (isLoading) {
    return (
      <QuestLayout showHeader={true} showNavigation={false} className={className}>
        <div className="flex flex-col items-center justify-center py-12 min-h-[60vh]">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-16 h-16 border-4 border-navy border-t-transparent rounded-full mb-6"
          />
          <p className="text-gray-600 text-lg">Loading your assessment results...</p>
          <p className="text-gray-400 text-sm mt-2">Analyzing your psychological profile...</p>
        </div>
      </QuestLayout>
    );
  }
  
  // Error state
  if (error) {
    return (
      <QuestLayout showHeader={true} showNavigation={false} className={className}>
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center min-h-[60vh]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 inline-flex items-center"
          >
            <AlertTriangle className="h-6 w-6 mr-2" />
            Error
          </motion.div>
          <h2 className="text-xl font-semibold text-navy mb-4">Unable to Load Results</h2>
          <p className="text-gray-600 mb-6 max-w-md">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleReturnHome}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </QuestLayout>
    );
  }
  
  // Parse content to extract findings and quotes
  const { findings, quotes, remainingContent } = parseContent(resultData.results["section 3"]);
  
  // Success state - display results
  return (
    // <QuestLayout showHeader={true} showNavigation={false} className={className}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Hero Section */}
        <section className="pb-12 pt-24 bg-navy text-white">
          <div className="container mx-auto px-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {/* Header section */}
              <div className="mb-12">
                <motion.h1 
                  variants={headerVariants}
                  className="text-4xl font-playfair text-white mb-4"
                >
                  Your Assessment Results
                </motion.h1>
                <motion.p 
                  variants={headerVariants}
                  className="text-gray-300 text-lg"
                >
                  Completed on {new Date(resultData.completion_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </motion.p>
                
                {/* Action buttons */}
                <motion.div 
                  variants={buttonVariants}
                  className="flex flex-wrap gap-3 mt-8 justify-start"
                >
                  <button
                    onClick={handleDownloadResults}
                    className="px-6 py-3 bg-white text-navy rounded-xl hover:bg-gray-100 transition-all duration-300 text-sm flex items-center shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </button>
                  <button
                    onClick={handleShareResults}
                    className="px-6 py-3 bg-terracotta text-white rounded-xl hover:bg-terracotta/90 transition-all duration-300 text-sm flex items-center shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
            
        {/* Content Section */}
        <div className="container mx-auto px-6 py-12">
          {/* Section 1 - Core Essence */}
          {resultData.results["section 1"] && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 mb-12 border border-slate-200/50"
            >
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-navy to-terracotta rounded-full mr-4" />
                <h3 className="text-2xl font-bold text-navy">Your Core Essence</h3>
              </div>
              <div className="relative">
                <div className="absolute -left-2 -top-2 text-6xl text-terracotta/20 font-serif">"</div>
                <p className="text-gray-700 text-xl italic font-light leading-relaxed pl-8">
                  {resultData.results["section 1"]}
                </p>
                <div className="absolute -right-2 -bottom-6 text-6xl text-terracotta/20 font-serif">"</div>
              </div>
            </motion.div>
          )}
          
          {/* MindCard - Center column */}
          <div className="mb-12">
            {resultData.results["Mind Card"] && (
              <MindCard data={resultData.results["Mind Card"]} />
            )}
          </div>
          
          {/* Findings and Quotes - Two column layout on desktop, stack on mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* QuotesCard - Left column */}
            {quotes.length > 0 && (
              <div className="w-full">
                <QuotesCard quotes={quotes} />
              </div>
            )}
            
            {/* FindingsCard - Right column */}
            {findings.length > 0 && (
              <div className="w-full">
                <FindingsCard findings={findings} />
              </div>
            )}
          </div>
          
          {/* Additional Insights Section (if any remaining content) */}
          {remainingContent && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={sectionVariants}
              className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl p-8 border border-slate-200/50 mb-12"
            >
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-navy to-terracotta rounded-full mr-4" />
                <h3 className="text-2xl font-bold text-navy">Additional Insights</h3>
              </div>
              <div className="prose prose-lg max-w-none prose-headings:text-navy prose-strong:text-terracotta prose-p:text-gray-700 prose-li:text-gray-700">
                <ReactMarkdown>
                  {remainingContent}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
          
          {/* Return home button */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={buttonVariants}
            className="mt-16 text-center"
          >
            <button
              onClick={handleReturnHome}
              className="px-8 py-4 bg-gradient-to-r from-navy to-terracotta text-white rounded-xl hover:shadow-xl transition-all duration-300 flex items-center mx-auto hover:scale-105"
            >
              <Home className="h-5 w-5 mr-2" />
              Return to Homepage
            </button>
          </motion.div>
        </div>
      </div>
    // </QuestLayout>
  );
}

export default QuestResult;