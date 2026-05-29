// User Profile Service - Manages user data with localStorage persistence

const USER_STORAGE_KEY = 'genai_user_profile';

// Default user profile structure
const defaultProfile = {
  name: 'AI Explorer',
  email: 'explorer@genaiexplorers.com',
  bio: 'Passionate about learning AI and exploring the future of technology.',
  avatar: null, // Will store base64 image or URL
  joinedDate: new Date().toISOString(),
  lastActive: new Date().toISOString(),
  preferences: {
    theme: 'dark',
    notifications: true,
    autoplay: true
  }
};

// Get user profile from localStorage
export const getUserProfile = () => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    if (stored) {
      const profile = JSON.parse(stored);
      // Update last active
      profile.lastActive = new Date().toISOString();
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    }
    // Initialize with default profile
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  } catch (error) {
    console.error('Error loading user profile:', error);
    return defaultProfile;
  }
};

// Update user profile
export const updateUserProfile = (updates) => {
  try {
    const currentProfile = getUserProfile();
    const updatedProfile = {
      ...currentProfile,
      ...updates,
      lastActive: new Date().toISOString()
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedProfile));
    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Update avatar (handles file upload and converts to base64)
export const updateAvatar = async (file) => {
  try {
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 2MB' };
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    // Convert to base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = updateUserProfile({ avatar: reader.result });
        resolve(result);
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file' });
      };
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error updating avatar:', error);
    return { success: false, error: error.message };
  }
};

// Remove avatar
export const removeAvatar = () => {
  return updateUserProfile({ avatar: null });
};

// Reset profile to default
export const resetProfile = () => {
  try {
    const resetProfile = {
      ...defaultProfile,
      joinedDate: getUserProfile().joinedDate // Keep original join date
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(resetProfile));
    return { success: true, profile: resetProfile };
  } catch (error) {
    console.error('Error resetting profile:', error);
    return { success: false, error: error.message };
  }
};

// Get user initials for avatar placeholder
export const getUserInitials = (name) => {
  if (!name) return 'AI';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Calculate days since joined
export const getDaysSinceJoined = () => {
  const profile = getUserProfile();
  const joinedDate = new Date(profile.joinedDate);
  const today = new Date();
  const diffTime = Math.abs(today - joinedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Format last active time
export const formatLastActive = (lastActive) => {
  const date = new Date(lastActive);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export default {
  getUserProfile,
  updateUserProfile,
  updateAvatar,
  removeAvatar,
  resetProfile,
  getUserInitials,
  getDaysSinceJoined,
  formatLastActive
};

// Made with Bob