// // import React, { lazy, Suspense } from 'react';
// // import ReactDOM from 'react-dom/client';
// // import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// // import './index.css';
// // import App from './App';
// // import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// // // Lazy-loaded components
// // const Index = lazy(() => import('./pages/Index'));
// // const Auth = lazy(() => import('./pages/Auth'));
// // const Experience = lazy(() => import('./pages/Experience'));
// // const Process = lazy(() => import('./pages/Process'));
// // const Pricing = lazy(() => import('./pages/Pricing'));
// // const FAQ = lazy(() => import('./pages/FAQ'));
// // const Blog = lazy(() => import('./pages/Blog'));
// // const BlogPost = lazy(() => import('./pages/BlogPost'));
// // const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
// // const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
// // const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
// // const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
// // const NotFound = lazy(() => import('./pages/NotFound'));

// // // Admin
// // const Dashboard = lazy(() => import('./pages/admin/dashboard'));
// // const AdminBlog = lazy(() => import('./pages/admin/blog'));
// // const Analytics = lazy(() => import('./pages/admin/Analytics'));
// // const AdminImages = lazy(() => import('./pages/admin/images'));
// // const NewsletterSubscribers = lazy(() => import('./pages/admin/NewsletterSubscribers'));

// // const suspenseWrap = (element: React.ReactNode) => (
// //   <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
// // );

// // const router = createBrowserRouter([
// //   {
// //     path: '/',
// //     element: <App />,
// //     errorElement: suspenseWrap(<NotFound />),
// //     children: [
// //       { index: true, element: suspenseWrap(<Index />) },
// //       { path: 'auth', element: suspenseWrap(<Auth />) },
// //       { path: 'experience', element: suspenseWrap(<Experience />) },
// //       { path: 'process', element: suspenseWrap(<Process />) },
// //       { path: 'pricing', element: suspenseWrap(<Pricing />) },
// //       { path: 'faq', element: suspenseWrap(<FAQ />) },
// //       { path: 'blog', element: suspenseWrap(<Blog />) },
// //       { path: 'blog/:id', element: suspenseWrap(<BlogPost />) },
// //       { path: 'privacy-policy', element: suspenseWrap(<PrivacyPolicy />) },
// //       { path: 'terms-of-use', element: suspenseWrap(<TermsOfUse />) },
// //       { path: 'terms-and-conditions', element: suspenseWrap(<TermsAndConditions />) },
// //       { path: 'refund-policy', element: suspenseWrap(<RefundPolicy />) },
// //       {
// //         path: 'admin',
// //         element: <AdminRoute />, // ProtectedRoute remains statically imported
// //         children: [
// //           { index: true, element: suspenseWrap(<Dashboard />) },
// //           { path: 'blog', element: suspenseWrap(<AdminBlog />) },
// //           { path: 'analytics', element: suspenseWrap(<Analytics />) },
// //           { path: 'images', element: suspenseWrap(<AdminImages />) },
// //           { path: 'newsletter', element: suspenseWrap(<NewsletterSubscribers />) },
// //         ],
// //       },
// //     ],
// //   },
// // ]);

// // ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
// //   <React.StrictMode>
// //     <RouterProvider router={router} />
// //   </React.StrictMode>
// // );

// import React, { lazy, Suspense } from 'react';
// import ReactDOM from 'react-dom/client';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import './index.css';
// import App from './App';
// import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
// import ModernLoading from './components/ui/ModernLoading';

// // Lazy-loaded components
// const Index = lazy(() => import('./pages/Index'));
// const Auth = lazy(() => import('./pages/Auth'));
// const Experience = lazy(() => import('./pages/Experience'));
// const Process = lazy(() => import('./pages/Process'));
// const Pricing = lazy(() => import('./pages/Pricing'));
// const FAQ = lazy(() => import('./pages/FAQ'));
// const Blog = lazy(() => import('./pages/Blog'));
// const BlogPost = lazy(() => import('./pages/BlogPost'));
// const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
// const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
// const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
// const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
// const NotFound = lazy(() => import('./pages/NotFound'));

// // Admin
// const Dashboard = lazy(() => import('./pages/admin/dashboard'));
// const AdminBlog = lazy(() => import('./pages/admin/blog'));
// const Analytics = lazy(() => import('./pages/admin/Analytics'));
// const AdminImages = lazy(() => import('./pages/admin/images'));
// const NewsletterSubscribers = lazy(() => import('./pages/admin/NewsletterSubscribers'));

// // UPDATED: Modern loading with engaging message
// const suspenseWrap = (element: React.ReactNode) => (
//   <Suspense fallback={<ModernLoading />}>{element}</Suspense>
// );

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//     errorElement: suspenseWrap(<NotFound />),
//     children: [
//       { index: true, element: suspenseWrap(<Index />) },
//       { path: 'auth', element: suspenseWrap(<Auth />) },
//       { path: 'experience', element: suspenseWrap(<Experience />) },
//       { path: 'process', element: suspenseWrap(<Process />) },
//       { path: 'pricing', element: suspenseWrap(<Pricing />) },
//       { path: 'faq', element: suspenseWrap(<FAQ />) },
//       { path: 'blog', element: suspenseWrap(<Blog />) },
//       { path: 'blog/:id', element: suspenseWrap(<BlogPost />) },
//       { path: 'privacy-policy', element: suspenseWrap(<PrivacyPolicy />) },
//       { path: 'terms-of-use', element: suspenseWrap(<TermsOfUse />) },
//       { path: 'terms-and-conditions', element: suspenseWrap(<TermsAndConditions />) },
//       { path: 'refund-policy', element: suspenseWrap(<RefundPolicy />) },
//       {
//         path: 'admin',
//         element: <AdminRoute />, // ProtectedRoute remains statically imported
//         children: [
//           { index: true, element: suspenseWrap(<Dashboard />) },
//           { path: 'blog', element: suspenseWrap(<AdminBlog />) },
//           { path: 'analytics', element: suspenseWrap(<Analytics />) },
//           { path: 'images', element: suspenseWrap(<AdminImages />) },
//           { path: 'newsletter', element: suspenseWrap(<NewsletterSubscribers />) },
//         ],
//       },
//     ],
//   },
// ]);

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );

import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import ModernLoading from './components/ui/ModernLoading';

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

// ADMIN ROUTES - Heavily lazy loaded and chunk-separated
const AdminRoute = lazy(() => import('./components/ProtectedRoute').then(module => ({ 
  default: module.AdminRoute 
})));
const Dashboard = lazy(() => import('./pages/admin/dashboard'));
const AdminBlog = lazy(() => import('./pages/admin/blog'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AdminImages = lazy(() => import('./pages/admin/images'));
const NewsletterSubscribers = lazy(() => import('./pages/admin/NewsletterSubscribers'));

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
      
      // LEGAL PAGES - Lazy loaded with minimal loading
      { path: 'privacy-policy', element: createSuspenseWrapper()(<PrivacyPolicy />) },
      { path: 'terms-of-use', element: createSuspenseWrapper()(<TermsOfUse />) },
      { path: 'terms-and-conditions', element: createSuspenseWrapper()(<TermsAndConditions />) },
      { path: 'refund-policy', element: createSuspenseWrapper()(<RefundPolicy />) },
      
      // ADMIN ROUTES - Heavily lazy loaded with admin-specific loading
      {
        path: 'admin',
        element: createSuspenseWrapper(AdminLoading)(<AdminRoute />),
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