import { useNavigate } from 'react-router-dom';
import { categories, quickLinks, subscriptions } from '../services/youtubeApi';

const Sidebar = ({ selectedCategory, onCategorySelect, selectedQuickLink, onQuickLinkSelect }) => {
  const navigate = useNavigate();

  const handleChannelClick = (channelName) => {
    navigate(`/channel/${encodeURIComponent(channelName)}`);
  };
  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-ai-darker border-r border-ai-blue/20 overflow-y-auto hidden lg:block z-40 pointer-events-auto">
      <div className="p-4 space-y-2 relative z-50 pointer-events-auto">
        {/* Categories Header */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-ai-gray uppercase tracking-wider mb-4 flex items-center">
            <span className="mr-2">📚</span>
            Categories
          </h2>
        </div>

        {/* Category List */}
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 border border-ai-blue/50 shadow-ai-glow'
                  : 'hover:bg-ai-card border border-transparent'
              }`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </span>
              <span
                className={`font-medium transition-colors duration-300 ${
                  selectedCategory === category.id
                    ? 'text-ai-blue'
                    : 'text-gray-300 group-hover:text-white'
                }`}
              >
                {category.name}
              </span>
              {selectedCategory === category.id && (
                <div className="ml-auto w-2 h-2 bg-ai-blue rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-ai-blue/20"></div>

        {/* Quick Links */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-ai-gray uppercase tracking-wider mb-4 flex items-center">
            <span className="mr-2">⚡</span>
            Quick Links
          </h3>
          
          {quickLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onQuickLinkSelect(link.filter)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                selectedQuickLink === link.filter
                  ? 'bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 border border-ai-blue/50'
                  : 'hover:bg-ai-card border border-transparent'
              }`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                {link.icon}
              </span>
              <span className={`font-medium transition-colors duration-300 ${
                selectedQuickLink === link.filter
                  ? 'text-ai-blue'
                  : 'text-gray-300 group-hover:text-white'
              }`}>
                {link.name}
              </span>
              {selectedQuickLink === link.filter && (
                <div className="ml-auto w-2 h-2 bg-ai-blue rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-ai-blue/20"></div>

        {/* Subscriptions */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-ai-gray uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center">
              <span className="mr-2">⭐</span>
              Subscriptions
            </span>
            <button
              onClick={() => navigate('/subscriptions')}
              className="text-xs text-ai-blue hover:text-ai-cyan transition-colors duration-300"
            >
              View All
            </button>
          </h3>
          
          {subscriptions.map((sub) => (
            <button
              key={sub.id}
              onClick={() => navigate('/subscriptions')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-ai-card transition-all duration-300 group border border-transparent"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ai-blue to-ai-purple flex items-center justify-center text-white text-xs font-bold group-hover:shadow-ai-glow transition-all duration-300">
                {sub.icon}
              </div>
              <span className="text-gray-300 group-hover:text-white font-medium transition-colors duration-300 text-sm">
                {sub.name}
              </span>
            </button>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-ai-blue/20">
          <div className="px-4 space-y-2 text-xs text-ai-gray">
            <p className="flex items-center space-x-2">
              <span>🚀</span>
              <span>Powered by GenAI</span>
            </p>
            <p className="flex items-center space-x-2">
              <span>💡</span>
              <span>Learn. Explore. Innovate.</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

// Made with Bob
