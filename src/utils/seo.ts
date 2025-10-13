// src/utils/seo.ts
export function setMeta({
  title,
  description,
  canonical,
  robots = "index, follow",
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
}: {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
}) {
  if (title) document.title = title;

  // comment out all the console logs 
  // <meta name="description">
  let desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!desc) {
    desc = document.createElement("meta");
    desc.name = "description";
    document.head.appendChild(desc);
  }
  desc.content = description || "";

  // <meta name="robots">
  let rb = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
  if (!rb) {
    rb = document.createElement("meta");
    rb.name = "robots";
    document.head.appendChild(rb);
  }
  rb.content = robots;

  // <link rel="canonical">
  const canonAll = Array.from(document.querySelectorAll('link[rel="canonical"]')) as HTMLLinkElement[];
  let canon = canonAll[0];
  if (!canon) {
    canon = document.createElement("link");
    canon.rel = "canonical";
    document.head.appendChild(canon);
  }
  canon.href = canonical;

  // clean accidental duplicates
  for (let i = 1; i < canonAll.length; i++) canonAll[i].remove();

  // Open Graph meta tags
  //console.log('🏷️ setMeta: Setting Open Graph tags', { ogTitle, ogDescription, ogImage, ogUrl });
  
  if (ogTitle) {
    let ogTitleMeta = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (!ogTitleMeta) {
      ogTitleMeta = document.createElement('meta');
      ogTitleMeta.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitleMeta);
      //console.log('✅ Created new og:title meta tag');
    } else {
      //console.log('🔄 Found existing og:title meta tag, updating');
    }
    ogTitleMeta.content = ogTitle;
    //console.log('🏷️ Set og:title to:', ogTitle);
  }

  if (ogDescription) {
    let ogDescMeta = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (!ogDescMeta) {
      ogDescMeta = document.createElement('meta');
      ogDescMeta.setAttribute('property', 'og:description');
      document.head.appendChild(ogDescMeta);
      //console.log('✅ Created new og:description meta tag');
    } else {
      //console.log('🔄 Found existing og:description meta tag, updating');
    }
    ogDescMeta.content = ogDescription;
    //console.log('🏷️ Set og:description to:', ogDescription);
  }

  if (ogImage) {
    let ogImageMeta = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
    if (!ogImageMeta) {
      ogImageMeta = document.createElement('meta');
      ogImageMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageMeta);
      //console.log('✅ Created new og:image meta tag');
    } else {
      //console.log('🔄 Found existing og:image meta tag, updating');
    }
    ogImageMeta.content = ogImage;
    //console.log('🏷️ Set og:image to:', ogImage);
  }

  if (ogUrl) {
    let ogUrlMeta = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    if (!ogUrlMeta) {
      ogUrlMeta = document.createElement('meta');
      ogUrlMeta.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrlMeta);
      //console.log('✅ Created new og:url meta tag');
    } else {
      //console.log('🔄 Found existing og:url meta tag, updating');
    }
    ogUrlMeta.content = ogUrl;
    //console.log('🏷️ Set og:url to:', ogUrl);
  }
  
  console.log('🎯 setMeta: Open Graph section completed');
}



export function clearDynamicMetaTags() {
  //console.log('🧹 clearDynamicMetaTags: Starting cleanup');
  
  // Remove Open Graph tags
  const ogTags = [
    'meta[property="og:title"]',
    'meta[property="og:description"]', 
    'meta[property="og:image"]',
    'meta[property="og:url"]',
    'meta[property="og:image:alt"]',
    'meta[property="og:image:width"]',
    'meta[property="og:image:height"]'
  ];

  ogTags.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      // console.log('🗑️ Removing OG tag:', selector, 'content:', element.getAttribute('content'));
      element.remove();
    } else {
      //console.log('👻 OG tag not found:', selector);
    }
  });

  // Remove other dynamic meta tags  
  const otherTags = [
    'meta[name="keywords"]',
    'script[type="application/ld+json"]',
    'script[id="blog-image-schema"]',
    // ADD THESE QUEST-SPECIFIC TAGS
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
    'meta[name="twitter:card"]',
    'meta[name="twitter:image"]'
  ];

  otherTags.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      //console.log('🗑️ Removing other tag:', selector, 'content:', element.getAttribute('content') || element.textContent?.slice(0, 50));
      element.remove();
    });
  });
  
  console.log('✅ clearDynamicMetaTags: Cleanup completed');
}