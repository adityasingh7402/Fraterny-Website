import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AnalyticsDashboard from './pages/admin/analytics';
import ImagesDashboard from './pages/admin/images';
import SettingsDashboard from './pages/admin/settings';
import NotFound from './pages/NotFound";
import CdnTestPage from './pages/cdn-test';
import CdnDebugPage from './pages/admin/cdn-debug';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Index />} errorElement={<NotFound />}>
      <Route path="admin" element={<Admin />} errorElement={<NotFound />}>
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="images" element={<ImagesDashboard />} />
        <Route path="settings" element={<SettingsDashboard />} />
      </Route>
      <Route path="cdn-test" element={<CdnTestPage />} />,
      <Route path="admin/cdn-debug" element={<CdnDebugPage />} />,
    </Route>
  )
);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
