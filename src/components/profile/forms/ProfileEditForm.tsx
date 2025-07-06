// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { UserCog, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Textarea } from '@/components/ui/textarea';
// import { 
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select";
// import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/integrations/supabase/client';
// import { toast } from 'sonner';

// interface ProfileEditFormProps {
//   className?: string;
// }

// interface ProfileFormData {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   bio: string;
//   location: string;
//   jobTitle: string;
//   company: string;
//   notificationPreference: 'all' | 'important' | 'none';
// }

// const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ className = '' }) => {
//   const { user } = useAuth();
//   const userMetadata = user?.user_metadata || {};
  
//   // Form state
//   const [formData, setFormData] = useState<ProfileFormData>({
//     firstName: '',
//     lastName: '',
//     phone: '',
//     bio: '',
//     location: '',
//     jobTitle: '',
//     company: '',
//     notificationPreference: 'all'
//   });
  
//   const [isLoading, setIsLoading] = useState(false);
//   const [formSuccess, setFormSuccess] = useState(false);
//   const [formError, setFormError] = useState('');
//   const [profileLoading, setProfileLoading] = useState(true);

//   // Load user profile data
//   useEffect(() => {
//     const loadProfileData = async () => {
//       if (!user) return;
      
//       setProfileLoading(true);
//       try {
//         // Get user metadata from auth
//         setFormData({
//           firstName: userMetadata.first_name || '',
//           lastName: userMetadata.last_name || '',
//           phone: userMetadata.phone || '',
//           bio: '',
//           location: '',
//           jobTitle: '',
//           company: '',
//           notificationPreference: 'all'
//         });
        
//         // Get extended profile from user_profiles table
//         // Define the expected shape of the user_profiles row
//         type UserProfileRow = {
//           id: string;
//           user_id: string;
//           subscription_type: "free" | "paid";
//           subscription_start_date: string | null;
//           subscription_end_date: string | null;
//           payment_status: "active" | "cancelled" | "expired" | "pending";
//           created_at: string;
//           updated_at: string;
//           bio?: string;
//           location?: string;
//           job_title?: string;
//           company?: string;
//           notification_preference?: 'all' | 'important' | 'none';
//         };

//         const { data: profileData, error } = await supabase
//           .from('user_profiles')
//           .select('*')
//           .eq('user_id', user.id)
//           .single<UserProfileRow>();
          
//         if (error && error.code !== 'PGRST116') {
//           console.error('Error fetching profile:', error);
//         }
        
//         if (profileData) {
//           // Update form with additional profile data
//           setFormData(prev => ({
//             ...prev,
//             bio: profileData.bio || '',
//             location: profileData.location || '',
//             jobTitle: profileData.job_title || '',
//             company: profileData.company || '',
//             notificationPreference: profileData.notification_preference || 'all'
//           }));
//         }
//       } catch (err) {
//         console.error('Error loading profile data:', err);
//       } finally {
//         setProfileLoading(false);
//       }
//     };
    
//     loadProfileData();
//   }, [user, userMetadata]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setFormError('');
//     setFormSuccess(false);
//   };
  
//   const handleSelectChange = (value: string, name: string) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setFormError('');
//     setFormSuccess(false);
//   };

//   const validateForm = (): string | null => {
//     // Validate required fields
//     if (!formData.firstName.trim()) {
//       return 'First name is required';
//     }
//     if (!formData.lastName.trim()) {
//       return 'Last name is required';
//     }
    
//     // Phone validation (optional)
//     if (formData.phone && !/^\+?[0-9\s-()]{8,20}$/.test(formData.phone)) {
//       return 'Please enter a valid phone number';
//     }
    
//     return null;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const validationError = validateForm();
//     if (validationError) {
//       setFormError(validationError);
//       return;
//     }
    
//     setIsLoading(true);
//     setFormError('');
    
//     try {
//       // Update auth user metadata
//       const { error: authError } = await supabase.auth.updateUser({
//         data: {
//           first_name: formData.firstName,
//           last_name: formData.lastName,
//           phone: formData.phone
//         }
//       });

