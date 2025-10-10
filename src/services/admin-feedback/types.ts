import { Database } from '@/integrations/supabase/types';

// Use existing Supabase types
export type FeedbackDetail = Database['public']['Tables']['summary_overall_feedback']['Row'];
export type UserData = Database['public']['Tables']['user_data']['Row'];

// Partial summary_generation with only selected fields for feedback context
export type SummaryGenerationPartial = Pick<
  Database['public']['Tables']['summary_generation']['Row'],
  | 'testid'
  | 'quest_pdf'
  | 'payment_status'
  | 'paid_generation_time'
  | 'quest_status'
  | 'status'
  | 'qualityscore'
  | 'starting_time'
  | 'completion_time'
>;

// Enriched feedback with nested user and summary data
export type EnrichedFeedback = FeedbackDetail & {
  user_data: UserData | null;
  summary_generation: SummaryGenerationPartial | null;
};

// Filter options
export type FeedbackFilters = {
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  rating?: '1' | '2' | '3' | '4' | '5' | null;
  minRating?: number | null;
  maxRating?: number | null;
  hasTestId?: boolean | null;
};

// Pagination parameters
export type PaginationParams = {
  page: number;
  pageSize: number;
};

// Pagination metadata
export type PaginationMeta = {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
};

// Statistics for feedback dashboard
export type FeedbackStats = {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: {
    rating1: number;
    rating2: number;
    rating3: number;
    rating4: number;
    rating5: number;
  };
  feedbacksWithTestId: number;
  feedbacksWithoutTestId: number;
  recentFeedbacks: number; // Last 7 days
};

// API Response structure
export type FeedbackResponse = {
  success: boolean;
  data: {
    feedbacks: EnrichedFeedback[];
    pagination: PaginationMeta;
    stats?: FeedbackStats;
  } | null;
  error: string | null;
};

// Stats API Response
export type FeedbackStatsResponse = {
  success: boolean;
  data: FeedbackStats | null;
  error: string | null;
};

/**
 * Example JSON Response Format:
 * 
 * {
 *   success: true,
 *   data: {
 *     feedbacks: [
 *       {
 *         // FeedbackDetail fields
 *         id: 1,
 *         created_at: "2025-01-15T10:00:00Z",
 *         user_id: "user_123",
 *         testid: "test_456",
 *         date_time: "2025-01-15T10:00:00Z",
 *         rating: "5",
 *         feedback: "Excellent service! Very satisfied.",
 *         
 *         // Nested user_data
 *         user_data: {
 *           user_name: "John Doe",
 *           email: "john@example.com",
 *           mobile_number: "+919876543210",
 *           city: "Mumbai",
 *           user_id: "user_123",
 *           gender: "Male"
 *         },
 *         
 *         // Nested summary_generation (selected fields only)
 *         summary_generation: {
 *           testid: "test_456",
 *           quest_pdf: "https://storage.url/pdf_link",
 *           payment_status: "completed",
 *           paid_generation_time: "2025-01-15T10:50:00Z",
 *           quest_status: "completed",
 *           status: "completed",
 *           qualityscore: "85",
 *           starting_time: "2025-01-15T09:00:00Z",
 *           completion_time: "2025-01-15T10:00:00Z"
 *         }
 *       }
 *     ],
 *     pagination: {
 *       currentPage: 1,
 *       pageSize: 20,
 *       totalRecords: 150,
 *       totalPages: 8
 *     },
 *     stats: {
 *       totalFeedbacks: 150,
 *       averageRating: 4.2,
 *       ratingDistribution: {
 *         rating1: 5,
 *         rating2: 10,
 *         rating3: 25,
 *         rating4: 60,
 *         rating5: 50
 *       },
 *       feedbacksWithTestId: 140,
 *       feedbacksWithoutTestId: 10,
 *       recentFeedbacks: 25
 *     }
 *   },
 *   error: null
 * }
 */