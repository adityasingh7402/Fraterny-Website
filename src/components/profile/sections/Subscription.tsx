import React from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProfileData } from '@/hooks/profile/useProfileData';
// Remove the import and add these variants at the top of the component:
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } }
};

interface SubscriptionProps {
  className?: string;
}

interface PaymentHistoryItem {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoice_url?: string;
  payment_method?: string;
}

const Subscription: React.FC<SubscriptionProps> = ({ className = '' }) => {
  const { data: profile, isLoading, error } = useProfileData();

  // Mock payment history data - replace with real data from your backend
  const paymentHistory: PaymentHistoryItem[] = [
    {
      id: '1',
      date: '2024-12-01',
      description: 'Pro Plan - Monthly Subscription',
      amount: 29.00,
      status: 'paid',
      invoice_url: '#',
      payment_method: 'Visa •••• 4242'
    },
    {
      id: '2',
      date: '2024-11-01', 
      description: 'Pro Plan - Monthly Subscription',
      amount: 29.00,
      status: 'paid',
      invoice_url: '#',
      payment_method: 'Visa •••• 4242'
    },
    {
      id: '3',
      date: '2024-10-01',
      description: 'Pro Plan - Monthly Subscription', 
      amount: 29.00,
      status: 'paid',
      invoice_url: '#',
      payment_method: 'Visa •••• 4242'
    },
    {
      id: '4',
      date: '2024-09-15',
      description: 'One-time Quest Analysis Report',
      amount: 15.00,
      status: 'paid',
      invoice_url: '#',
      payment_method: 'PayPal'
    },
    {
      id: '5',
      date: '2024-09-01',
      description: 'Pro Plan - Monthly Subscription',
      amount: 29.00,
      status: 'failed',
      payment_method: 'Visa •••• 4242'
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Payment History
          </h3>
          <p className="text-red-600">
            Unable to load your payment information. Please try again later.
          </p>
        </div>
      </div>
    );
  }

    const getStatusIcon = (status: string): React.ReactNode => {
        switch (status) {
            case 'paid':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return null;
        }
    };

    function getStatusBadge(status: string): React.ReactNode {
        switch (status) {
            case 'paid':
                return (
                    <Badge className="bg-green-100 text-green-800 border-green-200" variant="outline">
                        Paid
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200" variant="outline">
                        Pending
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge className="bg-red-100 text-red-800 border-red-200" variant="outline">
                        Failed
                    </Badge>
                );
            default:
                return null;
        }
    }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
          <p className="text-gray-600 mt-1">
            View your past payments and download invoices
          </p>
        </div>
      </div>

      {/* Current Subscription Status */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Current Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {/* <div>
                <p className="text-lg font-semibold">
                  {profile?.subscription_type === 'paid' ? 'Pro Plan' : 'Free Plan'}
                </p>
                <p className="text-gray-600">
                  Status: 
                  <Badge 
                    variant="outline" 
                    className={
                      profile?.payment_status === 'active' 
                        ? 'ml-2 bg-green-100 text-green-800 border-green-200'
                        : 'ml-2 bg-gray-100 text-gray-800 border-gray-200'
                    }
                  >
                    {profile?.payment_status || 'Active'}
                  </Badge>
                </p>
              </div> */}
              {/* {profile?.subscription_end_date && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Next billing</p>
                  <p className="font-medium">
                    {formatDate(profile.subscription_end_date)}
                  </p>
                </div>
              )} */}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment History */}
      <motion.div variants={cardVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {paymentHistory.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No payment history
                </h3>
                <p className="text-gray-600">
                  Your payment transactions will appear here once you make a purchase.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {payment.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{formatDate(payment.date)}</span>
                          {payment.payment_method && (
                            <span>• {payment.payment_method}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatAmount(payment.amount)}
                        </p>
                        {getStatusBadge(payment.status)}
                      </div>
                      
                      {payment.invoice_url && payment.status === 'paid' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => window.open(payment.invoice_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                          Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Subscription;