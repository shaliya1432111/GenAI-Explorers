// Simple localStorage-based authentication service
// Replaces Firebase authentication

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return {
    isValid: password.length >= 6,
    message: password.length >= 6 ? '' : 'Password must be at least 6 characters'
  };
};

// Phone number validation
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

// Sign up with email
export const signUpWithEmail = async (email, password, fullName, phoneNumber = '') => {
  try {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      return { success: false, error: 'Email already registered' };
    }

    // Create user
    const user = {
      uid: Date.now().toString(),
      email,
      displayName: fullName,
      phoneNumber,
      photoURL: null,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    // Save user
    users[email] = { ...user, password }; // In real app, hash password
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('authUser', JSON.stringify(user));

    // Dispatch auth state change event
    window.dispatchEvent(new Event('authStateChanged'));

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with email
export const signInWithEmail = async (email, password, rememberMe = false) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];

    if (!user || user.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }

    // Update last active
    user.lastActive = new Date().toISOString();
    users[email] = user;
    localStorage.setItem('users', JSON.stringify(users));

    // Store auth user (without password)
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('authUser', JSON.stringify(userWithoutPassword));

    // Dispatch auth state change event
    window.dispatchEvent(new Event('authStateChanged'));

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sign in with Google (mock)
export const signInWithGoogle = async () => {
  return {
    success: false,
    error: 'Google sign-in is not available in this version. Please use email/password.'
  };
};

// Sign out
export const signOutUser = async () => {
  try {
    localStorage.removeItem('authUser');
    
    // Dispatch auth state change event
    window.dispatchEvent(new Event('authStateChanged'));
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send password reset (mock)
export const sendPasswordReset = async (email) => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (!users[email]) {
      return { success: false, error: 'No account found with this email' };
    }

    return {
      success: true,
      message: 'Password reset functionality is not available in this version. Please contact support.'
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
};

// Get user data
export const getUserData = async (uid) => {
  try {
    const user = getCurrentUser();
    if (user && user.uid === uid) {
      return { success: true, data: user };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (updates) => {
  try {
    const user = getCurrentUser();
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    // Update user data
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('authUser', JSON.stringify(updatedUser));

    // Dispatch auth state change event
    window.dispatchEvent(new Event('authStateChanged'));

    // Update in users list
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[user.email]) {
      users[user.email] = { ...users[user.email], ...updates };
      localStorage.setItem('users', JSON.stringify(users));
    }

    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Auth state change listener (mock)
export const onAuthStateChange = (callback) => {
  // Call immediately with current user
  const user = getCurrentUser();
  callback(user);

  // Return unsubscribe function
  return () => {};
};

// Made with Bob
