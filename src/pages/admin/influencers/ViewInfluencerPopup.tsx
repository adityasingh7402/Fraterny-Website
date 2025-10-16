import React, { useState, useEffect } from 'react';
import { X, Edit2, Save, User, TrendingUp, MousePointer, DollarSign, Users, Upload } from 'lucide-react';
import { updateInfluencer } from '@/services/admin-influencers';
import type { InfluencerData, UpdateInfluencerInput, SocialLinks, PaymentInfo } from '@/services/admin-influencers';
import { toast } from 'sonner';
import { uploadImage } from '@/services/images';
import { supabase } from '@/integrations/supabase/client';
import { getDashboardStats } from '@/services/influencer-dashboard';

interface ViewInfluencerPopupProps {
  isOpen: boolean;
  influencer: InfluencerData;
  onClose: () => void;
  onUpdate: () => void;
}

const ViewInfluencerPopup: React.FC<ViewInfluencerPopupProps> = ({ isOpen, influencer, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [liveStats, setLiveStats] = useState<{ totalClicks: number; totalSignups: number; totalQuestionnaires: number; totalPurchases: number; conversionRate: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Form states (initialized with influencer data)
  const [name, setName] = useState(influencer.name);
  const [email, setEmail] = useState(influencer.email);
  const [phone, setPhone] = useState(influencer.phone || '');
  const [commissionRate, setCommissionRate] = useState(influencer.commission_rate);
  const [status, setStatus] = useState(influencer.status);
  const [bio, setBio] = useState(influencer.bio || '');
  const [profileImagePreview, setProfileImagePreview] = useState(influencer.profile_image || '');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  
  // Social links
  const [instagram, setInstagram] = useState(influencer.social_links?.instagram || '');
  const [twitter, setTwitter] = useState(influencer.social_links?.twitter || '');
  const [youtube, setYoutube] = useState(influencer.social_links?.youtube || '');
  const [linkedin, setLinkedin] = useState(influencer.social_links?.linkedin || '');
  
  // Payment info
  const [bankName, setBankName] = useState(influencer.payment_info?.bank_name || '');
  const [accountNumber, setAccountNumber] = useState(influencer.payment_info?.account_number || '');
  const [ifsc, setIfsc] = useState(influencer.payment_info?.ifsc || '');
  const [upi, setUpi] = useState(influencer.payment_info?.upi || '');

  // Fetch live stats from tracking_events
  useEffect(() => {
    const fetchLiveStats = async () => {
      setStatsLoading(true);
      try {
        const response = await getDashboardStats(influencer.affiliate_code);
        if (response.success && response.data) {
          setLiveStats({
            totalClicks: response.data.totalClicks,
            totalSignups: response.data.totalSignups,
            totalQuestionnaires: response.data.totalQuestionnaires || 0,
            totalPurchases: response.data.totalPurchases,
            conversionRate: response.data.conversionRate,
          });
        }
      } catch (error) {
        console.error('Error fetching live stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchLiveStats();
  }, [influencer.affiliate_code]);

  // Update form when influencer changes
  useEffect(() => {
    setName(influencer.name);
    setEmail(influencer.email);
    setPhone(influencer.phone || '');
    setCommissionRate(influencer.commission_rate);
    setStatus(influencer.status);
    setBio(influencer.bio || '');
    setProfileImagePreview(influencer.profile_image || '');
    setInstagram(influencer.social_links?.instagram || '');
    setTwitter(influencer.social_links?.twitter || '');
    setYoutube(influencer.social_links?.youtube || '');
    setLinkedin(influencer.social_links?.linkedin || '');
    setBankName(influencer.payment_info?.bank_name || '');
    setAccountNumber(influencer.payment_info?.account_number || '');
    setIfsc(influencer.payment_info?.ifsc || '');
    setUpi(influencer.payment_info?.upi || '');
  }, [influencer]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setProfileImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle save
  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    if (commissionRate < 0 || commissionRate > 100) {
      toast.error('Commission rate must be between 0 and 100');
      return;
    }

    setLoading(true);

    try {
      let uploadedImageUrl = profileImagePreview;

      // Upload new image if selected
      if (profileImageFile) {
        setImageUploading(true);
        const imageKey = `influencer-${influencer.affiliate_code.toLowerCase()}-${Date.now()}`;
        const uploadedImage = await uploadImage(
          profileImageFile,
          imageKey,
          `Profile image for influencer ${name}`,
          name,
          'influencer-profiles'
        );

        if (uploadedImage) {
          uploadedImageUrl = uploadedImage.storage_path;
        }
        setImageUploading(false);
      }

      // Build social links
      const socialLinks: SocialLinks = {};
      if (instagram) socialLinks.instagram = instagram;
      if (twitter) socialLinks.twitter = twitter;
      if (youtube) socialLinks.youtube = youtube;
      if (linkedin) socialLinks.linkedin = linkedin;

      // Build payment info
      const paymentInfo: PaymentInfo = {};
      if (bankName) paymentInfo.bank_name = bankName;
      if (accountNumber) paymentInfo.account_number = accountNumber;
      if (ifsc) paymentInfo.ifsc = ifsc;
      if (upi) paymentInfo.upi = upi;

      // Update influencer
      const input: UpdateInfluencerInput = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        commission_rate: commissionRate,
        status,
        bio: bio.trim() || undefined,
        profile_image: uploadedImageUrl || undefined,
        social_links: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
        payment_info: Object.keys(paymentInfo).length > 0 ? paymentInfo : undefined,
      };

      const response = await updateInfluencer(influencer.id, input);

      if (response.success) {
        toast.success('Influencer updated successfully!');
        setEditMode(false);
        onUpdate();
      } else {
        toast.error(response.error || 'Failed to update influencer');
      }
    } catch (error: any) {
      console.error('Error updating influencer:', error);
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setImageUploading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get public URL for profile image
  const getProfileImageUrl = (storagePath: string | null): string | null => {
    if (!storagePath) return null;
    
    // If it's already a full URL, return it
    if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
      return storagePath;
    }
    
    // If it's a data URL (from FileReader preview), return it
    if (storagePath.startsWith('data:')) {
      return storagePath;
    }
    
    // Otherwise, generate public URL from storage path
    const { data } = supabase.storage
      .from('website-images')
      .getPublicUrl(storagePath);
    
    return data?.publicUrl || null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Influencer Profile</h2>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(editMode ? status : influencer.status)}`}>
              {editMode ? status : influencer.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={loading || imageUploading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4" />
                {loading ? (imageUploading ? 'Uploading...' : 'Saving...') : 'Save'}
              </button>
            )}
            <button
              onClick={editMode ? () => setEditMode(false) : onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Profile Image */}
            <div className="relative">
              {profileImagePreview && getProfileImageUrl(profileImagePreview) ? (
                <img
                  src={getProfileImageUrl(profileImagePreview)!}
                  alt={name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                  <User className="h-16 w-16 text-gray-400" />
                </div>
              )}
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Upload className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={imageUploading}
                  />
                </label>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-4">
              {editMode ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate (%)</label>
                    <input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">{influencer.name}</h3>
                  <p className="text-gray-600">{influencer.email}</p>
                  {influencer.phone && <p className="text-gray-600">{influencer.phone}</p>}
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-sm text-gray-500">
                      Code: <span className="font-mono font-semibold text-gray-900">{influencer.affiliate_code}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Commission: <span className="font-semibold text-gray-900">{influencer.commission_rate}%</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {editMode ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                ) : (
                  <p className="text-gray-600 text-sm">{influencer.bio || 'No bio provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Questionnaires</span>
                <MousePointer className="h-4 w-4 text-blue-600" />
              </div>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{liveStats?.totalQuestionnaires?.toLocaleString() || 0}</p>
              )}
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Signups</span>
                <Users className="h-4 w-4 text-green-600" />
              </div>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{liveStats?.totalSignups.toLocaleString() || 0}</p>
              )}
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Purchases</span>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{liveStats?.totalPurchases.toLocaleString() || 0}</p>
              )}
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Conversion</span>
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              {statsLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{liveStats?.conversionRate.toFixed(2) || 0}%</p>
              )}
            </div>
          </div>

          {/* Earnings Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90 mb-1">Total Earnings</p>
              <p className="text-3xl font-bold">{formatCurrency(influencer.total_earnings)}</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90 mb-1">Remaining Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(influencer.remaining_balance)}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90 mb-1">Total Paid</p>
              <p className="text-3xl font-bold">{formatCurrency(influencer.total_paid)}</p>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editMode ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                    <input
                      type="url"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                    <input
                      type="url"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                    <input
                      type="url"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="https://youtube.com/@username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </>
              ) : (
                <div className="col-span-2 space-y-2">
                  {influencer.social_links?.instagram && (
                    <a href={influencer.social_links.instagram} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">
                      Instagram: {influencer.social_links.instagram}
                    </a>
                  )}
                  {influencer.social_links?.twitter && (
                    <a href={influencer.social_links.twitter} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">
                      Twitter: {influencer.social_links.twitter}
                    </a>
                  )}
                  {influencer.social_links?.youtube && (
                    <a href={influencer.social_links.youtube} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">
                      YouTube: {influencer.social_links.youtube}
                    </a>
                  )}
                  {influencer.social_links?.linkedin && (
                    <a href={influencer.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline text-sm">
                      LinkedIn: {influencer.social_links.linkedin}
                    </a>
                  )}
                  {!influencer.social_links && <p className="text-gray-500 text-sm">No social links added</p>}
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Information</h3>
            {editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                  <input
                    type="text"
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {influencer.payment_info?.bank_name && (
                  <p className="text-sm"><span className="font-medium">Bank:</span> {influencer.payment_info.bank_name}</p>
                )}
                {influencer.payment_info?.account_number && (
                  <p className="text-sm"><span className="font-medium">Account:</span> ****{influencer.payment_info.account_number.slice(-4)}</p>
                )}
                {influencer.payment_info?.ifsc && (
                  <p className="text-sm"><span className="font-medium">IFSC:</span> {influencer.payment_info.ifsc}</p>
                )}
                {influencer.payment_info?.upi && (
                  <p className="text-sm"><span className="font-medium">UPI:</span> {influencer.payment_info.upi}</p>
                )}
                {!influencer.payment_info && <p className="text-gray-500 text-sm">No payment information added</p>}
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Created:</span> {new Date(influencer.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Updated:</span> {new Date(influencer.updated_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Last Activity:</span> {influencer.last_activity_at ? new Date(influencer.last_activity_at).toLocaleDateString() : 'Never'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInfluencerPopup;
