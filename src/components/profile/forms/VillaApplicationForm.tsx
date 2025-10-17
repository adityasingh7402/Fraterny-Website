// src/components/profile/VillaApplicationForm.tsx

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Home,
  ClipboardList,
  Check,
  Copy,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FileText,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

// Types
interface DashboardTest {
  userid: string;
  testid: string;
  sessionid: string;
  testtaken: string;
  ispaymentdone: "success" | null;
  quest_pdf: string;
  quest_status: "generated" | "working";
}

interface DashboardApiResponse {
  status: number;
  data: DashboardTest[];
}

// Zod Schema
const villaApplicationSchema = z.object({
  // Personal Details
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().min(2, 'Location is required'),
  dob: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  
  // Emergency Contact
  emergencyName: z.string().min(2, 'Emergency contact name is required'),
  emergencyPhone: z.string().min(10, 'Emergency contact phone is required'),
  
  // Quest Data
  selectedTestId: z.string().min(1, 'Please select a Quest assessment'),
  
  // Villa Booking Details
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  numberOfGuests: z.number().min(1, 'At least 1 guest is required').max(20, 'Maximum 20 guests'),
  numberOfRooms: z.number().min(1, 'At least 1 room is required').max(10, 'Maximum 10 rooms'),
  
  // Additional Info
  purposeOfVisit: z.string().min(1, 'Purpose of visit is required'),
  specialRequests: z.string().optional(),
  dietaryRequirements: z.string().optional(),
  referralSource: z.string().optional(),
}).refine((data) => {
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  return checkOut > checkIn;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

type VillaApplicationFormData = z.infer<typeof villaApplicationSchema>;

interface VillaApplicationFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function VillaApplicationForm({ className = '', onSuccess }: VillaApplicationFormProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [questData, setQuestData] = useState<DashboardTest[]>([]);
  const [loadingQuestData, setLoadingQuestData] = useState(true);
  const [selectedTest, setSelectedTest] = useState<DashboardTest | null>(null);
  const [copiedTestId, setCopiedTestId] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;

  // Initialize form with react-hook-form
  const form = useForm<VillaApplicationFormData>({
    resolver: zodResolver(villaApplicationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      dob: '',
      jobTitle: '',
      company: '',
      emergencyName: '',
      emergencyPhone: '',
      selectedTestId: '',
      checkInDate: '',
      checkOutDate: '',
      numberOfGuests: 1,
      numberOfRooms: 1,
      purposeOfVisit: '',
      specialRequests: '',
      dietaryRequirements: '',
      referralSource: '',
    },
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Fetch user Quest data
  useEffect(() => {
    const fetchQuestData = async () => {
      if (!user?.id) {
        setLoadingQuestData(false);
        return;
      }

      try {
        const response = await axios.get<DashboardApiResponse>(
          `${import.meta.env.VITE_BACKEND_URL}/api/userdashboard/${user.id}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        console.log('Quest data fetched successfully:', response.data.data);

        if (response.data.status === 200) {
          // Filter only completed and paid assessments
          const completedTests = response.data.data
          
          // Sort by date (latest first)
          const sortedTests = completedTests.sort((a, b) => {
            return new Date(b.testtaken).getTime() - new Date(a.testtaken).getTime();
          });
          
          setQuestData(sortedTests);
          console.log('Filtered and sorted Quest data:', sortedTests);
          
        }
      } catch (error) {
        console.error('Failed to fetch Quest data:', error);
        toast.error('Failed to load your Quest assessments');
      } finally {
        setLoadingQuestData(false);
      }
    };

    fetchQuestData();
  }, [user?.id]);

  // Auto-populate user data
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      form.reset({
        ...form.getValues(),
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        email: user.email || '',
        phone: metadata.phone || '',
        location: metadata.location || '',
        dob: metadata.dob || '',
        jobTitle: metadata.job_title || '',
        company: metadata.company || '',
      });
    }
  }, [user, form]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Handle test selection
  const handleTestSelect = (test: DashboardTest) => {
    setSelectedTest(test);
    form.setValue('selectedTestId', test.testid);
  };

  // Copy Test ID
  const handleCopyTestId = (testId: string) => {
    navigator.clipboard.writeText(testId);
    setCopiedTestId(true);
    toast.success('Test ID copied to clipboard');
    setTimeout(() => setCopiedTestId(false), 2000);
  };

  // Navigation
  const nextStep = async () => {
    let fieldsToValidate: (keyof VillaApplicationFormData)[] = [];

    switch (currentStep) {
      case 1:
        fieldsToValidate = ['firstName', 'lastName', 'email', 'phone', 'location', 'emergencyName', 'emergencyPhone'];
        break;
      case 2:
        fieldsToValidate = ['selectedTestId'];
        break;
      case 3:
        fieldsToValidate = ['checkInDate', 'checkOutDate', 'numberOfGuests', 'numberOfRooms', 'purposeOfVisit'];
        break;
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Form submission
  const onSubmit = async (data: VillaApplicationFormData) => {
    setIsSubmitting(true);

    try {
      // Prepare submission data
      const submissionData = {
        ...data,
        userId: user?.id,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };

      console.log('Villa Application Data:', submissionData);

      // TODO: Replace with actual API endpoint
      // await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/villa-application`, submissionData);

      toast.success('Application submitted successfully!');
      
      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      form.reset();
      setCurrentStep(1);
      setSelectedTest(null);
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step content renderer
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalDetailsStep();
      case 2:
        return renderQuestSelectionStep();
      case 3:
        return renderVillaDetailsStep();
      case 4:
        return renderReviewStep();
      default:
        return null;
    }
  };

  // Step 1: Personal Details
  const renderPersonalDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>First Name *</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input {...field} className="pl-10" placeholder="John" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Last Name *</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input {...field} className="pl-10" placeholder="Doe" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-["Gilroy-Bold"] text-lg'>Email Address *</FormLabel>
            <FormControl>
              <div className="relative font-['Gilroy-regular']">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input {...field} type="email" className="pl-10" placeholder="john@example.com" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Phone Number *</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input {...field} className="pl-10" placeholder="+1 234 567 8900" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Location/City *</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input {...field} className="pl-10" placeholder="New York" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Date of Birth</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input {...field} type="date" className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Job Title</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input {...field} className="pl-10" placeholder="Software Engineer" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Company</FormLabel>
              <FormControl>
                <Input {...field} className='font-["Gilroy-regular"]' placeholder="Company Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emergencyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-["Gilroy-Bold"] text-lg'>Emergency Contact Name *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input {...field} className="pl-10" placeholder="Jane Doe" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergencyPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-["Gilroy-Bold"] text-lg'>Emergency Contact Phone *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input {...field} className="pl-10" placeholder="+1 234 567 8900" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </motion.div>
  );

  // Step 2: Quest Selection
  const renderQuestSelectionStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-['Gilroy-Bold'] mb-2">Select Your Quest Assessment *</h3>
        <p className="text-sm text-gray-600 mb-4 font-['Gilroy-semiBold']">
          Choose from your completed Quest assessments to include with your villa application.
        </p>
      </div>

      {loadingQuestData ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        </div>
      ) : questData.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">No completed Quest assessments found</p>
          <p className="text-sm text-gray-500">
            You need a completed Quest assessment to apply for the villa.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questData.map((test) => (
            <motion.div
              key={test.testid}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleTestSelect(test)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all shadow-sky-400 ${
                selectedTest?.testid === test.testid
                  ? 'border-sky-200 bg-cyan-50 bg-gradient-to-br from-cyan-600 to-blue-900 shadow-md hover:shadow-lg text-white'
                  : 'border-gray-200 hover:border-sky-700 bg-gradient-to-br from-cyan-500 to-blue-500 shadow-md hover:shadow-lg text-white'
              }`}
              
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {selectedTest?.testid === test.testid ? (
                      <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                    <div>
                      <p className="font-semibold text-white">
                        Assessment - {formatDate(test.testtaken)}
                      </p>
                      <p className="text-sm text-white/60">
                        Test ID: {test.testid.substring(0, 16)}...
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-center space-x-2 ml-8">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Completed
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Report Ready
                    </span>
                  </div> */}
                </div>
                {/* <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyTestId(test.testid);
                  }}
                  className="ml-4"
                >
                  {copiedTestId ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy ID
                    </>
                  )}
                </Button> */}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {form.formState.errors.selectedTestId && (
        <p className="text-sm text-red-600">{form.formState.errors.selectedTestId.message}</p>
      )}
    </motion.div>
  );

  // Step 3: Villa Booking Details
  const renderVillaDetailsStep = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="checkInDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Check-in Date *</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    type="date"
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkOutDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Check-out Date *</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    type="date"
                    className="pl-10"
                    min={form.watch('checkInDate') || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="numberOfGuests"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Number of Guests *</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    max="20"
                    className="pl-10"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </div>
              </FormControl>
              <FormDescription>Maximum 20 guests</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfRooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-["Gilroy-Bold"] text-lg'>Number of Rooms *</FormLabel>
              <FormControl>
                <div className="relative font-['Gilroy-regular']">
                  <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...field}
                    type="number"
                    min="1"
                    max="10"
                    className="pl-10"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </div>
              </FormControl>
              <FormDescription>Maximum 10 rooms</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="purposeOfVisit"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-["Gilroy-Bold"] text-lg'>Purpose of Visit *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className='font-["Gilroy-regular"]'>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="retreat">Personal Retreat</SelectItem>
                <SelectItem value="corporate">Corporate Event</SelectItem>
                <SelectItem value="celebration">Celebration</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialRequests"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-["Gilroy-Bold"] text-lg'>Special Requests</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Any special accommodations or requests..."
                rows={3}
                className='font-["Gilroy-regular"]'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dietaryRequirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-["Gilroy-Bold"] text-lg'>Dietary Requirements</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Any dietary restrictions or preferences..."
                rows={3}
                className='font-["Gilroy-regular"]'
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="referralSource"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='font-["Gilroy-Bold"] text-lg'>How did you hear about us?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className='font-["Gilroy-regular"]'>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
                <SelectItem value="friend">Friend/Family</SelectItem>
                <SelectItem value="quest">Quest Assessment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </motion.div>
  );

  // Step 4: Review
  const renderReviewStep = () => {
    const values = form.getValues();
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-['Gilroy-Bold'] text-blue-900 mb-1">Review Your Application</h4>
              <p className="text-sm font-['Gilroy-SemiBold'] text-blue-700">
                Please review all details carefully before submitting your villa application.
              </p>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-['Gilroy-Bold'] text-lg mb-3 flex items-center">
            <User className="h-5 w-5 mr-2 text-cyan-600" />
            Personal Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600 font-['Gilroy-Regular']">Name:</span>
              <p className="font-['Gilroy-semiBold']">{values.firstName} {values.lastName}</p>
            </div>
            <div>
              <span className="text-gray-600 font-['Gilroy-Regular']">Email:</span>
              <p className="font-['Gilroy-semiBold']">{values.email}</p>
            </div>
            <div>
              <span className="text-gray-600 font-['Gilroy-Regular']">Phone:</span>
              <p className="font-['Gilroy-semiBold']">{values.phone}</p>
            </div>
            <div>
              <span className="text-gray-600 font-['Gilroy-Regular']">Location:</span>
              <p className="font-['Gilroy-semiBold']">{values.location}</p>
            </div>
            {values.jobTitle && (
              <div>
                <span className="text-gray-600 font-['Gilroy-Regular']">Job Title:</span>
                <p className="font-['Gilroy-semiBold']">{values.jobTitle}</p>
              </div>
            )}
            {values.company && (
              <div>
                <span className="text-gray-600 font-['Gilroy-Regular']">Company:</span>
                <p className="font-['Gilroy-semiBold']">{values.company}</p>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t">
            <span className="text-gray-600 text-sm">Emergency Contact:</span>
            <p className="font-medium">{values.emergencyName} - {values.emergencyPhone}</p>
          </div>
        </div>

        {/* Quest Assessment */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-['Gilroy-Bold'] text-lg mb-3 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-cyan-600" />
            Quest Assessment
          </h3>
          <div className="text-sm">
            <span className="text-gray-600 font-['Gilroy-regular']">Selected Test ID:</span>
            <p className="font-['Gilroy-semiBold'] mt-1">{values.selectedTestId}</p>
            {selectedTest && (
              <p className="text-gray-500 mt-1 font-['Gilroy-regular']">
                Assessment Date: {formatDate(selectedTest.testtaken)}
              </p>
            )}
          </div>
        </div>

        {/* Villa Booking Details */}
        <div className="bg-white rounded-lg border p-4">
          <h3 className="font-['Gilroy-Bold'] text-lg mb-3 flex items-center">
            <Home className="h-5 w-5 mr-2 text-cyan-600" />
            Booking Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600 font-['Gilroy-regular']">Check-in:</span>
              <p className="font-['Gilroy-semiBold']">{new Date(values.checkInDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <span className="text-gray-600 font-['Gilroy-regular']">Check-out:</span>
              <p className="font-['Gilroy-semiBold']">{new Date(values.checkOutDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <span className="text-gray-600 font-['Gilroy-regular']">Number of Guests:</span>
              <p className="font-['Gilroy-semiBold']">{values.numberOfGuests}</p>
            </div>
            <div>
              <span className="text-gray-600 font-['Gilroy-regular']">Number of Rooms:</span>
              <p className="font-['Gilroy-semiBold']">{values.numberOfRooms}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600 font-['Gilroy-regular']">Purpose of Visit:</span>
              <p className="font-['Gilroy-semiBold'] capitalize">{values.purposeOfVisit}</p>
            </div>
          </div>
          {values.specialRequests && (
            <div className="mt-3 pt-3 border-t">
              <span className="text-gray-600 text-sm">Special Requests:</span>
              <p className="text-sm mt-1">{values.specialRequests}</p>
            </div>
          )}
          {values.dietaryRequirements && (
            <div className="mt-3 pt-3 border-t">
              <span className="text-gray-600 text-sm">Dietary Requirements:</span>
              <p className="text-sm mt-1">{values.dietaryRequirements}</p>
            </div>
          )}
          {values.referralSource && (
            <div className="mt-3 pt-3 border-t">
              <span className="text-gray-600 text-sm">Referral Source:</span>
              <p className="text-sm mt-1 capitalize">{values.referralSource.replace('_', ' ')}</p>
            </div>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="bg-gray-50 rounded-lg border p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 h-4 w-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-700 font-['Gilroy-Bold']">
              I confirm that all the information provided is accurate and I agree to the{' '}
              <a href="/terms" className="text-cyan-600 hover:underline" target="_blank">
                terms and conditions
              </a>{' '}
              of Fratvilla.
            </label>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`max-w-7xl w-full mx-auto ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        {/* Header */}
        {/* <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Villa Application Form</h2>
          <p className="text-gray-600">Complete your application to book your stay at Fratvilla</p>
        </div> */}

        {/* Progress Steps */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep > step
                        ? 'bg-sky-600 text-white'
                        : currentStep === step
                        ? 'bg-cyan-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step ? <Check className="h-5 w-5" /> : step}
                  </div>
                  <span className="text-xs font-['Gilroy-regular'] mt-2 text-gray-600 text-center">
                    {step === 1 && 'Personal'}
                    {step === 2 && 'Quest'}
                    {step === 3 && 'Villa'}
                    {step === 4 && 'Review'}
                  </span>
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${
                      currentStep > step ? 'bg-sky-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center font-['Gilroy-semiBold'] tracking-[-1px] text-black hover:bg-gray-100 hover:shadow-lg cursor-pointer ${currentStep === 1 ? 'opacity-10 cursor-not-allowed' : ''}
                  ${currentStep === totalSteps ? '' : ''}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                ):(
                  <div></div>
                )}

                {/* <div className="text-sm text-gray-600 font-['Gilroy-regular']">
                  Step {currentStep} of {totalSteps}
                </div> */}

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center font-['Gilroy-semiBold'] tracking-[-1px] bg-gradient-to-r from-sky-500 to-cyan-500 shadow-md border-amber-500 hover:bg-amber-400 hover:shadow-xl text-white"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center font-['Gilroy-semiBold'] tracking-[-1px] bg-gradient-to-r from-sky-500 to-cyan-500 shadow-md border-amber-500 hover:bg-amber-400 hover:shadow-xl text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Submit 
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}

export default VillaApplicationForm;