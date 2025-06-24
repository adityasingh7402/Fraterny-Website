
// import { useState } from 'react';
// import { useToast } from '@/hooks/use-toast';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { supabase } from '@/integrations/supabase/client';
// import { Mail } from 'lucide-react';

// const NewsletterSignup = () => {
//   const [email, setEmail] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email.trim()) {
//       toast({
//         title: "Email required",
//         description: "Please enter your email address.",
//         variant: "destructive"
//       });
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       // Check if email already exists
//       const { data: existingSubscribers, error: checkError } = await supabase
//         .from('newsletter_subscribers')
//         .select('id')
//         .eq('email', email.toLowerCase().trim())
//         .limit(1);
      
//       if (checkError) throw checkError;
      
//       if (existingSubscribers && existingSubscribers.length > 0) {
//         toast({
//           title: "Already subscribed",
//           description: "This email is already subscribed to our newsletter."
//         });
//         setEmail('');
//         return;
//       }
      
//       // Insert new subscriber
//       const { error: insertError } = await supabase
//         .from('newsletter_subscribers')
//         .insert([
//           { email: email.toLowerCase().trim() }
//         ]);
      
//       if (insertError) throw insertError;
      
//       toast({
//         title: "Subscription successful!",
//         description: "Thank you for subscribing to our newsletter."
//       });
      
//       setEmail('');
//     } catch (err: any) {
//       toast({
//         title: "Subscription failed",
//         description: err.message || "Something went wrong. Please try again.",
//         variant: "destructive"
//       });
//       console.error('Error submitting newsletter subscription:', err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="bg-navy text-white py-12 px-6 rounded-lg">
//       <div className="max-w-xl mx-auto text-center">
//         <Mail className="mx-auto h-12 w-12 text-terracotta mb-4" />
//         <h3 className="text-2xl font-playfair mb-3">Subscribe to Our Newsletter</h3>
//         <p className="mb-6">Stay updated with our latest articles, exclusive offers, and curated content.</p>
        
//         <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
//           <Input
//             type="email"
//             placeholder="Your email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
//             required
//           />
//           <Button 
//             type="submit" 
//             disabled={isSubmitting}
//             className="bg-terracotta hover:bg-terracotta/90 text-white"
//           >
//             {isSubmitting ? 'Subscribing...' : 'Subscribe'}
//           </Button>
//         </form>
//         <p className="text-xs mt-4 text-white/70">
//           We respect your privacy. Unsubscribe at any time.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default NewsletterSignup;


import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Check } from 'lucide-react';
import { useSectionRevealAnimation } from '../home/useSectionRevealAnimation';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Newsletter container animation
  const containerAnimation = useSectionRevealAnimation({
    variant: 'scale-in',
    once: false,
    threshold: { desktop: 0.3, mobile: 0.2 },
    duration: 0.7,
    staggerChildren: 0.2
  });

  // Icon animation variants
  const iconVariants = {
    hidden: { 
      scale: 0,
      rotate: -180,
      opacity: 0
    },
    visible: { 
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.2
      }
    },
    success: {
      scale: [1, 1.2, 1],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  // Form animation variants
  const formVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    submitting: {
      scale: 0.98,
      transition: {
        duration: 0.2
      }
    }
  };

  // Input animation variants
  const inputVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    },
    focus: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  // Button animation variants
  const buttonVariants = {
    hidden: {
      opacity: 0,
      x: 20
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    tap: {
      scale: 0.98
    },
    submitting: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  // Success state variants
  const successVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        staggerChildren: 0.1
      }
    }
  };

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
      
      setIsSuccess(true);
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter."
      });
      
      setEmail('');
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      
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
    <motion.div 
      className="bg-navy text-white py-12 px-6 rounded-lg"
      ref={containerAnimation.ref}
      variants={containerAnimation.parentVariants}
      initial="hidden"
      animate={containerAnimation.controls}
    >
      <div className="max-w-xl mx-auto text-center">
        
        {/* Icon with animation */}
        <motion.div
          variants={containerAnimation.childVariants}
          className="flex justify-center mb-4"
        >
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate={containerAnimation.isInView ? (isSuccess ? "success" : "visible") : "hidden"}
          >
            {isSuccess ? (
              <Check className="h-12 w-12 text-green-400" />
            ) : (
              <Mail className="h-12 w-12 text-terracotta" />
            )}
          </motion.div>
        </motion.div>

        {/* Title and description */}
        <motion.h3 
          className="text-2xl font-playfair mb-3"
          variants={containerAnimation.childVariants}
        >
          {isSuccess ? "Successfully Subscribed!" : "Subscribe to Our Newsletter"}
        </motion.h3>
        
        <motion.p 
          className="mb-6"
          variants={containerAnimation.childVariants}
        >
          {isSuccess 
            ? "Thank you! You'll receive our latest updates and exclusive content."
            : "Stay updated with our latest articles, exclusive offers, and curated content."
          }
        </motion.p>
        
        {/* Form or Success State */}
        {isSuccess ? (
          <motion.div
            variants={successVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="text-green-400 text-lg font-medium"
              variants={successVariants}
            >
              ✨ Welcome to our community!
            </motion.div>
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleSubmit} 
            className="flex flex-col sm:flex-row gap-3"
            variants={formVariants}
            initial="hidden"
            animate={containerAnimation.isInView ? "visible" : "hidden"}
            whileTap="submitting"
          >
            {/* Email Input */}
            <motion.div
              className="flex-1"
              variants={inputVariants}
              whileFocus="focus"
            >
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/15 transition-all duration-300"
                required
                disabled={isSubmitting}
              />
            </motion.div>
            
            {/* Submit Button */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              animate={isSubmitting ? "submitting" : "visible"}
            >
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-terracotta hover:bg-terracotta/90 text-white min-w-[120px] transition-all duration-300"
              >
                {isSubmitting ? (
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Subscribing...
                  </motion.div>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </motion.div>
          </motion.form>
        )}
        
        {/* Privacy notice */}
        <motion.p 
          className="text-xs mt-4 text-white/70"
          variants={containerAnimation.childVariants}
        >
          We respect your privacy. Unsubscribe at any time.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default NewsletterSignup;