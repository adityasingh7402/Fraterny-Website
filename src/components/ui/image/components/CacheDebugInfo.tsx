
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
 * Enhanced with version information display
 */
export const CacheDebugInfo = ({ 
  dynamicKey, 
  url, 
  isLoading,
  isCached,
  contentHash,
  lastUpdated
}: CacheDebugInfoProps) => {
  // Extract version and global version from URL if present
  const getVersionInfo = (url: string): { version: string, globalVersion: string | null } => {
    try {
      const urlObj = new URL(url);
      return {
        version: urlObj.searchParams.get('v') || 'none',
        globalVersion: urlObj.searchParams.get('gv') || null
      };
    } catch {
      return { version: 'none', globalVersion: null };
    }
  };

  const urlInfo = url ? getVersionInfo(url) : { version: 'none', globalVersion: null };
  const displayVersion = contentHash || urlInfo.version;
  
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
      <div className="truncate">Hash: {displayVersion}</div>
      {urlInfo.globalVersion && (
        <div className="truncate">GV: {urlInfo.globalVersion}</div>
      )}
      {lastUpdated && (
        <div className="truncate">Updated: {new Date(lastUpdated).toLocaleTimeString()}</div>
      )}
      {isLoading && (
        <div className="bg-blue-500 h-1 animate-pulse w-full absolute bottom-0 left-0"></div>
      )}
    </div>
  );
};
