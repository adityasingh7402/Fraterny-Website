
import { useState, FormEvent } from 'react';
import { calculateDaysLeft } from '@/services/website-settings';
import { toast } from 'sonner';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

interface SettingsFormProps {
  settings: {
    available_seats: string;
    registration_close_date: string;
    accepting_applications_for_date: string;
  };
}

const SettingsForm = ({ settings: initialSettings }: SettingsFormProps) => {
  const { updateSetting, refetch, settings: currentSettings } = useWebsiteSettings();
  
  const [formValues, setFormValues] = useState({
    available_seats: initialSettings.available_seats,
    registration_close_date: initialSettings.registration_close_date,
    accepting_applications_for_date: initialSettings.accepting_applications_for_date,
    // Initialize pricing fields from current settings or defaults
    insider_access_price: currentSettings?.insider_access_price || "₹499/month",
    insider_access_original_price: currentSettings?.insider_access_original_price || "₹699/month",
    main_experience_price: currentSettings?.main_experience_price || "₹45,000 - ₹60,000",
    main_experience_original_price: currentSettings?.main_experience_original_price || "₹65,000 - ₹80,000",
    executive_escape_price: currentSettings?.executive_escape_price || "₹1,50,000+", 
    executive_escape_original_price: currentSettings?.executive_escape_original_price || "₹1,85,000+"
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
      const seatsUpdated = await updateSetting('available_seats', formValues.available_seats);
      
      // Update registration close date
      const dateUpdated = await updateSetting('registration_close_date', formValues.registration_close_date);
      
      // Update accepting applications date
      const applicationDateUpdated = await updateSetting('accepting_applications_for_date', formValues.accepting_applications_for_date);
      
      // Calculate and update days left
      const daysLeft = calculateDaysLeft(formValues.registration_close_date);
      const daysLeftUpdated = await updateSetting('registration_days_left', daysLeft.toString());
      
      // Update pricing fields
      const insiderPriceUpdated = await updateSetting('insider_access_price', formValues.insider_access_price);
      const insiderOriginalUpdated = await updateSetting('insider_access_original_price', formValues.insider_access_original_price);
      const mainPriceUpdated = await updateSetting('main_experience_price', formValues.main_experience_price);
      const mainOriginalUpdated = await updateSetting('main_experience_original_price', formValues.main_experience_original_price);
      const executivePriceUpdated = await updateSetting('executive_escape_price', formValues.executive_escape_price);
      const executiveOriginalUpdated = await updateSetting('executive_escape_original_price', formValues.executive_escape_original_price);
      
      if (seatsUpdated && dateUpdated && applicationDateUpdated && daysLeftUpdated && 
          insiderPriceUpdated && insiderOriginalUpdated && mainPriceUpdated && mainOriginalUpdated && 
          executivePriceUpdated && executiveOriginalUpdated) {
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
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Registration settings section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium mb-4">Registration Settings</h3>
          <div className="space-y-4">
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
          </div>
        </div>
        
        {/* Insider Access pricing section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium mb-4">Insider Access Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="insider_access_price" className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price
              </label>
              <input
                type="text"
                id="insider_access_price"
                name="insider_access_price"
                value={formValues.insider_access_price}
                onChange={handleChange}
                placeholder="₹499/month"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="insider_access_original_price" className="block text-sm font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <input
                type="text"
                id="insider_access_original_price"
                name="insider_access_original_price"
                value={formValues.insider_access_original_price}
                onChange={handleChange}
                placeholder="₹699/month"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Main Experience pricing section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium mb-4">Main Experience Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="main_experience_price" className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price
              </label>
              <input
                type="text"
                id="main_experience_price"
                name="main_experience_price"
                value={formValues.main_experience_price}
                onChange={handleChange}
                placeholder="₹45,000 - ₹60,000"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="main_experience_original_price" className="block text-sm font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <input
                type="text"
                id="main_experience_original_price"
                name="main_experience_original_price"
                value={formValues.main_experience_original_price}
                onChange={handleChange}
                placeholder="₹65,000 - ₹80,000"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Executive Escape pricing section */}
        <div className="pb-6">
          <h3 className="text-lg font-medium mb-4">Executive Escape Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="executive_escape_price" className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price
              </label>
              <input
                type="text"
                id="executive_escape_price"
                name="executive_escape_price"
                value={formValues.executive_escape_price}
                onChange={handleChange}
                placeholder="₹1,50,000+"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="executive_escape_original_price" className="block text-sm font-medium text-gray-700 mb-1">
                Original Price
              </label>
              <input
                type="text"
                id="executive_escape_original_price"
                name="executive_escape_original_price"
                value={formValues.executive_escape_original_price}
                onChange={handleChange}
                placeholder="₹1,85,000+"
                className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                required
              />
            </div>
          </div>
        </div>
        
        <div>
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
