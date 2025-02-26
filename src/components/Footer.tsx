import { Instagram, Linkedin, Twitter } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <a href="/" className="block">
              <img src="/lovable-uploads/ffcba562-8c6d-44dc-8607-53afc45d3a57.png" alt="Fraternity Logo" className="h-8 brightness-0 invert" />
            </a>
            <p className="text-gray-400">Shared Aspirations</p>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Navigate</h3>
            <ul className="space-y-2">
              <li><a href="/experience" className="text-gray-400 hover:text-white transition-colors">Experience</a></li>
              <li><a href="/process" className="text-gray-400 hover:text-white transition-colors">Process</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-start">
            <a href="/apply" className="px-8 py-3 bg-white text-navy rounded-lg hover:bg-opacity-90 transition-colors font-medium">
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;