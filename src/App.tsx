
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      {/* Default Shadcn UI toast notification system */}
      <Toaster />
      
      {/* Sonner toast notification system with customizations */}
      <Sonner 
        position="top-right"
        toastOptions={{
          style: {
            background: 'white',
            color: '#0A1A2F', // Navy color
            border: '1px solid #e2e8f0',
          },
          classNames: {
            toast: 'group',
            success: 'border-green-500 text-green-600',
            error: 'border-red-500 text-red-600',
            info: 'border-blue-500 text-blue-600',
          }
        }}
      />
      
      <Outlet />
    </AuthProvider>
  </TooltipProvider>
);

export default App;
