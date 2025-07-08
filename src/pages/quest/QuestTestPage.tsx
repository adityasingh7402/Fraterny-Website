import React, { useState } from 'react';
import { QuestPage } from './QuestPage';
import { QuestButton } from '../../components/quest/ui/QuestButton';
import { QuestDivider } from '../../components/quest/ui/QuestDivider';
import { CalmingBackground } from '../../components/quest/effects/CalmingBackground';

/**
 * Test page for the Quest system
 * Provides controls for testing different features and states
 */
export function QuestTestPage() {
  // State for test settings
  const [showDebugPanel, setShowDebugPanel] = useState<boolean>(false);
  
  return (
    <div className="relative min-h-screen">
      {/* Background effect */}
      <CalmingBackground intensity="light" />
      
      {/* Main content */}
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-navy">
            Psychology Assessment Test Page
          </h1>
          
          <QuestButton
            variant="outline"
            size="small"
            onClick={() => setShowDebugPanel(!showDebugPanel)}
          >
            {showDebugPanel ? 'Hide Debug Panel' : 'Show Debug Panel'}
          </QuestButton>
        </div>
        
        {/* Debug panel */}
        {showDebugPanel && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
            <h2 className="text-lg font-medium text-navy mb-3">Debug Controls</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Test Scenarios</h3>
                <div className="space-y-2">
                  <QuestButton size="small" fullWidth>
                    Test Complete Flow
                  </QuestButton>
                  <QuestButton size="small" fullWidth>
                    Test Error State
                  </QuestButton>
                  <QuestButton size="small" fullWidth>
                    Reset Local Storage
                  </QuestButton>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Component Tests</h3>
                <div className="space-y-2">
                  <QuestButton size="small" fullWidth>
                    Test Question Cards
                  </QuestButton>
                  <QuestButton size="small" fullWidth>
                    Test Response Inputs
                  </QuestButton>
                  <QuestButton size="small" fullWidth>
                    Test Animations
                  </QuestButton>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <QuestDivider text="Assessment Preview" className="mb-6" />
        
        {/* Render the actual Quest page */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <QuestPage />
        </div>
        
        {/* Test information */}
        <div className="mt-8 text-sm text-gray-500">
          <p>
            This is a test page for the Psychology Assessment system. It demonstrates
            the integration of all components into a cohesive experience.
          </p>
          <p className="mt-2">
            Use the debug panel to test different scenarios and components.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuestTestPage;