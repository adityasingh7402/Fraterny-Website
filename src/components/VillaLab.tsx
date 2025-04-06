
import { ArrowRight } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import ResponsiveImage from './ui/ResponsiveImage';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useIsMobile } from '@/hooks/use-mobile';
import { DeviceDetectionWrapper } from './ui/DeviceDetectionWrapper';
import { supabase } from '@/integrations/supabase/client';

// First check if the image keys exist in the database
const checkImageExists = async (key: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('website_images')
      .select('id')
      .eq('key', key)
      .maybeSingle();
    return !!data;
  } catch (error) {
    console.error(`Error checking if image exists: ${key}`, error);
    return false;
  }
};

const VillaLab = () => {
  const network = useNetworkStatus();
  const { isMobile, isDetecting } = useIsMobile();
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [checkedKeys, setCheckedKeys] = useState<Record<string, boolean>>({});
  
  // Determine how many images to initially show based on network conditions & device
  useEffect(() => {
    if (isDetecting) return; // Skip if still detecting
    
    // Start with a small number on slow connections, more on fast connections
    const baseCount = ['slow-2g', '2g'].includes(network.effectiveConnectionType) ? 2 : 
                      network.effectiveConnectionType === '3g' ? 4 : 
                      6;
                      
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
  }, [network.effectiveConnectionType, isMobile, isDetecting]);

  // Updated to use ONLY dynamic image keys
  const activities = useMemo(() => [
    { 
      title: "Workshops", 
      dynamicKey: "villalab-workshop",
      alt: "Interactive workshop session",
      width: 600,
      height: 600
    },
    { 
      title: "Gourmet Meals", 
      dynamicKey: "villalab-gourmet",
      alt: "Premium dining experience",
      width: 600,
      height: 600
    },
    { 
      title: "Group Activities", 
      dynamicKey: "villalab-group",
      alt: "Team-building activity in progress",
      width: 600,
      height: 600
    },
    { 
      title: "Candid Interactions", 
      dynamicKey: "villalab-candid",
      alt: "Natural conversation between participants",
      width: 600,
      height: 600
    },
    { 
      title: "Networking", 
      dynamicKey: "villalab-networking",
      alt: "Professional connections being formed",
      width: 600,
      height: 600
    },
    { 
      title: "Evening Sessions", 
      dynamicKey: "villalab-evening",
      alt: "Deep discussions in evening setting",
      width: 600,
      height: 600
    },
    { 
      title: "Brainstorming", 
      dynamicKey: "villalab-brainstorm",
      alt: "Collaborative ideation session",
      width: 600,
      height: 600
    },
    { 
      title: "Mentorship", 
      dynamicKey: "villalab-mentorship",
      alt: "One-on-one guidance session",
      width: 600,
      height: 600
    },
    { 
      title: "Social Events", 
      dynamicKey: "villalab-social",
      alt: "Relaxed social gathering",
      width: 600,
      height: 600
    }
  ], []);

  // Check which image keys exist in the database
  useEffect(() => {
    const checkAllImages = async () => {
      const results: Record<string, boolean> = {};
      
      for (const activity of activities) {
        results[activity.dynamicKey] = await checkImageExists(activity.dynamicKey);
      }
      
      console.log('VillaLab: Image existence check results:', results);
      setCheckedKeys(results);
    };
    
    checkAllImages();
  }, [activities]);

  // Calculate how many images to display based on viewport and network conditions
  const displayCount = Math.min(activities.length, visibleCount);

  // Determine if we need to delay loading images based on network conditions
  const shouldDelayNonEssentialImages = ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType);

  return (
    <DeviceDetectionWrapper>
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-8 sm:mb-12">
            {/* CUSTOMIZATION: Villa Lab Section Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-3 sm:mb-4">
              The Villa Lab
            </h2>
            {/* CUSTOMIZATION: Villa Lab Section Tagline */}
            <p className="text-lg sm:text-xl text-gray-600">
              Work hard. Bond harder.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 overflow-hidden">
            {activities.slice(0, displayCount).map((activity, index) => {
              // Determine loading strategy:
              // - First images load eagerly
              // - On good connections, load more eagerly
              // - On poor connections, lazy load most images
              const loadingStrategy = 
                index < 2 ? "eager" : // First 2 always eager
                (index < 4 && network.effectiveConnectionType === '4g') ? "eager" : // More eager on fast connections
                "lazy"; // Rest are lazy
              
              // Apply visual appearance based on loading status
              // This creates a progressive reveal effect
              const isVisible = index < visibleCount;
              
              // Check if this image exists in the database
              const imageExists = checkedKeys[activity.dynamicKey];
              
              // For featured items (index 0 and 1), we might want to force desktop version
              // even on mobile devices for better quality
              const shouldForceDesktop = index <= 1;
              
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
                  {imageExists ? (
                    <ResponsiveImage
                      dynamicKey={activity.dynamicKey}
                      alt={activity.alt}
                      className="w-full h-full"
                      loading={loadingStrategy}
                      width={activity.width}
                      height={activity.height}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                      objectFit="cover"
                      forceMobile={shouldForceDesktop ? false : undefined}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-500 text-sm px-4 text-center">
                        Image not available
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <span className="text-white p-4 font-medium">{activity.title}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 sm:mt-12 text-right">
            {/* CUSTOMIZATION: Villa Lab "See More" Link */}
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
    </DeviceDetectionWrapper>
  );
};

export default VillaLab;
