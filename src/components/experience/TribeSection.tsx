
import React from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';

// Updated with more relevant peer profile images
const peers = [
  { 
    title: "The Visionary", 
    dynamicKey: "tribe-visionary",
    description: "Sees possibilities others don't",
    imageSrc: {
      mobile: "/images/tribe/visionary-mobile.webp",
      desktop: "/images/tribe/visionary-desktop.webp"
    }
  },
  { 
    title: "The Hustler", 
    dynamicKey: "tribe-hustler",
    description: "Gets things done, period",
    imageSrc: {
      mobile: "/images/tribe/hustler-mobile.webp",
      desktop: "/images/tribe/hustler-desktop.webp"
    }
  },
  { 
    title: "The Workaholic", 
    dynamicKey: "tribe-workaholic",
    description: "Lives and breathes excellence",
    imageSrc: {
      mobile: "/images/tribe/workaholic-mobile.webp",
      desktop: "/images/tribe/workaholic-desktop.webp"
    }
  },
  { 
    title: "The Experienced", 
    dynamicKey: "tribe-experienced",
    description: "Been there, done that",
    imageSrc: {
      mobile: "/images/tribe/experienced-mobile.webp",
      desktop: "/images/tribe/experienced-desktop.webp"
    }
  },
  { 
    title: "The Optimist", 
    dynamicKey: "tribe-optimist",
    description: "Finds silver linings",
    imageSrc: {
      mobile: "/images/tribe/optimist-mobile.webp",
      desktop: "/images/tribe/optimist-desktop.webp"
    }
  },
  { 
    title: "The Guardian", 
    dynamicKey: "tribe-guardian",
    description: "Keeps the ship steady",
    imageSrc: {
      mobile: "/images/tribe/guardian-mobile.webp",
      desktop: "/images/tribe/guardian-desktop.webp"
    }
  }
];

const TribeSection = () => {
  return (
    <section className="py-16 relative">
      {/* Background color */}
      <div className="absolute inset-0 bg-gray-50"></div>
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, 
            rgba(10, 26, 47, 0.95) 0%,
            rgba(10, 26, 47, 0.8) 50%,
            rgba(10, 26, 47, 0.6) 100%
          )`
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Tribe Section Title - Updated text color for contrast */}
        <h2 className="text-3xl md:text-4xl font-playfair text-white mb-12 text-center">Your Tribe Awaits</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {peers.map((peer, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                <ResponsiveImage 
                  dynamicKey={peer.dynamicKey} 
                  alt={peer.title}
                  className="w-full h-full object-cover"
                  loading={index < 3 ? "eager" : "lazy"}
                />
              </div>
              <h3 className="font-medium text-white mb-2">{peer.title}</h3>
              <p className="text-gray-200 text-sm">{peer.description}</p>
            </div>
          ))}
        </div>
        
        {/* Tribe Section Tagline - Updated text color for contrast */}
        <p className="text-center text-lg text-gray-200">
          Divided by Circumstance, United by Fraterny
        </p>
      </div>
    </section>
  );
};

export default TribeSection;

