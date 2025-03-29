
/**
 * Creates a cropped version of an image based on crop selection
 * @param fileName Original file name
 * @param fileType Original file MIME type
 * @param imgRef Reference to the image element
 * @param crop Crop area coordinates and dimensions
 * @param zoom Zoom factor
 * @param rotation Rotation in degrees
 * @returns Promise that resolves to the cropped File object or null
 */
export const createCroppedImage = (
  fileName: string, 
  fileType: string,
  imgRef: HTMLImageElement,
  crop: any,
  zoom: number,
  rotation: number
): Promise<File | null> => {
  if (!imgRef || !crop?.width || !crop?.height) {
    return Promise.resolve(null);
  }
  
  const canvas = document.createElement('canvas');
  const scaleX = imgRef.naturalWidth / imgRef.width;
  const scaleY = imgRef.naturalHeight / imgRef.height;
  
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return Promise.resolve(null);
  }
  
  // Save the canvas state
  ctx.save();
  
  if (rotation !== 0 || zoom !== 1) {
    // Move to canvas center for transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }
  
  // Draw the cropped image
  ctx.drawImage(
    imgRef,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );
  
  // Restore canvas state
  ctx.restore();
  
  // Convert to blob/file
  return new Promise<File | null>((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        
        const file = new File([blob], fileName, {
          type: fileType,
          lastModified: Date.now(),
        });
        
        resolve(file);
      },
      fileType,
      0.95
    );
  });
};
