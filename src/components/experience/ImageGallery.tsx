
import React from 'react';
import ResponsiveImage from '../ui/ResponsiveImage';
import { DeviceDetectionWrapper } from '../ui/DeviceDetectionWrapper';

// Updated to use ONLY dynamic keys
const experienceImages = [
  {
    dynamicKey: "experience-villa-retreat",
    alt: "Luxury villa retreat where entrepreneurs gather for deep connections",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-workshop",
    alt: "Interactive workshop session with driven professionals",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-networking",
    alt: "Meaningful networking among ambitious individuals",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-collaboration",
    alt: "Collaborative problem-solving in a premium environment",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-evening-session",
    alt: "Evening mastermind session with panoramic views",
    width: 800,
    height: 600
  },
  {
    dynamicKey: "experience-gourmet-dining",
    alt: "Gourmet dining experience bringing people together",
    width: 800,
    height: 600
  }
];

const ImageGallery = () => {
  return (
    <DeviceDetectionWrapper loadingHeight="50vh">
      <section className="w-full overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
          {experienceImages.map((image, index) => (
            <div key={index} className="aspect-[4/3] w-full">
              <ResponsiveImage 
                dynamicKey={image.dynamicKey}
                alt={image.alt}
                className="w-full h-full"
                loading={index < 2 ? "eager" : "lazy"}
                width={image.width}
                height={image.height}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 33vw"
                objectFit="cover"
              />
            </div>
          ))}
        </div>
      </section>
    </DeviceDetectionWrapper>
  );
};

export default ImageGallery;
