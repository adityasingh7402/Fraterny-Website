import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPlatformInfo } from '@/utils/platformTracking';

export interface UserPlatformData {
  signupSource: string;
  signupPlatform: string;
  signupMedium?: string;
  signupCampaign?: string;
  currentSessionPlatform?: string;
}

export const usePlatformAnalytics = () => {
  const { user } = useAuth();
  const [platformData, setPlatformData] = useState<UserPlatformData | null>(null);
  
  useEffect(() => {
    if (user?.user_metadata) {
      const metadata = user.user_metadata;
      const currentPlatform = getPlatformInfo();
      
      setPlatformData({
        signupSource: metadata.signup_source || 'unknown',
        signupPlatform: metadata.signup_platform || 'unknown',
        signupMedium: metadata.signup_medium,
        signupCampaign: metadata.signup_campaign,
        currentSessionPlatform: currentPlatform?.platform
      });
    }
  }, [user]);
  
  return platformData;
};