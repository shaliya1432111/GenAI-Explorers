import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import VideoCard from '../components/VideoCard';
import { subscriptions } from '../services/youtubeApi';
import { mockVideos } from '../data/mockVideos';

function Subscriptions() {
  const navigate = useNavigate();
  const [selectedChannel, setSelectedChannel] = useState('all');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuickLink, setSelectedQuickLink] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate('/home');
  };

  const handleQuickLinkSelect = (filter) => {
    setSelectedQuickLink(filter);
    navigate('/home');
  };

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    // Filter videos based on selected channel
    let filteredVideos = [];
    
    if (selectedChannel === 'all') {
      // Show videos from all subscribed channels
      const channelNames = subscriptions.map(sub => sub.channel.toLowerCase());
      filteredVideos = mockVideos.filter(video => 
        channelNames.some(channel => 
          video.channel.toLowerCase().includes(channel) ||
          video.title.toLowerCase().includes(channel)
        )
      );
    } else {
      // Show videos from specific channel
      const channel = subscriptions.find(sub => sub.id === selectedChannel);
      if (channel) {
        filteredVideos = mockVideos.filter(video => 
          video.channel.toLowerCase().includes(channel.channel.toLowerCase()) ||
          video.title.toLowerCase().includes(channel.channel.toLowerCase())
        );
      }
    }

    // Sort by date (newest first)
    filteredVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    setTimeout(() => {
      setVideos(filteredVideos);
      setLoading(false);
    }, 300);
  }, [selectedChannel]);

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="flex min-h-screen bg-ai-darker pt-16">
      <Sidebar
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        selectedQuickLink={selectedQuickLink}
        onQuickLinkSelect={handleQuickLinkSelect}
      />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <span className="mr-3">📺</span>
              Subscriptions
            </h1>
            <p className="text-ai-gray text-lg">
              Latest videos from channels you follow
            </p>
          </div>

          {/* Channel Filter Tabs */}
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedChannel('all')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedChannel === 'all'
                  ? 'bg-gradient-to-r from-ai-blue to-ai-purple text-white shadow-ai-glow'
                  : 'bg-ai-card text-ai-gray hover:text-white hover:bg-ai-card/80'
              }`}
            >
              <span className="mr-2">🏠</span>
              All Channels
            </button>
            {subscriptions.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedChannel(sub.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  selectedChannel === sub.id
                    ? 'bg-gradient-to-r from-ai-blue to-ai-purple text-white shadow-ai-glow'
                    : 'bg-ai-card text-ai-gray hover:text-white hover:bg-ai-card/80'
                }`}
              >
                <span className="mr-2">{sub.icon}</span>
                {sub.name}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ai-cyan mb-4"></div>
                <p className="text-white text-lg">Loading videos...</p>
              </div>
            </div>
          )}

          {/* Videos Grid */}
          {!loading && videos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onClick={() => handleVideoClick(video.id)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && videos.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-block p-8 bg-ai-card rounded-2xl mb-6">
                <span className="text-6xl">📭</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                No videos found
              </h3>
              <p className="text-ai-gray text-lg mb-6">
                {selectedChannel === 'all'
                  ? 'No videos available from your subscribed channels yet.'
                  : 'No videos available from this channel yet.'}
              </p>
              <button
                onClick={() => navigate('/home')}
                className="px-8 py-3 bg-gradient-to-r from-ai-blue to-ai-purple text-white rounded-xl font-medium hover:shadow-ai-glow transition-all duration-300"
              >
                Explore Videos
              </button>
            </div>
          )}

          {/* Stats Footer */}
          {!loading && videos.length > 0 && (
            <div className="mt-12 p-6 bg-ai-card rounded-2xl border border-ai-blue/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-ai-blue to-ai-purple rounded-xl">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {videos.length} videos available
                    </p>
                    <p className="text-ai-gray text-sm">
                      From {selectedChannel === 'all' ? subscriptions.length : 1} channel{selectedChannel === 'all' && 's'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-ai-gray text-sm">Subscribed to</p>
                  <p className="text-white font-bold text-xl">{subscriptions.length} channels</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Subscriptions;

// Made with Bob
