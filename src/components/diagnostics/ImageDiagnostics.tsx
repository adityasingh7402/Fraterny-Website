
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { SimpleImage } from '../ui/image/SimpleImage';
import StorageDiagnostics from './StorageDiagnostics';

/**
 * Component to diagnose image loading issues
 */
const ImageDiagnostics: React.FC = () => {
  const [availableImages, setAvailableImages] = useState<Array<{key: string, id: string, description: string}>>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [databaseStatus, setDatabaseStatus] = useState<'unknown' | 'available' | 'error'>('unknown');
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    checkSupabaseConnection();
    loadAvailableImages();
  }, []);
  
  const checkSupabaseConnection = async () => {
    try {
      // Simple query to check if Supabase is accessible
      const { data, error } = await supabase.from('website_settings').select('id').limit(1);
      
      if (error) throw error;
      setSupabaseStatus('connected');
      
      // Check website_images table access
      try {
        const { count, error: countError } = await supabase
          .from('website_images')
          .select('*', { count: 'exact', head: true });
          
        if (countError) {
          console.error('Database table error:', countError);
          setDatabaseStatus('error');
        } else {
          setDatabaseStatus('available');
          console.log('Image table info - total records:', count);
        }
      } catch (dbError) {
        console.error('Database access error:', dbError);
        setDatabaseStatus('error');
      }
    } catch (e) {
      console.error('Supabase connection error:', e);
      setSupabaseStatus('error');
    }
  };
  
  const loadAvailableImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('website_images')
        .select('id, key, description')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) {
        console.error('Error loading images:', error);
      } else {
        setAvailableImages(data || []);
        console.log('Available images in database:', data);
      }
    } catch (error) {
      console.error('Error in loadAvailableImages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Image System Diagnostics</h2>
          <button 
            className="text-sm px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className={`p-3 border rounded ${
            supabaseStatus === 'connected' ? 'border-green-200 bg-green-50' : 
            supabaseStatus === 'error' ? 'border-red-200 bg-red-50' : 
            'border-gray-200 bg-gray-50'
          }`}>
            <p className="font-medium">Supabase Connection</p>
            <p className="text-sm mt-1">
              {supabaseStatus === 'connected' ? '✓ Connected to Supabase' : 
              supabaseStatus === 'error' ? '✗ Connection error' : 
              'Checking connection...'}
            </p>
          </div>
          
          <div className={`p-3 border rounded ${
            databaseStatus === 'available' ? 'border-green-200 bg-green-50' : 
            databaseStatus === 'error' ? 'border-red-200 bg-red-50' : 
            'border-gray-200 bg-gray-50'
          }`}>
            <p className="font-medium">Database Image Table</p>
            <p className="text-sm mt-1">
              {databaseStatus === 'available' ? '✓ Image table accessible' : 
              databaseStatus === 'error' ? '✗ Table access error' : 
              'Checking table access...'}
            </p>
          </div>
        </div>

        {/* Available Images */}
        <div>
          <h3 className="font-medium mb-2">Available Images in Database ({availableImages.length})</h3>
          
          {loading ? (
            <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
          ) : availableImages.length === 0 ? (
            <div className="p-3 border border-amber-200 bg-amber-50 rounded">
              <p className="text-amber-700">No images found in the database.</p>
              <p className="text-sm text-gray-600 mt-1">
                You need to add image records to the website_images table before they can be displayed.
              </p>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3 py-2">Image Key</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {availableImages.map((image, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{image.key}</td>
                      <td className="px-3 py-2">{image.description}</td>
                      <td className="px-3 py-2 text-xs text-gray-500">{image.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional storage diagnostics if we want to check if any buckets exist */}
      {showDetails && <StorageDiagnostics />}
    </div>
  );
};

export default ImageDiagnostics;
