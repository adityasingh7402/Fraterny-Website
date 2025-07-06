import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, 
  Save, 
  X, 
  Camera, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  Phone,
  CheckCircle,
  AlertCircle,
  Upload,
  Trash2,
  Globe,
  Link as LinkIcon
} from 'lucide-react';
import { useSectionRevealAnimation } from '../../home/useSectionRevealAnimation';
import { profileMotionVariants, getMotionVariants } from '../../../lib/motion/variants';

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  phone: string;
  dateOfBirth: string;
  website: string;
  avatar: string | null;
  joinDate: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  profileCompleteness: number;
}

interface PersonalInfoProps {
  className?: string;
}

// Mock user data - replace with actual user context/API
const mockUserProfile: UserProfile = {
  name: 'Indranil Maiti',
  email: 'indranilmaiti1@gmail.com',
  bio: 'PhD student passionate about physics research and web development. Love exploring new technologies and solving complex problems.',
  location: 'Tamluk, West Bengal, India',
  phone: '+91 98765 43210',
  dateOfBirth: '1998-04-18',
  website: 'https://indranil.dev',
  avatar: null,
  joinDate: '2024-01-15',
  isEmailVerified: true,
  isPhoneVerified: false,
  profileCompleteness: 85
};

export default function PersonalInfo({ className = '' }: PersonalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(mockUserProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Animation setup
  const {
    ref: containerRef,
    parentVariants,
    childVariants,
    isMobile,
    isInView
  } = useSectionRevealAnimation({
    variant: 'professional',
    once: true,
    amount: 0.2,
    staggerChildren: 0.08,
    delayChildren: 0.1
  });

  const motionVariants = getMotionVariants(isMobile);

  // Auto-save effect with debounce
  useEffect(() => {
    if (isEditing && JSON.stringify(editedProfile) !== JSON.stringify(profile)) {
      const timeoutId = setTimeout(() => {
        handleAutoSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [editedProfile, isEditing]);

  // Handle form field changes
  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Auto-save functionality
  const handleAutoSave = async () => {
    if (JSON.stringify(editedProfile) === JSON.stringify(profile)) return;

    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProfile(editedProfile);
      setSaveStatus('saved');
      
      // Reset status after showing success
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  // Handle save changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await handleAutoSave();
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel editing
  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
    setSaveStatus('idle');
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create preview URL (in real app, this would be the uploaded image URL)
      const previewUrl = URL.createObjectURL(file);
      setEditedProfile(prev => ({ ...prev, avatar: previewUrl }));
      setProfile(prev => ({ ...prev, avatar: previewUrl }));
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Handle avatar removal
  const handleAvatarRemove = () => {
    setEditedProfile(prev => ({ ...prev, avatar: null }));
    if (!isEditing) {
      setProfile(prev => ({ ...prev, avatar: null }));
    }
  };

  // Get user initials
  const getUserInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate profile completeness
  const calculateCompleteness = (profile: UserProfile) => {
    const fields = ['name', 'email', 'bio', 'location', 'phone', 'website'];
    const completed = fields.filter(field => profile[field as keyof UserProfile]).length;
    return Math.round((completed / fields.length) * 100);
  };

  const currentProfile = isEditing ? editedProfile : profile;
  const completeness = calculateCompleteness(currentProfile);

  return (
    <motion.div
      ref={containerRef}
      variants={parentVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`p-6 lg:p-8 ${className}`}
    >
      {/* Header */}
      <motion.div
        variants={childVariants}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Personal Information
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your profile details and preferences
          </p>
        </div>

        {/* Edit Toggle */}
        <div className="flex items-center space-x-3">
          {/* Save Status Indicator */}
          <AnimatePresence>
            {saveStatus !== 'idle' && (
              <motion.div
                variants={motionVariants.statusIndicator}
                initial="hidden"
                animate={saveStatus === 'saved' ? 'success' : saveStatus === 'error' ? 'error' : 'hidden'}
                exit="hidden"
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                  saveStatus === 'saved' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : saveStatus === 'error'
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                }`}
              >
                {saveStatus === 'saving' && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-3 h-3 border border-current border-t-transparent rounded-full"
                    />
                    <span>Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Saved</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span>Error saving</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit/Save/Cancel buttons */}
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <motion.button
                  variants={motionVariants.tabItem}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleCancel}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
                <motion.button
                  variants={motionVariants.tabItem}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </motion.button>
              </>
            ) : (
              <motion.button
                variants={motionVariants.tabItem}
                whileHover="hover"
                whileTap="tap"
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Picture & Completion */}
        <motion.div
          variants={childVariants}
          className="lg:col-span-1"
        >
          {/* Profile Picture */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Profile Picture</h3>
            
            <div className="flex flex-col items-center">
              <div className="relative group mb-4">
                {currentProfile.avatar ? (
                  <img
                    src={currentProfile.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-700 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white dark:border-slate-700 shadow-lg">
                    {getUserInitials(currentProfile.name)}
                  </div>
                )}
                
                {/* Upload overlay */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUploadingAvatar}
                    />
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Loading indicator */}
                {isUploadingAvatar && (
                  <motion.div
                    variants={motionVariants.loadingPulse}
                    animate="pulse"
                    className="absolute inset-0 bg-blue-500/20 rounded-2xl flex items-center justify-center"
                  >
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  </motion.div>
                )}
              </div>

              {/* Upload actions */}
              {isEditing && (
                <div className="flex space-x-2">
                  <label className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={isUploadingAvatar}
                    />
                  </label>
                  
                  {currentProfile.avatar && (
                    <button
                      onClick={handleAvatarRemove}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Profile Completion */}
          <motion.div
            variants={childVariants}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Profile Completion</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600 dark:text-slate-400">Overall Progress</span>
                  <span className="font-medium text-slate-900 dark:text-white">{completeness}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completeness}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                  />
                </div>
              </div>

              {/* Verification status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Email Verified</span>
                  {currentProfile.isEmailVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Phone Verified</span>
                  {currentProfile.isPhoneVerified ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Profile Information Form */}
        <motion.div
          variants={childVariants}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Basic Information</h3>
            
            <motion.div
              variants={motionVariants.formContainer}
              className="space-y-6"
            >
              {/* Name */}
              <motion.div variants={motionVariants.formField}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-900 dark:text-white">
                    {currentProfile.name}
                  </div>
                )}
              </motion.div>

              {/* Email */}
              <motion.div variants={motionVariants.formField}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <div className="relative">
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-900 dark:text-white">
                      {currentProfile.email}
                    </div>
                  )}
                  {currentProfile.isEmailVerified && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </motion.div>

              {/* Bio */}
              <motion.div variants={motionVariants.formField}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-900 dark:text-white min-h-[100px]">
                    {currentProfile.bio || 'No bio provided'}
                  </div>
                )}
              </motion.div>

              {/* Location */}
              <motion.div variants={motionVariants.formField}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile.location}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your location"
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-900 dark:text-white">
                    {currentProfile.location}
                  </div>
                )}
              </motion.div>

              {/* Phone */}
              <motion.div variants={motionVariants.formField}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <div className="relative">
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-900 dark:text-white">
                      {currentProfile.phone}
                    </div>
                  )}
                  {currentProfile.isPhoneVerified && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                  )}
                </div>
              </motion.div>

              {/* Website */}
              <motion.div variants={motionVariants.formField}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editedProfile.website}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="https://yourwebsite.com"
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-900 dark:text-white">
                    {currentProfile.website ? (
                      <a 
                        href={currentProfile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                      >
                        <LinkIcon className="w-4 h-4 mr-2" />
                        {currentProfile.website}
                      </a>
                    ) : (
                      'No website provided'
                    )}
                  </div>
                )}
              </motion.div>

              {/* Date of Birth */}
              <motion.div variants={motionVariants.formField}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={editedProfile.dateOfBirth}
                    onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                ) : (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-900 dark:text-white">
                    {formatDate(currentProfile.dateOfBirth)}
                  </div>
                )}
              </motion.div>

              {/* Join Date (Read-only) */}
              <motion.div variants={motionVariants.formField}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Member Since
                </label>
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-slate-900 dark:text-white">
                  {formatDate(currentProfile.joinDate)}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}