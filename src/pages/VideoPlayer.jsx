import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Loader2, Sparkles } from 'lucide-react';
import { fetchVideoDetails, fetchGenAIVideos, formatViewCount, formatPublishedDate } from '../services/youtubeApi';
import VideoCard from '../components/VideoCard';
import AIAssistant from '../components/AIAssistant';
import { trackVideoWatch } from '../services/analyticsService';
import { startVideoTracking, stopVideoTracking } from '../services/watchTrackingService';
import { saveToHistory } from '../services/historyService';
import { useAuth } from '../contexts/AuthContext';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const loadVideoData = async () => {
      setLoading(true);
      try {
        const videoData = await fetchVideoDetails(videoId);
        setVideo(videoData);
        setLikeCount(videoData.likeCount || 0);
        
        // Load saved preferences from localStorage
        const savedPrefs = JSON.parse(localStorage.getItem(`video_${videoId}`) || '{}');
        setIsSubscribed(savedPrefs.subscribed || false);
        setIsLiked(savedPrefs.liked || false);
        setIsDisliked(savedPrefs.disliked || false);

        // Track video watch in analytics
        trackVideoWatch({
          videoId: videoData.videoId,
          title: videoData.title,
          channelTitle: videoData.channelTitle,
          category: videoData.category || 'General AI',
          thumbnail: videoData.thumbnail,
          duration: videoData.duration
        });

        // Start tracking watch time
        startVideoTracking(videoData.videoId, {
          title: videoData.title,
          channelTitle: videoData.channelTitle,
          category: videoData.category || 'General AI'
        });

        // Save to watch history
        if (currentUser) {
          saveToHistory(currentUser.uid, {
            videoId: videoData.videoId,
            title: videoData.title,
            thumbnail: videoData.thumbnail,
            duration: videoData.duration,
            channelTitle: videoData.channelTitle,
            viewCount: videoData.viewCount,
            category: videoData.category || 'General AI',
            progress: 0
          });
        }

        // Fetch related videos based on video title and category
        const searchQuery = videoData?.title || videoData?.category || 'artificial intelligence tutorial';
        const result = await fetchGenAIVideos(searchQuery, 20, 'relevance');
        
        // Filter out current video and limit to 15 related videos
        const filtered = (result.videos || [])
          .filter((item) => item.videoId !== videoId)
          .slice(0, 15);
        
        setRelatedVideos(filtered);
      } catch (error) {
        console.error('Error loading video:', error);
        setVideo(null);
        setRelatedVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideoData();
    window.scrollTo(0, 0);

    // Cleanup: Stop tracking when component unmounts or video changes
    return () => {
      stopVideoTracking();
    };
  }, [videoId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ai-darker pt-16 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-ai-blue mx-auto mb-4" />
          <p className="text-ai-gray">Loading video...</p>
        </div>
      </div>
    );
  }

  // Handle Subscribe
  const handleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    const prefs = JSON.parse(localStorage.getItem(`video_${videoId}`) || '{}');
    prefs.subscribed = !isSubscribed;
    localStorage.setItem(`video_${videoId}`, JSON.stringify(prefs));
    
    if (!isSubscribed) {
      alert(`✅ Subscribed to ${video.channelTitle}!`);
    } else {
      alert(`Unsubscribed from ${video.channelTitle}`);
    }
  };

  // Handle Like
  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    
    if (newLiked) {
      setIsDisliked(false);
      setLikeCount(prev => prev + 1);
    } else {
      setLikeCount(prev => Math.max(0, prev - 1));
    }
    
    const prefs = JSON.parse(localStorage.getItem(`video_${videoId}`) || '{}');
    prefs.liked = newLiked;
    prefs.disliked = false;
    localStorage.setItem(`video_${videoId}`, JSON.stringify(prefs));
  };

  // Handle Dislike
  const handleDislike = () => {
    const newDisliked = !isDisliked;
    setIsDisliked(newDisliked);
    
    if (newDisliked) {
      if (isLiked) {
        setLikeCount(prev => Math.max(0, prev - 1));
      }
      setIsLiked(false);
    }
    
    const prefs = JSON.parse(localStorage.getItem(`video_${videoId}`) || '{}');
    prefs.disliked = newDisliked;
    prefs.liked = false;
    localStorage.setItem(`video_${videoId}`, JSON.stringify(prefs));
  };

  // Handle Share
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/video/${videoId}`;
    const shareText = `Check out this video: ${video.title}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  // Copy to clipboard helper
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Link copied to clipboard!');
    }).catch(() => {
      alert('❌ Failed to copy link');
    });
  };

  // Handle Download
  const handleDownload = () => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(youtubeUrl, '_blank');
    alert('Opening YouTube page. You can use browser extensions or online tools to download the video.');
  };

  if (!video) {
    return (
      <div className="min-h-screen bg-ai-darker pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-2">Video not found</p>
          <button
            onClick={() => navigate('/home')}
            className="text-ai-blue hover:underline"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ai-darker pt-16">
      <div className="max-w-[1800px] mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Video Section */}
          <div className="flex-1">
            {/* Video Player with Auto-play */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4 shadow-2xl border border-ai-blue/20">
              <iframe
                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Video Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
              {video.title}
            </h1>

            {/* Channel Info and Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ai-blue to-ai-purple flex items-center justify-center text-white font-semibold shadow-ai-glow">
                  {(video.channelTitle || 'G').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium">{video.channelTitle}</p>
                  <p className="text-ai-gray text-sm">
                    {video.viewCount ? formatViewCount(video.viewCount) : '0'} views
                  </p>
                </div>
                <button
                  onClick={handleSubscribe}
                  className={`ml-4 px-6 py-3 rounded-full font-semibold hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 ${
                    isSubscribed
                      ? 'bg-ai-card border-2 border-ai-blue text-white'
                      : 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white'
                  }`}
                >
                  {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-ai-card border border-ai-blue/20 rounded-full overflow-hidden">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 hover:bg-ai-blue/10 transition-all border-r border-ai-blue/20 ${
                      isLiked ? 'text-ai-blue' : 'text-white'
                    }`}
                  >
                    <ThumbsUp size={20} className={isLiked ? 'fill-current' : ''} />
                    <span>{formatViewCount(likeCount)}</span>
                  </button>
                  <button
                    onClick={handleDislike}
                    className={`px-4 py-2 hover:bg-ai-blue/10 transition-all ${
                      isDisliked ? 'text-red-400' : 'text-white'
                    }`}
                  >
                    <ThumbsDown size={20} className={isDisliked ? 'fill-current' : ''} />
                  </button>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-ai-card border border-ai-blue/20 rounded-full hover:bg-ai-blue/10 hover:border-ai-cyan transition-all text-white"
                >
                  <Share2 size={20} />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-ai-card border border-ai-blue/20 rounded-full hover:bg-ai-blue/10 hover:border-ai-cyan transition-all text-white"
                >
                  <Download size={20} />
                  <span className="hidden sm:inline">Download</span>
                </button>
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-ai-blue to-ai-purple border border-ai-blue/20 rounded-full hover:shadow-ai-glow transition-all duration-300 text-white font-medium"
                >
                  <Sparkles size={20} />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
                <button className="p-2 bg-ai-card border border-ai-blue/20 rounded-full hover:bg-ai-blue/10 transition-colors text-white">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>

            {/* Video Description */}
            <div className="bg-ai-card border border-ai-blue/20 rounded-xl p-6">
              <div className="flex flex-wrap items-center gap-4 mb-3 text-sm font-medium text-ai-gray">
                <span>{video.viewCount ? formatViewCount(video.viewCount) : '0'} views</span>
                <span>{formatPublishedDate(video.publishedAt)}</span>
                <span className="px-3 py-1 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full text-xs font-bold text-white">
                  {video.category}
                </span>
              </div>
              <div className={`text-sm text-white whitespace-pre-wrap ${showFullDescription ? '' : 'line-clamp-4'}`}>
                {video.description || 'No description available'}
              </div>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-white font-medium text-sm mt-3 hover:text-ai-blue transition-colors"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            </div>

            {/* Comments Section */}
            <div className="mt-6 bg-ai-card border border-ai-blue/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                {video.commentCount ? formatViewCount(video.commentCount) : '0'} Comments
              </h2>
              <div className="text-ai-gray text-center py-8">
                Comments section coming soon...
              </div>
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:w-96">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <span>🎬</span>
              <span>Related Videos</span>
            </h2>
            
            {relatedVideos.length > 0 ? (
              <div className="space-y-3">
                {relatedVideos.map((relatedVideo) => (
                  <div
                    key={relatedVideo.videoId}
                    onClick={() => navigate(`/video/${relatedVideo.videoId}`)}
                    className="bg-ai-card border border-ai-blue/20 rounded-lg overflow-hidden hover:border-ai-blue/50 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="flex gap-3 p-2">
                      {/* Thumbnail */}
                      <div className="relative w-40 flex-shrink-0">
                        <div className="aspect-video rounded-lg overflow-hidden">
                          <img
                            src={relatedVideo.thumbnail || `https://img.youtube.com/vi/${relatedVideo.videoId}/hqdefault.jpg`}
                            alt={relatedVideo.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = `https://img.youtube.com/vi/${relatedVideo.videoId}/mqdefault.jpg`;
                            }}
                          />
                          {/* Duration Badge */}
                          <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs font-semibold text-white">
                            {relatedVideo.duration || 'Live'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Video Info */}
                      <div className="flex-1 min-w-0 py-1">
                        <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1 group-hover:text-ai-blue transition-colors">
                          {relatedVideo.title}
                        </h3>
                        <p className="text-ai-gray text-xs mb-1">{relatedVideo.channelTitle}</p>
                        <div className="flex items-center space-x-2 text-ai-gray text-xs">
                          <span>{relatedVideo.views || '0'} views</span>
                          <span>•</span>
                          <span>{relatedVideo.timestamp || 'Today'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-ai-gray">
                <p>No related videos found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        videoContext={video}
      />
    </div>
  );
};

export default VideoPlayer;

// Made with Bob
