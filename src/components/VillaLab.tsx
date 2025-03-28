
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import ResponsiveImage from './ui/ResponsiveImage';

const VillaLab = () => {
  // Updated to use dynamic image keys and include width/height for CLS optimization
  const activities = useMemo(() => [
    { 
      title: "Workshops", 
      dynamicKey: "villalab-workshop",
      fallbackSrc: {
        mobile: "/images/villalab/workshop-mobile.webp",
        desktop: "/images/villalab/workshop-desktop.webp"
      },
      alt: "Interactive workshop session",
      width: 600,
      height: 600
    },
    { 
      title: "Gourmet Meals", 
      dynamicKey: "villalab-gourmet",
      fallbackSrc: {
        mobile: "/images/villalab/gourmet-mobile.webp",
        desktop: "/images/villalab/gourmet-desktop.webp"
      },
      alt: "Premium dining experience",
      width: 600,
      height: 600
    },
    { 
      title: "Group Activities", 
      dynamicKey: "villalab-group",
      fallbackSrc: {
        mobile: "/images/villalab/group-mobile.webp",
        desktop: "/images/villalab/group-desktop.webp"
      },
      alt: "Team-building activity in progress",
      width: 600,
      height: 600
    },
    { 
      title: "Candid Interactions", 
      dynamicKey: "villalab-candid",
      fallbackSrc: {
        mobile: "/images/villalab/candid-mobile.webp",
        desktop: "/images/villalab/candid-desktop.webp"
      },
      alt: "Natural conversation between participants",
      width: 600,
      height: 600
    },
    { 
      title: "Networking", 
      dynamicKey: "villalab-networking",
      fallbackSrc: {
        mobile: "/images/villalab/networking-mobile.webp",
        desktop: "/images/villalab/networking-desktop.webp"
      },
      alt: "Professional connections being formed",
      width: 600,
      height: 600
    },
    { 
      title: "Evening Sessions", 
      dynamicKey: "villalab-evening",
      fallbackSrc: {
        mobile: "/images/villalab/evening-mobile.webp",
        desktop: "/images/villalab/evening-desktop.webp"
      },
      alt: "Deep discussions in evening setting",
      width: 600,
      height: 600
    },
    { 
      title: "Brainstorming", 
      dynamicKey: "villalab-brainstorm",
      fallbackSrc: {
        mobile: "/images/villalab/brainstorm-mobile.webp",
        desktop: "/images/villalab/brainstorm-desktop.webp"
      },
      alt: "Collaborative ideation session",
      width: 600,
      height: 600
    },
    { 
      title: "Mentorship", 
      dynamicKey: "villalab-mentorship",
      fallbackSrc: {
        mobile: "/images/villalab/mentorship-mobile.webp",
        desktop: "/images/villalab/mentorship-desktop.webp"
      },
      alt: "One-on-one guidance session",
      width: 600,
      height: 600
    },
    { 
      title: "Social Events", 
      dynamicKey: "villalab-social",
      fallbackSrc: {
        mobile: "/images/villalab/social-mobile.webp",
        desktop: "/images/villalab/social-desktop.webp"
      },
      alt: "Relaxed social gathering",
      width: 600,
      height: 600
    }
  ], []);

  // Get the window width only on client-side
  const displayCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 9;

  return (
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
          {activities.slice(0, displayCount).map((activity, index) => (
            <div 
              key={index}
              className="aspect-square bg-navy rounded-lg overflow-hidden relative group"
            >
              <ResponsiveImage
                src={activity.fallbackSrc}
                alt={activity.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading={index < 4 ? "eager" : "lazy"}
                dynamicKey={activity.dynamicKey}
                width={activity.width}
                height={activity.height}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <span className="text-white p-4 font-medium">{activity.title}</span>
              </div>
            </div>
          ))}
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
  );
};

export default VillaLab;
