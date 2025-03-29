
import { Image, FileText, BarChart, Users } from 'lucide-react';
import AdminMenuCard from './AdminMenuCard';

const AdminMenu = () => {
  const menuItems = [
    {
      icon: BarChart,
      title: 'Analytics',
      description: 'Website traffic and engagement',
      link: '/admin/analytics'
    },
    {
      icon: FileText,
      title: 'Blog Management',
      description: 'Publish and edit blog posts',
      link: '/admin/blog'
    },
    {
      icon: Image,
      title: 'Image Management',
      description: 'Upload and manage website images',
      link: '/admin/images'
    },
    {
      icon: Users,
      title: 'Newsletter Subscribers',
      description: 'Manage subscriber list',
      link: '/admin/newsletter'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {menuItems.map((item) => (
        <AdminMenuCard
          key={item.title}
          icon={item.icon}
          title={item.title}
          description={item.description}
          link={item.link}
        />
      ))}
    </div>
  );
};

export default AdminMenu;
