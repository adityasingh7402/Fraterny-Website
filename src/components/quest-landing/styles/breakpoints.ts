// /src/components/quest-landing/styles/breakpoints.ts

export const breakpoints = {
  // Base breakpoints (mobile-first approach)
  xs: '320px',   // Small mobile devices
  sm: '640px',   // Mobile devices
  md: '768px',   // Tablet devices
  lg: '1024px',  // Desktop devices
  xl: '1280px',  // Large desktop devices
  xxl: '1536px', // Extra large desktop devices
} as const;

// Media query helpers
export const mediaQueries = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  xxl: `@media (min-width: ${breakpoints.xxl})`,
  
  // Max-width queries for when you need upper bounds
  maxSm: `@media (max-width: ${parseInt(breakpoints.sm) - 1}px)`,
  maxMd: `@media (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  maxLg: `@media (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  maxXl: `@media (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
  
  // Range queries
  smToMd: `@media (min-width: ${breakpoints.sm}) and (max-width: ${parseInt(breakpoints.md) - 1}px)`,
  mdToLg: `@media (min-width: ${breakpoints.md}) and (max-width: ${parseInt(breakpoints.lg) - 1}px)`,
  lgToXl: `@media (min-width: ${breakpoints.lg}) and (max-width: ${parseInt(breakpoints.xl) - 1}px)`,
} as const;

// Responsive typography scaling
export const responsiveTypography = {
  hero: {
    greeting: {
      mobile: '32px',    // Scaled down for mobile
      tablet: '42px',    // Medium scale
      desktop: '54px',   // Original Figma size
    },
    title: {
      mobile: '48px',    // Scaled down for mobile
      tablet: '60px',    // Medium scale
      desktop: '72px',   // Original Figma size
    },
    subtitle: {
      mobile: '24px',    // Scaled down for mobile
      tablet: '30px',    // Medium scale
      desktop: '36px',   // Original Figma size
    },
    highlight: {
      mobile: '28px',    // Scaled down for mobile
      tablet: '34px',    // Medium scale
      desktop: '40px',   // Original Figma size
    },
    closing: {
      mobile: '24px',    // Scaled down for mobile
      tablet: '30px',    // Medium scale
      desktop: '36px',   // Original Figma size
    }
  },
  
  button: {
    mobile: {
      width: '140px',    // Slightly smaller for mobile
      height: '50px',    // Slightly smaller for mobile
      fontSize: '14px'
    },
    desktop: {
      width: '160px',    // Original Figma size
      height: '60px',    // Original Figma size
      fontSize: '16px'
    }
  }
} as const;

// Container responsive sizes
export const responsiveContainers = {
  mobile: '100%',
  tablet: '90%',
  desktop: '1200px',
  wide: '1400px'
} as const;

// Responsive spacing
export const responsiveSpacing = {
  hero: {
    containerPadding: {
      mobile: '16px',
      tablet: '24px', 
      desktop: '32px'
    },
    topPadding: {
      mobile: '40px',
      tablet: '64px',
      desktop: '80px'
    }
  },
  
  gradient: {
    ellipse: {
      // Mobile adjustments for the gradient ellipse
      mobile: {
        width: '300px',
        height: '300px',
        top: '350px',
        left: '-50px'
      },
      tablet: {
        width: '450px',
        height: '450px',
        top: '400px',
        left: '-65px'
      },
      desktop: {
        width: '554px',     // Original Figma size
        height: '554px',    // Original Figma size
        top: '476px',       // Original Figma position
        left: '-76px'       // Original Figma position
      }
    }
  }
} as const;

// Helper function to get responsive value
export const getResponsiveValue = (
  values: { mobile?: string; tablet?: string; desktop?: string },
  breakpoint: 'mobile' | 'tablet' | 'desktop'
): string => {
  return values[breakpoint] || values.mobile || values.desktop || '';
};

// Tailwind responsive class helpers
export const responsiveClasses = {
  typography: {
    heroGreeting: 'text-[32px] md:text-[42px] lg:text-[54px]',
    heroTitle: 'text-[48px] md:text-[60px] lg:text-[72px]',
    heroSubtitle: 'text-[24px] md:text-[30px] lg:text-[36px]',
    heroHighlight: 'text-[28px] md:text-[34px] lg:text-[40px]',
    heroClosing: 'text-[24px] md:text-[30px] lg:text-[36px]',
  },
  
  spacing: {
    heroPadding: 'p-4 md:p-6 lg:p-8',
    heroTopPadding: 'pt-10 md:pt-16 lg:pt-20',
  },
  
  button: {
    size: 'w-[140px] h-[50px] md:w-[160px] md:h-[60px]',
    text: 'text-sm md:text-base'
  }
};

// Export individual groups
export const { xs, sm, md, lg, xl, xxl } = breakpoints;