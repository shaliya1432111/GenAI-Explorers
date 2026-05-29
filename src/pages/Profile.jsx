import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Edit2,
  Camera,
  Save,
  X,
  Clock,
  Video,
  MessageSquare,
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Target,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/authService';
import { getProfileSummary, getCategoryStats, getRecentlyWatched } from '../services/analyticsService';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, userData, refreshUserData } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [recentVideos, setRecentVideos] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [showWatchTimeModal, setShowWatchTimeModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);
  const [showQueriesModal, setShowQueriesModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  // Load profile and analytics data
  useEffect(() => {
    loadProfileData();
  }, [userData]);

  const loadProfileData = () => {
    const profileSummary = getProfileSummary();
    const catStats = getCategoryStats();
    const recent = getRecentlyWatched(5);

    setAnalytics(profileSummary);
    setCategoryStats(catStats);
    setRecentVideos(recent);
    
    if (userData) {
      setEditForm({
        displayName: userData.displayName || '',
        bio: userData.bio || ''
      });
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const result = await updateUserProfile(editForm);
      if (result.success) {
        await refreshUserData();
        setIsEditModalOpen(false);
      } else {
        alert(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      alert('An error occurred while updating your profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const result = await updateUserProfile({ photoURL: reader.result });
          if (result.success) {
            await refreshUserData();
          } else {
            alert(result.error || 'Failed to update avatar');
          }
        } catch (error) {
          console.error('Avatar update error:', error);
          alert('An error occurred while updating your avatar');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper function to get user initials
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to get days since joined
  const getDaysSinceJoined = () => {
    if (!userData?.createdAt) return 0;
    const createdDate = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt);
    const diffTime = Math.abs(new Date() - createdDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper function to format last active
  const formatLastActive = (lastActive) => {
    if (!lastActive) return 'Recently';
    const date = lastActive.toDate ? lastActive.toDate() : new Date(lastActive);
    const diffTime = Math.abs(new Date() - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (!userData || !analytics) {
    return (
      <div className="min-h-screen bg-ai-darker pt-20 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  const daysSinceJoined = getDaysSinceJoined();

  return (
    <div className="min-h-screen bg-ai-darker pt-20 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 rounded-2xl p-8 mb-6 border border-ai-blue/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-ai-blue/5 to-ai-purple/5 animate-pulse"></div>
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative group">
              {userData.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName}
                  className="w-32 h-32 rounded-full object-cover border-4 border-ai-blue shadow-ai-glow"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ai-blue to-ai-purple flex items-center justify-center text-white text-4xl font-bold shadow-ai-glow border-4 border-ai-blue/30">
                  {getUserInitials(userData.displayName)}
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-ai-blue hover:bg-ai-cyan p-2 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:scale-110">
                <Camera className="w-5 h-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-white">{userData.displayName || 'User'}</h1>
                <button
                  onClick={handleEditProfile}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ai-blue to-ai-cyan text-white rounded-lg hover:shadow-ai-glow transition-all duration-300 hover:scale-105"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
              <p className="text-ai-gray text-lg mb-2">{userData.email}</p>
              <p className="text-white/80 mb-4 max-w-2xl">{userData.bio || 'GenAI Explorer passionate about learning!'}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-2 text-ai-cyan">
                  <Calendar className="w-4 h-4" />
                  Member for {getDaysSinceJoined()} days
                </span>
                <span className="text-ai-gray">•</span>
                <span className="flex items-center gap-2 text-ai-purple">
                  <Clock className="w-4 h-4" />
                  Last active: {formatLastActive(userData.lastActive)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Watch Time */}
          <button
            onClick={() => setShowWatchTimeModal(true)}
            className="bg-ai-card border border-ai-blue/30 rounded-xl p-6 hover:border-ai-cyan transition-all duration-300 hover:shadow-ai-glow group cursor-pointer transform hover:scale-105 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-ai-blue/20 to-ai-cyan/20 rounded-lg group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-ai-cyan" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-ai-gray text-sm mb-1">Total Watch Time</p>
            <p className="text-3xl font-bold text-white">{analytics.watchTime}</p>
          </button>

          {/* Videos Completed */}
          <button
            onClick={() => setShowVideosModal(true)}
            className="bg-ai-card border border-ai-blue/30 rounded-xl p-6 hover:border-ai-purple transition-all duration-300 hover:shadow-ai-glow group cursor-pointer transform hover:scale-105 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-ai-purple/20 to-ai-pink/20 rounded-lg group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6 text-ai-purple" />
              </div>
              <Award className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-ai-gray text-sm mb-1">Videos Completed</p>
            <p className="text-3xl font-bold text-white">{analytics.videosCompleted}</p>
            <p className="text-xs text-ai-gray mt-1">of {analytics.totalVideosWatched} watched</p>
          </button>

          {/* AI Queries */}
          <button
            onClick={() => setShowQueriesModal(true)}
            className="bg-ai-card border border-ai-blue/30 rounded-xl p-6 hover:border-ai-pink transition-all duration-300 hover:shadow-ai-glow group cursor-pointer transform hover:scale-105 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-ai-pink/20 to-ai-purple/20 rounded-lg group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-ai-pink" />
              </div>
              <BarChart3 className="w-5 h-5 text-ai-cyan" />
            </div>
            <p className="text-ai-gray text-sm mb-1">AI Queries Asked</p>
            <p className="text-3xl font-bold text-white">{analytics.aiQueriesAsked}</p>
            <p className="text-xs text-ai-gray mt-1">{analytics.aiPromptsUsed} prompts used</p>
          </button>

          {/* Learning Streak */}
          <button
            onClick={() => setShowStreakModal(true)}
            className="bg-ai-card border border-ai-blue/30 rounded-xl p-6 hover:border-yellow-500 transition-all duration-300 hover:shadow-ai-glow group cursor-pointer transform hover:scale-105 text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-yellow-400" />
              </div>
              <Target className="w-5 h-5 text-orange-400" />
            </div>
            <p className="text-ai-gray text-sm mb-1">Learning Streak</p>
            <p className="text-3xl font-bold text-white">{analytics.learningStreak} days</p>
            <p className="text-xs text-ai-gray mt-1">Keep it up! 🔥</p>
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Category Stats & Recent Videos */}
          <div className="lg:col-span-2 space-y-6">
            {/* Favorite Category */}
            <div className="bg-ai-card border border-ai-blue/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-ai-cyan" />
                Favorite Learning Category
              </h2>
              <div className="bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 rounded-lg p-6 border border-ai-blue/30">
                <p className="text-3xl font-bold text-white mb-2">{analytics.favoriteCategory}</p>
                <p className="text-ai-gray">Your most watched category</p>
              </div>
            </div>

            {/* Category Distribution Chart */}
            {categoryStats && categoryStats.top3.length > 0 && (
              <div className="bg-ai-card border border-ai-blue/30 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-ai-purple" />
                  Top Categories
                </h2>
                <div className="space-y-4">
                  {categoryStats.top3.map((cat, index) => {
                    const maxCount = categoryStats.top3[0].count;
                    const percentage = (cat.count / maxCount) * 100;
                    const colors = [
                      'from-ai-blue to-ai-cyan',
                      'from-ai-purple to-ai-pink',
                      'from-ai-cyan to-ai-blue'
                    ];
                    return (
                      <div key={cat.name}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-medium">{cat.name}</span>
                          <span className="text-ai-gray text-sm">{cat.count} videos</span>
                        </div>
                        <div className="w-full bg-ai-darker rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors[index]} transition-all duration-1000 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recently Watched */}
            {recentVideos.length > 0 && (
              <div className="bg-ai-card border border-ai-blue/30 rounded-xl p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Video className="w-5 h-5 text-ai-pink" />
                  Recently Watched
                </h2>
                <div className="space-y-3">
                  {recentVideos.map((video) => (
                    <div
                      key={video.videoId}
                      onClick={() => navigate(`/video/${video.videoId}`)}
                      className="flex gap-3 p-3 bg-ai-darker/50 rounded-lg hover:bg-ai-blue/10 border border-ai-blue/20 hover:border-ai-cyan transition-all duration-300 cursor-pointer group"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-32 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium line-clamp-2 group-hover:text-ai-cyan transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-ai-gray text-sm mt-1">{video.channelTitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-2 py-1 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full text-white">
                            {video.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-ai-card border border-ai-blue/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-ai-darker/50 rounded-lg">
                  <span className="text-ai-gray">Videos Watched</span>
                  <span className="text-white font-bold">{analytics.totalVideosWatched}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-ai-darker/50 rounded-lg">
                  <span className="text-ai-gray">Completion Rate</span>
                  <span className="text-white font-bold">
                    {analytics.totalVideosWatched > 0
                      ? Math.round((analytics.videosCompleted / analytics.totalVideosWatched) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-ai-darker/50 rounded-lg">
                  <span className="text-ai-gray">AI Interactions</span>
                  <span className="text-white font-bold">
                    {analytics.aiQueriesAsked + analytics.aiPromptsUsed}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Actions */}
            <div className="bg-ai-card border border-ai-blue/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/history')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan text-white rounded-lg hover:shadow-ai-glow transition-all duration-300 flex items-center justify-between group"
                >
                  <span>View Full History</span>
                  <Clock className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full px-4 py-3 bg-ai-hover text-white rounded-lg hover:bg-ai-blue/20 transition-all duration-300 flex items-center justify-between group"
                >
                  <span>Settings</span>
                  <Edit2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/home')}
                  className="w-full px-4 py-3 bg-ai-hover text-white rounded-lg hover:bg-ai-blue/20 transition-all duration-300 flex items-center justify-between group"
                >
                  <span>Back to Home</span>
                  <Video className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watch Time Details Modal */}
      {showWatchTimeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-ai-card border border-ai-cyan/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl transform animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-ai-cyan to-ai-blue bg-clip-text text-transparent flex items-center space-x-2">
                <Clock className="w-8 h-8 text-ai-cyan" />
                <span>Watch Time Statistics</span>
              </h2>
              <button
                onClick={() => setShowWatchTimeModal(false)}
                className="text-ai-gray hover:text-white transition-colors p-2 hover:bg-ai-cyan/20 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-ai-cyan/20 to-ai-blue/20 border border-ai-cyan/30 rounded-xl p-6">
                <p className="text-ai-gray mb-2">Total Watch Time</p>
                <p className="text-5xl font-bold text-white mb-4">{analytics.watchTime}</p>
                <p className="text-ai-gray">You've spent quality time learning AI concepts!</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4">
                  <p className="text-ai-gray text-sm mb-1">This Week</p>
                  <p className="text-2xl font-bold text-white">2.5 hrs</p>
                </div>
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4">
                  <p className="text-ai-gray text-sm mb-1">This Month</p>
                  <p className="text-2xl font-bold text-white">12 hrs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Videos Completed Modal */}
      {showVideosModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-ai-card border border-ai-purple/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl transform animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-ai-purple to-ai-pink bg-clip-text text-transparent flex items-center space-x-2">
                <Video className="w-8 h-8 text-ai-purple" />
                <span>Videos Completed</span>
              </h2>
              <button
                onClick={() => setShowVideosModal(false)}
                className="text-ai-gray hover:text-white transition-colors p-2 hover:bg-ai-purple/20 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-ai-purple/20 to-ai-pink/20 border border-ai-purple/30 rounded-xl p-6">
                <p className="text-ai-gray mb-2">Videos Completed</p>
                <p className="text-5xl font-bold text-white mb-2">{analytics.videosCompleted}</p>
                <p className="text-ai-gray">of {analytics.totalVideosWatched} videos watched</p>
                <div className="mt-4 w-full bg-ai-darker rounded-full h-3">
                  <div
                    className="h-full bg-gradient-to-r from-ai-purple to-ai-pink rounded-full transition-all duration-1000"
                    style={{ width: `${(analytics.videosCompleted / analytics.totalVideosWatched) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4 text-center">
                  <p className="text-3xl mb-1">🎯</p>
                  <p className="text-xl font-bold text-white">{Math.round((analytics.videosCompleted / analytics.totalVideosWatched) * 100)}%</p>
                  <p className="text-ai-gray text-xs">Completion Rate</p>
                </div>
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4 text-center">
                  <p className="text-3xl mb-1">📚</p>
                  <p className="text-xl font-bold text-white">{analytics.totalVideosWatched}</p>
                  <p className="text-ai-gray text-xs">Total Watched</p>
                </div>
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4 text-center">
                  <p className="text-3xl mb-1">⭐</p>
                  <p className="text-xl font-bold text-white">{analytics.videosCompleted}</p>
                  <p className="text-ai-gray text-xs">Completed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Queries Modal */}
      {showQueriesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-ai-card border border-ai-pink/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl transform animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-ai-pink to-ai-purple bg-clip-text text-transparent flex items-center space-x-2">
                <MessageSquare className="w-8 h-8 text-ai-pink" />
                <span>AI Assistant Usage</span>
              </h2>
              <button
                onClick={() => setShowQueriesModal(false)}
                className="text-ai-gray hover:text-white transition-colors p-2 hover:bg-ai-pink/20 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-ai-pink/20 to-ai-purple/20 border border-ai-pink/30 rounded-xl p-6">
                <p className="text-ai-gray mb-2">Total AI Queries</p>
                <p className="text-5xl font-bold text-white mb-2">{analytics.aiQueriesAsked}</p>
                <p className="text-ai-gray">{analytics.aiPromptsUsed} different prompts used</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4">
                  <p className="text-ai-gray text-sm mb-1">Most Used Feature</p>
                  <p className="text-xl font-bold text-white">💬 Chat</p>
                </div>
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4">
                  <p className="text-ai-gray text-sm mb-1">Avg per Session</p>
                  <p className="text-xl font-bold text-white">5.2 queries</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-ai-blue/10 to-ai-purple/10 border border-ai-blue/20 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">💡 Tip</p>
                <p className="text-ai-gray text-sm">Try using the AI Assistant to explain complex concepts or generate learning roadmaps!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Streak Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-ai-card border border-yellow-500/30 rounded-2xl max-w-2xl w-full p-8 shadow-2xl transform animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center space-x-2">
                <Flame className="w-8 h-8 text-yellow-400" />
                <span>Learning Streak</span>
              </h2>
              <button
                onClick={() => setShowStreakModal(false)}
                className="text-ai-gray hover:text-white transition-colors p-2 hover:bg-yellow-500/20 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 text-center">
                <p className="text-6xl mb-4 animate-bounce">🔥</p>
                <p className="text-ai-gray mb-2">Current Streak</p>
                <p className="text-6xl font-bold text-white mb-2">{analytics.learningStreak}</p>
                <p className="text-2xl text-yellow-400">days</p>
                <p className="text-ai-gray mt-4">Keep it up! You're on fire! 🚀</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">🏆</p>
                  <p className="text-lg font-bold text-white">15</p>
                  <p className="text-ai-gray text-xs">Longest Streak</p>
                </div>
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">📅</p>
                  <p className="text-lg font-bold text-white">{daysSinceJoined}</p>
                  <p className="text-ai-gray text-xs">Days Active</p>
                </div>
                <div className="bg-ai-darker/50 border border-ai-blue/20 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-1">⚡</p>
                  <p className="text-lg font-bold text-white">92%</p>
                  <p className="text-ai-gray text-xs">Consistency</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-ai-blue/10 to-ai-purple/10 border border-ai-blue/20 rounded-lg p-4">
                <p className="text-white font-semibold mb-2">🎯 Goal</p>
                <p className="text-ai-gray text-sm">Reach a 30-day streak to unlock the "Dedicated Learner" badge!</p>
                <div className="mt-3 w-full bg-ai-darker rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(analytics.learningStreak / 30) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md mx-4 bg-ai-card border border-ai-blue/30 rounded-2xl shadow-2xl p-6 animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-ai-gray hover:text-white hover:bg-ai-blue/20 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-ai-gray text-sm mb-2">Display Name</label>
                <input
                  type="text"
                  value={editForm.displayName}
                  onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white focus:outline-none focus:border-ai-cyan transition-all"
                  placeholder="Your display name"
                />
              </div>

              <div>
                <label className="block text-ai-gray text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full px-4 py-3 bg-ai-darker/50 border border-ai-blue/20 rounded-lg text-ai-gray cursor-not-allowed"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-ai-gray mt-1">Email cannot be changed here. Contact support if needed.</p>
              </div>

              <div>
                <label className="block text-ai-gray text-sm mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white focus:outline-none focus:border-ai-cyan transition-all resize-none"
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan text-white rounded-lg hover:shadow-ai-glow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={loading}
                  className="px-4 py-3 bg-ai-hover text-white rounded-lg hover:bg-ai-blue/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

// Made with Bob
