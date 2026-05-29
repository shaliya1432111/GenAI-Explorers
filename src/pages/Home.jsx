import { useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import VideoCard from '../components/VideoCard';
import VideoListItem from '../components/VideoListItem';
import { categories, fetchGenAIVideos, searchVideos, fetch100PlusVideos } from '../services/youtubeApi';

// Loading Skeleton Component
const VideoCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-ai-card rounded-xl mb-3 aspect-video"></div>
    <div className="flex space-x-3">
      <div className="w-10 h-10 rounded-full bg-ai-card flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-ai-card rounded w-3/4"></div>
        <div className="h-3 bg-ai-card rounded w-1/2"></div>
        <div className="h-3 bg-ai-card rounded w-1/3"></div>
      </div>
    </div>
  </div>
);

const Home = ({ searchQuery = '' }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuickLink, setSelectedQuickLink] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showLearnersModal, setShowLearnersModal] = useState(false);
  const [showRatingsModal, setShowRatingsModal] = useState(false);
  const [highlightVideos, setHighlightVideos] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const videosRef = useRef(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls
    if (loadingRef.current) return;

    const loadVideos = async () => {
      loadingRef.current = true;
      setLoading(true);
      setError(null);
      setVideos([]);
      setNextPageToken(null);
      setHasMore(true);

      const selectedCategoryData = categories.find((category) => category.id === selectedCategory);
      const categoryQuery = selectedCategoryData?.query || '';
      const order =
        selectedQuickLink === 'latest'
          ? 'date'
          : selectedQuickLink === 'popular' || selectedQuickLink === 'trending'
            ? 'viewCount'
            : 'relevance';

      try {
        let result;
        let fetchedVideos = [];
        
        // If user is searching, use search function
        if (searchQuery.trim()) {
          console.log(`🔍 Searching for: "${searchQuery}"`);
          result = await searchVideos(searchQuery.trim(), 50);
          fetchedVideos = result?.videos || [];
          // For search, don't apply category filter - show all matching results
          setVideos(fetchedVideos);
        } else {
          // Otherwise, fetch 100+ videos for the selected category
          console.log(`🚀 Fetching 100+ videos for category: ${selectedCategory}`);
          result = await fetch100PlusVideos(selectedCategory, order);
          fetchedVideos = result?.videos || [];
          
          // Apply category filter only when not searching
          const filteredByCategory =
            selectedCategory === 'all'
              ? fetchedVideos
              : fetchedVideos.filter(
                  (video) =>
                    video?.category?.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
                    video?.title?.toLowerCase().includes(selectedCategoryData?.name.toLowerCase() || '')
                );

          setVideos(filteredByCategory);
        }
        setNextPageToken(result?.nextPageToken || null);
        setHasMore(!!result?.nextPageToken);
        
        const videoCount = searchQuery.trim() ? fetchedVideos.length : videos.length;
        console.log(`✅ Loaded ${videoCount} videos`);
      } catch (error) {
        console.error('Error loading homepage videos:', error);
        setError('Failed to load videos. Please try again.');
        setVideos([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        setInitialLoad(false);
        loadingRef.current = false;
      }
    };

    // Delay initial load to allow UI to render first
    if (initialLoad) {
      const timer = setTimeout(() => {
        loadVideos();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      loadVideos();
    }
  }, [searchQuery, selectedCategory, selectedQuickLink, initialLoad]);

  const loadMoreVideos = async () => {
    if (!nextPageToken || loadingMore || loadingRef.current) return;

    loadingRef.current = true;
    setLoadingMore(true);

    const selectedCategoryData = categories.find((category) => category.id === selectedCategory);
    const categoryQuery = selectedCategoryData?.query || '';
    const query = searchQuery.trim() || categoryQuery;
    const order =
      selectedQuickLink === 'latest'
        ? 'date'
        : selectedQuickLink === 'popular' || selectedQuickLink === 'trending'
          ? 'viewCount'
          : 'relevance';

    try {
      const result = searchQuery.trim()
        ? await searchVideos(searchQuery.trim(), 50, nextPageToken)
        : await fetchGenAIVideos(query, 50, order, nextPageToken);

      const fetchedVideos = result?.videos || [];
      
      const filteredByCategory =
        selectedCategory === 'all'
          ? fetchedVideos
          : fetchedVideos.filter(
              (video) =>
                video?.category?.toLowerCase().replace(/\s+/g, '-') === selectedCategory ||
                video?.title?.toLowerCase().includes(selectedCategoryData?.name.toLowerCase() || '')
            );

      setVideos((prev) => [...prev, ...filteredByCategory]);
      setNextPageToken(result?.nextPageToken || null);
      setHasMore(!!result?.nextPageToken);
    } catch (error) {
      console.error('Error loading more videos:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      loadingRef.current = false;
    }
  };

  const displayVideos = useMemo(() => [...videos], [videos]);

  const handleQuickLinkSelect = (filter) => {
    setSelectedQuickLink(selectedQuickLink === filter ? null : filter);
  };

  // Handle Total Videos card click - scroll to videos and highlight
  const handleTotalVideosClick = () => {
    if (videosRef.current) {
      videosRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setHighlightVideos(true);
      setTimeout(() => setHighlightVideos(false), 2000);
    }
  };

  // Handle Active Learners card click - open modal
  const handleLearnersClick = () => {
    setShowLearnersModal(true);
  };

  // Handle Avg Rating card click - open modal
  const handleRatingClick = () => {
    setShowRatingsModal(true);
  };

  // Dummy learner statistics
  const learnerStats = {
    totalUsers: '12,547',
    activeToday: '3,842',
    topCategory: 'Machine Learning',
    completionRate: '87%'
  };

  // Dummy reviews data
  const reviews = [
    { id: 1, name: 'Sarah Chen', rating: 5, comment: 'Amazing content! The GenAI tutorials are top-notch.', date: '2 days ago', avatar: '👩‍💻' },
    { id: 2, name: 'Alex Kumar', rating: 5, comment: 'Best platform for learning AI. Highly recommended!', date: '5 days ago', avatar: '👨‍🎓' },
    { id: 3, name: 'Emily Rodriguez', rating: 4, comment: 'Great explanations and practical examples.', date: '1 week ago', avatar: '👩‍🔬' },
    { id: 4, name: 'Michael Zhang', rating: 5, comment: 'The AI Agents course changed my career path!', date: '2 weeks ago', avatar: '👨‍💼' },
    { id: 5, name: 'Lisa Thompson', rating: 5, comment: 'Excellent quality and well-structured content.', date: '3 weeks ago', avatar: '👩‍🎨' }
  ];

  return (
    <div className="flex pt-16">
      {/* Sidebar */}
      <Sidebar 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        selectedQuickLink={selectedQuickLink}
        onQuickLinkSelect={handleQuickLinkSelect}
      />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 relative">
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-ai-blue via-ai-purple to-ai-pink bg-clip-text text-transparent mb-2">
                  {selectedCategory === 'all'
                    ? 'Explore AI Learning Content'
                    : `${categories.find((category) => category.id === selectedCategory)?.name || 'Category'} Tutorials`}
                </h1>
                <p className="text-ai-gray">
                  Professional tutorials, courses, and learning resources for AI enthusiasts
                </p>
              </div>
              
              {/* View Toggle */}
              <div className="hidden md:flex items-center space-x-2 bg-ai-card rounded-lg p-1 border border-ai-blue/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white shadow-ai-glow'
                      : 'text-ai-gray hover:text-white'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white shadow-ai-glow'
                      : 'text-ai-gray hover:text-white'
                  }`}
                >
                  List
                </button>
              </div>
            </div>

            {/* Stats Bar - Interactive Cards */}
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Total Videos Card */}
              <button
                onClick={handleTotalVideosClick}
                className="flex items-center space-x-2 bg-ai-card px-4 py-2 rounded-lg border border-ai-blue/20 hover:border-ai-blue hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">📊</span>
                <div className="text-left">
                  <p className="text-xs text-ai-gray group-hover:text-ai-blue transition-colors">Total Videos</p>
                  <p className="text-sm font-bold text-white">{displayVideos.length}</p>
                </div>
              </button>
              
              {/* Active Learners Card */}
              <button
                onClick={handleLearnersClick}
                className="flex items-center space-x-2 bg-ai-card px-4 py-2 rounded-lg border border-ai-blue/20 hover:border-ai-purple hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">👥</span>
                <div className="text-left">
                  <p className="text-xs text-ai-gray group-hover:text-ai-purple transition-colors">Active Learners</p>
                  <p className="text-sm font-bold text-white">12.5K+</p>
                </div>
              </button>
              
              {/* Avg Rating Card */}
              <button
                onClick={handleRatingClick}
                className="flex items-center space-x-2 bg-ai-card px-4 py-2 rounded-lg border border-ai-blue/20 hover:border-ai-pink hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">⭐</span>
                <div className="text-left">
                  <p className="text-xs text-ai-gray group-hover:text-ai-pink transition-colors">Avg Rating</p>
                  <p className="text-sm font-bold text-white">4.8/5</p>
                </div>
              </button>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleQuickLinkSelect('trending')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedQuickLink === 'trending'
                    ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white shadow-ai-glow'
                    : 'bg-ai-card border border-ai-blue/30 text-ai-gray hover:text-white hover:border-ai-blue'
                }`}
              >
                🔥 Trending
              </button>
              <button 
                onClick={() => handleQuickLinkSelect('latest')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedQuickLink === 'latest'
                    ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white shadow-ai-glow'
                    : 'bg-ai-card border border-ai-blue/30 text-ai-gray hover:text-white hover:border-ai-blue'
                }`}
              >
                🆕 Latest
              </button>
              <button 
                onClick={() => handleQuickLinkSelect('popular')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedQuickLink === 'popular'
                    ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white shadow-ai-glow'
                    : 'bg-ai-card border border-ai-blue/30 text-ai-gray hover:text-white hover:border-ai-blue'
                }`}
              >
                ⭐ Most Popular
              </button>
            </div>
          </div>

          {/* Video Display - Grid or List */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
              <p className="text-ai-gray mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan rounded-full text-white font-semibold hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div>
              <div className="flex items-center justify-center py-8 mb-6">
                <div className="w-14 h-14 border-4 border-ai-blue/30 border-t-ai-cyan rounded-full animate-spin"></div>
              </div>
              {/* Loading Skeletons */}
              <div className={viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
              }>
                {[...Array(12)].map((_, i) => (
                  <VideoCardSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : displayVideos && displayVideos.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                <div
                  ref={videosRef}
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500 ${
                    highlightVideos ? 'ring-4 ring-ai-blue/50 rounded-lg p-4 bg-ai-blue/5' : ''
                  }`}
                >
                  {displayVideos.map((video) => (
                    <div
                      key={video.id}
                      className={`transition-all duration-500 ${
                        highlightVideos ? 'scale-105 shadow-ai-glow' : ''
                      }`}
                    >
                      <VideoCard video={video} />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  ref={videosRef}
                  className={`space-y-4 transition-all duration-500 ${
                    highlightVideos ? 'ring-4 ring-ai-blue/50 rounded-lg p-4 bg-ai-blue/5' : ''
                  }`}
                >
                  {displayVideos.map((video) => (
                    <div
                      key={video.id}
                      className={`transition-all duration-500 ${
                        highlightVideos ? 'scale-105 shadow-ai-glow' : ''
                      }`}
                    >
                      <VideoListItem video={video} />
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <button 
                    onClick={loadMoreVideos}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full text-white font-semibold hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Videos</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No videos found</h3>
              <p className="text-ai-gray">
                {searchQuery.trim() !== '' 
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'Try selecting a different category'
                }
              </p>
            </div>
          )}
        </div>

        {/* Active Learners Modal */}
        {showLearnersModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowLearnersModal(false)}>
            <div className="bg-ai-card border border-ai-purple/30 rounded-2xl max-w-xl w-full p-6 shadow-2xl transform animate-slideUp" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-ai-purple to-ai-pink bg-clip-text text-transparent flex items-center space-x-2">
                  <span className="text-3xl">👥</span>
                  <span>Active Learners Statistics</span>
                </h2>
                <button
                  onClick={() => setShowLearnersModal(false)}
                  className="text-ai-gray hover:text-white transition-colors p-2 hover:bg-ai-purple/20 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gradient-to-br from-ai-blue/20 to-ai-cyan/20 border border-ai-blue/30 rounded-lg p-4">
                  <div className="text-3xl mb-1">👤</div>
                  <p className="text-ai-gray text-xs mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-white">{learnerStats.totalUsers}</p>
                </div>
                
                <div className="bg-gradient-to-br from-ai-purple/20 to-ai-pink/20 border border-ai-purple/30 rounded-lg p-4">
                  <div className="text-3xl mb-1">🔥</div>
                  <p className="text-ai-gray text-xs mb-1">Active Today</p>
                  <p className="text-2xl font-bold text-white">{learnerStats.activeToday}</p>
                </div>
                
                <div className="bg-gradient-to-br from-ai-cyan/20 to-ai-blue/20 border border-ai-cyan/30 rounded-lg p-4">
                  <div className="text-3xl mb-1">📚</div>
                  <p className="text-ai-gray text-xs mb-1">Top Category</p>
                  <p className="text-lg font-bold text-white">{learnerStats.topCategory}</p>
                </div>
                
                <div className="bg-gradient-to-br from-ai-pink/20 to-ai-purple/20 border border-ai-pink/30 rounded-lg p-4">
                  <div className="text-3xl mb-1">✅</div>
                  <p className="text-ai-gray text-xs mb-1">Completion Rate</p>
                  <p className="text-2xl font-bold text-white">{learnerStats.completionRate}</p>
                </div>
              </div>

              {/* Activity Chart Placeholder */}
              <div className="bg-gradient-to-r from-ai-blue/10 to-ai-purple/10 border border-ai-blue/20 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center space-x-2 text-sm">
                  <span>📈</span>
                  <span>Weekly Activity</span>
                </h3>
                <div className="flex items-end justify-between h-24 space-x-1">
                  {[65, 78, 85, 92, 88, 95, 100].map((height, index) => (
                    <div key={index} className="flex-1 bg-gradient-to-t from-ai-blue to-ai-cyan rounded-t transition-all duration-500 hover:from-ai-purple hover:to-ai-pink" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-ai-gray">
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Ratings & Reviews Modal */}
        {showRatingsModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setShowRatingsModal(false)}>
            <div className="bg-ai-card border border-ai-pink/30 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl transform animate-slideUp" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-ai-card pb-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-ai-pink to-ai-purple bg-clip-text text-transparent flex items-center space-x-2">
                  <span className="text-3xl">⭐</span>
                  <span>User Reviews & Ratings</span>
                </h2>
                <button
                  onClick={() => setShowRatingsModal(false)}
                  className="text-ai-gray hover:text-white transition-colors p-2 hover:bg-ai-pink/20 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Overall Rating */}
              <div className="bg-gradient-to-r from-ai-pink/20 to-ai-purple/20 border border-ai-pink/30 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-ai-gray text-sm mb-2">Overall Rating</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-5xl font-bold text-white">4.8</span>
                      <div>
                        <div className="flex space-x-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-2xl animate-pulse" style={{ animationDelay: `${star * 100}ms` }}>⭐</span>
                          ))}
                        </div>
                        <p className="text-ai-gray text-sm">Based on 1,247 reviews</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-6xl animate-bounce">🎉</div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div
                    key={review.id}
                    className="bg-gradient-to-r from-ai-card to-ai-card/50 border border-ai-blue/20 rounded-xl p-6 hover:border-ai-pink/50 transition-all duration-300 transform hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-4xl">{review.avatar}</div>
                        <div>
                          <h4 className="text-white font-semibold">{review.name}</h4>
                          <p className="text-ai-gray text-sm">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-xl">⭐</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-ai-gray leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Button */}
              <button
                onClick={() => {
                  setShowRatingsModal(false);
                  alert('✍️ Review form coming soon! You can rate videos individually on the video player page.');
                }}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-ai-pink to-ai-purple rounded-xl text-white font-semibold hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>✍️</span>
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-20 border-t border-ai-blue/20 bg-ai-card/50 backdrop-blur-sm">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center space-x-2">
                  <span className="text-2xl">🚀</span>
                  <span>GenAIExplorers</span>
                </h3>
                <p className="text-ai-gray text-sm">
                  Your ultimate destination for learning Generative AI, Machine Learning, and cutting-edge AI technologies.
                </p>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Explore</h4>
                <ul className="space-y-2 text-sm text-ai-gray">
                  <li className="hover:text-ai-blue cursor-pointer transition-colors">Trending</li>
                  <li className="hover:text-ai-blue cursor-pointer transition-colors">Categories</li>
                  <li className="hover:text-ai-blue cursor-pointer transition-colors">Playlists</li>
                  <li className="hover:text-ai-blue cursor-pointer transition-colors">Channels</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-ai-gray">
                  <li className="hover:text-ai-blue cursor-pointer transition-colors">Documentation</li>
                  <li className="hover:text-ai-blue cursor-pointer transition-colors">Tutorials</li>
                  <li className="hover:text-ai-blue cursor-pointer transition-colors">Blog</li>
                  <li className="hover:text-ai-blue cursor-pointer transition-colors">Community</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Connect</h4>
                <div className="flex space-x-3">
                  <button className="w-10 h-10 bg-ai-card border border-ai-blue/30 rounded-full flex items-center justify-center text-ai-blue hover:bg-ai-blue hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-ai-card border border-ai-blue/30 rounded-full flex items-center justify-center text-ai-blue hover:bg-ai-blue hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="w-10 h-10 bg-ai-card border border-ai-blue/30 rounded-full flex items-center justify-center text-ai-blue hover:bg-ai-blue hover:text-white transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-ai-blue/20 text-center text-sm text-ai-gray">
              <p>© 2024 GenAIExplorers. Made with 💙 by Bob. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;

// Made with Bob
