
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);

  // Optimize scroll handler with useCallback to prevent recreation on each render
  const handleScroll = useCallback(() => {
    // Use requestAnimationFrame to optimize scroll performance
    const scrollPosition = window.scrollY;
    requestAnimationFrame(() => {
      setIsScrolled(scrollPosition > 20);
      setIsPastHero(scrollPosition > 100);
    });
  }, []);

  // Only add/remove listener once
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Memoize color to prevent recreation on each render
  const iconColor = useMemo(() => isScrolled ? '#0A1A2F' : '#FFFFFF', [isScrolled]);

  // Optimize class construction with memoization
  const navClasses = useMemo(() => `fixed top-0 left-0 right-0 z-50 transition-transform duration-200 ease-out ${
    isScrolled ? 'glass shadow-lg' : ''
  }`, [isScrolled]);

  // Toggle menu with performance optimizations
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="transition-opacity duration-200 ease-out">
            {isPastHero ? (
              <img 
                src="/lovable-uploads/d4a85eda-3e95-443e-8dbc-5c34e20c9723.png" 
                alt="FRAT Logo" 
                className="h-8 md:h-10"
                width="40"
                height="40"
              />
            ) : (
              <img 
                src="/lovable-uploads/ffcba562-8c6d-44dc-8607-53afc45d3a57.png" 
                alt="Press Logo" 
                className="h-8 md:h-10"
                width="40"
                height="40"
              />
            )}
          </a>

          {/* Desktop Navigation - Hidden on mobile for better performance */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/experience" className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}>
              The Experience
            </a>
            <a href="/process" className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}>
              How It Works
            </a>
            <a href="/pricing" className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}>
              Pricing
            </a>
            <a href="/faq" className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}>
              FAQ
            </a>
            <a
              href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
            >
              Apply Now
            </a>
          </div>

          {/* Optimized Mobile Menu Button */}
          <button
            className={`md:hidden ${isScrolled ? 'text-navy' : 'text-white'}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} color={iconColor} /> : <Menu size={24} color={iconColor} />}
          </button>
        </div>

        {/* Mobile Navigation - Only rendered when open */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="/experience"
              className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}
              onClick={toggleMenu}
            >
              The Experience
            </a>
            <a
              href="/process"
              className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}
              onClick={toggleMenu}
            >
              How It Works
            </a>
            <a
              href="/pricing"
              className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}
              onClick={toggleMenu}
            >
              Pricing
            </a>
            <a
              href="/faq"
              className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}
              onClick={toggleMenu}
            >
              FAQ
            </a>
            <a
              href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm font-medium text-terracotta hover:text-opacity-80 transition-colors duration-200"
              onClick={toggleMenu}
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
