
import { Send, UserCheck, Users } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Apply",
      description: "Submit your profile",
      icon: Send,
    },
    {
      title: "Screen",
      description: "A brief conversation with a councilor",
      icon: UserCheck,
    },
    {
      title: "Join",
      description: "Welcome to the community",
      icon: Users,
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12">
          How It Works
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((Step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-navy text-white">
                  <Step.icon size={24} />
                </div>
                <h3 className="text-xl font-medium text-navy mb-2">{Step.title}</h3>
                <p className="text-gray-600">{Step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
