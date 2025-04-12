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
    width: 1920,
    height: 1080
  },
  {
    dynamicKey: "experience-workshop",
    fallback: {
      mobile: "/images/experience/workshop-mobile.webp",
      tablet: "/images/experience/workshop-tablet.webp",
      desktop: "/images/experience/workshop-desktop.webp"
    },
    alt: "Interactive workshop session with driven professionals",
    width: 1920,
    height: 1080
  },
  {
    dynamicKey: "experience-networking",
    fallback: {
      mobile: "/images/experience/networking-mobile.webp",
      tablet: "/images/experience/networking-tablet.webp",
      desktop: "/images/experience/networking-desktop.webp"
    },
    alt: "Meaningful networking among ambitious individuals",
    width: 1920,
    height: 1080
  },
  {
    dynamicKey: "experience-collaboration",
    fallback: {
      mobile: "/images/experience/collaboration-mobile.webp",
      tablet: "/images/experience/collaboration-tablet.webp",
      desktop: "/images/experience/collaboration-desktop.webp"
    },
    alt: "Collaborative problem-solving in a premium environment",
    width: 1920,
    height: 1080
  },
  {
    dynamicKey: "experience-evening-session",
    fallback: {
      mobile: "/images/experience/evening-session-mobile.webp",
      tablet: "/images/experience/evening-session-tablet.webp",
      desktop: "/images/experience/evening-session-desktop.webp"
    },
    alt: "Evening mastermind session with panoramic views",
    width: 1920,
    height: 1080
  },
  {
    dynamicKey: "experience-gourmet-dining",
    fallback: {
      mobile: "/images/experience/gourmet-dining-mobile.webp",
      tablet: "/images/experience/gourmet-dining-tablet.webp",
      desktop: "/images/experience/gourmet-dining-desktop.webp"
    },
    alt: "Gourmet dining experience bringing people together",
    width: 1920,
    height: 1080
  }
];

const ImageGallery: FC = () => {
  return (
    <section className="w-full max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
        {experienceImages.map((image, index) => (
          <div key={index} className="aspect-[16/9] w-full">
            <ResponsiveImage 
              src={image.fallback}
              alt={image.alt}
              className="w-full h-full"
              loading={index < 2 ? "eager" : "lazy"}
              dynamicKey={image.dynamicKey}
              width={image.width}
              height={image.height}
              sizes="(max-width: 640px) 100vw, 50vw"
              objectFit="cover"
              priority={index < 2}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageGallery;
