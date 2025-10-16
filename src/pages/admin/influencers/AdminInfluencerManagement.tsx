import React, { useState, useEffect } from 'react';
import { fetchInfluencers, deleteInfluencer, getInfluencerStats, generateAffiliateCode } from '@/services/admin-influencers';
import type { InfluencerFilters, PaginationParams, InfluencerData, InfluencerStats } from '@/services/admin-influencers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, TrendingUp, DollarSign, MousePointer, ChevronLeft, ChevronRight, Trash2, AlertTriangle, Eye, Plus, Activity } from 'lucide-react';
import { toast } from 'sonner';
import AddInfluencerPopup from './AddInfluencerPopup';
import ViewInfluencerPopup from './ViewInfluencerPopup';
import { supabase } from '@/integrations/supabase/client';
import { getExchangeRate } from '@/services/commission';

const AdminInfluencerManagement: React.FC = () => {
  // State for data
  const [loading, setLoading] = useState(false);
  const [influencers, setInfluencers] = useState<InfluencerData[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<InfluencerStats>({ 
    totalInfluencers: 0,
    activeInfluencers: 0,
    totalRevenue: 0,
    totalCommissions: 0,
    totalClicks: 0,
    totalSignups: 0,
    totalQuestionnaires: 0,
    totalPurchases: 0,
    averageConversionRate: 0,
  });
  
  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'suspended' | ''>('');
  const [minEarnings, setMinEarnings] = useState<number | null>(null);
  const [maxEarnings, setMaxEarnings] = useState<number | null>(null);
  
  // Applied filters (only updated when Search button is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    status: '' as 'active' | 'inactive' | 'suspended' | '',
    minEarnings: null as number | null,
    maxEarnings: null as number | null,
  });
  
  // Popup states
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<InfluencerData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(83.50); // Default fallback

  // Fetch exchange rate from database
  const fetchExchangeRate = async () => {
    try {
      const rate = await getExchangeRate();
      setExchangeRate(rate);
      console.log('💱 Exchange rate loaded for admin:', rate);
    } catch (err: any) {
      console.error('Error fetching exchange rate:', err);
      // Fallback rate already set in state
    }
  };

  // Fetch influencer statistics
  const fetchInfluencerStats = async () => {
    try {
      const statistics = await getInfluencerStats();
      setStats(statistics);
    } catch (err: any) {
      console.error('Error fetching influencer stats:', err);
    }
  };

  // Fetch influencers based on applied filters
  const fetchInfluencersData = async () => {
    setLoading(true);
    setError(null);
    setInfluencers([]);
    setPagination(null);

    try {
      const paginationParams: PaginationParams = {
        page: currentPage,
        pageSize,
      };

      const filters: InfluencerFilters = {
        searchTerm: appliedFilters.searchTerm || undefined,
        status: appliedFilters.status || undefined,
        minEarnings: appliedFilters.minEarnings !== null ? appliedFilters.minEarnings : undefined,
        maxEarnings: appliedFilters.maxEarnings !== null ? appliedFilters.maxEarnings : undefined,
      };

      console.log('🔍 Applying filters:', filters);

      const response = await fetchInfluencers(paginationParams, filters);

      if (response.success && response.data) {
        setInfluencers(response.data.influencers);
        setPagination(response.data.pagination);
      } else {
        setError(response.error || 'Failed to load influencer data');
        setInfluencers([]);
        setPagination(null);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setInfluencers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle filter apply
  const applyFilters = () => {
    console.log('🔄 Apply Filters Clicked');
    
    const newAppliedFilters = {
      searchTerm,
      status: statusFilter,
      minEarnings,
      maxEarnings,
    };
    
    setAppliedFilters(newAppliedFilters);
    setCurrentPage(1);
    console.log('📝 Setting Applied Filters:', newAppliedFilters);
  };

  // Handle filter reset
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setMinEarnings(null);
    setMaxEarnings(null);
    
    setAppliedFilters({
      searchTerm: '',
      status: '',
      minEarnings: null,
      maxEarnings: null,
    });
    
    setCurrentPage(1);
    setError(null);
    setInfluencers([]);
    setPagination(null);
  };

  // Open delete confirmation popup
  const openDeletePopup = (influencer: InfluencerData) => {
    setSelectedInfluencer(influencer);
    setShowDeletePopup(true);
  };

  // Close delete confirmation popup
  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedInfluencer(null);
  };

  // Open view popup
  const openViewPopup = (influencer: InfluencerData) => {
    setSelectedInfluencer(influencer);
    setShowViewPopup(true);
  };

  // Close view popup
  const closeViewPopup = () => {
    setShowViewPopup(false);
    setSelectedInfluencer(null);
  };

  // Process delete
  const processDelete = async () => {
    if (!selectedInfluencer) return;
    
    setDeleting(true);
    try {
      const response = await deleteInfluencer(selectedInfluencer.id);
      
      if (response.success) {
        toast.success('Influencer deleted successfully', {
          description: 'Influencer and all related records have been removed.'
        });
        closeDeletePopup();
        fetchInfluencersData();
        fetchInfluencerStats();
      } else {
        toast.error('Failed to delete influencer', {
          description: response.error || 'An unknown error occurred'
        });
        setError(response.error || 'Failed to delete influencer');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete influencer', {
        description: error.message || 'An unexpected error occurred'
      });
      setError(error.message || 'Failed to delete influencer');
    } finally {
      setDeleting(false);
    }
  };

  // Handle influencer created
  const handleInfluencerCreated = () => {
    setShowAddPopup(false);
    fetchInfluencersData();
    fetchInfluencerStats();
  };

  // Handle influencer updated
  const handleInfluencerUpdated = () => {
    setShowViewPopup(false);
    setSelectedInfluencer(null);
    fetchInfluencersData();
    fetchInfluencerStats();
  };

  // Load initial data
  useEffect(() => {
    fetchExchangeRate();
    fetchInfluencerStats();
    fetchInfluencersData();
  }, []);

  // Fetch data when page changes
  useEffect(() => {
    if (currentPage > 1 || (currentPage === 1 && pagination && pagination.totalPages > 1)) {
      fetchInfluencersData();
    }
  }, [currentPage]);

  // Fetch data when filters are applied
  useEffect(() => {
    if (currentPage === 1) {
      fetchInfluencersData();
    }
  }, [appliedFilters]);

  // Convert USD to INR
  const convertUSDtoINR = (amountInUSD: number): number => {
    return amountInUSD * exchangeRate;
  };

  // Format currency (converts USD to INR for display)
  const formatCurrency = (amountInUSD: number) => {
    const amountInINR = convertUSDtoINR(amountInUSD);
    return `₹${amountInINR.toFixed(2)}`;
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get public URL for profile image
  const getProfileImageUrl = (storagePath: string | null): string | null => {
    if (!storagePath) return null;
    
    // If it's already a full URL, return it
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      return storagePath;
    }
    
    // Otherwise, generate public URL from storage path
    const { data } = supabase.storage
      .from('website-images')
      .getPublicUrl(storagePath);
    
    return data?.publicUrl || null;
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-8 sm:px-6 lg:px-16 py-8">
          <div className="max-w-full mx-auto">
            {/* Header with Add Button */}
            <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
              <p className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">Influencer Management</p>
              <button
                onClick={() => setShowAddPopup(true)}
                className="flex items-center justify-center gap-2 rounded-lg h-11 bg-blue-600 text-white px-6 text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Influencer
              </button>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Influencers */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Total Influencers</p>
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {stats.totalInfluencers.toLocaleString()}
                </p>
              </div>

              {/* Active Influencers */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Active</p>
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {stats.activeInfluencers.toLocaleString()}
                </p>
              </div>

              {/* Total Revenue */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Total Revenue</p>
                  <DollarSign className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>

              {/* Total Commissions */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Commissions Paid</p>
                  <TrendingUp className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {formatCurrency(stats.totalCommissions)}
                </p>
              </div>
            </div>

            {/* Additional Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Questionnaires */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Total Questionnaires</p>
                  <MousePointer className="h-6 w-6 text-indigo-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">
                  {stats.totalQuestionnaires.toLocaleString()}
                </p>
              </div>

              {/* Total Signups */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Total Signups</p>
                  <Users className="h-6 w-6 text-cyan-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">
                  {stats.totalSignups.toLocaleString()}
                </p>
              </div>

              {/* Total Purchases */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Total Purchases</p>
                  <DollarSign className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">
                  {stats.totalPurchases.toLocaleString()}
                </p>
              </div>

              {/* Avg Conversion Rate */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Avg Conversion</p>
                  <TrendingUp className="h-6 w-6 text-pink-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">
                  {stats.averageConversionRate.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Filter Influencers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-6">
                {/* Search */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Search</p>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Name, email, code..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                
                {/* Status Filter */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Status</p>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </label>
                
                {/* Min Earnings */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Min Earnings</p>
                  <input
                    type="number"
                    value={minEarnings || ''}
                    onChange={(e) => setMinEarnings(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Min amount..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                
                {/* Max Earnings */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Max Earnings</p>
                  <input
                    type="number"
                    value={maxEarnings || ''}
                    onChange={(e) => setMaxEarnings(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="Max amount..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  onClick={resetFilters}
                  disabled={loading}
                  className="flex items-center justify-center rounded-lg h-11 bg-gray-200 text-gray-700 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-6 hover:bg-gray-300 disabled:opacity-50"
                >
                  Reset
                </button>
                <button 
                  onClick={applyFilters}
                  disabled={loading}
                  className="flex items-center justify-center rounded-lg h-11 bg-blue-600 text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-8 hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                  <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Data Table */}
              <div className="overflow-x-auto mt-6">
                <table className="w-full text-left">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Affiliate Code
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Commission %
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Earnings
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                        Questionnaires/Signups/Paid
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      // Loading rows
                      Array.from({ length: 10 }).map((_, index) => (
                        <tr key={`loading-${index}`} className="animate-pulse hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-40"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      influencers.length > 0 ? influencers.map((influencer) => (
                        <tr key={influencer.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {influencer.profile_image && getProfileImageUrl(influencer.profile_image) ? (
                                <img 
                                  src={getProfileImageUrl(influencer.profile_image)!} 
                                  alt={influencer.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <Users className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                              <span className="text-sm font-medium text-gray-900">{influencer.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {influencer.email}
                          </td>
                          <td className="py-4 px-4 text-sm font-mono text-gray-900">
                            {influencer.affiliate_code}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {influencer.commission_rate}%
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(influencer.status)}`}>
                              {influencer.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">
                            {formatCurrency(influencer.total_earnings)}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-900">
                            {influencer.total_questionnaires} / {influencer.total_signups} / {influencer.total_purchases}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => openViewPopup(influencer)}
                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                              >
                                <Eye className="h-4 w-4" />
                                View
                              </button>
                              <button 
                                onClick={() => openDeletePopup(influencer)}
                                className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-gray-500 text-sm">
                            No influencers found
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
                    Showing {((pagination.currentPage - 1) * pageSize) + 1} to {Math.min(pagination.currentPage * pageSize, pagination.totalRecords)} of {pagination.totalRecords} influencers
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

            {/* Delete Confirmation Popup */}
            {showDeletePopup && selectedInfluencer && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Delete Influencer</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete this influencer? This action cannot be undone and will also:
                  </p>
                  <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1 bg-yellow-50 p-3 rounded border border-yellow-200">
                    <li>Remove all tracking events</li>
                    <li>Delete all payout records</li>
                    <li>Remove affiliate code from summaries</li>
                  </ul>
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="font-medium text-sm">Influencer: <span className="text-gray-900">{selectedInfluencer.name}</span></p>
                    <p className="text-xs text-gray-500 mt-1">Code: {selectedInfluencer.affiliate_code}</p>
                    <p className="text-xs text-gray-500">Email: {selectedInfluencer.email}</p>
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
                      {deleting ? 'Deleting...' : 'Delete Influencer'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Influencer Popup */}
      {showAddPopup && (
        <AddInfluencerPopup
          isOpen={showAddPopup}
          onClose={() => setShowAddPopup(false)}
          onSuccess={handleInfluencerCreated}
        />
      )}

      {/* View Influencer Popup */}
      {showViewPopup && selectedInfluencer && (
        <ViewInfluencerPopup
          isOpen={showViewPopup}
          influencer={selectedInfluencer}
          onClose={closeViewPopup}
          onUpdate={handleInfluencerUpdated}
        />
      )}
    </div>
  );
};

export default AdminInfluencerManagement;
