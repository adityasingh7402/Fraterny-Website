// /src/components/quest-landing/styles/spacing.ts

export const spacing = {
  // Base spacing units
  xs: '4px',
  sm: '8px', 
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
  
  // Hero section specific spacing
  hero: {
    containerPadding: '24px', // 6 * 4px from p-6
    topPadding: '64px',       // pt-16 equivalent  
    textSpacing: {
      greeting: '8px',        // mb-2
      title: '16px',          // mb-4
      subtitle: '8px',        // mb-2  
      highlight: '8px',       // mb-2
      closing: '32px',        // mb-8
    },
    buttonPosition: {
      top: '576px',           // From Figma specs
      left: '25px',           // From Figma specs
    }
  },
  
  // Gradient ellipse positioning
  gradient: {
    ellipse: {
      width: '554px',         // From Figma specs
      height: '554px',        // From Figma specs
      top: '400px',           // From Figma specs
      left: '-76px',          // From Figma specs (negative value for overflow)
    }
  },
  
  // Button dimensions
  button: {
    primary: {
      width: '160px',         // From Figma specs
      height: '60px',         // From Figma specs
      borderRadius: '30px',   // From Figma specs
      borderWidth: '2px',     // From Figma specs
    }
  },
  
  // Container widths
  container: {
    mobile: '100%',
    tablet: '768px',
    desktop: '1200px',
    maxWidth: '1440px',
  },
  
  // Section spacing
  section: {
    paddingY: '80px',
    paddingX: '24px',
    marginBottom: '120px',
  },
  
  // Component spacing
  component: {
    card: {
      padding: '24px',
      margin: '16px',
      borderRadius: '12px',
    },
    list: {
      itemSpacing: '16px',
      sectionSpacing: '32px',
    }
  }
} as const;

// Helper function to get spacing value
export const getSpacing = (key: keyof typeof spacing | string): string => {
  if (key in spacing) {
    return spacing[key as keyof typeof spacing] as string;
  }
  return key; // Return as-is if not found (for custom values)
};

// Export individual spacing groups for easier imports
export const { hero, gradient, button, container, section, component } = spacing;