
import { z } from "zod";

// Image categories organized by purpose
export const IMAGE_CATEGORIES = [
  'Hero',       // Large banner images at the top of pages
  'Background', // Full-page or section backgrounds
  'Banner',     // Wide promotional banners
  'Icon',       // Small symbolic graphics
  'Profile',    // User or team member photos
  'Thumbnail',  // Small preview images
  'Gallery',    // Collection display images
  'Product'     // Product showcase images
];

// Common website image keys that replace placeholders
export const IMAGE_KEYS = [
  // Hero section images
  { key: 'hero-background', description: 'Main Hero Section - Homepage', category: 'Hero' },
  
  // Villa Lab section images
  { key: 'villalab-social', description: 'Villa Lab Section - Social Events', category: 'Gallery' },
  { key: 'villalab-mentorship', description: 'Villa Lab Section - Mentorship', category: 'Gallery' },
  { key: 'villalab-brainstorm', description: 'Villa Lab Section - Brainstorming', category: 'Gallery' },
  { key: 'villalab-group', description: 'Villa Lab Section - Group Activities', category: 'Gallery' },
  { key: 'villalab-networking', description: 'Villa Lab Section - Networking', category: 'Gallery' },
  { key: 'villalab-candid', description: 'Villa Lab Section - Candid Interactions', category: 'Gallery' },
  { key: 'villalab-gourmet', description: 'Villa Lab Section - Gourmet Meals', category: 'Gallery' },
  { key: 'villalab-workshop', description: 'Villa Lab Section - Workshops', category: 'Gallery' },
  { key: 'villalab-evening', description: 'Villa Lab Section - Evening Sessions', category: 'Gallery' },
  
  // Experience page images
  { key: 'experience-villa-retreat', description: 'Experience Page - Villa Retreat', category: 'Gallery' },
  { key: 'experience-workshop', description: 'Experience Page - Workshop', category: 'Gallery' },
  { key: 'experience-networking', description: 'Experience Page - Networking', category: 'Gallery' },
  { key: 'experience-collaboration', description: 'Experience Page - Collaboration', category: 'Gallery' },
  { key: 'experience-evening-session', description: 'Experience Page - Evening Session', category: 'Gallery' },
  { key: 'experience-gourmet-dining', description: 'Experience Page - Gourmet Dining', category: 'Gallery' }
];

// Define the expected aspect ratios for different image types with detailed descriptions
export const IMAGE_ASPECT_RATIOS: Record<string, { 
  ratio: number, 
  label: string,
  recommended_width: number,
  recommended_height: number,
  description: string 
}> = {
  'hero': { 
    ratio: 16/9, 
    label: '16:9 - Hero Banner', 
    recommended_width: 1920, 
    recommended_height: 1080,
    description: 'Wide format ideal for hero sections and full-width banners. High resolution recommended for sharp display on large screens.'
  },
  'background': { 
    ratio: 16/9, 
    label: '16:9 - Background', 
    recommended_width: 1920, 
    recommended_height: 1080,
    description: 'Wide format for page backgrounds. Should be subtle enough for text overlay with good contrast.'
  },
  'villalab': { 
    ratio: 4/3, 
    label: '4:3 - Villa Lab Gallery', 
    recommended_width: 1200, 
    recommended_height: 900,
    description: 'Standard format for Villa Lab gallery images. Slightly wider than tall, perfect for activity photographs.'
  },
  'experience': { 
    ratio: 4/3, 
    label: '4:3 - Experience Gallery', 
    recommended_width: 1200, 
    recommended_height: 900,
    description: 'Standard format for Experience page galleries. Good for showcasing retreat activities and events.'
  },
  'banner': { 
    ratio: 21/9, 
    label: '21:9 - Wide Banner', 
    recommended_width: 2100, 
    recommended_height: 900,
    description: 'Extra wide format for dramatic, cinematic banners. Best used for immersive section dividers.'
  },
  'profile': { 
    ratio: 1, 
    label: '1:1 - Square', 
    recommended_width: 600, 
    recommended_height: 600,
    description: 'Perfect square for profile pictures, team photos and avatars. Consistent dimensions ensure uniform display.'
  },
  'thumbnail': { 
    ratio: 16/9, 
    label: '16:9 - Thumbnail', 
    recommended_width: 640, 
    recommended_height: 360,
    description: 'Widescreen format for content previews and thumbnails. Optimized for smaller display areas.'
  },
  'gallery': { 
    ratio: 4/3, 
    label: '4:3 - Gallery Image', 
    recommended_width: 1200, 
    recommended_height: 900,
    description: 'Classic photo ratio for gallery collections. Provides good composition space for most subjects.'
  },
  'product': { 
    ratio: 3/4, 
    label: '3:4 - Portrait Product', 
    recommended_width: 900, 
    recommended_height: 1200,
    description: 'Vertical format ideal for product displays, especially when showcasing taller items or full-length views.'
  },
  'social': { 
    ratio: 1, 
    label: '1:1 - Social Media', 
    recommended_width: 1080, 
    recommended_height: 1080,
    description: 'Square format optimized for social media posts, works well across multiple platforms.'
  },
  'default': { 
    ratio: 16/9, 
    label: '16:9 - Default', 
    recommended_width: 1280, 
    recommended_height: 720,
    description: 'Standard widescreen format for general usage when no specific type is provided.'
  }
};

