// Watch History Service - localStorage based

const HISTORY_KEY = 'watch_history';

// Get user's watch history
export const getWatchHistory = (userId) => {
  try {
    const allHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    return allHistory[userId] || [];
  } catch (error) {
    console.error('Error getting watch history:', error);
    return [];
  }
};

// Get filtered history
export const getFilteredHistory = async (userId, filter = 'all') => {
  try {
    const history = getWatchHistory(userId);
    const now = new Date();
    
    let filtered = history;
    
    switch (filter) {
      case 'today':
        filtered = history.filter(item => {
          const watchedDate = new Date(item.watchedAt);
          return watchedDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = history.filter(item => {
          const watchedDate = new Date(item.watchedAt);
          return watchedDate >= weekAgo;
        });
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = history.filter(item => {
          const watchedDate = new Date(item.watchedAt);
          return watchedDate >= monthAgo;
        });
        break;
      default:
        filtered = history;
    }
    
    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.watchedAt) - new Date(a.watchedAt));
    
    return {
      success: true,
      data: filtered
    };
  } catch (error) {
    console.error('Error filtering history:', error);
    return {
      success: false,
      error: error.message,
      data: []
    };
  }
};

// Save to history
export const saveToHistory = (userId, videoData) => {
  try {
    const allHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    const userHistory = allHistory[userId] || [];
    
    // Check if video already exists
    const existingIndex = userHistory.findIndex(item => item.videoId === videoData.videoId);
    
    const historyItem = {
      ...videoData,
      watchedAt: new Date().toISOString(),
      progress: videoData.progress || 0
    };
    
    if (existingIndex >= 0) {
      // Update existing entry
      userHistory[existingIndex] = historyItem;
    } else {
      // Add new entry at the beginning
      userHistory.unshift(historyItem);
    }
    
    // Keep only last 100 videos
    if (userHistory.length > 100) {
      userHistory.splice(100);
    }
    
    allHistory[userId] = userHistory;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
    
    return { success: true };
  } catch (error) {
    console.error('Error saving to history:', error);
    return { success: false, error: error.message };
  }
};

// Remove from history
export const removeFromHistory = async (userId, videoId) => {
  try {
    const allHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    const userHistory = allHistory[userId] || [];
    
    const filtered = userHistory.filter(item => item.videoId !== videoId);
    allHistory[userId] = filtered;
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from history:', error);
    return { success: false, error: error.message };
  }
};

// Clear all history
export const clearAllHistory = async (userId) => {
  try {
    const allHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    allHistory[userId] = [];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
    
    return { success: true };
  } catch (error) {
    console.error('Error clearing history:', error);
    return { success: false, error: error.message };
  }
};

// Update video progress
export const updateVideoProgress = (userId, videoId, progress) => {
  try {
    const allHistory = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}');
    const userHistory = allHistory[userId] || [];
    
    const videoIndex = userHistory.findIndex(item => item.videoId === videoId);
    
    if (videoIndex >= 0) {
      userHistory[videoIndex].progress = progress;
      userHistory[videoIndex].watchedAt = new Date().toISOString();
      allHistory[userId] = userHistory;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating progress:', error);
    return { success: false, error: error.message };
  }
};

// Made with Bob