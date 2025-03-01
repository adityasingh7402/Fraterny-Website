
import React from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';

// Replace these with your actual optimized marketing images
const experienceImages = [
  {
    src: {
      mobile: "/images/experience/lakeside-mobile.webp",
      tablet: "/images/experience/lakeside-tablet.webp",
      desktop: "/images/experience/lakeside-desktop.webp"
    },
    alt: "Serene lakeside retreat surrounded by lush forest"
  },
  {
    src: {
      mobile: "/images/experience/mountain-mobile.webp",
      tablet: "/images/experience/mountain-tablet.webp",
      desktop: "/images/experience/mountain-desktop.webp"
    },
    alt: "Misty mountain peak at sunrise"
  },
  {
    src: {
      mobile: "/images/experience/ocean-mobile.webp",
      tablet: "/images/experience/ocean-tablet.webp",
      desktop: "/images/experience/ocean-desktop.webp"
    },
    alt: "Rolling ocean waves meeting the shore"
  },
  {
    src: {
      mobile: "/images/experience/desert-mobile.webp",
      tablet: "/images/experience/desert-tablet.webp",
      desktop: "/images/experience/desert-desktop.webp"
    },
    alt: "Golden desert dunes at sunset"
  },
  {
    src: {
      mobile: "/images/experience/aerial-mobile.webp",
      tablet: "/images/experience/aerial-tablet.webp",
      desktop: "/images/experience/aerial-desktop.webp"
    },
    alt: "Aerial view of verdant mountain landscape"
  },
  {
    src: {
      mobile: "/images/experience/architecture-mobile.webp",
      tablet: "/images/experience/architecture-tablet.webp",
      desktop: "/images/experience/architecture-desktop.webp"
    },
    alt: "Modern architectural marvel in white"
  }
];

const ImageGallery = () => {
  return (
    <section className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-2">
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
