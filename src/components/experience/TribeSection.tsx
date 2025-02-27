
import React from 'react';

// CUSTOMIZATION: Peer Profile Images and Descriptions
// Modify this array to change the peer profiles
// Each peer has: title, description, and profile image URL
// Current images show various people in professional/creative settings
const peers = [
  { 
    title: "The Visionary", 
    description: "Sees possibilities others don't",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&q=80&w=400"
  },
  { 
    title: "The Hustler", 
    description: "Gets things done, period",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&q=80&w=400"
  },
  { 
    title: "The Workaholic", 
    description: "Lives and breathes excellence",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&q=80&w=400"
  },
  { 
    title: "The Experienced", 
    description: "Been there, done that",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&q=80&w=400"
  },
  { 
    title: "The Optimist", 
    description: "Finds silver linings",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&q=80&w=400"
  },
  { 
    title: "The Guardian", 
    description: "Keeps the ship steady",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&q=80&w=400"
  }
];

const TribeSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* CUSTOMIZATION: Tribe Section Title */}
        <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">Your Tribe Awaits</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {peers.map((peer, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                <img 
                  src={peer.image} 
                  alt={peer.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="font-medium text-navy mb-2">{peer.title}</h3>
              <p className="text-gray-600 text-sm">{peer.description}</p>
            </div>
          ))}
        </div>
        
        {/* CUSTOMIZATION: Tribe Section Tagline */}
        <p className="text-center text-lg text-gray-600">
          Divided by Circumstance, United by Fraterny
        </p>
      </div>
    </section>
  );
};

export default TribeSection;