//       if (authError) throw authError;

//       // Ensure user_id is defined and a string
//       if (!user?.id) {
//         throw new Error('User ID is missing. Please re-login and try again.');
//       }

//       // Upsert extended profile data
//       const { error: profileError } = await supabase
//         .from('user_profiles')
//         .upsert({
//           user_id: user.id,
//           bio: formData.bio,
//           location: formData.location,
//           job_title: formData.jobTitle,
//           company: formData.company,
//           notification_preference: formData.notificationPreference,
//           updated_at: new Date().toISOString()
//         });

//       if (profileError) throw profileError;

//       setFormSuccess(true);
//       toast.success('Profile updated successfully');

//       // Reset success message after 3 seconds
//       setTimeout(() => setFormSuccess(false), 3000);

//     } catch (err: any) {
//       const errorMessage = err.message || 'Failed to update profile. Please try again.';
//       setFormError(errorMessage);
//       toast.error(errorMessage);
//       console.error('Profile update error:', err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (profileLoading) {
//     return (
//       <Card className={`border-terracotta/20 ${className}`}>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-terracotta">
//             <UserCog className="h-5 w-5" />
//             Edit Profile
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-center py-8">
//             <Loader2 className="h-8 w-8 text-terracotta animate-spin" />
//             <span className="ml-2 text-gray-600">Loading profile data...</span>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className={`border-terracotta/20 ${className}`}>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2 text-terracotta">
//           <UserCog className="h-5 w-5" />
//           Edit Profile
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {formSuccess && (
//             <Alert className="border-green-200 bg-green-50">
//               <CheckCircle className="h-4 w-4 text-green-600" />
//               <AlertDescription className="text-green-800">
//                 Profile updated successfully!
//               </AlertDescription>
//             </Alert>
//           )}

//           {formError && (
//             <Alert variant="destructive">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertDescription>{formError}</AlertDescription>
//             </Alert>
//           )}

//           <div className="space-y-4">
//             <h3 className="text-lg font-medium text-navy">Personal Information</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* First Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">First Name</Label>
//                 <Input
//                   id="firstName"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleInputChange}
//                   placeholder="Enter first name"
//                   disabled={isLoading}
//                   required
//                 />
//               </div>

//               {/* Last Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Last Name</Label>
//                 <Input
//                   id="lastName"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleInputChange}
//                   placeholder="Enter last name"
//                   disabled={isLoading}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Phone */}
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone Number</Label>
//               <Input
//                 id="phone"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleInputChange}
//                 placeholder="Enter phone number (optional)"
//                 disabled={isLoading}
//               />
//               <p className="text-sm text-gray-600">
//                 Format: +1234567890 or similar international format
//               </p>
//             </div>

//             {/* Bio */}
//             <div className="space-y-2">
//               <Label htmlFor="bio">Bio</Label>
//               <Textarea
//                 id="bio"
//                 name="bio"
//                 value={formData.bio}
//                 onChange={handleInputChange}
//                 placeholder="Tell us about yourself (optional)"
//                 disabled={isLoading}
//                 className="min-h-[100px]"
//               />
//             </div>

//             <h3 className="text-lg font-medium text-navy pt-2">Professional Information</h3>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Location */}
//               <div className="space-y-2">
//                 <Label htmlFor="location">Location</Label>
//                 <Input
//                   id="location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   placeholder="City, Country (optional)"
//                   disabled={isLoading}
//                 />
//               </div>

//               {/* Job Title */}
//               <div className="space-y-2">
//                 <Label htmlFor="jobTitle">Job Title</Label>
//                 <Input
//                   id="jobTitle"
//                   name="jobTitle"
//                   value={formData.jobTitle}
//                   onChange={handleInputChange}
//                   placeholder="Your job title (optional)"
//                   disabled={isLoading}
//                 />
//               </div>
//             </div>

//             {/* Company */}
//             <div className="space-y-2">
//               <Label htmlFor="company">Company</Label>
//               <Input
//                 id="company"
//                 name="company"
//                 value={formData.company}
//                 onChange={handleInputChange}
//                 placeholder="Your company (optional)"
//                 disabled={isLoading}
//               />
//             </div>

//             <h3 className="text-lg font-medium text-navy pt-2">Preferences</h3>

//             {/* Notification Preference */}
//             <div className="space-y-2">
//               <Label htmlFor="notificationPreference">Email Notifications</Label>
//               <Select
//                 value={formData.notificationPreference}
//                 onValueChange={(value) => handleSelectChange(value, 'notificationPreference')}
//                 disabled={isLoading}
//               >
//                 <SelectTrigger id="notificationPreference" className="w-full">
//                   <SelectValue placeholder="Select notification preference" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Notifications</SelectItem>
//                   <SelectItem value="important">Important Only</SelectItem>
//                   <SelectItem value="none">No Notifications</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="flex justify-start pt-2">
//             <Button 
//               type="submit" 
//               disabled={isLoading}
//               className="w-fit bg-terracotta hover:bg-terracotta/90"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 'Save Changes'
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProfileEditForm;



import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCog, CheckCircle, AlertTriangle, Loader2, 
  Save, User, Mail, Phone, MapPin, Briefcase, 
  Building, Bell, FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileEditFormProps {
  className?: string;
  id?: string;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  location: string;
  jobTitle: string;
  company: string;
  notificationPreference: 'all' | 'important' | 'none';
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ 
  className = '',
  id = 'profile-edit-section'
}) => {
  const { user } = useAuth();
  const userMetadata = user?.user_metadata || {};
  
  // Form state
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    location: '',
    jobTitle: '',
    company: '',
    notificationPreference: 'all'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.5
      } 
    }
  };

  // Load user profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;
      
      setProfileLoading(true);
      try {
        // Get user metadata from auth
        setFormData({
          firstName: userMetadata.first_name || '',
          lastName: userMetadata.last_name || '',
          phone: userMetadata.phone || '',
          bio: userMetadata.bio || '',
          location: userMetadata.location || '',
          jobTitle: userMetadata.job_title || '',
          company: userMetadata.company || '',
          notificationPreference: userMetadata.notification_preference || 'all'
        });
        
        // Get extended profile from user_profiles table
        // Define the expected shape of the user_profiles row
        type UserProfileRow = {
          id: string;
          user_id: string;
          subscription_type: "free" | "paid";
          subscription_start_date: string | null;
          subscription_end_date: string | null;
          payment_status: "active" | "cancelled" | "expired" | "pending";
          created_at: string;
          updated_at: string;
          bio?: string;
          location?: string;
          job_title?: string;
          company?: string;
          notification_preference?: 'all' | 'important' | 'none';
        };

        const { data: profileData, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single<UserProfileRow>();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
        }
        
        if (profileData) {
          // Update form with additional profile data
          setFormData(prev => ({
            ...prev,
            bio: profileData.bio || prev.bio,
            location: profileData.location || prev.location,
            jobTitle: profileData.job_title || prev.jobTitle,
            company: profileData.company || prev.company,
            notificationPreference: profileData.notification_preference || prev.notificationPreference
          }));
        }
      } catch (err) {
        console.error('Error loading profile data:', err);
      } finally {
        setProfileLoading(false);
      }
    };
    
    loadProfileData();
  }, [user, userMetadata]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
    setFormSuccess(false);
  };
  
  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
    setFormSuccess(false);
  };

  const validateForm = (): string | null => {
    // Validate required fields
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }
    if (!formData.lastName.trim()) {
      return 'Last name is required';
    }
    
    // Phone validation (optional)
    if (formData.phone && !/^\+?[0-9\s-()]{8,20}$/.test(formData.phone)) {
      return 'Please enter a valid phone number';
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    
    setIsLoading(true);
    setFormError('');
    
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          job_title: formData.jobTitle,
          company: formData.company,
          notification_preference: formData.notificationPreference
        }
      });

      if (authError) throw authError;

      // Ensure user_id is defined and a string
      if (!user?.id) {
        throw new Error('User ID is missing. Please re-login and try again.');
      }

      // Upsert extended profile data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          bio: formData.bio,
          location: formData.location,
          job_title: formData.jobTitle,
          company: formData.company,
          notification_preference: formData.notificationPreference,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      setFormSuccess(true);
      toast.success('Profile updated successfully');

      // Reset success message after 3 seconds
      setTimeout(() => setFormSuccess(false), 3000);

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update profile. Please try again.';
      setFormError(errorMessage);
      toast.error(errorMessage);
      console.error('Profile update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <Card className={`border-terracotta/20 ${className}`} id={id}>
        <CardHeader className="bg-gradient-to-r from-terracotta to-terracotta/80 text-white">
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 text-terracotta animate-spin" />
            <span className="ml-2 text-gray-600">Loading profile data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      id={id}
    >
      <Card className={`border-terracotta/20 shadow-sm ${className}`}>
        <CardHeader className="bg-gradient-to-r from-terracotta to-terracotta/80 text-white">
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Edit Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            {formSuccess && (
              <motion.div variants={itemVariants} className="mb-6">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Profile updated successfully!
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {formError && (
              <motion.div variants={itemVariants} className="mb-6">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Professional</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-6">
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-navy" />
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      disabled={isLoading}
                      required
                      className="border-slate-300 focus:border-navy"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-navy" />
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      disabled={isLoading}
                      required
                      className="border-slate-300 focus:border-navy"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-terracotta" />
                      Email Address
                    </Label>
                    <div className="flex">
                      <Input
                        id="email"
                        value={user?.email || ''}
                        readOnly
                        disabled
                        className="bg-slate-50 border-slate-300"
                      />
                      <span className="ml-2 flex items-center text-xs text-green-600">
                        {userMetadata.email_verified ? (
                          <span className="flex items-center px-2 py-1 bg-green-50 rounded text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center px-2 py-1 bg-amber-50 rounded text-amber-700">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Not verified
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gold" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number (optional)"
                      disabled={isLoading}
                      className="border-slate-300 focus:border-navy"
                    />
                    <p className="text-sm text-gray-600">
                      Format: +1234567890 or similar international format
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-navy" />
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself (optional)"
                      disabled={isLoading}
                      className="min-h-[120px] border-slate-300 focus:border-navy"
                    />
                    <p className="text-sm text-gray-600">
                      Share a brief introduction about yourself
                    </p>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="professional" className="space-y-6">
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country (optional)"
                      disabled={isLoading}
                      className="border-slate-300 focus:border-navy"
                    />
                  </div>

                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-purple-600" />
                      Job Title
                    </Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleInputChange}
                      placeholder="Your job title (optional)"
                      disabled={isLoading}
                      className="border-slate-300 focus:border-navy"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company (optional)"
                      disabled={isLoading}
                      className="border-slate-300 focus:border-navy"
                    />
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-6">
                <motion.div variants={itemVariants}>
                  {/* Notification Preference */}
                  <div className="space-y-2">
                    <Label htmlFor="notificationPreference" className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-amber-600" />
                      Email Notifications
                    </Label>
                    <Select
                      value={formData.notificationPreference}
                      onValueChange={(value) => handleSelectChange(value, 'notificationPreference')}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="notificationPreference" className="w-full border-slate-300 focus:border-navy">
                        <SelectValue placeholder="Select notification preference" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Notifications</SelectItem>
                        <SelectItem value="important">Important Only</SelectItem>
                        <SelectItem value="none">No Notifications</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600">
                      Choose how often you'd like to receive email notifications
                    </p>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="pt-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <h4 className="font-medium text-navy mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Additional Settings
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      For security settings like password changes and account deletion, please visit the Security tab in your profile.
                    </p>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            <motion.div variants={itemVariants} className="flex justify-end mt-8 pt-4 border-t border-slate-200">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-terracotta hover:bg-terracotta/90 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileEditForm;