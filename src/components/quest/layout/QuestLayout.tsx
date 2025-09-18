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
      <div className={`relative max-h-dvh min-h-dvh w-full flex flex-col ${className}`}>
        
        {/* Header with title and progress */}
        {showHeader && (
          <QuestHeader 
            title={currentSection?.title || 'Psychology Assessment'} 
            subtitle={currentSection?.description}
            className=''
          />
        )}
        
        {/* Main content area */}
        <main className="overflow-auto">
          <QuestContainer className='px-6'>
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
            {/* Main content */}
            {/* {!isLoading && !error && children}
            {showNavigation && session && session.status === 'in_progress' && (
              <QuestNavigation 
                showPrevious={true}
                showNext={true}
                showSkip={false}
                showFinish={true}
                onFinish={onFinish}
              />
            )} */}
          </QuestContainer>
        </main>
        <div className='absolute bottom-4 w-full px-2'>
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
    </div>
  );
}

export default QuestLayout;