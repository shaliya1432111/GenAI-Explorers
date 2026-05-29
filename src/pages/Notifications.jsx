import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, Settings } from 'lucide-react';

const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'new_video',
      title: 'New AI Tutorial Available',
      message: 'Check out the latest video on Large Language Models and their applications in real-world scenarios.',
      time: '5 minutes ago',
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      read: false,
      icon: '🎥'
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You\'ve watched 10 videos this week. Keep up the great learning momentum!',
      time: '1 hour ago',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: false,
      icon: '🏆'
    },
    {
      id: 3,
      type: 'update',
      title: 'Platform Update',
      message: 'New AI Assistant features are now available. Try asking complex questions!',
      time: '2 hours ago',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: '✨'
    },
    {
      id: 4,
      type: 'recommendation',
      title: 'Recommended for You',
      message: 'Based on your watch history, we think you\'ll love "Advanced Neural Networks"',
      time: '3 hours ago',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: '💡'
    },
    {
      id: 5,
      type: 'new_video',
      title: 'New Course Added',
      message: 'Introduction to Generative AI - A comprehensive course for beginners',
      time: '1 day ago',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: '📚'
    },
    {
      id: 6,
      type: 'achievement',
      title: 'Milestone Reached',
      message: 'Congratulations! You\'ve completed 5 courses this month',
      time: '2 days ago',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      icon: '🎯'
    }
  ]);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleDelete = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'new_video':
        return 'from-ai-blue to-ai-cyan';
      case 'achievement':
        return 'from-ai-purple to-ai-pink';
      case 'update':
        return 'from-ai-cyan to-ai-blue';
      case 'recommendation':
        return 'from-ai-pink to-ai-purple';
      default:
        return 'from-ai-blue to-ai-purple';
    }
  };

  return (
    <div className="min-h-screen bg-ai-darker pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-ai-cyan hover:text-ai-blue transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-ai-blue/20 blur-xl"></div>
                <div className="relative bg-gradient-to-br from-ai-blue to-ai-purple p-3 rounded-xl">
                  <Bell className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Notifications</h1>
                <p className="text-ai-gray mt-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center space-x-2 px-4 py-2 bg-ai-card border border-ai-blue/20 rounded-lg hover:bg-ai-blue/10 transition-all text-white"
                >
                  <Check className="w-5 h-5" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Clear all</span>
                </button>
              )}
              <button
                className="p-2 bg-ai-card border border-ai-blue/20 rounded-lg hover:bg-ai-blue/10 transition-all text-white"
                title="Notification settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'read', label: 'Read', count: notifications.length - unreadCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white shadow-ai-glow'
                  : 'bg-ai-card text-ai-gray hover:text-white hover:bg-ai-hover'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-ai-card border rounded-xl p-4 transition-all duration-300 hover:border-ai-cyan group ${
                  !notification.read ? 'border-ai-blue/50 bg-ai-blue/5' : 'border-ai-blue/20'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center text-2xl shadow-lg`}>
                    {notification.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-white font-semibold">{notification.title}</h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-ai-pink rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-ai-gray text-sm mb-2">{notification.message}</p>
                        <p className="text-ai-gray text-xs">{notification.time}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-ai-cyan hover:text-ai-blue hover:bg-ai-blue/10 rounded-lg transition-all"
                            title="Mark as read"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-ai-blue to-ai-purple rounded-full flex items-center justify-center">
              <Bell className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-ai-gray mb-6">
              {filter === 'unread' 
                ? 'All caught up! No unread notifications.' 
                : filter === 'read'
                ? 'No read notifications yet.'
                : 'You don\'t have any notifications yet.'}
            </p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-gradient-to-r from-ai-blue to-ai-cyan text-white rounded-lg hover:shadow-ai-glow transition-all duration-300"
            >
              Explore Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;

// Made with Bob