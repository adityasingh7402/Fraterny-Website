import { Database } from '@/integrations/supabase/types';

// Use existing Supabase types
export type SummaryGeneration = Database['public']['Tables']['summary_generation']['Row'] & {
  user_data?: {
    user_name: string | null;
    email: string | null;
    mobile_number: string | null;
    city: string | null;
    gender: string | null;
    dob: string | null;
  } | null;
};

// Filter options for summaries
export type SummaryFilters = {
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
  paymentStatus?: 'completed' | 'pending' | 'failed' | null;
  questStatus?: string;
  status?: string;
  deviceType?: string;
  hasQuestPdf?: boolean | null;
  minQualityScore?: number | null;
  maxQualityScore?: number | null;
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

// API Response structure for fetching summaries
export type SummariesResponse = {
  success: boolean;
  data: {
    summaries: SummaryGeneration[];
    pagination: PaginationMeta;
  } | null;
  error: string | null;
};

// API Response structure for delete operation
export type DeleteSummaryResponse = {
  success: boolean;
  message: string | null;
  error: string | null;
};

// Statistics for dashboard cards
export type SummaryStats = {
  totalSummaries: number;
  paidSummaries: number;
  completedSummaries: number;
  averageQualityScore: number;
};

/**
 * Example JSON Response Format for fetchSummaries:
 * 
 * {
 *   success: true,
 *   data: {
 *     summaries: [
 *       {
 *         id: 1,
 *         user_id: "user_123",
 *         testid: "test_456",
 *         starting_time: "2025-01-15T10:00:00Z",
 *         completion_time: "2025-01-15T10:45:00Z",
 *         payment_status: "completed",
 *         quest_status: "completed",
 *         status: "completed",
 *         qualityscore: "85",
 *         quest_pdf: "https://storage.url/pdf_link",
 *         device_type: "desktop",
 *         operating_system: "Windows",
 *         ...
 *       }
 *     ],
 *     pagination: {
 *       currentPage: 1,
 *       pageSize: 20,
 *       totalRecords: 150,
 *       totalPages: 8
 *     }
 *   },
 *   error: null
 * }
 */
