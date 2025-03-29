
import { MutableRefObject } from 'react';
import { type Crop as CropArea } from 'react-image-crop';

export interface ImageCropperProps {
  imageSrc: string;
  crop: CropArea;
  setCrop: (crop: CropArea) => void;
  setCompletedCrop: (crop: CropArea | null) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  imgRef: MutableRefObject<HTMLImageElement | null>;
  onApplyChanges: () => void;
  onCancelCrop?: () => void;
  imageKey: string;
}

export interface ZoomRotateControlsProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
}

export interface AspectRatioControlsProps {
  aspectRatio: number | undefined;
  setAspectRatio: (ratio: number | undefined) => void;
  imgRef: MutableRefObject<HTMLImageElement | null>;
  setCrop: (crop: CropArea) => void;
  imageKey: string;
}

export interface LivePreviewProps {
  previewUrl: string | null;
  aspectRatio: number | undefined;
  placeholderLabel?: string;
}

export interface CropperHeaderProps {
  onApplyChanges: () => void;
  onCancelCrop?: () => void;
  imageKey?: string;
}
