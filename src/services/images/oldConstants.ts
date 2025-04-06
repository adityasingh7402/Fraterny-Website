
/**
 * Legacy constants for backward compatibility
 */

// Map of image usage contexts to their keys
export const IMAGE_USAGE_MAP = {
  hero: {
    homepage: 'hero/homepage',
    experience: 'hero/experience',
    villa: 'hero/villa'
  },
  testimonials: {
    ceo: 'testimonials/ceo',
    entrepreneur: 'testimonials/entrepreneur',
    investor: 'testimonials/investor'
  },
  logos: {
    primary: 'logos/primary',
    secondary: 'logos/secondary',
    footer: 'logos/footer'
  }
};

// Default images map for fallbacks
export const defaultImagesMap = {
  hero: '/placeholder.svg',
  logo: '/logo.svg',
  profile: '/profile-placeholder.svg',
  thumbnail: '/thumbnail-placeholder.svg'
};
