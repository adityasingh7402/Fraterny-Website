
// Image categories for organizing uploads
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

// Map of image keys to usage descriptions
export const IMAGE_USAGE_MAP: Record<string, string> = IMAGE_KEYS.reduce((acc, { key, description }) => {
  acc[key] = description;
  return acc;
}, {} as Record<string, string>);

// Recommended aspect ratios and descriptions
export const getRecommendedAspectRatio = (imageKey: string) => {
  // Define aspect ratios for different image types
  if (imageKey.includes('hero')) {
    return { ratio: 16/9, label: 'Hero Section (16:9)' };
  } else if (imageKey.includes('banner')) {
    return { ratio: 3/1, label: 'Banner (3:1)' };
  } else if (imageKey.includes('profile')) {
    return { ratio: 1/1, label: 'Profile (1:1)' };
  } else if (imageKey.includes('thumbnail')) {
    return { ratio: 4/3, label: 'Thumbnail (4:3)' };
  } else if (imageKey.includes('villalab')) {
    return { ratio: 3/2, label: 'Villa Lab Gallery (3:2)' };
  } else if (imageKey.includes('experience')) {
    return { ratio: 16/9, label: 'Experience Section (16:9)' };
  }
  
  // Default ratio
  return { ratio: 16/9, label: 'Standard (16:9)' };
};

// Form validation schema
import { z } from 'zod';

export const uploadFormSchema = z.object({
  key: z.string().min(1, { message: "Image key is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  alt_text: z.string().min(1, { message: "Alt text is required" }),
  category: z.string().optional(),
});
