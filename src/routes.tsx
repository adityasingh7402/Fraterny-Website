
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Index from './pages/Index';
import Experience from './pages/Experience';
import Process from './pages/Process';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Auth from './pages/Auth';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import NotFound from './pages/NotFound';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import AdminImages from './pages/admin/images';
import AnalyticsDashboard from './pages/admin/analytics';
import AdminBlog from './pages/admin/Blog';

// Legal pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import TermsAndConditions from './pages/TermsAndConditions';
import RefundPolicy from './pages/RefundPolicy';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: 'experience',
        element: <Experience />,
      },
      {
        path: 'process',
        element: <Process />,
      },
      {
        path: 'pricing',
        element: <Pricing />,
      },
      {
        path: 'faq',
        element: <FAQ />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'blog',
        element: <Blog />,
      },
      {
        path: 'blog/:slug',
        element: <BlogPost />,
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms-of-use',
        element: <TermsOfUse />,
      },
      {
        path: 'terms-and-conditions',
        element: <TermsAndConditions />,
      },
      {
        path: 'refund-policy',
        element: <RefundPolicy />,
      },
      {
        path: 'admin',
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminRoute />,
            children: [
              {
                index: true,
                element: <Dashboard />,
              },
              {
                path: 'images',
                element: <AdminImages />,
              },
              {
                path: 'analytics',
                element: <AnalyticsDashboard />,
              },
              {
                path: 'blog',
                element: <AdminBlog />,
              },
            ],
          },
        ],
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
