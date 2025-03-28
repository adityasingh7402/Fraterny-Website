
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Mail } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if email already exists
      const { data: existingSubscribers, error: checkError } = await supabase
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .limit(1);
      
      if (checkError) throw checkError;
      
      if (existingSubscribers && existingSubscribers.length > 0) {
        toast({
          title: "Already subscribed",
          description: "This email is already subscribed to our newsletter."
        });
        setEmail('');
        return;
      }
      
      // Insert new subscriber
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert([
          { email: email.toLowerCase().trim() }
        ]);
      
      if (insertError) throw insertError;
      
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter."
      });
      
      setEmail('');
    } catch (err: any) {
      toast({
        title: "Subscription failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      console.error('Error submitting newsletter subscription:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-navy text-white py-12 px-6 rounded-lg">
      <div className="max-w-xl mx-auto text-center">
        <Mail className="mx-auto h-12 w-12 text-terracotta mb-4" />
        <h3 className="text-2xl font-playfair mb-3">Subscribe to Our Newsletter</h3>
        <p className="mb-6">Stay updated with our latest articles, exclusive offers, and curated content.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            required
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-terracotta hover:bg-terracotta/90 text-white"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
        <p className="text-xs mt-4 text-white/70">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup;
