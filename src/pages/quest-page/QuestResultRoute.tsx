// src/pages/quest/QuestRoute.tsx

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import QuestResultIndex from './QuestresultIndex';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

// Lazy-load other quest-related components
const QuestProcessing = lazy(() => import('../../components/quest/views/QuestProcessing'));
const QuestResult = lazy(() => import('../../components/quest/views/QuestResult'));

// Create a simple loading component for quest routes
const QuestLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
      <p className="text-gray-700 font-medium">Loading Assessment...</p>
    </div>
  </div>
);

const QuestResultRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // We'll only require authentication for viewing results, not for taking the assessment
  const requiresAuth = 
  location.pathname.includes('/quest-result/result') || 
  location.pathname.includes('/quest-result/processing');

  // Check authentication if needed
  if (requiresAuth && !isLoading && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      {/* Main assessment page */}
      <Route index element={<QuestResultIndex />} />
      
      {/* Processing route */}
      <Route 
        path="processing/:sessionId" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <QuestProcessing />
          </Suspense>
        } 
      />
      <Route 
        path="processing" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <Navigation />
            <QuestProcessing />
            <Footer/>
          </Suspense>
        } 
      />
      
      {/* Result route */}
      <Route 
        path="result/:sessionId" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <Navigation />
            <QuestResult />
            <Footer/>
          </Suspense>
        } 
      />
      <Route 
        path="result" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <QuestResult />
          </Suspense>
        } 
      />
      
      {/* Fallback to main assessment page */}
      <Route path="*" element={<Navigate to="/quest-result" replace />} />
    </Routes>
  );
};

export default QuestResultRoute;