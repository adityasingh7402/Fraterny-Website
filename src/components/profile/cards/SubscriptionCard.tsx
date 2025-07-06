import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { CreditCard, Calendar, CheckCircle, AlertCircle, Download, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Import correct motion variants
import { getMotionVariants } from '@/lib/motion/variants';

interface Payment {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  invoiceUrl?: string;
}

interface SubscriptionCardProps {
  plan: string;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  renewalDate?: string;
  paymentMethod?: string;
  recentPayments: Payment[];
  className?: string;
}

const SubscriptionCard = ({
  plan,
  status,
  renewalDate,
  paymentMethod,
  recentPayments,
  className,
}: SubscriptionCardProps) => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = useReducedMotion();
  // Get the appropriate motion variants
  const motionVariants = getMotionVariants(prefersReducedMotion || false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get payment status icon
  const getPaymentStatusIcon = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        variants={motionVariants.profileCard}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={className}
      >
        <Card className="overflow-hidden border-t-4 border-indigo-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <CreditCard size={18} className="mr-2 text-indigo-500" />
                Subscription
              </CardTitle>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Subscription details */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="flex flex-col"
                  variants={motionVariants.formField}
                >
                  <span className="text-sm text-muted-foreground">Plan</span>
                  <span className="font-medium">{plan}</span>
                </motion.div>
                
                {status === 'active' && renewalDate && (
                  <motion.div 
                    className="flex flex-col"
                    variants={motionVariants.formField}
                  >
                    <span className="text-sm text-muted-foreground">Next Renewal</span>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-indigo-500" />
                      <span className="font-medium">{formatDate(renewalDate)}</span>
                    </div>
                  </motion.div>
                )}

                {paymentMethod && (
                  <motion.div 
                    className="flex flex-col col-span-2"
                    variants={motionVariants.formField}
                  >
                    <span className="text-sm text-muted-foreground">Payment Method</span>
                    <span className="font-medium">{paymentMethod}</span>
                  </motion.div>
                )}
              </div>

              {/* Recent payments */}
              <motion.div 
                className="pt-2 border-t"
                variants={motionVariants.formField}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Recent Payments</span>
                </div>
                
                {recentPayments.length > 0 ? (
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {recentPayments.map((payment) => (
                      <motion.div 
                        key={payment.id}
                        className="flex justify-between items-center p-2 rounded-md bg-gray-50 dark:bg-gray-800/30"
                        variants={motionVariants.listItem}
                      >
                        <div className="flex items-center">
                          <Receipt size={16} className="mr-2 text-indigo-500" />
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-sm">{formatCurrency(payment.amount)}</span>
                              <span className="ml-2">{getPaymentStatusIcon(payment.status)}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{formatDate(payment.date)}</span>
                          </div>
                        </div>
                        
                        {payment.invoiceUrl && payment.status === 'paid' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <a href={payment.invoiceUrl} target="_blank" rel="noopener noreferrer">
                                  <Download size={14} />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download Invoice</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    No payment history available
                  </div>
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default SubscriptionCard;