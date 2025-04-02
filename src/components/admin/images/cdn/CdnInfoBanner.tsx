
import React from 'react';
import { Info } from 'lucide-react';

interface CdnInfoBannerProps {
  cdnUrl: string;
}

const CdnInfoBanner: React.FC<CdnInfoBannerProps> = ({ cdnUrl }) => {
  return (
    <div className="rounded-md bg-sky-50 border border-sky-200 p-3">
      <div className="flex items-start">
        <Info className="h-4 w-4 text-sky-600 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm text-sky-800">
            Current CDN URL: <span className="font-mono text-xs bg-white px-1 py-0.5 rounded">{cdnUrl}</span>
          </p>
          <p className="mt-1 text-xs text-sky-700">
            Update this URL in <span className="font-mono bg-white/70 px-1 py-0.5 rounded">src/utils/cdn/cdnConfig.ts</span> once your Cloudflare worker is set up
          </p>
        </div>
      </div>
    </div>
  );
};

export default CdnInfoBanner;
