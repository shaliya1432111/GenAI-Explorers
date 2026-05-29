import axios from 'axios';
import { mockVideos, getVideosByCategory, getVideoById } from '../data/mockVideos';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';
const USE_MOCK_DATA = !API_KEY || API_KEY === 'YOUR_YOUTUBE_API_KEY_HERE' || API_KEY === 'demo_youtube_api_key_placeholder';

// Log the mode on initialization
if (USE_MOCK_DATA) {
  console.log('🎬 GenAI Explorers - Running in DEMO MODE with 100+ mock videos');
  console.log('💡 To use real YouTube videos, add your API key to .env file');
  console.log(`📊 Mock videos loaded: ${mockVideos.length}`);
} else {
  console.log('🎬 GenAI Explorers - Running with YouTube API');
  console.log('✅ API Key detected');
}

// Enhanced category-based search mapping with professional learning queries
export const categories = [
  { 
    id: 'all', 
    name: 'All', 
    icon: '🏠', 
    query: 'artificial intelligence tutorial course learning'
  },
  { 
    id: 'ai', 
    name: 'AI', 
    icon: '🤖', 
    query: 'artificial intelligence tutorial course explained learning'
  },
  { 
    id: 'chatgpt', 
    name: 'ChatGPT', 
    icon: '💬', 
    query: 'ChatGPT tutorial course guide how to use learning'
  },
  { 
    id: 'watsonx', 
    name: 'WatsonX', 
    icon: '🔷', 
    query: 'IBM WatsonX AI tutorial course enterprise learning'
  },
  { 
    id: 'ai-agents', 
    name: 'AI Agents', 
    icon: '🎯', 
    query: 'AI agents autonomous agents tutorial course learning'
  },
  { 
    id: 'prompt-engineering', 
    name: 'Prompt Engineering', 
    icon: '✨', 
    query: 'prompt engineering tutorial course guide learning'
  },
  { 
    id: 'machine-learning', 
    name: 'Machine Learning', 
    icon: '🧠', 
    query: 'machine learning tutorial course deep learning explained'
  },
  { 
    id: 'ai-coding', 
    name: 'AI Coding', 
    icon: '💻', 
    query: 'AI coding copilot tutorial course programming learning'
  },
  { 
    id: 'ai-automation', 
    name: 'AI Automation', 
    icon: '⚡', 
    query: 'AI automation workflow tutorial course guide learning'
  }
];

export const quickLinks = [
  { id: 'trending', name: 'Trending', icon: '🔥', filter: 'trending' },
  { id: 'latest', name: 'Latest', icon: '🆕', filter: 'latest' },
  { id: 'popular', name: 'Most Popular', icon: '⭐', filter: 'popular' }
];

export const subscriptions = [
  { id: 'openai', name: 'OpenAI', icon: '🤖', channel: 'OpenAI' },
  { id: 'ibm-tech', name: 'IBM Technology', icon: '🔷', channel: 'IBM Technology' },
  { id: 'google', name: 'Google', icon: '🧠', channel: 'Google' },
  { id: 'microsoft', name: 'Microsoft', icon: '💻', channel: 'Microsoft' },
  { id: 'hugging-face', name: 'Hugging Face', icon: '🤗', channel: 'Hugging Face' }
];

const parseDuration = (duration) => {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!matches) return '0:00';

  const hours = parseInt(matches[1] || 0, 10);
  const minutes = parseInt(matches[2] || 0, 10);
  const seconds = parseInt(matches[3] || 0, 10);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const deriveCategory = (text = '') => {
  const lowerText = text.toLowerCase();

  const category = categories.find(
    ({ id, name, query }) =>
      id !== 'all' &&
      (lowerText.includes(name.toLowerCase()) ||
        lowerText.includes(query.toLowerCase().split(' ')[0]))
  );

  return category?.name || 'AI';
};

