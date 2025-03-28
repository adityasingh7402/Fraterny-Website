
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

import Index from './pages/Index';
import Experience from './pages/Experience';
import Process from './pages/Process';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBlog from './pages/admin/Blog';
import AdminImages from './pages/admin/images';
import AnalyticsDashboard from './pages/admin/Analytics';
import NotFound from './pages/NotFound';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import RefundPolicy from './pages/RefundPolicy';
import Auth from './pages/Auth';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

// Create a query client
const queryClient = new QueryClient();

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "experience",
        element: <Experience />,
      },
      {
        path: "process",
        element: <Process />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/:id",
        element: <BlogPost />,
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "terms-and-conditions",
        element: <TermsAndConditions />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-of-use",
        element: <TermsOfUse />,
      },
      {
        path: "refund-policy",
        element: <RefundPolicy />,
      },
      // Protected admin routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminRoute />,
            children: [
              {
                path: "admin/dashboard",
                element: <AdminDashboard />,
              },
              {
                path: "admin/blog",
                element: <AdminBlog />,
              },
              {
                path: "admin/images",
                element: <AdminImages />,
              },
              {
                path: "admin/analytics",
                element: <AnalyticsDashboard />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Render the app with proper provider wrapping
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
