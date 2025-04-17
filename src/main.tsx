
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Experience from './pages/Experience';
import Process from './pages/Process';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';
import NotFound from './pages/NotFound';
import Dashboard from './pages/admin/dashboard';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import AdminBlog from './pages/admin/blog';
import Analytics from './pages/admin/Analytics';
import AdminImages from './pages/admin/images';
import NewsletterSubscribers from './pages/admin/NewsletterSubscribers';

// Create router with proper configuration for production deployment
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      // Make the Index component explicitly assigned to the root path
      { index: true, element: <Index /> },
      { path: "auth", element: <Auth /> },
      { path: "experience", element: <Experience /> },
      { path: "process", element: <Process /> },
      { path: "pricing", element: <Pricing /> },
      { path: "faq", element: <FAQ /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:id", element: <BlogPost /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-of-use", element: <TermsOfUse /> },
      { path: "terms-and-conditions", element: <TermsAndConditions /> },
      { path: "refund-policy", element: <RefundPolicy /> },
      
      // Admin routes with proper nesting
      {
        path: "admin",
        element: <AdminRoute />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "blog", element: <AdminBlog /> },
          { path: "analytics", element: <Analytics /> },
          { path: "images", element: <AdminImages /> },
          { path: "newsletter", element: <NewsletterSubscribers /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
