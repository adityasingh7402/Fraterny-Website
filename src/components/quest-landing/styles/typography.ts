// /src/components/quest-landing/styles/typography.ts

export const typography = {
  // Font families
  fontFamily: {
    primary: 'Gilroy-Regular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    bold: 'Gilroy-Bold, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  // Font weights
  fontWeight: {
    regular: 400,
    bold: 700, // Changed from 400 to proper bold weight
  },
  
  // Hero section specific typography
  hero: {
    greeting: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: 400,
      fontSize: '54px',
      lineHeight: '100%',
      letterSpacing: '0%',
    },
    title: {
      fontFamily: 'Gilroy-Bold',
      fontWeight: 700, // Proper bold weight
      fontSize: '72px',
      lineHeight: '100%',
      letterSpacing: '-5%', // Negative letter spacing as per Figma
    },
    subtitle: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: 400,
      fontSize: '36px',
      lineHeight: '100%',
      letterSpacing: '0%',
    },
    highlight: {
      fontFamily: 'Gilroy-Bold',
      fontWeight: 700, // Proper bold weight
      fontSize: '40px',
      lineHeight: '100%',
      letterSpacing: '0%',
    },
    closing: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: 400,
      fontSize: '36px',
      lineHeight: '100%',
      letterSpacing: '0%',
    },
    byline: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '100%',
      letterSpacing: '0.5px',
    }
  },
  
  // Button typography
  button: {
    primary: {
      fontFamily: 'Gilroy-Bold',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '100%',
      letterSpacing: '0%',
    }
  },
  
  // Common text styles for reusability
  heading: {
    h1: {
      fontFamily: 'Gilroy-Bold',
      fontWeight: 700,
      fontSize: '48px',
      lineHeight: '110%',
      letterSpacing: '-2%',
    },
    h2: {
      fontFamily: 'Gilroy-Bold',
      fontWeight: 700,
      fontSize: '36px',
      lineHeight: '120%',
      letterSpacing: '-1%',
    },
    h3: {
      fontFamily: 'Gilroy-Bold',
      fontWeight: 600,
      fontSize: '24px',
      lineHeight: '130%',
      letterSpacing: '0%',
    }
  },
  
  // Body text styles
  body: {
    large: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: 400,
      fontSize: '30px',
      lineHeight: '150%',
      letterSpacing: '0%',
    },
    medium: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '150%',
      letterSpacing: '0%',
    },
    small: {
      fontFamily: 'Gilroy-Regular',
      fontWeight: 400,
      fontSize: '14px',
      lineHeight: '140%',
      letterSpacing: '0.25px',
    }
  }
} as const;

// Utility function to convert typography object to CSS-in-JS style
export const getTypographyStyles = (typographyConfig: any) => ({
  fontFamily: typographyConfig.fontFamily,
  fontWeight: typographyConfig.fontWeight,
  fontSize: typographyConfig.fontSize,
  lineHeight: typographyConfig.lineHeight,
  letterSpacing: typographyConfig.letterSpacing,
});

// Export individual typography groups for easier imports
export const { hero, button, heading, body } = typography;