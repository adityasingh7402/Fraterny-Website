import React from 'react';
import { usePlatformAnalytics } from '@/hooks/usePlatformAnalytics';
import { getPlatformInfo, getPlatformAnalytics } from '@/utils/platformTracking';

const PlatformTest: React.FC = () => {
  const userPlatformData = usePlatformAnalytics();
  const currentSessionPlatform = getPlatformInfo();
  
  const handleShowAnalytics = () => {
    try {
      const analytics = getPlatformAnalytics();
      console.log('Platform Analytics:', analytics);
    } catch (error) {
      console.error('Error getting platform analytics:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Platform Tracking Test</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium">Current Session Platform:</h4>
          <pre className="text-sm bg-white p-2 rounded">
            {JSON.stringify(currentSessionPlatform, null, 2)}
          </pre>
        </div>

        {userPlatformData && (
          <div>
            <h4 className="font-medium">User Signup Platform Data:</h4>
            <pre className="text-sm bg-white p-2 rounded">
              {JSON.stringify(userPlatformData, null, 2)}
            </pre>
          </div>
        )}

        <button
          onClick={handleShowAnalytics}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Show Platform Analytics (Check Console)
        </button>
      </div>
    </div>
  );
};

export default PlatformTest;