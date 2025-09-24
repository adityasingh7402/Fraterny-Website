import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProfileEdit } from '@/hooks/useProfileEdit';
import { useProfileData } from '@/hooks/useProfileData';
import { UserPreferences } from '@/types/profile';
import { useToast } from '@/hooks/use-toast';
//import debounce from 'lodash/debounce';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Check } from 'lucide-react';

interface PreferencesFormProps {
  className?: string;
}

/**
 * Form component for managing user preferences with auto-save
 */
export function PreferencesForm({ className }: PreferencesFormProps) {
  const { profileData, isLoading: isLoadingProfile } = useProfileData();
  const { updatePreferences, isLoading: isUpdating } = useProfileEdit();
  const { toast } = useToast();
  
  // Form state
  const [preferences, setPreferences] = useState<UserPreferences>({
    email_notifications: true,
    quest_reminders: true,
    data_sharing_consent: false,
    privacy_level: 'standard',
  });
  
  // Save status
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Initialize preferences from profile data
  useEffect(() => {
    if (profileData) {
      setPreferences({
        email_notifications: profileData.email_notifications ?? true,
        quest_reminders: profileData.quest_reminders ?? true,
        data_sharing_consent: profileData.data_sharing_consent ?? false,
        privacy_level: profileData.privacy_level ?? 'standard',
      });
    }
  }, [profileData]);
  
  // Handle form changes with debounced auto-save
  const handleChange = (field: keyof UserPreferences, value: any) => {
    const updatedPreferences = { ...preferences, [field]: value };
    setPreferences(updatedPreferences);
    debouncedSave(updatedPreferences);
  };
  
  // Debounced save function
  const debouncedSave = debounce(async (data: UserPreferences) => {
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      
      const success = await updatePreferences(data);
      
      if (success) {
        setSaveSuccess(true);
        // Reset success indicator after 2 seconds
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save your preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, 500);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };
  
  // Handle manual save
  const handleSave = async () => {
    debouncedSave.cancel(); // Cancel any pending debounced saves
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      const success = await updatePreferences(preferences);
      
      if (success) {
        setSaveSuccess(true);
        toast({
          title: 'Preferences Saved',
          description: 'Your preferences have been updated successfully.',
        });
        
        // Reset success indicator after 2 seconds
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save your preferences. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Loading skeleton
  if (isLoadingProfile) {
    return <PreferencesFormSkeleton className={className} />;
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Notification & Privacy Preferences</CardTitle>
        <CardDescription>
          Manage how we communicate with you and use your data
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Notification Section */}
          <motion.div className="space-y-4">
            <h3 className="text-sm font-medium">Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email_notifications">Email Notifications</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive important updates and quest reminders
                </p>
              </div>
              <Switch
                id="email_notifications"
                checked={preferences.email_notifications}
                onCheckedChange={(checked) => handleChange('email_notifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="quest_reminders">Quest Reminders</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get reminders for incomplete quests
                </p>
              </div>
              <Switch
                id="quest_reminders"
                checked={preferences.quest_reminders}
                onCheckedChange={(checked) => handleChange('quest_reminders', checked)}
              />
            </div>
          </motion.div>
          
          {/* Privacy Section */}
          <motion.div className="space-y-4 pt-2">
            <h3 className="text-sm font-medium">Privacy & Data</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data_sharing_consent">Data Sharing</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Allow anonymous data to improve quest experience
                </p>
              </div>
              <Switch
                id="data_sharing_consent"
                checked={preferences.data_sharing_consent}
                onCheckedChange={(checked) => handleChange('data_sharing_consent', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="privacy_level">Privacy Level</Label>
              <RadioGroup
                id="privacy_level"
                value={preferences.privacy_level}
                onValueChange={(value) => 
                  handleChange('privacy_level', value as 'minimal' | 'standard' | 'full')
                }
                className="space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minimal" id="minimal" />
                  <Label htmlFor="minimal" className="font-normal cursor-pointer">
                    Minimal - Essential data only
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="font-normal cursor-pointer">
                    Standard - Enable personalized experience
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full" id="full" />
                  <Label htmlFor="full" className="font-normal cursor-pointer">
                    Full - Allow detailed analytics and insights
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500">
          {isSaving ? 'Saving changes...' : saveSuccess ? 'Changes saved!' : 'Changes save automatically'}
        </p>
        
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : saveSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Skeleton loader for the preferences form
 */
function PreferencesFormSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-60 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="space-y-3">
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-5 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
}