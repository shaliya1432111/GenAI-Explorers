import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    autoplay: true,
    darkMode: true,
    quality: 'auto',
    language: 'en',
  });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleEmailChange = () => {
    if (newEmail && newEmail !== user?.email) {
      alert(`Email would be changed to: ${newEmail}\n(This is a demo - no actual change made)`);
      setShowEmailModal(false);
      setNewEmail('');
    }
  };

  const handlePasswordChange = () => {
    if (newPassword && newPassword === confirmPassword && currentPassword) {
      alert('Password would be changed\n(This is a demo - no actual change made)');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else if (newPassword !== confirmPassword) {
      alert('New passwords do not match!');
    }
  };

  return (
    <div className="min-h-screen bg-ai-darker pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-ai-cyan hover:text-ai-blue transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-ai-gray mt-2">Manage your account preferences</p>
        </div>

        {/* Account Settings */}
        <div className="bg-ai-card border border-ai-blue/30 rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <svg className="w-6 h-6 text-ai-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Account</span>
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-ai-hover rounded-lg hover:bg-ai-blue/10 transition-all duration-300">
              <div>
                <p className="text-white font-medium">Email</p>
                <p className="text-ai-gray text-sm">{user?.email || 'ai@genaiexplorers.com'}</p>
              </div>
              <button
                onClick={() => setShowEmailModal(true)}
                className="text-ai-cyan hover:text-ai-blue transition-colors border border-ai-cyan px-4 py-1 rounded-lg hover:bg-ai-cyan/10"
              >
                Change
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-ai-hover rounded-lg hover:bg-ai-blue/10 transition-all duration-300">
              <div>
                <p className="text-white font-medium">Password</p>
                <p className="text-ai-gray text-sm">••••••••</p>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-ai-cyan hover:text-ai-blue transition-colors border border-ai-cyan px-4 py-1 rounded-lg hover:bg-ai-cyan/10"
              >
                Change
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-ai-card border border-ai-blue/30 rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <svg className="w-6 h-6 text-ai-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Preferences</span>
          </h2>
          <div className="space-y-4">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-4 bg-ai-hover rounded-lg">
              <div>
                <p className="text-white font-medium">Notifications</p>
                <p className="text-ai-gray text-sm">Receive updates and alerts</p>
              </div>
              <button
                onClick={() => handleToggle('notifications')}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  settings.notifications ? 'bg-ai-cyan' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    settings.notifications ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>

            {/* Autoplay Toggle */}
            <div className="flex items-center justify-between p-4 bg-ai-hover rounded-lg">
              <div>
                <p className="text-white font-medium">Autoplay</p>
                <p className="text-ai-gray text-sm">Automatically play next video</p>
              </div>
              <button
                onClick={() => handleToggle('autoplay')}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  settings.autoplay ? 'bg-ai-cyan' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    settings.autoplay ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-ai-hover rounded-lg">
              <div>
                <p className="text-white font-medium">Dark Mode</p>
                <p className="text-ai-gray text-sm">Use dark theme</p>
              </div>
              <button
                onClick={() => handleToggle('darkMode')}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  settings.darkMode ? 'bg-ai-cyan' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                    settings.darkMode ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>

            {/* Video Quality */}
            <div className="p-4 bg-ai-hover rounded-lg">
              <p className="text-white font-medium mb-2">Video Quality</p>
              <select
                value={settings.quality}
                onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value }))}
                className="w-full px-4 py-2 bg-ai-darker border border-ai-blue/30 rounded-lg text-white focus:outline-none focus:border-ai-cyan transition-colors"
              >
                <option value="auto">Auto</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>

            {/* Language */}
            <div className="p-4 bg-ai-hover rounded-lg">
              <p className="text-white font-medium mb-2">Language</p>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-2 bg-ai-darker border border-ai-blue/30 rounded-lg text-white focus:outline-none focus:border-ai-cyan transition-colors"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => alert('Settings saved successfully!')}
          className="w-full px-6 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan text-white rounded-lg hover:shadow-ai-glow transition-all duration-300 font-semibold"
        >
          Save Changes
        </button>
      </div>

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowEmailModal(false)}>
          <div className="bg-ai-card border border-ai-blue/30 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-4">Change Email</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-ai-gray text-sm mb-2">Current Email</label>
                <input
                  type="email"
                  value={user?.email || 'ai@genaiexplorers.com'}
                  readOnly
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white cursor-text select-all"
                />
              </div>
              <div>
                <label className="block text-ai-gray text-sm mb-2">New Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white focus:outline-none focus:border-ai-cyan"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-3 border border-ai-blue/30 text-white rounded-lg hover:bg-ai-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailChange}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan text-white rounded-lg hover:shadow-ai-glow transition-all"
                >
                  Change Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-ai-card border border-ai-blue/30 rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-white mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-ai-gray text-sm mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white focus:outline-none focus:border-ai-cyan"
                />
              </div>
              <div>
                <label className="block text-ai-gray text-sm mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white focus:outline-none focus:border-ai-cyan"
                />
              </div>
              <div>
                <label className="block text-ai-gray text-sm mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white focus:outline-none focus:border-ai-cyan"
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-3 border border-ai-blue/30 text-white rounded-lg hover:bg-ai-hover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan text-white rounded-lg hover:shadow-ai-glow transition-all"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

// Made with Bob
