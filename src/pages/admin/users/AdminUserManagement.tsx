import React, { useState, useEffect } from 'react';
import { fetchUsers, deleteUser, getUserStats, fetchUsersWithDuplicateDetection, getTotalUniqueUsersCount } from '@/services/admin-users';
import type { UserFilters, PaginationParams, UserData, UsersResponse, UserStats, UserDataWithDuplicateInfo } from '@/services/admin-users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, UserCheck, Activity, BarChart3, ChevronLeft, ChevronRight, Trash2, AlertTriangle, Copy, Check, UserX, Shield } from 'lucide-react';
import { toast } from 'sonner';
import DuplicateManagementPopup from '@/components/admin/DuplicateManagementPopup';

const AdminUserManagement: React.FC = () => {
  // State for data
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserDataWithDuplicateInfo[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats>({ 
    totalUsers: 0, 
    anonymousUsers: 0, 
    activeUsers: 0, 
    totalGenerations: 0 
  });
  const [filteredStats, setFilteredStats] = useState<UserStats | null>(null); // NEW: Filtered statistics
  const [uniqueUsersCount, setUniqueUsersCount] = useState(0);
  const [filteredUniqueUsersCount, setFilteredUniqueUsersCount] = useState<number | null>(null); // NEW: Filtered unique count
  
  // State for applied filters (only updated when Search button is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    searchTerm: '',
    excludeTerm: '',
    dateFrom: '',
    dateTo: '',
    isAnonymous: null as boolean | null,
    gender: '',
    ageFrom: null as number | null,
    ageTo: null as number | null,
    minPaidGeneration: null as number | null,
    maxPaidGeneration: null as number | null,
  });
  
  // State for duplicate management
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [selectedGroupKey, setSelectedGroupKey] = useState('');
  const [selectedPrimaryUserName, setSelectedPrimaryUserName] = useState('');
  const [selectedDuplicateCount, setSelectedDuplicateCount] = useState(0);

  // Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Fixed at 10 per page
  const [searchTerm, setSearchTerm] = useState('');
  const [excludeTerm, setExcludeTerm] = useState(''); // NEW: Exclusion filter
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isAnonymous, setIsAnonymous] = useState<boolean | null>(null);
  const [gender, setGender] = useState('');
  const [ageFrom, setAgeFrom] = useState<number | null>(null); // NEW: Starting age
  const [ageTo, setAgeTo] = useState<number | null>(null); // NEW: Ending age
  const [minPaidGeneration, setMinPaidGeneration] = useState<number | null>(null); // NEW: Min paid generations
  const [maxPaidGeneration, setMaxPaidGeneration] = useState<number | null>(null); // NEW: Max paid generations
  
  // Delete confirmation popup state
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Copy functionality state
  const [copiedUserId, setCopiedUserId] = useState<string | null>(null);

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const statistics = await getUserStats();
      setStats(statistics);
    } catch (err: any) {
      console.error('Error fetching user stats:', err);
    }
  };

  // Fetch total unique users count
  const fetchUniqueUsersCount = async () => {
    try {
      const uniqueCount = await getTotalUniqueUsersCount();
      setUniqueUsersCount(uniqueCount);
    } catch (err: any) {
      console.error('Error fetching unique users count:', err);
      setUniqueUsersCount(0);
    }
  };

  // Fetch users based on applied filters (for initial load)
  const fetchUsersData = async () => {
    fetchUsersDataWithFilters(appliedFilters);
  };

  // Fetch users with specific filter values
  const fetchUsersDataWithFilters = async (filterValues: {
    searchTerm: string;
    excludeTerm: string;
    dateFrom: string;
    dateTo: string;
    isAnonymous: boolean | null;
    gender: string;
    ageFrom: number | null;
    ageTo: number | null;
    minPaidGeneration?: number | null;
    maxPaidGeneration?: number | null;
  }) => {
    setLoading(true);
    setError(null);
    setUsers([]);
    setPagination(null);

    try {
      const paginationParams: PaginationParams = {
        page: currentPage,
        pageSize,
      };

      const filters: UserFilters = {
        searchTerm: filterValues.searchTerm || undefined,
        excludeTerm: filterValues.excludeTerm || undefined,
        dateFrom: filterValues.dateFrom || undefined,
        dateTo: filterValues.dateTo || undefined,
        isAnonymous: filterValues.isAnonymous,
        gender: filterValues.gender || undefined,
        ageFrom: filterValues.ageFrom,
        ageTo: filterValues.ageTo,
        minPaidGeneration: filterValues.minPaidGeneration,
        maxPaidGeneration: filterValues.maxPaidGeneration,
      };

      console.log('🔍 Applying filters:', filters);

      // Use duplicate detection for fetching users
      const response = await fetchUsersWithDuplicateDetection(paginationParams, filters);

      if (response.success && response.data) {
        console.log('📊 Fetched Users Data:', {
          totalUsers: response.data.users.length,
          anonymousCount: response.data.users.filter(u => 
            u.is_anonymous === 'TRUE' || 
            u.is_anonymous === 'true' || 
            u.is_anonymous === '1' ||
            (typeof u.is_anonymous === 'boolean' && u.is_anonymous === true)
          ).length,
          sampleAnonymousFields: response.data.users.slice(0, 5).map(u => ({
            name: u.user_name,
            is_anonymous: u.is_anonymous,
            type: typeof u.is_anonymous
          }))
        });
        setUsers(response.data.users);
        setPagination(response.data.pagination);
        
        // Set filtered statistics if available
        console.log('📋 API Response - filteredStats:', response.data.filteredStats);
        
        if (response.data.filteredStats) {
          console.log('🟢 Setting filtered stats:', response.data.filteredStats);
          setFilteredStats(response.data.filteredStats);
          setFilteredUniqueUsersCount(response.data.filteredStats.totalUsers); // For now, use total as unique count
        } else {
          console.log('🔴 No filtered stats in response, clearing filtered stats');
          setFilteredStats(null);
          setFilteredUniqueUsersCount(null);
        }
      } else {
        setError(response.error || 'Failed to load user data');
        setUsers([]);
        setPagination(null);
        setFilteredStats(null);
        setFilteredUniqueUsersCount(null);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setUsers([]);
      setPagination(null);
      setUniqueUsersCount(0);
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
    console.log('🔄 Apply Filters Clicked - Input Values:', {
      searchTerm,
      excludeTerm,
      dateFrom,
      dateTo,
      isAnonymous,
      gender,
      ageFrom,
      ageTo,
      minPaidGeneration,
      maxPaidGeneration,
    });
    
    const newAppliedFilters = {
      searchTerm,
      excludeTerm,
      dateFrom,
      dateTo,
      isAnonymous,
      gender,
      ageFrom,
      ageTo,
      minPaidGeneration,
      maxPaidGeneration,
    };
    
    // Update applied filters state with current input values
    setAppliedFilters(newAppliedFilters);
    setCurrentPage(1);
    
    console.log('📝 Setting Applied Filters:', newAppliedFilters);
    console.log('📊 Should have active filters:', !!(newAppliedFilters.searchTerm || newAppliedFilters.excludeTerm || newAppliedFilters.dateFrom || 
              newAppliedFilters.dateTo || newAppliedFilters.isAnonymous !== null || newAppliedFilters.gender || 
              newAppliedFilters.ageFrom || newAppliedFilters.ageTo || newAppliedFilters.minPaidGeneration || newAppliedFilters.maxPaidGeneration));
    
    // Use the current input values for immediate API call
    fetchUsersDataWithFilters(newAppliedFilters);
  };

  // Handle filter reset
  const resetFilters = () => {
    // Clear input states
    setSearchTerm('');
    setExcludeTerm('');
    setDateFrom('');
    setDateTo('');
    setIsAnonymous(null);
    setGender('');
    setAgeFrom(null);
    setAgeTo(null);
    setMinPaidGeneration(null);
    setMaxPaidGeneration(null);
    
    // Clear applied filters
    setAppliedFilters({
      searchTerm: '',
      excludeTerm: '',
      dateFrom: '',
      dateTo: '',
      isAnonymous: null,
      gender: '',
      ageFrom: null,
      ageTo: null,
      minPaidGeneration: null,
      maxPaidGeneration: null,
    });
    
    setCurrentPage(1);
    setError(null);
    setUsers([]);
    setPagination(null);
    setFilteredStats(null);
    setFilteredUniqueUsersCount(null);
    
    // Fetch data with empty filters
    setTimeout(() => {
      fetchUsersDataWithFilters({
        searchTerm: '',
        excludeTerm: '',
        dateFrom: '',
        dateTo: '',
        isAnonymous: null,
        gender: '',
        ageFrom: null,
        ageTo: null,
        minPaidGeneration: null,
        maxPaidGeneration: null,
      });
    }, 0);
  };

  // Open delete confirmation popup
  const openDeletePopup = (user: UserData) => {
    setSelectedUser(user);
    setShowDeletePopup(true);
  };

  // Close delete confirmation popup
  const closeDeletePopup = () => {
    setShowDeletePopup(false);
    setSelectedUser(null);
  };

  // Copy to clipboard function
  const copyToClipboard = async (userId: string) => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopiedUserId(userId);
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedUserId(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy user ID: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = userId;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedUserId(userId);
        setTimeout(() => {
          setCopiedUserId(null);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };
  
  // Open duplicate management popup
  const openDuplicatePopup = (user: UserDataWithDuplicateInfo) => {
    // Use the groupKey from the user data (should be IP-based)
    let groupKey = user.groupKey || '';
    if (!groupKey) {
      // Fallback - this shouldn't happen if duplicate detection is working
      groupKey = `unique:${user.user_id}`;
      console.warn('No groupKey found for duplicate user, using fallback:', user.user_id);
    }
    
    setSelectedGroupKey(groupKey);
    setSelectedPrimaryUserName(user.user_name || user.email || 'Anonymous User');
    setSelectedDuplicateCount(user.duplicateCount || 1);
    setShowDuplicatePopup(true);
  };

  // Close duplicate management popup
  const closeDuplicatePopup = () => {
    setShowDuplicatePopup(false);
    setSelectedGroupKey('');
    setSelectedPrimaryUserName('');
    setSelectedDuplicateCount(0);
  };

  // Handle merge completion
  const handleMergeComplete = () => {
    // Refresh data after merge
    fetchUsersData();
    fetchUserStats();
    fetchUniqueUsersCount();
  };
  
  // Process delete
  const processDelete = async () => {
    if (!selectedUser) return;
    
    setDeleting(true);
    try {
      const response = await deleteUser(selectedUser.user_id);
      
      if (response.success) {
        toast.success('User deleted successfully', {
          description: 'User and all related records have been removed.'
        });
        closeDeletePopup();
        // Refresh data
        fetchUsersData();
        fetchUserStats();
        fetchUniqueUsersCount();
      } else {
        toast.error('Failed to delete user', {
          description: response.error || 'An unknown error occurred'
        });
        setError(response.error || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('Failed to delete user', {
        description: error.message || 'An unexpected error occurred'
      });
      setError(error.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  // Helper function to check if any filters are active (based on applied filters, not input states)
  const hasActiveFilters = () => {
    const hasFilters = !!(appliedFilters.searchTerm || appliedFilters.excludeTerm || appliedFilters.dateFrom || 
              appliedFilters.dateTo || appliedFilters.isAnonymous !== null || appliedFilters.gender || 
              appliedFilters.ageFrom || appliedFilters.ageTo || appliedFilters.minPaidGeneration || appliedFilters.maxPaidGeneration);
    
    console.log('🔍 hasActiveFilters check:', {
      appliedFilters,
      hasFilters,
      filteredStats,
      shouldShowFilteredStats: filteredStats && hasFilters
    });
    
    return hasFilters;
  };

  // Load initial data
  useEffect(() => {
    fetchUserStats();
    fetchUniqueUsersCount();
    fetchUsersData();
  }, []);

  // Fetch data when page changes (except for the initial page 1 load)
  useEffect(() => {
    // Only fetch if currentPage > 1 OR if we're going back to page 1 from another page
    // We can detect this by checking if we have pagination data (meaning we've loaded before)
    if (currentPage > 1 || (currentPage === 1 && pagination && pagination.totalPages > 1)) {
      fetchUsersData();
    }
  }, [currentPage]);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-gray-50">
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-8 sm:px-6 lg:px-16 py-8">
          <div className="max-w-full mx-auto">
            <div className="flex flex-wrap justify-between items-center gap-3 mb-8">
              <p className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">User Management</p>
            </div>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {/* Total Users Card */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Total Users</p>
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {(filteredStats && hasActiveFilters() ? filteredStats.totalUsers : stats.totalUsers).toLocaleString()}
                </p>
                {hasActiveFilters() && (
                  <p className="text-blue-600 text-xs font-medium">Filtered Results</p>
                )}
              </div>

              {/* Anonymous Users Card */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Anonymous</p>
                  <UserCheck className="h-6 w-6 text-orange-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {(filteredStats && hasActiveFilters() ? filteredStats.anonymousUsers : stats.anonymousUsers).toLocaleString()}
                </p>
                {hasActiveFilters() && (
                  <p className="text-blue-600 text-xs font-medium">Filtered Results</p>
                )}
              </div>

              {/* Active Users Card */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Active (30d)</p>
                  <Activity className="h-6 w-6 text-green-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {(filteredStats && hasActiveFilters() ? filteredStats.activeUsers : stats.activeUsers).toLocaleString()}
                </p>
                {hasActiveFilters() && (
                  <p className="text-blue-600 text-xs font-medium">Filtered Results</p>
                )}
              </div>

              {/* Unique Users Card */}
              <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Unique Users</p>
                  <Shield className="h-6 w-6 text-indigo-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {(filteredUniqueUsersCount !== null && hasActiveFilters() ? filteredUniqueUsersCount : uniqueUsersCount).toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {hasActiveFilters() ? 'Filtered results' : 'After duplicate detection'}
                </p>
                {hasActiveFilters() && (
                  <p className="text-blue-600 text-xs font-medium">Filtered Results</p>
                )}
              </div>

              {/* Total Generations Card */}
              <div 
                className={`flex flex-col gap-2 rounded-xl p-6 border cursor-pointer transition-colors duration-200 ${
                  appliedFilters.minPaidGeneration 
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-200 bg-white hover:bg-purple-50 hover:border-purple-300'
                }`}
                onClick={() => {
                  // Filter to show only users with paid generations
                  setSearchTerm('');
                  setExcludeTerm('');
                  setDateFrom('');
                  setDateTo('');
                  setIsAnonymous(null);
                  setGender('');
                  setAgeFrom(null);
                  setAgeTo(null);
                  setMinPaidGeneration(1); // Set minimum paid generations to 1
                  setMaxPaidGeneration(null);
                  
                  // Apply filters immediately
                  const paidUserFilters = {
                    searchTerm: '',
                    excludeTerm: '',
                    dateFrom: '',
                    dateTo: '',
                    isAnonymous: null,
                    gender: '',
                    ageFrom: null,
                    ageTo: null,
                    minPaidGeneration: 1,
                    maxPaidGeneration: null,
                  };
                  
                  setAppliedFilters(paidUserFilters);
                  setCurrentPage(1);
                  
                  // Fetch users with paid generations
                  fetchUsersDataWithFilters(paidUserFilters);
                }}
                title="Click to show only users with paid generations"
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 text-base font-medium leading-normal">Total Paid Gen.</p>
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-gray-900 tracking-tight text-4xl font-bold leading-tight">
                  {(filteredStats && hasActiveFilters() ? filteredStats.totalGenerations : stats.totalGenerations).toLocaleString()}
                </p>
                {appliedFilters.minPaidGeneration ? (
                  <p className="text-purple-600 text-xs font-medium">Showing Paid Users Only</p>
                ) : hasActiveFilters() ? (
                  <p className="text-blue-600 text-xs font-medium">Filtered Results</p>
                ) : null}
              </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
              <h2 className="text-gray-900 text-xl font-bold leading-tight tracking-[-0.015em] mb-4">Filter Users</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end mb-6">
                {/* Search */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Search</p>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Name, email, user ID, mobile..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                
                {/* User Type */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">User Type</p>
                  <select
                    value={isAnonymous === null ? '' : isAnonymous.toString()}
                    onChange={(e) => setIsAnonymous(e.target.value === '' ? null : e.target.value === 'true')}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Users</option>
                    <option value="false">Registered</option>
                    <option value="true">Anonymous</option>
                  </select>
                </label>
                
                {/* Exclusion Filter */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Exclude Filter</p>
                  <input
                    type="text"
                    value={excludeTerm}
                    onChange={(e) => setExcludeTerm(e.target.value)}
                    placeholder="Exclude matching data..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                
                {/* Gender */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Gender</p>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </label>
                
                {/* Age Range */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Age From</p>
                  <input
                    type="number"
                    value={ageFrom || ''}
                    onChange={(e) => setAgeFrom(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Min age..."
                    min="0"
                    max="120"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Age To</p>
                  <input
                    type="number"
                    value={ageTo || ''}
                    onChange={(e) => setAgeTo(e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="Max age..."
                    min="0"
                    max="120"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                
                {/* Last Used From */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Last Used From</p>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </label>
                
                {/* Last Used To */}
                <label className="flex flex-col">
                  <p className="text-gray-700 text-sm font-medium leading-normal pb-2">Last Used To</p>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
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
                        User ID
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        City
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Generations
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Last Used
                      </th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Type
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
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-32"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-10"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-12"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      // Render users (no fixed row count)
                      users.length > 0 ? users.map((user, index) => {
                        if (user) {
                          // Check if user is anonymous - handle various possible values
                          const isAnonymous = user.is_anonymous === 'TRUE' || 
                                             user.is_anonymous === 'true' || 
                                             user.is_anonymous === '1' ||
                                             (typeof user.is_anonymous === 'boolean' && user.is_anonymous === true);
                          
                          // Calculate age from date of birth (handles both date strings and simple age numbers)
                          const calculateAge = (dob: string | null): number | null => {
                            if (!dob) return null;
                            
                            // Check if dob is already a simple number (age)
                            const numericAge = parseInt(dob);
                            if (!isNaN(numericAge) && numericAge > 0 && numericAge < 150) {
                              return numericAge;
                            }
                            
                            // Try to parse as date
                            const birthDate = new Date(dob);
                            if (isNaN(birthDate.getTime())) {
                              // Invalid date, return null
                              return null;
                            }
                            
                            const today = new Date();
                            let age = today.getFullYear() - birthDate.getFullYear();
                            const monthDiff = today.getMonth() - birthDate.getMonth();
                            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                              age--;
                            }
                            return age;
                          };
                          
                          const userAge = calculateAge(user.dob);
                          
                          // Debug log for first few users
                          if (index < 3) {
                            console.log('👤 User Display Debug:', {
                              name: user.user_name,
                              is_anonymous: user.is_anonymous,
                              type: typeof user.is_anonymous,
                              isAnonymous: isAnonymous,
                              dob: user.dob,
                              age: userAge
                            });
                          }
                          
                          return (
                            <tr key={user.user_id} className="hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-2 group">
                                  <div className="relative">
                                    <span 
                                      className="text-sm font-mono text-gray-900 cursor-pointer hover:text-blue-600"
                                      title={user.user_id}
                                    >
                                      {user.user_id.substring(0, 12)}...
                                    </span>
                                    {/* Tooltip with full ID */}
                                    <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 shadow-lg">
                                      {user.user_id}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => copyToClipboard(user.user_id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                                    title="Copy User ID"
                                  >
                                    {copiedUserId === user.user_id ? (
                                      <Check className="h-3 w-3 text-green-600" />
                                    ) : (
                                      <Copy className="h-3 w-3 text-gray-600" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-900">
                                {user.user_name || 'N/A'}
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {user.email || 'N/A'}
                              </td>
                              <td className="py-4 px-4 text-sm font-medium text-gray-900">
                                {user.mobile_number || 'N/A'}
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {user.city || 'N/A'}
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {user.gender || 'N/A'}
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-900">
                                {userAge !== null ? userAge : 'N/A'}
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-900">
                                <div className="flex flex-col">
                                  <span className="text-xs text-gray-500">Total: {user.total_summary_generation || 0}</span>
                                  <span className="text-xs font-semibold text-green-600">Paid: {user.total_paid_generation || 0}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">
                                {user.last_used ? new Date(user.last_used).toLocaleDateString() : 'Never'}
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  isAnonymous
                                    ? 'bg-orange-100 text-orange-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {isAnonymous ? 'Anonymous' : 'Registered'}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                {user.isDuplicateGroup ? (
                                  <div className="flex items-center justify-end gap-2">
                                    <button 
                                      onClick={() => openDuplicatePopup(user)}
                                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline"
                                    >
                                      <UserX className="h-4 w-4" />
                                      Duplicates ({user.duplicateCount})
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => openDeletePopup(user)}
                                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium hover:underline"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        } else {
                          return null;
                        }
                      }) : (
                        <tr>
                          <td colSpan={11} className="py-12 text-center text-gray-500 text-sm">
                            No users found
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
                    Showing {((pagination.currentPage - 1) * pageSize) + 1} to {Math.min(pagination.currentPage * pageSize, pagination.totalRecords)} of {pagination.totalRecords} users
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
                      // Show all pages if 10 or fewer
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
                      // Show a subset of pages with ellipsis for many pages  
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

            {/* Duplicate Management Popup */}
            <DuplicateManagementPopup
              isOpen={showDuplicatePopup}
              onClose={closeDuplicatePopup}
              groupKey={selectedGroupKey}
              primaryUserName={selectedPrimaryUserName}
              duplicateCount={selectedDuplicateCount}
              onMergeComplete={handleMergeComplete}
              onDeleteUser={(userId) => {
                // Close duplicate popup and open delete confirmation for specific user
                closeDuplicatePopup();
                const userToDelete = users.find(u => u.user_id === userId);
                if (userToDelete) {
                  openDeletePopup(userToDelete);
                }
              }}
            />

            {/* Delete Confirmation Popup */}
            {showDeletePopup && selectedUser && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete this user? This action cannot be undone and will also:
                  </p>
                  <ul className="text-sm text-gray-600 mb-4 list-disc list-inside space-y-1 bg-yellow-50 p-3 rounded border border-yellow-200">
                    <li>Remove all associated question answers</li>
                    <li>Delete all summary generation records</li>
                    <li>Remove all transaction history</li>
                  </ul>
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="font-medium text-sm">User: <span className="text-gray-900">{selectedUser.user_name}</span></p>
                    <p className="text-xs text-gray-500 mt-1">Email: {selectedUser.email}</p>
                    <p className="text-xs text-gray-500">ID: {selectedUser.user_id}</p>
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
                      {deleting ? 'Deleting...' : 'Delete User'}
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

export default AdminUserManagement;
