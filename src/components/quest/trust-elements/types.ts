import { HonestyTag } from '../core/types';

// Props for data safety component
export interface DataSafetyProps {
  variant?: 'badge' | 'banner' | 'inline';
  icon?: boolean;
  className?: string;
}

// Props for non-judgmental prompts
export interface NonJudgmentalPromptsProps {
  type?: 'encouragement' | 'reminder' | 'reassurance';
  variant?: 'minimal' | 'standard' | 'detailed';
  className?: string;
}

// Props for authenticity tags (already implemented in a previous file)
export interface AuthenticityTagsProps {
  selectedTags: HonestyTag[];
  onTagSelect: (tag: HonestyTag) => void;
  disabled?: boolean;
  className?: string;
}

// Props for privacy indicator (already implemented in a previous file)
export interface PrivacyIndicatorProps {
  className?: string;
}