
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchWebsiteSettings } from '@/services/websiteSettingsService';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['websiteSettings'],
    queryFn: fetchWebsiteSettings
  });

  const [formValues, setFormValues] = useState({
    available_seats: '',
    registration_close_date: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form values when settings are loaded
  useState(() => {
    if (settings) {
      setFormValues({
        available_seats: settings.available_seats.toString(),
        registration_close_date: settings.registration_close_date
      });
    }
  });

  const calculateDaysLeft = (dateString: string) => {
    const targetDate = new Date(dateString).getTime();
    const today = new Date().getTime();
    return Math.max(0, Math.floor((targetDate - today) / (1000 * 60 * 60 * 24)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Calculate days left based on the registration close date
      const daysLeft = calculateDaysLeft(formValues.registration_close_date);

      // Update registration_days_left
      await supabase
        .from('website_settings')
        .update({ value: daysLeft.toString() })
        .eq('key', 'registration_days_left');

      // Update available_seats
      await supabase
        .from('website_settings')
        .update({ value: formValues.available_seats })
        .eq('key', 'available_seats');

      // Update registration_close_date
      await supabase
        .from('website_settings')
        .update({ value: formValues.registration_close_date })
        .eq('key', 'registration_close_date');

      toast.success('Settings updated successfully');
      refetch(); // Refresh the data
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl text-red-600 mb-2">Error loading settings</h2>
          <p className="text-gray-700">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-playfair text-navy mb-8">Admin Dashboard</h1>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium text-navy">Website Settings</h2>
            <p className="text-gray-600 mt-1">Manage dynamic content and counters</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="available_seats" className="block text-sm font-medium text-gray-700 mb-1">
                Available Seats
              </label>
              <input
                type="number"
                id="available_seats"
                name="available_seats"
                value={formValues.available_seats}
                onChange={handleChange}
                min="0"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                required
              />
            </div>

            <div>
              <label htmlFor="registration_close_date" className="block text-sm font-medium text-gray-700 mb-1">
                Registration Close Date
              </label>
              <input
                type="date"
                id="registration_close_date"
                name="registration_close_date"
                value={formValues.registration_close_date.substring(0, 10)}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-navy focus:border-navy"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Days Remaining: {calculateDaysLeft(formValues.registration_close_date)} days
              </p>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-medium text-navy">Blog Management</h2>
            <p className="text-gray-600 mt-1">Coming soon - Manage blog posts</p>
          </div>
          <div className="p-6">
            <p className="text-gray-600">Blog management interface will be added here.</p>
            <a href="/admin/blog" className="text-navy underline">Go to blog management</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
