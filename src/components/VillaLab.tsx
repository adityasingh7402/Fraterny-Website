import { ArrowRight } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import ResponsiveImage from './ui/ResponsiveImage';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { useIsMobile } from '@/hooks/use-mobile';
const VillaLab = () => {
  const network = useNetworkStatus();
  const isMobile = useIsMobile();
  const [visibleCount, setVisibleCount] = useState<number>(0);

  // Determine how many images to initially show based on network conditions & device
  useEffect(() => {
    // Start with a small number on slow connections, more on fast connections
    const baseCount = ['slow-2g', '2g'].includes(network.effectiveConnectionType) ? 2 : network.effectiveConnectionType === '3g' ? 4 : 6;

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

  // Updated to use dynamic image keys and include width/height for CLS optimization
  const activities = useMemo(() => [{
    title: "Workshops",
    dynamicKey: "villalab-workshop",
    fallbackSrc: {
      mobile: "/images/villalab/workshop-mobile.webp",
      desktop: "/images/villalab/workshop-desktop.webp"
    },
    alt: "Interactive workshop session"
  }, {
    title: "Gourmet Meals",
    dynamicKey: "villalab-gourmet",
    fallbackSrc: {
      mobile: "/images/villalab/gourmet-mobile.webp",
      desktop: "/images/villalab/gourmet-desktop.webp"
    },
    alt: "Premium dining experience"
  }, {
    title: "Group Activities",
    dynamicKey: "villalab-group",
    fallbackSrc: {
      mobile: "/images/villalab/group-mobile.webp",
      desktop: "/images/villalab/group-desktop.webp"
    },
    alt: "Team-building activity in progress"
  }, {
    title: "Candid Interactions",
    dynamicKey: "villalab-candid",
    fallbackSrc: {
      mobile: "/images/villalab/candid-mobile.webp",
      desktop: "/images/villalab/candid-desktop.webp"
    },
    alt: "Natural conversation between participants"
  }, {
    title: "Networking",
    dynamicKey: "villalab-networking",
    fallbackSrc: {
      mobile: "/images/villalab/networking-mobile.webp",
      desktop: "/images/villalab/networking-desktop.webp"
    },
    alt: "Professional connections being formed"
  }, {
    title: "Evening Sessions",
    dynamicKey: "villalab-evening",
    fallbackSrc: {
      mobile: "/images/villalab/evening-mobile.webp",
      desktop: "/images/villalab/evening-desktop.webp"
    },
    alt: "Deep discussions in evening setting"
  }, {
    title: "Brainstorming",
    dynamicKey: "villalab-brainstorm",
    fallbackSrc: {
      mobile: "/images/villalab/brainstorm-mobile.webp",
      desktop: "/images/villalab/brainstorm-desktop.webp"
    },
    alt: "Collaborative ideation session"
  }, {
    title: "Mentorship",
    dynamicKey: "villalab-mentorship",
    fallbackSrc: {
      mobile: "/images/villalab/mentorship-mobile.webp",
      desktop: "/images/villalab/mentorship-desktop.webp"
    },
    alt: "One-on-one guidance session"
  }, {
    title: "Social Events",
    dynamicKey: "villalab-social",
    fallbackSrc: {
      mobile: "/images/villalab/social-mobile.webp",
      desktop: "/images/villalab/social-desktop.webp"
    },
    alt: "Relaxed social gathering"
  }], []);

  // Calculate how many images to display based on viewport and network conditions
  const displayCount = Math.min(activities.length, visibleCount);

  // Determine if we need to delay loading images based on network conditions
  const shouldDelayNonEssentialImages = ['slow-2g', '2g', '3g'].includes(network.effectiveConnectionType);
  return <section className="bg-white sm:py-[49px] py-[31px]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 sm:mb-12">
          {/* CUSTOMIZATION: Villa Lab Section Title */}
          <h2 className="sm:text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-3 sm:mb-4 text-4xl">
            The Villa Lab
          </h2>
          {/* CUSTOMIZATION: Villa Lab Section Tagline */}
          <p className="sm:text-xl text-gray-600 text-base"> Think hard. Vibe harder.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {activities.slice(0, displayCount).map((activity, index) => {
          // Determine loading strategy:
          // - First images load eagerly
          // - On good connections, load more eagerly
          // - On poor connections, lazy load most images
          const loadingStrategy = index < 2 ? "eager" :
          // First 2 always eager
          index < 4 && network.effectiveConnectionType === '4g' ? "eager" :
          // More eager on fast connections
          "lazy"; // Rest are lazy

          // Apply visual appearance based on loading status
          // This creates a progressive reveal effect
          const isVisible = index < visibleCount;
          return <div key={index} className={`aspect-square bg-navy rounded-lg overflow-hidden relative group transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} style={{
            transitionDelay: `${index * 100}ms`
          }}>
                <ResponsiveImage alt={activity.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading={loadingStrategy} dynamicKey={activity.dynamicKey} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                </div>
              </div>;
        })}
        </div>

        <div className="mt-8 sm:mt-12 text-right">
          {/* CUSTOMIZATION: Villa Lab "See More" Link */}
          <a href="https://www.instagram.com/join.fraterny/?hl=en" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-navy hover:text-terracotta transition-colors group">
            <span className="mr-2">see more</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>;
};
export default VillaLab;