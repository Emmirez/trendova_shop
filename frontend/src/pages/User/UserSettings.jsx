import { useState } from 'react';
import { Edit, Save, X, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { userService } from '../../services/apiService';
import { toast } from 'react-hot-toast';

const UserSettings = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  // Update profile
  const handleUpdateProfile = async () => {
    if (!profileData.name) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await userService.updateProfile({
        name: profileData.name,
        phone: profileData.phone,
      });
      
      // Update user in auth context using updateUser
      if (updateUser && response.user) {
        updateUser(response.user);
      }
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (!passwordData.newPassword) {
      toast.error('New password is required');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      toast.success('Password changed successfully');
      
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      console.error('Failed to change password:', err);
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure? This action cannot be undone.')) {
      return;
    }
    
    setIsDeletingAccount(true);
    try {
      // Note: You'll need to add a delete account endpoint
      // For now, this is a placeholder
      toast.error('Account deletion endpoint not implemented yet');
    } catch (err) {
      console.error('Failed to delete account:', err);
      toast.error(err.message || 'Failed to delete account');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  // Cancel editing
  const cancelEditing = () => {
    setProfileData({
      name: user?.name || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {/* Profile settings */}
      <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">Profile Information</h3>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-gold hover:text-yellow-600 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
            >
              <Edit size={13} />
              Edit
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={cancelEditing}
                className="flex items-center gap-2 text-red-400 hover:text-red-500 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors"
              >
                <X size={13} />
                Cancel
              </button>
              <button 
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex items-center gap-2 text-gold hover:text-yellow-600 font-mono text-[10px] tracking-[0.2em] uppercase transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                Save
              </button>
            </div>
          )}
        </div>
        <div className="px-6 py-5 space-y-4">
          {/* Full Name */}
          <div className="flex items-center justify-between py-3 border-b theme-border">
            <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Full Name</span>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="w-1/2 text-right font-body theme-text-secondary text-sm px-3 py-1 border theme-border focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                style={{ backgroundColor: 'var(--input-bg)' }}
              />
            ) : (
              <span className="font-body theme-text-secondary text-sm">{user?.name || 'Not set'}</span>
            )}
          </div>
          
          {/* Email (read-only) */}
          <div className="flex items-center justify-between py-3 border-b theme-border">
            <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Email</span>
            <span className="font-body theme-text-secondary text-sm">{user?.email || 'Not set'}</span>
          </div>
          
          {/* Phone */}
          <div className="flex items-center justify-between py-3 border-b theme-border">
            <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Phone</span>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                placeholder="Not set"
                className="w-1/2 text-right font-body theme-text-secondary text-sm px-3 py-1 border theme-border focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
                style={{ backgroundColor: 'var(--input-bg)' }}
              />
            ) : (
              <span className="font-body theme-text-secondary text-sm">{user?.phone || 'Not set'}</span>
            )}
          </div>
          
          {/* Member Since */}
          <div className="flex items-center justify-between py-3 border-b theme-border last:border-0">
            <span className="font-mono text-[10px] tracking-[0.2em] theme-text-muted uppercase">Member Since</span>
            <span className="font-body theme-text-secondary text-sm">{formatDate(user?.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="border theme-border rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="px-6 py-4 border-b theme-border">
          <h3 className="font-mono text-[11px] tracking-[0.3em] theme-text-muted uppercase">Change Password</h3>
        </div>
        <div className="px-6 py-5 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
              style={{ backgroundColor: 'var(--input-bg)' }}
              placeholder="Enter current password"
            />
          </div>
          
          {/* New Password */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
              style={{ backgroundColor: 'var(--input-bg)' }}
              placeholder="Enter new password (min. 8 characters)"
            />
          </div>
          
          {/* Confirm New Password */}
          <div>
            <label className="block font-mono text-[10px] tracking-[0.3em] theme-text-muted uppercase mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full border theme-border theme-text font-body text-sm px-4 py-3 focus:outline-none focus:border-gold/40 transition-colors rounded-lg"
              style={{ backgroundColor: 'var(--input-bg)' }}
              placeholder="Confirm new password"
            />
          </div>
          
          <button 
            onClick={handleChangePassword}
            disabled={isChangingPassword}
            className="px-8 py-3 bg-gold text-obsidian font-mono text-[11px] tracking-[0.3em] uppercase font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
          >
            {isChangingPassword ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-red-500/20 bg-red-500/5 rounded-lg">
        <div className="px-6 py-4 border-b border-red-500/20">
          <h3 className="font-mono text-[11px] tracking-[0.3em] text-red-400 uppercase">Danger Zone</h3>
        </div>
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <p className="font-body theme-text-secondary text-sm">Delete Account</p>
            <p className="font-body theme-text-muted text-xs mt-0.5">This action is permanent and cannot be undone.</p>
          </div>
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeletingAccount}
            className="px-6 py-3 border border-red-500/30 text-red-400 font-mono text-[10px] tracking-[0.2em] uppercase hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 rounded-lg"
          >
            {isDeletingAccount ? (
              <>
                <Loader2 size={12} className="animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;