
import { Send, UserCheck, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      title: "Apply",
      description: "Submit your profile",
      icon: Send,
    },
    {
      title: "Screen",
      description: "A brief conversation with a counselor",
      icon: UserCheck,
    },
    {
      title: "Join",
      description: "Welcome to the community",
      icon: Users,
    }
  ];

  return (
    <section className="py-20 bg-white mb-20"> {/* Increased overall padding and added bottom margin */}
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-navy mb-16"> {/* Increased bottom margin */}
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto"> {/* Increased max width from 4xl to 5xl */}
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {steps.map((Step, index) => (
              <div key={index} className="text-center">
                <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-navy text-white"> {/* Increased icon size and margin */}
                  <Step.icon size={32} /> {/* Increased icon size from 24 to 32 */}
                </div>
                <h3 className="text-2xl font-medium text-navy mb-3">{Step.title}</h3> {/* Increased text size from xl to 2xl */}
                <p className="text-lg text-gray-600">{Step.description}</p> {/* Increased text size */}
              </div>
            ))}
          </div>
          
          {/* Added Know More button with hover animation */}
          <div className="flex justify-center mt-16">
            <Link 
              to="/process" 
              className="px-6 py-3 bg-navy text-white rounded-lg transition-all duration-300 hover:bg-terracotta hover:scale-105 hover:shadow-lg"
            >
              Know More
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
