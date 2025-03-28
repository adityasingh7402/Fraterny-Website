
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

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
          <Button
            onClick={onRetry}
            className="bg-navy hover:bg-navy/90"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogErrorState;
