import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmail, signUpWithEmail, validateEmail, validatePassword, validatePhoneNumber } from '../services/authService';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      if (!password) {
        setError('Please enter your password');
        setIsLoading(false);
        return;
      }

      // Attempt login
      const result = await signInWithEmail(email, password, rememberMe);

      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate inputs
      if (!fullName.trim()) {
        setError('Please enter your full name');
        setIsLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message);
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
        setError('Please enter a valid phone number');
        setIsLoading(false);
        return;
      }

      // Attempt signup
      const result = await signUpWithEmail(email, password, fullName, phoneNumber);

      if (result.success) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/home'), 1000);
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle guest login
  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const guestEmail = 'guest@genaiexplorers.com';
      const guestPassword = 'guest123';
      
      let result = await signInWithEmail(guestEmail, guestPassword);
      
      if (!result.success) {
        result = await signUpWithEmail(guestEmail, guestPassword, 'Guest User', '');
      }
      
      if (result.success) {
        navigate('/home');
      } else {
        setError('Unable to login as guest. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Guest login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ai-darker text-white flex items-center justify-center px-4 py-8">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-ai-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ai-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="bg-gradient-to-br from-ai-blue to-ai-purple p-3 rounded-xl">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-1-9h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-ai-blue via-ai-purple to-ai-pink bg-clip-text text-transparent">
              GenAIExplorers
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-ai-gray">
            {isLogin ? 'Sign in to continue your AI journey' : 'Join thousands of AI enthusiasts'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-ai-card/50 backdrop-blur-sm border border-ai-blue/20 rounded-2xl p-8 shadow-2xl">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Toggle Login/Signup */}
          <div className="flex mb-6 bg-ai-darker/50 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-medium transition-all duration-300 ${
                isLogin
                  ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white'
                  : 'text-ai-gray hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-medium transition-all duration-300 ${
                !isLogin
                  ? 'bg-gradient-to-r from-ai-blue to-ai-cyan text-white'
                  : 'text-ai-gray hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ai-gray mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white placeholder-ai-gray focus:outline-none focus:border-ai-cyan transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ai-gray mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white placeholder-ai-gray focus:outline-none focus:border-ai-cyan transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-ai-blue/30 bg-ai-darker text-ai-cyan focus:ring-ai-cyan"
                  />
                  <span className="text-sm text-ai-gray">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-ai-cyan hover:text-ai-blue transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-ai-blue to-ai-cyan rounded-lg text-white font-semibold hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            // Signup Form
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ai-gray mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white placeholder-ai-gray focus:outline-none focus:border-ai-cyan transition-colors"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ai-gray mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white placeholder-ai-gray focus:outline-none focus:border-ai-cyan transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ai-gray mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white placeholder-ai-gray focus:outline-none focus:border-ai-cyan transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ai-gray mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white placeholder-ai-gray focus:outline-none focus:border-ai-cyan transition-colors"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-ai-gray mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ai-gray mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-ai-darker border border-ai-blue/30 rounded-lg text-white placeholder-ai-gray focus:outline-none focus:border-ai-cyan transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-ai-blue to-ai-cyan rounded-lg text-white font-semibold hover:shadow-ai-glow transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ai-blue/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-ai-card text-ai-gray">Or continue as</span>
            </div>
          </div>

          {/* Guest Login */}
          <button
            onClick={handleGuestLogin}
            disabled={isLoading}
            className="w-full py-3 border-2 border-ai-blue/50 rounded-lg text-white font-semibold hover:bg-ai-blue/10 hover:border-ai-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as Guest
          </button>

          {/* Back to Landing */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-ai-cyan hover:text-ai-blue transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-ai-card/30 border border-ai-blue/20 rounded-lg">
          <p className="text-sm text-ai-gray text-center mb-2">
            <span className="font-semibold text-white">Demo Credentials:</span>
          </p>
          <p className="text-xs text-ai-gray text-center">
            Email: guest@genaiexplorers.com | Password: guest123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

// Made with Bob