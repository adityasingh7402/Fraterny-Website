
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { testCdnConnection } from '@/utils/cdn';
import { Button } from '@/components/ui/button';
import { RotateCw, CheckCircle, XCircle } from 'lucide-react';

const CdnTestingPanel = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheckResult, setLastCheckResult] = useState<boolean | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null);

  const checkCdnConnection = async () => {
    setIsChecking(true);
    try {
      const isAvailable = await testCdnConnection();
      setLastCheckResult(isAvailable);
      setLastCheckTime(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error testing CDN connection:', error);
      setLastCheckResult(false);
      setLastCheckTime(new Date().toLocaleTimeString());
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-navy flex items-center gap-2">
          CDN Connection Test
        </CardTitle>
        <CardDescription>
          Test the connection to the Content Delivery Network
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            {lastCheckResult !== null && (
              <div className="flex items-center gap-2">
                <span>Last check result:</span>
                {lastCheckResult ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Connected
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle className="w-4 h-4 mr-1" />
                    Disconnected
                  </span>
                )}
                {lastCheckTime && <span className="text-gray-500 text-sm">at {lastCheckTime}</span>}
              </div>
            )}
          </div>
          <Button 
            onClick={checkCdnConnection} 
            disabled={isChecking}
            variant="outline"
            className="flex items-center gap-1"
          >
            {isChecking ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4" />
                Test Connection
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CdnTestingPanel;
