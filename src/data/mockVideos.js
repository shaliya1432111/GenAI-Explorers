// Mock Video Data for GenAI Explorers - 100+ Working Videos
// All videos use real, embeddable YouTube video IDs for demo purposes

const generateMockVideos = () => {
  // Real YouTube video IDs for AI-related content (all embeddable)
  const realAIVideoIds = [
    'aircAruvnKk', // Neural Networks Explained
    'IHZwWFHWa-w', // Machine Learning Basics
    'ukzFI9rgwfU', // Deep Learning Crash Course
    'JN6eMHWpHiQ', // ChatGPT Tutorial
    'bSvTVREwSNw', // AI Agents Explained
    'F6Ux_N2kQaA', // Prompt Engineering
    'kCc8FmEb1nY', // Introduction to AI
    'X2vAabgKiuM', // TensorFlow Tutorial
    'tPYj3fFJGjk', // PyTorch Basics
    'VyWAvY2CF9c', // AI Ethics
    'ykkL4773sCQ', // Computer Vision
    'QghjaS0WQQU', // Natural Language Processing
    'ZX2Hyu5WoFg', // Reinforcement Learning
    'Gv9_4yMHFhI', // Generative AI
    'zxQyTK8quyY', // AI in Healthcare
  ];

  const categories = [
    { id: 'ai', name: 'AI', icon: '🤖' },
    { id: 'chatgpt', name: 'ChatGPT', icon: '💬' },
    { id: 'watsonx', name: 'WatsonX', icon: '🔷' },
    { id: 'ai-agents', name: 'AI Agents', icon: '🎯' },
    { id: 'prompt-engineering', name: 'Prompt Engineering', icon: '✨' },
    { id: 'machine-learning', name: 'Machine Learning', icon: '🧠' },
    { id: 'ai-coding', name: 'AI Coding', icon: '💻' },
    { id: 'ai-automation', name: 'AI Automation', icon: '⚡' },
  ];

  const channels = [
    'AI Explained', 'Tech with Tim', 'Fireship', '3Blue1Brown', 'Lex Fridman',
    'Two Minute Papers', 'Sentdex', 'CodeEmporium', 'StatQuest', 'DeepLearningAI',
    'IBM Technology', 'Google AI', 'OpenAI', 'Microsoft AI', 'AWS Machine Learning',
    'AI Coffee Break', 'Yannic Kilcher', 'AI Epiphany', 'Machine Learning Street Talk'
  ];

  const titles = {
    ai: [
      'Introduction to Artificial Intelligence - Complete Guide',
      'AI Fundamentals: Everything You Need to Know',
      'Artificial Intelligence Explained in 10 Minutes',
      'The Future of AI: Trends and Predictions',
      'AI vs Machine Learning vs Deep Learning',
      'Building Your First AI Application',
      'AI Ethics and Responsible Development',
      'How AI is Transforming Industries',
      'AI for Beginners: Start Here',
      'Advanced AI Concepts Simplified',
      'AI Research Papers Explained',
      'Real-World AI Applications',
      'AI Development Best Practices',
    ],
    chatgpt: [
      'ChatGPT Complete Tutorial - Beginner to Advanced',
      'Master ChatGPT in 30 Minutes',
      'ChatGPT API Integration Guide',
      'Advanced ChatGPT Prompt Techniques',
      'Building Chatbots with ChatGPT',
      'ChatGPT for Developers',
      'ChatGPT vs Other AI Models',
      'Monetize Your Skills with ChatGPT',
      'ChatGPT Plugins Development',
      'ChatGPT Code Interpreter Tutorial',
      'ChatGPT for Content Creation',
      'ChatGPT Business Use Cases',
    ],
    watsonx: [
      'IBM WatsonX Complete Overview',
      'Getting Started with WatsonX.ai',
      'WatsonX for Enterprise AI',
      'Building AI Models with WatsonX',
      'WatsonX Data Platform Tutorial',
      'WatsonX Governance Explained',
      'Migrating to WatsonX',
      'WatsonX vs Other AI Platforms',
      'WatsonX Best Practices',
      'WatsonX Integration Guide',
    ],
    'ai-agents': [
      'AI Agents Explained: Complete Guide',
      'Building Autonomous AI Agents',
      'LangChain and AI Agents Tutorial',
      'Multi-Agent Systems Development',
      'AI Agents for Task Automation',
      'ReAct Pattern in AI Agents',
      'AI Agent Frameworks Comparison',
      'Deploying AI Agents in Production',
      'AI Agents with Memory',
      'Advanced AI Agent Architectures',
    ],
    'prompt-engineering': [
      'Prompt Engineering Masterclass',
      'Advanced Prompting Techniques',
      'Chain-of-Thought Prompting',
      'Few-Shot Learning with Prompts',
      'Prompt Optimization Strategies',
      'Prompt Engineering for Developers',
      'Creating Effective AI Prompts',
      'Prompt Templates and Patterns',
      'Debugging AI Prompts',
      'Prompt Engineering Best Practices',
    ],
    'machine-learning': [
      'Machine Learning Complete Course',
      'ML Algorithms Explained',
      'Supervised Learning Tutorial',
      'Unsupervised Learning Guide',
      'Neural Networks from Scratch',
      'Deep Learning Fundamentals',
      'Computer Vision with ML',
      'Natural Language Processing',
      'Reinforcement Learning Basics',
      'ML Model Deployment',
      'Feature Engineering Techniques',
      'ML Pipeline Development',
      'Hyperparameter Tuning Guide',
    ],
    'ai-coding': [
      'AI-Powered Coding with GitHub Copilot',
      'Building AI Code Assistants',
      'Code Generation with AI',
      'AI for Code Review',
      'Automated Testing with AI',
      'AI-Driven Development Workflow',
      'Code Completion Models',
      'AI Pair Programming',
      'Code Refactoring with AI',
      'AI Code Documentation',
    ],
    'ai-automation': [
      'AI Automation Complete Guide',
      'Workflow Automation with AI',
      'RPA and AI Integration',
      'AI for Business Process Automation',
      'Building AI Automation Pipelines',
      'AI-Powered Data Processing',
      'Automated Decision Making with AI',
      'AI Automation Tools Comparison',
      'Scaling AI Automation',
      'AI Automation Best Practices',
    ],
  };

  const videos = [];
  let videoId = 1;

  // Generate videos for each category
  categories.forEach((category, catIndex) => {
    const categoryTitles = titles[category.id] || titles.ai;
    const videosPerCategory = Math.ceil(100 / categories.length) + 5; // Ensure we get 100+

    for (let i = 0; i < videosPerCategory; i++) {
      const realVideoId = realAIVideoIds[videoId % realAIVideoIds.length];
      const titleIndex = i % categoryTitles.length;
      const channelIndex = (videoId + catIndex) % channels.length;
      
      const views = Math.floor(Math.random() * 5000000) + 10000;
      const likes = Math.floor(views * (Math.random() * 0.1 + 0.02));
      const comments = Math.floor(likes * (Math.random() * 0.3 + 0.1));
      
      const daysAgo = Math.floor(Math.random() * 365);
      const timestamp = daysAgo === 0 ? 'Today' :
                       daysAgo === 1 ? 'Yesterday' :
                       daysAgo < 7 ? `${daysAgo} days ago` :
                       daysAgo < 30 ? `${Math.floor(daysAgo / 7)} weeks ago` :
                       daysAgo < 365 ? `${Math.floor(daysAgo / 30)} months ago` :
                       `${Math.floor(daysAgo / 365)} years ago`;

      const minutes = Math.floor(Math.random() * 50) + 5;
      const seconds = Math.floor(Math.random() * 60);
      const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      videos.push({
        id: `video-${videoId}`,
        videoId: realVideoId,
        title: categoryTitles[titleIndex],
        channel: channels[channelIndex],
        channelTitle: channels[channelIndex],
        views: formatViewCount(views),
        viewCount: views.toString(),
        timestamp,
        publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        duration,
        thumbnail: `https://img.youtube.com/vi/${realVideoId}/hqdefault.jpg`,
        category: category.name,
        likeCount: likes.toString(),
        commentCount: comments.toString(),
        description: `Learn ${category.name} with this comprehensive tutorial. This video covers everything from basics to advanced concepts, perfect for beginners and experienced developers alike. 

Topics covered:
• Fundamental concepts and theory
• Practical examples and demonstrations  
• Real-world applications
• Best practices and tips
• Common pitfalls to avoid

Whether you're just starting out or looking to deepen your knowledge, this tutorial will help you master ${category.name}.

🔔 Subscribe for more AI and tech content!
💬 Leave a comment with your questions
👍 Like if you found this helpful

#${category.id} #AI #MachineLearning #Tutorial`,
      });

      videoId++;
    }
  });

  return videos;
};

// Helper function to format view count
const formatViewCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

// Generate and export the videos
export const mockVideos = generateMockVideos();

// Export by category for easy filtering
export const getVideosByCategory = (categoryId) => {
  if (categoryId === 'all') {
    return mockVideos;
  }
  return mockVideos.filter(video => 
    video.category.toLowerCase().replace(/\s+/g, '-') === categoryId
  );
};

// Export random videos
export const getRandomVideos = (count = 20) => {
  const shuffled = [...mockVideos].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Export video by ID
export const getVideoById = (videoId) => {
  return mockVideos.find(video => video.id === videoId || video.videoId === videoId);
};

console.log(`✅ Generated ${mockVideos.length} mock videos for demo`);

export default mockVideos;

// Made with Bob
