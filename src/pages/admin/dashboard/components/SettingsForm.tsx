
import { useState, FormEvent } from 'react';
import { updateWebsiteSetting } from '@/services/website-settings';
import { toast } from 'sonner';

interface SettingsFormProps {
  settings: {
    available_seats: string;
    registration_close_date: string;
    accepting_applications_for_date: string;
  };
  refetch: () => void;
  calculateDaysLeft: (date: string) => number;
}

const SettingsForm = ({ settings, refetch, calculateDaysLeft }: SettingsFormProps) => {
  const [formValues, setFormValues] = useState({
    available_seats: settings.available_seats,
    registration_close_date: settings.registration_close_date,
    accepting_applications_for_date: settings.accepting_applications_for_date
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update available seats
      const seatsUpdated = await updateWebsiteSetting('available_seats', formValues.available_seats);
      
      // Update registration close date
      const dateUpdated = await updateWebsiteSetting('registration_close_date', formValues.registration_close_date);
      
      // Update accepting applications date
      const applicationDateUpdated = await updateWebsiteSetting('accepting_applications_for_date', formValues.accepting_applications_for_date);
      
      // Calculate and update days left
      const daysLeft = calculateDaysLeft(formValues.registration_close_date);
      const daysLeftUpdated = await updateWebsiteSetting('registration_days_left', daysLeft.toString());
      
      if (seatsUpdated && dateUpdated && applicationDateUpdated && daysLeftUpdated) {
        toast.success('Settings updated successfully');
        refetch();
      } else {
        toast.error('Failed to update one or more settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('An error occurred while updating settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysLeft = calculateDaysLeft(formValues.registration_close_date);

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-medium text-navy mb-4">Website Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
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
            value={formValues.registration_close_date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            Days left until registration closes: <span className="font-medium">{daysLeft}</span>
          </p>
        </div>
        
        <div>
          <label htmlFor="accepting_applications_for_date" className="block text-sm font-medium text-gray-700 mb-1">
            Accepting Applications For Date
          </label>
          <input
            type="text"
            id="accepting_applications_for_date"
            name="accepting_applications_for_date"
            value={formValues.accepting_applications_for_date}
            onChange={handleChange}
            placeholder="e.g. February 2026"
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            The date to display on the website (e.g. "Currently accepting applications for February 2026")
          </p>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
