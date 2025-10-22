import React, { useState, useEffect } from 'react';
import { 
  fetchActivePricing, 
  updatePricing, 
  fetchAllPricingHistory,
  getPricingForDisplay,
  activatePricingById,
  type DynamicPricingData, 
  type PricingUpdateData 
} from '@/services/admin-pricing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DollarSign,
  Save,
  RefreshCw,
  Clock,
  Database,
  Settings,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  Info,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

const AdminPricingManagement: React.FC = () => {
  // State for current pricing
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activePricing, setActivePricing] = useState<DynamicPricingData | null>(null);
  const [pricingHistory, setPricingHistory] = useState<DynamicPricingData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [priceSource, setPriceSource] = useState<'environment' | 'database'>('environment');

  // Form state
  const [formData, setFormData] = useState({
    // Razorpay pricing
    razorpay_india_price_paise: 20000,
    razorpay_india_display_price_paise: 120000,
    razorpay_international_price_cents: 1000,
    razorpay_international_display_price_cents: 2500,
    // PayPal pricing  
    paypal_india_price_cents: 500,
    paypal_india_display_price_cents: 200,
    paypal_international_price_cents: 1000,
    paypal_international_display_price_cents: 2500,
    // Metadata
    updated_by: 'admin',
    notes: ''
  });

  // UI state
  const [showHistory, setShowHistory] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; pricingId: string | null }>({ show: false, pricingId: null });

  // Fetch active pricing
  const fetchActivePricingData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check what pricing source we're using
      const displayPricing = await getPricingForDisplay();
      setPriceSource(displayPricing.source);
      
      // If using database, fetch active pricing
      if (displayPricing.source === 'database') {
        const response = await fetchActivePricing();
        if (response.success && response.data) {
          setActivePricing(response.data);
          // Update form with current values
          setFormData({
            razorpay_india_price_paise: response.data.razorpay_india_price_paise,
            razorpay_india_display_price_paise: response.data.razorpay_india_display_price_paise,
            razorpay_international_price_cents: response.data.razorpay_international_price_cents,
            razorpay_international_display_price_cents: response.data.razorpay_international_display_price_cents,
            paypal_india_price_cents: response.data.paypal_india_price_cents,
            paypal_india_display_price_cents: response.data.paypal_india_display_price_cents,
            paypal_international_price_cents: response.data.paypal_international_price_cents,
            paypal_international_display_price_cents: response.data.paypal_international_display_price_cents,
            updated_by: 'admin',
            notes: response.data.notes || ''
          });
        } else {
          setError(response.error || 'Failed to load active pricing');
        }
      } else {
        // Using environment variables
        setActivePricing(null);
        if (displayPricing.success && displayPricing.data) {
          setFormData({
            razorpay_india_price_paise: displayPricing.data.razorpay.india.price,
            razorpay_india_display_price_paise: displayPricing.data.razorpay.india.displayPrice,
            razorpay_international_price_cents: displayPricing.data.razorpay.international.price,
            razorpay_international_display_price_cents: displayPricing.data.razorpay.international.displayPrice,
            paypal_india_price_cents: displayPricing.data.paypal.india.price,
            paypal_india_display_price_cents: displayPricing.data.paypal.india.displayPrice,
            paypal_international_price_cents: displayPricing.data.paypal.international.price,
            paypal_international_display_price_cents: displayPricing.data.paypal.international.displayPrice,
            updated_by: 'admin',
            notes: ''
          });
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch pricing history
  const fetchHistoryData = async () => {
    try {
      const response = await fetchAllPricingHistory();
      if (response.success && response.data) {
        setPricingHistory(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching pricing history:', err);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field.includes('notes') || field.includes('updated_by') ? value : parseInt(value) || 0
    }));
  };

  // Activate a historical pricing config
  const handleActivate = async (id: string) => {
    setConfirmDialog({ show: true, pricingId: id });
  };

  const confirmActivate = async () => {
    if (!confirmDialog.pricingId) return;
    try {
      setLoading(true);
      const res = await activatePricingById(confirmDialog.pricingId, { updated_by: formData.updated_by, notes: 'Activated from history' });
      if (res.success) {
        toast.success('Activated selected pricing configuration');
        await fetchActivePricingData();
        await fetchHistoryData();
      } else {
        toast.error(res.error || 'Failed to activate pricing');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to activate pricing');
    } finally {
      setLoading(false);
      setConfirmDialog({ show: false, pricingId: null });
    }
  };

  // Save pricing configuration
  const handleSave = async () => {
    if (priceSource === 'environment') {
      toast.error('Cannot save in development mode. Switch to live mode to save pricing.');
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      const updateData: PricingUpdateData = {
        razorpay_india_price_paise: formData.razorpay_india_price_paise,
        razorpay_india_display_price_paise: formData.razorpay_india_display_price_paise,
        razorpay_international_price_cents: formData.razorpay_international_price_cents,
        razorpay_international_display_price_cents: formData.razorpay_international_display_price_cents,
        paypal_india_price_cents: formData.paypal_india_price_cents,
        paypal_india_display_price_cents: formData.paypal_india_display_price_cents,
        paypal_international_price_cents: formData.paypal_international_price_cents,
        paypal_international_display_price_cents: formData.paypal_international_display_price_cents,
        updated_by: formData.updated_by,
        notes: formData.notes
      };

      const response = await updatePricing(updateData);
      
      if (response.success) {
        toast.success('Pricing configuration updated successfully');
        await fetchActivePricingData();
        await fetchHistoryData();
      } else {
        setError(response.error || 'Failed to update pricing');
        toast.error(response.error || 'Failed to update pricing');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update pricing');
      toast.error('Failed to update pricing');
    } finally {
      setSaving(false);
    }
  };

  // Format currency display
  const formatCurrency = (amount: number, currency: 'INR' | 'USD'): string => {
    if (currency === 'INR') {
      return `₹${(amount / 100).toFixed(2)}`;
    } else {
      return `$${(amount / 100).toFixed(2)}`;
    }
  };

  // Initialize data
  useEffect(() => {
    fetchActivePricingData();
    fetchHistoryData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Dynamic Pricing Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage Quest PDF pricing configuration
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        </div>
      )}

      {/* Current Pricing Configuration */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Current Pricing Configuration</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={fetchActivePricingData}
              disabled={loading}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowHistory(!showHistory)}
              size="sm"
            >
              {showHistory ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showHistory ? 'Hide' : 'Show'} History
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading pricing configuration...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Razorpay Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                💳 Razorpay Pricing
              </h3>
              
              <div className="space-y-4">
                {/* India Pricing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🇮🇳 India Pricing</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price (paise)</label>
                      <Input
                        type="number"
                        value={formData.razorpay_india_price_paise}
                        onChange={(e) => handleInputChange('razorpay_india_price_paise', e.target.value)}
                        disabled={priceSource === 'environment'}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        = {formatCurrency(formData.razorpay_india_price_paise, 'INR')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Display Price (paise)</label>
                      <Input
                        type="number"
                        value={formData.razorpay_india_display_price_paise}
                        onChange={(e) => handleInputChange('razorpay_india_display_price_paise', e.target.value)}
                        disabled={priceSource === 'environment'}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        = {formatCurrency(formData.razorpay_india_display_price_paise, 'INR')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* International Pricing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🌍 International Pricing</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price (cents)</label>
                      <Input
                        type="number"
                        value={formData.razorpay_international_price_cents}
                        onChange={(e) => handleInputChange('razorpay_international_price_cents', e.target.value)}
                        disabled={priceSource === 'environment'}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        = {formatCurrency(formData.razorpay_international_price_cents, 'USD')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Display Price (cents)</label>
                      <Input
                        type="number"
                        value={formData.razorpay_international_display_price_cents}
                        onChange={(e) => handleInputChange('razorpay_international_display_price_cents', e.target.value)}
                        disabled={priceSource === 'environment'}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        = {formatCurrency(formData.razorpay_international_display_price_cents, 'USD')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PayPal Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                🌐 PayPal Pricing
              </h3>
              
              <div className="space-y-4">
                {/* India Pricing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🇮🇳 India Pricing</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price (cents)</label>
                      <Input
                        type="number"
                        value={formData.paypal_india_price_cents}
                        onChange={(e) => handleInputChange('paypal_india_price_cents', e.target.value)}
                        disabled={priceSource === 'environment'}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        = {formatCurrency(formData.paypal_india_price_cents, 'USD')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Display Price (cents)</label>
                      <Input
                        type="number"
                        value={formData.paypal_india_display_price_cents}
                        onChange={(e) => handleInputChange('paypal_india_display_price_cents', e.target.value)}
                        disabled={priceSource === 'environment'}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        = {formatCurrency(formData.paypal_india_display_price_cents, 'USD')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* International Pricing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">🌍 International Pricing</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Price (cents)</label>
                      <Input
                        type="number"
                        value={formData.paypal_international_price_cents}
                        onChange={(e) => handleInputChange('paypal_international_price_cents', e.target.value)}
                        disabled={priceSource === 'environment'}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        = {formatCurrency(formData.paypal_international_price_cents, 'USD')}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Display Price (cents)</label>
                      <Input
                        type="number"
                        value={formData.paypal_international_display_price_cents}
                        onChange={(e) => handleInputChange('paypal_international_display_price_cents', e.target.value)}
                        disabled={priceSource === 'environment'}
                        className="text-sm"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        = {formatCurrency(formData.paypal_international_display_price_cents, 'USD')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Section */}
        {priceSource === 'database' && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-md font-semibold text-gray-900 mb-4">Metadata</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Updated By</label>
                <Input
                  type="text"
                  value={formData.updated_by}
                  onChange={(e) => handleInputChange('updated_by', e.target.value)}
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <Input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Reason for update..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          {priceSource === 'environment' ? (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
              <Info className="h-4 w-4" />
              <span className="text-sm">Set VITE_DYNAMIC_PRICE_STATUS=live to enable saving</span>
            </div>
          ) : (
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Configuration
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Pricing History */}
      {showHistory && priceSource === 'database' && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pricing History
          </h2>
          
          {pricingHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pricing history available</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pricingHistory.map((pricing) => (
                <div key={pricing.id} className={`border rounded-lg p-4 ${
                  pricing.is_active ? 'border-green-200 bg-green-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                      {pricing.is_active && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          Active
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        Updated: {new Date(pricing.updated_at).toLocaleString()}
                      </span>
                      {pricing.updated_by && (
                        <span className="text-sm text-gray-500">by {pricing.updated_by}</span>
                      )}
                    </div>
                    <div>
                      {!pricing.is_active && (
                        <Button size="sm" onClick={() => handleActivate(pricing.id)} className="flex items-center gap-2">
                          <RotateCcw className="h-4 w-4" /> Activate
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Razorpay India:</span>
                      <div className="font-medium">
                        {formatCurrency(pricing.razorpay_india_price_paise, 'INR')} / 
                        {formatCurrency(pricing.razorpay_india_display_price_paise, 'INR')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Razorpay Intl:</span>
                      <div className="font-medium">
                        {formatCurrency(pricing.razorpay_international_price_cents, 'USD')} / 
                        {formatCurrency(pricing.razorpay_international_display_price_cents, 'USD')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">PayPal India:</span>
                      <div className="font-medium">
                        {formatCurrency(pricing.paypal_india_price_cents, 'USD')} / 
                        {formatCurrency(pricing.paypal_india_display_price_cents, 'USD')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">PayPal Intl:</span>
                      <div className="font-medium">
                        {formatCurrency(pricing.paypal_international_price_cents, 'USD')} / 
                        {formatCurrency(pricing.paypal_international_display_price_cents, 'USD')}
                      </div>
                    </div>
                  </div>
                  
                  {pricing.notes && (
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {pricing.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Activate Historical Pricing?</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              This will make the selected historical pricing configuration active. 
              The current active pricing will be deactivated automatically.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setConfirmDialog({ show: false, pricingId: null })}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmActivate}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6"
              >
                Activate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPricingManagement;
