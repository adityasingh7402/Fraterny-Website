// import { motion, AnimatePresence } from 'framer-motion';
// import { useState } from 'react';
// import { clusters, steadycore } from '../archeotype/archeotype';
// import { Sparkles } from 'lucide-react';
// import { CometCard } from "@/components/ui/comet-card";

// export default function MainArchetype() {
//   const [selectedClusterIndex, setSelectedClusterIndex] = useState<number>(0);
//   const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<number | null>(null);
//   const [activeContext, setActiveContext] = useState<'self' | 'world' | 'aspire'>('self');

//   const selectedCluster = clusters[selectedClusterIndex];

//   const handleClusterClick = (index: number) => {
//     setSelectedClusterIndex(index);
//     setSelectedArchetypeIndex(null);
//     setActiveContext('self');
//   };

//   // Map cluster index to image number (7-12)
//   const getClusterImage = (index: number) => {
//     return `./${7 + index}.png`;
//   };

//   const contentVariants = {
//     hidden: { opacity: 0, x: 20 },
//     visible: { 
//       opacity: 1, 
//       x: 0,
//       transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
//     },
//     exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
//   };

//   const archetypeVariants = {
//     hidden: { opacity: 0, y: 10 },
//     visible: (i: number) => ({
//       opacity: 1,
//       y: 0,
//       transition: {
//         delay: i * 0.05,
//         duration: 0.4,
//         ease: "easeOut"
//       }
//     })
//   };

//   return (
//     <section className="min-h-screen bg-gradient-to-b from-navy via-[#0a1a2f] to-navy text-white py-16 sm:py-24">
//       <div className="container mx-auto px-6">
        
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="mb-12 sm:mb-16"
//         >
//           <div className="flex items-center gap-3 mb-4">
//             <Sparkles className="w-8 h-8" />
//             <h2 
//               className="text-4xl sm:text-5xl md:text-6xl font-['Gilroy-Bold'] tracking-tighter"
//             >
//               Explore Clusters
//             </h2>
//           </div>
//           <p 
//             className="text-lg sm:text-xl text-gray-300 max-w-3xl font-['Gilroy-Bold'] tracking-tighter"
//           >
//             Select a cluster to discover its archetypes and understand yourself through three lenses: Self, World, and Aspire.
//           </p>
//         </motion.div>

//         {/* Main Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-8 lg:gap-12">
          
//           {/* LEFT SIDEBAR - Clusters */}
//           <div>
//             {/* Mobile: Horizontal Scroll */}
//             <div className="lg:hidden mb-8 -mx-6 px-6 overflow-x-auto">
//               <div className="flex gap-3 pb-4">
//                 {clusters.map((cluster, index) => (
//                   <button
//                     key={cluster.name}
//                     onClick={() => handleClusterClick(index)}
//                     className={`
//                       flex-shrink-0 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap font-['Gilroy-Bold'] tracking-tighter text-3xl
//                       ${selectedClusterIndex === index
//                         ? 'text-white shadow-lg'
//                         : 'bg-white/10 text-gray-300 hover:bg-white/20'
//                       }
//                     `}
//                   >
//                     {cluster.name}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Desktop: Sticky Sidebar with 3D Cards */}
//             <div className="hidden lg:block lg:sticky lg:top-8">
//               <div className="space-y-6">
//                 {clusters.map((cluster, index) => (
//                   <CometCard key={cluster.name}>
//                     <button
//                       onClick={() => handleClusterClick(index)}
//                       className={`
//                         w-full cursor-pointer flex flex-col items-stretch rounded-[16px] border-0 p-2 transition-all
//                         ${selectedClusterIndex === index
//                           ? 'bg-[#2a1f1f] saturate-100'
//                           : 'bg-[#1F2121] saturate-50 hover:saturate-75'
//                         }
//                       `}
//                       aria-label={`View ${cluster.name}`}
//                       style={{
//                         transformStyle: "preserve-3d",
//                         transform: "none",
//                         opacity: 1,
//                       }}
//                     >
//                       {/* Image Section */}
//                       <div className="mx-2 flex-1">
//                         <div className="relative mt-2 aspect-[4/3] w-full">
//                           <img
//                             loading="lazy"
//                             className={`
//                               absolute inset-0 h-full w-full rounded-[12px] bg-[#000000] object-cover
//                               ${selectedClusterIndex === index ? 'contrast-100' : 'contrast-75'}
//                             `}
//                             alt={`${cluster.name} visual`}
//                             src={getClusterImage(index)}
//                             style={{
//                               boxShadow: "rgba(0, 0, 0, 0.3) 0px 5px 15px 0px",
//                               opacity: 1,
//                             }}
//                           />
                          