const mapVideoItem = (item, detailsMap = {}) => {
  const detail = detailsMap[item.id?.videoId || item.id] || {};
  const snippet = item.snippet || {};
  const videoId = item.id?.videoId || item.id;

  // Use high quality thumbnails from YouTube API
  // Priority: maxres > high > medium > YouTube thumbnail API fallback
  const thumbnail =
    snippet.thumbnails?.maxres?.url ||
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.default?.url ||
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return {
    id: videoId,
    videoId: videoId,
    title: snippet.title,
    thumbnail,
    channel: snippet.channelTitle,
    channelTitle: snippet.channelTitle,
    publishedAt: snippet.publishedAt,
    timestamp: formatPublishedDate(snippet.publishedAt),
    description: snippet.description,
    duration: detail.duration ? parseDuration(detail.duration) : 'Live',
    viewCount: detail.viewCount || '0',
    views: formatViewCount(detail.viewCount || 0),
    likeCount: detail.likeCount || '0',
    commentCount: detail.commentCount || '0',
    category: deriveCategory(`${snippet.title} ${snippet.description}`)
  };
};

/**
 * Fetch GenAI related videos from YouTube with enhanced quality filters
 * @param {string} query - Search query (optional, defaults to GenAI topics)
 * @param {number} maxResults - Maximum number of results to return (default 50, max 50 per request)
 * @param {string} order - Sort order (relevance, date, viewCount, rating)
 * @param {string} pageToken - Page token for pagination
 * @returns {Promise<Object>} Object with videos array and nextPageToken
 */
export const fetchGenAIVideos = async (query = '', maxResults = 50, order = 'relevance', pageToken = '') => {
  // Use mock data if no valid API key
  if (USE_MOCK_DATA) {
    console.log('📦 Using mock data (no valid YouTube API key)');
    const shuffled = [...mockVideos].sort(() => Math.random() - 0.5);
    const videos = shuffled.slice(0, Math.min(maxResults, mockVideos.length));
    return {
      videos,
      nextPageToken: null,
      totalResults: mockVideos.length
    };
  }

  try {
    const searchQuery = query || 'artificial intelligence tutorial course learning';

    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        q: searchQuery,
        type: 'video',
        maxResults: Math.min(maxResults, 50), // YouTube API max is 50 per request
        key: API_KEY,
        order,
        // Enhanced quality filters
        videoEmbeddable: 'true',
        videoDefinition: 'high',
        safeSearch: 'strict',
        relevanceLanguage: 'en',
        videoDuration: 'medium', // Exclude shorts (< 4 min) and very long videos
        pageToken: pageToken || undefined
      }
    });

    const videoIds = response.data.items.map((item) => item.id.videoId).filter(Boolean);

    let detailsMap = {};
    if (videoIds.length > 0) {
      const detailsResponse = await axios.get(`${BASE_URL}/videos`, {
        params: {
          part: 'contentDetails,statistics',
          id: videoIds.join(','),
          key: API_KEY
        }
      });

      detailsMap = detailsResponse.data.items.reduce((acc, item) => {
        acc[item.id] = {
          duration: item.contentDetails?.duration,
          viewCount: item.statistics?.viewCount,
          likeCount: item.statistics?.likeCount,
          commentCount: item.statistics?.commentCount
        };
        return acc;
      }, {});
    }

    const videos = response.data.items.map((item) => mapVideoItem(item, detailsMap));

    return {
      videos,
      nextPageToken: response.data.nextPageToken || null,
      totalResults: response.data.pageInfo?.totalResults || 0
    };
  } catch (error) {
    console.error('Error fetching GenAI videos:', error);
    console.log('📦 Falling back to mock data');
    return {
      videos: mockVideos.slice(0, maxResults),
      nextPageToken: null,
      totalResults: mockVideos.length
    };
  }
};

/**
 * Fetch 100+ videos by making multiple API calls with diverse queries
 * This ensures we get a rich variety of AI learning content
 * @param {string} categoryId - Category ID to fetch videos for
 * @param {string} order - Sort order (relevance, date, viewCount, rating)
 * @returns {Promise<Object>} Object with videos array (100+)
 */
