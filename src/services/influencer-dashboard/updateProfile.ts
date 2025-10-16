import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '@/services/images';
import type { DashboardResponse } from './types';

interface SocialLinks {
  instagram?: string;
  twitter?: string;
  youtube?: string;
  linkedin?: string;
}

interface UpdateProfileInput {
  name?: string;
  bio?: string;
  profile_image?: string;
  social_links?: SocialLinks;
}

interface UpdateBankDetailsInput {
  bank_name?: string;
  account_number?: string;
  ifsc?: string;
  upi?: string;
}

/**
 * Update influencer profile (name, bio, profile image)
 */
export const updateInfluencerProfile = async (
  influencerId: string,
  input: UpdateProfileInput,
  imageFile?: File | null
): Promise<DashboardResponse<any>> => {
  try {
    let uploadedImageUrl = input.profile_image;

    // Upload new image if provided
    if (imageFile) {
      const imageKey = `influencer-${influencerId}-${Date.now()}`;
      const uploadedImage = await uploadImage(
        imageFile,
        imageKey,
        `Profile image for influencer ${input.name}`,
        input.name || 'Influencer',
        'influencer-profiles'
      );

      if (uploadedImage) {
        uploadedImageUrl = uploadedImage.storage_path;
      }
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) updateData.name = input.name;
    if (input.bio !== undefined) updateData.bio = input.bio;
    if (uploadedImageUrl !== undefined) updateData.profile_image = uploadedImageUrl;
    if (input.social_links !== undefined) updateData.social_links = input.social_links;

    const { data, error } = await supabase
      .from('influencers')
      .update(updateData)
      .eq('id', influencerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in updateInfluencerProfile:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};

/**
 * Update influencer bank details
 */
export const updateBankDetails = async (
  influencerId: string,
  input: UpdateBankDetailsInput
): Promise<DashboardResponse<any>> => {
  try {
    const paymentInfo: any = {};
    
    if (input.bank_name) paymentInfo.bank_name = input.bank_name;
    if (input.account_number) paymentInfo.account_number = input.account_number;
    if (input.ifsc) paymentInfo.ifsc = input.ifsc;
    if (input.upi) paymentInfo.upi = input.upi;

    const { data, error } = await supabase
      .from('influencers')
      .update({
        payment_info: paymentInfo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', influencerId)
      .select()
      .single();

    if (error) {
      console.error('Error updating bank details:', error);
      return {
        success: false,
        data: null,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error: any) {
    console.error('Unexpected error in updateBankDetails:', error);
    return {
      success: false,
      data: null,
      error: error?.message || 'An unexpected error occurred',
    };
  }
};
