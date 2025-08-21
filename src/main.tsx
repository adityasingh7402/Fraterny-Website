import React, { lazy, Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import ModernLoading from './components/ui/ModernLoading';
import { detectPlatform, storePlatformInfo } from '@/utils/platformTracking';
import { initializeUserJourney } from '@/services/userJourneyManager';
import ResultsDemo from './components/quest/views/ResultsDemo';


initializeUserJourney();

// Initialize platform detection immediately when the app loads
// const platformInfo = detectPlatform();
// storePlatformInfo(platformInfo);

// CRITICAL ROUTES - Load immediately (no lazy loading for better performance)
import Index from './pages/Index';
import Auth from './pages/Auth';

// SECONDARY ROUTES - Lazy load for better code splitting
const Experience = lazy(() => import('./pages/Experience'));
const Process = lazy(() => import('./pages/Process'));
const Pricing = lazy(() => import('./pages/Pricing'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));

// LEGAL PAGES - Lazy load (rarely accessed)
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import QuestResult from './components/quest/views/QuestResult';

// ADMIN ROUTES - Heavily lazy loaded and chunk-separated
const Dashboard = lazy(() => import('./pages/admin/dashboard'));
const AdminBlog = lazy(() => import('./pages/admin/blog'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AdminImages = lazy(() => import('./pages/admin/images'));
const NewsletterSubscribers = lazy(() => import('./pages/admin/NewsletterSubscribers'));

// PROFILE ROUTES - Lazy loaded with optimized chunks
const ProfileRoute = lazy(() => import('./components/ProfileRoute'));
const ProfilePage = lazy(() => import('./pages/profile'));

// QUEST ROUTE - Lazy loaded with optimized loading
const QuestRoute = lazy(() => import('../src/pages/quest/QuestRoute'));

const QuestResultRoute = lazy(() => import('./pages/quest-page/QuestResultRoute'));
const QuestResultIndex = lazy(() => import('./pages/quest-page/QuestResultIndex'));
const QuestLandingPage = lazy(() => import('./pages/quest-landing-page'));
const QuestDashboard = lazy(() => import('../src/components/quest/views/questdashboard/QuestDashboard'));
const QuestPaidFeedback = lazy(() => import('./components/quest/views/QuestPaidFeedback'));

// PERFORMANCE-OPTIMIZED SUSPENSE WRAPPER
const createSuspenseWrapper = (fallbackComponent?: React.ComponentType) => 
  (element: React.ReactNode) => (
    <Suspense fallback={fallbackComponent ? React.createElement(fallbackComponent) : <ModernLoading />}>
      {element}
    </Suspense>
  );

// Lightweight loading for secondary routes
const LightLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
);

// Heavy loading for admin routes
const AdminLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 border-navy border-t-transparent animate-spin"></div>
      <p className="text-gray-700 font-medium">Loading Admin Panel...</p>
    </div>
  </div>
);

// Profile loading
const ProfileLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-navy border-t-transparent animate-spin"></div>
      <p className="text-gray-700 font-medium">Loading Profile...</p>
    </div>
  </div>
);

// Quest loading
const QuestLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      <p className="text-gray-700 font-medium">Loading Assessment...</p>
    </div>
  </div>
);

const QuestassessmentLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      <p className="text-gray-700 font-medium">Starting your result assessment...</p>
    </div>
  </div>
);

const QuestResultLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      <p className="text-gray-700 font-medium">Your report is ready ...</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: createSuspenseWrapper()(<NotFound />),
    children: [
      // CRITICAL ROUTES - No lazy loading for instant access
      { index: true, element: <Index /> },
      { path: 'auth', element: <Auth /> },
      
      // SECONDARY ROUTES - Lazy loaded with light loading
      { path: 'experience', element: createSuspenseWrapper(LightLoading)(<Experience />) },
      { path: 'process', element: createSuspenseWrapper(LightLoading)(<Process />) },
      { path: 'pricing', element: createSuspenseWrapper(LightLoading)(<Pricing />) },
      { path: 'faq', element: createSuspenseWrapper(LightLoading)(<FAQ />) },
      { path: 'blog', element: createSuspenseWrapper(LightLoading)(<Blog />) },
      { path: 'blog/:id', element: createSuspenseWrapper(LightLoading)(<BlogPost />) },


      // PROTECTED QUEST ROUTE - Authentication required
      {
        path: 'assessment',
        // element: <ProtectedRoute />,
        children: [
          { index: true, element: createSuspenseWrapper(QuestLoading)(<QuestRoute />) },
        ],
      },
      
      // OTHER QUEST ROUTES - Lazy loaded with custom loading
      { path: 'quest-result/*', element: <QuestResultRoute /> },
      { path: 'quest-index', element: createSuspenseWrapper(QuestResultLoading)(<QuestResultIndex />) },
      { path: 'quest', element: <QuestLandingPage />},
      { path: 'quest-dashboard/:userId', element: createSuspenseWrapper(QuestLoading)(<QuestDashboard />) },
      // RESULTS DEMO
      { path: 'results-demo', element: createSuspenseWrapper(LightLoading)(<ResultsDemo />) },
      { path: 'quest-result/:userId/:sessionId/:testId', element: createSuspenseWrapper(LightLoading)(<QuestResult />) },
      { path: 'quest-paid-feedback', element: <QuestPaidFeedback /> },

      // LEGAL PAGES - Lazy loaded with minimal loading
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-of-use', element: <TermsOfUse /> },
      { path: 'terms-and-conditions', element: createSuspenseWrapper()(<TermsAndConditions />) },
      { path: 'refund-policy', element: createSuspenseWrapper()(<RefundPolicy />) },
      
      // PROFILE ROUTES - Protected and optimized loading
      {
        path: 'profile',
        element: createSuspenseWrapper(ProfileLoading)(<ProfileRoute />),
        children: [
          { index: true, element: createSuspenseWrapper(ProfileLoading)(<ProfilePage />) },
        ],
      },
      
      // ADMIN ROUTES - Heavily lazy loaded with admin-specific loading
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          { index: true, element: createSuspenseWrapper(AdminLoading)(<Dashboard />) },
          { path: 'blog', element: createSuspenseWrapper(AdminLoading)(<AdminBlog />) },
          { path: 'analytics', element: createSuspenseWrapper(AdminLoading)(<Analytics />) },
          { path: 'images', element: createSuspenseWrapper(AdminLoading)(<AdminImages />) },
          { path: 'newsletter', element: createSuspenseWrapper(AdminLoading)(<NewsletterSubscribers />) },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);