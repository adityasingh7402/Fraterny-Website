
/**
 * Legacy image constants for backward compatibility
 */

// Map of image keys to their usage descriptions
export const IMAGE_USAGE_MAP: Record<string, string> = {
  "hero-banner": "Main hero banner - Primary website header",
  "hero-mobile": "Mobile hero banner - Mobile-optimized header",
  "about-team": "About section team photo - Company leadership",
  "logo-primary": "Primary logo - Brand identifier",
  "logo-white": "White logo - Light background variant",
  "background-pattern": "Background pattern - Website texture",
  "experience-villa-retreat": "Experience gallery - Luxury villa retreat",
  "experience-workshop": "Experience gallery - Interactive workshop session",
  "experience-networking": "Experience gallery - Networking event",
  "experience-collaboration": "Experience gallery - Collaboration session",
  "experience-evening-session": "Experience gallery - Evening session",
  "experience-gourmet-dining": "Experience gallery - Gourmet dining"
};

// Map of default fallback images
export const defaultImagesMap: Record<string, string> = {
  "hero": "/assets/defaults/hero-placeholder.jpg",
  "logo": "/assets/defaults/logo-placeholder.svg",
  "profile": "/assets/defaults/profile-placeholder.jpg",
  "thumbnail": "/assets/defaults/thumbnail-placeholder.jpg",
  "background": "/assets/defaults/background-placeholder.jpg",
  "gallery": "/assets/defaults/gallery-placeholder.jpg"
};
