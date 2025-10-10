import React, { useState, useEffect } from 'react';
import { fetchFeedbacks, fetchFeedbackStats, deleteFeedback } from '@/services/admin-feedback';
import type { EnrichedFeedback, FeedbackStats, FeedbackFilters, PaginationParams } from '@/services/admin-feedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Star, 
  MessageCircle, 
  FileText, 
  Users, 
  TrendingUp, 
  Calendar,
  ChevronLeft, 
  ChevronRight,
  Eye,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

const AdminFeedbackManagement: React.FC = () => {
  // State for data
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<EnrichedFeedback[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<FeedbackStats>({
    totalFeedbacks: 0,
    averageRating: 0,
    ratingDistribution: { rating1: 0, rating2: 0, rating3: 0, rating4: 0, rating5: 0 },
    feedbacksWithTestId: 0,
    feedbacksWithoutTestId: 0,
    recentFeedbacks: 0,
  });

  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedRating, setSelectedRating] = useState<'1' | '2' | '3' | '4' | '5' | ''>('');

  // Popup states
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedFeedbackDetails, setSelectedFeedbackDetails] = useState<EnrichedFeedback | null>(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<EnrichedFeedback | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Copy functionality
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fetch statistics
  const fetchStatsData = async () => {
    try {
      const response = await fetchFeedbackStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching feedback stats:', err);
    }
  };

  // Fetch feedbacks data
  const fetchFeedbacksData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const paginationParams: PaginationParams = {
        page: currentPage,
        pageSize,
      };

      const filters: FeedbackFilters = {
        searchTerm: searchTerm || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        rating: selectedRating || null,
      };

      const response = await fetchFeedbacks(paginationParams, filters);
      
      if (response.success && response.data) {
        setFeedbacks(response.data.feedbacks);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to load feedback data');
        setFeedbacks([]);
        setPagination(null);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setFeedbacks([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    fetchFeedbacksData();
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setSelectedRating('');
    setCurrentPage(1);
    setError(null);
    setTimeout(() => {
      fetchFeedbacksData();
    }, 0);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      toast.success('Copied to clipboard!');
      setTimeout(() => {
        setCopiedText(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy');
    }
  };

  // Open details popup
  const openDetailsPopup = (feedback: EnrichedFeedback) => {
    setSelectedFeedbackDetails(feedback);
    setShowDetailsPopup(true);
  };

  // Close details popup
  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedFeedbackDetails(null);
    setCopiedText(null);
  };

  // Open delete popup
  const openDeletePopup = (feedback: EnrichedFeedback) => {
    setSelectedFeedback(feedback);
    setShowDeletePopup(true);
  };

  // Close delete popup
  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedFeedback(null);
  };

  // Process delete
  const processDelete = async () => {
    if (!selectedFeedback) return;
    
    setDeleting(true);
    try {
      const result = await deleteFeedback(selectedFeedback.id);
      if (result.success) {
        toast.success('Feedback deleted successfully');
        closeDeletePopup();
        fetchFeedbacksData();
        fetchStatsData();
      } else {
        toast.error(result.error || 'Failed to delete feedback');
      }
    } catch (error: any) {
      toast.error('Failed to delete feedback');
      setError(error.message || 'Failed to delete feedback');
    } finally {
      setDeleting(false);
    }
  };

  // Get star rating display
  const StarRating: React.FC<{ rating: number; size?: string }> = ({ rating, size = 'h-4 w-4' }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`${size} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`} 
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  // Load initial data
  useEffect(() => {
    fetchStatsData();
    fetchFeedbacksData();
  }, []);

  // Fetch data when page changes
  useEffect(() => {
    if (currentPage > 1) {
      fetchFeedbacksData();
    }
  }, [currentPage]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-8 sm:px-6 lg:px-16 py-8">
          <div className="max-w-full mx-auto">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
              <p className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">Feedback Management</p>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Feedbacks Card */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Total Feedbacks</p>
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {stats.totalFeedbacks.toLocaleString()}
                </p>
              </div>

              {/* Average Rating Card */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Average Rating</p>
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                    {stats.averageRating}
                  </p>
                  <StarRating rating={Math.round(stats.averageRating)} size="h-5 w-5" />
                </div>
              </div>

              {/* Recent Feedbacks Card */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Recent (7 days)</p>
                  <TrendingUp className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {stats.recentFeedbacks.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
              <div className="grid grid-cols-5 gap-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingDistribution[`rating${rating}` as keyof typeof stats.ratingDistribution];
                  const percentage = stats.totalFeedbacks > 0 ? (count / stats.totalFeedbacks) * 100 : 0;
                  return (
                    <div key={rating} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <span className="text-sm font-medium mr-1">{rating}</span>
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Filter Feedbacks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end mb-6">
                {/* Search */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Search</p>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by user, test ID, feedback..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>

                {/* Rating Filter */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Rating</p>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value as '1' | '2' | '3' | '4' | '5' | '')}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </label>

                {/* Date From */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">From Date</p>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>

                {/* Date To */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">To Date</p>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>

                {/* Filter Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={applyFilters}
                    disabled={loading}
                    className="flex items-center justify-center rounded-lg h-11 bg-blue-600 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-6 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                  <button 
                    onClick={resetFilters}
                    disabled={loading}
                    className="flex items-center justify-center rounded-lg h-11 bg-gray-200 text-gray-700 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Test ID</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feedback</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      Array.from({ length: 10 }).map((_, index) => (
                        <tr key={`loading-${index}`} className="animate-pulse hover:bg-gray-50">
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                          <td className="py-4 px-4 text-right"><div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div></td>
                        </tr>
                      ))
                    ) : (
                      Array.from({ length: pageSize }).map((_, index) => {
                        const feedback = index < pageSize ? feedbacks[index] : undefined;
                        
                        if (feedback) {
                          const rating = parseInt(feedback.rating || '0');
                          return (
                            <tr key={feedback.id} className="hover:bg-gray-50">
                              {/* User */}
                              <td className="py-4 px-4">
                                <div className="text-sm">
                                  <p className="font-medium text-gray-900">{feedback.user_data?.user_name || 'N/A'}</p>
                                  <p className="text-gray-500">{feedback.user_data?.email || 'N/A'}</p>
                                </div>
                              </td>
                              
                              {/* Test ID with copy */}
                              <td className="py-4 px-4">
                                {feedback.testid ? (
                                  <div className="flex items-center gap-2 group">
                                    <div className="relative">
                                      <span className="text-sm font-mono text-gray-900 cursor-pointer hover:text-blue-600" title={feedback.testid}>
                                        {feedback.testid.length > 12 ? feedback.testid.substring(0, 12) + '...' : feedback.testid}
                                      </span>
                                      {feedback.testid.length > 12 && (
                                        <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                                          {feedback.testid}
                                        </div>
                                      )}
                                    </div>
                                    <button 
                                      onClick={() => copyToClipboard(feedback.testid!)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded" 
                                      title="Copy Test ID"
                                    >
                                      {copiedText === feedback.testid ? 
                                        <Check className="h-3 w-3 text-green-600" /> : 
                                        <Copy className="h-3 w-3 text-gray-600" />
                                      }
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-sm text-gray-400">No Test ID</span>
                                )}
                              </td>
                              
                              {/* Rating */}
                              <td className="py-4 px-4">
                                <StarRating rating={rating} />
                              </td>
                              
                              {/* Feedback */}
                              <td className="py-4 px-4">
                                <p className="text-sm text-gray-600 max-w-xs truncate" title={feedback.feedback || ''}>
                                  {feedback.feedback || 'No feedback provided'}
                                </p>
                              </td>
                              
                              {/* Date */}
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {feedback.date_time ? new Date(feedback.date_time).toLocaleDateString() : 'N/A'}
                              </td>
                              
                              {/* Actions */}
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => openDetailsPopup(feedback)}
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline" 
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => openDeletePopup(feedback)}
                                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium hover:underline" 
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        } else {
                          return (
                            <tr key={`empty-${index}`} className="h-14">
                              <td className="py-4 px-4"></td>
                              <td className="py-4 px-4"></td>
                              <td className="py-4 px-4"></td>
                              <td className="py-4 px-4"></td>
                              <td className="py-4 px-4"></td>
                              <td className="py-4 px-4"></td>
                            </tr>
                          );
                        }
                      })
                    )}
                    
                    {!loading && feedbacks.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-500 text-sm">
                          No feedback found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 0 && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-gray-600">
                    Showing {((pagination.currentPage - 1) * pageSize) + 1} to {Math.min(pagination.currentPage * pageSize, pagination.totalRecords)} of {pagination.totalRecords} feedbacks
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center rounded-lg h-9 w-9 border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {pagination.totalPages <= 10 ? (
                      Array.from({ length: pagination.totalPages }).map((_, i) => (
                        <button 
                          key={i+1}
                          onClick={() => handlePageChange(i+1)}
                          className={`flex items-center justify-center rounded-lg h-9 w-9 text-sm font-medium ${
                            currentPage === i+1 
                              ? 'bg-blue-600 text-white' 
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {i+1}
                        </button>
                      ))
                    ) : (
                      <>
                        <button 
                          onClick={() => handlePageChange(1)}
                          className={`flex items-center justify-center rounded-lg h-9 w-9 text-sm font-medium ${
                            currentPage === 1 
                              ? 'bg-blue-600 text-white' 
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          1
                        </button>
                        {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                        {Array.from({ length: Math.min(3, pagination.totalPages - 2) }).map((_, i) => {
                          const pageNum = Math.max(2, currentPage - 1) + i;
                          if (pageNum > 1 && pageNum < pagination.totalPages) {
                            return (
                              <button 
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`flex items-center justify-center rounded-lg h-9 w-9 text-sm font-medium ${
                                  currentPage === pageNum 
                                    ? 'bg-blue-600 text-white' 
                                    : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          }
                          return null;
                        })}
                        {currentPage < pagination.totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                        {pagination.totalPages > 1 && (
                          <button 
                            onClick={() => handlePageChange(pagination.totalPages)}
                            className={`flex items-center justify-center rounded-lg h-9 w-9 text-sm font-medium ${
                              currentPage === pagination.totalPages 
                                ? 'bg-blue-600 text-white' 
                                : 'border border-gray-300 text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {pagination.totalPages}
                          </button>
                        )}
                      </>
                    )}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="flex items-center justify-center rounded-lg h-9 w-9 border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Delete Feedback</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this feedback? This action cannot be undone.
            </p>
            <div className="bg-gray-50 p-3 rounded-md mb-4">
              <p className="font-medium text-sm">User: <span className="text-gray-900">{selectedFeedback.user_data?.user_name || 'N/A'}</span></p>
              <p className="text-xs text-gray-500 mt-1">Rating: <StarRating rating={parseInt(selectedFeedback.rating || '0')} /></p>
              <p className="text-xs text-gray-500">Date: {selectedFeedback.date_time ? new Date(selectedFeedback.date_time).toLocaleString() : 'N/A'}</p>
            </div>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={closeDeletePopup} 
                disabled={deleting} 
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={processDelete} 
                disabled={deleting} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Feedback'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Popup */}
      {showDetailsPopup && selectedFeedbackDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Feedback Details</h3>
                <button
                  onClick={closeDetailsPopup}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Feedback Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Feedback Overview</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <div className="mt-1">
                      <StarRating rating={parseInt(selectedFeedbackDetails.rating || '0')} size="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedFeedbackDetails.date_time)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-gray-600">Feedback</p>
                    <p className="text-sm text-gray-900 mt-1 p-3 bg-white rounded border">
                      {selectedFeedbackDetails.feedback || 'No feedback provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Information */}
              {selectedFeedbackDetails.user_data && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">User Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-sm text-gray-900">{selectedFeedbackDetails.user_data.user_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Email</p>
                      <p className="text-sm text-gray-900">{selectedFeedbackDetails.user_data.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mobile</p>
                      <p className="text-sm text-gray-900">{selectedFeedbackDetails.user_data.mobile_number || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">City</p>
                      <p className="text-sm text-gray-900">{selectedFeedbackDetails.user_data.city || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Gender</p>
                      <p className="text-sm text-gray-900">{selectedFeedbackDetails.user_data.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">User ID</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-mono text-gray-900">{selectedFeedbackDetails.user_data.user_id || 'N/A'}</p>
                        {selectedFeedbackDetails.user_data.user_id && (
                          <button 
                            onClick={() => copyToClipboard(selectedFeedbackDetails.user_data?.user_id || '')}
                            className="p-1 hover:bg-gray-200 rounded" 
                            title="Copy"
                          >
                            {copiedText === selectedFeedbackDetails.user_data.user_id ? 
                              <Check className="h-3 w-3 text-green-600" /> : 
                              <Copy className="h-3 w-3 text-gray-600" />
                            }
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Test Information */}
              {selectedFeedbackDetails.summary_generation && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Related Test Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Test ID</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-mono text-gray-900 break-all">{selectedFeedbackDetails.summary_generation.testid || 'N/A'}</p>
                          {selectedFeedbackDetails.summary_generation.testid && (
                            <button 
                              onClick={() => copyToClipboard(selectedFeedbackDetails.summary_generation?.testid || '')}
                              className="p-1 hover:bg-gray-200 rounded flex-shrink-0" 
                              title="Copy"
                            >
                              {copiedText === selectedFeedbackDetails.summary_generation.testid ? 
                                <Check className="h-3 w-3 text-green-600" /> : 
                                <Copy className="h-3 w-3 text-gray-600" />
                              }
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Payment Status</p>
                        <p className="text-sm text-gray-900">{selectedFeedbackDetails.summary_generation.payment_status || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Quest Status</p>
                        <p className="text-sm text-gray-900">{selectedFeedbackDetails.summary_generation.quest_status || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Quality Score</p>
                        <p className="text-lg font-bold text-purple-600">{selectedFeedbackDetails.summary_generation.qualityscore || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Starting Time</p>
                        <p className="text-sm text-gray-900">{formatDate(selectedFeedbackDetails.summary_generation.starting_time)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Completion Time</p>
                        <p className="text-sm text-gray-900">{formatDate(selectedFeedbackDetails.summary_generation.completion_time)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedFeedbackDetails.summary_generation.quest_pdf && (
                    <div className="mt-4 pt-4 border-t border-purple-200">
                      <p className="text-sm font-medium text-gray-600 mb-2">Quest PDF</p>
                      <a 
                        href={selectedFeedbackDetails.summary_generation.quest_pdf} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download PDF
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <div className="flex justify-end">
                <button
                  onClick={closeDetailsPopup}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackManagement;