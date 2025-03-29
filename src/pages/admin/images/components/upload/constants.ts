
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
export const COMMON_IMAGE_KEYS = [
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

// Mapping of image keys to their descriptive usage
export const IMAGE_USAGE_MAP: Record<string, string> = COMMON_IMAGE_KEYS.reduce((acc, { key, description }) => {
  acc[key] = description;
  return acc;
}, {} as Record<string, string>);

// Function to get recommended aspect ratio based on image key
export const getRecommendedAspectRatio = (imageKey: string) => {
  // Default aspect ratio (16:9)
  const defaultRatio = {
    ratio: 16/9,
    label: 'Landscape (16:9)'
  };

  if (!imageKey) return defaultRatio;

  // Hero images are typically wider
  if (imageKey.includes('hero')) {
    return {
      ratio: 21/9,
      label: 'Hero Banner (21:9)'
    };
  }

  // Gallery images are often square or slightly landscape
  if (imageKey.includes('gallery')) {
    return {
      ratio: 4/3,
      label: 'Gallery (4:3)'
    };
  }

  // Profile or avatar images are square
  if (imageKey.includes('profile') || imageKey.includes('avatar')) {
    return {
      ratio: 1/1,
      label: 'Square (1:1)'
    };
  }

  // Banner images are typically wider
  if (imageKey.includes('banner')) {
    return {
      ratio: 3/1,
      label: 'Banner (3:1)'
    };
  }

  return defaultRatio;
};

// Upload form schema
import { z } from 'zod';

export const uploadFormSchema = z.object({
  key: z.string().min(1, "Image key is required"),
  description: z.string().min(1, "Description is required"),
  alt_text: z.string().min(1, "Alt text is required"),
  category: z.string().optional(),
});

export type UploadFormValues = z.infer<typeof uploadFormSchema>;
