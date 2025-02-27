
import React from 'react';
import { Code, Brain, BookOpen, FileCheck, Users, Heart, ChefHat, Users2 } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

const depthFeatures = [
  { 
    icon: <Code className="w-6 h-6" />, 
    title: "Ingrained House Code", 
    description: "Crafted house rules to boost engagement, clarity of thought and productivity",
    imageSrc: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Workspace with modern laptop"
  },
  { 
    icon: <Brain className="w-6 h-6" />, 
    title: "Startup Simulations", 
    description: "Building a startup from ground up in a team environment",
    imageSrc: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Person using laptop in creative space"
  },
  { 
    icon: <BookOpen className="w-6 h-6" />, 
    title: "Learning Experience", 
    description: "Business Knowledge is not even a unique proposition, its a given",
    imageSrc: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Code on computer screen"
  },
  { 
    icon: <FileCheck className="w-6 h-6" />, 
    title: "Curated frameworks & templates", 
    description: "Carefully crafted Frameworks for personal and career growth",
    imageSrc: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Organized workspace with notebooks"
  },
  { 
    icon: <Users className="w-6 h-6" />, 
    title: "Group Think", 
    description: "Collaborative thinking and team activities to broaden your perspective",
    imageSrc: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Team collaboration session"
  },
  { 
    icon: <Heart className="w-6 h-6" />, 
    title: "Lifelong memories", 
    description: "Feel amazing while on the grind",
    imageSrc: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Friends enjoying a moment together"
  },
  { 
    icon: <ChefHat className="w-6 h-6" />, 
    title: "Great Food, Good Coffee and more", 
    description: "Caffeine is the secret of my energy",
    imageSrc: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Coffee cup on wooden table"
  },
  { 
    icon: <Users2 className="w-6 h-6" />, 
    title: "Post Program Community", 
    description: "Fraterny is not a one week experience, it is a constantly growing ecosystem.",
    imageSrc: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Community gathering"
  },
  { 
    icon: <Brain className="w-6 h-6" />, 
    title: "Soft Skills", 
    description: "Critical Thinking, Effective Communication and Empathy. Everyone has principles, no one offers practice",
    imageSrc: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    imageAlt: "People discussing ideas"
  },
];

const DepthSection = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">
          Designed for Depth
        </h2>
        
        {isMobile ? (
          <div className="space-y-6">
            {depthFeatures.map((feature, index) => (
              <React.Fragment key={index}>
                <div 
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-terracotta bg-opacity-10 p-4 rounded-full mb-4">
                    <div className="text-terracotta">{feature.icon}</div>
                  </div>
                  <h3 className="font-medium text-navy text-lg mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                
                <div className="aspect-[16/9] w-full overflow-hidden rounded-xl shadow-md">
                  <img 
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {depthFeatures.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="bg-terracotta bg-opacity-10 p-4 rounded-full mb-4">
                  <div className="text-terracotta">{feature.icon}</div>
                </div>
                <h3 className="font-medium text-navy text-lg mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default DepthSection;
