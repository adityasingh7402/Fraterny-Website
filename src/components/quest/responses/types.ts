// import { HonestyTag, Question } from '../core/types';

// // Base props for all response inputs
// export interface ResponseInputProps {
//   question: Question;
//   onResponse: (response: string, tags?: HonestyTag[]) => void;
//   isActive?: boolean;
//   isAnswered?: boolean;
//   previousResponse?: string;
//   className?: string;
// }

// // Props for multiple choice component
// export interface MultipleChoiceProps extends ResponseInputProps {
//   options: string[];
//   selectedOption?: string;
//   layout?: 'vertical' | 'grid';
// }

// // Props for text response component
// export interface TextResponseProps extends ResponseInputProps {
//   placeholder?: string;
//   minLength?: number;
//   maxLength?: number;
//   showCharacterCount?: boolean;
//   autoFocus?: boolean;
// }

// // Props for scale slider component
// export interface ScaleSliderProps extends ResponseInputProps {
//   min?: number;
//   max?: number;
//   step?: number;
//   labels?: Record<number, string>;
//   showLabels?: boolean;
//   showValue?: boolean;
// }

// // Props for image choice component
// export interface ImageChoiceProps extends ResponseInputProps {
//   images: Array<{
//     src: string;
//     alt: string;
//     value: string;
//   }>;
//   columns?: 2 | 3 | 4;
// }

// // Props for flexible options component
// export interface FlexibleOptionsProps extends ResponseInputProps {
//   options?: string[];
//   showByDefault?: boolean;
//   triggerText?: string;
//   hideTriggerText?: string;
// }

import { HonestyTag, Question } from '../core/types';

// Base props for all response inputs
export interface ResponseInputProps {
  question: Question;
  onResponse: (response: string, tags?: HonestyTag[]) => void;
  isActive?: boolean;
  isAnswered?: boolean;
  previousResponse?: string;
  className?: string;
}

// Props for multiple choice component
export interface MultipleChoiceProps extends ResponseInputProps {
  options: string[];
  selectedOption?: string;
  layout?: 'vertical' | 'grid';
}

// Props for text response component
export interface TextResponseProps extends ResponseInputProps {
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
  autoFocus?: boolean;
  // NEW: Word count related props
  maxWords?: number;                    // Maximum words allowed (default: 100)
  showWordCount?: boolean;              // Show word counter (default: false)
  wordWarningThreshold?: number;        // Warning threshold in words (default: 90)
}

// Props for scale slider component
export interface ScaleSliderProps extends ResponseInputProps {
  min?: number;
  max?: number;
  step?: number;
  labels?: Record<number, string>;
  showLabels?: boolean;
  showValue?: boolean;
}

// Props for image choice component
export interface ImageChoiceProps extends ResponseInputProps {
  images: Array<{
    src: string;
    alt: string;
    value: string;
  }>;
  columns?: 2 | 3 | 4;
}

// Props for flexible options component
export interface FlexibleOptionsProps extends ResponseInputProps {
  options?: string[];
  showByDefault?: boolean;
  triggerText?: string;
  hideTriggerText?: string;
}