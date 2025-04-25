import { useState, useEffect, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ClipboardList, Phone, UserCheck, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchWebsiteSettings, formatRegistrationCloseDate } from '@/services/websiteSettingsService';
import ResponsiveImage from '../components/ui/ResponsiveImage';
const Process = () => {
  const {
    data: settings,
    isLoading
  } = useQuery({
    queryKey: ['websiteSettings'],
    queryFn: fetchWebsiteSettings
  });

  // Format the application close date
  const formattedCloseDate = useMemo(() => {
    if (isLoading || !settings?.registration_close_date) return 'March 2025';
    return formatRegistrationCloseDate(settings.registration_close_date);
  }, [settings?.registration_close_date, isLoading]);
  return <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-navy text-white relative">
        {/* Background Image */}
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat">
          <ResponsiveImage src={{
          mobile: "/images/hero/process-hero-mobile.webp",
          desktop: "/images/hero/process-hero-desktop.webp"
        }} alt="Luxury villa experience setting" className="h-full w-full object-cover" loading="eager" dynamicKey="process-hero" />
        </div>
      
        {/* Gradient Overlay */}
        <div className="absolute inset-0" style={{
        background: `linear-gradient(to right, 
              rgba(10, 26, 47, 0.95) 0%,
              rgba(10, 26, 47, 0.8) 50%,
              rgba(10, 26, 47, 0.6) 100%
            )`
      }} />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl ">
            <h1 className="md:text-5xl font-playfair mb-6 text-5xl lg:text-6xl">
              It's not special if everyone has it
            </h1>
            <p className="text-gray-300 mb-8 max-w-2xl font-extralight text-left text-lg">
              We make sure you interact with only ambitious, likeminded and interesting people.
            </p>
            
            {/* Application Status */}
            <div className="flex flex-wrap gap-8 items-center">
              <div className="bg-black bg-opacity-30 backdrop-blur-sm rounded-lg p-4">
                <div className="text-sm text-gray-400">Available Seats</div>
                <div className="text-2xl font-mono">
                  {isLoading ? <span className="opacity-50">Loading...</span> : settings?.available_seats || 20}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Applications Close</div>
                <div className="text-xl">
                  {isLoading ? <span className="opacity-50">Loading...</span> : formattedCloseDate}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for? Section - MOBILE OPTIMIZED */}
      <section className="pt-16 md:pt-20 pb-10 md:pb-16 py-[34px] bg-stone-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-playfair text-navy mb-6 md:mb-8 text-center md:text-5xl">
              Who is this for?
            </h2>
            
            <div className="mb-12 md:mb-16">
              <p className="text-xl text-gray-600 italic mb-8 md:mb-12 text-center max-w-2xl mx-auto">
                This is not for everyone. But if you are the right fit, you will know.
              </p>

              <div className="grid md:grid-cols-2 gap-4 md:gap-8 ">
                <div className="space-y-4 md:space-y-8">
                  <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
                    <div className="flex items-start gap-3 md:gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      <p className="leading-relaxed text-base md:text-lg text-gray-200">You have big ideas and ambitious goals, but you need the right people around you to refine, validate, and discuss them with.</p>
                    </div>
                  </div>

                  <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
                    <div className="flex items-start gap-3 md:gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      <p className="leading-relaxed text-base md:text-lg text-gray-200">You believe in execution over excuses. You are not here for inspiration; you are here to contribute and collaborate with your own unique perspective.</p>
                    </div>
                  </div>

                  <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
                    <div className="flex items-start gap-3 md:gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      <p className="leading-relaxed text-base md:text-lg text-gray-200">You don't follow trends; you create them. Whether you are or aim to be an entrepreneur, investor, or innovator, you want to be in a space where you are encouraged and assisted.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 md:space-y-8">
                  <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
                    <div className="flex items-start gap-3 md:gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      <p className="leading-relaxed text-base md:text-lg text-gray-200">You seek deep conversations, meaningful connections, and experiences that shift your perspective and elevate your journey.</p>
                    </div>
                  </div>

                  <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow bg-slate-900 py-[36px]">
                    <div className="flex items-start gap-3 md:gap-4">
                      <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                      <p className="leading-relaxed text-base md:text-lg text-gray-200">You understand the power of a strong network. You are here to meet driven individuals who challenge and expand your thinking.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12 md:mb-20">
              <h3 className="font-playfair text-navy mb-6 md:mb-8 text-center text-3xl md:text-5xl">Who this is 'not' for?</h3>
              
              <div className="grid md:grid-cols-2 gap-4 md:gap-8 my-[51px] r px-0 py-0">
                <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow my-0 py-[35px] bg-slate-900">
                  <div className="flex items-start gap-3 md:gap-4">
                    <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                    <p className="leading-relaxed text-base md:text-lg font-normal text-gray-200">Those looking for a solo experience. </p>
                  </div>
                </div>

                <div className="shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow py-[35px] bg-slate-900">
                  <div className="flex items-start gap-3 md:gap-4">
                    <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                    <p className="leading-relaxed text-base md:text-lg text-gray-200">Anyone with a passive approach.</p>
                  </div>
                </div>

                <div className="md:col-span-2 shadow-sm rounded-lg p-5 md:p-6 hover:shadow-md transition-shadow py-[35px] bg-slate-900">
                  <div className="flex items-start gap-3 md:gap-4">
                    <Check className="text-terracotta mt-1 flex-shrink-0 w-5 h-5 md:w-6 md:h-6" />
                    <p className="leading-relaxed text-base md:text-lg px-0 text-gray-200">Those who are not open to exploring new ideas, values or perspectives.</p>
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
          <h2 className="text-3xl font-playfair text-navy mb-12 text-center md:text-5xl">
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
                Fill out the Registration form - The registration form allows us to confirm your identity, and help us assess whether we will be able to add value to your life.
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
          <div className="mt-12 text-center text-sm text-gray-500">Your data is 100% secure. Not selected? You will get priority access in future bootcamps.</div>
        </div>
      </section>

      <Footer />
    </div>;
};
export default Process;