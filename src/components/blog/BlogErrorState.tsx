
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface BlogErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const BlogErrorState: React.FC<BlogErrorStateProps> = ({
  message = "Failed to load blog posts",
  onRetry
}) => {
  return (
    <div className="py-10">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      {onRetry && (
        <div className="text-center">
          <button 
            onClick={onRetry}
            className="px-4 py-2 bg-navy text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogErrorState;
