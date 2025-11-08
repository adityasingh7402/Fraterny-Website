import { supabase } from '@/integrations/supabase/client';
import { BulkEmailRequest, EmailSendResult, BulkEmailResult } from '../admin-auth-users/types';


/**
 * Send bulk emails using Supabase Edge Function with Mailtrap
 */
export const sendBulkEmails = async (
  request: BulkEmailRequest,
  onProgress?: (sent: number, total: number) => void
): Promise<BulkEmailResult> => {
  const total = request.recipients.length;
  const BATCH_SIZE = 10; // Send 10 emails per batch
  const results: EmailSendResult[] = [];

  // Send emails in batches
  for (let i = 0; i < request.recipients.length; i += BATCH_SIZE) {
    const batch = request.recipients.slice(i, i + BATCH_SIZE);

    try {
      const { data, error } = await supabase.functions.invoke('send-bulk-emails', {
        body: {
          recipients: batch,
          subject: request.template.subject,
          body: request.template.body,
          isHtml: request.template.isHtml,
          replyTo: request.replyTo,
          fromName: request.fromName,
        },
      });

      if (error) {
        // If batch fails, mark all as failed
        batch.forEach(recipient => {
          results.push({
            email: recipient.email,
            success: false,
            error: error.message || 'Failed to send email',
          });
        });
      } else if (data && data.results) {
        results.push(...data.results);
      }
    } catch (err: any) {
      // If batch fails, mark all as failed
      batch.forEach(recipient => {
        results.push({
          email: recipient.email,
          success: false,
          error: err.message || 'Failed to send email',
        });
      });
    }

    // Report progress
    if (onProgress) {
      onProgress(Math.min(i + BATCH_SIZE, total), total);
    }

    // Small delay between batches
    if (i + BATCH_SIZE < request.recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  const totalSent = results.filter(r => r.success).length;
  const totalFailed = results.filter(r => !r.success).length;

  return {
    totalSent,
    totalFailed,
    results,
  };
};

/**
 * Test email configuration by sending a test email
 */
export const testEmailConfiguration = async (testEmail: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-bulk-emails', {
      body: {
        recipients: [{ email: testEmail, name: 'Test User' }],
        subject: 'Test Email from Fraterny Admin',
        body: 'This is a test email to verify email configuration.',
        isHtml: false,
        replyTo: testEmail,
        fromName: 'Fraterny Admin',
      },
    });

    if (error) {
      console.error('Email test failed:', error);
      return false;
    }

    return data?.success || false;
  } catch (error) {
    console.error('Email test failed:', error);
    return false;
  }
};
