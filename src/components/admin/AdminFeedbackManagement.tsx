// ============================================================================
// Admin Feedback Management Component
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Eye,
  Copy,
  CheckCircle,
  Star,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import { fetchFeedback, deleteFeedback } from '../../services/admin-feedback';
import type { SummaryFeedback, FeedbackFilters } from '../../services/admin-feedback/types';
import { RATING_OPTIONS } from '../../services/admin-feedback/types';

// ============================================================================
// Component
// ============================================================================

const AdminFeedbackManagement: React.FC = () => {
  // State Management
  const [feedback, setFeedback] = useState<SummaryFeedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Filters
  const [filters, setFilters] = useState<FeedbackFilters>({
    search: '',
    rating: '',
    dateFrom: '',
    dateTo: '',
  });
  const [tempFilters, setTempFilters] = useState<FeedbackFilters>(filters);

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<SummaryFeedback | null>(null);

  // Copy feedback
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // ============================================================================
  // Effects
  // ============================================================================

  useEffect(() => {
    loadFeedback();
  }, [currentPage, filters]);

  // ============================================================================
  // Data Loading
  // ============================================================================

  const loadFeedback = async () => {
    setLoading(true);
    setError(null);

    const response = await fetchFeedback(filters, {
      page: currentPage,
      itemsPerPage,
    });

    if (response.success && response.data) {
      setFeedback(response.data);
      setTotalRecords(response.total);
    } else {
      setError(response.error || 'Failed to load feedback');
      setFeedback([]);
      setTotalRecords(0);
    }

    setLoading(false);
  };

  // ============================================================================
  // Filter Handlers
  // ============================================================================

  const handleFilterChange = (key: keyof FeedbackFilters, value: string) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const emptyFilters: FeedbackFilters = {
      search: '',
      rating: '',
      dateFrom: '',
      dateTo: '',
    };
    setTempFilters(emptyFilters);
    setFilters(emptyFilters);
    setCurrentPage(1);
  };

  // ============================================================================
  // Action Handlers
  // ============================================================================

  const handleViewFeedback = (feedback: SummaryFeedback) => {
    setSelectedFeedback(feedback);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (feedback: SummaryFeedback) => {
    setSelectedFeedback(feedback);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFeedback) return;

    const response = await deleteFeedback(selectedFeedback.id);

    if (response.success) {
      setDeleteModalOpen(false);
      setSelectedFeedback(null);
      loadFeedback();
    } else {
      setError(response.error || 'Failed to delete feedback');
    }
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ============================================================================
  // Pagination
  // ============================================================================

  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ============================================================================
  // Utility Functions
  // ============================================================================

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const renderStars = (rating: string | null) => {
    const ratingNum = parseInt(rating || '0');
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= ratingNum ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // ============================================================================
  // Render: Main Component
  // ============================================================================

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback Management</h1>
        <p className="text-gray-600">
          Manage and review user feedback for summary generation
        </p>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="bg-white px-4 py-2 rounded-lg shadow">
            <span className="text-gray-600">Total Feedback:</span>{' '}
            <span className="font-semibold text-blue-600">{totalRecords}</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="User ID, Test ID, Feedback..."
                value={tempFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={tempFilters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {RATING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={tempFilters.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={tempFilters.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="flex gap-3">
          <button
            onClick={applyFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Reset
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                // Loading Skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 7 }).map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : feedback.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <MessageSquare className="w-12 h-12 mb-3 text-gray-400" />
                      <p className="text-lg font-medium">No feedback found</p>
                      <p className="text-sm mt-1">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                // Data Rows
                feedback.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">
                          {item.id}
                        </span>
                        <button
                          onClick={() => handleCopy(item.id.toString(), item.id)}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy ID"
                        >
                          {copiedId === item.id ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {item.user_data?.user_name || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">
                        {item.user_data?.email || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-600">
                          {item.testid || 'N/A'}
                        </span>
                        {item.testid && (
                          <button
                            onClick={() => handleCopy(item.testid!, item.id)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                            title="Copy Test ID"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStars(item.rating)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(item.date_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewFeedback(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && feedback.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords}{' '}
              results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Feedback Details
              </h3>
              <button
                onClick={() => setViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Rating Section */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rating</p>
                    {renderStars(selectedFeedback.rating)}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-800">
                      {selectedFeedback.rating || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">out of 5</p>
                  </div>
                </div>
              </div>

              {/* Feedback Text */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Feedback</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedFeedback.feedback || 'No feedback provided'}
                  </p>
                </div>
              </div>

              {/* User Information */}
              {selectedFeedback.user_data && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-5 h-5 text-gray-600" />
                    <h4 className="font-semibold text-gray-800">User Information</h4>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {selectedFeedback.user_data.user_name || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Email:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {selectedFeedback.user_data.email || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Mobile:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {selectedFeedback.user_data.mobile_number || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">City:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {selectedFeedback.user_data.city || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Gender:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {selectedFeedback.user_data.gender || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">DOB:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {selectedFeedback.user_data.dob || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-blue-200">
                      <span className="text-sm text-gray-600">User ID:</span>
                      <span className="text-sm font-mono font-medium text-gray-800 ml-2">
                        {selectedFeedback.user_data.user_id}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Test Information */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Test Information</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Test ID:</span>
                    <span className="text-sm font-mono font-medium text-gray-800">
                      {selectedFeedback.testid || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Metadata</h4>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Feedback ID:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {selectedFeedback.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Submitted:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {formatDate(selectedFeedback.date_time)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="text-sm font-medium text-gray-800">
                      {formatDate(selectedFeedback.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setViewModalOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Delete Feedback
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this feedback? This action cannot be
                undone.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-6">
                <div className="text-sm">
                  <span className="text-gray-600">Feedback ID:</span>{' '}
                  <span className="font-medium text-gray-800">
                    {selectedFeedback.id}
                  </span>
                </div>
                <div className="text-sm mt-1">
                  <span className="text-gray-600">Rating:</span>{' '}
                  <span className="font-medium text-gray-800">
                    {selectedFeedback.rating || 'N/A'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
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
