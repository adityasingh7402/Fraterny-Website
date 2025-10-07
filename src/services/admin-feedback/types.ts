// ============================================================================
// Type Definitions for Admin Feedback Management
// ============================================================================

/**
 * User data associated with feedback
 */
export interface FeedbackUserData {
  user_name?: string | null;
  email?: string | null;
  mobile_number?: string | null;
  city?: string | null;
  gender?: string | null;
  dob?: string | null;
}

/**
 * Main feedback record structure
 */
export interface SummaryFeedback {
  id: number;
  created_at: string;
  user_id: string | null;
  testid: string | null;
  date_time: string | null;
  rating: string | null;
  feedback: string | null;
  user_data?: FeedbackUserData | null;
}

/**
 * Filters for feedback list
 */
export interface FeedbackFilters {
  search: string;
  rating: string;
  dateFrom: string;
  dateTo: string;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  page: number;
  itemsPerPage: number;
}

/**
 * Response for fetching feedback list
 */
export interface FetchFeedbackResponse {
  success: boolean;
  data: SummaryFeedback[] | null;
  total: number;
  error: string | null;
}

/**
 * Response for deleting feedback
 */
export interface DeleteFeedbackResponse {
  success: boolean;
  message: string | null;
  error: string | null;
}

/**
 * Rating options for filter dropdown
 */
export const RATING_OPTIONS = [
  { value: '', label: 'All Ratings' },
  { value: '1', label: '1 Star' },
  { value: '2', label: '2 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '5', label: '5 Stars' },
] as const;
