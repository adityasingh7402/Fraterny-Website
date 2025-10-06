import React from 'react';
import { motion } from 'framer-motion';
import { useQuest } from '../core/useQuest';
import { CalmingBackground } from '../effects/CalmingBackground';
import { QuestHeader } from './QuestHeader';
import { QuestContainer } from './QuestContainer';
import { QuestNavigation } from './QuestNavigation';

interface QuestLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showNavigation?: boolean;
  showBackground?: boolean;
  className?: string;
  onFinish?: () => void;
}

/**
 * The main layout component for the quest system
 * Provides structure, navigation, and visual effects
 * Enhanced for desktop with better margins and borders
 */
export function QuestLayout({
  children,
  showHeader = true,
  showNavigation = true,
  showBackground = true,
  className = '',
  onFinish 
}: QuestLayoutProps) {
  const { currentSection, session, isLoading, error } = useQuest();
  
  return (
    <div className='pt-0'>
      {/* Mobile Layout (unchanged) */}
      <div className={`lg:hidden relative max-h-dvh min-h-dvh w-full flex flex-col ${className}`}>
        
        {/* Header with title and progress */}
        {showHeader && (
          <QuestHeader 
            title={currentSection?.title || 'Psychology Assessment'} 
            subtitle={currentSection?.description}
            className=''
          />
        )}
        
        {/* Main content area */}
        <main className="flex-1 overflow-auto pb-24">
          <QuestContainer className='px-6 min-h-full'>
            {/* Loading state */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center p-8"
              >
                <div className="loader w-8 h-8 border-4 border-gray-200 border-t-terracotta rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading your assessment...</span>
              </motion.div>
            )}
            
            {/* Error state */}
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200"
              >
                <h3 className="font-medium">Something went wrong</h3>
                <p className="text-sm mt-1">{error.message}</p>
                <button 
                  className="mt-2 text-sm bg-white px-3 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
              </motion.div>
            )}
            
            {!isLoading && !error && children}
          </QuestContainer>
        </main>
        <div className='absolute bottom-0 w-full px-2 py-4 bg-white to-transparent'>
        {showNavigation && session && session.status === 'in_progress' && (
          <QuestNavigation 
            showPrevious={true}
            showNext={true}
            showSkip={false}
            showFinish={true}
            onFinish={onFinish}
          />
        )}
        </div>
      
      </div>

      {/* Desktop Layout (enhanced) */}
      <div className={`hidden lg:flex relative max-h-dvh min-h-dvh w-full ${className}`}>
        
        {/* Left Sidebar - Expanded Section Drawer */}
        <div className="w-48 xl:w-56 bg-sky-900/5 border-r border-sky-200/20 p-6 overflow-y-auto">
          <div className="sticky top-6">
            <div className="bg-white rounded-[10px] border-[1.50px] border-neutral-400 py-2 shadow-lg">
              <div id="desktop-section-drawer">
                {/* Section drawer will be rendered here */}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header with title and progress */}
          {showHeader && (
            <QuestHeader 
              title={currentSection?.title || 'Psychology Assessment'} 
              subtitle={currentSection?.description}
              className='border-b border-sky-200/30 bg-sky-50/30'
            />
          )}
          
          {/* Main content area with enhanced margins */}
          <main className="flex-1 overflow-auto pb-32 px-8 py-6">
            <QuestContainer className='min-h-full max-w-4xl mx-auto border border-sky-200/40 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg p-8'>
              {/* Loading state */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center p-12"
                >
                  <div className="loader w-12 h-12 border-4 border-gray-200 border-t-sky-500 rounded-full animate-spin"></div>
                  <span className="ml-4 text-lg text-gray-600">Loading your assessment...</span>
                </motion.div>
              )}
              
              {/* Error state */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 text-red-700 p-6 rounded-xl border-2 border-red-200 shadow-sm"
                >
                  <h3 className="font-semibold text-lg mb-2">Something went wrong</h3>
                  <p className="text-base mb-4">{error.message}</p>
                  <button 
                    className="text-base bg-white px-6 py-3 rounded-lg border-2 border-red-200 hover:bg-red-50 transition-colors shadow-sm font-medium"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                </motion.div>
              )}
              
              {!isLoading && !error && children}
            </QuestContainer>
          </main>
          
          {/* Navigation positioned with better spacing - matches question container width */}
          <div className='absolute bottom-0 left-48 xl:left-56 right-72 xl:right-80 px-8 py-6 bg-gradient-to-t from-sky-50/80 to-transparent'>
            {showNavigation && session && session.status === 'in_progress' && (
              <div className="max-w-4xl mx-auto">
                <QuestNavigation 
                  showPrevious={true}
                  showNext={true}
                  showSkip={false}
                  showFinish={true}
                  onFinish={onFinish}
                  className="desktop-enhanced"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Right Sidebar - Question Info */}
        <div className="w-72 xl:w-80 bg-sky-900/5 border-l border-sky-200/20 p-6 overflow-y-auto">
          <div className="sticky top-6 space-y-6">
            
            {/* Question Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 font-['Gilroy-Bold']">Question Info</h3>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-sky-200/40 shadow-sm">
                <div id="desktop-info-container" className="text-gray-600 font-['Gilroy-Regular']">
                  <p className="text-sm text-gray-500 italic">Question information will appear here when available.</p>
                </div>
              </div>
            </div>
            
            {/* Assessment Tips */}
            <div>
              <h4 className="text-base font-semibold text-gray-800 mb-3 font-['Gilroy-Bold']">Assessment Tips</h4>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-sky-200/30 shadow-sm">
                <ul className="text-sm text-gray-600 space-y-2 font-['Gilroy-Regular']">
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2 font-bold">•</span>
                    <span>Be honest for more accurate insights</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2 font-bold">•</span>
                    <span>Use tags to express your response style</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-sky-600 mr-2 font-bold">•</span>
                    <span>Take your time to reflect</span>
                  </li>
                </ul>
              </div>
            </div>
            
          </div>
        </div>
      
      </div>
    </div>
  );
}

export default QuestLayout;