//                           {/* Active indicator overlay */}
//                           {selectedClusterIndex === index && (
//                             <motion.div
//                               layoutId="activeClusterOverlay"
//                               className="absolute inset-0 rounded-[12px] border-2 border-white"
//                               transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                             />
//                           )}
//                         </div>
//                       </div>

//                       {/* Text Section */}
//                       <div className="mt-2 flex flex-col gap-2 p-3 font-mono text-white">
//                         <div className="flex items-center justify-between">
//                           <div 
//                             className={`text-3xl font-['Gilroy-Bold'] tracking-tighter ${selectedClusterIndex === index ? 'text-white' : 'text-white'}`}
//                           >
//                             {cluster.name}
//                           </div>
//                         </div>
//                       </div>
//                     </button>
//                   </CometCard>
//                 ))}

//                 {/* Steadycore Card */}
//                 <CometCard>
//                   <div
//                     className="w-full flex flex-col items-stretch rounded-[16px] border-0 bg-gradient-to-br from-[#2a2121] to-[#1F2121] p-2"
//                     style={{
//                       transformStyle: "preserve-3d",
//                       transform: "none",
//                       opacity: 1,
//                     }}
//                   >
//                     <div className="p-4">
//                       <div className="flex items-center gap-2 mb-2">
//                         <span className="text-2xl">⚖️</span>
//                         <h3 
//                           className="text-base font-semibold text-white"
//                           style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
//                         >
//                           {steadycore.name}
//                         </h3>
//                       </div>
//                       <p 
//                         className="text-xs text-gray-400 line-clamp-3"
//                         style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
//                       >
//                         {steadycore.blurb}
//                       </p>
//                     </div>
//                   </div>
//                 </CometCard>
//               </div>
//             </div>
//           </div>

//           {/* RIGHT PANEL - Content */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={selectedClusterIndex}
//               variants={contentVariants}
//               initial="hidden"
//               animate="visible"
//               exit="exit"
//               className="space-y-8"
//             >
//               {/* Cluster Details */}
//               <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 font-['Gilroy-Bold'] tracking-tighter text-3xl">
//                 <h3 
//                   className="text-3xl sm:text-4xl font-bold mb-4 text-white"
//                 >
//                   {selectedCluster.name}
//                 </h3>
//                 <p 
//                   className="text-base sm:text-lg text-gray-300 leading-relaxed"
//                   style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300 }}
//                 >
//                   {selectedCluster.blurb}
//                 </p>
//               </div>

//               {/* Archetypes Grid */}
//               <div>
//                 <h4 
//                   className="text-xl sm:text-2xl font-semibold mb-6 text-white font-['Gilroy-Bold'] tracking-tighter"
//                 >
//                   Archetypes
//                 </h4>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   {selectedCluster.archetypes.map((archetype, index) => (
//                     <motion.button
//                       key={archetype.name}
//                       custom={index}
//                       variants={archetypeVariants}
//                       initial="hidden"
//                       animate="visible"
//                       onClick={() => setSelectedArchetypeIndex(selectedArchetypeIndex === index ? null : index)}
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                       className={`
//                         text-left p-5 rounded-xl transition-all
//                         ${selectedArchetypeIndex === index
//                           ? 'border-2 border-white text-white shadow-lg'
//                           : 'bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10'
//                         }
//                       `}
//                     >
//                       <span 
//                         className="font-['Gilroy-Bold'] tracking-tighter text-base sm:text-lg"
//                       >
//                         {archetype.name}
//                       </span>
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>

//               {/* Context Viewer */}
//               <AnimatePresence mode="wait">
//                 {selectedArchetypeIndex !== null && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.4 }}
//                     className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10"
//                   >
//                     <h5 
//                       className="text-2xl font-['Gilroy-Bold'] tracking-tighter mb-6 text-white"
//                     >
//                       {selectedCluster.archetypes[selectedArchetypeIndex].name}
//                     </h5>

//                     {/* Context Tabs */}
//                     <div className="flex gap-2 mb-6 flex-wrap">
//                       {(['self', 'world', 'aspire'] as const).map((context) => (
//                         <button
//                           key={context}
//                           onClick={() => setActiveContext(context)}
//                           className={`
//                             px-6 py-3 rounded-xl text-sm font-medium transition-all font-['Gilroy-Regular'] tracking-tighter"
//                             ${activeContext === context
//                               ? 'bg-white text-navy shadow-lg'
//                               : 'bg-white/10 text-gray-300 hover:bg-white/20'
//                             }
//                           `}
//                         >
//                           {context === 'self' && 'Self'}
//                           {context === 'world' && 'World'}
//                           {context === 'aspire' && 'Aspire'}
//                         </button>
//                       ))}
//                     </div>

