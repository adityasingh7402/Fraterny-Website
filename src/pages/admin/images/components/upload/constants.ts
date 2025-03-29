
import { z } from "zod";

// Available image categories
export const IMAGE_CATEGORIES = [
  'Hero',
  'Background',
  'Banner',
  'Icon',
  'Profile',
  'Thumbnail',
  'Gallery',
  'Product'
];

// Common website image keys that replace placeholders
export const IMAGE_KEYS = [
  { key: 'hero-background', description: 'Main Hero Section - Homepage' },
  { key: 'villalab-social', description: 'Villa Lab Section - Social Events' },
  { key: 'villalab-mentorship', description: 'Villa Lab Section - Mentorship' },
  { key: 'villalab-brainstorm', description: 'Villa Lab Section - Brainstorming' },
  { key: 'villalab-group', description: 'Villa Lab Section - Group Activities' },
  { key: 'villalab-networking', description: 'Villa Lab Section - Networking' },
  { key: 'villalab-candid', description: 'Villa Lab Section - Candid Interactions' },
  { key: 'villalab-gourmet', description: 'Villa Lab Section - Gourmet Meals' },
  { key: 'villalab-workshop', description: 'Villa Lab Section - Workshops' },
  { key: 'villalab-evening', description: 'Villa Lab Section - Evening Sessions' },
  { key: 'experience-villa-retreat', description: 'Experience Page - Villa Retreat' },
  { key: 'experience-workshop', description: 'Experience Page - Workshop' },
  { key: 'experience-networking', description: 'Experience Page - Networking' },
  { key: 'experience-collaboration', description: 'Experience Page - Collaboration' },
  { key: 'experience-evening-session', description: 'Experience Page - Evening Session' },
  { key: 'experience-gourmet-dining', description: 'Experience Page - Gourmet Dining' }
];

// Define the expected aspect ratios for different image types
export const IMAGE_ASPECT_RATIOS: Record<string, { ratio: number, label: string }> = {
  'hero': { ratio: 16/9, label: '16:9 - Hero Banner' },
  'background': { ratio: 16/9, label: '16:9 - Background' },
  'villalab': { ratio: 4/3, label: '4:3 - Villa Lab Gallery' },
  'experience': { ratio: 4/3, label: '4:3 - Experience Gallery' },
  'banner': { ratio: 21/9, label: '21:9 - Wide Banner' },
  'profile': { ratio: 1, label: '1:1 - Square' },
  'thumbnail': { ratio: 16/9, label: '16:9 - Thumbnail' },
  'gallery': { ratio: 4/3, label: '4:3 - Gallery Image' },
  'default': { ratio: 16/9, label: '16:9 - Default' }
};

// Create a mapping of image keys to their descriptions for easier lookup
export const IMAGE_USAGE_MAP = IMAGE_KEYS.reduce((acc, { key, description }) => {
  acc[key] = description;
  return acc;
}, {} as Record<string, string>);

// Get recommended aspect ratio for a specific image key
export const getRecommendedAspectRatio = (key: string): { ratio: number, label: string } => {
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
  
  return IMAGE_ASPECT_RATIOS.default;
};

// Zod schema for form validation
export const uploadFormSchema = z.object({
  key: z.string().min(2, "Key must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  alt_text: z.string().min(5, "Alt text must be at least 5 characters"),
  category: z.string().optional(),
});
