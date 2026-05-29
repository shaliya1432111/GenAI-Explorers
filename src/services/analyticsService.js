// Analytics Service - Tracks user activity and learning statistics

const ANALYTICS_STORAGE_KEY = 'genai_analytics';

// Default analytics structure
const defaultAnalytics = {
  totalVideosWatched: 0,
  totalWatchTimeSeconds: 0,
  videosCompleted: 0,
  aiQueriesAsked: 0,
  aiPromptsUsed: 0,
  learningStreak: 0,
  lastActiveDate: new Date().toISOString(),
  categoriesWatched: {}, // { category: count }
  recentlyWatched: [], // Array of video objects
  watchHistory: [], // Full history with timestamps
  favoriteCategory: null,
  achievements: []
};

// Get analytics data
export const getAnalytics = () => {
  try {
    const stored = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(defaultAnalytics));
    return defaultAnalytics;
  } catch (error) {
    console.error('Error loading analytics:', error);
    return defaultAnalytics;
  }
};

// Update analytics data
const updateAnalytics = (updates) => {
  try {
    const current = getAnalytics();
    const updated = { ...current, ...updates };
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error updating analytics:', error);
    return current;
  }
};

// Track video watch
export const trackVideoWatch = (videoData) => {
  try {
    const analytics = getAnalytics();
    const { videoId, title, channelTitle, category, thumbnail, duration } = videoData;

    // Check if video already in recent history
    const existingIndex = analytics.recentlyWatched.findIndex(v => v.videoId === videoId);
    
    const videoEntry = {
      videoId,
      title,
      channelTitle,
      category: category || 'General AI',
      thumbnail,
      duration,
      watchedAt: new Date().toISOString()
    };

    let recentlyWatched = [...analytics.recentlyWatched];
    
    if (existingIndex !== -1) {
      // Remove old entry and add to front
      recentlyWatched.splice(existingIndex, 1);
    }
    
    // Add to front and limit to 20 videos
    recentlyWatched.unshift(videoEntry);
    recentlyWatched = recentlyWatched.slice(0, 20);

    // Update category count
    const categoriesWatched = { ...analytics.categoriesWatched };
    const cat = category || 'General AI';
    categoriesWatched[cat] = (categoriesWatched[cat] || 0) + 1;

    // Find favorite category
    const favoriteCategory = Object.entries(categoriesWatched)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    // Update watch history
    const watchHistory = [...analytics.watchHistory, videoEntry].slice(-100); // Keep last 100

    // Update streak
    const lastActiveDate = new Date(analytics.lastActiveDate);
    const today = new Date();
    const daysDiff = Math.floor((today - lastActiveDate) / (1000 * 60 * 60 * 24));
    
    let learningStreak = analytics.learningStreak;
    if (daysDiff === 0) {
      // Same day, keep streak
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      learningStreak += 1;
    } else {
      // Streak broken, reset to 1
      learningStreak = 1;
    }

    return updateAnalytics({
      totalVideosWatched: analytics.totalVideosWatched + 1,
      recentlyWatched,
      watchHistory,
      categoriesWatched,
      favoriteCategory,
      learningStreak,
      lastActiveDate: today.toISOString()
    });
  } catch (error) {
    console.error('Error tracking video watch:', error);
    return getAnalytics();
  }
};

// Track watch time (in seconds)
export const trackWatchTime = (seconds) => {
  try {
    const analytics = getAnalytics();
    return updateAnalytics({
      totalWatchTimeSeconds: analytics.totalWatchTimeSeconds + seconds
    });
  } catch (error) {
    console.error('Error tracking watch time:', error);
    return getAnalytics();
  }
};

// Mark video as completed
export const markVideoCompleted = (videoId) => {
  try {
    const analytics = getAnalytics();
    return updateAnalytics({
      videosCompleted: analytics.videosCompleted + 1
    });
  } catch (error) {
    console.error('Error marking video completed:', error);
    return getAnalytics();
  }
};

// Track AI query
export const trackAIQuery = () => {
  try {
    const analytics = getAnalytics();
    return updateAnalytics({
      aiQueriesAsked: analytics.aiQueriesAsked + 1
    });
  } catch (error) {
    console.error('Error tracking AI query:', error);
    return getAnalytics();
  }
};

// Track AI prompt usage
export const trackAIPrompt = (promptType) => {
  try {
    const analytics = getAnalytics();
    return updateAnalytics({
      aiPromptsUsed: analytics.aiPromptsUsed + 1
    });
  } catch (error) {
    console.error('Error tracking AI prompt:', error);
    return getAnalytics();
  }
};

// Format watch time to human readable
export const formatWatchTime = (seconds) => {
  if (!seconds || seconds < 0) return '0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Get watch time statistics
export const getWatchTimeStats = () => {
  const analytics = getAnalytics();
  const totalSeconds = analytics.totalWatchTimeSeconds;
  
  return {
    total: formatWatchTime(totalSeconds),
    totalSeconds,
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60)
  };
};

// Get category statistics
export const getCategoryStats = () => {
  const analytics = getAnalytics();
  const categories = analytics.categoriesWatched;
  
  const sorted = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));
  
  return {
    all: sorted,
    top3: sorted.slice(0, 3),
    favorite: sorted[0] || { name: 'None', count: 0 }
  };
};

// Get recently watched videos
export const getRecentlyWatched = (limit = 10) => {
  const analytics = getAnalytics();
  return analytics.recentlyWatched.slice(0, limit);
};

// Get learning streak
export const getLearningStreak = () => {
  const analytics = getAnalytics();
  return analytics.learningStreak;
};

// Get AI usage stats
export const getAIUsageStats = () => {
  const analytics = getAnalytics();
  return {
    queries: analytics.aiQueriesAsked,
    prompts: analytics.aiPromptsUsed,
    total: analytics.aiQueriesAsked + analytics.aiPromptsUsed
  };
};

// Reset analytics
export const resetAnalytics = () => {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(defaultAnalytics));
    return defaultAnalytics;
  } catch (error) {
    console.error('Error resetting analytics:', error);
    return getAnalytics();
  }
};

// Export summary for profile
export const getProfileSummary = () => {
  const analytics = getAnalytics();
  const watchTimeStats = getWatchTimeStats();
  const categoryStats = getCategoryStats();
  const aiStats = getAIUsageStats();
  
  return {
    totalVideosWatched: analytics.totalVideosWatched,
    videosCompleted: analytics.videosCompleted,
    watchTime: watchTimeStats.total,
    watchTimeSeconds: watchTimeStats.totalSeconds,
    favoriteCategory: categoryStats.favorite.name,
    learningStreak: analytics.learningStreak,
    aiQueriesAsked: aiStats.queries,
    aiPromptsUsed: aiStats.prompts,
    recentlyWatched: analytics.recentlyWatched.slice(0, 5),
    lastActive: analytics.lastActiveDate
  };
};

export default {
  getAnalytics,
  trackVideoWatch,
  trackWatchTime,
  markVideoCompleted,
  trackAIQuery,
  trackAIPrompt,
  formatWatchTime,
  getWatchTimeStats,
  getCategoryStats,
  getRecentlyWatched,
  getLearningStreak,
  getAIUsageStats,
  resetAnalytics,
  getProfileSummary
};

// Made with Bob