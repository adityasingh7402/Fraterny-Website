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
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminBlog from './pages/admin/Blog';
import Analytics from './pages/admin/Analytics';
import AdminImages from './pages/admin/Images';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NewsletterSubscribers from './pages/admin/NewsletterSubscribers';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
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
      // Admin routes
      {
        path: "admin",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
      },
      {
        path: "admin/blog",
        element: <ProtectedRoute><AdminBlog /></ProtectedRoute>,
      },
      {
        path: "admin/analytics",
        element: <ProtectedRoute><Analytics /></ProtectedRoute>,
      },
      {
        path: "admin/images",
        element: <ProtectedRoute><AdminImages /></ProtectedRoute>,
      },
      // Add the new Newsletter Subscribers admin route
      {
        path: "admin/newsletter",
        element: <ProtectedRoute><NewsletterSubscribers /></ProtectedRoute>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