//                     {/* Context Content */}
//                     <AnimatePresence mode="wait">
//                       <motion.div
//                         key={activeContext}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         transition={{ duration: 0.3 }}
//                         className="bg-black/20 rounded-xl p-6"
//                       >
//                         <p 
//                           className="text-gray-200 leading-relaxed text-base sm:text-lg font-['Gilroy-Bold'] tracking-tighter"
//                         >
//                           {selectedCluster.archetypes[selectedArchetypeIndex].contexts[activeContext]}
//                         </p>
//                       </motion.div>
//                     </AnimatePresence>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </motion.div>
//           </AnimatePresence>

//         </div>
//       </div>
//     </section>
//   );
// }



import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { clusters, steadycore } from '../archeotype/archeotype';
import { Sparkles, X } from 'lucide-react';
import { CometCard } from "@/components/ui/comet-card";
import ScrollStack, { ScrollStackItem } from '../archeotype/ScrollStack';

export default function MainArchetype() {
  const [selectedClusterForDetails, setSelectedClusterForDetails] = useState<number | null>(null);
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<number | null>(null);
  const [activeContext, setActiveContext] = useState<'self' | 'world' | 'aspire'>('self');
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleCardClick = (index: number) => {
    setSelectedClusterForDetails(index);
    setSelectedArchetypeIndex(null);
    setActiveContext('self');
    
    // Smooth scroll to details
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleCloseDetails = () => {
    setSelectedClusterForDetails(null);
    setSelectedArchetypeIndex(null);
  };

  // Map cluster index to image number (7-12)
  const getClusterImage = (index: number) => {
    return `/${7 + index}.png`;
  };

  const archetypeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-[#0a1a2f] to-navy text-white">
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-10 h-10 text-white" />
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-['Gilroy-Bold'] tracking-tighter text-white">
              Explore Clusters
            </h1>
          </div>
          <p className="text-xl sm:text-2xl text-gray-300 font-['Gilroy-Regular'] tracking-tight">
            Scroll through and click a cluster to explore details below
          </p>
        </motion.div>
      </div>

      {/* Horizontal ScrollStack - Always Visible */}
      <div className="h-[600px]">
        <ScrollStack
          itemDistance={150}
          itemScale={0.05}
          itemStackDistance={40}
          stackPosition="15%"
          scaleEndPosition="10%"
          baseScale={0.9}
        >
          {clusters.map((cluster, clusterIndex) => (
            <ScrollStackItem 
              key={cluster.name}
              itemClassName={`
                bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border !p-0 !w-[450px] !h-[650px] cursor-pointer transition-all
                ${selectedClusterForDetails === clusterIndex 
                  ? 'border-white/50 shadow-2xl' 
                  : 'border-white/10 hover:border-white/30'
                }
              `}
            >
              <div 
                className="h-full flex flex-col"
                onClick={() => handleCardClick(clusterIndex)}
              >
                {/* Top - Image Section */}
                <div className="relative h-[280px] flex-shrink-0 overflow-hidden rounded-t-[40px]">
                  <img
                    src={getClusterImage(clusterIndex)}
                    alt={cluster.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Selected Indicator */}
                  {selectedClusterForDetails === clusterIndex && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 border-4 border-white rounded-t-[40px]"
                    />
                  )}
                  
                  {/* Cluster Number Badge */}
                  <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <span className="text-white font-['Gilroy-Bold'] text-base">
                      {String(clusterIndex + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Cluster Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-3xl font-['Gilroy-Bold'] tracking-tighter text-white mb-2">
                      {cluster.name}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <span className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        {cluster.archetypes.length} Archetypes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom - Preview Content */}
                <div className="flex-1 flex flex-col p-6">
                  <p className="text-gray-300 text-sm font-['Inter'] font-light leading-relaxed line-clamp-4">
                    {cluster.blurb}
                  </p>
                  
                  {/* Click hint */}
                  <div className="mt-auto pt-4 text-center">
                    <span className={`text-sm font-['Gilroy-Regular'] ${selectedClusterForDetails === clusterIndex ? 'text-white' : 'text-gray-400'}`}>
                      {selectedClusterForDetails === clusterIndex ? 'See details below ↓' : 'Click to explore →'}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      {/* Details Section - Expands Below ScrollStack */}
      <AnimatePresence mode="wait">
        {selectedClusterForDetails !== null && (
          <motion.div
            ref={detailsRef}
            initial={{ opacity: 0, y: 50, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 50, height: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="container mx-auto px-6 py-16 overflow-hidden"
          >
            <div className="max-w-6xl mx-auto">
              
              {/* Close Button */}
              <div className="flex justify-end mb-8">
                <button
                  onClick={handleCloseDetails}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 font-['Gilroy-Bold'] text-sm"
                >
                  <X className="w-4 h-4" />
                  Close Details
                </button>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[35%_1fr] gap-8 lg:gap-12">
                
                {/* LEFT - Sidebar with all clusters */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-2xl font-['Gilroy-Bold'] tracking-tighter mb-6 text-white">
                    All Clusters
                  </h3>
                  
                  <div className="space-y-4">
                    {clusters.map((cluster, index) => (
                      <button
                        key={cluster.name}
                        onClick={() => {
                          setSelectedClusterForDetails(index);
                          setSelectedArchetypeIndex(null);
                          setActiveContext('self');
                        }}
                        className={`
                          w-full text-left p-4 rounded-xl transition-all
                          ${selectedClusterForDetails === index
                            ? 'bg-white text-navy shadow-lg'
                            : 'bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10'
                          }
                        `}
                      >
                        <div className="font-['Gilroy-Bold'] tracking-tight text-base">
                          {cluster.name}
                        </div>
                        <div className="text-xs mt-1 opacity-70">
                          {cluster.archetypes.length} archetypes
                        </div>
                      </button>
                    ))}

                    {/* Steadycore */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">⚖️</span>
                        <h4 className="text-sm font-['Gilroy-Bold'] text-white">
                          {steadycore.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-400 font-['Inter'] font-light line-clamp-2">
                        {steadycore.blurb}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT - Detailed Content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="space-y-8"
                >
                  {/* Cluster Details */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
                    <h3 className="text-3xl sm:text-4xl font-['Gilroy-Bold'] tracking-tighter mb-4 text-white">
                      {clusters[selectedClusterForDetails].name}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-['Inter'] font-light">
                      {clusters[selectedClusterForDetails].blurb}
                    </p>
                  </div>

                  {/* Archetypes Grid */}
                  <div>
                    <h4 className="text-xl sm:text-2xl font-['Gilroy-Bold'] tracking-tighter mb-6 text-white">
                      Archetypes ({clusters[selectedClusterForDetails].archetypes.length})
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {clusters[selectedClusterForDetails].archetypes.map((archetype, index) => (
                        <motion.button
                          key={archetype.name}
                          custom={index}
                          variants={archetypeVariants}
                          initial="hidden"
                          animate="visible"
                          onClick={() => setSelectedArchetypeIndex(selectedArchetypeIndex === index ? null : index)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            text-left p-5 rounded-xl transition-all
                            ${selectedArchetypeIndex === index
                              ? 'bg-white text-navy shadow-lg'
                              : 'bg-white/5 text-gray-200 hover:bg-white/10 border border-white/10'
                            }
                          `}
                        >
                          <span className="font-['Gilroy-Bold'] tracking-tight text-base sm:text-lg">
                            {archetype.name}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Context Viewer */}
                  <AnimatePresence mode="wait">
                    {selectedArchetypeIndex !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10"
                      >
                        <h5 className="text-2xl font-['Gilroy-Bold'] tracking-tight mb-6 text-white">
                          {clusters[selectedClusterForDetails].archetypes[selectedArchetypeIndex].name}
                        </h5>

                        {/* Context Tabs */}
                        <div className="flex gap-2 mb-6 flex-wrap">
                          {(['self', 'world', 'aspire'] as const).map((context) => (
                            <button
                              key={context}
                              onClick={() => setActiveContext(context)}
                              className={`
                                px-6 py-3 rounded-xl text-sm font-['Gilroy-Bold'] tracking-tight transition-all
                                ${activeContext === context
                                  ? 'bg-white text-navy shadow-lg'
                                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                }
                              `}
                            >
                              {context === 'self' && '🪞 Self'}
                              {context === 'world' && '🌍 World'}
                              {context === 'aspire' && '✨ Aspire'}
                            </button>
                          ))}
                        </div>

                        {/* Context Content */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={activeContext}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="bg-black/20 rounded-xl p-6"
                          >
                            <p className="text-gray-200 leading-relaxed text-base sm:text-lg font-['Inter'] font-light">
                              {clusters[selectedClusterForDetails].archetypes[selectedArchetypeIndex].contexts[activeContext]}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}