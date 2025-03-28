
import React from 'react';

interface LogoProps {
  isPastHero: boolean;
}

const Logo = ({ isPastHero }: LogoProps) => {
  return (
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
  );
};

export default Logo;
