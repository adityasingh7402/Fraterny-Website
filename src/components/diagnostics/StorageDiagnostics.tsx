
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

/**
 * A diagnostic component to check Supabase storage access and bucket existence
 */
const StorageDiagnostics: React.FC = () => {
  const [bucketInfo, setBucketInfo] = useState<any>(null);
  const [bucketFiles, setBucketFiles] = useState<any[]>([]);
  const [bucketError, setBucketError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    checkBucketAccess();
  }, []);
  
  const checkBucketAccess = async () => {
    try {
      console.log('[StorageDiagnostics] Checking bucket access...');
      setIsLoading(true);
      
      // Try to get the bucket
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket('website-images');
      
      if (bucketError) {
        console.error('[StorageDiagnostics] Error getting bucket:', bucketError);
        setBucketError(bucketError.message);
        setIsLoading(false);
        return;
      }
      
      setBucketInfo(bucketData);
      console.log('[StorageDiagnostics] Bucket info:', bucketData);
      
      // Now try to list files in the bucket
      const { data: listData, error: listError } = await supabase.storage
        .from('website-images')
        .list();
      
      if (listError) {
        console.error('[StorageDiagnostics] Error listing files:', listError);
        setBucketError(`Bucket exists but cannot list files: ${listError.message}`);
        setIsLoading(false);
        return;
      }
      
      setBucketFiles(listData || []);
      console.log('[StorageDiagnostics] Files in bucket:', listData);
    } catch (error) {
      console.error('[StorageDiagnostics] Unexpected error:', error);
      setBucketError('Unexpected error checking bucket access');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Storage Bucket Diagnostics</h2>
      
      {isLoading ? (
        <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
      ) : bucketError ? (
        <div className="p-4 border border-red-200 bg-red-50 rounded mb-4">
          <p className="text-red-600 font-medium">Storage Bucket Error</p>
          <p className="text-sm text-red-500 mt-1">{bucketError}</p>
          <div className="mt-3">
            <p className="text-sm text-gray-600">Possible solutions:</p>
            <ul className="list-disc text-sm text-gray-600 ml-5 mt-1">
              <li>Verify the 'website-images' bucket exists in Supabase</li>
              <li>Check that your app has correct Supabase credentials</li>
              <li>Ensure bucket permissions are set correctly</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="p-3 border border-green-200 bg-green-50 rounded mb-4">
            <p className="text-green-600 font-medium">✓ Bucket exists</p>
            <p className="text-sm text-gray-600 mt-1">
              {bucketInfo?.public ? '✓ Public bucket' : '⚠️ Not a public bucket'} | 
              Created: {new Date(bucketInfo?.created_at).toLocaleString()}
            </p>
          </div>
          
          <h3 className="font-medium mb-2">Files in Bucket ({bucketFiles.length})</h3>
          
          {bucketFiles.length === 0 ? (
            <div className="p-3 border border-amber-200 bg-amber-50 rounded">
              <p className="text-amber-700">No files found in the bucket.</p>
              <p className="text-sm text-gray-600 mt-1">
                You need to upload images to the storage bucket before they can be displayed.
              </p>
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto border rounded">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Size</th>
                    <th className="px-3 py-2">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {bucketFiles.map((file, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium">{file.name}</td>
                      <td className="px-3 py-2">{formatFileSize(file.metadata?.size)}</td>
                      <td className="px-3 py-2">{file.metadata?.mimetype || 'unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined) return 'Unknown';
  
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default StorageDiagnostics;
