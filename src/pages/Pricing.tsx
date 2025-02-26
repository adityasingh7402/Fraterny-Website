
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Check, Users, Hotel, Coffee, Award } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';

const fetchPrices = async () => {
  return {
    insiderAccess: "₹499/month",
    mainExperience: "₹45,000 - ₹60,000",
    executiveEscape: "₹1,50,000+",
    spotsRemaining: 5
  };
};

const APPLICATION_FORM_URL = "https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit";
const LEARN_MORE_URL = "https://docs.google.com/forms/d/1lJIJPAbR3BqiLNRdRHsCdRrUpuulDYPVGdYN34Th840/edit";
const EXECUTIVE_ESCAPE_MAIL = "mailto:support@fraterny.com?subject=Exclusive%20Escape%20Inquiry";

const PricingTier = ({ 
  name, 
  price, 
  features, 
  ctaText, 
  ctaLink, 
  isPopular = false,
  className = ""
}) => (
  <div className={`p-6 rounded-xl border ${isPopular ? 'border-terracotta shadow-lg scale-105' : 'border-gray-200'} bg-white ${className}`}>
    {isPopular && (
      <Badge variant="secondary" className="mb-4 bg-terracotta text-white">
        Most Popular
      </Badge>
    )}
    <h3 className="text-xl font-playfair font-bold mb-2">{name}</h3>
    <div className="mb-6">
      <span className="text-2xl font-bold">{price}</span>
    </div>
    <ul className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2">
          <Check size={18} className="text-terracotta" />
          <span className="text-gray-600">{feature}</span>
        </li>
      ))}
    </ul>
    <a
      href={ctaLink}
      target="_blank"
      rel="noopener noreferrer"
      className={`block text-center py-2 px-4 rounded-lg transition-colors ${
        isPopular 
          ? 'bg-terracotta text-white hover:bg-opacity-90' 
          : 'border border-navy text-navy hover:bg-navy hover:text-white'
      }`}
    >
      {ctaText}
    </a>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="flex gap-4 items-start">
    <div className="p-2 rounded-full bg-navy/5">
      <Icon size={24} className="text-navy" />
    </div>
    <div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  </div>
);

const Pricing = () => {
  const { data: prices = {
    insiderAccess: "Loading...",
    mainExperience: "Loading...",
    executiveEscape: "Loading...",
    spotsRemaining: "--"
  }} = useQuery({
    queryKey: ['prices'],
    queryFn: fetchPrices,
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            alt="Luxury Work-Vacation Setting"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair mb-6">
              Choose Your Experience
            </h1>
            <p className="text-xl text-gray-300">
              Each offering is designed for a different kind of individual. Find the one that fits you best.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <PricingTier
              name="Insider Access"
              price={prices.insiderAccess}
              features={[
                "Digital Content Only",
                "Digital Resources",
                "No Community Access",
                "No Accommodation",
                "No Dining & Activities"
              ]}
              ctaText="Learn More"
              ctaLink={LEARN_MORE_URL}
            />
            <PricingTier
              name="The Main Experience"
              price={prices.mainExperience}
              features={[
                "In-Person Retreat",
                "Exclusive Cohort (20 People)",
                "Interactive & Hands-on Workshops",
                "Shared 10+BHK Luxury Villa",
                "Gourmet Meals and Group Activities",
                "Lifetime access to the exclusive Fraterny Community"
              ]}
              ctaText="Apply Now"
              ctaLink={APPLICATION_FORM_URL}
              isPopular={true}
            />
            <PricingTier
              name="Executive Escape"
              price={prices.executiveEscape}
              features={[
                "Private Luxury Experience",
                "8-10 People Only",
                "Complete Flexibility",
                "Private Master Bedrooms",
                "Exclusive Networking",
                "Personalized Gourmet Meals"
              ]}
              ctaText="Apply for Consideration"
              ctaLink={EXECUTIVE_ESCAPE_MAIL}
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-playfair mb-4">The Ultimate 7-Day Retreat</h2>
            <p className="text-xl text-gray-600 mb-12">
              Curated experiences, deep conversations, and a high-value network that will stay with you for life.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <FeatureCard
                icon={Users}
                title="Curated Group"
                description="Small, highly curated group of 20 individuals"
              />
              <FeatureCard
                icon={Hotel}
                title="Luxury Stay"
                description="Luxury villa stay with gourmet meals"
              />
              <FeatureCard
                icon={Coffee}
                title="High-Impact Sessions"
                description="Workshops, simulations, and strategy sessions"
              />
              <FeatureCard
                icon={Award}
                title="Premium Access"
                description="Direct access to frameworks and templates"
              />
            </div>

            <div className="text-center">
              <a
                href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
              >
                Apply Now
              </a>
              <p className="text-sm text-gray-600">
                Currently accepting applications for March 2025
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-playfair mb-4">
              Private, High-Level Conversations
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              No structured sessions, no group activities – just a space for networking and deep discussions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <FeatureCard
                icon={Users}
                title="Exclusive Group"
                description="Limited to 8-10 high-level individuals per villa"
              />
              <FeatureCard
                icon={Hotel}
                title="Private Rooms"
                description="Private rooms in a luxury villa"
              />
              <FeatureCard
                icon={Coffee}
                title="Flexible Schedule"
                description="No structured workshops - pure networking"
              />
              <FeatureCard
                icon={Award}
                title="Elite Access"
                description="Invitation-only experience"
              />
            </div>

            <div className="text-center">
              <a
                href={EXECUTIVE_ESCAPE_MAIL}
                className="inline-block px-8 py-3 border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-lg transition-colors"
              >
                Apply for Consideration
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-playfair mb-4">
              Limited Spots, Lifetime Impact
            </h2>
            <p className="text-xl mb-8">
              We keep the group small and highly curated. If you're ready to experience a network that will change your trajectory, apply now.
            </p>
            <a
              href={APPLICATION_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-colors mb-4"
            >
              Apply Now
            </a>
            <p className="text-sm text-gray-300">
              Only {prices.spotsRemaining} spots remaining
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
