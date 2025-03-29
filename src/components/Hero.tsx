import { useState, useEffect } from 'react';
import ResponsiveImage from './ui/ResponsiveImage';
import { useQuery } from '@tanstack/react-query';
import { fetchWebsiteSettings } from '@/services/websiteSettingsService';

const Hero = () => {
  const [daysLeft, setDaysLeft] = useState(0);
  
  // Fetch dynamic settings from the database
  const { data: settings } = useQuery({
    queryKey: ['websiteSettings'],
    queryFn: fetchWebsiteSettings,
  });

  useEffect(() => {
    // If we have settings from the database, use them
    if (settings?.registration_days_left) {
      setDaysLeft(settings.registration_days_left);
    } else {
      // Otherwise, calculate based on the target date
      const calculateDaysLeft = () => {
        const targetDate = new Date(settings?.registration_close_date || '2025-03-31').getTime();
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
    }
  }, [settings]);

  // Gradient style for the overlay
  const gradientStyle = {
    background: `linear-gradient(to right, 
      rgba(10, 26, 47, 0.95) 0%,
      rgba(10, 26, 47, 0.8) 50%,
      rgba(10, 26, 47, 0.6) 100%
    )`
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-navy text-white relative overflow-hidden">
      {/* Background Image - now uses dedicated desktop and mobile keys */}
      <div className="absolute inset-0">
        <ResponsiveImage
          src={{
            mobile: "/images/hero/luxury-villa-mobile.webp",
            desktop: "/images/hero/luxury-villa-desktop.webp"
          }}
          alt="Stunning luxury villa with breathtaking views"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          dynamicKey="hero-background"
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0" style={gradientStyle} />
      
      <div className="container px-4 sm:px-6 py-24 sm:py-32 mx-auto relative z-10">
        <div className="animate-fade-down max-w-2xl flex flex-col gap-6 sm:gap-8">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-3 sm:mb-4">
              Where Ambition
              <br />
              Finds Its Tribe
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-200">
              Authenticity, Community, Growth, and Shared Aspirations
            </p>
          </div>

          <div className="animate-fade-up flex flex-col gap-6 sm:gap-8">
            <a 
              href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-6 sm:px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base sm:text-lg font-medium w-fit"
            >
              Claim your spot →
            </a>
            
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
