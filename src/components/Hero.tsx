
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
      
      <div className="container px-6 py-32 mx-auto relative z-10">
        <div className="animate-fade-down max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-4">
            Where Ambition
            <br />
            Finds Its Tribe
          </h1>
          
          <p className="text-lg md:text-xl mb-6 text-gray-200">
            A 7-day retreat for India's most driven minds. Only 20 seats. No tourists, just founders.
          </p>

          <div className="animate-fade-up space-y-6">
            <button className="px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-lg font-medium">
              Apply Now →
            </button>
            
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-6 py-4 inline-block">
              <p className="text-sm md:text-base text-gray-300 mb-1">Applications Close in:</p>
              <div className="text-xl font-mono">
                <span>{timeLeft.hours.toString().padStart(2, '0')}:</span>
                <span>{timeLeft.minutes.toString().padStart(2, '0')}:</span>
                <span>{timeLeft.seconds.toString().padStart(2, '0')}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">Will You Be Cohort #24?</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
