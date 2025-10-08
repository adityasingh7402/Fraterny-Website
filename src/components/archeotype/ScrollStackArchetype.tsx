// import { motion, AnimatePresence } from 'framer-motion';
// import { useState } from 'react';
// import ScrollStack, { ScrollStackItem } from './ScrollStack';
// import { clusters } from './archeotype';

// export default function ScrollStackArchetype() {
//   const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<{ [key: number]: number | null }>({});
//   const [activeContext, setActiveContext] = useState<{ [key: string]: 'self' | 'world' | 'aspire' }>({});

//   const getClusterImage = (index: number) => {
//     return `/${7 + index}.png`;
//   };

//   const handleArchetypeClick = (clusterIndex: number, archeIndex: number) => {
//     setSelectedArchetypeIndex(prev => ({
//       ...prev,
//       [clusterIndex]: prev[clusterIndex] === archeIndex ? null : archeIndex
//     }));
//     setActiveContext(prev => ({
//       ...prev,
//       [`${clusterIndex}-${archeIndex}`]: 'self'
//     }));
//   };

//   const handleContextClick = (clusterIndex: number, archeIndex: number, context: 'self' | 'world' | 'aspire') => {
//     setActiveContext(prev => ({
//       ...prev,
//       [`${clusterIndex}-${archeIndex}`]: context
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-navy via-[#0a1a2f] to-navy">
//       {/* Hero Section */}
//       <div className="container mx-auto px-6 pt-24 pb-12">
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-center max-w-4xl mx-auto"
//         >
//           <h1 className="text-5xl sm:text-6xl md:text-7xl font-['Gilroy-Bold'] tracking-tighter text-white mb-6">
//             Discover Your Cluster
//           </h1>
//           <p className="text-xl sm:text-2xl text-gray-300 font-['Gilroy-Regular'] tracking-tight">
//             Scroll through each cluster and explore the archetypes within
//           </p>
//         </motion.div>
//       </div>

//       {/* ScrollStack Section */}
//       <ScrollStack
//         itemDistance={150}
//         itemScale={0.05}
//         itemStackDistance={40}
//         stackPosition="15%"
//         scaleEndPosition="10%"
//         baseScale={0.9}
//       >
//         {clusters.map((cluster, clusterIndex) => (
//           <ScrollStackItem 
//             key={cluster.name}
//             itemClassName="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10"
//           >
//             <div className="h-full flex flex-col lg:flex-row gap-6">
//               {/* Left Side - Image */}
//               <div className="lg:w-2/5 flex-shrink-0">
//                 <div className="relative h-full min-h-[250px] rounded-2xl overflow-hidden">
//                   <img
//                     src={getClusterImage(clusterIndex)}
//                     alt={cluster.name}
//                     className="absolute inset-0 w-full h-full object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
//                   {/* Cluster Number Badge */}
//                   <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
//                     <span className="text-white font-['Gilroy-Bold'] text-sm">
//                       {String(clusterIndex + 1).padStart(2, '0')}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Side - Content */}
//               <div className="flex-1 flex flex-col justify-between overflow-y-auto max-h-[calc(100%-2rem)]">
//                 {/* Cluster Info */}
//                 <div className="mb-6">
//                   <h2 className="text-3xl sm:text-4xl font-['Gilroy-Bold'] tracking-tighter text-white mb-3">
//                     {cluster.name}
//                   </h2>
//                   <p className="text-gray-300 text-sm sm:text-base font-['Inter'] font-light leading-relaxed">
//                     {cluster.blurb}
//                   </p>
//                 </div>

//                 {/* Archetypes */}
//                 <div className="flex-1">
//                   <h3 className="text-lg font-['Gilroy-Bold'] tracking-tighter text-white mb-4">
//                     Archetypes ({cluster.archetypes.length})
//                   </h3>
                  
//                   <div className="grid grid-cols-2 gap-2 mb-4">
//                     {cluster.archetypes.map((archetype, archeIndex) => (
//                       <button
//                         key={archetype.name}
//                         onClick={() => handleArchetypeClick(clusterIndex, archeIndex)}
//                         className={`
//                           px-3 py-2 rounded-lg text-xs sm:text-sm font-['Gilroy-Bold'] tracking-tight transition-all
//                           ${selectedArchetypeIndex[clusterIndex] === archeIndex
//                             ? 'bg-white text-navy'
//                             : 'bg-white/10 text-gray-300 hover:bg-white/20'
//                           }
//                         `}
//                       >
//                         {archetype.name}
//                       </button>
//                     ))}
//                   </div>

//                   {/* Context Display */}
//                   <AnimatePresence mode="wait">
//                     {selectedArchetypeIndex[clusterIndex] !== null && selectedArchetypeIndex[clusterIndex] !== undefined && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: 'auto' }}
//                         exit={{ opacity: 0, height: 0 }}
//                         transition={{ duration: 0.3 }}
//                         className="bg-white/5 rounded-lg p-4 overflow-hidden"
//                       >
//                         <h4 className="text-base font-['Gilroy-Bold'] tracking-tight text-white mb-3">
//                           {cluster.archetypes[selectedArchetypeIndex[clusterIndex]!].name}
//                         </h4>

//                         {/* Context Tabs */}
//                         <div className="flex gap-2 mb-3">
//                           {(['self', 'world', 'aspire'] as const).map((context) => (
//                             <button
//                               key={context}
//                               onClick={() => handleContextClick(clusterIndex, selectedArchetypeIndex[clusterIndex]!, context)}
//                               className={`
//                                 px-3 py-1.5 rounded-md text-xs font-['Gilroy-Regular'] tracking-tight transition-all
//                                 ${(activeContext[`${clusterIndex}-${selectedArchetypeIndex[clusterIndex]}`] || 'self') === context
//                                   ? 'bg-white text-navy'
//                                   : 'bg-white/10 text-gray-400 hover:bg-white/20'
//                                 }
//                               `}
//                             >
//                               {context.charAt(0).toUpperCase() + context.slice(1)}
//                             </button>
//                           ))}
//                         </div>

//                         {/* Context Content */}
//                         <AnimatePresence mode="wait">
//                           <motion.p
//                             key={activeContext[`${clusterIndex}-${selectedArchetypeIndex[clusterIndex]}`] || 'self'}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -10 }}
//                             transition={{ duration: 0.2 }}
//                             className="text-gray-300 text-xs sm:text-sm font-['Inter'] font-light leading-relaxed"
//                           >
//                             {cluster.archetypes[selectedArchetypeIndex[clusterIndex]!].contexts[
//                               activeContext[`${clusterIndex}-${selectedArchetypeIndex[clusterIndex]}`] || 'self'
//                             ]}
//                           </motion.p>
//                         </AnimatePresence>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </div>
//           </ScrollStackItem>
//         ))}
//       </ScrollStack>
//     </div>
//   );
// }



import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { clusters } from './archeotype';

export default function ScrollStackArchetype() {
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<{ [key: number]: number | null }>({});
  const [activeContext, setActiveContext] = useState<{ [key: string]: 'self' | 'world' | 'aspire' }>({});

  const getClusterImage = (index: number) => {
    return `/${7 + index}.png`;
  };

  const handleArchetypeClick = (clusterIndex: number, archeIndex: number) => {
    setSelectedArchetypeIndex(prev => ({
      ...prev,
      [clusterIndex]: prev[clusterIndex] === archeIndex ? null : archeIndex
    }));
    setActiveContext(prev => ({
      ...prev,
      [`${clusterIndex}-${archeIndex}`]: 'self'
    }));
  };

  const handleContextClick = (clusterIndex: number, archeIndex: number, context: 'self' | 'world' | 'aspire') => {
    setActiveContext(prev => ({
      ...prev,
      [`${clusterIndex}-${archeIndex}`]: context
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-[#0a1a2f] to-navy">
      {/* Hero Section */}
      <div className="container mx-auto px-6 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-['Gilroy-Bold'] tracking-tighter text-white mb-6">
            Discover Your Cluster
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 font-['Gilroy-Regular'] tracking-tight">
            Scroll through each cluster and explore the archetypes within
          </p>
        </motion.div>
      </div>

      {/* ScrollStack Section */}
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
            itemClassName="bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 !p-0 !w-[450px] !h-[650px]"
          >
            <div className="h-full flex flex-col">
              {/* Top - Image Section */}
              <div className="relative h-[280px] flex-shrink-0 overflow-hidden rounded-t-[40px]">
                <img
                  src={getClusterImage(clusterIndex)}
                  alt={cluster.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
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

              {/* Bottom - Content Section */}
              <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                {/* Cluster Description */}
                <p className="text-gray-300 text-sm font-['Inter'] font-light leading-relaxed mb-6 line-clamp-3">
                  {cluster.blurb}
                </p>

                {/* Archetypes Grid */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {cluster.archetypes.map((archetype, archeIndex) => (
                      <button
                        key={archetype.name}
                        onClick={() => handleArchetypeClick(clusterIndex, archeIndex)}
                        className={`
                          px-3 py-2.5 rounded-lg text-xs font-['Gilroy-Bold'] tracking-tight transition-all text-left
                          ${selectedArchetypeIndex[clusterIndex] === archeIndex
                            ? 'bg-white text-navy shadow-lg scale-105'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                          }
                        `}
                      >
                        {archetype.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Context Display */}
                <AnimatePresence mode="wait">
                  {selectedArchetypeIndex[clusterIndex] !== null && selectedArchetypeIndex[clusterIndex] !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 overflow-hidden"
                    >
                      {/* Context Tabs */}
                      <div className="flex gap-1.5 mb-4">
                        {(['self', 'world', 'aspire'] as const).map((context) => (
                          <button
                            key={context}
                            onClick={() => handleContextClick(clusterIndex, selectedArchetypeIndex[clusterIndex]!, context)}
                            className={`
                              flex-1 px-3 py-2 rounded-lg text-xs font-['Gilroy-Bold'] tracking-tight transition-all
                              ${(activeContext[`${clusterIndex}-${selectedArchetypeIndex[clusterIndex]}`] || 'self') === context
                                ? 'bg-white text-navy shadow-md'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }
                            `}
                          >
                            {context === 'self' && '🪞'}
                            {context === 'world' && '🌍'}
                            {context === 'aspire' && '✨'}
                          </button>
                        ))}
                      </div>

                      {/* Context Content */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeContext[`${clusterIndex}-${selectedArchetypeIndex[clusterIndex]}`] || 'self'}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-gray-300 text-xs font-['Inter'] font-light leading-relaxed">
                            {cluster.archetypes[selectedArchetypeIndex[clusterIndex]!].contexts[
                              activeContext[`${clusterIndex}-${selectedArchetypeIndex[clusterIndex]}`] || 'self'
                            ]}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </div>
  );
}