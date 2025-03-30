
import React from 'react';

interface CacheDebugInfoProps {
  dynamicKey?: string;
  url?: string;
  isLoading: boolean;
  isCached: boolean;
  contentHash?: string | null;
  lastUpdated?: string | null;
}

/**
 * Component to display cache debugging information
 * Only shown when debugCache prop is true in parent component
 */
export const CacheDebugInfo = ({ 
  dynamicKey, 
  url, 
  isLoading,
  isCached,
  contentHash,
  lastUpdated
}: CacheDebugInfoProps) => {
  // Extract version from URL if present
  const getVersionFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v') || 'none';
    } catch {
      return 'none';
    }
  };

  const urlVersion = url ? getVersionFromUrl(url) : 'none';
  
  return (
    <div className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs p-1 z-10 w-full overflow-hidden">
      <div className="flex justify-between">
        <div className="truncate mr-1">Key: {dynamicKey || 'none'}</div>
        <div>
          <span className={`font-mono ${isCached ? 'text-green-400' : 'text-yellow-400'}`}>
            {isCached ? 'CACHED' : 'NETWORK'}
          </span>
        </div>
      </div>
      <div className="truncate">Hash: {contentHash || urlVersion}</div>
      {lastUpdated && (
        <div className="truncate">Updated: {new Date(lastUpdated).toLocaleTimeString()}</div>
      )}
      {isLoading && (
        <div className="bg-blue-500 h-1 animate-pulse w-full absolute bottom-0 left-0"></div>
      )}
    </div>
  );
};
