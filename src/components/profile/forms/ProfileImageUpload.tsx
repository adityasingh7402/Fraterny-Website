import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileEdit } from '../../../hooks/profile/useProfileEdit';
import { useProfileData } from '../../../hooks/profile/useProfileData';
import { validateFile } from '@/utils/profile/validators';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Upload, Image, RefreshCw, Trash2, Camera, Check, X, ZoomIn, RotateCw } from 'lucide-react';

interface ProfileImageUploadProps {
  className?: string;
  compact?: boolean;
  onSuccess?: (imageUrl: string) => void;
}

/**
 * Component for uploading and cropping profile images
 */
export function ProfileImageUpload({ className, compact = false, onSuccess }: ProfileImageUploadProps) {
  const { data, isLoading: isLoadingProfile } = useProfileData();
  const profileData = data as any;
  const { uploadProfileImage, updateProfile, isLoading } = useProfileEdit();
  
  // File handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Image cropping state
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset states
    setError(null);
    setIsSuccess(false);
    
    // Validate file
    const validationError = validateFile(file, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], 5);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
    
    // Open crop dialog
    setCropDialogOpen(true);
    
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  // Reset the form
  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setUploadProgress(0);
    setIsUploading(false);
    setIsSuccess(false);
    setZoom(1);
    setRotation(0);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Upload the image
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate progress (in a real app, this would come from the upload API)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      // Upload the image
      const imageUrl = await uploadProfileImage(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (imageUrl) {
        setIsSuccess(true);
        
        if (onSuccess) {
          onSuccess(imageUrl);
        }
        
        // Reset after success
        setTimeout(() => {
          resetForm();
        }, 2000);
      }
    } catch (error) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Apply crop and rotation
  const handleCropConfirm = () => {
    if (!imageRef.current || !selectedFile) return;
    
    setCropDialogOpen(false);
    
    // In a real implementation, this would apply the crop and rotation to the image
    // using a canvas to create a new image file
    // For this demo, we'll just use the preview as is
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!profileData) return '?';
    
    const firstName = profileData.firstName || '';
    const lastName = profileData.lastName || '';
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };
  
  // Compact version (avatar with upload trigger)
  if (compact) {
    return (
      <div className={className}>
        <div className="relative inline-block">
          <Avatar className="h-24 w-24 border-2 border-white dark:border-gray-800 shadow-md">
            <AvatarImage 
              src={profileData?.profile_image_url || ''} 
              alt={`${profileData?.firstName} ${profileData?.lastName}`} 
            />
            <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <Button
            size="icon"
            variant="secondary"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
            onClick={handleButtonClick}
          >
            <Camera className="h-4 w-4" />
          </Button>
          
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
        
        {/* Crop Dialog */}
        <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile Image</DialogTitle>
              <DialogDescription>
                Adjust your profile picture before uploading
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {previewUrl && (
                <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    ref={imageRef}
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-full object-contain"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="zoom">Zoom</Label>
                  <span className="text-sm text-gray-500">{Math.round(zoom * 100)}%</span>
                </div>
                <Slider
                  id="zoom"
                  min={0.5}
                  max={2}
                  step={0.01}
                  value={[zoom]}
                  onValueChange={(values: number[]) => setZoom(values[0])}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rotation">Rotation</Label>
                  <span className="text-sm text-gray-500">{rotation}°</span>
                </div>
                <Slider
                  id="rotation"
                  min={0}
                  max={360}
                  step={1}
                  value={[rotation]}
                  onValueChange={(values: number[]) => setRotation(values[0])}
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCropDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleCropConfirm}>
                <Check className="mr-2 h-4 w-4" /> Apply
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Upload Progress Dialog */}
        <Dialog open={isUploading || isSuccess} onOpenChange={val => !val && setIsUploading(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isSuccess ? 'Upload Complete' : 'Uploading Image...'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-6">
              {isSuccess ? (
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-green-100 p-3 text-green-600 mb-4">
                    <Check className="h-6 w-6" />
                  </div>
                  <p className="text-center">
                    Your profile image has been updated successfully.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-center text-sm text-gray-500">
                    Uploading your image... {Math.round(uploadProgress)}%
                  </p>
                </div>
              )}
            </div>
            
            {isSuccess && (
              <Button onClick={() => setIsSuccess(false)}>
                Close
              </Button>
            )}
          </DialogContent>
        </Dialog>
        
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
    );
  }
  
  // Full version (card with upload area)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Image className="h-5 w-5 mr-2 text-primary" />
          Profile Picture
        </CardTitle>
        <CardDescription>
          Upload a profile picture to personalize your account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Current Image */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-2 border-primary/10">
              <AvatarImage 
                src={profileData?.profile_image_url || ''} 
                alt={`${profileData?.firstName} ${profileData?.lastName}`} 
              />
              <AvatarFallback className="text-xl font-medium bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium">Current Picture</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profileData?.profile_image_url ? 
                  'Your profile picture is visible to other users.' : 
                  'You haven\'t uploaded a profile picture yet.'}
              </p>
            </div>
          </div>
          
          {/* Upload Area */}
          <div 
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            onClick={handleButtonClick}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">{selectedFile?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(selectedFile?.size && (selectedFile.size / 1024 / 1024).toFixed(2)) || 0} MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    JPG, PNG or GIF (max. 5MB)
                  </p>
                </div>
              </div>
            )}
            
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
          
          {error && (
            <div className="text-sm text-red-500 p-2 bg-red-50 dark:bg-red-950/20 rounded border border-red-100 dark:border-red-900">
              {error}
            </div>
          )}
          
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </div>
        
        {/* Crop Dialog */}
        <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile Image</DialogTitle>
              <DialogDescription>
                Adjust your profile picture before uploading
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {previewUrl && (
                <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    ref={imageRef}
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-full object-contain"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <ZoomIn className="h-4 w-4 mr-2 text-gray-500" />
                  <Label htmlFor="zoom" className="mr-2">Zoom</Label>
                  <Slider
                    id="zoom"
                    className="flex-1"
                    min={0.5}
                    max={2}
                    step={0.01}
                    value={[zoom]}
                    onValueChange={(values: number[]) => setZoom(values[0])}
                  />
                  <span className="ml-2 text-sm text-gray-500 min-w-[40px] text-right">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <RotateCw className="h-4 w-4 mr-2 text-gray-500" />
                  <Label htmlFor="rotation" className="mr-2">Rotation</Label>
                  <Slider
                    id="rotation"
                    className="flex-1"
                    min={0}
                    max={360}
                    step={1}
                    value={[rotation]}
                    onValueChange={(values: number[]) => setRotation(values[0])}
                  />
                  <span className="ml-2 text-sm text-gray-500 min-w-[40px] text-right">
                    {rotation}°
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCropDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleCropConfirm}>
                <Check className="mr-2 h-4 w-4" /> Apply
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={resetForm}
          disabled={!selectedFile || isUploading}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Reset
        </Button>
        
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || isSuccess}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : isSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Uploaded
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}