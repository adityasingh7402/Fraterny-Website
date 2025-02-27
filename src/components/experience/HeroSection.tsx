
import React from 'react';

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 bg-navy text-white relative">
      {/* Background Image - Optimized with loading priority */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&q=80&w=2400')`,
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&q=80&w=2400"
          alt="Luxury villa exterior"
          className="hidden"
          fetchPriority="high"
        />
      </div>
      
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
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
            Condensing lifelong memories, lessons, and friendships in a week.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            20 people. 7 days. 1 life-changing experience
          </p>
          <a 
            href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm italic underline text-terracotta hover:text-opacity-80 transition-colors"
          >
            See if you fit →
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
