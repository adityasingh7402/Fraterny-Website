import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  fetchUpcomingEditions, 
  VillaEdition 
} from '@/services/website-settings';
import EditionsList from './components/EditionsList';
import EditionModal from './components/EditionModal';

const VillaEditionsManagement: React.FC = () => {
  const [editions, setEditions] = useState<VillaEdition[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdition, setEditingEdition] = useState<VillaEdition | null>(null);

  // Fetch editions on mount
  useEffect(() => {
    loadEditions();
  }, []);

  const loadEditions = async () => {
    setLoading(true);
    try {
      const data = await fetchUpcomingEditions();
      setEditions(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error) {
      console.error('Error loading editions:', error);
      toast.error('Failed to load editions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (edition?: VillaEdition) => {
    setEditingEdition(edition || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEdition(null);
  };

  const handleSuccess = () => {
    loadEditions();
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-navy" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-navy" />
              <h1 className="text-3xl font-playfair text-navy">Villa Editions Management</h1>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Edition
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Total Editions</p>
              <p className="text-2xl font-bold text-navy">{editions.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Active Editions</p>
              <p className="text-2xl font-bold text-green-600">
                {editions.filter(e => e.isActive).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">Total Seats</p>
              <p className="text-2xl font-bold text-navy">
                {editions.reduce((sum, e) => sum + e.totalSeats, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Editions List */}
        <EditionsList 
          editions={editions}
          onEdit={handleOpenModal}
          onRefresh={loadEditions}
        />

        {/* Modal */}
        <EditionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
          edition={editingEdition}
        />
      </div>
    </div>
  );
};

export default VillaEditionsManagement;