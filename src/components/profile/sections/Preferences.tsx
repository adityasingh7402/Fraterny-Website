import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Moon, 
  Sun, 
  Monitor,
  Shield, 
  Eye, 
  EyeOff,
  Globe,
  Clock,
  Zap,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Settings,
  Users,
  BarChart3,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useSectionRevealAnimation } from '../../../hooks/useSectionRevealAnimation';
import { profileMotionVariants, getMotionVariants } from '../../../lib/motion/variants';
import { useProfileData, useUpdateProfile } from '../../../hooks/profile/useProfileData';

interface PreferencesProps {
  className?: string;
}

interface NotificationPreferences {
  email: {
    questCompletion: boolean;
    weeklyDigest: boolean;
    newFeatures: boolean;
    marketingEmails: boolean;
    securityAlerts: boolean;
  };
  push: {
    questReminders: boolean;
    streakAlerts: boolean;
    achievements: boolean;
    weeklyGoals: boolean;
  };
}

interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'friends';
  showProgressToOthers: boolean;
  allowDataAnalytics: boolean;
  shareInsightsWithResearchers: boolean;
  showOnLeaderboard: boolean;
}

interface AppPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  questReminders: boolean;
  reminderTime: string;
  autoSaveResponses: boolean;
}

// Mock preferences - replace with actual user data
const mockPreferences = {
  notifications: {
    email: {
      questCompletion: true,
      weeklyDigest: true,
      newFeatures: false,
      marketingEmails: false,
      securityAlerts: true,
    },
    push: {
      questReminders: true,
      streakAlerts: true,
      achievements: true,
      weeklyGoals: false,
    }
  } as NotificationPreferences,
  privacy: {
    profileVisibility: 'public',
    showProgressToOthers: true,
    allowDataAnalytics: true,
    shareInsightsWithResearchers: false,
    showOnLeaderboard: true,
  } as PrivacyPreferences,
  app: {
    theme: 'system',
    language: 'en',
    timezone: 'Asia/Kolkata',
    questReminders: true,
    reminderTime: '14:00',
    autoSaveResponses: true,
  } as AppPreferences
};

