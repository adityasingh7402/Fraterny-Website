
import { useState } from 'react';
import { type Crop as CropArea } from 'react-image-crop';

export interface UploadFormState {
  key: string;
  description: string;
  alt_text: string;
  category: string;
  file: File | null;
}

export const useUploadForm = () => {
  // Form state for upload
  const [uploadForm, setUploadForm] = useState<UploadFormState>({
    key: '',
    description: '',
    alt_text: '',
    category: '',
    file: null
  });
  
  // Image cropping state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropArea>({
    unit: '%',
    width: 80,
    height: 80,
    x: 10,
    y: 10
  });
  const [completedCrop, setCompletedCrop] = useState<CropArea | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  
  const resetUploadForm = () => {
    setUploadForm({
      key: '',
      description: '',
      alt_text: '',
      category: '',
      file: null
    });
    
    setImageSrc(null);
    setCrop({
      unit: '%',
      width: 80,
      height: 80,
      x: 10,
      y: 10
    });
    setCompletedCrop(null);
    setZoom(1);
    setRotation(0);
    setIsCropping(false);
  };
  
  return {
    uploadForm,
    setUploadForm,
    resetUploadForm,
    imageSrc,
    setImageSrc,
    crop,
    setCrop,
    completedCrop,
    setCompletedCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    isCropping,
    setIsCropping
  };
};
