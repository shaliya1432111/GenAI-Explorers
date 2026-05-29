import { useNavigate } from 'react-router-dom';

const VideoListItem = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Use videoId property which is consistent across the app
    const videoId = video.videoId || video.id;
    navigate(`/video/${videoId}`);
  };

  // Generate YouTube thumbnail URL if not provided or using placeholder
  const getThumbnail = () => {
    const videoId = video.videoId || video.id;
    
    // If thumbnail exists and is not a placeholder, use it
    if (video.thumbnail && !video.thumbnail.includes('placeholder') && !video.thumbnail.includes('unsplash')) {
      return video.thumbnail;
    }
    
    // Otherwise, use YouTube's thumbnail API
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <div onClick={handleClick} className="group cursor-pointer bg-ai-card border border-ai-blue/20 rounded-xl p-4 hover:border-ai-blue/50 transition-all duration-300">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-64 overflow-hidden rounded-lg">
          {/* Glow Effect on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-ai-blue/20 via-ai-purple/20 to-ai-pink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
          
          {/* Thumbnail Image */}
          <div className="relative aspect-video bg-ai-darker overflow-hidden">
            <img
              src={getThumbnail()}
              alt={video.title}
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                // Fallback to medium quality if high quality fails
                const videoId = video.videoId || video.id;
                e.target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
              }}
            />
            
            {/* Duration Badge */}
            <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white">
              {video.duration || 'Live'}
            </div>

            {/* Hover Play Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <div className="bg-ai-blue/90 backdrop-blur-sm rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300 shadow-ai-glow">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Category Badge */}
            <div className="absolute top-2 left-2 z-20">
              <span className="px-2 py-1 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full text-xs font-bold text-white shadow-lg">
                {video.category}
              </span>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-ai-blue transition-colors duration-300">
            {video.title}
          </h3>

          {/* Stats */}
          <div className="flex items-center space-x-4 text-ai-gray text-sm mb-3">
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <span>{video.views || '0'} views</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
              <span>{video.timestamp || 'Today'}</span>
            </span>
          </div>

          {/* Channel Info */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ai-blue to-ai-purple flex items-center justify-center text-white font-bold text-sm group-hover:shadow-ai-glow transition-all duration-300">
              {(video.channel || video.channelTitle || 'G').charAt(0)}
            </div>
            <div>
              <p className="text-white font-medium hover:text-ai-blue transition-colors duration-200">
                {video.channel || video.channelTitle}
              </p>
            </div>
          </div>

          {/* Description Preview */}
          <p className="text-ai-gray text-sm line-clamp-2">
            {video.description || `Explore ${video.title} in this comprehensive GenAI tutorial.`}
          </p>
        </div>

        {/* More Options Button */}
        <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-ai-gray hover:text-white self-start">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>

      {/* Hover Effect Line */}
      <div className="h-0.5 w-0 bg-gradient-to-r from-ai-blue via-ai-purple to-ai-pink group-hover:w-full transition-all duration-500 mt-4 rounded-full"></div>
    </div>
  );
};

export default VideoListItem;

// Made with Bob