// Create a mapping of image keys to their descriptions for easier lookup
export const IMAGE_USAGE_MAP = IMAGE_KEYS.reduce((acc, { key, description }) => {
  acc[key] = description;
  return acc;
}, {} as Record<string, string>);

/**
 * Get recommended aspect ratio and image specifications for a specific image key
 */
export const getRecommendedAspectRatio = (key: string): { 
  ratio: number, 
  label: string,
  recommended_width: number,
  recommended_height: number,
  description: string 
} => {
  if (key.includes('hero') || key.includes('background')) {
    return IMAGE_ASPECT_RATIOS.hero;
  }
  if (key.includes('profile') || key.includes('avatar')) {
    return IMAGE_ASPECT_RATIOS.profile;
  }
  if (key.includes('banner')) {
    return IMAGE_ASPECT_RATIOS.banner;
  }
  if (key.includes('villalab')) {
    return IMAGE_ASPECT_RATIOS.villalab;
  }
  if (key.includes('experience')) {
    return IMAGE_ASPECT_RATIOS.experience;
  }
  if (key.includes('gallery')) {
    return IMAGE_ASPECT_RATIOS.gallery;
  }
  if (key.includes('product')) {
    return IMAGE_ASPECT_RATIOS.product;
  }
  if (key.includes('social')) {
    return IMAGE_ASPECT_RATIOS.social;
  }
  if (key.includes('thumbnail')) {
    return IMAGE_ASPECT_RATIOS.thumbnail;
  }
  
  return IMAGE_ASPECT_RATIOS.default;
};

/**
 * Get image category from key name
 */
export const getCategoryFromKey = (key: string): string => {
  const imageKey = IMAGE_KEYS.find(item => item.key === key);
  if (imageKey?.category) {
    return imageKey.category;
  }
  
  if (key.includes('hero')) return 'Hero';
  if (key.includes('background')) return 'Background';
  if (key.includes('banner')) return 'Banner';
  if (key.includes('icon')) return 'Icon';
  if (key.includes('profile') || key.includes('avatar')) return 'Profile';
  if (key.includes('thumbnail')) return 'Thumbnail';
  if (key.includes('gallery')) return 'Gallery';
  if (key.includes('product')) return 'Product';
  
  return '';
};

// Zod schema for form validation
export const uploadFormSchema = z.object({
  key: z.string().min(2, "Key must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  alt_text: z.string().min(5, "Alt text must be at least 5 characters"),
  category: z.string().optional(),
});

// File size limits in bytes
export const FILE_SIZE_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB general limit
  RECOMMENDED_MAX_SIZE: 5 * 1024 * 1024, // 5MB recommended size
  IMAGE_OPTIMIZATION_THRESHOLD: 2 * 1024 * 1024 // Images larger than 2MB will be optimized
};

// Allowed image file types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/webp', 
  'image/svg+xml',
  'image/gif'
];
