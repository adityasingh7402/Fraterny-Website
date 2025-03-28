
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx'
import './index.css'
import './App.css'

// Create a query client
const queryClient = new QueryClient();

// Import the Index page eagerly (since it's the landing page)
import Index from './pages/Index';

// Lazy-load all other pages
const Experience = React.lazy(() => import('./pages/Experience'));
const Process = React.lazy(() => import('./pages/Process'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const FAQ = React.lazy(() => import('./pages/FAQ'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Auth = React.lazy(() => import('./pages/Auth'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = React.lazy(() => import('./pages/TermsOfUse'));
const RefundPolicy = React.lazy(() => import('./pages/RefundPolicy'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

// Admin pages (grouped together)
const AdminDashboard = React.lazy(() => import('./pages/admin/Dashboard'));
const AdminBlog = React.lazy(() => import('./pages/admin/Blog'));
const AdminImages = React.lazy(() => import('./pages/admin/images'));
const AnalyticsDashboard = React.lazy(() => import('./pages/admin/Analytics'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-white">
    <div className="w-12 h-12 rounded-full border-4 border-terracotta border-t-transparent animate-spin"></div>
  </div>
);

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <React.Suspense fallback={<PageLoader />}><NotFound /></React.Suspense>,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "experience",
        element: <React.Suspense fallback={<PageLoader />}><Experience /></React.Suspense>,
      },
      {
        path: "process",
        element: <React.Suspense fallback={<PageLoader />}><Process /></React.Suspense>,
      },
      {
        path: "pricing",
        element: <React.Suspense fallback={<PageLoader />}><Pricing /></React.Suspense>,
      },
      {
        path: "faq",
        element: <React.Suspense fallback={<PageLoader />}><FAQ /></React.Suspense>,
      },
      {
        path: "blog",
        element: <React.Suspense fallback={<PageLoader />}><Blog /></React.Suspense>,
      },
      {
        path: "blog/:id",
        element: <React.Suspense fallback={<PageLoader />}><BlogPost /></React.Suspense>,
      },
      {
        path: "auth",
        element: <React.Suspense fallback={<PageLoader />}><Auth /></React.Suspense>,
      },
      {
        path: "terms-and-conditions",
        element: <React.Suspense fallback={<PageLoader />}><TermsAndConditions /></React.Suspense>,
      },
      {
        path: "privacy-policy",
        element: <React.Suspense fallback={<PageLoader />}><PrivacyPolicy /></React.Suspense>,
      },
      {
        path: "terms-of-use",
        element: <React.Suspense fallback={<PageLoader />}><TermsOfUse /></React.Suspense>,
      },
      {
        path: "refund-policy",
        element: <React.Suspense fallback={<PageLoader />}><RefundPolicy /></React.Suspense>,
      },
      // Protected admin routes
      {
        element: <React.Suspense fallback={<PageLoader />}><ProtectedRoute /></React.Suspense>,
        children: [
          {
            element: <React.Suspense fallback={<PageLoader />}><AdminRoute /></React.Suspense>,
            children: [
              {
                path: "admin/dashboard",
                element: <React.Suspense fallback={<PageLoader />}><AdminDashboard /></React.Suspense>,
              },
              {
                path: "admin/blog",
                element: <React.Suspense fallback={<PageLoader />}><AdminBlog /></React.Suspense>,
              },
              {
                path: "admin/images",
                element: <React.Suspense fallback={<PageLoader />}><AdminImages /></React.Suspense>,
              },
              {
                path: "admin/analytics",
                element: <React.Suspense fallback={<PageLoader />}><AnalyticsDashboard /></React.Suspense>,
              },
            ],
          },
        ],
      },
    ],
  },
]);

// Import ProtectedRoute components after setting up the router to avoid import cycles
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Render the app with proper provider wrapping - RouterProvider must come after QueryClientProvider
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
