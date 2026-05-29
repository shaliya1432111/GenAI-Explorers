import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  getFilteredHistory, 
  removeFromHistory, 
  clearAllHistory 
} from '../services/historyService';
import { Loader2, Trash2, AlertCircle } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('all');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [deletingVideoId, setDeletingVideoId] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);

  console.log('🔍 History Component - currentUser:', currentUser);
  console.log('🔍 History Component - loading:', loading);

  // Fetch history data
  const fetchHistory = async () => {
    if (!currentUser) {
      setLoading(false);
      setHistoryData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getFilteredHistory(currentUser.uid, filter);
      
      if (result.success) {
        setHistoryData(result.data);
      } else {
        setError(result.error);
        setHistoryData([]);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('Failed to load watch history');
      setHistoryData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch history on mount and when filter changes
  useEffect(() => {
    // Add a small delay to ensure auth is loaded
    const timer = setTimeout(() => {
      fetchHistory();
    }, 100);

    return () => clearTimeout(timer);
  }, [currentUser?.uid, filter]);

  // Handle remove single video
  const handleRemoveVideo = async (videoId) => {
    if (!currentUser) return;

    setDeletingVideoId(videoId);

    try {
      const result = await removeFromHistory(currentUser.uid, videoId);
      
      if (result.success) {
        // Update UI immediately by filtering out the deleted video
        setHistoryData(prev => prev.filter(video => video.videoId !== videoId));
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error removing video:', err);
      setError('Failed to remove video from history');
    } finally {
      setDeletingVideoId(null);
    }
  };

  // Handle clear all history
  const handleClearAll = async () => {
    if (!currentUser) return;

    setClearingAll(true);

    try {
      const result = await clearAllHistory(currentUser.uid);
      
      if (result.success) {
        setHistoryData([]);
        setShowClearModal(false);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error clearing history:', err);
      setError('Failed to clear watch history');
    } finally {
      setClearingAll(false);
    }
  };

  // Show message if not authenticated (shouldn't reach here due to ProtectedRoute, but just in case)
  if (!loading && !currentUser) {
    return (
      <div className="min-h-screen bg-ai-darker pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center py-16">
          <AlertCircle className="w-16 h-16 mx-auto text-ai-cyan mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Watch history is unavailable</h2>
          <p className="text-ai-gray mb-6">Return to the home page to continue exploring videos</p>
          <button
            onClick={() => navigate('/home')}
            className="px-6 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan text-white rounded-lg hover:shadow-ai-glow transition-all duration-300"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ai-darker pt-20 px-4">
      <div className="max-w-6xl mx-auto">
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Watch History</h1>
              <p className="text-ai-gray mt-2">
                {loading ? 'Loading...' : `${historyData.length} video${historyData.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {historyData.length > 0 && (
              <button 
                onClick={() => setShowClearModal(true)}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {['all', 'today', 'week', 'month'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              disabled={loading}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                filter === tab
                  ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white shadow-ai-glow'
                  : 'bg-ai-card text-ai-gray hover:text-white hover:bg-ai-hover'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-12 h-12 animate-spin text-ai-blue mx-auto mb-4" />
            <p className="text-ai-gray">Loading your watch history...</p>
          </div>
        )}

        {/* History List */}
        {!loading && historyData.length > 0 && (
          <div className="space-y-4">
            {historyData.map((video) => (
              <div
                key={video.videoId}
                className="bg-ai-card border border-ai-blue/30 rounded-xl p-4 hover:border-ai-cyan transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Thumbnail */}
                  <div 
                    className="relative flex-shrink-0 w-full md:w-64 cursor-pointer" 
                    onClick={() => navigate(`/video/${video.videoId}`)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-36 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-white text-xs">
                      {video.duration}
                    </div>
                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-lg overflow-hidden">
                      <div
                        className="h-full bg-ai-cyan transition-all duration-300"
                        style={{ width: `${video.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3
                        className="text-lg font-semibold text-white group-hover:text-ai-cyan transition-colors cursor-pointer line-clamp-2"
                        onClick={() => navigate(`/video/${video.videoId}`)}
                      >
                        {video.title}
                      </h3>
                      <p className="text-ai-gray text-sm mt-1">{video.channelTitle}</p>
                      <p className="text-ai-gray text-sm mt-1">Watched {video.watchedAt}</p>
                      {video.progress > 0 && video.progress < 100 && (
                        <p className="text-ai-cyan text-sm mt-1">{video.progress}% completed</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 mt-4">
                      <button
                        onClick={() => navigate(`/video/${video.videoId}`)}
                        className="flex items-center space-x-2 text-ai-cyan hover:text-ai-blue transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{video.progress < 100 ? 'Continue Watching' : 'Watch Again'}</span>
                      </button>
                      <button 
                        onClick={() => handleRemoveVideo(video.videoId)}
                        disabled={deletingVideoId === video.videoId}
                        className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        {deletingVideoId === video.videoId ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && historyData.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-ai-gray mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No watch history yet</h3>
            <p className="text-ai-gray mb-6">Start watching videos to build your history</p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan text-white rounded-lg hover:shadow-ai-glow transition-all duration-300"
            >
              Explore Videos
            </button>
          </div>
        )}
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-ai-card border border-ai-blue/30 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Clear Watch History?</h3>
            </div>
            <p className="text-ai-gray mb-6">
              This will permanently delete all {historyData.length} video{historyData.length !== 1 ? 's' : ''} from your watch history. This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearModal(false)}
                disabled={clearingAll}
                className="flex-1 px-4 py-2 bg-ai-hover text-white rounded-lg hover:bg-ai-blue/20 transition-all duration-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                disabled={clearingAll}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {clearingAll ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Clearing...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    <span>Clear All</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;

// Made with Bob
