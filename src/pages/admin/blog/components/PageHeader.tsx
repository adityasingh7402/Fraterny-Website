
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  onNewPostClick: () => void;
}

const PageHeader = ({ onNewPostClick }: PageHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Blog Management</h2>
        <p className="text-muted-foreground">
          Create and manage your blog posts
        </p>
      </div>
      
      <div className="mt-4 md:mt-0 space-x-2 flex">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all"
        >
          <ArrowLeft size={16} />
          Back to Website
        </Link>
        <Link 
          to="/admin" 
          className="px-4 py-2 border border-navy text-navy rounded-md hover:bg-navy hover:text-white transition-colors"
        >
          Admin Dashboard
        </Link>
        <Button onClick={onNewPostClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>
    </div>
  );
};

export default PageHeader;
