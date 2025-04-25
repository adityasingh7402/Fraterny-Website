import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import ResponsiveImage from './ui/ResponsiveImage';
import { scheduleAtMidnight, calculateDaysLeft as utilsCalculateDaysLeft } from '@/utils/dateUtils';
import { useReactQueryWebsiteSettings } from '@/hooks/useReactQueryWebsiteSettings';
const Hero = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  // Use our React Query powered hook
  const {
    settings,
    isLoading
  } = useReactQueryWebsiteSettings();
  useEffect(() => {
    // If we have settings from the database, use them
    if (settings?.registration_close_date) {
      // Log the target date for debugging
      console.log('Registration close date from settings:', settings.registration_close_date);

      // Define function to calculate and update days left
      const calculateAndSetDaysLeft = () => {
        // Use the direct import from utils to avoid any import chain issues
        const daysRemaining = utilsCalculateDaysLeft(settings.registration_close_date);
        console.log('Days remaining calculated in Hero:', daysRemaining);
        setDaysLeft(daysRemaining);
      };

      // Calculate initial value
      calculateAndSetDaysLeft();

      // Set up a timer to update at midnight IST each day
      const cleanup = scheduleAtMidnight(calculateAndSetDaysLeft);
      return cleanup;
    } else {
      console.warn('No registration_close_date found in settings');
    }
  }, [settings]);

  // Gradient style for the overlay
  const gradientStyle = {
    background: `linear-gradient(to right, 
      rgba(10, 26, 47, 0.9) 0%,
      rgba(10, 26, 47, 0.7) 50%,
      rgba(10, 26, 47, 0.4) 100%
    )`
  };
  return <section className="min-h-screen flex items-center justify-center bg-navy text-white relative overflow-hidden">
      {/* Background Image - using dynamicKey to fetch from admin upload */}
      <div className="absolute inset-0">
        <ResponsiveImage alt="Stunning luxury villa with breathtaking views" className="w-full h-full object-cover" loading="eager" fetchPriority="high" dynamicKey="hero-background" />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0" style={gradientStyle} />
      
      <div className="container px-4 sm:px-6 py-24 sm:py-32 mx-auto relative z-10">
        <div className="max-w-2xl flex flex-col gap-6 sm:gap-8">
          <div>
            <h1 className="sm:text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-3 sm:mb-4 text-4xl">
              Where Ambition
              <br />
              Finds Its Tribe
            </h1>

            <p className="sm:text-lg md:text-xl text-gray-200 text-base">Surround yourself with the right people</p>
          </div>

          <div className="animate-fade-up flex flex-col gap-6 sm:gap-8">
            <a href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" target="_blank" rel="noopener noreferrer" className="px-6 sm:px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-base sm:text-lg font-medium w-fit flex items-center gap-2">
              The Frat Villa Entry <ArrowRight size={20} />
            </a>
            
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-4 sm:px-6 py-3 sm:py-4 inline-block w-fit">
              <p className="text-sm md:text-base text-gray-300 mb-1">Villa Registrations close in:</p>
              <div className="text-xl font-mono">
                {isLoading ? "Loading..." : `${daysLeft} Days`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;