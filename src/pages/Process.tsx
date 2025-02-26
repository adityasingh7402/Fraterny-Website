import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { ClipboardList, Phone, UserCheck, Check } from 'lucide-react';

const Process = () => {
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
                <div className="text-2xl font-mono">20</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Applications Close</div>
                <div className="text-xl">March 2025</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for? Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-playfair text-navy mb-12 text-center">
              Who is this for?
            </h2>
            
            <div className="mb-16">
              <p className="text-lg text-gray-600 italic mb-8 text-center">
                This is not for everyone. But if you are the right fit, you will know.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <Check className="text-terracotta mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    You have big ideas and ambitious goals, but you need the right people around you to refine, validate, and scale them.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="text-terracotta mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    You believe in execution over excuses. You are not here for inspiration; you are here to build, collaborate, and accelerate.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="text-terracotta mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    You don't follow trends; you create them. Whether you are an entrepreneur, investor, or innovator, you want to be in a space where real things happen.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="text-terracotta mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    You seek deep conversations, meaningful connections, and experiences that shift your perspective and elevate your journey.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="text-terracotta mt-1 flex-shrink-0" />
                  <p className="text-gray-700">
                    You understand the power of a strong network. You are here to meet driven individuals who challenge and expand your thinking.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-playfair text-navy mb-6">
                Who this is not for:
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-terracotta rounded-full"></div>
                  <p className="text-gray-700">Those looking for a typical networking event.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-terracotta rounded-full"></div>
                  <p className="text-gray-700">Anyone expecting a passive experience.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-terracotta rounded-full"></div>
                  <p className="text-gray-700">People who are just exploring—this is for doers, not spectators.</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-lg text-gray-700 mb-6">
                If this sounds like you, apply now. The right people are waiting.
              </p>
              <a
                href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
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
                Have a brief conversation - A Fraterny councilor will contact you to have a friendly conversation after your form is shortlisted. Only thing that matters the most is authentic responses from your end.
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
