import { useCallback, useState, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages for better initial load performance
const Landing = lazy(() => import('./pages/Landing'));
const Auth = lazy(() => import('./pages/Auth'));
const Home = lazy(() => import('./pages/Home'));
const Channel = lazy(() => import('./pages/Channel'));
const VideoPlayer = lazy(() => import('./pages/VideoPlayer'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));
const History = lazy(() => import('./pages/History'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-ai-darker flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ai-cyan mb-4"></div>
      <p className="text-white text-lg">Loading page...</p>
    </div>
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-ai-darker flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ai-cyan mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};


function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();

  // Memoized search handler to prevent Navbar re-renders
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="min-h-screen bg-ai-darker">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ai-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ai-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-ai-pink/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />

          {/* Main App Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearchChange={handleSearchChange} />
                  <Home searchQuery={searchQuery} />
                </>
              </ProtectedRoute>
            }
          />

          {/* Redirect /dashboard to /home for backward compatibility */}
          <Route
            path="/dashboard"
            element={<Navigate to="/home" replace />}
          />

          <Route
            path="/channel/:channelName"
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearchChange={handleSearchChange} />
                  <Channel />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/video/:videoId"
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearchChange={handleSearchChange} />
                  <VideoPlayer />
                </>
              </ProtectedRoute>
            }
          />

          {/* Profile, Settings, History Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearchChange={handleSearchChange} />
                  <Profile />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearchChange={handleSearchChange} />
                  <Settings />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearchChange={handleSearchChange} />
                  <History />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearchChange={handleSearchChange} />
                  <Notifications />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute>
                <>
                  <Navbar onSearchChange={handleSearchChange} />
                  <Subscriptions />
                </>
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home or landing */}
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />}
          />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

// Made with Bob
