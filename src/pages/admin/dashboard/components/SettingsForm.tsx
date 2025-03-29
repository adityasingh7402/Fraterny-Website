
import { useState, useEffect, FormEvent } from 'react';
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
    insider_access_price: currentSettings?.insider_access_price || "₹499/month",
    insider_access_original_price: currentSettings?.insider_access_original_price || "₹699/month",
    main_experience_price: currentSettings?.main_experience_price || "₹45,000 - ₹60,000",
    main_experience_original_price: currentSettings?.main_experience_original_price || "₹65,000 - ₹80,000",
    executive_escape_price: currentSettings?.executive_escape_price || "₹1,50,000+", 
    executive_escape_original_price: currentSettings?.executive_escape_original_price || "₹1,85,000+"
  });
  
  // Track which fields have been modified
  const [modifiedFields, setModifiedFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      setFormValues(prev => ({
        ...prev,
        available_seats: currentSettings?.available_seats?.toString() || prev.available_seats,
        registration_close_date: currentSettings?.registration_close_date || prev.registration_close_date,
        accepting_applications_for_date: currentSettings?.accepting_applications_for_date || prev.accepting_applications_for_date,
        insider_access_price: currentSettings?.insider_access_price || prev.insider_access_price,
        insider_access_original_price: currentSettings?.insider_access_original_price || prev.insider_access_original_price,
        main_experience_price: currentSettings?.main_experience_price || prev.main_experience_price,
        main_experience_original_price: currentSettings?.main_experience_original_price || prev.main_experience_original_price,
        executive_escape_price: currentSettings?.executive_escape_price || prev.executive_escape_price,
        executive_escape_original_price: currentSettings?.executive_escape_original_price || prev.executive_escape_original_price,
      }));
      setModifiedFields({});
    }
  }, [currentSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    // Mark this field as modified
    setModifiedFields(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleFieldUpdate = async (fieldName: string) => {
    if (!modifiedFields[fieldName]) {
      toast.info('No changes to save');
      return;
    }

    try {
      setIsSubmitting(true);
      const value = formValues[fieldName as keyof typeof formValues];
      
      // Special case for days left calculation
      if (fieldName === 'registration_close_date') {
        const daysLeft = calculateDaysLeft(value);
        await updateSetting('registration_days_left', daysLeft.toString());
      }
      
      const success = await updateSetting(fieldName, value.toString());
      
      if (success) {
        toast.success(`${fieldName.replace(/_/g, ' ')} updated successfully`);
        setModifiedFields(prev => ({
          ...prev,
          [fieldName]: false
        }));
        refetch();
      } else {
        toast.error(`Failed to update ${fieldName.replace(/_/g, ' ')}`);
      }
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
      toast.error(`An error occurred while updating ${fieldName.replace(/_/g, ' ')}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let allSuccessful = true;
      const fieldsToUpdate = Object.keys(modifiedFields).filter(field => modifiedFields[field]);
      
      if (fieldsToUpdate.length === 0) {
        toast.info('No changes to save');
        setIsSubmitting(false);
        return;
      }
      
      for (const field of fieldsToUpdate) {
        const value = formValues[field as keyof typeof formValues];
        const success = await updateSetting(field, value.toString());
        
        if (!success) {
          allSuccessful = false;
        }
      }
      
      // Special case for registration_close_date to update days_left
      if (modifiedFields.registration_close_date) {
        const daysLeft = calculateDaysLeft(formValues.registration_close_date);
        const daysLeftUpdated = await updateSetting('registration_days_left', daysLeft.toString());
        if (!daysLeftUpdated) {
          allSuccessful = false;
        }
      }
      
      if (allSuccessful) {
        toast.success('All settings updated successfully');
        setModifiedFields({});
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

  // Helper function to render an individual setting field with its own update button
  const renderSettingField = (name: string, label: string, type: string, placeholder: string, description?: string) => {
    return (
      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <input
            type={type}
            id={name}
            name={name}
            value={formValues[name as keyof typeof formValues] || ''}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => handleFieldUpdate(name)}
          disabled={isSubmitting || !modifiedFields[name]}
          className={`px-3 py-2 rounded-md text-white ${modifiedFields[name] ? 'bg-terracotta hover:bg-opacity-90' : 'bg-gray-300'} transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? '...' : 'Save'}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-xl font-medium text-navy mb-4">Website Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Registration settings section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium mb-4">Registration Settings</h3>
          <div className="space-y-4">
            {renderSettingField(
              'available_seats',
              'Available Seats',
              'number',
              '20',
              undefined
            )}
            
            {renderSettingField(
              'registration_close_date',
              'Registration Close Date',
              'date',
              '',
              `Days left until registration closes: ${daysLeft}`
            )}
            
            {renderSettingField(
              'accepting_applications_for_date',
              'Accepting Applications For Date',
              'text',
              'e.g. February 2026',
              'The date to display on the website (e.g. "Currently accepting applications for February 2026")'
            )}
          </div>
        </div>
        
        {/* Insider Access pricing section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium mb-4">Insider Access Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {renderSettingField(
                'insider_access_price',
                'Discounted Price',
                'text',
                '₹499/month',
                undefined
              )}
            </div>
            <div>
              {renderSettingField(
                'insider_access_original_price',
                'Original Price',
                'text',
                '₹699/month',
                undefined
              )}
            </div>
          </div>
        </div>
        
        {/* Main Experience pricing section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium mb-4">Main Experience Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {renderSettingField(
                'main_experience_price',
                'Discounted Price',
                'text',
                '₹45,000 - ₹60,000',
                undefined
              )}
            </div>
            <div>
              {renderSettingField(
                'main_experience_original_price',
                'Original Price',
                'text',
                '₹65,000 - ₹80,000',
                undefined
              )}
            </div>
          </div>
        </div>
        
        {/* Executive Escape pricing section */}
        <div className="pb-6">
          <h3 className="text-lg font-medium mb-4">Executive Escape Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {renderSettingField(
                'executive_escape_price',
                'Discounted Price',
                'text',
                '₹1,50,000+',
                undefined
              )}
            </div>
            <div>
              {renderSettingField(
                'executive_escape_original_price',
                'Original Price',
                'text',
                '₹1,85,000+',
                undefined
              )}
            </div>
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-md hover:bg-opacity-90 transition-all ${Object.values(modifiedFields).some(Boolean) ? 'bg-navy' : 'bg-gray-300'}`}
            disabled={isSubmitting || !Object.values(modifiedFields).some(Boolean)}
          >
            {isSubmitting ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
