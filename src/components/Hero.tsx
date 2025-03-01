
import { useState, useEffect, useMemo } from 'react';
import ResponsiveImage from './ui/ResponsiveImage';

const Hero = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  // CUSTOMIZATION: Registration Deadline
  // Change the target date to your registration deadline
  // Format: 'YYYY-MM-DD'
  const targetDate = useMemo(() => new Date('2024-12-31').getTime(), []);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const difference = targetDate - new Date().getTime();
      if (difference > 0) {
        setDaysLeft(Math.floor(difference / (1000 * 60 * 60 * 24)));
      }
    };

    // Calculate initial value
    calculateDaysLeft();

    // Update once per day is sufficient for days countdown
    const dailyUpdate = setInterval(calculateDaysLeft, 24 * 60 * 60 * 1000);

    return () => clearInterval(dailyUpdate);
  }, [targetDate]);

  // Memoize styles to prevent recreating objects on each render
  const gradientStyle = useMemo(() => ({
    background: `linear-gradient(to right, 
      rgba(10, 26, 47, 0.95) 0%,
      rgba(10, 26, 47, 0.8) 50%,
      rgba(10, 26, 47, 0.6) 100%
    )`
  }), []);

  // Log to debug if images are loading
  useEffect(() => {
    console.log('Hero component mounted. Image paths:');
    console.log('Mobile:', '/images/hero/luxury-villa-mobile.webp');
    console.log('Tablet:', '/images/hero/luxury-villa-tablet.webp');
    console.log('Desktop:', '/images/hero/luxury-villa-desktop.webp');
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-navy text-white relative overflow-hidden">
      {/* Background Image - Changed to use ResponsiveImage component for better performance */}
      <div className="absolute inset-0">
        <ResponsiveImage
          src={{
            mobile: "/images/hero/luxury-villa-mobile.webp",
            tablet: "/images/hero/luxury-villa-tablet.webp",
            desktop: "/images/hero/luxury-villa-desktop.webp"
          }}
          alt="Stunning luxury villa with breathtaking views"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0" style={gradientStyle} />
      
      <div className="container px-4 sm:px-6 py-24 sm:py-32 mx-auto relative z-10">
        <div className="animate-fade-down max-w-2xl flex flex-col gap-6 sm:gap-8">
          <div>
            {/* CUSTOMIZATION: Main Hero Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-3 sm:mb-4">
              Where Ambition
              <br />
              Finds Its Tribe
            </h1>
            
            {/* CUSTOMIZATION: Hero Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-200">
              Authenticity, Community, Growth, and Shared Aspirations
            </p>
          </div>

          <div className="animate-fade-up flex flex-col gap-6 sm:gap-8">
            {/* CUSTOMIZATION: Hero CTA Button */}
            <a 
              href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 sm:px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base sm:text-lg font-medium w-fit"
            >
              Claim your spot →
            </a>
            
            {/* CUSTOMIZATION: Countdown Timer */}
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 sm:py-4 inline-block w-fit">
              <p className="text-sm md:text-base text-gray-300 mb-1">Registrations close in:</p>
              <div className="text-xl font-mono">
                {daysLeft} Days
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
