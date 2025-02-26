
import { ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      title: "Apply",
      description: "Submit your profile",
      icon: "📝"
    },
    {
      title: "Screen",
      description: "A brief conversation with a councilor",
      icon: "🤝"
    },
    {
      title: "Join",
      description: "Welcome to the community",
      icon: "🎉"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-playfair text-navy text-center mb-16">
          How It Works
        </h2>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 text-4xl">{step.icon}</div>
                <h3 className="text-2xl font-playfair text-navy mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute transform translate-x-full translate-y-10">
                    <ArrowRight className="text-terracotta" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
