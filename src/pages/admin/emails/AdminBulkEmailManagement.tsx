import React, { useState, useEffect } from 'react';
import { fetchAuthUsers, AuthUser } from '@/services/admin-auth-users';
import { sendBulkEmails } from '@/services/email/emailService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  RefreshCw, 
  Send, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Eye,
  Code,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';

const AdminBulkEmailManagement: React.FC = () => {
  // State for users
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]); // Store all users for filtering
  const [error, setError] = useState<string | null>(null);
  
  // Filter state
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Selection state
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  
  // Email template state
  const [subject, setSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isHtml, setIsHtml] = useState(false);
  const [replyTo, setReplyTo] = useState('');
  const [fromName, setFromName] = useState('Fraterny Team');
  
  // Sending state
  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ sent: 0, total: 0 });
  const [showResults, setShowResults] = useState(false);
  const [sendResults, setSendResults] = useState<any>(null);
  
  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewUser, setPreviewUser] = useState<AuthUser | null>(null);

  // Fetch auth users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetchAuthUsers();
      if (response.success && response.users) {
        setAllUsers(response.users);
        applyFilters(response.users);
      } else {
        setError(response.error || 'Failed to load users');
        toast.error('Failed to load users', {
          description: response.error
        });
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      toast.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  // Apply date filters
  const applyFilters = (userList: AuthUser[] = allUsers) => {
    let filtered = [...userList];

    // Filter by date range
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter(user => new Date(user.created_at) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999); // Include entire end date
      filtered = filtered.filter(user => new Date(user.created_at) <= toDate);
    }

    setUsers(filtered);
    
    // Clear selections when filters change
    setSelectedUserIds([]);
    setIsAllSelected(false);
  };

  // Handle filter changes
  const handleFilterChange = () => {
    applyFilters();
  };

  // Reset filters
  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    applyFilters(allUsers);
    toast.success('Filters reset');
  };

  // Initialize
  useEffect(() => {
    fetchUsers();
  }, []);

  // Selection handlers
  const handleSelectUser = (userId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
      setIsAllSelected(false);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUserIds([]);
      setIsAllSelected(false);
    } else {
      setSelectedUserIds(users.map(u => u.id));
      setIsAllSelected(true);
    }
  };

  const handleClearSelection = () => {
    setSelectedUserIds([]);
    setIsAllSelected(false);
  };

  // Get selected users
  const selectedUsers = users.filter(u => selectedUserIds.includes(u.id));

  // Template variable replacement for preview
  const replaceVariables = (text: string, user: AuthUser) => {
    return text
      .replace(/\{\{\s*name\s*\}\}/gi, user.name)
      .replace(/\{\{\s*email\s*\}\}/gi, user.email);
  };

  // Preview handler
  const handlePreview = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }
    setPreviewUser(selectedUsers[0]);
    setShowPreview(true);
  };

  // Send emails handler
  const handleSendEmails = async () => {
    // Validation
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one recipient');
      return;
    }

    if (!subject.trim()) {
      toast.error('Please enter an email subject');
      return;
    }

    if (!emailBody.trim()) {
      toast.error('Please enter email content');
      return;
    }

    if (!replyTo.trim() || !replyTo.includes('@')) {
      toast.error('Please enter a valid reply-to email address');
      return;
    }

    // Confirm
    const confirmed = window.confirm(
      `Are you sure you want to send this email to ${selectedUsers.length} recipient(s)?`
    );

    if (!confirmed) return;

    setSending(true);
    setSendProgress({ sent: 0, total: selectedUsers.length });
    setShowResults(false);

    try {
      const result = await sendBulkEmails(
        {
          recipients: selectedUsers.map(u => ({
            email: u.email,
            name: u.name
          })),
          template: {
            subject,
            body: emailBody,
            isHtml
          },
          replyTo,
          fromName
        },
        (sent, total) => {
          setSendProgress({ sent, total });
        }
      );

      setSendResults(result);
      setShowResults(true);
      
      if (result.totalFailed === 0) {
        toast.success(`Successfully sent ${result.totalSent} emails!`);
      } else {
        toast.warning(`Sent ${result.totalSent} emails, ${result.totalFailed} failed`);
      }
    } catch (error: any) {
      toast.error('Failed to send emails', {
        description: error.message
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Mail className="h-8 w-8" />
              Bulk Email Management
            </h1>
            <p className="text-gray-600 mt-1">
              Send personalized emails to authenticated users
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh Users
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Email Template */}
        <div className="space-y-6">
          {/* Template Form */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Email Template</h2>
            
            <div className="space-y-4">
              {/* From Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Name
                </label>
                <Input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="e.g., Fraterny Team"
                />
              </div>

              {/* Reply-To Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reply-To Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  value={replyTo}
                  onChange={(e) => setReplyTo(e.target.value)}
                  placeholder="support@fraterny.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Users' replies will be sent to this email address
                </p>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject <span className="text-red-500">*</span>
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Welcome to Fraterny, {{name}}!"
                />
              </div>

              {/* Template Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Format
                </label>
                <div className="flex gap-2">
                  <Button
                    variant={!isHtml ? 'default' : 'outline'}
                    onClick={() => setIsHtml(false)}
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Plain Text
                  </Button>
                  <Button
                    variant={isHtml ? 'default' : 'outline'}
                    onClick={() => setIsHtml(true)}
                    className="flex-1"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    HTML
                  </Button>
                </div>
              </div>

              {/* Email Body */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Content <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder={isHtml 
                    ? "Enter HTML content...\n\nExample:\n<h1>Hello {{name}}!</h1>\n<p>Welcome to our platform.</p>"
                    : "Enter plain text...\n\nExample:\nHello {{name}}!\n\nWelcome to our platform."
                  }
                  rows={12}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available variables: <code className="bg-gray-100 px-1 rounded">{'{{name}}'}</code>, <code className="bg-gray-100 px-1 rounded">{'{{email}}'}</code>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  disabled={!subject || !emailBody || selectedUsers.length === 0}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={handleSendEmails}
                  disabled={sending || !subject || !emailBody || !replyTo || selectedUsers.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {sending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending... ({sendProgress.sent}/{sendProgress.total})
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send to {selectedUsers.length} Users
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Send Results */}
          {showResults && sendResults && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Results</h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Successfully Sent</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{sendResults.totalSent}</span>
                </div>
                
                {sendResults.totalFailed > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-medium text-red-900">Failed</span>
                    </div>
                    <span className="text-2xl font-bold text-red-600">{sendResults.totalFailed}</span>
                  </div>
                )}

                {sendResults.results.filter((r: any) => !r.success).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Failed Emails:</h3>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {sendResults.results
                        .filter((r: any) => !r.success)
                        .map((result: any, index: number) => (
                          <div key={index} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                            {result.email}: {result.error}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Recipients */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {/* Date Filters */}
          <div className="mb-4 pb-4 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Registration Date</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  From Date
                </label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  To Date
                </label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={handleFilterChange}
                size="sm"
                className="flex-1"
              >
                Apply Filters
              </Button>
              <Button
                onClick={resetFilters}
                variant="outline"
                size="sm"
                className="flex-1"
                disabled={!dateFrom && !dateTo}
              >
                Reset
              </Button>
            </div>
            {(dateFrom || dateTo) && (
              <p className="text-xs text-blue-600 mt-2">
                Showing {users.length} of {allUsers.length} users
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Recipients ({users.length})
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                disabled={loading || users.length === 0}
              >
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </Button>
              {selectedUserIds.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Clear ({selectedUserIds.length})
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-3 text-gray-600">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedUserIds.includes(user.id)
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectUser(user.id, !selectedUserIds.includes(user.id))}
                >
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectUser(user.id, e.target.checked);
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{user.name}</div>
                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                  </div>
                  {user.email_confirmed && (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" title="Email verified" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && previewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Email Preview</h3>
                <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-semibold">
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Preview for: {previewUser.name} ({previewUser.email})
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">From:</label>
                <div className="text-gray-900">{fromName}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Reply-To:</label>
                <div className="text-gray-900">{replyTo}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Subject:</label>
                <div className="text-gray-900">{replaceVariables(subject, previewUser)}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Body:</label>
                <div className="border border-gray-200 rounded p-4 bg-gray-50">
                  {isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: replaceVariables(emailBody, previewUser) }} />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-gray-900">{replaceVariables(emailBody, previewUser)}</pre>
                  )}
                </div>
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <Button onClick={() => setShowPreview(false)} className="w-full">
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBulkEmailManagement;
