import React, { useState } from 'react';
import { fetchPaymentDetails } from '@/services/admin-payments';
import type { PaymentStatus, PaymentFilters, PaginationParams } from '@/services/admin-payments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PlatformTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Test parameters
  const [statusType, setStatusType] = useState<PaymentStatus>('success');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [gateway, setGateway] = useState<'Razorpay' | 'paypal' | ''>('');
  const [isIndia, setIsIndia] = useState<boolean | null>(null);

  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const paginationParams: PaginationParams = {
        page,
        pageSize,
      };

      const filters: PaymentFilters = {
        searchTerm: searchTerm || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        gateway: gateway || undefined,
        isIndia: isIndia,
      };

      console.log('🧪 Testing with params:', {
        statusType,
        paginationParams,
        filters,
      });

      const response = await fetchPaymentDetails(statusType, paginationParams, filters);

      console.log('✅ Response:', response);
      setResult(response);
    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-navy">Payment Backend Test</h1>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Parameters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Type */}
            <div>
              <label className="block text-sm font-medium mb-2">Status Type</label>
              <select
                value={statusType}
                onChange={(e) => setStatusType(e.target.value as PaymentStatus)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="success">Success</option>
                <option value="Start">Attempted (Start)</option>
                <option value="error">Disputed (Error)</option>
              </select>
            </div>

            {/* Page */}
            <div>
              <label className="block text-sm font-medium mb-2">Page</label>
              <Input
                type="number"
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                min={1}
              />
            </div>

            {/* Page Size */}
            <div>
              <label className="block text-sm font-medium mb-2">Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={40}>40</option>
                <option value={60}>60</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Search Term */}
            <div>
              <label className="block text-sm font-medium mb-2">Search Term</label>
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Email, order ID, etc."
              />
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium mb-2">Date From</label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium mb-2">Date To</label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            {/* Gateway */}
            <div>
              <label className="block text-sm font-medium mb-2">Gateway</label>
              <select
                value={gateway}
                onChange={(e) => setGateway(e.target.value as 'Razorpay' | 'paypal' | '')}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All</option>
                <option value="Razorpay">Razorpay</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            {/* Is India */}
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <select
                value={isIndia === null ? '' : isIndia.toString()}
                onChange={(e) =>
                  setIsIndia(e.target.value === '' ? null : e.target.value === 'true')
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="">All</option>
                <option value="true">India</option>
                <option value="false">International</option>
              </select>
            </div>
          </div>

          {/* Run Test Button */}
          <div className="mt-6">
            <Button
              onClick={runTest}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? 'Testing...' : 'Run Test'}
            </Button>
          </div>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
            <pre className="text-red-600 text-sm">{error}</pre>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Results</h2>

            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-2">Summary:</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <strong>Success:</strong> {result.success ? 'Yes' : 'No'}
                </li>
                {result.data && (
                  <>
                    <li>
                      <strong>Total Records:</strong> {result.data.pagination.totalRecords}
                    </li>
                    <li>
                      <strong>Current Page:</strong> {result.data.pagination.currentPage} of{' '}
                      {result.data.pagination.totalPages}
                    </li>
                    <li>
                      <strong>Page Size:</strong> {result.data.pagination.pageSize}
                    </li>
                    <li>
                      <strong>Transactions Returned:</strong>{' '}
                      {result.data.transactions.length}
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* JSON Response */}
            <div className="bg-gray-50 rounded-lg p-4 overflow-auto max-h-96">
              <h3 className="font-semibold mb-2">Full JSON Response:</h3>
              <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
            </div>

            {/* Sample Transaction */}
            {result.data && result.data.transactions.length > 0 && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Sample Transaction (First Record):</h3>
                <pre className="text-xs overflow-auto max-h-64">
                  {JSON.stringify(result.data.transactions[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformTest;