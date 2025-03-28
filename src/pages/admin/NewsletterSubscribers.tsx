
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { AlertCircle, Trash2, Download, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

const NewsletterSubscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setSubscribers(data as Subscriber[] || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load subscribers');
      console.error('Error fetching subscribers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubscriber = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete ${email} from subscribers?`)) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setSubscribers(subscribers.filter(sub => sub.id !== id));
      toast({
        title: "Subscriber deleted",
        description: `${email} has been removed from your newsletter list.`
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete subscriber",
        variant: "destructive"
      });
    }
  };

  const exportSubscribers = () => {
    if (subscribers.length === 0) {
      toast({
        title: "No subscribers",
        description: "There are no subscribers to export.",
        variant: "destructive"
      });
      return;
    }

    // Create CSV content
    const headers = ['Email', 'Date Subscribed'];
    const csvContent = [
      headers.join(','),
      ...subscribers.map(sub => {
        const date = new Date(sub.created_at).toLocaleDateString();
        return `${sub.email},${date}`;
      })
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-10 mx-auto">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-navy border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading subscribers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-10 mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-10 mx-auto max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h2>
          <p className="text-muted-foreground">
            Manage your newsletter subscription list
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            <ArrowLeft size={16} />
            Back to Website
          </Link>
          <Button 
            onClick={exportSubscribers}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <Mail className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No subscribers yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            When people subscribe to your newsletter, they'll appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Date Subscribed</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.email}</TableCell>
                  <TableCell>{formatDate(subscriber.created_at)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteSubscriber(subscriber.id, subscriber.email)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 border-t text-sm text-gray-500">
            Total subscribers: {subscribers.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterSubscribers;
