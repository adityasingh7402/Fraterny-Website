import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getApiStats } from '@/utils/apiMonitoring';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const ApiMonitoringPanel: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    endpoints: {} as Record<string, number>,
    requestsLastHour: 0,
    requestsLastMinute: 0
  });
  const [chartData, setChartData] = useState<Array<{time: string, count: number}>>([]);
  
  // Update stats every minute
  useEffect(() => {
    const updateStats = () => {
      const currentStats = getApiStats();
      setStats(currentStats);
      
      // Add a data point to the chart
      const now = new Date();
      const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      setChartData(prevData => {
        const newData = [...prevData, { time: timeString, count: currentStats.requestsLastMinute }];
        // Keep only the last 30 data points
        if (newData.length > 30) {
          return newData.slice(-30);
        }
        return newData;
      });
    };
    
    // Initial update
    updateStats();
    
    // Setup interval for updates
    const intervalId = setInterval(updateStats, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Prepare data for the endpoints chart
  const endpointData = Object.entries(stats.endpoints).map(([key, value]) => ({
    endpoint: key,
    calls: value
  }));
  
  // Refresh data manually
  const handleRefresh = () => {
    const currentStats = getApiStats();
    setStats(currentStats);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">API Monitoring</h2>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Last Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.requestsLastHour}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Last Minute</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.requestsLastMinute}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Requests Per Minute</CardTitle>
          <CardDescription>Number of API calls in the last 30 minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0A1A2F" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Endpoint Usage</CardTitle>
          <CardDescription>Calls per endpoint</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={endpointData}>
                <XAxis dataKey="endpoint" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#E07A5F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          Endpoints with most frequent calls may benefit from additional caching or batching.
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApiMonitoringPanel;
