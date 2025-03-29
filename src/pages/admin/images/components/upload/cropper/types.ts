
import { RefObject } from 'react';
import { Crop as CropArea } from 'react-image-crop';

export interface ImageCropperProps {
  imageSrc: string;
  crop: CropArea;
  setCrop: (crop: CropArea) => void;
  setCompletedCrop: (crop: CropArea) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  imgRef: RefObject<HTMLImageElement>;
  onApplyChanges: () => void;
  onCancelCrop: () => void;
  imageKey: string;
}

export interface AspectRatioOption {
  label: string;
  value: number | undefined;
}
