
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { User, Settings, Image, FileText } from 'lucide-react';

interface AdminDashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-playfair font-bold">Dashboard</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 text-navy rounded hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText size={16} />
            <span>Content</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Image size={16} />
            <span>Media</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User size={16} />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Content Management</h3>
          <p className="text-gray-600 mb-4">Manage website pages and content.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Pages</h4>
              <ul className="space-y-2">
                <li><button className="text-terracotta hover:underline">Home</button></li>
                <li><button className="text-terracotta hover:underline">Experience</button></li>
                <li><button className="text-terracotta hover:underline">Process</button></li>
                <li><button className="text-terracotta hover:underline">Pricing</button></li>
                <li><button className="text-terracotta hover:underline">FAQ</button></li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Legal Pages</h4>
              <ul className="space-y-2">
                <li><button className="text-terracotta hover:underline">Terms and Conditions</button></li>
                <li><button className="text-terracotta hover:underline">Privacy Policy</button></li>
                <li><button className="text-terracotta hover:underline">Terms of Use</button></li>
                <li><button className="text-terracotta hover:underline">Refund Policy</button></li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="media" className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Media Library</h3>
          <p className="text-gray-600 mb-4">Manage your images and media files.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-lg overflow-hidden">
              <img src="/lovable-uploads/ffcba562-8c6d-44dc-8607-53afc45d3a57.png" alt="Logo" className="w-full aspect-square object-contain p-2" />
              <div className="p-2 bg-gray-50 text-xs">Logo</div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <img src="/lovable-uploads/d4a85eda-3e95-443e-8dbc-5c34e20c9723.png" alt="Dark Logo" className="w-full aspect-square object-contain p-2" />
              <div className="p-2 bg-gray-50 text-xs">Dark Logo</div>
            </div>
            <div className="border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <div className="text-3xl text-gray-400">+</div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">User Management</h3>
          <p className="text-gray-600 mb-4">Manage admin users and permissions.</p>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p>This is a placeholder for user management functionality.</p>
            <p className="text-sm text-gray-500 mt-2">Currently only one admin account is active.</p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Site Settings</h3>
          <p className="text-gray-600 mb-4">Configure website settings.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">General Settings</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-600">Site Title</label>
                  <input type="text" defaultValue="Fraterny" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Tagline</label>
                  <input type="text" defaultValue="Shared Ambitions" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
              </div>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <input type="email" defaultValue="support@fraterny.com" className="mt-1 block w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Social Media Links</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <input type="text" defaultValue="https://www.instagram.com/join.fraterny/?hl=en" className="block w-full border rounded-md px-3 py-2 text-sm" placeholder="Instagram" />
                    <input type="text" defaultValue="https://x.com/frat_erny" className="block w-full border rounded-md px-3 py-2 text-sm" placeholder="Twitter/X" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
