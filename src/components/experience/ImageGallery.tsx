
import React from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';

// Updated with more relevant optimized marketing images
const experienceImages = [
  {
    src: {
      mobile: "/images/experience/villa-retreat-mobile.webp",
      tablet: "/images/experience/villa-retreat-tablet.webp",
      desktop: "/images/experience/villa-retreat-desktop.webp"
    },
    alt: "Luxury villa retreat where entrepreneurs gather for deep connections"
  },
  {
    src: {
      mobile: "/images/experience/workshop-mobile.webp",
      tablet: "/images/experience/workshop-tablet.webp",
      desktop: "/images/experience/workshop-desktop.webp"
    },
    alt: "Interactive workshop session with driven professionals"
  },
  {
    src: {
      mobile: "/images/experience/networking-mobile.webp",
      tablet: "/images/experience/networking-tablet.webp",
      desktop: "/images/experience/networking-desktop.webp"
    },
    alt: "Meaningful networking among ambitious individuals"
  },
  {
    src: {
      mobile: "/images/experience/collaboration-mobile.webp",
      tablet: "/images/experience/collaboration-tablet.webp",
      desktop: "/images/experience/collaboration-desktop.webp"
    },
    alt: "Collaborative problem-solving in a premium environment"
  },
  {
    src: {
      mobile: "/images/experience/evening-session-mobile.webp",
      tablet: "/images/experience/evening-session-tablet.webp",
      desktop: "/images/experience/evening-session-desktop.webp"
    },
    alt: "Evening mastermind session with panoramic views"
  },
  {
    src: {
      mobile: "/images/experience/gourmet-dining-mobile.webp",
      tablet: "/images/experience/gourmet-dining-tablet.webp",
      desktop: "/images/experience/gourmet-dining-desktop.webp"
    },
    alt: "Gourmet dining experience bringing people together"
  }
];

const ImageGallery = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
        {experienceImages.map((image, index) => (
          <div key={index} className="aspect-[4/3] w-full">
            <ResponsiveImage 
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index < 2 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageGallery;
