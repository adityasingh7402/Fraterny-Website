
import { RefObject } from 'react';
import { type Crop as CropArea } from 'react-image-crop';

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
  onCancelCrop?: () => void;
  imageKey?: string;
}

export interface AspectRatioOption {
  value: number | undefined;
  label: string;
}

export interface AspectRatioControlsProps {
  aspectRatio: number | undefined;
  setAspectRatio: (ratio: number | undefined) => void;
  imgRef: RefObject<HTMLImageElement>;
  setCrop: (crop: CropArea) => void;
  imageKey?: string;
}
