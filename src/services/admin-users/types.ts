import { Database } from '@/integrations/supabase/types';

// Use existing Supabase types
export type UserData = Database['public']['Tables']['user_data']['Row'];

// Filter options for users
export type UserFilters = {
  searchTerm?: string;
  excludeTerm?: string; // NEW: Exclusion filter - filters OUT matching data
  dateFrom?: string;
  dateTo?: string;
  isAnonymous?: boolean | null;
  minSummaryGeneration?: number | null;
  maxSummaryGeneration?: number | null;
  minPaidGeneration?: number | null;
  maxPaidGeneration?: number | null;
  gender?: string;
  ageFrom?: number | null; // NEW: Starting age
  ageTo?: number | null; // NEW: Ending age
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

// API Response structure for fetching users
export type UsersResponse = {
  success: boolean;
  data: {
    users: UserData[];
    pagination: PaginationMeta;
    filteredStats?: UserStats; // Optional filtered statistics
  } | null;
  error: string | null;
};

// API Response structure for delete operation
export type DeleteUserResponse = {
  success: boolean;
  message: string | null;
  error: string | null;
};

// Statistics for dashboard cards
export type UserStats = {
  totalUsers: number;
  anonymousUsers: number;
  activeUsers: number;
  totalGenerations: number;
};

// Extended UserData with duplicate information
export type UserDataWithDuplicateInfo = UserData & {
  isDuplicateGroup?: boolean;
  duplicateCount?: number;
  isPrimary?: boolean;
  groupKey?: string;
};

// Duplicate group structure
export type DuplicateGroup = {
  groupKey: string;
  users: UserData[];
  primaryUser: UserData;
  duplicateUsers: UserData[];
};

// Response for duplicate operations
export type DuplicateOperationResponse = {
  success: boolean;
  message: string | null;
  error: string | null;
  data?: DuplicateGroup | null;
};

/**
 * Example JSON Response Format for fetchUsers:
 * 
 * {
 *   success: true,
 *   data: {
 *     users: [
 *       {
 *         user_id: "user_123",
 *         user_name: "John Doe",
 *         email: "john@example.com",
 *         dob: "1990-01-01",
 *         mobile_number: "+919876543210",
 *         city: "Mumbai",
 *         total_summary_generation: 5,
 *         total_paid_generation: 3,
 *         last_used: "2025-01-15T10:45:00Z",
 *         is_anonymous: "FALSE",
 *         gender: "Male"
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
