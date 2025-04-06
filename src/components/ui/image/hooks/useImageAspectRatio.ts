
/**
 * Helper function to get image aspect ratio from a URL
 */
export const getImageAspectRatio = (url: string): Promise<number | undefined> => {
  return new Promise((resolve) => {
    // For placeholder images, return a default aspect ratio
    if (url === '/placeholder.svg') {
      resolve(16/9);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      resolve(aspectRatio);
    };
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
};
