import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Lazy-loaded components
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const Experience = lazy(() => import('./pages/Experience'));
const Process = lazy(() => import('./pages/Process'));
const Pricing = lazy(() => import('./pages/Pricing'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin
const Dashboard = lazy(() => import('./pages/admin/dashboard'));
const AdminBlog = lazy(() => import('./pages/admin/blog'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AdminImages = lazy(() => import('./pages/admin/images'));
const NewsletterSubscribers = lazy(() => import('./pages/admin/NewsletterSubscribers'));

const suspenseWrap = (element: React.ReactNode) => (
  <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: suspenseWrap(<NotFound />),
    children: [
      { index: true, element: suspenseWrap(<Index />) },
      { path: 'auth', element: suspenseWrap(<Auth />) },
      { path: 'experience', element: suspenseWrap(<Experience />) },
      { path: 'process', element: suspenseWrap(<Process />) },
      { path: 'pricing', element: suspenseWrap(<Pricing />) },
      { path: 'faq', element: suspenseWrap(<FAQ />) },
      { path: 'blog', element: suspenseWrap(<Blog />) },
      { path: 'blog/:id', element: suspenseWrap(<BlogPost />) },
      { path: 'privacy-policy', element: suspenseWrap(<PrivacyPolicy />) },
      { path: 'terms-of-use', element: suspenseWrap(<TermsOfUse />) },
      { path: 'terms-and-conditions', element: suspenseWrap(<TermsAndConditions />) },
      { path: 'refund-policy', element: suspenseWrap(<RefundPolicy />) },
      {
        path: 'admin',
        element: <AdminRoute />, // ProtectedRoute remains statically imported
        children: [
          { index: true, element: suspenseWrap(<Dashboard />) },
          { path: 'blog', element: suspenseWrap(<AdminBlog />) },
          { path: 'analytics', element: suspenseWrap(<Analytics />) },
          { path: 'images', element: suspenseWrap(<AdminImages />) },
          { path: 'newsletter', element: suspenseWrap(<NewsletterSubscribers />) },
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
