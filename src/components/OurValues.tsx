
import React from 'react';

const OurValues = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-10">
          Our Values
        </h2>
        
        <div className="max-w-5xl mx-auto">
          <p className="text-lg md:text-xl text-navy/80 leading-relaxed mb-14 max-w-3xl">
            Fraterny is built on the belief that success is accelerated through the right community. We unite the most driven, high-potential entrepreneurs in a lifelong network focused on incubation, mentorship, and continuous learning. By fostering deep relationships, real-world collaboration, and a culture of shared ambition, Fraterny empowers its members to think bigger, execute faster, and build the future together.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group flex flex-col items-center p-5 hover:bg-gray-50 rounded-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center mb-6 group-hover:bg-navy/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A1A2F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"></path>
                  <path d="M12 7V3"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-navy mb-4 text-center">Community-Driven</h3>
              <p className="text-navy/70 leading-relaxed text-center">Success thrives in environments where ambition meets collaboration and support.</p>
            </div>
            
            <div className="group flex flex-col items-center p-5 hover:bg-gray-50 rounded-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center mb-6 group-hover:bg-terracotta/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E07A5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
                  <path d="M12 13v8"></path>
                  <path d="M12 3v3"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-navy mb-4 text-center">Lifelong Learning</h3>
              <p className="text-navy/70 leading-relaxed text-center">Continuous growth through mentorship, real-world challenges, and shared knowledge.</p>
            </div>
            
            <div className="group flex flex-col items-center p-5 hover:bg-gray-50 rounded-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-navy mb-4 text-center">Shared Ambition</h3>
              <p className="text-navy/70 leading-relaxed text-center">Building the future together by thinking bigger and executing faster.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurValues;
