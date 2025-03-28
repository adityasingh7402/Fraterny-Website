
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
  'hero': { ratio: 16/9, label: '16:9' },
  'background': { ratio: 16/9, label: '16:9' },
  'villalab': { ratio: 4/3, label: '4:3' },
  'experience': { ratio: 4/3, label: '4:3' },
  'banner': { ratio: 21/9, label: '21:9' },
  'profile': { ratio: 1, label: '1:1' },
  'thumbnail': { ratio: 16/9, label: '16:9' },
  'gallery': { ratio: 4/3, label: '4:3' },
  'default': { ratio: 16/9, label: '16:9' }
};

// Zod schema for form validation
export const uploadFormSchema = z.object({
  key: z.string().min(2, "Key must be at least 2 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  alt_text: z.string().min(5, "Alt text must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
});

// Get recommended aspect ratio based on the image key
export const getRecommendedAspectRatio = (key: string) => {
  if (!key) return IMAGE_ASPECT_RATIOS.default;
  
  // Check if the key contains any of the known prefixes
  for (const prefix of Object.keys(IMAGE_ASPECT_RATIOS)) {
    if (key.includes(prefix)) {
      return IMAGE_ASPECT_RATIOS[prefix];
    }
  }
  
  return IMAGE_ASPECT_RATIOS.default;
};

