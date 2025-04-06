
/**
 * Component for checking and fixing image storage path consistency
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileCheck } from 'lucide-react';
import { useImageConsistencyCheck } from '@/hooks/useImageConsistencyCheck';
import { STORAGE_BUCKET_NAME } from '@/services/images/constants';

const ConsistencyChecker = () => {
  const { isChecking, lastCheckResult, checkAndFixConsistency } = useImageConsistencyCheck();

  const handleCheck = async () => {
    try {
      await checkAndFixConsistency();
      toast.success('Image consistency check complete');
    } catch (error) {
      console.error('Error running consistency check:', error);
      toast.error('Failed to check image consistency');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-navy">Storage Path Consistency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-gray-700 mb-2">
              Ensures all image paths use the correct storage bucket name: <span className="font-mono bg-gray-100 px-1 rounded">{STORAGE_BUCKET_NAME}</span>
            </p>
            
            {lastCheckResult && (
              <div className="bg-gray-50 p-3 rounded text-sm mt-2">
                <p>Last check: {new Date(lastCheckResult.timestamp).toLocaleString()}</p>
                <p>Scanned: {lastCheckResult.scanned} images</p>
                <p>Fixed: {lastCheckResult.fixed} paths</p>
                <p>Errors: {lastCheckResult.errors}</p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleCheck} 
            disabled={isChecking} 
            variant="outline" 
            className="flex items-center gap-1 self-start"
          >
            <FileCheck className={`w-4 h-4 ${isChecking ? 'animate-pulse' : ''}`} />
            {isChecking ? 'Checking...' : 'Check & Fix Consistency'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsistencyChecker;
