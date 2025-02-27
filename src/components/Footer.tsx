
import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <a href="/" className="block">
              <img src="/lovable-uploads/ffcba562-8c6d-44dc-8607-53afc45d3a57.png" alt="Fraternity Logo" className="h-8 brightness-0 invert" />
            </a>
            <p className="text-gray-400">Shared Ambitions</p>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Navigate</h3>
            <ul className="space-y-2">
              <li><a href="/experience" className="text-gray-400 hover:text-white transition-colors">Experience</a></li>
              <li><a href="/process" className="text-gray-400 hover:text-white transition-colors">Process</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-medium mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://www.instagram.com/join.fraterny/?hl=en" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-colors" style={{
              background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
            }}>
                <Instagram size={20} color="white" />
              </a>
              <a href="https://x.com/frat_erny" target="_blank" rel="noopener noreferrer" className="bg-black p-2 rounded-lg transition-colors flex items-center justify-center" style={{
              width: '36px',
              height: '36px'
            }}>
                <img src="/lovable-uploads/61ec65a3-b814-47bf-95c0-67d3091504ad.png" alt="X Logo" className="w-5 h-5" />
              </a>
              <a href="mailto:support@fraterny.com?subject=User%20Query" className="bg-[#0EA5E9] p-2 rounded-lg transition-colors">
                <Mail size={20} color="white" />
              </a>
            </div>
            <ul className="space-y-2">
              <li><Link to="/terms-and-conditions" className="text-gray-400 hover:text-white transition-colors">Terms and Conditions</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" className="text-gray-400 hover:text-white transition-colors">Terms of Use</Link></li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-start">
            <a href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white text-navy rounded-lg hover:bg-opacity-90 transition-colors font-medium">
              Apply Now
            </a>
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <div className="mb-2">
            <p className="py-[9px] text-lg text-slate-50">FRATERNY</p>
            <p className="text-gray-400">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link> / <Link to="/terms-of-use" className="hover:text-white transition-colors">Terms of Use</Link> / <Link to="/refund-policy" className="hover:text-white transition-colors">Refund & Cancellation Policy</Link>
            </p>
          </div>
          <p className="text-gray-400">
            All Rights Reserved 2025
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;
