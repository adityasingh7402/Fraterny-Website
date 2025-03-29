import { useState, useEffect } from 'react';
import ResponsiveImage from './ui/ResponsiveImage';
import { useQuery } from '@tanstack/react-query';
import { fetchWebsiteSettings, calculateDaysLeft } from '@/services/websiteSettingsService';

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
    } else if (settings?.registration_close_date) {
      // Otherwise, calculate based on the target date
      const calculateAndSetDaysLeft = () => {
        const daysRemaining = calculateDaysLeft(settings.registration_close_date, 'Asia/Kolkata');
        setDaysLeft(daysRemaining);
      };

      // Calculate initial value
      calculateAndSetDaysLeft();

      // Set up a timer to check at midnight IST (6:30 PM UTC) each day
      const now = new Date();
      // Get current time in milliseconds since midnight
      const currentTimeMs = (
        now.getUTCHours() * 3600 + 
        now.getUTCMinutes() * 60 + 
        now.getUTCSeconds()
      ) * 1000 + now.getUTCMilliseconds();
      
      // Time until next day 6:30 PM UTC (midnight IST)
      const midnightISTMs = (18 * 3600 + 30 * 60) * 1000;
      const timeUntilMidnightIST = currentTimeMs < midnightISTMs 
        ? midnightISTMs - currentTimeMs 
        : 24 * 3600 * 1000 - currentTimeMs + midnightISTMs;
      
      // Set a timeout to update at exactly midnight IST
      const initialTimeout = setTimeout(() => {
        calculateAndSetDaysLeft();
        
        // Then set an interval to update every 24 hours
        const dailyInterval = setInterval(calculateAndSetDaysLeft, 24 * 60 * 60 * 1000);
        return () => clearInterval(dailyInterval);
      }, timeUntilMidnightIST);
      
      return () => clearTimeout(initialTimeout);
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
      {/* Background Image - using dynamicKey to fetch from admin upload */}
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
