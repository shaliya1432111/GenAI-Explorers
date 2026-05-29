import { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2, Trash2, BookOpen, Code, Map, MessageSquare, Video } from 'lucide-react';
import {
  askQuestion,
  summarizeVideo,
  explainConcept,
  generateRoadmap,
  generateInterviewQuestions,
  loadChatHistory,
  saveChatHistory,
  clearChatHistory
} from '../services/aiService';
import { trackAIQuery, trackAIPrompt } from '../services/analyticsService';

const AIAssistant = ({ isOpen, onClose, videoContext = null }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeature, setActiveFeature] = useState('chat');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Load chat history on mount
  useEffect(() => {
    const history = loadChatHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      // Welcome message
      setMessages([{
        role: 'assistant',
        content: '👋 Hello! I\'m your AI Assistant. I can help you with:\n\n• Answering GenAI questions\n• Summarizing YouTube videos\n• Explaining AI concepts\n• Creating learning roadmaps\n• Generating interview questions\n\nHow can I assist you today?',
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 1) {
      saveChatHistory(messages);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Handle video context
  useEffect(() => {
    if (videoContext && isOpen) {
      handleSummarizeVideo(videoContext);
    }
  }, [videoContext, isOpen]);

  const addMessage = (role, content) => {
    const newMessage = {
      role,
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('user', userMessage);
    setIsLoading(true);

    // Track AI query
    trackAIQuery();

    try {
      let response;
      
      // Prepare conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      console.log('🎯 Sending message with feature:', activeFeature);

      switch (activeFeature) {
        case 'explain':
          trackAIPrompt('explain');
          response = await explainConcept(userMessage);
          break;
        case 'roadmap':
          trackAIPrompt('roadmap');
          response = await generateRoadmap(userMessage, 'intermediate');
          break;
        case 'interview':
          trackAIPrompt('interview');
          response = await generateInterviewQuestions(userMessage, 'intermediate');
          break;
        default:
          response = await askQuestion(userMessage, conversationHistory);
      }

      console.log('📨 Received response:', {
        success: response.success,
        mock: response.mock,
        hasMessage: !!response.message,
        messageLength: response.message?.length,
        model: response.model
      });

      if (response.success || response.message) {
        addMessage('assistant', response.message);
      } else {
        addMessage('assistant', response.message || `❌ Error: ${response.error}\n\nPlease try again or rephrase your question.`);
      }
    } catch (error) {
      console.error('❌ Unexpected error in handleSendMessage:', error);
      addMessage('assistant', `❌ An unexpected error occurred: ${error.message}\n\nPlease check the console for more details.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarizeVideo = async (video) => {
    setIsLoading(true);
    addMessage('user', `Summarize this video: "${video.title}"`);

    // Track AI query and prompt
    trackAIQuery();
    trackAIPrompt('summarize');

    try {
      const response = await summarizeVideo(video.title, video.description || 'AI/GenAI educational content');
      
      console.log('📹 Video summary response:', {
        success: response.success,
        mock: response.mock,
        hasMessage: !!response.message,
        model: response.model
      });
      
      if (response.success || response.message) {
        addMessage('assistant', response.message);
      } else {
        addMessage('assistant', response.message || `❌ Error: ${response.error}`);
      }
    } catch (error) {
      console.error('❌ Video summarization error:', error);
      addMessage('assistant', `❌ Failed to summarize video: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      clearChatHistory();
      setMessages([{
        role: 'assistant',
        content: '👋 Chat cleared! How can I help you today?',
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const features = [
    { id: 'chat', icon: MessageSquare, label: 'Chat', color: 'from-ai-blue to-ai-cyan' },
    { id: 'explain', icon: BookOpen, label: 'Explain', color: 'from-ai-purple to-ai-pink' },
    { id: 'roadmap', icon: Map, label: 'Roadmap', color: 'from-ai-cyan to-ai-blue' },
    { id: 'interview', icon: Code, label: 'Interview', color: 'from-ai-pink to-ai-purple' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[90vh] mx-4 bg-ai-card border border-ai-blue/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 border-b border-ai-blue/30">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-ai-blue/30 blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-ai-blue to-ai-purple p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Assistant</h2>
              <p className="text-xs text-ai-gray">Your GenAI Learning Companion</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClearChat}
              className="p-2 text-ai-gray hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
              title="Clear chat"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-ai-gray hover:text-white hover:bg-ai-blue/20 rounded-lg transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Selector */}
        <div className="flex items-center space-x-2 px-6 py-3 bg-ai-darker/50 border-b border-ai-blue/20 overflow-x-auto">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                  activeFeature === feature.id
                    ? `bg-gradient-to-r ${feature.color} text-white shadow-lg`
                    : 'bg-ai-card/50 text-ai-gray hover:text-white hover:bg-ai-card'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{feature.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white'
                    : 'bg-ai-darker/80 text-white border border-ai-blue/20'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-4 h-4 text-ai-cyan" />
                    <span className="text-xs text-ai-cyan font-semibold">AI Assistant</span>
                  </div>
                )}
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
                <div className="text-xs text-ai-gray/60 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-ai-darker/80 border border-ai-blue/20 rounded-2xl px-4 py-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-ai-cyan animate-spin" />
                  <span className="text-sm text-ai-gray">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 bg-ai-darker/50 border-t border-ai-blue/30">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Ask about ${activeFeature === 'chat' ? 'anything' : activeFeature}...`}
                className="w-full px-4 py-3 bg-ai-card border border-ai-blue/30 rounded-xl text-white placeholder-ai-gray focus:outline-none focus:border-ai-cyan focus:shadow-ai-glow resize-none transition-all duration-300"
                rows="2"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-ai-blue to-ai-cyan rounded-xl hover:shadow-ai-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Send className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
          <p className="text-xs text-ai-gray mt-2 text-center">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

// Made with Bob
