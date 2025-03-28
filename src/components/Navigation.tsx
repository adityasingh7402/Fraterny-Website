import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'The Experience', href: '/experience' },
    { name: 'Process', href: '/process' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
  ];

  // Admin links only shown to admin users
  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Blog Management', href: '/admin/blog' },
    { name: 'Image Management', href: '/admin/images' },
  ];

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY;
    requestAnimationFrame(() => {
      setIsScrolled(scrollPosition > 20);
      setIsPastHero(scrollPosition > 100);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const iconColor = useMemo(() => isScrolled ? '#0A1A2F' : '#FFFFFF', [isScrolled]);

  const navClasses = useMemo(() => `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
    isScrolled ? 'glass shadow-lg py-2' : 'py-4'
  }`, [isScrolled]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen(prev => !prev);
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut]);

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <a href="/" className="transition-opacity duration-200 ease-out">
            {isPastHero ? (
              <img 
                src="/lovable-uploads/d4a85eda-3e95-443e-8dbc-5c34e20c9723.png" 
                alt="FRAT Logo" 
                className="h-8 md:h-10"
                width="auto"
                height="auto"
              />
            ) : (
              <img 
                src="/lovable-uploads/ffcba562-8c6d-44dc-8607-53afc45d3a57.png" 
                alt="Press Logo" 
                className="h-8 md:h-10"
                width="auto"
                height="auto"
              />
            )}
          </a>

          <div className="hidden md:flex items-center space-x-8">
            {/* Home icon link removed */}
            
            {navLinks.map(link => (
              <a key={link.name} href={link.href} className={`${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}>
                {link.name}
              </a>
            ))}
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className={`w-10 h-10 rounded-full bg-terracotta flex items-center justify-center ${isScrolled ? 'text-white' : 'text-navy'}`}>
                    {user.user_metadata?.first_name ? (
                      <span className="text-white font-medium">
                        {user.user_metadata.first_name.charAt(0)}
                      </span>
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isAdmin ? 'Administrator' : 'User'}
                      </p>
                    </div>
                    
                    {isAdmin && adminLinks.map(link => (
                      <a 
                        key={link.name} 
                        href={link.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    ))}
                    <button 
                      onClick={handleSignOut}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <a
                href="/auth"
                className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
              >
                Sign In
              </a>
            )}
            
            <a
              href="https://docs.google.com/forms/d/1TTHQN3gG2ZtC26xlh0lU8HeiMc3qDJhfoU2tOh9qLQM/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium"
            >
              Apply Now
            </a>
          </div>

          <button
            className={`md:hidden ${isScrolled ? 'text-navy' : 'text-white'}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} color={iconColor} /> : <Menu size={24} color={iconColor} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 backdrop-blur-md bg-black bg-opacity-20 rounded-lg mt-2 px-4">
            {/* Home link in mobile menu removed */}
            
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}
                onClick={toggleMenu}
              >
                {link.name}
              </a>
            ))}
            
            {user ? (
              <>
                {isAdmin && adminLinks.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`block text-sm font-medium ${isScrolled ? 'text-navy' : 'text-white'} hover:text-terracotta transition-colors duration-200`}
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    handleSignOut();
                    toggleMenu();
                  }}
                  className="block w-full text-left text-sm font-medium text-red-400 hover:text-red-300 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <a
                href="/auth"
                className="block text-sm font-medium text-terracotta hover:text-opacity-80 transition-colors duration-200"
                onClick={toggleMenu}
              >
                Sign In
              </a>
            )}
            
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
