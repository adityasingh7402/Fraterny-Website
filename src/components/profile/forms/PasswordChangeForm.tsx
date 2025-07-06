import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfileEdit } from '../../../hooks/profile/useProfileEdit';
import { PasswordUpdateData } from '@/types/profile';
import { validatePassword, validateConfirmedPassword } from '@/utils/profile/validators';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Save, EyeOff, Eye, KeyRound, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordChangeFormProps {
  className?: string;
  onSuccess?: () => void;
}

/**
 * Form component for changing user password
 */
export function PasswordChangeForm({ className, onSuccess }: PasswordChangeFormProps) {
  const { updatePassword, isLoading, errors } = useProfileEdit();
  
  // Form state
  const [formData, setFormData] = useState<PasswordUpdateData & { confirmPassword: string }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Show/hide password toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form validation errors
  const [validationErrors, setValidationErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  
  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error on change
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Validate form before submission
  const validateForm = (): boolean => {
    const newErrors: typeof validationErrors = {};
    
    // Validate current password
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    // Validate new password
    const newPasswordError = validatePassword(formData.newPassword, 'New password');
    if (newPasswordError) {
      newErrors.newPassword = newPasswordError;
    }
    
    // Validate password confirmation
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(false);
    
    if (!validateForm()) {
      return;
    }
    
    const success = await updatePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    });
    
    if (success) {
      setIsSuccess(true);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
  
  // Password strength indicator
  const getPasswordStrength = (password: string): { strength: number; text: string; color: string } => {
    if (!password) return { strength: 0, text: 'No password', color: 'bg-gray-200 dark:bg-gray-700' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    switch (strength) {
      case 4: 
        return { strength: 100, text: 'Strong', color: 'bg-green-500' };
      case 3: 
        return { strength: 75, text: 'Good', color: 'bg-blue-500' };
      case 2: 
        return { strength: 50, text: 'Fair', color: 'bg-amber-500' };
      default: 
        return { strength: 25, text: 'Weak', color: 'bg-red-500' };
    }
  };
  
  const passwordStrength = getPasswordStrength(formData.newPassword);
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <KeyRound className="h-5 w-5 mr-2 text-primary" />
          Change Password
        </CardTitle>
        <CardDescription>
          Update your password to keep your account secure
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900">
                  <Check className="h-4 w-4" />
                  <AlertDescription>
                    Password successfully updated.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            {/* Current Password */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="currentPassword" className="text-sm font-medium">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={errors.currentPassword || validationErrors.currentPassword ? 'border-red-300 focus:border-red-500' : ''}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {(errors.currentPassword || validationErrors.currentPassword) && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.currentPassword || validationErrors.currentPassword}
                </p>
              )}
            </motion.div>
            
            {/* New Password */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="newPassword" className="text-sm font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={errors.newPassword || validationErrors.newPassword ? 'border-red-300 focus:border-red-500' : ''}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {(errors.newPassword || validationErrors.newPassword) && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.newPassword || validationErrors.newPassword}
                </p>
              )}
              
              {/* Password strength indicator */}
              {formData.newPassword && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Password strength:</span>
                    <span className="text-xs font-medium">{passwordStrength.text}</span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
            
            {/* Confirm Password */}
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={validationErrors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </motion.div>
            
            {/* Password requirements */}
            <motion.div variants={itemVariants} className="text-sm text-gray-500 dark:text-gray-400 space-y-1 pt-2">
              <p>Password must:</p>
              <ul className="list-disc list-inside pl-2 space-y-0.5">
                <li className={formData.newPassword.length >= 8 ? 'text-green-500 dark:text-green-400' : ''}>
                  Be at least 8 characters long
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'text-green-500 dark:text-green-400' : ''}>
                  Include at least one uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? 'text-green-500 dark:text-green-400' : ''}>
                  Include at least one number
                </li>
                <li className={/[^A-Za-z0-9]/.test(formData.newPassword) ? 'text-green-500 dark:text-green-400' : ''}>
                  Include at least one special character (recommended)
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Change Password
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}