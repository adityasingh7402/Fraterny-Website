
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Index from "./pages/Index";
import NotFound from './pages/NotFound';
import CdnTestPage from './pages/cdn-test';
import CdnDebugPage from './pages/admin/cdn-debug';

// Create a simple Admin component since it's missing
const Admin = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-navy">Admin Dashboard</h1>
      <p className="mb-4">Select an option from the navigation above.</p>
    </div>
  );
};

// Create empty dashboard components
const AnalyticsDashboard = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6 text-navy">Analytics Dashboard</h1>
    <p>Analytics content will appear here.</p>
  </div>
);

const ImagesDashboard = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6 text-navy">Images Dashboard</h1>
    <p>Images management content will appear here.</p>
  </div>
);

const SettingsDashboard = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6 text-navy">Settings Dashboard</h1>
    <p>Settings content will appear here.</p>
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Index />} errorElement={<NotFound />}>
      <Route path="admin" element={<Admin />} errorElement={<NotFound />}>
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="images" element={<ImagesDashboard />} />
        <Route path="settings" element={<SettingsDashboard />} />
      </Route>
      <Route path="cdn-test" element={<CdnTestPage />} />
      <Route path="admin/cdn-debug" element={<CdnDebugPage />} />
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
