// /src/components/quest-landing/styles/colors.ts

export const colors = {
  // Primary gradient colors
  gradient: {
    primary: '#0C45F0',
    secondary: '#41D9FF', 
    tertiary: '#48B9D8',
    // Gradient string for backgrounds
    radial: 'radial-gradient(50% 50% at 50% 50%, #0C45F0 0%, #41D9FF 50.96%, #48B9D8 100%)'
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',      // White text on gradient background
    secondary: '#0A0A0A',    // Slightly off-white for subtle text
    accent: '#F8F9FA',       // Light gray for less emphasis
    dark: '#1A1A1A',         // Dark text for light backgrounds (if needed)
  },
  
  // Button colors
  button: {
    border: '#FEFEFE',       // Button border color
    background: {
      primary: 'rgba(255, 255, 255, 0.1)',     // Semi-transparent white
      hover: 'rgba(255, 255, 255, 0.2)',       // Hover state
      active: 'rgba(255, 255, 255, 0.3)',      // Active state
    },
    text: '#FFFFFF'
  },
  
  // Background colors
  background: {
    primary: '#000000',      // Main dark background
    secondary: '#1A1A1A',    // Slightly lighter dark
    white: '#FFFFFF',        // White sections if needed
    overlay: 'rgba(0, 0, 0, 0.5)' // Dark overlay if needed
  },
  
  // Status colors (for future use)
  status: {
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
    info: '#3B82F6'
  }
} as const;

// Export individual color groups for easier imports
export const { gradient, text, button, background, status } = colors;