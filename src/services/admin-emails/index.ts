import { supabase } from '@/integrations/supabase/client';

export interface AdminEmailData {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminEmailUpdateData {
  email: string;
  is_active?: boolean;
}

// Fetch all active admin emails
export const fetchActiveAdminEmails = async (): Promise<{
  success: boolean;
  data?: AdminEmailData[];
  error?: string;
}> => {
  try {
    console.log('🔄 Fetching active admin emails...');

    const { data, error } = await supabase
      .from('admin_emails')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching admin emails:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch admin emails'
      };
    }

    console.log('✅ Admin emails fetched successfully');
    return {
      success: true,
      data: data as AdminEmailData[]
    };

  } catch (error: any) {
    console.error('❌ Exception fetching admin emails:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch admin emails'
    };
  }
};

// Fetch all admin emails (for management view)
export const fetchAllAdminEmails = async (): Promise<{
  success: boolean;
  data?: AdminEmailData[];
  error?: string;
}> => {
  try {
    console.log('🔄 Fetching all admin emails...');

    const { data, error } = await supabase
      .from('admin_emails')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('❌ Error fetching all admin emails:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch admin emails'
      };
    }

    console.log('✅ All admin emails fetched successfully');
    return {
      success: true,
      data: data as AdminEmailData[]
    };

  } catch (error: any) {
    console.error('❌ Exception fetching admin emails:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch admin emails'
    };
  }
};

// Add new admin email
export const addAdminEmail = async (updateData: AdminEmailUpdateData): Promise<{
  success: boolean;
  data?: AdminEmailData;
  error?: string;
}> => {
  try {
    console.log('🔄 Adding new admin email...', updateData);

    const { data, error } = await supabase
      .from('admin_emails')
      .insert({
        ...updateData,
        is_active: updateData.is_active ?? true
      })
      .select('*')
      .single();

    if (error) {
      console.error('❌ Error adding admin email:', error);
      return {
        success: false,
        error: error.message || 'Failed to add admin email'
      };
    }

    console.log('✅ Admin email added successfully');
    return {
      success: true,
      data: data as AdminEmailData
    };

  } catch (error: any) {
    console.error('❌ Exception adding admin email:', error);
    return {
      success: false,
      error: error.message || 'Failed to add admin email'
    };
  }
};

// Update admin email status
export const updateAdminEmailStatus = async (
  id: number,
  is_active: boolean
): Promise<{
  success: boolean;
  data?: AdminEmailData;
  error?: string;
}> => {
  try {
    console.log(`🔄 Updating admin email ${id} status to ${is_active}...`);

    const { data, error } = await supabase
      .from('admin_emails')
      .update({ is_active })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('❌ Error updating admin email:', error);
      return {
        success: false,
        error: error.message || 'Failed to update admin email'
      };
    }

    console.log('✅ Admin email updated successfully');
    return {
      success: true,
      data: data as AdminEmailData
    };

  } catch (error: any) {
    console.error('❌ Exception updating admin email:', error);
    return {
      success: false,
      error: error.message || 'Failed to update admin email'
    };
  }
};

// Delete admin email
export const deleteAdminEmail = async (id: number): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    console.log(`🔄 Deleting admin email ${id}...`);

    const { error } = await supabase
      .from('admin_emails')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting admin email:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete admin email'
      };
    }

    console.log('✅ Admin email deleted successfully');
    return {
      success: true
    };

  } catch (error: any) {
    console.error('❌ Exception deleting admin email:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete admin email'
    };
  }
};

// Check if email is admin (for auth hook)
export const isEmailAdmin = async (email: string): Promise<boolean> => {
  try {
    const result = await fetchActiveAdminEmails();
    if (!result.success || !result.data) {
      console.warn('Database check failed, using fallback admin emails');
      // Fallback to hardcoded emails if database fails
      const fallbackEmails = ['malhotrayash1900@gmail.com', 'indranilmaiti16@gmail.com', 'adityasingh7402@gmail.com'];
      return fallbackEmails.includes(email);
    }
    
    return result.data.some(admin => admin.email === email);
  } catch (error) {
    console.error('❌ Error checking admin email, using fallback:', error);
    // Fallback to hardcoded emails if database fails
    const fallbackEmails = ['malhotrayash1900@gmail.com', 'indranilmaiti16@gmail.com', 'adityasingh7402@gmail.com'];
    return fallbackEmails.includes(email);
  }
};
