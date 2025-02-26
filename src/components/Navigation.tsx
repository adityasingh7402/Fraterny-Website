
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const iconColor = isScrolled ? '#0A1A2F' : '#FFFFFF';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${
      isScrolled ? 'glass shadow-lg' : ''
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="animate-fade-in">
            <img 
              src="/lovable-uploads/ffcba562-8c6d-44dc-8607-53afc45d3a57.png" 
              alt="Press Logo" 
              className="h-8 md:h-10"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/experience" className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors`}>
              The Experience
            </a>
            <a href="/process" className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors`}>
              How It Works
            </a>
            <a href="/pricing" className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors`}>
              Pricing
            </a>
            <a href="/faq" className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors`}>
              FAQ
            </a>
            <a
              href="/apply"
              className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all font-medium"
            >
              Apply Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden ${isScrolled ? 'text-navy' : 'text-white'}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} color={iconColor} /> : <Menu size={24} color={iconColor} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="/experience"
              className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              The Experience
            </a>
            <a
              href="/process"
              className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="/pricing"
              className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="/faq"
              className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </a>
            <a
              href="/apply"
              className="block text-sm font-medium text-terracotta hover:text-opacity-80 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Apply Now
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
