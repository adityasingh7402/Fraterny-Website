// // src/pages/quest/QuestRoute.tsx

// import React, { lazy, Suspense } from 'react';
// import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../contexts/AuthContext';

// import QuestResultIndex from './QuestResultIndex';
// import Footer from '@/components/Footer';
// import Navigation from '@/components/Navigation';

// // Lazy-load other quest-related components
// const QuestProcessing = lazy(() => import('../../components/quest/views/QuestProcessing'));
// const QuestResult = lazy(() => import('../../components/quest/views/QuestResult'));

// // Create a simple loading component for quest routes
// const QuestLoading = () => (
//   <div className="min-h-screen flex items-center justify-center bg-gray-50">
//     <div className="flex flex-col items-center gap-4">
//       <div className="w-10 h-10 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
//       <p className="text-gray-700 font-medium">Loading Assessment...</p>
//     </div>
//   </div>
// );

// const QuestResultRoute: React.FC = () => {
//   const { user, isLoading } = useAuth();
//   const location = useLocation();

//   // We'll only require authentication for viewing results, not for taking the assessment
//   const requiresAuth = 
//   location.pathname.includes('/quest-result/result') || 
//   location.pathname.includes('/quest-result/processing');

//   // Check authentication if needed
//   if (requiresAuth && !isLoading && !user) {
//     return <Navigate to="/auth" state={{ from: location }} replace />;
//   }

//   return (
//     <Routes>
//       {/* Main assessment page */}
//       <Route index element={<QuestResultIndex />} />
      
//       {/* Processing route */}
//       <Route 
//         path="processing/:sessionId/:userId/:testid" 
//         element={
//           <Suspense fallback={<QuestLoading />}>
//             <QuestProcessing />
//           </Suspense>
//         } 
//       />
//       <Route 
//         path="processing/:userId/:testid" 
//         element={
//           <Suspense fallback={<QuestLoading />}>
//             <Navigation />
//             <QuestProcessing />
//             <Footer/>
//           </Suspense>
//         } 
//       />
      
//       {/* Result route */}
//       <Route 
//         path="result/:sessionId/:userId/:testid" 
//         element={
//           <Suspense fallback={<QuestLoading />}>
//             <Navigation />
//             <QuestResult />
//             <Footer/>
//           </Suspense>
//         } 
//       />
//       <Route 
//         path="result" 
//         element={
//           <Suspense fallback={<QuestLoading />}>
//             <QuestResult />
//           </Suspense>
//         } 
//       />
      
//       {/* Fallback to main assessment page */}
//       <Route path="*" element={<Navigate to="/quest-result" replace />} />
//     </Routes>
//   );
// };

// export default QuestResultRoute;

// src/pages/quest/QuestResultRoute.tsx

import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import QuestResultIndex from './QuestResultIndex';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';
import { useParams } from 'react-router-dom';

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

  // DEBUG: Log current location and user info
  console.log('🔍 QuestResultRoute DEBUG:');
  console.log('📍 Current pathname:', location.pathname);
  console.log('🔗 Full location:', location);
  console.log('👤 User:', user?.id);
  console.log('⏳ IsLoading:', isLoading);

  // We'll only require authentication for viewing results, not for taking the assessment
  const requiresAuth = 
    location.pathname.includes('/quest-result/result') || 
    location.pathname.includes('/quest-result/processing');

  console.log('🔐 RequiresAuth:', requiresAuth);

  // Check authentication if needed
  if (requiresAuth && !isLoading && !user) {
    console.log('❌ Auth required but user not found, redirecting to /auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return (
    <Routes>
      {/* Main assessment page */}
      <Route index element={<QuestResultIndex />} />
      
      {/* Processing routes - Most specific first */}
      <Route 
        path="processing/:sessionId/:userId/:testid" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <Navigation />
            <QuestProcessing />
            <Footer />
          </Suspense>
        } 
      />
      
      {/* Result routes - Most specific first */}
      <Route 
        path="result/:sessionId/:userId/:testid" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <Navigation />
            <QuestResult />
            <Footer />
          </Suspense>
        } 
      />
      
      {/* Fallback routes for backwards compatibility */}
      <Route 
        path="processing/:sessionId" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <Navigation />
            <QuestProcessing />
            <Footer />
          </Suspense>
        } 
      />
      
      <Route 
        path="result/:sessionId" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <Navigation />
            <QuestResult />
            <Footer />
          </Suspense>
        } 
      />
      
      {/* Simple fallback routes */}
      <Route 
        path="processing" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <Navigation />
            <QuestProcessing />
            <Footer />
          </Suspense>
        } 
      />
      
      <Route 
        path="result" 
        element={
          <Suspense fallback={<QuestLoading />}>
            <Navigation />
            <QuestResult />
            <Footer />
          </Suspense>
        } 
      />
      
      {/* Fallback to main assessment page */}
      <Route path="*" element={<Navigate to="/quest-result" replace />} />
    </Routes>
  );
};

export default QuestResultRoute;