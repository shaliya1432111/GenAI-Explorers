import { useState, memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../services/authService';
import AIAssistant from './AIAssistant';

// Separate SearchBar component with local state to prevent focus loss
const SearchBar = memo(({ onSearchChange }) => {
  const [localSearch, setLocalSearch] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowRecentSearches(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToRecentSearches = (query) => {
    if (!query.trim()) return;
    
    let searches = [...recentSearches];
    // Remove if already exists
    searches = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    // Add to beginning
    searches.unshift(query);
    // Keep only last 10
    searches = searches.slice(0, 10);
    
    setRecentSearches(searches);
    localStorage.setItem('recentSearches', JSON.stringify(searches));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      saveToRecentSearches(localSearch);
      onSearchChange(localSearch);
      setShowRecentSearches(false);
    }
  };

  const handleSearchClick = () => {
    if (localSearch.trim()) {
      saveToRecentSearches(localSearch);
      onSearchChange(localSearch);
      setShowRecentSearches(false);
    }
  };

  const handleRecentSearchClick = (query) => {
    setLocalSearch(query);
    onSearchChange(query);
    setShowRecentSearches(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleVoiceSearch = () => {
    // Toggle voice search animation
    setIsListening(!isListening);
    
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setLocalSearch(transcript);
        onSearchChange(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice search is not supported in your browser. Please try Chrome or Edge.');
      setIsListening(false);
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-ai-blue/20 to-ai-purple/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative flex items-center">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onFocus={() => setShowRecentSearches(true)}
            placeholder="Search AI tutorials, courses, and more..."
            className="w-full px-6 py-3 pr-24 bg-white/90 border border-ai-blue/30 rounded-full text-black placeholder-gray-500 caret-black focus:outline-none focus:border-ai-cyan focus:shadow-ai-glow focus:bg-white transition-all duration-300"
          />
        
        {/* Microphone Icon */}
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`absolute right-14 p-2 rounded-full hover:bg-ai-blue/10 transition-all duration-300 ${
            isListening ? 'text-red-500 animate-pulse' : 'text-gray-600 hover:text-ai-blue'
          }`}
          title="Voice search"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>

        {/* Search Button */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="absolute right-2 p-2 bg-gradient-to-r from-ai-blue to-ai-cyan rounded-full hover:shadow-ai-glow hover:scale-110 transition-all duration-300"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>

    {/* Recent Searches Dropdown */}
    {showRecentSearches && recentSearches.length > 0 && (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-ai-blue/20 overflow-hidden z-50">
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Recent Searches</span>
          <button
            onClick={clearRecentSearches}
            className="text-xs text-ai-blue hover:text-ai-cyan transition-colors"
          >
            Clear All
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleRecentSearchClick(search)}
              className="w-full px-4 py-3 text-left hover:bg-ai-blue/5 transition-colors flex items-center space-x-3 group"
            >
              <svg className="w-4 h-4 text-gray-400 group-hover:text-ai-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700 group-hover:text-ai-blue transition-colors">{search}</span>
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
  );
});

SearchBar.displayName = 'SearchBar';

const Navbar = ({ onSearchChange }) => {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuth();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new_video',
      title: 'New AI Tutorial Available',
      message: 'Check out the latest video on Large Language Models',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You\'ve watched 10 videos this week',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      type: 'update',
      title: 'Platform Update',
      message: 'New AI Assistant features are now available',
      time: '2 hours ago',
      read: true
    }
  ]);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (userData?.displayName) {
      return userData.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return currentUser?.email?.[0]?.toUpperCase() || 'U';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const result = await signOutUser();
      if (result.success) {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-ai-darker border-b border-ai-blue/20 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo Section */}
        <div className="flex items-center space-x-4">
          <button className="lg:hidden text-ai-blue hover:text-ai-cyan transition-all duration-300 hover:scale-110 hover:rotate-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div
            onClick={() => navigate('/home')}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-ai-blue/20 blur-xl group-hover:bg-ai-cyan/30 transition-all duration-300"></div>
              <div className="relative bg-gradient-to-br from-ai-blue to-ai-purple p-2 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-ai-blue via-ai-purple to-ai-pink bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                GenAIExplorers
              </h1>
              <p className="text-xs text-ai-gray hidden sm:block group-hover:text-ai-cyan transition-colors duration-300">Explore the Future of AI</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <SearchBar onSearchChange={onSearchChange} />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAIAssistantOpen(true)}
            className="relative p-2 text-ai-blue hover:text-ai-cyan hover:bg-ai-card rounded-full transition-all duration-300 hover:scale-110 group"
            title="AI Assistant"
          >
            <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-ai-blue to-ai-cyan rounded-full animate-pulse"></span>
          </button>

          {/* Mobile Search Icon */}
          <button className="md:hidden text-ai-blue hover:text-ai-cyan transition-all duration-300 hover:scale-110 p-2 hover:bg-ai-card rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-ai-blue hover:text-ai-cyan hover:bg-ai-card rounded-full transition-all duration-300 hover:scale-110 group"
            >
              <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-ai-pink rounded-full animate-pulse shadow-lg shadow-ai-pink/50"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-ai-card/95 backdrop-blur-lg border border-ai-blue/30 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                {/* Header */}
                <div className="px-4 py-3 border-b border-ai-blue/20 flex items-center justify-between">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <button
                    onClick={() => {
                      setNotifications(notifications.map(n => ({ ...n, read: true })));
                    }}
                    className="text-xs text-ai-cyan hover:text-ai-blue transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>

                {/* Notifications List */}
                <div className="py-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 hover:bg-ai-blue/10 transition-colors cursor-pointer ${
                          !notification.read ? 'bg-ai-blue/5' : ''
                        }`}
                        onClick={() => {
                          setNotifications(notifications.map(n =>
                            n.id === notification.id ? { ...n, read: true } : n
                          ));
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            !notification.read ? 'bg-ai-pink' : 'bg-transparent'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm">{notification.title}</p>
                            <p className="text-ai-gray text-xs mt-1">{notification.message}</p>
                            <p className="text-ai-gray text-xs mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <svg className="w-12 h-12 mx-auto text-ai-gray mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-ai-gray text-sm">No notifications</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-ai-blue/20">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/notifications');
                    }}
                    className="w-full text-center text-ai-cyan hover:text-ai-blue text-sm transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative group">
            <button className="relative hover:scale-110 transition-transform duration-300">
              {userData?.photoURL ? (
                <img
                  src={userData.photoURL}
                  alt={userData.displayName || 'User'}
                  className="w-10 h-10 rounded-full object-cover hover:shadow-ai-glow transition-all duration-300 ring-2 ring-transparent group-hover:ring-ai-cyan"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ai-blue to-ai-purple flex items-center justify-center text-white font-bold hover:shadow-ai-glow transition-all duration-300 ring-2 ring-transparent group-hover:ring-ai-cyan">
                  {getUserInitials()}
                </div>
              )}
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-ai-darker animate-pulse"></div>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-ai-card/95 backdrop-blur-lg border border-ai-blue/30 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 -translate-y-2 z-50">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-ai-blue/20">
                <div className="flex items-center space-x-3">
                  {userData?.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt={userData.displayName || 'User'}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ai-blue to-ai-purple flex items-center justify-center text-white font-bold">
                      {getUserInitials()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {userData?.displayName || currentUser?.displayName || 'User'}
                    </p>
                    <p className="text-ai-gray text-xs truncate">
                      {userData?.email || currentUser?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                {/* My Profile */}
                <button
                  onClick={() => navigate('/profile')}
                  className="w-full px-4 py-2.5 text-left text-white hover:bg-gradient-to-r hover:from-ai-blue/20 hover:to-ai-purple/20 transition-all duration-300 flex items-center space-x-3 group/item"
                >
                  <svg className="w-5 h-5 text-ai-blue group-hover/item:text-ai-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300">My Profile</span>
                </button>

                {/* Settings */}
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full px-4 py-2.5 text-left text-white hover:bg-gradient-to-r hover:from-ai-blue/20 hover:to-ai-purple/20 transition-all duration-300 flex items-center space-x-3 group/item"
                >
                  <svg className="w-5 h-5 text-ai-blue group-hover/item:text-ai-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300">Settings</span>
                </button>

                {/* Watch History */}
                <button
                  onClick={() => navigate('/history')}
                  className="w-full px-4 py-2.5 text-left text-white hover:bg-gradient-to-r hover:from-ai-blue/20 hover:to-ai-purple/20 transition-all duration-300 flex items-center space-x-3 group/item"
                >
                  <svg className="w-5 h-5 text-ai-blue group-hover/item:text-ai-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300">Watch History</span>
                </button>

                {/* Divider */}
                <div className="my-2 border-t border-ai-blue/20"></div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center space-x-3 group/item"
                >
                  <svg className="w-5 h-5 group-hover/item:text-red-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="group-hover/item:translate-x-1 transition-transform duration-300">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    {/* AI Assistant Modal */}
    <AIAssistant
      isOpen={isAIAssistantOpen}
      onClose={() => setIsAIAssistantOpen(false)}
    />
    </>
  );
};

export default Navbar;

// Made with Bob