export const fetch100PlusVideos = async (categoryId = 'all', order = 'relevance') => {
  // Use mock data if no valid API key
  if (USE_MOCK_DATA) {
    console.log(`📦 Using mock data for category: ${categoryId}`);
    const videos = getVideosByCategory(categoryId);
    console.log(`✅ Loaded ${videos.length} mock videos`);
    return {
      videos,
      totalResults: videos.length
    };
  }

  try {
    const category = categories.find(cat => cat.id === categoryId) || categories[0];
    
    // Expanded diverse search queries to get 100+ unique videos
    const searchQueries = [
      category.query,
      `${category.name} tutorial for beginners 2024`,
      `${category.name} advanced course complete`,
      `${category.name} explained step by step`,
      `${category.name} crash course`,
      `${category.name} fundamentals`,
      `learn ${category.name} programming`,
      `${category.name} projects tutorial`
    ];

    const allVideos = [];
    const seenVideoIds = new Set();
    let queriesProcessed = 0;

    // Fetch videos from multiple queries to reach 100+
    for (const query of searchQueries) {
      // Stop if we have 120+ videos (buffer for filtering)
      if (allVideos.length >= 120) {
        break;
      }

      try {
        console.log(`🔍 Fetching videos for: "${query}" (${allVideos.length} videos so far)`);
        const result = await fetchGenAIVideos(query, 50, order);
        
        // Filter out duplicates
        const uniqueVideos = result.videos.filter(video => {
          if (seenVideoIds.has(video.id)) {
            return false;
          }
          seenVideoIds.add(video.id);
          return true;
        });

        allVideos.push(...uniqueVideos);
        queriesProcessed++;

        console.log(`✓ Added ${uniqueVideos.length} unique videos (Total: ${allVideos.length})`);

        // Small delay to avoid rate limiting (only if we need more videos)
        if (allVideos.length < 100 && queriesProcessed < searchQueries.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        console.error(`❌ Error fetching videos for query "${query}":`, error);
        // Continue with next query instead of failing completely
        continue;
      }
    }

    // If we still don't have enough videos, try pagination on the first query
    if (allVideos.length < 100) {
      console.log(`⚠️ Only ${allVideos.length} videos found, attempting pagination...`);
      try {
        const result = await fetchGenAIVideos(category.query, 50, order);
        if (result.nextPageToken) {
          const moreResult = await fetchGenAIVideos(category.query, 50, order, result.nextPageToken);
          const uniqueVideos = moreResult.videos.filter(video => {
            if (seenVideoIds.has(video.id)) {
              return false;
            }
            seenVideoIds.add(video.id);
            return true;
          });
          allVideos.push(...uniqueVideos);
          console.log(`✓ Added ${uniqueVideos.length} more videos via pagination (Total: ${allVideos.length})`);
        }
      } catch (error) {
        console.error('Error during pagination:', error);
      }
    }

    console.log(`✅ Successfully fetched ${allVideos.length} unique videos for category: ${category.name}`);

    return {
      videos: allVideos.slice(0, 150), // Cap at 150 to avoid overwhelming the UI
      totalResults: allVideos.length
    };
  } catch (error) {
    console.error('Error in fetch100PlusVideos:', error);
    console.log('📦 Falling back to mock data...');
    const videos = getVideosByCategory(categoryId);
    return {
      videos,
      totalResults: videos.length
    };
  }
};

/**
 * Fetch video details by ID
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<Object>} Video details object
 */
export const fetchVideoDetails = async (videoId) => {
  // Use mock data if no valid API key
  if (USE_MOCK_DATA) {
    console.log(`📦 Using mock data for video: ${videoId}`);
    const video = getVideoById(videoId);
    if (video) {
      console.log(`✅ Found mock video: ${video.title}`);
      return video;
    }
    console.warn(`⚠️ Video not found in mock data: ${videoId}`);
    return null;
  }

  try {
    if (!videoId) {
      console.error('No videoId provided to fetchVideoDetails');
      return null;
    }

    const response = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: API_KEY
      }
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.error('No video found with ID:', videoId);
      return null;
    }

    const video = response.data.items[0];
    
    // Use high quality thumbnails from YouTube API
    const thumbnail =
      video.snippet.thumbnails?.maxres?.url ||
      video.snippet.thumbnails?.high?.url ||
      video.snippet.thumbnails?.medium?.url ||
      video.snippet.thumbnails?.default?.url ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return {
      id: videoId,
      videoId: videoId,
      title: video.snippet.title,
      description: video.snippet.description,
      channel: video.snippet.channelTitle,
      channelTitle: video.snippet.channelTitle,
      publishedAt: video.snippet.publishedAt,
      thumbnail,
      viewCount: video.statistics?.viewCount || '0',
      views: formatViewCount(video.statistics?.viewCount || 0),
      likeCount: video.statistics?.likeCount || '0',
      commentCount: video.statistics?.commentCount || '0',
      duration: parseDuration(video.contentDetails.duration),
      timestamp: formatPublishedDate(video.snippet.publishedAt),
      category: deriveCategory(`${video.snippet.title} ${video.snippet.description}`)
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    console.error('VideoId:', videoId);
    console.error('Error details:', error.response?.data || error.message);
    console.log('📦 Falling back to mock data...');
    return getVideoById(videoId);
  }
};

