import { ArrowRight } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import ResponsiveImage from './ui/ResponsiveImage';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useIsMobile } from '@/hooks/use-mobile';

// Beautiful spinner loading component for gallery images
const ImageSpinner = ({ index }: { index: number }) => (
  <div className="absolute inset-0 bg-navy/90 flex items-center justify-center">
    {/* Animated spinner */}
    <div className="relative">
      <div className="w-8 h-8 border-4 border-terracotta/30 border-t-terracotta rounded-full animate-spin"></div>
      
      {/* Subtle background glow */}
      <div className="absolute inset-0 w-8 h-8 border-4 border-terracotta/10 rounded-full blur-sm"></div>
    </div>
    
    {/* Optional: Loading text for slower connections */}
    <div className="absolute bottom-4 left-4 right-4">
      <div className="text-xs text-gray-300 opacity-60 text-center">
        Loading...
      </div>
    </div>
    
    {/* Subtle animated background pattern */}
    <div className="absolute inset-0 opacity-5">
      <div 
        className="w-full h-full"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 1px, transparent 1px),
                           radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          animation: `float ${2 + (index % 3) * 0.5}s ease-in-out infinite alternate`
        }}
      />
    </div>
  </div>
);

const VillaLab = () => {
  const network = useNetworkStatus();
  const isMobile = useIsMobile();
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Determine how many images to initially show based on network conditions & device
  useEffect(() => {
    // Start with a small number on slow connections, more on fast connections
    const baseCount = ['slow-2g', '2g'].includes(network.effectiveConnectionType) 
      ? 2 
      : network.effectiveConnectionType === '3g' 
        ? 4 
        : 6;

    // Show fewer on mobile
    const count = isMobile ? Math.min(baseCount, 4) : baseCount;
    setVisibleCount(count);

    // Gradually increase the visible count for a staggered load
    const interval = setInterval(() => {
      setVisibleCount(current => {
        const maxDisplay = isMobile ? 6 : 9;
        return current < maxDisplay ? current + 1 : current;
      });
    }, isMobile ? 400 : 300); // Slower on mobile

    return () => clearInterval(interval);
  }, [network.effectiveConnectionType, isMobile]);

  // Auto-hide spinners after a reasonable time (progressive enhancement)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mark first few images as "loaded" after 1.5 seconds
      const initialLoaded = new Set<number>();
      for (let i = 0; i < Math.min(visibleCount, 4); i++) {
        initialLoaded.add(i);
      }
      setLoadedImages(initialLoaded);
      
      // Gradually mark more as loaded
      const interval = setInterval(() => {
        setLoadedImages(current => {
          const newSet = new Set(current);
          const nextIndex = current.size;
          if (nextIndex < visibleCount) {
            newSet.add(nextIndex);
          }
          return newSet;
        });
      }, 300);

      return () => clearInterval(interval);
    }, 1500); // Initial delay before starting to hide spinners

    return () => clearTimeout(timer);
  }, [visibleCount]);

  // Updated to use dynamic image keys and include width/height for CLS optimization
  const activities = useMemo(() => [
    {
      title: "Workshops",
      dynamicKey: "villalab-workshop",
      fallbackSrc: {
        mobile: "/images/villalab/workshop-mobile.webp",
        desktop: "/images/villalab/workshop-desktop.webp"
      },
      alt: "Interactive workshop session"
    },
    {
      title: "Gourmet Meals",
      dynamicKey: "villalab-gourmet",
      fallbackSrc: {
        mobile: "/images/villalab/gourmet-mobile.webp",
        desktop: "/images/villalab/gourmet-desktop.webp"
      },
      alt: "Premium dining experience"
    },
    {
      title: "Group Activities",
      dynamicKey: "villalab-group",
      fallbackSrc: {
        mobile: "/images/villalab/group-mobile.webp",
        desktop: "/images/villalab/group-desktop.webp"
      },
      alt: "Team-building activity in progress"
    },
    {
      title: "Candid Interactions",
      dynamicKey: "villalab-candid",
      fallbackSrc: {
        mobile: "/images/villalab/candid-mobile.webp",
        desktop: "/images/villalab/candid-desktop.webp"
      },
      alt: "Natural conversation between participants"
    },
    {
      title: "Networking",
      dynamicKey: "villalab-networking",
      fallbackSrc: {
        mobile: "/images/villalab/networking-mobile.webp",
        desktop: "/images/villalab/networking-desktop.webp"
      },
      alt: "Professional connections being formed"
    },
    {
      title: "Evening Sessions",
      dynamicKey: "villalab-evening",
      fallbackSrc: {
        mobile: "/images/villalab/evening-mobile.webp",
        desktop: "/images/villalab/evening-desktop.webp"
      },
      alt: "Deep discussions in evening setting"
    },
    {
      title: "Brainstorming",
      dynamicKey: "villalab-brainstorm",
      fallbackSrc: {
        mobile: "/images/villalab/brainstorm-mobile.webp",
        desktop: "/images/villalab/brainstorm-desktop.webp"
      },
      alt: "Collaborative ideation session"
    },
    {
      title: "Mentorship",
      dynamicKey: "villalab-mentorship",
      fallbackSrc: {
        mobile: "/images/villalab/mentorship-mobile.webp",
        desktop: "/images/villalab/mentorship-desktop.webp"
      },
      alt: "One-on-one guidance session"
    },
    {
      title: "Social Events",
      dynamicKey: "villalab-social",
      fallbackSrc: {
        mobile: "/images/villalab/social-mobile.webp",
        desktop: "/images/villalab/social-desktop.webp"
      },
      alt: "Relaxed social gathering"
    }
  ], []);

  // Calculate how many images to display based on viewport and network conditions
  const displayCount = Math.min(activities.length, visibleCount);

  return (
    <section className="bg-white sm:py-[49px] py-[31px]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          <h2 className="text-center sm:text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-3 sm:mb-4 text-4xl">
            The Villa Lab
          </h2>

          <p className="text-center sm:text-xl text-gray-600 text-base">
            Think hard. Vibe harder.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {activities.slice(0, displayCount).map((activity, index) => {
            // Determine loading strategy:
            // - First images load eagerly
            // - On good connections, load more eagerly
            // - On poor connections, lazy load most images
            const loadingStrategy = index < 2 
              ? "eager" 
              : index < 4 && network.effectiveConnectionType === '4g' 
                ? "eager" 
                : "lazy";

            // Apply visual appearance based on loading status
            // This creates a progressive reveal effect
            const isVisible = index < visibleCount;
            const isImageLoaded = loadedImages.has(index);
            
            return (
              <div 
                key={index} 
                className={`aspect-square bg-navy rounded-lg overflow-hidden relative group transition-opacity duration-500 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                {/* LOADING STATE: Beautiful spinner while image loads */}
                {!isImageLoaded && (
                  <ImageSpinner index={index} />
                )}
                
                {/* IMAGE: Fades in when loaded */}
                <div className={`transition-opacity duration-500 ${
                  isImageLoaded ? 'opacity-100' : 'opacity-0'
                }`}>
                  <ResponsiveImage 
                    alt={activity.alt} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    loading={loadingStrategy} 
                    dynamicKey={isMobile ? `${activity.dynamicKey}-mobile` : activity.dynamicKey}
                    priority={index < 2} // Prioritize loading for first two images
                  />
                </div>
                
                {/* HOVER OVERLAY: Only visible when image is loaded */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end ${
                  !isImageLoaded ? 'pointer-events-none' : ''
                }`}>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-12 text-center sm:text-right">
          <a 
            href="https://www.instagram.com/join.fraterny/?hl=en" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-navy hover:text-terracotta transition-colors group"
          >
            <span className="mr-2">see more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default VillaLab;