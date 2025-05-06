import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';

const UserMenu = ({ isScrolled }: { isScrolled: boolean }) => {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const adminLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Blog Management', href: '/admin/blog' },
    { name: 'Image Management', href: '/admin/images' },
    { name: 'Newsletter', href: '/admin/newsletter' },
  ];

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
      toast.error('Sign out failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center space-x-2 focus:outline-none"
          aria-label="User menu"
        >
          <div className={`w-10 h-10 rounded-full bg-terracotta flex items-center justify-center ${isScrolled ? 'text-white' : 'text-navy'}`}>
            {user?.user_metadata?.first_name ? (
              <span className="text-white font-medium">
                {user.user_metadata.first_name.charAt(0)}
              </span>
            ) : (
              <User size={18} />
            )}
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="text-sm px-4">
          {user?.email}
          <div className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'User'}</div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isAdmin &&
          adminLinks.map(link => (
            <DropdownMenuItem
              key={link.name}
              onClick={() => navigate(link.href)}
              className="cursor-pointer"
            >
              {link.name}
            </DropdownMenuItem>
          ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 cursor-pointer"
          disabled={loading}
        >
          <LogOut size={16} className="mr-2" />
          {loading ? 'Signing out...' : 'Sign Out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