export default function Preferences({ className = '' }: PreferencesProps) {
  const [preferences, setPreferences] = useState(mockPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasChanges, setHasChanges] = useState(false);

  // Data fetching
  const { data: profileData } = useProfileData();
  const updateProfileMutation = useUpdateProfile();

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

  // Auto-save preferences
  useEffect(() => {
    if (hasChanges) {
      const timeoutId = setTimeout(() => {
        handleSavePreferences();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [preferences, hasChanges]);

  // Handle preference updates
  const updateNotificationPreference = (category: keyof NotificationPreferences, key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [category]: {
          ...prev.notifications[category],
          [key]: value
        }
      }
    }));
    setHasChanges(true);
  };

  const updatePrivacyPreference = (key: keyof PrivacyPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const updateAppPreference = (key: keyof AppPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      app: {
        ...prev.app,
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  // Save preferences
  const handleSavePreferences = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // In real implementation, save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('saved');
      setHasChanges(false);
      
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Theme handling
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateAppPreference('theme', theme);
    
    // Apply theme immediately
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    }
  };

  // Toggle component
  const Toggle = ({ checked, onChange, disabled = false }: { 
    checked: boolean; 
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }) => (
    <motion.button
      variants={motionVariants.tabItem}
      whileHover={disabled ? {} : "hover"}
      whileTap={disabled ? {} : "tap"}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
        ${checked ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}
      `}
    >
      <motion.span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );

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
            Preferences
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Customize your notifications, privacy, and app settings
          </p>
        </div>

        {/* Save Status */}
        <div className="flex items-center space-x-3">
          <AnimatePresence>
            {saveStatus !== 'idle' && (
              <motion.div
                variants={motionVariants.statusIndicator}
                initial="hidden"
                animate={saveStatus === 'saved' ? 'success' : saveStatus === 'error' ? 'error' : 'hidden'}
                exit="hidden"
                className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  saveStatus === 'saved' 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : saveStatus === 'error'
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                }`}
              >
                {saveStatus === 'saving' && (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
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
                    <span>Error</span>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {hasChanges && (
            <motion.button
              variants={motionVariants.tabItem}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSavePreferences}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="space-y-8">
        
        {/* Notifications Section */}
        <motion.div
          variants={childVariants}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Notifications
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage how you receive updates and alerts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Email Notifications */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h4 className="font-medium text-slate-900 dark:text-white">Email Notifications</h4>
              </div>

              <div className="space-y-3">
                {Object.entries(preferences.notifications.email).map(([key, value]) => (
                  <motion.div
                    key={key}
                    variants={motionVariants.formField}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {key === 'questCompletion' && 'Quest Completion'}
                        {key === 'weeklyDigest' && 'Weekly Progress Digest'}
                        {key === 'newFeatures' && 'New Features & Updates'}
                        {key === 'marketingEmails' && 'Marketing & Promotions'}
                        {key === 'securityAlerts' && 'Security Alerts'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {key === 'questCompletion' && 'Get notified when you complete a quest'}
                        {key === 'weeklyDigest' && 'Weekly summary of your progress'}
                        {key === 'newFeatures' && 'Updates about new platform features'}
                        {key === 'marketingEmails' && 'Product updates and special offers'}
                        {key === 'securityAlerts' && 'Important security notifications'}
                      </div>
                    </div>
                    <Toggle 
                      checked={value}
                      onChange={(checked) => updateNotificationPreference('email', key, checked)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Push Notifications */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Smartphone className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <h4 className="font-medium text-slate-900 dark:text-white">Push Notifications</h4>
              </div>

              <div className="space-y-3">
                {Object.entries(preferences.notifications.push).map(([key, value]) => (
                  <motion.div
                    key={key}
                    variants={motionVariants.formField}
                    className="flex items-center justify-between py-2"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {key === 'questReminders' && 'Quest Reminders'}
                        {key === 'streakAlerts' && 'Streak Alerts'}
                        {key === 'achievements' && 'Achievement Unlocked'}
                        {key === 'weeklyGoals' && 'Weekly Goal Reminders'}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {key === 'questReminders' && 'Daily reminders to complete quests'}
                        {key === 'streakAlerts' && 'Alerts about maintaining streaks'}
                        {key === 'achievements' && 'Notifications for new achievements'}
                        {key === 'weeklyGoals' && 'Progress updates on weekly goals'}
                      </div>
                    </div>
                    <Toggle 
                      checked={value}
                      onChange={(checked) => updateNotificationPreference('push', key, checked)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Section */}
        <motion.div
          variants={childVariants}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Privacy & Data
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Control your data sharing and profile visibility
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Visibility */}
            <motion.div variants={motionVariants.formField}>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Profile Visibility
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['public', 'private', 'friends'] as const).map(option => (
                  <motion.button
                    key={option}
                    variants={motionVariants.tabItem}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => updatePrivacyPreference('profileVisibility', option)}
                    className={`
                      flex items-center justify-center px-4 py-3 rounded-xl border transition-colors
                      ${preferences.privacy.profileVisibility === option
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      {option === 'public' && <Globe className="w-4 h-4" />}
                      {option === 'private' && <EyeOff className="w-4 h-4" />}
                      {option === 'friends' && <Users className="w-4 h-4" />}
                      <span className="text-sm font-medium capitalize">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {preferences.privacy.profileVisibility === 'public' && 'Your profile is visible to everyone'}
                {preferences.privacy.profileVisibility === 'private' && 'Only you can see your profile'}
                {preferences.privacy.profileVisibility === 'friends' && 'Only your connections can see your profile'}
              </p>
            </motion.div>

            {/* Privacy Toggles */}
            <div className="space-y-4">
              {Object.entries(preferences.privacy).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                <motion.div
                  key={key}
                  variants={motionVariants.formField}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {key === 'showProgressToOthers' && 'Show Progress to Others'}
                      {key === 'allowDataAnalytics' && 'Allow Data Analytics'}
                      {key === 'shareInsightsWithResearchers' && 'Share Insights with Researchers'}
                      {key === 'showOnLeaderboard' && 'Show on Leaderboard'}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {key === 'showProgressToOthers' && 'Let others see your quest progress and achievements'}
                      {key === 'allowDataAnalytics' && 'Help us improve the platform with anonymous usage data'}
                      {key === 'shareInsightsWithResearchers' && 'Contribute to psychological research (anonymized)'}
                      {key === 'showOnLeaderboard' && 'Display your ranking on public leaderboards'}
                    </div>
                  </div>
                  <Toggle 
                    checked={value as boolean}
                    onChange={(checked) => updatePrivacyPreference(key as keyof PrivacyPreferences, checked)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* App Settings Section */}
        <motion.div
          variants={childVariants}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                App Settings
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Customize your app experience and preferences
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Theme Selection */}
            <motion.div variants={motionVariants.formField}>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                Appearance Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['light', 'dark', 'system'] as const).map(theme => (
                  <motion.button
                    key={theme}
                    variants={motionVariants.tabItem}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => handleThemeChange(theme)}
                    className={`
                      flex items-center justify-center px-4 py-3 rounded-xl border transition-colors
                      ${preferences.app.theme === theme
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      {theme === 'light' && <Sun className="w-4 h-4" />}
                      {theme === 'dark' && <Moon className="w-4 h-4" />}
                      {theme === 'system' && <Monitor className="w-4 h-4" />}
                      <span className="text-sm font-medium capitalize">{theme}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Quest Reminder Time */}
            <motion.div variants={motionVariants.formField}>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Daily Quest Reminder
              </label>
              <div className="flex items-center space-x-4">
                <Toggle 
                  checked={preferences.app.questReminders}
                  onChange={(checked) => updateAppPreference('questReminders', checked)}
                />
                <input
                  type="time"
                  value={preferences.app.reminderTime}
                  onChange={(e) => updateAppPreference('reminderTime', e.target.value)}
                  disabled={!preferences.app.questReminders}
                  className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {preferences.app.questReminders 
                  ? `Daily reminders at ${preferences.app.reminderTime}`
                  : 'Quest reminders are disabled'
                }
              </p>
            </motion.div>

            {/* Auto-save */}
            <motion.div
              variants={motionVariants.formField}
              className="flex items-center justify-between py-2"
            >
              <div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  Auto-save Responses
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Automatically save your quest responses as you type
                </div>
              </div>
              <Toggle 
                checked={preferences.app.autoSaveResponses}
                onChange={(checked) => updateAppPreference('autoSaveResponses', checked)}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={childVariants}
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Quick Actions
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              variants={motionVariants.profileCard}
              whileHover="hover"
              className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  Reset All Notifications
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Return to default settings
                </div>
              </div>
            </motion.button>

            <motion.button
              variants={motionVariants.profileCard}
              whileHover="hover"
              className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <BarChart3 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  Export Preferences
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Download your settings
                </div>
              </div>
            </motion.button>

            <motion.button
              variants={motionVariants.profileCard}
              whileHover="hover"
              className="flex items-center space-x-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div className="text-left">
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  Sync with Calendar
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Add quest reminders
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}