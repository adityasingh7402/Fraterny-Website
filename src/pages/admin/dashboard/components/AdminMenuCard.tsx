
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

type AdminMenuCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
};

const AdminMenuCard = ({ icon: Icon, title, description, link }: AdminMenuCardProps) => {
  return (
    <Link 
      to={link} 
      className="flex items-center p-6 bg-white shadow rounded-lg hover:shadow-md transition-shadow border border-gray-100 hover:border-terracotta"
    >
      <div className="bg-navy bg-opacity-10 p-3 rounded-full mr-4">
        <Icon className="w-6 h-6 text-navy" />
      </div>
      <div>
        <h2 className="text-lg font-medium text-navy">{title}</h2>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
};

export default AdminMenuCard;
