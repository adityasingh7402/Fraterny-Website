'use client';

import { FC } from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';

// Updated to use dynamic keys where possible and add sizes
const experienceImages = [
  {
    dynamicKey: "experience-villa-retreat",
    fallback: {
      mobile: "/images/experience/villa-retreat-mobile.webp",
      tablet: "/images/experience/villa-retreat-tablet.webp",
      desktop: "/images/experience/villa-retreat-desktop.webp"
    },
    alt: "Luxury villa retreat where entrepreneurs gather for deep connections",
  },
  {
    dynamicKey: "experience-workshop",
    fallback: {
      mobile: "/images/experience/workshop-mobile.webp",
      tablet: "/images/experience/workshop-tablet.webp",
      desktop: "/images/experience/workshop-desktop.webp"
    },
    alt: "Interactive workshop session with driven professionals",
  },
  {
    dynamicKey: "experience-networking",
    fallback: {
      mobile: "/images/experience/networking-mobile.webp",
      tablet: "/images/experience/networking-tablet.webp",
      desktop: "/images/experience/networking-desktop.webp"
    },
    alt: "Meaningful networking among ambitious individuals",
  },
  {
    dynamicKey: "experience-collaboration",
    fallback: {
      mobile: "/images/experience/collaboration-mobile.webp",
      tablet: "/images/experience/collaboration-tablet.webp",
      desktop: "/images/experience/collaboration-desktop.webp"
    },
    alt: "Collaborative problem-solving in a premium environment",
  },
  {
    dynamicKey: "experience-evening-session",
    fallback: {
      mobile: "/images/experience/evening-session-mobile.webp",
      tablet: "/images/experience/evening-session-tablet.webp",
      desktop: "/images/experience/evening-session-desktop.webp"
    },
    alt: "Evening mastermind session with panoramic views",
  },
  {
    dynamicKey: "experience-gourmet-dining",
    fallback: {
      mobile: "/images/experience/gourmet-dining-mobile.webp",
      tablet: "/images/experience/gourmet-dining-tablet.webp",
      desktop: "/images/experience/gourmet-dining-desktop.webp"
    },
    alt: "Gourmet dining experience bringing people together",
  }
];

const ImageGallery = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-2">
        {experienceImages.map((image, index) => (
          <div key={index} className="aspect-[4/3] w-full">
            <ResponsiveImage 
              alt={image.alt}
              loading={index < 2 ? "eager" : "lazy"}
              dynamicKey={image.dynamicKey}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageGallery;
