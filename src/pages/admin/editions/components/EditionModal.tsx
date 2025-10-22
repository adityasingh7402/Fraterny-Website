import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { VillaEdition, addEdition, updateEdition } from '@/services/website-settings';
import { toast } from 'sonner';

interface EditionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  edition: VillaEdition | null;
}

const EditionModal: React.FC<EditionModalProps> = ({ isOpen, onClose, onSuccess, edition }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    timeFrame: '',
    isActive: true,
    allocationStatus: 'available' as 'available' | 'limited' | 'sold_out',
    allotedSeats: 0,
    totalSeats: 20,
    displayOrder: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edition) {
      setFormData({
        startDate: edition.startDate,
        endDate: edition.endDate,
        timeFrame: edition.timeFrame || '',
        isActive: edition.isActive,
        allocationStatus: edition.allocationStatus,
        allotedSeats: edition.allotedSeats,
        totalSeats: edition.totalSeats,
        displayOrder: edition.displayOrder
      });
    } else {
      setFormData({
        startDate: '',
        endDate: '',
        timeFrame: '',
        isActive: true,
        allocationStatus: 'available',
        allotedSeats: 0,
        totalSeats: 20,
        displayOrder: 1
      });
    }
  }, [edition, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.startDate || !formData.endDate) {
      toast.error('Please provide both start and end dates');
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast.error('End date must be after start date');
      return;
    }

    if (formData.allotedSeats > formData.totalSeats) {
      toast.error('Alloted seats cannot exceed total seats');
      return;
    }

    setLoading(true);
    try {
      let success;
      
      if (edition) {
        // Update existing edition
        success = await updateEdition(edition.id, formData);
      } else {
        // Add new edition
        success = await addEdition(formData);
      }

      if (success) {
        toast.success(edition ? 'Edition updated successfully' : 'Edition added successfully');
        onSuccess();
      } else {
        toast.error('Failed to save edition');
      }
    } catch (error) {
      console.error('Error saving edition:', error);
      toast.error('Failed to save edition');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-playfair text-navy">
            {edition ? 'Edit Edition' : 'Add New Edition'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Time Frame */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Frame (Optional)
            </label>
            <input
              type="text"
              value={formData.timeFrame}
              onChange={(e) => setFormData({ ...formData, timeFrame: e.target.value })}
              placeholder="e.g., Morning Session: 9 AM - 12 PM"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          {/* Seats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Seats <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.totalSeats}
                onChange={(e) => setFormData({ ...formData, totalSeats: parseInt(e.target.value) || 0 })}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alloted Seats
              </label>
              <input
                type="number"
                value={formData.allotedSeats}
                onChange={(e) => setFormData({ ...formData, allotedSeats: parseInt(e.target.value) || 0 })}
                min="0"
                max={formData.totalSeats}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>
          </div>

          {/* Allocation Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allocation Status
            </label>
            <select
              value={formData.allocationStatus}
              onChange={(e) => setFormData({ ...formData, allocationStatus: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            >
              <option value="available">Available</option>
              <option value="limited">Limited</option>
              <option value="sold_out">Sold Out</option>
            </select>
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order
            </label>
            <input
              type="number"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-navy border-gray-300 rounded focus:ring-navy"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (visible to users)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {edition ? 'Update Edition' : 'Add Edition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditionModal;