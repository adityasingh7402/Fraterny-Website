
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { initializeAnalytics } from "@/utils/analyticsInitializer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false
    }
  }
});

const App = () => {
  // Initialize analytics when the app loads
  useEffect(() => {
    initializeAnalytics();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
};

export default App;
