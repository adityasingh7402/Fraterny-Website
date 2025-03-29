
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
  { key: 'experience-gourmet-dining', description: 'Experience Page - Gourmet Dining' },
  // Adding tribe section image placeholders
  { key: 'tribe-visionary', description: 'Experience Page - Tribe Section - Visionary' },
  { key: 'tribe-hustler', description: 'Experience Page - Tribe Section - Hustler' },
  { key: 'tribe-workaholic', description: 'Experience Page - Tribe Section - Workaholic' },
  { key: 'tribe-experienced', description: 'Experience Page - Tribe Section - Experienced' },
  { key: 'tribe-optimist', description: 'Experience Page - Tribe Section - Optimist' },
  { key: 'tribe-guardian', description: 'Experience Page - Tribe Section - Guardian' },
  // Adding depth section image placeholders
  { key: 'depth-house-code', description: 'Experience Page - Depth Section - House Code' },
  { key: 'depth-startup', description: 'Experience Page - Depth Section - Startup Simulations' },
  { key: 'depth-learning', description: 'Experience Page - Depth Section - Learning Experience' },
  { key: 'depth-frameworks', description: 'Experience Page - Depth Section - Frameworks & Templates' },
  { key: 'depth-group-think', description: 'Experience Page - Depth Section - Group Think' },
  { key: 'depth-memories', description: 'Experience Page - Depth Section - Lifelong Memories' },
  { key: 'depth-food', description: 'Experience Page - Depth Section - Food & Coffee' },
  { key: 'depth-community', description: 'Experience Page - Depth Section - Community' },
  { key: 'depth-soft-skills', description: 'Experience Page - Depth Section - Soft Skills' },
  // Mobile-specific images
  { key: 'tribe-visionary-mobile', description: 'Experience Page - Tribe Section - Visionary (Mobile)' },
  { key: 'tribe-hustler-mobile', description: 'Experience Page - Tribe Section - Hustler (Mobile)' },
  { key: 'tribe-workaholic-mobile', description: 'Experience Page - Tribe Section - Workaholic (Mobile)' },
  { key: 'tribe-experienced-mobile', description: 'Experience Page - Tribe Section - Experienced (Mobile)' },
  { key: 'tribe-optimist-mobile', description: 'Experience Page - Tribe Section - Optimist (Mobile)' },
  { key: 'tribe-guardian-mobile', description: 'Experience Page - Tribe Section - Guardian (Mobile)' },
  { key: 'depth-house-code-mobile', description: 'Experience Page - Depth Section - House Code (Mobile)' },
  { key: 'depth-startup-mobile', description: 'Experience Page - Depth Section - Startup Simulations (Mobile)' },
  { key: 'depth-learning-mobile', description: 'Experience Page - Depth Section - Learning Experience (Mobile)' },
  { key: 'depth-frameworks-mobile', description: 'Experience Page - Depth Section - Frameworks & Templates (Mobile)' },
  { key: 'depth-group-think-mobile', description: 'Experience Page - Depth Section - Group Think (Mobile)' },
  { key: 'depth-memories-mobile', description: 'Experience Page - Depth Section - Lifelong Memories (Mobile)' },
  { key: 'depth-food-mobile', description: 'Experience Page - Depth Section - Food & Coffee (Mobile)' },
  { key: 'depth-community-mobile', description: 'Experience Page - Depth Section - Community (Mobile)' },
  { key: 'depth-soft-skills-mobile', description: 'Experience Page - Depth Section - Soft Skills (Mobile)' },
  // Hero images for other pages
  { key: 'pricing-hero', description: 'Pricing Page - Hero Section' },
  { key: 'pricing-hero-mobile', description: 'Pricing Page - Hero Section (Mobile)' },
  { key: 'faq-hero', description: 'FAQ Page - Hero Section' },
  { key: 'faq-hero-mobile', description: 'FAQ Page - Hero Section (Mobile)' },
  { key: 'process-hero', description: 'Process Page - Hero Section' },
  { key: 'process-hero-mobile', description: 'Process Page - Hero Section (Mobile)' },
  { key: 'blog-hero', description: 'Blog Page - Hero Section' },
  { key: 'blog-hero-mobile', description: 'Blog Page - Hero Section (Mobile)' },
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
  } else if (imageKey.includes('tribe')) {
    return { ratio: 1/1, label: 'Tribe Section (1:1)' };
  } else if (imageKey.includes('depth')) {
    return { ratio: 16/9, label: 'Depth Section (16:9)' };
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
