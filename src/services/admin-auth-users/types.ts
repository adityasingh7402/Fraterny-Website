export interface AuthUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  last_sign_in: string | null;
  email_confirmed: boolean;
}

export interface AuthUsersResponse {
  success: boolean;
  users?: AuthUser[];
  total?: number;
  error?: string;
}

export interface EmailTemplate {
  subject: string;
  body: string;
  isHtml: boolean;
}

export interface BulkEmailRequest {
  recipients: Array<{
    email: string;
    name: string;
  }>;
  template: EmailTemplate;
  replyTo: string;
  fromName: string;
}

export interface EmailSendResult {
  email: string;
  success: boolean;
  error?: string;
}

export interface BulkEmailResult {
  totalSent: number;
  totalFailed: number;
  results: EmailSendResult[];
}
