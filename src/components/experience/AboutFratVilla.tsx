import React from 'react';

const features = [
    {
      title: "Creates an Optimized Environment:",
      description: "The Fratvilla group is carefully selected based on the harmony, diversity, and thinking depth of their Quest results, ensuring a dynamic and supportive environment for all attendees."
    },
    {
      title: "Instills the Psychology of Success:",
      description: "Through a series of specially designed activities and the application of our \"Fratrules,\" you'll learn to embody the mindset of a high-achiever."
    },
    {
      title: "Fosters Genuine Connection:",
      description: "Fratvilla is designed to maximize personal growth and bonding, creating a powerful network of ambitious individuals who will support you long after the experience is over."
    }
  ];

const AboutFratVilla = () => {
  return (
    <section className="py-4 md:py-8 bg-gradient-to-br from-cyan-700 to-blue-900  ">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
            <h2 
                className="section-header mb-6 text-white"
            >
                About FratVilla
            </h2>
            
            <p 
                className="section-p mb-8 text-white"
            >
                Fratvilla is our exclusive, hyper-luxurious 6-day experience for 20 ambitious 
                individuals in a secret villa. It's an immersive, real-world application of the 
                principles discovered through Quest, where you'll be surrounded by a curated 
                group of like-minded peers.
            </p>

            {/* <h2 
                className="section-header mb-2 text-white"
            >
                What FratVilla Does
            </h2> */}

            <section className=" lg:py-8 md:py-0 md:px-0 lg:px-4 lg:backdrop-blur-md lg:bg-gradient-to-br lg:from-cyan-700 lg:to-blue-900 rounded-xl lg:shadow-2xl lg:hover:shadow-lg">
                <div className="container mx-auto px-0">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 
                className="section-header mb-2 text-white"
            >
                What FratVilla Does
            </h2>

                    {/* Feature Boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        {features.map((feature, index) => (
                        <div 
                            key={index}
                            className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 text-left border border-white/20 shadow-xl hover:bg-white/20 hover:border-white/30 hover:shadow-2xl transition-all duration-300 "
                        >
                            <h3 
                            className="text-xl md:text-2xl lg:text-3xl font-['Gilroy-Bold'] text-neutral-100 sm:h-16 md:h-28 lg:h-24 lg:mb-4"
                            >
                            {feature.title}
                            </h3>
                            <p 
                            className="text-lg font-['Gilroy-Regular'] md:text-xl lg:text-xl text-white mt-4"
                            >
                            {feature.description}
                            </p>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
            </section>

        </div>
      </div>
    </section>
  );
};

export default AboutFratVilla;