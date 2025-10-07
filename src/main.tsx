import React, { lazy, Suspense, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PostHogProvider } from 'posthog-js/react';
import './index.css';
import App from './App';
import ModernLoading from './components/ui/ModernLoading';
import { HelmetProvider } from 'react-helmet-async';
import { initializeUserJourney } from '@/services/userJourneyManager';
import { getUserLocationFlag } from './services/payments/razorpay/config'
import PlatformTest from './components/PlatformTest';

initializeUserJourney();

// Initialize platform detection immediately when the app loads
// const platformInfo = detectPlatform();
// storePlatformInfo(platformInfo);

// CRITICAL ROUTES - Load immediately (no lazy loading for better performance)
import Index from './pages/Index';
import Auth from './pages/Auth';

// SECONDARY ROUTES - Lazy load for better code splitting
// const Experience = lazy(() => import('./pages/Experience'));
// const Process = lazy(() => import('./pages/Process'));
// const Pricing = lazy(() => import('./pages/Pricing'));
// const FAQ = lazy(() => import('./pages/FAQ'));
import Experience from './pages/Experience';
import Process from './pages/Process';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import BlogPost from './pages/BlogPost';
import Blog from './pages/Blog';

// LEGAL PAGES - Lazy load (rarely accessed)
// const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
// const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
// const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
// const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
// const NotFound = lazy(() => import('./pages/NotFound'));

import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import NotFound from './pages/NotFound';

import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import QuestResult from './components/quest/views/QuestResult';

// ADMIN ROUTES - Heavily lazy loaded and chunk-separated
import Dashboard from './pages/admin/dashboard';
import AdminBlog from './pages/admin/blog';
import Analytics from './pages/admin/Analytics';
import AdminImages from './pages/admin/images';
import NewsletterSubscribers from './pages/admin/NewsletterSubscribers';
import AdminQuestPayment from './pages/admin/payments/AdminQuestPayment';
import AdminUserManagement from './pages/admin/users/AdminUserManagement';
import AdminSummaryManagement from './pages/admin/summaries/AdminSummaryManagement';

// PROFILE ROUTES - Lazy loaded with optimized chunks
const ProfileRoute = lazy(() => import('./components/ProfileRoute'));
const ProfilePage = lazy(() => import('./pages/profile'));

// QUEST ROUTE - Lazy loaded with optimized loading
import QuestRoute from './pages/quest/QuestRoute';
import QuestResultRoute from './pages/quest-page/QuestResultRoute';
const QuestResultIndex = lazy(() => import('./pages/quest-page/QuestResultIndex'));
import QuestLandingPage from './pages/quest-landing-page';
import QuestDashboard from './components/quest/views/questdashboard/QuestDashboard';
import QuestPaidFeedback from './components/quest/views/QuestPaidFeedback';
import AssessmentList from './components/quest/views/AssessmentList';
import PaymentHistory from './components/quest/views/PaymentHistory';

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
      { path: 'experience', element: <Experience /> },
      { path: 'process', element: <Process /> },
      { path: 'pricing', element: <Pricing /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'blog', element: <Blog /> },
      { path: 'blog/:slug', element: <BlogPost /> },


      // testing route
      { path: 'test', element: <PlatformTest /> },

      // QUEST ROUTES - Lazy loaded with custom loading
      { path: 'assessment', element: createSuspenseWrapper(QuestLoading)(<QuestRoute />) },
      { path: 'quest-result/*', element: <QuestResultRoute /> },
      { path: 'quest-index', element: createSuspenseWrapper(QuestResultLoading)(<QuestResultIndex />) },
      { path: 'quest', element: <QuestLandingPage /> },
      { path: 'quest-dashboard/:userId', element: <QuestDashboard /> },
      { path: 'assessment-list/:userId', element: <AssessmentList /> },
      { path: 'payment-history/:userId', element: <PaymentHistory /> },
      { path: 'quest-paid-feedback', element: <QuestPaidFeedback /> },

      // LEGAL PAGES - Lazy loaded with minimal loading
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-of-use', element: <TermsOfUse /> },
      { path: 'terms-and-conditions', element: <TermsAndConditions /> },
      { path: 'refund-policy', element: <RefundPolicy /> },
      
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
          { path: 'users', element: createSuspenseWrapper(AdminLoading)(<AdminUserManagement />) },
          { path: 'summaries', element: createSuspenseWrapper(AdminLoading)(<AdminSummaryManagement />) },
          { path: 'quest-payment', element: createSuspenseWrapper(AdminLoading)(<AdminQuestPayment />) },
        ],
      },
    ],
  },
]);

//console.log('🌍 Initializing location detection...');
getUserLocationFlag()
  .then((isIndia) => {
    console.log('✅ Location detection initialized. User in India:', isIndia);
  })
  .catch((error) => {
    console.error('❌ Location detection initialization failed:', error);
  });


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <PostHogProvider
    apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
    options={{
      api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
      defaults: '2025-05-24',
      capture_exceptions: true,
      //debug: import.meta.env.MODE === 'development',
      debug: false,
    }}
  >
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </PostHogProvider>
);
