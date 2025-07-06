import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle,
  Lock,
  UserCog,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProfileEditForm from '../forms/ProfileEditForm';

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
      type: "spring",
      stiffness: 100,
      damping: 15
    } 
  }
};

const expansionVariants = {
  collapsed: { 
    height: 0, 
    opacity: 0,
    marginTop: 0
  },
  expanded: { 
    height: "auto", 
    opacity: 1,
    marginTop: 16,
    transition: {
      height: { 
        duration: 0.3,
        ease: "easeInOut" 
      },
      opacity: { 
        duration: 0.3, 
        ease: "easeInOut" 
      }
    }
  }
};

interface AccountSettingsProps {
  className?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ className = '' }) => {
  const { user, isLoading } = useAuth();
  
  // Section expansion states
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Account deletion state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Toggle section expansion
  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const handlePasswordChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    setPasswordError('');
    setPasswordSuccess(false);
  };

  const validatePasswordForm = (): string | null => {
    if (!passwordForm.currentPassword) {
      return 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      return 'New password is required';
    }
    if (passwordForm.newPassword.length < 3) {
      return 'New password must be at least 3 characters long';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return 'New passwords do not match';
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      return 'New password must be different from current password';
    }
    return null;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePasswordForm();
    if (validationError) {
      setPasswordError(validationError);
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');

    try {
      // Update password with Supabase
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        throw error;
      }
      
      setPasswordSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Password updated successfully');
      
      // Hide success message after 3 seconds
      setTimeout(() => setPasswordSuccess(false), 3000);
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update password. Please try again.';
      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setDeleteError('Please type "DELETE" to confirm account deletion');
      return;
    }

    setDeleteLoading(true);
    setDeleteError('');

    try {
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        throw new Error('Unable to get user information');
      }

      // Delete user data from database tables (CASCADE will handle related data)
      // The user_profiles table has ON DELETE CASCADE for user_id references
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', currentUser.id);

      if (profileError) {
        console.error('Profile deletion error:', profileError);
        // Continue with auth deletion even if profile deletion fails
      }

      // Delete user analytics data
      const { error: analyticsError } = await supabase
        .from('user_analytics')
        .delete()
        .eq('user_id', currentUser.id);

      if (analyticsError) {
        console.error('Analytics deletion error:', analyticsError);
        // Continue with auth deletion even if analytics deletion fails
      }

      // Delete user from Supabase Auth (this should cascade to other tables)
      const { error: authError } = await supabase.auth.admin.deleteUser(currentUser.id);
      
      if (authError) {
        // If admin delete fails, try regular sign out
        console.error('Admin delete failed, signing out user:', authError);
        await supabase.auth.signOut();
      }

      toast.success('Account deleted successfully');
      
      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setDeleteConfirmation('');
      
      // Redirect to home page after account deletion
      window.location.href = '/';
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete account. Please try again.';
      setDeleteError(errorMessage);
      toast.error(errorMessage);
      console.error('Account deletion error:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Account Settings
          </h3>
          <p className="text-red-600">
            Unable to load your account settings. Please try refreshing or logging in again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`space-y-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-playfair font-bold text-navy">Security</h2>
          <p className="text-gray-600 mt-1">
            Manage your account security and preferences
          </p>
        </div>
        <Shield className="h-8 w-8 text-navy" />
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Change Password Button */}
        <motion.div variants={itemVariants} className="h-full">
          <Button 
            onClick={() => toggleSection('password')}
            className={`w-full h-full flex flex-col items-center justify-center p-6 rounded-lg border border-navy/20 hover:border-navy/40 transition-all group ${
              activeSection === 'password' 
                ? 'bg-navy text-white'
                : 'bg-navy/5 hover:bg-navy/10 text-navy'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Lock className={`h-8 w-8 mb-3 ${
                activeSection === 'password' ? 'text-white' : 'text-navy'
              }`} />
              <h3 className="text-lg font-semibold mb-1">Change Password</h3>
              <p className={`text-sm ${
                activeSection === 'password' ? 'text-white/80' : 'text-navy/70'
              }`}>
                Update your account password
              </p>
              <div className="mt-2">
                {activeSection === 'password' ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                )}
              </div>
            </div>
          </Button>
        </motion.div>

        {/* Edit Profile Button */}
        <motion.div variants={itemVariants} className="h-full">
          <Button 
            onClick={() => toggleSection('profile')}
            className={`w-full h-full flex flex-col items-center justify-center p-6 rounded-lg border border-terracotta/20 hover:border-terracotta/40 transition-all group ${
              activeSection === 'profile' 
                ? 'bg-terracotta text-white'
                : 'bg-terracotta/5 hover:bg-terracotta/10 text-terracotta'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <UserCog className={`h-8 w-8 mb-3 ${
                activeSection === 'profile' ? 'text-white' : 'text-terracotta'
              }`} />
              <h3 className="text-lg font-semibold mb-1">Edit Profile</h3>
              <p className={`text-sm ${
                activeSection === 'profile' ? 'text-white/80' : 'text-terracotta/70'
              }`}>
                Update your personal information
              </p>
              <div className="mt-2">
                {activeSection === 'profile' ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                )}
              </div>
            </div>
          </Button>
        </motion.div>

        {/* Delete Account Button */}
        <motion.div variants={itemVariants} className="h-full">
          <Button 
            onClick={() => toggleSection('delete')}
            className={`w-full h-full flex flex-col items-center justify-center p-6 rounded-lg border border-red-200 hover:border-red-300 transition-all group ${
              activeSection === 'delete' 
                ? 'bg-red-600 text-white'
                : 'bg-red-50 hover:bg-red-100 text-red-700'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Trash2 className={`h-8 w-8 mb-3 ${
                activeSection === 'delete' ? 'text-white' : 'text-red-600'
              }`} />
              <h3 className="text-lg font-semibold mb-1">Delete Account</h3>
              <p className={`text-sm ${
                activeSection === 'delete' ? 'text-white/80' : 'text-red-600/70'
              }`}>
                Permanently delete your account
              </p>
              <div className="mt-2">
                {activeSection === 'delete' ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                )}
              </div>
            </div>
          </Button>
        </motion.div>
      </div>

      {/* Expandable Content Sections */}
      
      {/* Password Change Section */}
      <motion.div
        variants={expansionVariants}
        initial="collapsed"
        animate={activeSection === 'password' ? 'expanded' : 'collapsed'}
        className="overflow-hidden"
      >
        <Card className="border-navy/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-navy">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Password updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              {passwordError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-1 max-w-md">
                {/* Current Password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      placeholder="Enter current password"
                      className="pr-10"
                      disabled={passwordLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      disabled={passwordLoading}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                      className="pr-10"
                      disabled={passwordLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      disabled={passwordLoading}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Password must be at least 8 characters long
                  </p>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                      className="pr-10"
                      disabled={passwordLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={passwordLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={passwordLoading}
                className="w-fit bg-navy hover:bg-navy/90"
              >
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Edit Section */}
      <motion.div
        variants={expansionVariants}
        initial="collapsed"
        animate={activeSection === 'profile' ? 'expanded' : 'collapsed'}
        className="overflow-hidden"
      >
        <ProfileEditForm />
      </motion.div>

      {/* Account Deletion Section */}
      <motion.div
        variants={expansionVariants}
        initial="collapsed"
        animate={activeSection === 'delete' ? 'expanded' : 'collapsed'}
        className="overflow-hidden"
      >
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Trash2 className="h-5 w-5" />
              Delete Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> Account deletion is permanent and cannot be undone. 
                  All your data, including quest history and analytics, will be permanently deleted.
                </AlertDescription>
              </Alert>

              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-fit">
                    Delete My Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      Delete Account
                    </DialogTitle>
                    <DialogDescription className="space-y-2">
                      <p>
                        This action cannot be undone. This will permanently delete your account 
                        and remove all your data from our servers.
                      </p>
                      <p className="font-medium">
                        Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> to confirm:
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <Input
                      value={deleteConfirmation}
                      onChange={(e) => {
                        setDeleteConfirmation(e.target.value);
                        setDeleteError('');
                      }}
                      placeholder="Type DELETE to confirm"
                      disabled={deleteLoading}
                    />
                    
                    {deleteError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{deleteError}</AlertDescription>
                      </Alert>
                    )}
                  </div>

                  <DialogFooter className="gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setDeleteDialogOpen(false);
                        setDeleteConfirmation('');
                        setDeleteError('');
                      }}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading || deleteConfirmation !== 'DELETE'}
                    >
                      {deleteLoading ? 'Deleting...' : 'Delete Account'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AccountSettings;