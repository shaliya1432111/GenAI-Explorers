// ICA (IBM Consulting Advantage) AI Service Integration

const ICA_API_KEY = import.meta.env.VITE_ICA_API_KEY;
const ICA_API_URL = import.meta.env.VITE_ICA_API_URL || 'https://api.ibm.com/consulting-advantage/v1';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_ICA === 'true';

// Log configuration on load
console.log('🔧 ICA Configuration:', {
  hasApiKey: !!ICA_API_KEY,
  apiKeyPrefix: ICA_API_KEY ? ICA_API_KEY.substring(0, 8) + '...' : 'none',
  apiUrl: ICA_API_URL,
  useMock: USE_MOCK
});

// Mock responses for testing/fallback
const getMockResponse = (type, context = '') => {
  const responses = {
    chat: "I'm your AI assistant powered by IBM Consulting Advantage. I can help answer questions about GenAI topics, explain concepts, and guide your learning journey!",
    video: `Here's a summary of the video:\n\n• Main topic: ${context || 'AI and Machine Learning'}\n• Key points covered\n• Important concepts explained\n• Practical applications\n\nThis video provides valuable insights into AI/GenAI concepts.`,
    concept: `Let me explain this concept:\n\n**${context || 'This concept'}** is an important topic in AI.\n\n**Key Points:**\n• Fundamental principles and theory\n• Practical applications in real-world scenarios\n• Best practices and implementation strategies\n• Common challenges and solutions\n\n**Why it matters:**\nUnderstanding this concept is crucial for building effective AI systems.`,
    roadmap: `Here's a comprehensive learning roadmap for ${context || 'GenAI'}:\n\n**Phase 1: Foundations (2-4 weeks)**\n• Basic concepts and terminology\n• Core principles and theory\n• Essential tools and frameworks\n\n**Phase 2: Intermediate (4-8 weeks)**\n• Advanced topics and techniques\n• Hands-on projects and exercises\n• Real-world case studies\n\n**Phase 3: Advanced (8-12 weeks)**\n• Specialization areas\n• Production deployment\n• Best practices and optimization\n\n**Phase 4: Mastery (Ongoing)**\n• Research and innovation\n• Community contribution\n• Continuous learning`,
    interview: `Interview Questions for ${context || 'GenAI'}:\n\n**Fundamental Questions:**\n1. What are the key concepts and how do they work?\n2. Explain the architecture and components\n3. What are the main use cases and applications?\n\n**Technical Questions:**\n4. How would you implement this in production?\n5. What are the performance considerations?\n6. Describe the challenges and solutions\n\n**Advanced Questions:**\n7. How does this compare to alternative approaches?\n8. What are the latest developments in this area?\n9. How would you optimize for scale?\n10. Explain best practices and common pitfalls`
  };
  
  return responses[type] || responses.chat;
};

