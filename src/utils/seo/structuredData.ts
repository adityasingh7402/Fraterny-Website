import { SEOMetadata } from '@/services/images/types';

/**
 * Generate JSON-LD structured data for an image
 */
export const generateImageStructuredData = (
  imageUrl: string,
  imageData: {
    alt_text: string;
    description: string;
    width?: number | null;
    height?: number | null;
    seo: SEOMetadata;
  }
) => {
  const { seo } = imageData;
  
  const structuredData: any = {
    "@context": "https://schema.org",
    "@type": seo.schemaType || "ImageObject",
    "url": imageUrl,
    "name": seo.title || imageData.description,
    "description": imageData.alt_text,
    "caption": seo.caption || undefined,
  };

  // Add dimensions if available
  if (imageData.width && imageData.height) {
    structuredData.width = imageData.width;
    structuredData.height = imageData.height;
  }

  // Add keywords
  if (seo.focusKeywords && seo.focusKeywords.length > 0) {
    structuredData.keywords = seo.focusKeywords.join(', ');
  }

  // Add copyright information
  if (seo.copyright) {
    structuredData.copyrightHolder = {
      "@type": "Organization",
      "name": seo.copyright.replace(/^©\s*\d{4}\s*/, '') // Remove © and year
    };
    structuredData.copyrightNotice = seo.copyright;
  }

  // Add location information
  if (seo.location) {
    structuredData.contentLocation = {
      "@type": "Place",
      "name": seo.location
    };
  }

  // Clean up undefined values
  Object.keys(structuredData).forEach(key => {
    if (structuredData[key] === undefined) {
      delete structuredData[key];
    }
  });

  return structuredData;
};

/**
 * Generate Open Graph meta tags for an image
 */
export const generateImageOpenGraphTags = (
  imageUrl: string,
  imageData: {
    alt_text: string;
    description: string;
    width?: number | null;
    height?: number | null;
    seo: SEOMetadata;
  }
) => {
  const { seo } = imageData;
  
  const ogTags: Record<string, string> = {
    'og:image': imageUrl,
    'og:image:alt': imageData.alt_text,
  };

  if (imageData.width && imageData.height) {
    ogTags['og:image:width'] = imageData.width.toString();
    ogTags['og:image:height'] = imageData.height.toString();
  }

  // Use SEO-specific titles if available
  if (seo.ogTitle) {
    ogTags['og:title'] = seo.ogTitle;
  }

  if (seo.ogDescription) {
    ogTags['og:description'] = seo.ogDescription;
  }

  return ogTags;
};

/**
 * Insert structured data into page head
 */
export const insertStructuredData = (structuredData: any, id: string = 'image-structured-data') => {
  // Remove existing structured data script if it exists
  const existingScript = document.getElementById(id);
  if (existingScript) {
    existingScript.remove();
  }

  // Create new script element
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(structuredData);
  
  // Add to head
  document.head.appendChild(script);
};

/**
 * Insert Open Graph meta tags into page head
 */
export const insertOpenGraphTags = (ogTags: Record<string, string>) => {
  Object.entries(ogTags).forEach(([property, content]) => {
    // Remove existing meta tag if it exists
    const existingMeta = document.querySelector(`meta[property="${property}"]`);
    if (existingMeta) {
      existingMeta.remove();
    }

    // Create new meta tag
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  });
};