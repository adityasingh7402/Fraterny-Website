
import { useState, useEffect } from 'react';
import AdminMenu from './components/AdminMenu';
import SettingsForm from './components/SettingsForm';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

const AdminDashboard = () => {
  const { settings, isLoading, error } = useWebsiteSettings();

  const [formValues, setFormValues] = useState({
    available_seats: '',
    registration_close_date: '',
    accepting_applications_for_date: ''
  });

  // Initialize form values when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormValues({
        available_seats: settings.available_seats.toString(),
        registration_close_date: settings.registration_close_date,
        accepting_applications_for_date: settings.accepting_applications_for_date || 'February 2026'
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-playfair text-navy">Admin Dashboard</h1>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Website
          </Link>
        </div>
        
        <AdminMenu />
        
        <SettingsForm settings={formValues} />
      </div>
    </div>
  );
};

export default AdminDashboard;
