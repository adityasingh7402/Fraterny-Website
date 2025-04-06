
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { SimpleImage } from '../ui/image/SimpleImage';
import StorageDiagnostics from './StorageDiagnostics';

/**
 * Component to diagnose image loading issues
 * This can be temporarily added to a page to identify problems
 */
const ImageDiagnostics: React.FC = () => {
  const [availableImages, setAvailableImages] = useState<Array<{key: string, id: string, storage_path: string}>>([]);
  const [supabaseStatus, setSupabaseStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [storageStatus, setStorageStatus] = useState<'unknown' | 'accessible' | 'error'>('unknown');
  const [loading, setLoading] = useState(true);
  const [showBucketInfo, setShowBucketInfo] = useState(false);
  
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
      
      // Check storage access
      try {
        const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('website-images');
        if (bucketError) {
          console.error('Storage bucket error:', bucketError);
          setStorageStatus('error');
        } else {
          setStorageStatus('accessible');
          console.log('Storage bucket info:', bucketData);
        }
      } catch (storageError) {
        console.error('Storage access error:', storageError);
        setStorageStatus('error');
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
        .select('id, key, storage_path, description')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      console.log('Available images:', data);
      setAvailableImages(data || []);
    } catch (e) {
      console.error('Error loading images:', e);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Image System Diagnostics</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="border p-3 rounded">
          <div className="font-medium">Supabase Connection</div>
          <div className={`mt-1 ${
            supabaseStatus === 'connected' ? 'text-green-600' : 
            supabaseStatus === 'error' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {supabaseStatus === 'connected' ? '✓ Connected' : 
             supabaseStatus === 'error' ? '✗ Connection Error' : 'Checking...'}
          </div>
        </div>
        
        <div className="border p-3 rounded">
          <div className="font-medium">Storage Bucket</div>
          <div className={`mt-1 ${
            storageStatus === 'accessible' ? 'text-green-600' : 
            storageStatus === 'error' ? 'text-red-600' : 'text-gray-500'
          }`}>
            {storageStatus === 'accessible' ? '✓ Accessible' : 
             storageStatus === 'error' ? '✗ Storage Error' : 'Checking...'}
          </div>
          {storageStatus === 'accessible' && (
            <button 
              onClick={() => setShowBucketInfo(!showBucketInfo)}
              className="text-sm text-navy underline mt-2"
            >
              {showBucketInfo ? 'Hide details' : 'Show details'}
            </button>
          )}
        </div>
      </div>
      
      {showBucketInfo && <StorageDiagnostics />}
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Database Records</h3>
        <p className="text-sm text-gray-600 mb-4">
          These are image records in the database. If you don't see your image here, 
          it needs to be added to the website_images table.
        </p>
        
        {loading ? (
          <div className="animate-pulse h-40 bg-gray-100 rounded"></div>
        ) : availableImages.length === 0 ? (
          <div className="p-4 border border-amber-200 bg-amber-50 rounded">
            No images found in the database. You need to upload some images.
          </div>
        ) : (
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Key</th>
                  <th className="px-3 py-2 text-left">Storage Path</th>
                  <th className="px-3 py-2 text-left">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {availableImages.map(image => (
                  <tr key={image.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{image.key}</td>
                    <td className="px-3 py-2 font-mono text-xs">{image.storage_path || '—'}</td>
                    <td className="px-3 py-2 text-gray-500">{image.id.slice(0, 8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <h3 className="font-medium mb-2">Image Preview</h3>
      <p className="text-sm text-gray-600 mb-4">
        Test loading images to see if they display correctly:
      </p>
      
      {loading ? (
        <div className="animate-pulse h-40 bg-gray-100 rounded"></div>
      ) : availableImages.length === 0 ? (
        <div className="p-4 border border-amber-200 bg-amber-50 rounded">
          No images to preview. Please upload some images first.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableImages.map(image => (
            <div key={image.id} className="border rounded p-2">
              <div className="aspect-square mb-2">
                <SimpleImage 
                  dynamicKey={image.key} 
                  alt={image.key}
                  className="w-full h-full"
                />
              </div>
              <div className="text-xs truncate">{image.key}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDiagnostics;
