
import { useRef } from 'react';
import { Calendar, Users, BookOpen, Coffee, Brain, Heart, Code, FileCheck, ChefHat } from 'lucide-react';
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

  const peers = [
    { title: "The Visionary", description: "Sees possibilities others don't" },
    { title: "The Hustler", description: "Gets things done, period" },
    { title: "The Workaholic", description: "Lives and breathes excellence" },
    { title: "The Experienced", description: "Been there, done that" },
    { title: "The Optimist", description: "Finds silver linings" },
    { title: "The Guardian", description: "Keeps the ship steady" },
  ];

  const depthFeatures = [
    { icon: <Code className="w-6 h-6" />, title: "Ingrained House Code", description: "Crafted house rules to boost engagement, clarity of thought and productivity" },
    { icon: <Brain className="w-6 h-6" />, title: "Startup Simulations", description: "Building a startup from ground up in a team environment" },
    { icon: <BookOpen className="w-6 h-6" />, title: "Learning Experience", description: "Business Knowledge is not even a unique proposition, its a given" },
    { icon: <FileCheck className="w-6 h-6" />, title: "Curated frameworks & templates", description: "Carefully crafted Frameworks for personal and career growth" },
    { icon: <Users className="w-6 h-6" />, title: "Group Think", description: "Collaborative thinking and team activities to broaden your perspective" },
    { icon: <Heart className="w-6 h-6" />, title: "Lifelong memories", description: "Feel amazing while on the grind" },
    { icon: <ChefHat className="w-6 h-6" />, title: "Great Food, Good Coffee and more", description: "Caffeine is the secret of my energy" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
              Condensing lifelong memories, lessons, and friendships in a week.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              20 people. 7 days. 1 life-changing experience
            </p>
            <a href="/apply" className="text-sm italic underline text-terracotta hover:text-opacity-80 transition-colors">
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

      {/* Tribe Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">Your Tribe Awaits</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {peers.map((peer, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full overflow-hidden" />
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
          <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12">Designed for Depth</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {depthFeatures.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="text-terracotta">{feature.icon}</div>
                <div>
                  <h3 className="font-medium text-navy mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
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
