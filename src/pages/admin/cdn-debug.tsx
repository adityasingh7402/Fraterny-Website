
import React from 'react';
import CdnDebugTool from '@/components/admin/CdnDebugTool';

const CdnDebugPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">CDN Debug & Configuration</h1>
      <CdnDebugTool />
    </div>
  );
};

export default CdnDebugPage;
