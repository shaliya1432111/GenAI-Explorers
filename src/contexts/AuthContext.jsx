// Authentication Context - Simple localStorage-based auth
import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, getCurrentUser, getUserData } from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check and update auth state
  const checkAuthState = async () => {
    try {
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
        const result = await getUserData(user.uid);
        if (result.success) {
          setUserData(result.data);
        } else {
          setUserData(user);
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
    } catch (err) {
      console.error('Auth state check error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial auth check
    checkAuthState();

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = (e) => {
      if (e.key === 'authUser') {
        checkAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom auth events (for same-tab updates)
    const handleAuthChange = () => {
      checkAuthState();
    };

    window.addEventListener('authStateChanged', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  // Refresh user data
  const refreshUserData = async () => {
    const user = getCurrentUser();
    if (user) {
      const result = await getUserData(user.uid);
      if (result.success) {
        setUserData(result.data);
      }
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    error,
    isAuthenticated: !!currentUser,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-ai-darker flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-ai-cyan mb-4"></div>
            <p className="text-white text-xl font-semibold">Loading GenAIExplorers...</p>
            <p className="text-ai-gray text-sm mt-2">Initializing your AI learning experience</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// Made with Bob