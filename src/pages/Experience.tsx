
import { useRef } from 'react';
import { Calendar, Users, BookOpen, Coffee, Brain, Heart, Code, FileCheck, ChefHat, Users2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Experience = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  const timelineEvents = [
    { time: "11:30 AM", title: "Brainstorming Breakfasts", description: "Start your day with engaging discussions" },
    { time: "1:00 PM", title: "Team Activity Afternoons", description: "Collaborative sessions and workshops" },
    { time: "6:00 PM", title: "Simulation Sunsets", description: "Apply learnings in practical scenarios" },
    { time: "12:00 AM", title: "Midnight Momentum", description: "Deep conversations and connections" },
  ];

  const experienceImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb", // body of water surrounded by trees
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05", // foggy mountain summit
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21", // ocean wave at beach
    "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151", // photo of desert sand
    "https://images.unsplash.com/photo-1501854140801-50d01698950b", // bird's eye view of green mountains
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625", // white concrete building
  ];

  const peers = [
    { 
      title: "The Visionary", 
      description: "Sees possibilities others don't",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
    },
    { 
      title: "The Hustler", 
      description: "Gets things done, period",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    },
    { 
      title: "The Workaholic", 
      description: "Lives and breathes excellence",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    },
    { 
      title: "The Experienced", 
      description: "Been there, done that",
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
    },
    { 
      title: "The Optimist", 
      description: "Finds silver linings",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
    },
    { 
      title: "The Guardian", 
      description: "Keeps the ship steady",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    }
  ];

  const depthFeatures = [
    { icon: <Code className="w-6 h-6" />, title: "Ingrained House Code", description: "Crafted house rules to boost engagement, clarity of thought and productivity" },
    { icon: <Brain className="w-6 h-6" />, title: "Startup Simulations", description: "Building a startup from ground up in a team environment" },
    { icon: <BookOpen className="w-6 h-6" />, title: "Learning Experience", description: "Business Knowledge is not even a unique proposition, its a given" },
    { icon: <FileCheck className="w-6 h-6" />, title: "Curated frameworks & templates", description: "Carefully crafted Frameworks for personal and career growth" },
    { icon: <Users className="w-6 h-6" />, title: "Group Think", description: "Collaborative thinking and team activities to broaden your perspective" },
    { icon: <Heart className="w-6 h-6" />, title: "Lifelong memories", description: "Feel amazing while on the grind" },
    { icon: <ChefHat className="w-6 h-6" />, title: "Great Food, Good Coffee and more", description: "Caffeine is the secret of my energy" },
    { icon: <Users2 className="w-6 h-6" />, title: "Post Program Community", description: "Fraterny is not a one week experience, it is a constantly growing ecosystem." },
    { icon: <Brain className="w-6 h-6" />, title: "Soft Skills", description: "Critical Thinking, Effective Communication and Empathy. Everyone has principles, no one offers practice" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy text-white relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1439337153520-7082a56a81f4')`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, 
              rgba(10, 26, 47, 0.95) 0%,
              rgba(10, 26, 47, 0.8) 50%,
              rgba(10, 26, 47, 0.6) 100%
            )`
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
              Condensing lifelong memories, lessons, and friendships in a week.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              20 people. 7 days. 1 life-changing experience
            </p>
            <a 
              href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm italic underline text-terracotta hover:text-opacity-80 transition-colors"
            >
              See if you fit →
            </a>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white" ref={timelineRef}>
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-4">A Day in the Villa</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            We create the perfect conditions for you to have the most insightful conversations, amazing memories and take action towards your goals
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timelineEvents.map((event, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="text-terracotta font-mono mb-2">{event.time}</div>
                <h3 className="font-medium text-navy mb-2">{event.title}</h3>
                <p className="text-gray-600 text-sm">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Images Section - New Section */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {experienceImages.map((image, index) => (
            <div key={index} className="aspect-[4/3] w-full">
              <img 
                src={image} 
                alt={`Experience moment ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Tribe Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">Your Tribe Awaits</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {peers.map((peer, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden">
                  <img 
                    src={peer.image} 
                    alt={peer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-medium text-navy mb-2">{peer.title}</h3>
                <p className="text-gray-600 text-sm">{peer.description}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-lg text-gray-600">
            Divided by Circumstance, United by Fraterny
          </p>
        </div>
      </section>

      {/* Depth Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">Designed for Depth</h2>
          
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
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Experience;
