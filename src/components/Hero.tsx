
import { useState, useEffect } from 'react';

const Hero = () => {
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    const targetDate = new Date('2024-12-31');
    const calculateDaysLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      if (difference > 0) {
        setDaysLeft(Math.floor(difference / (1000 * 60 * 60 * 24)));
      }
    };
    calculateDaysLeft();
  }, []);

  return <section className="min-h-screen flex items-center justify-center bg-navy text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1472396961693-142e6e269027')`
    }} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0" style={{
      background: `linear-gradient(to right, 
            rgba(10, 26, 47, 0.95) 0%,
            rgba(10, 26, 47, 0.8) 50%,
            rgba(10, 26, 47, 0.6) 100%
          )`
    }} />
      
      <div className="container px-6 py-32 mx-auto relative z-10">
        <div className="animate-fade-down max-w-2xl flex flex-col gap-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold tracking-tight mb-4">
              Where Ambition
              <br />
              Finds Its Tribe
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200">
              Authenticity, Community, Growth, and Shared Aspirations
            </p>
          </div>

          <div className="animate-fade-up flex flex-col gap-8">
            <a href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all text-lg font-medium w-fit">
              Claim your spot →
            </a>
            
            <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg px-6 py-4 inline-block w-fit">
              <p className="text-sm md:text-base text-gray-300 mb-1">Registrations close in:</p>
              <div className="text-xl font-mono">
                {daysLeft} Days
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};

export default Hero;
