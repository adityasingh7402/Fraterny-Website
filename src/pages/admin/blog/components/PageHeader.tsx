
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageHeaderProps {
  onNewPostClick: () => void;
}

const PageHeader = ({ onNewPostClick }: PageHeaderProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col mb-8">
      <h2 className="text-3xl font-bold tracking-tight font-playfair text-navy">Blog Management</h2>
      <p className="text-muted-foreground mb-4">
        Create and manage your blog posts
      </p>
      
      <div className={`${isMobile ? 'flex flex-col w-full' : 'flex flex-row'} gap-2`}>
        <Link 
          to="/" 
          className={`flex items-center justify-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all ${isMobile ? 'w-full' : ''}`}
        >
          <ArrowLeft size={16} />
          Back to Website
        </Link>
        <Link 
          to="/admin" 
          className={`flex items-center justify-center px-4 py-2 border border-navy text-navy rounded-md hover:bg-navy hover:text-white transition-colors ${isMobile ? 'w-full' : ''}`}
        >
          Admin Dashboard
        </Link>
        <Button 
          onClick={onNewPostClick}
          className={`flex items-center justify-center gap-2 ${isMobile ? 'w-full' : ''}`}
        >
          <PlusCircle className="h-4 w-4" />
          New Post
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
