
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWebsiteSettings } from '@/services/websiteSettingsService';
import AdminMenu from './components/AdminMenu';
import SettingsForm from './components/SettingsForm';
import { calculateDaysLeft } from './utils/dateUtils';

const AdminDashboard = () => {
  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['websiteSettings'],
    queryFn: fetchWebsiteSettings
  });

  const [formValues, setFormValues] = useState({
    available_seats: '',
    registration_close_date: ''
  });

  // Initialize form values when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormValues({
        available_seats: settings.available_seats.toString(),
        registration_close_date: settings.registration_close_date
      });
    }
  }, [settings]);

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
        
        <AdminMenu />
        
        <SettingsForm 
          settings={formValues} 
          refetch={refetch} 
          calculateDaysLeft={calculateDaysLeft} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
