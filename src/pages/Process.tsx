
import { useState, useEffect, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ClipboardList, Phone, UserCheck, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

// This should match the same fetch function used in Pricing
const fetchApplicationData = async () => {
  // This would be replaced with an actual API call
  return {
    spotsRemaining: 20,
    applicationCloseDate: new Date('2025-03-31') // March 2025
  };
};

const Process = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['applicationData'],
    queryFn: fetchApplicationData
  });
  
  // Format the application close date
  const formattedCloseDate = useMemo(() => {
    if (!data?.applicationCloseDate) return 'March 2025';
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(data.applicationCloseDate);
  }, [data?.applicationCloseDate]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy text-white relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb')`,
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
              It's not special if everyone has it
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              We make sure you interact with only ambitious, likeminded and interesting people.
            </p>
            
            {/* Application Status */}
            <div className="flex flex-wrap gap-8 items-center">
              <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm text-gray-400">Available Seats</div>
                <div className="text-2xl font-mono">
                  {isLoading ? (
                    <span className="opacity-50">Loading...</span>
                  ) : (
                    data?.spotsRemaining || 20
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Applications Close</div>
                <div className="text-xl">
                  {isLoading ? (
                    <span className="opacity-50">Loading...</span>
                  ) : (
                    formattedCloseDate
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for? Section */}
      <section className="pt-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-8 text-center">
              Who is this for?
            </h2>
            
            <div className="mb-16">
              <p className="text-xl text-gray-600 italic mb-12 text-center max-w-2xl mx-auto">
                This is not for everyone. But if you are the right fit, you will know.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-6 h-6" />
                      <p className="text-gray-700 leading-relaxed text-lg">
                        You have big ideas and ambitious goals, but you need the right people around you to refine, validate, and scale them.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-6 h-6" />
                      <p className="text-gray-700 leading-relaxed text-lg">
                        You believe in execution over excuses. You are not here for inspiration; you are here to build, collaborate, and accelerate.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-6 h-6" />
                      <p className="text-gray-700 leading-relaxed text-lg">
                        You don't follow trends; you create them. Whether you are an entrepreneur, investor, or innovator, you want to be in a space where real things happen.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-6 h-6" />
                      <p className="text-gray-700 leading-relaxed text-lg">
                        You seek deep conversations, meaningful connections, and experiences that shift your perspective and elevate your journey.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-6 h-6" />
                      <p className="text-gray-700 leading-relaxed text-lg">
                        You understand the power of a strong network. You are here to meet driven individuals who challenge and expand your thinking.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-20">
              <h3 className="text-3xl md:text-4xl font-playfair text-navy mb-8 text-center">
                Who this is not for:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Check className="text-terracotta mt-1 flex-shrink-0 w-6 h-6" />
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Those looking for a typical networking event.
                    </p>
                  </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Check className="text-terracotta mt-1 flex-shrink-0 w-6 h-6" />
                    <p className="text-gray-700 leading-relaxed text-lg">
                      Anyone expecting a passive experience.
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <Check className="text-terracotta mt-1 flex-shrink-0 w-6 h-6" />
                    <p className="text-gray-700 leading-relaxed text-lg">
                      People who are just exploring—this is for doers, not spectators.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="pt-8 pb-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">
            The Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1: Apply */}
            <div className="bg-white p-8 rounded-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium">
                  1
                </div>
                <h3 className="text-xl font-medium text-navy">Apply</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Fill out the Registration form - The registration form allows us to confirm your identity, and help us assess whether we believe we will be able to add value to your life.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-terracotta" />
                  <span>Personal Details</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-terracotta" />
                  <span>LinkedIn Profile</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-terracotta" />
                  <span>Vision Statement</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                We encourage group applications with 1-2 friends. Only 1 registration is needed for friend groups.
              </p>
            </div>

            {/* Step 2: Screening Call */}
            <div className="bg-white p-8 rounded-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium">
                  2
                </div>
                <h3 className="text-xl font-medium text-navy">Screening Call</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Have a brief conversation - A Fraterny counselor will contact you to have a friendly conversation after your form is shortlisted. Only thing that matters the most is authentic responses from your end.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone size={16} className="text-terracotta" />
                <span>15 Minutes</span>
              </div>
            </div>

            {/* Step 3: Join */}
            <div className="bg-white p-8 rounded-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-medium">
                  3
                </div>
                <h3 className="text-xl font-medium text-navy">Join</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Welcome to the Ecosystem - We will send you a confirmation email for your acceptance in Fraterny.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-terracotta" />
                  <span>Applying with friends?</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Check size={16} className="text-terracotta" />
                  <span>Group applications welcome</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-12 text-center text-sm text-gray-500">
            Your data is 100% secure. Not selected? Get priority access for 2025 cohorts.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Process;
