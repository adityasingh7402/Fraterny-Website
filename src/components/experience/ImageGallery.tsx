import React, { useEffect, useState } from 'react';

const experienceImages = [
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&q=80&w=2000",
    alt: "Serene lakeside retreat surrounded by lush forest"
  },
  {
    url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&q=80&w=2000",
    alt: "Misty mountain peak at sunrise"
  },
  {
    url: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&q=80&w=2000",
    alt: "Rolling ocean waves meeting the shore"
  },
  {
    url: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&q=80&w=2000",
    alt: "Golden desert dunes at sunset"
  },
  {
    url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&q=80&w=2000",
    alt: "Aerial view of verdant mountain landscape"
  },
  {
    url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&q=80&w=2000",
    alt: "Modern architectural marvel in white"
  }
];

const ImageGallery = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="w-full relative">
      {/* Mobile layout with parallax */}
      <div className="md:hidden relative h-[150vh] overflow-hidden">
        <div 
          className="fixed top-0 left-0 w-full h-screen grid grid-cols-2 opacity-60"
          style={{
            transform: `translateY(${scrollPosition * 0.5}px)`,
          }}
        >
          {experienceImages.map((image, index) => (
            <div key={index} className="relative h-[50vh]">
              <img 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover"
                loading={index < 2 ? "eager" : "lazy"}
                decoding="async"
              />
              <div className="absolute inset-0 bg-navy/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop layout (unchanged) */}
      <div className="hidden md:grid md:grid-cols-2">
        {experienceImages.map((image, index) => (
          <div key={index} className="aspect-[4/3] w-full">
            <img 
              src={image.url} 
              alt={image.alt}
              className="w-full h-full object-cover"
              loading={index < 2 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImageGallery;
