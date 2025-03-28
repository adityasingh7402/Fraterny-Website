import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Check, Users, Hotel, Coffee, Award } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { fetchWebsiteSettings, formatRegistrationCloseDate } from '@/services/websiteSettingsService';

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
          <Check size={18} className="text-terracotta flex-shrink-0" />
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

// Lazy load lower sections for better initial performance
const LowerSections = lazy(() => import('../components/pricing/LowerSections'));

const Pricing = () => {
  // Fetch website settings for the dynamic content
  const { data: settings, isLoading } = useQuery({
    queryKey: ['websiteSettings'],
    queryFn: fetchWebsiteSettings
  });
  
  // Prepare pricing data with dynamic values
  const prices = {
    insiderAccess: "₹499/month",
    mainExperience: "₹45,000 - ₹60,000",
    executiveEscape: "₹1,50,000+",
    spotsRemaining: isLoading ? "--" : settings?.available_seats || 5,
    closeDate: isLoading ? "March 2025" : formatRegistrationCloseDate(settings?.registration_close_date || '2025-03-31')
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section className="pt-32 pb-16 bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&q=75&w=1920"
            alt="Luxury Work-Vacation Setting"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair mb-4 sm:mb-6">
              Choose Your Experience
            </h1>
            <p className="text-lg sm:text-xl text-gray-300">
              Each offering is designed for a different kind of individual. Find the one that fits you best.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
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

      <Suspense fallback={<div className="h-64 flex items-center justify-center">Loading...</div>}>
        <LowerSections 
          APPLICATION_FORM_URL={APPLICATION_FORM_URL}
          EXECUTIVE_ESCAPE_MAIL={EXECUTIVE_ESCAPE_MAIL}
          prices={prices}
        />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Pricing;
