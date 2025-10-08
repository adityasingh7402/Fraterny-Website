import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { clusters } from './archeotype';

interface CardPosition {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotation: number;
}

export default function CircularArchetypeGallery() {
  const [selectedArchetypeIndex, setSelectedArchetypeIndex] = useState<{ [key: number]: number | null }>({});
  const [activeContext, setActiveContext] = useState<{ [key: string]: 'self' | 'world' | 'aspire' }>({});
  const [currentScroll, setCurrentScroll] = useState(0);
  const [targetScroll, setTargetScroll] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ current: 0, target: 0, ease: 0.08 });
  const rafRef = useRef<number>();
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);

  const getClusterImage = (index: number) => {
    return `/${7 + index}.png`;
  };

  // Calculate card positions in circular layout
  const calculateCardPosition = (index: number, scroll: number): CardPosition => {
    const totalCards = clusters.length;
    const cardWidth = 450;
    const spacing = 100;
    const totalWidth = (cardWidth + spacing) * totalCards;
    
    // Circular parameters
    const radius = 1200; // Radius of the circle
    
    // Calculate x position with wrapping
    const baseX = index * (cardWidth + spacing) - scroll;
    const wrappedX = ((baseX % totalWidth) + totalWidth) % totalWidth;
    const normalizedX = (wrappedX / totalWidth) * 2 - 1; // -1 to 1
    
    // Calculate angle around the circle (in radians)
    const angle = normalizedX * Math.PI * 0.6; // Wider arc
    
    // Calculate x and z based on circle (circular path in 3D)
    const x = Math.sin(angle) * radius; // Horizontal position
    const z = Math.cos(angle) * radius - radius; // Depth (closer when at center)
    
    // Y follows a slight curve (optional, for subtle arc)
    const y = -Math.abs(Math.sin(angle)) * 100; // Dip in the middle
    
    // Scale based on z-depth (closer = bigger)
    const scale = Math.max(0.4, 1 - Math.abs(z) / radius * 0.6);
    
    // Rotation to face center
    const rotation = -angle * (180 / Math.PI) * 0.5;
    
    return { x, y, z, scale, rotation };
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

  // Mouse/Touch handlers
  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    isDownRef.current = true;
    startXRef.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    startScrollRef.current = scrollRef.current.target;
  }, []);

  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDownRef.current) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = startXRef.current - x;
    scrollRef.current.target = startScrollRef.current + diff * 2;
  }, []);

  const handlePointerUp = useCallback(() => {
    isDownRef.current = false;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    scrollRef.current.target += e.deltaY * 0.5;
  }, []);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      // Smooth scroll interpolation
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * scrollRef.current.ease;
      setCurrentScroll(scrollRef.current.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handlePointerMove, handlePointerUp, handleWheel]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-gradient-to-b from-navy via-[#0a1a2f] to-navy overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      {/* Hero Section */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <div className="container mx-auto px-6 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-['Gilroy-Bold'] tracking-tighter text-white mb-6">
              Explore Clusters
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 font-['Gilroy-Regular'] tracking-tight">
              Drag or scroll to navigate through each cluster
            </p>
          </motion.div>
        </div>
      </div>

      {/* Cards Container */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}>
        {clusters.map((cluster, clusterIndex) => {
          const position = calculateCardPosition(clusterIndex, currentScroll);
          const zIndex = Math.round(100 - position.z / 10); // Higher z-index for cards further back

          return (
            <motion.div
              key={cluster.name}
              className="absolute"
              style={{
                transform: `translate3d(${position.x}px, ${position.y}px, ${position.z}px) scale(${position.scale}) rotateY(${position.rotation}deg)`,
                zIndex,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                pointerEvents: position.z > -600 ? 'auto' : 'none', // Only interact with front cards
                opacity: position.scale > 0.5 ? 1 : 0.5 // Fade distant cards
              }}
            >
              {/* Card */}
              <div className="w-[450px] h-[650px] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden">
                <div className="h-full flex flex-col">
                  {/* Top - Image Section */}
                  <div className="relative h-[280px] flex-shrink-0 overflow-hidden rounded-t-[40px]">
                    <img
                      src={getClusterImage(clusterIndex)}
                      alt={cluster.name}
                      className="w-full h-full object-cover"
                      draggable={false}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleArchetypeClick(clusterIndex, archeIndex);
                            }}
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
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Context Tabs */}
                          <div className="flex gap-1.5 mb-4">
                            {(['self', 'world', 'aspire'] as const).map((context) => (
                              <button
                                key={context}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContextClick(clusterIndex, selectedArchetypeIndex[clusterIndex]!, context);
                                }}
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
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Hint */}
      <div className="absolute bottom-8 left-0 right-0 z-20 pointer-events-none">
        <div className="text-center text-gray-400 text-sm font-['Inter']">
          <p>← Drag or scroll to explore →</p>
        </div>
      </div>
    </div>
  );
}