
import { useState, useEffect } from 'react';

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2024-12-31'); // Example date
    
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      <div className="container px-6 py-32 mx-auto text-center relative z-10">
        <div className="animate-fade-down max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold tracking-tight mb-6">
            Where Ambition
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-terracotta to-gold">
              Finds Its Tribe
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Authenticity, Community, Growth, and Shared Aspirations
          </p>

          <div className="animate-fade-up delay-100">
            <button className="px-8 py-4 rounded-lg bg-terracotta text-white hover:bg-opacity-90 transition-all text-lg font-medium mb-8">
              Claim your spot →
            </button>
            
            <div className="text-sm md:text-base text-gray-300">
              <p className="mb-2">Registrations for December 2024 cohort closes in:</p>
              <div className="flex justify-center gap-4 font-mono">
                <span>{timeLeft.days}d</span>
                <span>{timeLeft.hours}h</span>
                <span>{timeLeft.minutes}m</span>
                <span>{timeLeft.seconds}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