/**
 * Search videos with custom query - enhanced for educational content
 * @param {string} searchQuery - User's search query
 * @param {number} maxResults - Maximum number of results
 * @param {string} pageToken - Page token for pagination
 * @returns {Promise<Object>} Object with videos array and nextPageToken
 */
export const searchVideos = async (searchQuery, maxResults = 50, pageToken = '') => {
  // Enhance query with educational keywords for better results
  const enhancedQuery = `${searchQuery} tutorial course guide learning explained`;
  return fetchGenAIVideos(enhancedQuery, maxResults, 'relevance', pageToken);
};

/**
 * Fallback videos when API is not available or fails
 * @returns {Array} Array of fallback video objects
 */
const getFallbackVideos = () => {
  return [
    {
      id: 'demo1',
      videoId: 'demo1',
      title: 'Introduction to Generative AI - Complete Guide',
      thumbnail: 'https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=GenAI+Intro',
      channelTitle: 'AI Learning Hub',
      publishedAt: new Date().toISOString(),
      description: 'Learn the fundamentals of Generative AI and how it\'s transforming technology.',
      duration: '45:30',
      viewCount: '125000',
      views: '125K',
      likeCount: '5200',
      commentCount: '340',
      timestamp: 'Today',
      category: 'AI'
    },
    {
      id: 'demo2',
      videoId: 'demo2',
      title: 'ChatGPT Tutorial: From Beginner to Advanced',
      thumbnail: 'https://via.placeholder.com/1280x720/2a2a2a/ffffff?text=ChatGPT+Tutorial',
      channelTitle: 'Tech Explained',
      publishedAt: new Date().toISOString(),
      description: 'Master ChatGPT with this comprehensive tutorial covering all features.',
      duration: '1:15:20',
      viewCount: '250000',
      views: '250K',
      likeCount: '8900',
      commentCount: '520',
      timestamp: 'Yesterday',
      category: 'ChatGPT'
    },
    {
      id: 'demo3',
      videoId: 'demo3',
      title: 'Machine Learning Complete Course - 2024',
      thumbnail: 'https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=ML+Course',
      channelTitle: 'AI Academy',
      publishedAt: new Date().toISOString(),
      description: 'Complete machine learning course from basics to advanced concepts.',
      duration: '3:45:10',
      viewCount: '580000',
      views: '580K',
      likeCount: '15200',
      commentCount: '890',
      timestamp: '2 days ago',
      category: 'Machine Learning'
    }
  ];
};

/**
 * Format view count for display
 * @param {string|number} count - View count
 * @returns {string} Formatted view count
 */
export const formatViewCount = (count) => {
  const num = parseInt(count);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Format published date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatPublishedDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)} months ago`;
  } else {
    return `${Math.floor(diffDays / 365)} years ago`;
  }
};

// Made with Bob