// Make API request to ICA - Using Vite proxy to avoid CORS
const makeICARequest = async (endpoint, payload) => {
  if (USE_MOCK) {
    console.log('🔧 Using mock ICA responses (VITE_USE_MOCK_ICA=true)');
    await new Promise(resolve => setTimeout(resolve, 800));
    return null;
  }

  if (!ICA_API_KEY || ICA_API_KEY === 'demo_ica_api_key_placeholder') {
    console.warn('⚠️ ICA API key not configured. Using mock responses.');
    return null;
  }

  // Use Vite proxy to avoid CORS issues
  const proxyEndpoint = '/ica-api';
  
  try {
    console.log(`🚀 Sending request to ICA API via proxy: ${proxyEndpoint}`);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(proxyEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ICA_API_KEY}`,
        'X-API-Key': ICA_API_KEY,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log(`📡 Response status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ ICA API response received:', data);
      return data;
    } else {
      const errorText = await response.text();
      console.error(`❌ ICA API error:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      return null;
    }
  } catch (error) {
    console.error(`❌ ICA API request failed:`, error.message);
    return null;
  }
};


// Ask a general question
export const askQuestion = async (question, conversationHistory = []) => {
  try {
    console.log('💬 Processing question:', question);
    
    // Send request to ICA API via proxy
    const response = await makeICARequest('/chat/completions', {
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant specializing in Generative AI, Machine Learning, and AI technologies. Provide clear, accurate, and educational responses.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    // Parse response
    if (response) {
      let content = null;
      
      // Try different response formats
      if (response.choices && response.choices[0]) {
        content = response.choices[0].message?.content || response.choices[0].text;
      } else if (response.text) {
        content = response.text;
      } else if (response.response) {
        content = response.response;
      } else if (response.completion) {
        content = response.completion;
      } else if (response.output) {
        content = response.output;
      } else if (response.generated_text) {
        content = response.generated_text;
      }

      if (content) {
        console.log('✅ Successfully got AI response from ICA');
        return {
          success: true,
          message: content,
          model: response.model || 'ICA',
          mock: false
        };
      }
    }

    // Fallback to mock
    console.log('⚠️ Using mock response as fallback');
    return {
      success: true,
      message: getMockResponse('chat', question),
      mock: true
    };
  } catch (error) {
    console.error('❌ Error in askQuestion:', error);
    return {
      success: true,
      message: getMockResponse('chat', question),
      mock: true
    };
  }
};

// Summarize a video
export const summarizeVideo = async (videoTitle, videoDescription = '') => {
  try {
    const prompt = `Summarize this educational video about AI/GenAI:\n\nTitle: ${videoTitle}\nDescription: ${videoDescription}\n\nProvide a concise summary with key points, main topics covered, and learning outcomes.`;
    
    const response = await makeICARequest('/chat/completions', {
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that creates concise, informative summaries of educational videos about AI and technology.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 800
    });

    if (response) {
      let content = null;
      if (response.choices && response.choices[0]) {
        content = response.choices[0].message?.content || response.choices[0].text;
      } else if (response.text || response.response || response.completion || response.output || response.generated_text) {
        content = response.text || response.response || response.completion || response.output || response.generated_text;
      }

      if (content) {
        return {
          success: true,
          message: content,
          model: response.model || 'ICA',
          mock: false
        };
      }
    }

    return {
      success: true,
      message: getMockResponse('video', videoTitle),
      mock: true
    };
  } catch (error) {
    console.error('Error in summarizeVideo:', error);
    return {
      success: true,
      message: getMockResponse('video', videoTitle),
      mock: true
    };
  }
};

// Explain a concept
export const explainConcept = async (concept) => {
  try {
    const prompt = `Explain the following AI/GenAI concept in detail:\n\n${concept}\n\nInclude:\n- Clear definition\n- Key principles\n- Practical applications\n- Why it matters\n- Examples`;
    
    const response = await makeICARequest('/chat/completions', {
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI educator who explains complex AI concepts in clear, accessible language with practical examples.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 1200
    });

    if (response) {
      let content = null;
      if (response.choices && response.choices[0]) {
        content = response.choices[0].message?.content || response.choices[0].text;
      } else if (response.text || response.response || response.completion || response.output || response.generated_text) {
        content = response.text || response.response || response.completion || response.output || response.generated_text;
      }

      if (content) {
        return {
          success: true,
          message: content,
          model: response.model || 'ICA',
          mock: false
        };
      }
    }

    return {
      success: true,
      message: getMockResponse('concept', concept),
      mock: true
    };
  } catch (error) {
    console.error('Error in explainConcept:', error);
    return {
      success: true,
      message: getMockResponse('concept', concept),
      mock: true
    };
  }
};

// Generate learning roadmap
export const generateRoadmap = async (topic, level = 'beginner') => {
  try {
    const prompt = `Create a comprehensive learning roadmap for: ${topic}\n\nLevel: ${level}\n\nInclude:\n- Phase-by-phase breakdown\n- Time estimates\n- Key topics and skills\n- Resources and projects\n- Milestones`;
    
    const response = await makeICARequest('/chat/completions', {
      messages: [
        {
          role: 'system',
          content: 'You are a learning path designer who creates structured, actionable roadmaps for AI/GenAI education.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    if (response) {
      let content = null;
      if (response.choices && response.choices[0]) {
        content = response.choices[0].message?.content || response.choices[0].text;
      } else if (response.text || response.response || response.completion || response.output || response.generated_text) {
        content = response.text || response.response || response.completion || response.output || response.generated_text;
      }

      if (content) {
        return {
          success: true,
          message: content,
          model: response.model || 'ICA',
          mock: false
        };
      }
    }

    return {
      success: true,
      message: getMockResponse('roadmap', topic),
      mock: true
    };
  } catch (error) {
    console.error('Error in generateRoadmap:', error);
    return {
      success: true,
      message: getMockResponse('roadmap', topic),
      mock: true
    };
  }
};

// Generate interview questions
export const generateInterviewQuestions = async (topic, level = 'intermediate') => {
  try {
    const prompt = `Generate comprehensive interview questions for: ${topic}\n\nLevel: ${level}\n\nInclude:\n- Fundamental questions\n- Technical questions\n- Scenario-based questions\n- Advanced questions\n- Best practices questions`;
    
    const response = await makeICARequest('/chat/completions', {
      messages: [
        {
          role: 'system',
          content: 'You are an interview preparation expert who creates relevant, challenging questions for AI/GenAI roles.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    if (response) {
      let content = null;
      if (response.choices && response.choices[0]) {
        content = response.choices[0].message?.content || response.choices[0].text;
      } else if (response.text || response.response || response.completion || response.output || response.generated_text) {
        content = response.text || response.response || response.completion || response.output || response.generated_text;
      }

      if (content) {
        return {
          success: true,
          message: content,
          model: response.model || 'ICA',
          mock: false
        };
      }
    }

    return {
      success: true,
      message: getMockResponse('interview', topic),
      mock: true
    };
  } catch (error) {
    console.error('Error in generateInterviewQuestions:', error);
    return {
      success: true,
      message: getMockResponse('interview', topic),
      mock: true
    };
  }
};

// Chat history management
const CHAT_HISTORY_KEY = 'ai_chat_history';

export const loadChatHistory = () => {
  try {
    const history = localStorage.getItem(CHAT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

export const saveChatHistory = (messages) => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

export const clearChatHistory = () => {
  try {
    localStorage.removeItem(CHAT_HISTORY_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return { success: false, error: error.message };
  }
};

// Made with Bob
