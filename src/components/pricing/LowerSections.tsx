
import { Users, Hotel, Coffee, Award } from 'lucide-react';

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

const LowerSections = ({ APPLICATION_FORM_URL, EXECUTIVE_ESCAPE_MAIL, prices }) => {
  return (
    <>
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-3 sm:mb-4">The Ultimate 7-Day Retreat</h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12">
              Curated experiences, deep conversations, and a high-value network that will stay with you for life.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
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
                href={APPLICATION_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 sm:px-6 py-2 sm:py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
              >
                Apply Now
              </a>
              <p className="text-sm text-gray-600 mt-4">
                Currently accepting applications for {prices.acceptingApplicationsFor || 'February 2026'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-3 sm:mb-4">
              Private, High-Level Conversations
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12">
              No structured sessions, no group activities – just a space for networking and deep discussions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
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
                className="inline-block px-6 sm:px-8 py-2 sm:py-3 border-2 border-navy text-navy hover:bg-navy hover:text-white rounded-lg transition-colors"
              >
                Apply for Consideration
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-navy text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair mb-3 sm:mb-4">
              Limited Spots, Lifetime Impact
            </h2>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8">
              We keep the group small and highly curated. If you're ready to experience a network that will change your trajectory, apply now.
            </p>
            <a
              href={APPLICATION_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-colors mb-4"
            >
              Apply Now
            </a>
            <p className="text-sm text-gray-300">
              Only {prices.spotsRemaining} spots remaining
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LowerSections;
