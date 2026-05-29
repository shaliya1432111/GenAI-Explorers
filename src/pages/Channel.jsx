import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { fetchGenAIVideos, formatViewCount } from '../services/youtubeApi';

const Channel = () => {
  const { channelName } = useParams();
  const decodedChannelName = decodeURIComponent(channelName);
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChannelVideos = async () => {
      setLoading(true);
      try {
        const videos = await fetchGenAIVideos(`${decodedChannelName} generative AI`, 24, 'date');
        const filteredVideos = videos.filter(
          (video) => (video.channel || video.channelTitle || '').toLowerCase() === decodedChannelName.toLowerCase()
        );
        setChannelVideos(filteredVideos);
      } catch (error) {
        console.error('Error loading channel videos:', error);
        setChannelVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadChannelVideos();
  }, [decodedChannelName]);

  const channelInfo = channelVideos[0] || null;
  const totalViews = useMemo(
    () => channelVideos.reduce((total, video) => total + Number(video.viewCount || 0), 0),
    [channelVideos]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-ai-darker pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-ai-blue/30 border-t-ai-cyan rounded-full animate-spin mb-4 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Channel</h2>
          <p className="text-ai-gray">Fetching real YouTube videos for {decodedChannelName}</p>
        </div>
      </div>
    );
  }

  if (!channelInfo) {
    return (
      <div className="min-h-screen bg-ai-darker pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📺</div>
          <h2 className="text-2xl font-bold text-white mb-2">Channel Not Found</h2>
          <p className="text-ai-gray">The channel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ai-darker pt-16">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ai-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ai-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        {/* Channel Header */}
        <div className="bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 border-b border-ai-blue/30">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center space-x-6">
              {/* Channel Avatar */}
              <div className="relative group">
                <div className="absolute inset-0 bg-ai-blue/30 blur-xl"></div>
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-ai-blue to-ai-purple flex items-center justify-center text-white text-4xl font-bold shadow-ai-glow">
                  {(channelInfo.channel || channelInfo.channelTitle || 'G').charAt(0)}
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-ai-blue via-ai-purple to-ai-pink bg-clip-text text-transparent mb-2">
                  {channelInfo.channel || channelInfo.channelTitle}
                </h1>
                <div className="flex items-center space-x-6 text-ai-gray mb-4">
                  <span>{channelVideos.length} videos</span>
                  <span>•</span>
                  <span>
                    {formatViewCount(totalViews)} total views
                  </span>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan rounded-full text-white font-semibold hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                  <span>Subscribe</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Videos */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Videos</h2>
            <p className="text-ai-gray">Latest uploads from {channelInfo.channel || channelInfo.channelTitle}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {channelVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channel;

// Made with Bob