
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminLogin from '../components/admin/AdminLogin';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is authenticated on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      // Validate token
      try {
        const tokenData = JSON.parse(atob(adminToken.split('.')[1]));
        const expiry = tokenData.exp * 1000; // Convert to milliseconds
        
        if (Date.now() < expiry) {
          setIsAuthenticated(true);
        } else {
          // Token expired
          localStorage.removeItem('admin_token');
        }
      } catch (error) {
        localStorage.removeItem('admin_token');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <section className="pt-32 pb-12 bg-navy text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-playfair mb-6">Admin Panel</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Manage your website content and settings.
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          {isAuthenticated ? (
            <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <AdminLogin setIsAuthenticated={setIsAuthenticated} />
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Admin;
