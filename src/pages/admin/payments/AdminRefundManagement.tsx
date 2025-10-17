import React, { useState, useEffect } from 'react';
import { fetchRefunds, getRefundStats, initiateRefund } from '@/services/admin-refunds';
import type { RefundFilters, PaginationParams, RefundTransaction, RefundsResponse, RefundStats, RefundStatus } from '@/services/admin-refunds';
import { CheckCircle, Clock, AlertTriangle, XCircle, ChevronLeft, ChevronRight, Copy, Check, RefreshCw, Eye, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

// Helper function to format currency
const formatCurrency = (amount: number | string | null, currency: string = 'USD'): string => {
  if (!amount) return 'N/A';
  
  const numericAmount = (Number(amount) / 100).toFixed(2);
  
  if (currency === 'USD') {
    return `$${numericAmount}`;
  } else if (currency === 'INR') {
    return `₹${numericAmount}`;
  } else {
    return `${numericAmount} ${currency}`;
  }
};

const AdminRefundManagement: React.FC = () => {
  // State for data
  const [loading, setLoading] = useState(false);
  const [refunds, setRefunds] = useState<RefundTransaction[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<RefundStats>({
    totalRefunds: 0,
    completedRefunds: 0,
    failedRefunds: 0,
    processingRefunds: 0,
    totalRefundAmount: 0,
    completedRefundAmount: 0
  });

  // Filter states
  const [activeStatus, setActiveStatus] = useState<RefundStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [gateway, setGateway] = useState<'Razorpay' | 'paypal' | ''>('');
  const [initiatedBy, setInitiatedBy] = useState('');

  // View Details popup state
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedRefundDetails, setSelectedRefundDetails] = useState<RefundTransaction | null>(null);
  
  // Copy functionality state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fetch refund statistics
  const fetchRefundStatistics = async () => {
    try {
      const statistics = await getRefundStats();
      setStats(statistics);
    } catch (err: any) {
      console.error('Error fetching refund stats:', err);
    }
  };

  // Fetch refunds based on current filters
  const fetchRefundsData = async () => {
    setLoading(true);
    setError(null);
    setRefunds([]);
    setPagination(null);

    try {
      const paginationParams: PaginationParams = {
        page: currentPage,
        pageSize,
      };

      const filters: RefundFilters = {
        searchTerm: searchTerm || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        gateway: gateway || undefined,
        refund_status: activeStatus || undefined,
        initiated_by: initiatedBy || undefined,
      };

      console.log('🔍 Applying refund filters:', filters);

      const response = await fetchRefunds(paginationParams, filters);

      if (response.success && response.data) {
        console.log('📊 Received refund data:', response.data.refunds);
        setRefunds(response.data.refunds);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to load refund data');
        setRefunds([]);
        setPagination(null);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setRefunds([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle status card click
  const handleStatusChange = (status: RefundStatus | '') => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle filter apply
  const applyFilters = () => {
    setCurrentPage(1);
    fetchRefundsData();
  };

  // Handle filter reset
  const resetFilters = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setGateway('');
    setInitiatedBy('');
    setActiveStatus('');
    setCurrentPage(1);
    setError(null);
    setRefunds([]);
    setPagination(null);
    setTimeout(() => {
      fetchRefundsData();
    }, 0);
  };

  // Open view details popup
  const openDetailsPopup = (refund: RefundTransaction) => {
    setSelectedRefundDetails(refund);
    setShowDetailsPopup(true);
  };

  // Close view details popup
  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedRefundDetails(null);
    setCopiedText(null);
  };

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => {
        setCopiedText(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedText(text);
        setTimeout(() => {
          setCopiedText(null);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchRefundStatistics();
    fetchRefundsData();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    fetchRefundsData();
  }, [activeStatus, currentPage]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-8 sm:px-6 lg:px-16 py-8">
          <div className="max-w-full mx-auto">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
              <p className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">Refund Management</p>
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                ← Back to Payments
              </button>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Refunds Card */}
              <div 
                className={`flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white cursor-pointer hover:shadow-lg transition-shadow ${
                  activeStatus === '' ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleStatusChange('')}
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Total Refunds</p>
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-2xl font-bold leading-tight">
                  {stats.totalRefundAmountINR > 0 && stats.totalRefundAmountUSD > 0
                    ? `${formatCurrency(stats.totalRefundAmountINR, 'INR')} + ${formatCurrency(stats.totalRefundAmountUSD, 'USD')}`
                    : stats.totalRefundAmountINR > 0
                    ? formatCurrency(stats.totalRefundAmountINR, 'INR')
                    : stats.totalRefundAmountUSD > 0
                    ? formatCurrency(stats.totalRefundAmountUSD, 'USD')
                    : '$0.00'
                  }
                </p>
                <p className="text-blue-600 text-xs font-medium">
                  {stats.totalRefunds.toLocaleString()} refund{stats.totalRefunds !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Completed Refunds Card */}
              <div 
                className={`flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white cursor-pointer hover:shadow-lg transition-shadow ${
                  activeStatus === 'completed' ? 'ring-2 ring-green-500 bg-green-50' : ''
                }`}
                onClick={() => handleStatusChange('completed')}
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Completed</p>
                  <CheckCircle className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {stats.completedRefunds.toLocaleString()}
                </p>
                <p className="text-green-600 text-xs font-medium">
                  {stats.completedRefundAmountINR > 0 && stats.completedRefundAmountUSD > 0
                    ? `${formatCurrency(stats.completedRefundAmountINR, 'INR')} + ${formatCurrency(stats.completedRefundAmountUSD, 'USD')} refunded`
                    : stats.completedRefundAmountINR > 0
                    ? `${formatCurrency(stats.completedRefundAmountINR, 'INR')} refunded`
                    : stats.completedRefundAmountUSD > 0
                    ? `${formatCurrency(stats.completedRefundAmountUSD, 'USD')} refunded`
                    : 'N/A refunded'
                  }
                </p>
              </div>

              {/* Processing Refunds Card */}
              <div 
                className={`flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white cursor-pointer hover:shadow-lg transition-shadow ${
                  activeStatus === 'processing' || activeStatus === 'initiated' ? 'ring-2 ring-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => handleStatusChange('processing')}
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Processing</p>
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {stats.processingRefunds.toLocaleString()}
                </p>
                <p className="text-orange-600 text-xs font-medium">In Progress</p>
              </div>

              {/* Failed Refunds Card */}
              <div 
                className={`flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white cursor-pointer hover:shadow-lg transition-shadow ${
                  activeStatus === 'failed' ? 'ring-2 ring-red-500 bg-red-50' : ''
                }`}
                onClick={() => handleStatusChange('failed')}
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Failed</p>
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {stats.failedRefunds.toLocaleString()}
                </p>
                <p className="text-red-600 text-xs font-medium">Need Attention</p>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Filter Refunds</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end mb-6">
                {/* Search */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Search</p>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Refund ID, transaction ID, email..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                
                {/* Gateway */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Gateway</p>
                  <select
                    value={gateway}
                    onChange={(e) => setGateway(e.target.value as 'Razorpay' | 'paypal' | '')}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Gateways</option>
                    <option value="Razorpay">Razorpay</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </label>

                {/* Initiated By */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Initiated By</p>
                  <input
                    type="text"
                    value={initiatedBy}
                    onChange={(e) => setInitiatedBy(e.target.value)}
                    placeholder="Admin name..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={resetFilters}
                    disabled={loading}
                    className="flex items-center justify-center rounded-lg h-11 bg-gray-200 text-gray-700 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-4 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Reset
                  </button>
                  <button 
                    onClick={applyFilters}
                    disabled={loading}
                    className="flex items-center justify-center rounded-lg h-11 bg-blue-600 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-6 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Search'}
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
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Refund ID</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gateway</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Initiated</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Initiated By</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      // Loading rows
                      Array.from({ length: 10 }).map((_, index) => (
                        <tr key={`loading-${index}`} className="animate-pulse hover:bg-gray-50">
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                          <td className="py-4 px-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                          <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                          <td className="py-4 px-4 text-right"><div className="h-4 bg-gray-200 rounded w-20 ml-auto"></div></td>
                        </tr>
                      ))
                    ) : (
                      refunds.length > 0 ? (
                        refunds.map((refund) => {
                          const getStatusInfo = (status: RefundStatus) => {
                            switch (status) {
                              case 'completed':
                                return {
                                  label: 'Completed',
                                  className: 'inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-600',
                                  dotClassName: 'w-1.5 h-1.5 rounded-full bg-green-600'
                                };
                              case 'processing':
                              case 'initiated':
                                return {
                                  label: 'Processing',
                                  className: 'inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-2 py-1 text-xs font-medium text-orange-600',
                                  dotClassName: 'w-1.5 h-1.5 rounded-full bg-orange-600'
                                };
                              case 'failed':
                                return {
                                  label: 'Failed',
                                  className: 'inline-flex items-center gap-1.5 rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-600',
                                  dotClassName: 'w-1.5 h-1.5 rounded-full bg-red-600'
                                };
                              default:
                                return {
                                  label: status,
                                  className: 'inline-flex items-center gap-1.5 rounded-full bg-gray-500/20 px-2 py-1 text-xs font-medium text-gray-600',
                                  dotClassName: 'w-1.5 h-1.5 rounded-full bg-gray-600'
                                };
                            }
                          };

                          const statusInfo = getStatusInfo(refund.refund_status);

                          return (
                            <tr key={refund.refund_id} className="hover:bg-gray-50">
                              {/* Refund ID */}
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2 group">
                                  <span className="text-sm font-mono text-gray-900 cursor-pointer hover:text-blue-600" title={refund.refund_id}>
                                    #{refund.refund_id.substring(0, 8)}...
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(refund.refund_id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                    title="Copy Refund ID"
                                  >
                                    {copiedText === refund.refund_id ? 
                                      <Check className="h-3 w-3 text-green-600" /> : 
                                      <Copy className="h-3 w-3 text-gray-600" />
                                    }
                                  </button>
                                </div>
                              </td>

                              {/* Transaction */}
                              <td className="py-4 px-4">
                                <div className="text-sm font-mono text-gray-900">
                                  {refund.transaction_id && `#${refund.transaction_id.substring(0, 8)}...`}
                                  {refund.payment_id && !refund.transaction_id && `#${refund.payment_id.substring(0, 8)}...`}
                                  {!refund.transaction_id && !refund.payment_id && 'N/A'}
                                </div>
                              </td>

                              {/* Customer */}
                              <td className="py-4 px-4 text-sm text-gray-600">
                                <div>
                                  <div className="font-medium">{refund.customer_name || 'N/A'}</div>
                                  <div className="text-xs text-gray-500">{refund.customer_email || 'N/A'}</div>
                                </div>
                              </td>

                              {/* Amount */}
                              <td className="py-4 px-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatCurrency(refund.refund_amount, refund.currency)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  of {formatCurrency(refund.original_amount, refund.currency)}
                                </div>
                              </td>

                              {/* Gateway */}
                              <td className="py-4 px-4 text-sm text-gray-600">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  refund.gateway === 'Razorpay' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : refund.gateway === 'paypal' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {refund.gateway === 'Razorpay' ? 'Razorpay' : refund.gateway === 'paypal' ? 'PayPal' : refund.gateway}
                                </span>
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4">
                                <span className={statusInfo.className}>
                                  <span className={statusInfo.dotClassName}></span>
                                  {statusInfo.label}
                                </span>
                              </td>

                              {/* Initiated */}
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {new Date(refund.initiated_at).toLocaleDateString()}
                              </td>

                              {/* Initiated By */}
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {refund.initiated_by || 'N/A'}
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-4 text-right">
                                <button 
                                  onClick={() => openDetailsPopup(refund)}
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-gray-500 text-sm">
                            No refunds found for the current filters
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {pagination && (
                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-gray-600">
                    Showing {((pagination.currentPage - 1) * pageSize) + 1} to {Math.min(pagination.currentPage * pageSize, pagination.totalRecords)} of {pagination.totalRecords} refunds
                  </span>
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center rounded-lg h-9 w-9 border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    {/* Page Number Buttons */}
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
                        
                        {currentPage > 4 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        
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
                        
                        {currentPage < pagination.totalPages - 3 && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        
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
                    
                    {/* Next Button */}
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

            {/* View Details Popup */}
            {showDetailsPopup && selectedRefundDetails && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-900">Refund Details</h3>
                      <button
                        onClick={closeDetailsPopup}
                        className="text-gray-400 hover:text-gray-600 text-2xl font-semibold"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    {/* Refund Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Refund Overview</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="break-words col-span-full">
                          <p className="text-sm font-medium text-gray-600 mb-1">Refund ID</p>
                          <div className="flex items-start gap-2 bg-white p-2 rounded border">
                            <p className="text-sm font-mono text-gray-900 break-all flex-1">{selectedRefundDetails.refund_id}</p>
                            <button 
                              onClick={() => copyToClipboard(selectedRefundDetails.refund_id)}
                              className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                              title="Copy Refund ID"
                            >
                              {copiedText === selectedRefundDetails.refund_id ? 
                                <Check className="h-3 w-3 text-green-600" /> : 
                                <Copy className="h-3 w-3 text-gray-600" />
                              }
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Refund Amount</p>
                          <p className="text-lg font-bold text-red-600">{formatCurrency(selectedRefundDetails.refund_amount, selectedRefundDetails.currency)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Original Amount</p>
                          <p className="text-sm text-gray-900">{formatCurrency(selectedRefundDetails.original_amount, selectedRefundDetails.currency)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Gateway</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            selectedRefundDetails.gateway === 'Razorpay' ? 'bg-blue-100 text-blue-800' :
                            selectedRefundDetails.gateway === 'paypal' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedRefundDetails.gateway}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Status</p>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            selectedRefundDetails.refund_status === 'completed' ? 'bg-green-100 text-green-800' :
                            selectedRefundDetails.refund_status === 'processing' || selectedRefundDetails.refund_status === 'initiated' ? 'bg-orange-100 text-orange-800' :
                            selectedRefundDetails.refund_status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedRefundDetails.refund_status}
                          </span>
                        </div>
                        <div className="break-words col-span-full">
                          <p className="text-sm font-medium text-gray-600 mb-1">Gateway Refund ID</p>
                          <p className="text-sm font-mono text-gray-900 break-all bg-white p-2 rounded border">
                            {selectedRefundDetails.gateway_refund_id || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Name</p>
                          <p className="text-sm text-gray-900">{selectedRefundDetails.customer_name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Email</p>
                          <p className="text-sm text-gray-900">{selectedRefundDetails.customer_email || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Mobile</p>
                          <p className="text-sm text-gray-900">{selectedRefundDetails.customer_mobile || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-purple-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Transaction Details</h4>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="break-words">
                            <p className="text-sm font-medium text-gray-600 mb-1">Transaction ID</p>
                            <p className="text-sm font-mono text-gray-900 break-all bg-white p-2 rounded border">
                              {selectedRefundDetails.transaction_id || 'N/A'}
                            </p>
                          </div>
                          <div className="break-words">
                            <p className="text-sm font-medium text-gray-600 mb-1">Payment ID</p>
                            <p className="text-sm font-mono text-gray-900 break-all bg-white p-2 rounded border">
                              {selectedRefundDetails.payment_id || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="break-words">
                            <p className="text-sm font-medium text-gray-600 mb-1">Order ID</p>
                            <p className="text-sm font-mono text-gray-900 break-all bg-white p-2 rounded border">
                              {selectedRefundDetails.order_id || 'N/A'}
                            </p>
                          </div>
                          <div className="break-words">
                            <p className="text-sm font-medium text-gray-600 mb-1">Session ID</p>
                            <p className="text-sm font-mono text-gray-900 break-all bg-white p-2 rounded border">
                              {selectedRefundDetails.session_id || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Admin Information */}
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Admin Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Initiated By</p>
                          <p className="text-sm text-gray-900">{selectedRefundDetails.initiated_by}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Initiated At</p>
                          <p className="text-sm text-gray-900">{new Date(selectedRefundDetails.initiated_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Reason</p>
                          <p className="text-sm text-gray-900">{selectedRefundDetails.reason || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Admin Notes</p>
                          <p className="text-sm text-gray-900">{selectedRefundDetails.admin_notes || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Initiated At</p>
                          <p className="text-sm text-gray-900">{new Date(selectedRefundDetails.initiated_at).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Processed At</p>
                          <p className="text-sm text-gray-900">
                            {selectedRefundDetails.processed_at ? new Date(selectedRefundDetails.processed_at).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Completed At</p>
                          <p className="text-sm text-gray-900">
                            {selectedRefundDetails.completed_at ? new Date(selectedRefundDetails.completed_at).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Errors (if any) */}
                    {(selectedRefundDetails.error_message || selectedRefundDetails.gateway_error) && (
                      <div className="bg-red-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-red-900 mb-3">Error Information</h4>
                        {selectedRefundDetails.error_message && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-600">Error Message</p>
                            <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{selectedRefundDetails.error_message}</p>
                          </div>
                        )}
                        {selectedRefundDetails.gateway_error && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Gateway Error</p>
                            <p className="text-sm text-red-600 bg-red-100 p-2 rounded">{selectedRefundDetails.gateway_error}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Gateway Response (if available) */}
                    {selectedRefundDetails.gateway_response && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Gateway Response</h4>
                        <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                          {JSON.stringify(selectedRefundDetails.gateway_response, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                    <button
                      onClick={closeDetailsPopup}
                      className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminRefundManagement;