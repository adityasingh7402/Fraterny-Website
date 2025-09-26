import { fetchImageByKey } from '../fetchService';
import { SEOMetadata } from '../types';

/**
 * Get SEO metadata for an image by key
 */
export const getImageSEOData = async (imageKey: string): Promise<SEOMetadata | null> => {
  try {
    const imageData = await fetchImageByKey(imageKey);
    
    if (!imageData || !imageData.metadata) {
      return null;
    }

    // Extract SEO data from metadata
    const metadata = imageData.metadata as any;
    return metadata.seo || null;
  } catch (error) {
    console.error('Error fetching image SEO data:', error);
    return null;
  }
};

/**
 * Get complete image data including SEO for frontend usage
 */
export const getImageDataForSEO = async (imageKey: string) => {
  try {
    const imageData = await fetchImageByKey(imageKey);
    
    if (!imageData) {
      return null;
    }

    const metadata = imageData.metadata as any;
    const seo = metadata?.seo || {};

    return {
      id: imageData.id,
      key: imageData.key,
      alt_text: imageData.alt_text,
      description: imageData.description,
      width: imageData.width,
      height: imageData.height,
      seo: {
        title: seo.title || null,
        caption: seo.caption || null,
        focusKeywords: seo.focusKeywords || [],
        copyright: seo.copyright || null,
        location: seo.location || null,
        ogTitle: seo.ogTitle || null,
        ogDescription: seo.ogDescription || null,
        schemaType: seo.schemaType || 'ImageObject'
      }
    };
  } catch (error) {
    console.error('Error fetching complete image data:', error);
    return null;
  }
};