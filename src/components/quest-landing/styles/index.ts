// /src/components/quest-landing/styles/index.ts

// Export main objects to avoid naming conflicts
export { colors } from './colors';
export { typography } from './typography';
export { spacing } from './spacing';
export { animations, duration, easing, timing, springs } from './animations';
export { breakpoints, mediaQueries, responsiveTypography, responsiveSpacing, responsiveContainers, responsiveClasses } from './breakpoints';

// Explicitly re-export specific items with prefixes to avoid conflicts
export { 
  gradient as colorGradient, 
  text, 
  button as colorButton, 
  background, 
  status 
} from './colors';

export { 
  hero as typographyHero, 
  button as typographyButton, 
  heading, 
  body,
  getTypographyStyles 
} from './typography';

export { 
  hero as spacingHero, 
  gradient as spacingGradient, 
  button as spacingButton, 
  container, 
  section, 
  component,
  getSpacing 
} from './spacing';

export { 
  fadeIn, 
  slideUp, 
  slideInLeft, 
  heroText, 
  buttonHover, 
  buttonTap, 
  gradientFloat, 
  containerReveal, 
  pageTransition 
} from './animations';

export { 
  xs, sm, md, lg, xl, xxl,
  getResponsiveValue 
} from './breakpoints';