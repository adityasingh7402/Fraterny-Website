
import { Link } from 'react-router-dom';

const PageHeader = () => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-playfair text-navy">Blog Management</h1>
      <Link 
        to="/admin" 
        className="px-4 py-2 border border-navy text-navy rounded-md hover:bg-navy hover:text-white transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default PageHeader;
